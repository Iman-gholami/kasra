"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useShop, useShopReady } from "@/lib/store";
import type { Product } from "@/types/catalog";
import { ProductGrid } from "./product-card";
export function Wishlist() {
  const ready = useShopReady();
  const { wishlist } = useShop(),
    ids = wishlist.join(",");
  const [products, setProducts] = useState<Product[]>([]),
    [loaded, setLoaded] = useState(""),
    [error, setError] = useState(false),
    [retry, setRetry] = useState(0);
  useEffect(() => {
    if (!ids) return;
    const controller = new AbortController();
    fetch(`/api/products?ids=${encodeURIComponent(ids)}`, {
      signal: controller.signal,
    })
      .then((r) => {
        if (!r.ok) throw Error();
        return r.json();
      })
      .then((data) => {
        setProducts(data.products);
        setLoaded(ids);
        setError(false);
      })
      .catch(() => {
        if (!controller.signal.aborted) setError(true);
      });
    return () => controller.abort();
  }, [ids, retry]);
  if (!ready) return <p role="status">در حال آماده‌کردن انتخاب‌ها…</p>;
  if (!ids)
    return (
      <div className="empty">
        <Heart size={44} />
        <h2>اینجا جای انتخاب‌های محبوب توست</h2>
        <p>قلب کنار هر لباس را بزن تا اینجا نگهش داریم.</p>
        <Link className="button" href="/shop">
          پیدا کردن لباس محبوب
        </Link>
      </div>
    );
  if (error)
    return (
      <div className="empty" role="alert">
        <p>بارگذاری انجام نشد.</p>
        <button
          className="button"
          onClick={() => {
            setError(false);
            setRetry((n) => n + 1);
          }}
        >
          تلاش دوباره
        </button>
      </div>
    );
  if (loaded !== ids) return <p role="status">در حال آماده‌کردن انتخاب‌ها…</p>;
  return (
    <ProductGrid products={products.filter((p) => wishlist.includes(p.id))} />
  );
}
