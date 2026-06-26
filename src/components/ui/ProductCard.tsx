"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, Eye, ShoppingCart } from "lucide-react";
import { MaskReveal } from "@/components/anim/MaskReveal";
import type { Product } from "@/types";
import { cn } from "@/lib/utils";

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={cn("h-3.5 w-3.5", i < Math.round(rating) ? "fill-accent text-accent" : "text-line")} />
      ))}
    </span>
  );
}

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const off = Math.round((1 - product.price / product.original) * 100);

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-card-lg border border-line bg-white transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-30px_rgba(0,0,0,0.22)]">
      <Link href={`/products/${product.slug}`} className="relative block">
        <MaskReveal className="aspect-[16/11]">
          <Image src={product.image} alt={product.title} fill priority={priority} sizes="(max-width:768px) 100vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-carbon/45 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <span className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-500 group-hover:opacity-100">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-ink">
              <Eye className="h-4 w-4" /> Live Preview
            </span>
          </span>
        </MaskReveal>
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-ink backdrop-blur">{product.category}</span>
        {off > 0 && (
          <span className="absolute right-4 top-4 rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-white">-{off}%</span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between text-xs text-secondary">
          <Stars rating={product.rating} />
          <span>{product.sales} sales</span>
        </div>
        <Link href={`/products/${product.slug}`}>
          <h3 className="mt-3 font-display text-lg font-semibold leading-snug text-ink transition-colors duration-300 group-hover:text-accent">{product.title}</h3>
        </Link>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {product.tags.slice(0, 3).map((t) => (
            <span key={t} className="rounded-full bg-surface px-2.5 py-1 text-[11px] font-medium text-secondary">{t}</span>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 pt-6">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-xl font-bold text-ink">₹{product.price}</span>
            <span className="text-sm text-secondary line-through">₹{product.original}</span>
          </div>
          <Link href={`/products/${product.slug}`} className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors duration-300 hover:bg-accent-dark">
            <ShoppingCart className="h-4 w-4" /> Buy
          </Link>
        </div>
      </div>
    </div>
  );
}
