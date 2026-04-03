import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AuthProvider } from "@/context/AuthContext";
import "@/styles/index.css";

export const metadata: Metadata = {
  title: "Trippa",
  description: "Explore tourist attractions in Singapore.",
  icons: {
    icon: "/Frame.png",
    shortcut: "/Frame.png",
    apple: "/Frame.png",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
