"use client";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Trash2, Minus, Plus, ArrowLeft } from "lucide-react";
import {
  useShop,
  useShopReady,
  setQuantity,
  removeLine,
  cartTotal,
  cartSaving,
  type CartLine,
} from "@/lib/store";
import { money, digits } from "@/lib/format";
export function OrderSummary({
  cart,
  children,
}: {
  cart: CartLine[];
  children?: React.ReactNode;
}) {
  const total = cartTotal(cart),
    saving = cartSaving(cart);
  return (
    <aside className="order-summary">
      <h2>خلاصه سفارش</h2>
      <div className="summary-row">
        <span>قیمت محصولات</span>
        <span>{money(total + saving)}</span>
      </div>
      {saving > 0 && (
        <div className="summary-row saving">
          <span>تخفیف نمونه</span>
          <span>− {money(saving)}</span>
        </div>
      )}
      <div className="summary-row">
        <span>ارسال نمایشی</span>
        <span>{money(0)}</span>
      </div>
      <p className="muted">هزینه واقعی ارسال هنوز تعیین نشده است.</p>
      <div className="summary-row total">
        <strong>جمع نمایشی</strong>
        <strong data-testid="cart-total">{money(total)}</strong>
      </div>
      {children}
      <p className="demo-note">هیچ پرداختی انجام نمی‌شود.</p>
    </aside>
  );
}
export function Cart() {
  const { cart } = useShop(),
    ready = useShopReady();
  if (!ready) return <p role="status">در حال آماده‌کردن سبد…</p>;
  if (!cart.length)
    return (
      <div className="empty">
        <ShoppingBag size={44} />
        <h2>سبدت هنوز خالیه</h2>
        <p>برای شروع، سری به تازه‌های کسرا بزن.</p>
        <Link className="button" href="/shop">
          ادامه خرید
        </Link>
      </div>
    );
  return (
    <div className="cart-layout">
      <div>
        <div className="cart-lines">
          {cart.map((l) => (
            <article className="cart-line" key={l.key}>
              <Link href={`/product/${l.slug}`}>
                <Image
                  src={l.image}
                  alt={`تصویر نمونه ${l.name}`}
                  width={120}
                  height={158}
                />
              </Link>
              <div>
                <h2>
                  <Link href={`/product/${l.slug}`}>{l.name}</Link>
                </h2>
                <p className="muted">
                  {l.color} / سایز <bdi>{l.size}</bdi>
                </p>
                <p>{money(l.price)}</p>
                <div className="quantity">
                  <button
                    aria-label={`کاهش تعداد ${l.name}`}
                    disabled={l.quantity <= 1}
                    onClick={() => setQuantity(l.key, l.quantity - 1)}
                  >
                    <Minus size={16} />
                  </button>
                  <output>{digits(l.quantity)}</output>
                  <button
                    aria-label={`افزایش تعداد ${l.name}`}
                    disabled={l.quantity >= l.stock}
                    onClick={() => setQuantity(l.key, l.quantity + 1)}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
              <div className="line-total">
                <button
                  className="icon-button"
                  aria-label={`حذف ${l.name}`}
                  onClick={() => removeLine(l.key)}
                >
                  <Trash2 size={19} />
                </button>
                <strong>{money(l.quantity * l.price)}</strong>
              </div>
            </article>
          ))}
        </div>
        <p className="sr-only" role="status">
          جمع سبد {money(cartTotal(cart))}
        </p>
        <Link className="text-link" href="/shop">
          ادامه خرید ←
        </Link>
      </div>
      <OrderSummary cart={cart}>
        <Link href="/checkout" className="button full">
          ادامه ثبت سفارش نمایشی <ArrowLeft size={18} />
        </Link>
      </OrderSummary>
    </div>
  );
}
