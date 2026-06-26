"use client";

import { useEffect } from "react";

export function useLockBody(locked: boolean): void {
  useEffect(() => {
    document.body.style.overflow = locked ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [locked]);
}
