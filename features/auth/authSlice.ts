import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
  id: string;
  email: string;
  githubUsername: string;
}

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  token: string;
  githubAccessToken: string;
  loading: boolean;
  error: string;
}

const initialState: AuthState = {
  isLoggedIn: false,
  user: null,
  token: "",
  githubAccessToken: "",
  loading: false,
  error: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthData: (
      state,
      action: PayloadAction<{
        isLoggedIn: boolean;
        user: User;
        token: string;
        githubAccessToken: string;
      }>
    ) => {
      state.isLoggedIn = action.payload.isLoggedIn;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.githubAccessToken = action.payload.githubAccessToken;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      state.token = "";
      state.githubAccessToken = "";
      state.error = "";
    },
  },
});

export const { setAuthData, setLoading, setError, logout } = authSlice.actions;
export default authSlice.reducer;
