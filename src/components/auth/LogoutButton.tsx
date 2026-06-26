"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function LogoutButton({ className }: { className?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function logout() {
    setLoading(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={logout}
      disabled={loading}
      className={className ?? "inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-secondary transition-colors hover:border-ink hover:text-ink disabled:opacity-60"}
    >
      <LogOut className="h-4 w-4" /> {loading ? "Logging out…" : "Log out"}
    </button>
  );
}
