import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Container({
  children,
  className,
  as: Tag = "div",
  wide = false,
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  wide?: boolean;
}) {
  return (
    <Tag className={cn("mx-auto w-full px-6 sm:px-8 lg:px-12", wide ? "max-w-frame" : "max-w-content", className)}>
      {children}
    </Tag>
  );
}
