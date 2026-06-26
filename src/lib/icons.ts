import { Code2, Smartphone, Megaphone, Server, Palette, Search, type LucideIcon } from "lucide-react";
import type { ServiceIconKey } from "@/types";

export const serviceIcons: Record<ServiceIconKey, LucideIcon> = {
  code: Code2,
  smartphone: Smartphone,
  megaphone: Megaphone,
  server: Server,
  palette: Palette,
  search: Search,
};
