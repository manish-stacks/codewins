"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";

// Fetches a fresh short-lived signed URL on click, then starts the download.
// No durable file URL ever lives in the page, so it can't be copied/shared.
export function DownloadButton({ itemId }: { itemId: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function start() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/download/token/${itemId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not start download");
      window.location.href = data.url;
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={start}
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-dark disabled:opacity-60"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />} Download
      </button>
      {error && <span className="text-xs text-accent">{error}</span>}
    </div>
  );
}
