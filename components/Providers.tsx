"use client";

import { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "../lib/store";
import { setAuthData } from "../features/auth/authSlice";

function AuthInitializer() {
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;
    const token = localStorage.getItem("token") || "";
    const githubAccessToken = localStorage.getItem("githubAccessToken") || "";

    if (isLoggedIn && user) {
      store.dispatch(
        setAuthData({ isLoggedIn, user, token, githubAccessToken })
      );
    }
  }, []);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthInitializer />
      {children}
    </Provider>
  );
}
