import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
import { RepositoryAnalysis, FileWithContent } from "../../../lib/types";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { analysis } = await request.json();

    if (!analysis) {
      return NextResponse.json(
        { error: "Analysis data is required" },
        { status: 400 }
      );
    }

    // Generate README from repo
    const readme = await generateReadmeWithGemini(analysis);

    return NextResponse.json({ readme });
  } catch (error) {
    console.error("Generate README error:", error);
    return NextResponse.json(
      { error: "Failed to generate README" },
      { status: 500 }
    );
  }
}

/**
 * Summarize one file with Gemini
 */
async function summarizeFile(
  file: FileWithContent,
  model: GenerativeModel
): Promise<string> {
  if (!file.content) return `- ${file.name}: (empty file)`;

  const prompt = `
You are a senior developer. Summarize this file for documentation purposes.

Focus on:
- Purpose of the file
- Key functions/classes/components
- If it's config, note what it configures
- If it's server/API code, extract endpoints
- Tech/framework hints

File: ${file.name}
Content:
\`\`\`
${file.content}
\`\`\`
  `;

  try {
    const result = await model.generateContent(prompt);
    return `- ${file.name}: ${result.response.text()}`;
  } catch (err) {
    console.error("File summary error:", file.name, err);
    return `- ${file.name}: (failed to analyze)`;
  }
}

/**
 * Summarize all files in repo
 */
async function analyzeRepo(files: FileWithContent[]): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const summaries: string[] = [];
  for (const file of files) {
    summaries.push(await summarizeFile(file, model));
  }
  return summaries.join("\n");
}

/**
 * Generate README using Gemini
 */
async function generateReadmeWithGemini(
  analysis: RepositoryAnalysis
): Promise<string> {
  const { name, description, language, topics, files } = analysis;
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const repoSummary = await analyzeRepo(files || []);

  const prompt = `
You are an expert technical writer. Generate a **unique, professional README.md**.

Project Info:
- Name: ${name || "Untitled Project"}
- Description: ${description || "No description provided"}
- Primary Language: ${language || "Unknown"}
- Topics: ${topics?.length ? topics.join(", ") : "Not specified"}

Repository Analysis:
${repoSummary}

Instructions:
1. Write a clear project title + description.
2. Extract **real features** from the summarized codebase.
3. List technologies and dependencies (from package.json, requirements.txt, Dockerfile, etc.).
4. Add **installation & usage** instructions tailored to detected stack.
5. Document **API endpoints** if any are detected.
6. Show project structure with explanations of major files/folders.
7. Add deployment steps (Docker, Vercel, etc. if relevant).
8. Suggest badges (license, build, npm, etc.).
9. Output must be pure Markdown — no extra text.

Final Output: A professional README.md
`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error: unknown) {
    console.error("Gemini API error:", error);
    return generateBasicReadme(analysis); // fallback
  }
}

/**
 * Fallback README generator (uses file hints if Gemini fails)
 */
function generateBasicReadme(analysis: RepositoryAnalysis): string {
  const { name, description, language, topics, files } = analysis;

  let readme = `# ${name || "Project"}\n\n${description || ""}\n\n`;

  readme += `## Features\n\n- Written in ${language || "various languages"}\n`;
  if (topics?.length) readme += `- Topics: ${topics.join(", ")}\n`;
  if (files?.some((f) => f.name === "Dockerfile"))
    readme += `- Dockerized setup supported\n`;
  if (files?.some((f) => f.name.includes("api") || f.name.includes("route")))
    readme += `- Provides API endpoints\n`;

  readme += `\n## Project Structure\n\n\`\`\`\n`;
  files?.forEach((file) => {
    readme += `${file.name}\n`;
  });
  readme += `\`\`\`\n\n`;

  if (files?.some((f) => f.name === "package.json")) {
    readme += `## Installation\n\n\`\`\`bash\nnpm install\nnpm run dev\n\`\`\`\n\n`;
  }
  if (files?.some((f) => f.name === "requirements.txt")) {
    readme += `## Installation\n\n\`\`\`bash\npip install -r requirements.txt\npython app.py\n\`\`\`\n\n`;
  }
  if (files?.some((f) => f.name === "Dockerfile")) {
    readme += `## Docker\n\n\`\`\`bash\ndocker build -t ${
      name?.toLowerCase() || "app"
    } .\ndocker run -p 3000:3000 ${name?.toLowerCase() || "app"}\n\`\`\`\n\n`;
  }

  readme += `## License\n\nMIT License.\n`;

  return readme;
}
