import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import jwt from "jsonwebtoken";
import connectToDatabase from "../../../../lib/mongodb";
import User from "../../../../models/User";
import { GitHubEmail, GitHubUser } from "../../../../lib/types";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || "";
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET || "";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json({ error: "Code is required" }, { status: 400 });
    }

    // Exchange code for access token
    const tokenResponse = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code,
      },
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    const accessToken = tokenResponse.data.access_token;
    if (!accessToken) {
      return NextResponse.json(
        { error: "Failed to get access token from GitHub" },
        { status: 400 }
      );
    }

    // Get user info from GitHub
    const userResponse = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `token ${accessToken}`,
      },
    });

    const githubUser: GitHubUser = userResponse.data;

    // If email is not present, fetch user emails and get primary verified email
    if (!githubUser.email) {
      const emailsResponse = await axios.get(
        "https://api.github.com/user/emails",
        {
          headers: {
            Authorization: `token ${accessToken}`,
          },
        }
      );
      const emails = emailsResponse.data;
      const primaryEmailObj = emails.find(
        (emailObj: GitHubEmail) => emailObj.primary && emailObj.verified
      );
      if (primaryEmailObj) {
        githubUser.email = primaryEmailObj.email;
      }
    }

    await connectToDatabase();

    // Find or create user in DB
    let user = await User.findOne({ githubId: githubUser.id.toString() });
    if (!user) {
      user = new User({
        email: githubUser.email || "",
        githubAccessToken: accessToken,
        githubUsername: githubUser.login,
        githubId: githubUser.id.toString(),
      });
    } else {
      user.githubAccessToken = accessToken;
      user.githubUsername = githubUser.login;
    }
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Redirect or respond with token and user info
    // For simplicity, respond with JSON here
    return NextResponse.json({
      message: "GitHub login successful",
      token,
      githubAccessToken: accessToken,
      user: {
        id: user._id,
        email: user.email,
        githubUsername: user.githubUsername,
      },
    });
  } catch (error) {
    console.error("GitHub OAuth error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
