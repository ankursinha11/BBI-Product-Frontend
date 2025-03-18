"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Space_Grotesk } from "next/font/google";
import { Sidebar } from "../../components/sidebar";
import { LoginModal } from "@/components/LoginModal";
import type React from "react"; // Added import for React
import { getCookie } from "cookies-next";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = getCookie('access_token');
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoginModalOpen(true);
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setIsLoginModalOpen(false);
  };

  if (!isLoggedIn) {
    return (
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => router.push("/")}
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  return (
    <div
      className={`${spaceGrotesk.variable} flex min-h-screen bg-gradient-to-br from-[#000B2E] via-[#001959] to-[#000B2E]`}
    >
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
