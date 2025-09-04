// GitHub API Response Types
export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  topics: string[];
  updated_at: string;
  created_at: string;
  private: boolean;
  fork: boolean;
  stargazers_count: number;
  default_branch: string;
}

export interface GitHubFile {
  name: string;
  path: string;
  type: "file" | "dir";
  url: string;
}

export interface GitHubUser {
  id: number;
  login: string;
  email: string | null;
  name: string | null;
  avatar_url: string;
}

export interface GitHubEmail {
  email: string;
  primary: boolean;
  verified: boolean;
}

// Analysis Types
export interface RepositoryAnalysis {
  name: string;
  description: string | null;
  language: string | null;
  topics: string[];
  files: FileWithContent[];
  aiAnalysis: string;
  readme: string;
  stars?: number;
  updatedAt?: string;
}

export interface FileWithContent {
  name: string;
  path: string;
  content: string;
}

// API Request/Response Types
export interface AnalyzeRepoRequest {
  owner: string;
  repo: string;
}

export interface GenerateReadmeRequest {
  analysis: RepositoryAnalysis;
}

// MongoDB Types
export interface MongoDBConnection {
  conn: typeof import("mongoose") | null;
  promise: Promise<typeof import("mongoose")> | null;
}

export interface GlobalWithMongoose {
  mongoose: MongoDBConnection;
}
