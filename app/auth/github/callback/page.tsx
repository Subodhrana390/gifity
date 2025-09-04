"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { setAuthData } from "../../../../features/auth/authSlice";

function GitHubCallback() {
  const [status, setStatus] = useState("Processing GitHub login...");
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get("code");

      if (!code) {
        setStatus("Error: No authorization code received from GitHub");
        return;
      }

      try {
        // Call the backend GitHub OAuth endpoint
        const response = await fetch(`/api/auth/github?code=${code}`);
        const data = await response.json();

        if (response.ok) {
          // Store token and user info in localStorage
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("user", JSON.stringify(data.user));
          localStorage.setItem("token", data.token);
          localStorage.setItem("githubConnected", "true");
          localStorage.setItem("githubAccessToken", data.githubAccessToken);

          setStatus("Login successful! Redirecting to repositories...");
          // Dispatch auth data to Redux store
          dispatch(
            setAuthData({
              isLoggedIn: true,
              user: data.user,
              token: data.token,
              githubAccessToken: data.githubAccessToken,
            })
          );
          // Redirect to repositories page
          setTimeout(() => {
            router.push("/repositories");
          }, 2000);
        } else {
          setStatus(
            `Error: ${data.error || "Failed to authenticate with GitHub"}`
          );
        }
      } catch (error) {
        console.error("GitHub callback error:", error);
        setStatus("Error: Failed to process GitHub login");
      }
    };

    handleCallback();
  }, [searchParams, router, dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
        <p className="text-lg">{status}</p>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
            <p className="text-lg">Loading...</p>
          </div>
        </div>
      }
    >
      <GitHubCallback />
    </Suspense>
  );
}
