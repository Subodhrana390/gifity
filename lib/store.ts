import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import analysisReducer from "../features/analysis/analysisSlice";
import repositoriesReducer from "../features/repositories/repositoriesSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    analysis: analysisReducer,
    repositories: repositoriesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
