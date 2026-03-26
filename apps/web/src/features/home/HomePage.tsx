"use client";

import { useEffect, useState } from "react";
import { HealthCard } from "../../components/HealthCard";
import { getApiBaseUrl, getHealth } from "../../lib/api";
import Link from "next/link";

type Status = "idle" | "loading" | "success" | "error";

export function HomePage() {
  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState("Checking backend health...");

  useEffect(() => {
    let active = true;

    async function loadHealth() {
      try {
        const response = await getHealth();

        if (!active) {
          return;
        }

        setStatus("success");
        setMessage(`API responded with status "${response.status}"`);
      } catch (error) {
        if (!active) {
          return;
        }

        setStatus("error");
        setMessage(
          error instanceof Error
            ? error.message
            : "Unable to reach the backend. Check apps/api/.env and apps/web/.env."
        );
      }
    }

    void loadHealth();

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="flex flex-1 flex-col justify-center">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <section className="space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
            ITCamp Group 4 baseline
          </p>
          <h1 className="max-w-2xl text-5xl font-bold tracking-tight sm:text-6xl">
            React and Node.js are ready to build on.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-slate-600">
            The page below verifies that the React app can reach the Express API
            through the configured environment variables.
          </p>
        </section>
        <HealthCard
          status={status}
          message={message}
          apiBaseUrl={getApiBaseUrl()}
        />

        {/* import Link from 'next/link'; // Inside your component */}
        <Link href="/location" className="text-blue-500 hover:underline">
          Go to Singapore Locations
        </Link>
      </div>
    </main>
  );
}
