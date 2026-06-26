import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthForm } from "@/components/auth/AuthForm";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({ title: "Login", description: "Log in to your CodeWins account.", path: "/login" });

export default function LoginPage() {
  return (
    <section className="flex min-h-screen items-center justify-center bg-white px-6 pb-section pt-[150px] md:pt-[170px]">
      <Suspense fallback={null}>
        <AuthForm mode="login" />
      </Suspense>
    </section>
  );
}
