import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "light";

interface BaseProps {
  children: ReactNode;
  variant?: Variant;
  className?: string;
  withIcon?: boolean;
  disabled?: boolean;
}
type ButtonProps =
  | (BaseProps & { href: string; onClick?: never; type?: never })
  | (BaseProps & { href?: never; onClick?: () => void; type?: "button" | "submit" });

function styles(variant: Variant) {
  const base =
    "group inline-flex items-center justify-center gap-2.5 rounded-full px-7 py-3.5 text-[15px] font-medium tracking-tight transition-all duration-300 ease-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none";
  const map: Record<Variant, string> = {
    primary: "bg-accent text-white hover:bg-accent-dark",
    outline: "border border-ink/20 text-ink hover:border-ink hover:bg-ink hover:text-white",
    light: "bg-white text-ink hover:bg-white/90",
  };
  return cn(base, map[variant]);
}

export function Button(props: ButtonProps) {
  const { children, variant = "primary", className, withIcon = true } = props;
  const cls = cn(styles(variant), className);
  const icon = withIcon && (
    <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-smooth group-hover:translate-x-1" />
  );
  if ("href" in props && props.href) {
    return (
      <Link href={props.href} className={cls}>
        {children}
        {icon}
      </Link>
    );
  }
  return (
    <button type={props.type ?? "button"} onClick={props.onClick} disabled={props.disabled} className={cls}>
      {children}
      {icon}
    </button>
  );
}
