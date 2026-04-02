"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingRecovery, setCheckingRecovery] = useState(true);
  const [isRecoveryReady, setIsRecoveryReady] = useState(false);

  useEffect(() => {
    let isActive = true;

    const markRecoveryReady = () => {
      if (!isActive) {
        return;
      }

      setError("");
      setIsRecoveryReady(true);
      setCheckingRecovery(false);
    };

    const markRecoveryInvalid = () => {
      if (!isActive) {
        return;
      }

      setIsRecoveryReady(false);
      setCheckingRecovery(false);
      setError(
        "This reset link is invalid or expired. Please request a new password reset email.",
      );
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isActive) {
        return;
      }

      if (event === "PASSWORD_RECOVERY" || session) {
        markRecoveryReady();
      }
    });

    async function initializeRecoverySession() {
      try {
        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");

        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);

          if (error) {
            markRecoveryInvalid();
            return;
          }

          markRecoveryReady();
          return;
        }

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          markRecoveryReady();
          return;
        }

        markRecoveryInvalid();
      } catch {
        markRecoveryInvalid();
      }
    }

    initializeRecoverySession();

    return () => {
      isActive = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleResetPassword = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!isRecoveryReady) {
      setError(
        "Your reset session is missing. Please open a fresh reset link from your email.",
      );
      return;
    }

    if (!password || !confirmPassword) {
      setError("Please fill in both password fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccessMessage("Password updated successfully. Redirecting to login...");

    setTimeout(() => {
      router.push("/login?reset=success");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex items-center justify-center py-20 px-4">
        <div className="bg-white rounded-lg shadow-md w-full max-w-sm p-8">
          <h1 className="text-center text-lg font-semibold text-gray-800 mb-6">
            Set New Password
          </h1>

          {checkingRecovery && (
            <p className="text-gray-500 text-sm mb-4 text-center">
              Verifying reset link...
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

          <form onSubmit={handleResetPassword} className="space-y-4">
            <input
              type="password"
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            />

            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            />

            <button
              type="submit"
              disabled={loading || checkingRecovery || !isRecoveryReady}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium py-2 rounded transition-colors"
            >
              {loading ? "Updating password…" : "Update password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}