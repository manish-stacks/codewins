"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** Hides the marketing Header/Footer on app routes (/dashboard, /admin). */
export function ConditionalChrome({
  header,
  footer,
  children,
}: {
  header: ReactNode;
  footer: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const isApp = pathname.startsWith("/dashboard") || pathname.startsWith("/admin");

  if (isApp) return <>{children}</>;

  return (
    <>
      {header}
      <main>{children}</main>
      {footer}
    </>
  );
}
