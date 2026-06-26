"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isRegister = mode === "register";
  const field =
    "w-full rounded-2xl border border-line bg-white px-5 py-4 text-[15px] text-ink outline-none transition-colors duration-300 placeholder:text-secondary/70 focus:border-accent";
  const label = "mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-secondary";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const payload = isRegister
      ? {
          name: String(fd.get("name") || ""),
          email: String(fd.get("email") || ""),
          phone: String(fd.get("phone") || ""),
          password: String(fd.get("password") || ""),
        }
      : { email: String(fd.get("email") || ""), password: String(fd.get("password") || "") };

    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      const dest = next || (data.role === "ADMIN" ? "/admin" : "/dashboard");
      router.push(dest);
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-card-lg border border-line bg-surface p-8 lg:p-10">
      <h1 className="font-display text-3xl font-bold text-ink">
        {isRegister ? "Create your account" : "Welcome back"}
      </h1>
      <p className="mt-2 text-[15px] text-secondary">
        {isRegister
          ? "Sign up to track orders and download your purchases."
          : "Log in to your CodeWins account."}
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        {isRegister && (
          <div>
            <label className={label} htmlFor="name">Name</label>
            <input id="name" name="name" required className={field} placeholder="Your name" />
          </div>
        )}
        <div>
          <label className={label} htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required className={field} placeholder="you@email.com" />
        </div>
        {isRegister && (
          <div>
            <label className={label} htmlFor="phone">Phone (optional)</label>
            <input id="phone" name="phone" className={field} placeholder="+91 ..." />
          </div>
        )}
        <div>
          <label className={label} htmlFor="password">Password</label>
          <input id="password" name="password" type="password" required minLength={6} className={field} placeholder="••••••••" />
        </div>

        {error && <p className="text-sm text-accent">{error}</p>}

        <Button type="submit" disabled={loading} className="w-full" withIcon={false}>
          {loading ? "Please wait…" : isRegister ? "Create account" : "Log in"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-secondary">
        {isRegister ? (
          <>Already have an account?{" "}
            <Link href="/login" className="font-medium text-accent hover:underline">Log in</Link>
          </>
        ) : (
          <>New here?{" "}
            <Link href="/register" className="font-medium text-accent hover:underline">Create an account</Link>
          </>
        )}
      </p>
    </div>
  );
}
