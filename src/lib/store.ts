"use client";
import { useSyncExternalStore } from "react";
import type { Product, Variant } from "@/types/catalog";
export type CartLine = {
  key: string;
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  compareAt?: number;
  color: string;
  size: string;
  stock: number;
  quantity: number;
};
type State = { cart: CartLine[]; wishlist: string[] };
const empty: State = { cart: [], wishlist: [] };
const KEY = "kasra-demo-v1";
let cachedRaw: string | null = null,
  cached: State = empty;
const listeners = new Set<() => void>();
let memoryOnly = false;
function snapshot(): State {
  if (typeof window === "undefined" || memoryOnly) return cached;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw === cachedRaw) return cached;
    cachedRaw = raw;
    const data = raw ? JSON.parse(raw) : empty;
    cached = {
      wishlist: Array.isArray(data.wishlist)
        ? data.wishlist
            .filter((id: unknown) => typeof id === "string")
            .slice(0, 100)
        : [],
      cart: Array.isArray(data.cart)
        ? data.cart
            .filter(
              (v: CartLine) =>
                v &&
                typeof v.key === "string" &&
                typeof v.name === "string" &&
                typeof v.slug === "string" &&
                typeof v.image === "string" &&
                v.image.startsWith("/images/") &&
                Number.isSafeInteger(v.price) &&
                v.price > 0 &&
                Number.isSafeInteger(v.quantity) &&
                v.quantity > 0 &&
                Number.isSafeInteger(v.stock) &&
                v.quantity <= v.stock,
            )
            .slice(0, 100)
        : [],
    };
  } catch {
    cached = empty;
  }
  return cached;
}
function subscribe(fn: () => void) {
  listeners.add(fn);
  window.addEventListener("storage", fn);
  return () => {
    listeners.delete(fn);
    window.removeEventListener("storage", fn);
  };
}
function write(next: State) {
  cached = next;
  cachedRaw = JSON.stringify(next);
  try {
    localStorage.setItem(KEY, cachedRaw);
  } catch {
    memoryOnly = true;
  }
  listeners.forEach((fn) => fn());
}
export const useShop = () =>
  useSyncExternalStore(subscribe, snapshot, () => empty);
export const toggleWish = (id: string) => {
  const s = snapshot();
  write({
    ...s,
    wishlist: s.wishlist.includes(id)
      ? s.wishlist.filter((v) => v !== id)
      : [...s.wishlist, id].slice(-100),
  });
};
export function addToCart(
  product: Product,
  variant: Variant,
  quantity: number,
): boolean {
  const s = snapshot(),
    existing = s.cart.find((l) => l.key === variant.id);
  if (
    !variant.stock ||
    quantity < 1 ||
    (existing?.quantity || 0) + quantity > variant.stock
  )
    return false;
  const line: CartLine = {
    key: variant.id,
    productId: product.id,
    slug: product.slug,
    name: product.name,
    image: product.images[0],
    price: product.price,
    compareAt: product.compareAt,
    color: product.colors.find((c) => c.id === variant.color)!.name,
    size: variant.size,
    stock: variant.stock,
    quantity,
  };
  write({
    ...s,
    cart: existing
      ? s.cart.map((l) =>
          l.key === variant.id ? { ...l, quantity: l.quantity + quantity } : l,
        )
      : [...s.cart, line],
  });
  return true;
}
export function setQuantity(key: string, quantity: number) {
  const s = snapshot();
  write({
    ...s,
    cart: s.cart.map((l) =>
      l.key === key
        ? {
            ...l,
            quantity: Math.max(1, Math.min(l.stock, Math.floor(quantity) || 1)),
          }
        : l,
    ),
  });
}
export function removeLine(key: string) {
  const s = snapshot();
  write({ ...s, cart: s.cart.filter((l) => l.key !== key) });
}
export function clearCart() {
  write({ ...snapshot(), cart: [] });
}
export const cartTotal = (cart: CartLine[]) =>
  cart.reduce((sum, l) => sum + l.price * l.quantity, 0);
export const cartSaving = (cart: CartLine[]) =>
  cart.reduce(
    (sum, l) =>
      sum + Math.max(0, (l.compareAt || l.price) - l.price) * l.quantity,
    0,
  );
const subscribeReady = () => () => {};
export const useShopReady = () =>
  useSyncExternalStore(
    subscribeReady,
    () => true,
    () => false,
  );
