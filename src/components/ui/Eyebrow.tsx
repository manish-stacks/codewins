import { cn } from "@/lib/utils";

export function Eyebrow({
  children,
  light = false,
  className,
}: {
  children: React.ReactNode;
  light?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.2em]",
        light ? "text-white/70" : "text-accent",
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rotate-45", light ? "bg-white/70" : "bg-accent")} />
      {children}
    </span>
  );
}
