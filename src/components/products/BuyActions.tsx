"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Eye, Check } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";

interface BuyProduct {
  id?: string;
  slug: string;
  title: string;
  image: string;
  price: number;
  demoUrl?: string | null;
}

export function BuyActions({ product }: { product: BuyProduct }) {
  const { add } = useCart();
  const router = useRouter();
  const [added, setAdded] = useState(false);

  const available = Boolean(product.id);
  const item = {
    productId: product.id || "",
    slug: product.slug,
    title: product.title,
    image: product.image,
    price: product.price,
  };

  function buyNow() {
    if (!available) return;
    add(item);
    router.push("/checkout");
  }

  function addToCart() {
    if (!available) return;
    add(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
      <button
        onClick={buyNow}
        disabled={!available}
        className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-[15px] font-medium text-white transition-colors duration-300 hover:bg-accent-dark disabled:opacity-50"
      >
        <ShoppingCart className="h-4 w-4" /> Buy Now
      </button>
      <button
        onClick={addToCart}
        disabled={!available}
        className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-ink/15 px-6 py-3.5 text-[15px] font-medium text-ink transition-colors duration-300 hover:bg-ink hover:text-white disabled:opacity-50"
      >
        {added ? <><Check className="h-4 w-4" /> Added</> : <><ShoppingCart className="h-4 w-4" /> Add to Cart</>}
      </button>
      {product.demoUrl && (
        <a
          href={product.demoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-line px-6 py-3.5 text-[15px] font-medium text-secondary transition-colors duration-300 hover:border-ink hover:text-ink"
        >
          <Eye className="h-4 w-4" /> Live Preview
        </a>
      )}
    </div>
  );
}
