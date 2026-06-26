"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { ProductCard } from "@/components/ui/ProductCard";
import { productCategories } from "@/data/products";
import type { Product } from "@/types";
import { cn } from "@/lib/utils";

type Category = (typeof productCategories)[number];
const PAGE = 9;

export function ProductsExplorer({
  initial,
  initialNext,
  total: initialTotal,
}: {
  initial: Product[];
  initialNext: number | null;
  total: number;
}) {
  const [filter, setFilter] = useState<Category>("All");
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [items, setItems] = useState<Product[]>(initial);
  const [next, setNext] = useState<number | null>(initialNext);
  const [total, setTotal] = useState(initialTotal);
  const [loading, setLoading] = useState(false);

  const sentinel = useRef<HTMLDivElement>(null);
  // Identifies the active query so out-of-order responses are ignored.
  const reqId = useRef(0);
  const firstRun = useRef(true);

  // debounce the search box
  useEffect(() => {
    const t = setTimeout(() => setDebounced(query.trim()), 300);
    return () => clearTimeout(t);
  }, [query]);

  const fetchPage = useCallback(
    async (offset: number, replace: boolean) => {
      const mine = ++reqId.current;
      setLoading(true);
      try {
        const params = new URLSearchParams({ offset: String(offset), take: String(PAGE) });
        if (filter !== "All") params.set("category", filter);
        if (debounced) params.set("q", debounced);
        const res = await fetch(`/api/products?${params.toString()}`);
        const data: { items: Product[]; total: number; nextOffset: number | null } = await res.json();
        if (mine !== reqId.current) return; // stale
        setItems((prev) => (replace ? data.items : [...prev, ...data.items]));
        setNext(data.nextOffset);
        setTotal(data.total);
      } catch {
        /* keep current items */
      } finally {
        if (mine === reqId.current) setLoading(false);
      }
    },
    [filter, debounced]
  );

  // Re-query from the top whenever filter/search changes (skip the very first mount,
  // which is already server-rendered).
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    fetchPage(0, true);
  }, [filter, debounced, fetchPage]);

  // Infinite scroll
  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && next !== null && !loading) fetchPage(next, false);
      },
      { rootMargin: "400px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [next, loading, fetchPage]);

  return (
    <Section className="bg-white">
      <div className="mx-auto max-w-frame px-6 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-5 border-b border-line pb-8">
          {/* Search */}
          <div className="relative w-full max-w-md">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search templates, kits, plugins…"
              className="w-full rounded-full border border-line bg-white py-3 pl-11 pr-4 text-[15px] text-ink outline-none transition-colors focus:border-accent"
            />
          </div>
          {/* Categories */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            {productCategories.map((c) => {
              const active = filter === c;
              return (
                <button
                  key={c}
                  onClick={() => setFilter(c)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300 sm:px-5 sm:py-2.5",
                    active ? "border-accent bg-accent text-white" : "border-ink/15 text-secondary hover:border-ink hover:text-ink"
                  )}
                >
                  {c}
                </button>
              );
            })}
            <span className="ml-auto hidden text-sm text-secondary sm:block">{total} items</span>
          </div>
        </div>

        {items.length === 0 && !loading ? (
          <p className="mt-16 text-center text-secondary">
            No products match{debounced ? ` “${debounced}”` : ""}. Try a different search or category.
          </p>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((p, i) => (
              <ProductCard key={`${p.slug}-${i}`} product={p} priority={i < 3} />
            ))}
          </div>
        )}

        {/* sentinel + loader */}
        <div ref={sentinel} className="h-10" />
        {loading && (
          <div className="mt-6 flex justify-center text-secondary">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        )}
      </div>
    </Section>
  );
}
