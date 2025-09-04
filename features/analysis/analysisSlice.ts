import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface RepoAnalysis {
  name: string;
  description: string;
  language: string;
  topics: string[];
  files: any[];
  readme: string;
}

interface AnalysisState {
  repoUrl: string;
  analysis: RepoAnalysis | null;
  generatedReadme: string;
  loading: boolean;
  error: string;
}

const initialState: AnalysisState = {
  repoUrl: "",
  analysis: null,
  generatedReadme: "",
  loading: false,
  error: "",
};

const analysisSlice = createSlice({
  name: "analysis",
  initialState,
  reducers: {
    setRepoUrl: (state, action: PayloadAction<string>) => {
      state.repoUrl = action.payload;
    },
    setAnalysis: (state, action: PayloadAction<RepoAnalysis | null>) => {
      state.analysis = action.payload;
    },
    setGeneratedReadme: (state, action: PayloadAction<string>) => {
      state.generatedReadme = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    clearAnalysis: (state) => {
      state.analysis = null;
      state.generatedReadme = "";
      state.error = "";
    },
  },
});

export const {
  setRepoUrl,
  setAnalysis,
  setGeneratedReadme,
  setLoading,
  setError,
  clearAnalysis,
} = analysisSlice.actions;
export default analysisSlice.reducer;
