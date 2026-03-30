"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams(); // 2. Moved to TOP LEVEL

  const [mode, setMode] = useState<"login" | "reset">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // 3. Get the returnTo value here so it's ready when the form submits
  const returnTo = searchParams.get("returnTo") || "/";
  const resetSuccess = searchParams.get("reset") === "success";

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false); // Make sure to stop loading on error
    } else {
      // 4. Now this variable is safely accessible and correct
      router.push(returnTo);
    }
  };

  const handleResetRequest = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!email.trim()) {
      setError("Please enter your email address first.");
      return;
    }

    setLoading(true);

    const redirectTo =
      typeof window !== "undefined"
        ? `${window.location.origin}/reset-password`
        : undefined;

    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo,
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccessMessage(
        "Reset link sent. Check your email and open the link to set a new password.",
      );
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex items-center justify-center py-20 px-4">
        <div className="bg-white rounded-lg shadow-md w-full max-w-sm p-8">
          <h1 className="text-center text-lg font-semibold text-gray-800 mb-6">
            {mode === "login" ? "Login Form" : "Reset Password"}
          </h1>

          {resetSuccess && mode === "login" && (
            <p className="text-green-600 text-sm mb-4 text-center">
              Password updated. You can sign in with your new password now.
            </p>
          )}

          {successMessage && (
            <p className="text-green-600 text-sm mb-4 text-center">
              {successMessage}
            </p>
          )}

          {error && (
            <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
          )}

          <form
            onSubmit={mode === "login" ? handleLogin : handleResetRequest}
            className="space-y-4"
          >
            {/* Email field */}
            <div className="relative">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm pr-10 focus:outline-none focus:border-blue-500"
              />
              <span className="absolute right-3 top-2.5 text-gray-400">
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  viewBox="0 0 24 24"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </span>
            </div>

            {mode === "login" && (
              <div>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm pr-10 focus:outline-none focus:border-blue-500"
                  />
                  <span className="absolute right-3 top-2.5 text-gray-400">
                    <svg
                      width="16"
                      height="16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      viewBox="0 0 24 24"
                    >
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </span>
                </div>
                <div className="text-right mt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setMode("reset");
                      setError("");
                      setSuccessMessage("");
                    }}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    Forgot Password?
                  </button>
                </div>
              </div>
            )}

            {mode === "reset" && (
              <div className="text-right -mt-2">
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setError("");
                    setSuccessMessage("");
                  }}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Back to login
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium py-2 rounded transition-colors"
            >
              {loading
                ? mode === "login"
                  ? "Logging in…"
                  : "Sending link…"
                : mode === "login"
                  ? "Login"
                  : "Send reset link"}
            </button>
          </form>

          {mode === "login" ? (
            <p className="text-center text-xs text-gray-500 mt-4">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="text-blue-600 hover:underline font-medium"
              >
                Register
              </Link>
            </p>
          ) : (
            <p className="text-center text-xs text-gray-500 mt-4">
              Enter the email linked to your account and we&apos;ll send you a
              reset link.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
