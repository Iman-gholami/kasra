"use client";
import { Heart } from "lucide-react";
import { toggleWish, useShop } from "@/lib/store";
export function WishButton({ id, name }: { id: string; name: string }) {
  const active = useShop().wishlist.includes(id);
  return (
    <button
      className={`icon-button wish ${active ? "selected" : ""}`}
      aria-label={`${active ? "حذف از" : "افزودن به"} علاقه‌مندی‌ها: ${name}`}
      aria-pressed={active}
      onClick={() => toggleWish(id)}
    >
      <Heart size={19} fill={active ? "currentColor" : "none"} />
    </button>
  );
}
