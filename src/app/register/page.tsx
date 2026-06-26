import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthForm } from "@/components/auth/AuthForm";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({ title: "Sign Up", description: "Create your CodeWins account.", path: "/register" });

export default function RegisterPage() {
  return (
    <section className="flex min-h-screen items-center justify-center bg-white px-6 pb-section pt-[150px] md:pt-[170px]">
      <Suspense fallback={null}>
        <AuthForm mode="register" />
      </Suspense>
    </section>
  );
}
