import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import jwt from "jsonwebtoken";
import connectToDatabase from "../../../lib/mongodb";
import User from "../../../models/User";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  GitHubRepository,
  GitHubFile,
  FileWithContent,
} from "../../../lib/types";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST(request: NextRequest) {
  try {
    const { owner, repo } = await request.json();

    if (!owner || !repo) {
      return NextResponse.json(
        { error: "Owner and repo are required" },
        { status: 400 }
      );
    }

    // Authenticate user
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    await connectToDatabase();
    const user = await User.findById(decoded.userId);

    if (!user || !user.githubAccessToken) {
      return NextResponse.json(
        { error: "GitHub not connected" },
        { status: 400 }
      );
    }

    // Fetch repository information
    const repoResponse = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}`,
      {
        headers: {
          Authorization: `token ${user.githubAccessToken}`,
        },
      }
    );
    const repoData = repoResponse.data;

    // Fetch repository contents (files)
    const contentsResponse = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/contents`,
      {
        headers: {
          Authorization: `token ${user.githubAccessToken}`,
        },
        params: {
          ref: repoData.default_branch || "main",
        },
      }
    );
    const contents = contentsResponse.data;

    // Filter for key files
    const keyFiles = contents.filter((item: GitHubFile) => {
      const keyFileNames = [
        "package.json",
        "README.md",
        "requirements.txt",
        "setup.py",
        "Dockerfile",
        "docker-compose.yml",
        ".gitignore",
        "LICENSE",
        "CONTRIBUTING.md",
        "CHANGELOG.md",
      ];
      return (
        item.type === "file" &&
        (keyFileNames.includes(item.name.toLowerCase()) ||
          item.name.endsWith(".md") ||
          item.name.endsWith(".json") ||
          item.name.endsWith(".yml") ||
          item.name.endsWith(".yaml"))
      );
    });

    // Fetch content of key files
    const filesWithContent = await Promise.all(
      keyFiles.slice(0, 10).map(async (file: GitHubFile) => {
        try {
          const fileResponse = await axios.get(file.url);
          return {
            name: file.name,
            path: file.path,
            content: Buffer.from(fileResponse.data.content, "base64").toString(
              "utf-8"
            ),
          };
        } catch {
          return {
            name: file.name,
            path: file.path,
            content: "Could not fetch content",
          };
        }
      })
    );

    // Generate AI-powered analysis
    const aiAnalysis = await generateAIAnalysis(repoData, filesWithContent);

    const analysis = {
      name: repoData.name,
      description: repoData.description,
      language: repoData.language,
      topics: repoData.topics || [],
      files: filesWithContent,
      aiAnalysis,
      readme: "",
      stars: repoData.stargazers_count,
      updatedAt: repoData.updated_at,
    };

    return NextResponse.json(analysis);
  } catch (error: unknown) {
    console.error("Analyze repo error:", error);
    if (
      error instanceof Error &&
      "response" in error &&
      error.response &&
      typeof error.response === "object" &&
      "status" in error.response &&
      error.response.status === 404
    ) {
      return NextResponse.json(
        { error: "Repository not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Failed to analyze repository" },
      { status: 500 }
    );
  }
}

async function generateAIAnalysis(
  repoData: GitHubRepository,
  files: FileWithContent[]
): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const fileContents = files
    .map(
      (file) =>
        `File: ${file.name}\nContent:\n${file.content.substring(0, 1000)}`
    )
    .join("\n\n");

  const prompt = `
Analyze the following GitHub repository based on the provided information and key files. Provide a comprehensive analysis including:

1. Project Overview: What does this project do?
2. Technology Stack: What technologies and frameworks are used?
3. Architecture: How is the project structured?
4. Key Features: What are the main features?
5. Code Quality: Any observations about code organization and best practices?
6. Potential Improvements: Suggestions for enhancement

Repository Name: ${repoData.name}
Description: ${repoData.description || "No description"}
Primary Language: ${repoData.language}
Topics: ${repoData.topics?.join(", ") || "None"}

Key Files:
${fileContents}

Please provide a detailed, professional analysis.
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch {
    console.error("Gemini API error in analysis");
    return "AI analysis could not be generated at this time.";
  }
}
