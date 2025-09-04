import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  language: string;
  updated_at: string;
  created_at: string;
  private: boolean;
  fork: boolean;
  stargazers_count: number;
}

interface RepositoriesState {
  repositories: Repository[];
  loading: boolean;
  error: string;
}

const initialState: RepositoriesState = {
  repositories: [],
  loading: false,
  error: "",
};

const repositoriesSlice = createSlice({
  name: "repositories",
  initialState,
  reducers: {
    setRepositories: (state, action: PayloadAction<Repository[]>) => {
      state.repositories = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    clearRepositories: (state) => {
      state.repositories = [];
      state.error = "";
    },
  },
});

export const { setRepositories, setLoading, setError, clearRepositories } =
  repositoriesSlice.actions;
export default repositoriesSlice.reducer;
