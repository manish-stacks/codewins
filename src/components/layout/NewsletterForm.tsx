"use client";

import { useState } from "react";
import { Loader2, Check } from "lucide-react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit() {
    if (state === "loading") return;
    setState("loading");
    setMessage("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "footer" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not subscribe.");
      setState("done");
      setEmail("");
      setMessage("You’re subscribed — thanks!");
    } catch (e) {
      setState("error");
      setMessage((e as Error).message);
    }
  }

  return (
    <div>
      <div className="mt-5 flex max-w-md flex-col gap-3 sm:flex-row">
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (state !== "idle") setState("idle");
          }}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="you@email.com"
          aria-label="Email address"
          className="w-full rounded-full border border-white/15 bg-white/[0.04] px-5 py-3.5 text-[15px] text-white outline-none transition-colors placeholder:text-white/40 focus:border-accent"
        />
        <button
          onClick={submit}
          disabled={state === "loading"}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-[15px] font-medium text-white transition-colors hover:bg-accent-dark disabled:opacity-60"
        >
          {state === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : state === "done" ? <Check className="h-4 w-4" /> : null}
          Subscribe
        </button>
      </div>
      {message && (
        <p className={`mt-2.5 text-sm ${state === "error" ? "text-accent" : "text-white/70"}`}>{message}</p>
      )}
    </div>
  );
}
