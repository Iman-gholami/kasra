"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Minus, Plus, Maximize2, ShoppingBag, Check } from "lucide-react";
import type { Product } from "@/types/catalog";
import { money, digits, discount } from "@/lib/format";
import { addToCart, useShop } from "@/lib/store";
import { WishButton } from "./wish-button";
import { Dialog } from "./dialog";
export function ProductDetail({ product: p }: { product: Product }) {
  const [image, setImage] = useState(0),
    [color, setColor] = useState(""),
    [size, setSize] = useState(""),
    [quantity, setQuantity] = useState(1),
    [zoom, setZoom] = useState(false),
    [message, setMessage] = useState(""),
    [added, setAdded] = useState(false);
  const variant = p.variants.find((v) => v.color === color && v.size === size),
    cart = useShop().cart;
  const remaining = variant
    ? Math.max(
        0,
        variant.stock - (cart.find((l) => l.key === variant.id)?.quantity || 0),
      )
    : 0;
  const select = () => {
    setMessage("");
    setAdded(false);
    setQuantity(1);
  };
  function add() {
    if (!variant) {
      setMessage("اول رنگ و سایز دلخواهت را انتخاب کن.");
      return;
    }
    if (!addToCart(p, variant, quantity)) {
      setMessage("تعداد انتخاب‌شده از موجودی نمونه بیشتر است.");
      return;
    }
    setAdded(true);
    setMessage("به سبد خریدت اضافه شد.");
  }
  return (
    <div className="product-detail">
      <div className="gallery">
        <div className="main-photo">
          <Image
            src={p.images[image]}
            alt={`تصویر نمایشی ${p.name}، نمای ${digits(image + 1)}`}
            width={640}
            height={840}
            preload
            fetchPriority="high"
            sizes="(max-width: 760px) 100vw, 55vw"
          />
          <button
            className="icon-button zoom"
            aria-label="بزرگ‌نمایی تصویر"
            onClick={() => setZoom(true)}
          >
            <Maximize2 size={20} />
          </button>
        </div>
        <div className="thumbnails">
          {p.images.map((src, i) => (
            <button
              key={src}
              className={image === i ? "active" : ""}
              aria-label={`نمای ${digits(i + 1)}`}
              aria-pressed={image === i}
              onClick={() => setImage(i)}
            >
              <Image src={src} alt="" width={64} height={84} />
            </button>
          ))}
        </div>
        <small className="muted">
          تصویرسازی نمونه؛ عکس و رنگ دقیق محصول نیست.
        </small>
      </div>
      <div className="product-info">
        <span className="eyebrow">KASRA EVERYDAY ESSENTIALS</span>
        <div className="section-head">
          <h1>{p.name}</h1>
          <WishButton id={p.id} name={p.name} />
        </div>
        <div className="detail-price">
          <strong>{money(p.price)}</strong>
          {p.compareAt && (
            <>
              <del>{money(p.compareAt)}</del>
              <span className="tag">
                {digits(discount(p.price, p.compareAt))}٪ تخفیف نمونه
              </span>
            </>
          )}
        </div>
        <p className="description">{p.description}</p>
        <fieldset>
          <legend>
            رنگ{" "}
            <span className="muted">
              {p.colors.find((c) => c.id === color)?.name || "را انتخاب کن"}
            </span>
          </legend>
          <div className="color-options">
            {p.colors.map((c) => (
              <button
                type="button"
                key={c.id}
                className={color === c.id ? "active" : ""}
                aria-pressed={color === c.id}
                onClick={() => {
                  select();
                  setColor(c.id);
                  if (
                    p.variants.find((v) => v.color === c.id && v.size === size)
                      ?.stock === 0
                  )
                    setSize("");
                }}
              >
                <span style={{ background: c.hex }} />
                {c.name}
                {color === c.id && <Check size={14} />}
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend>
            سایز <Link href="/size-guide">راهنمای انتخاب سایز ↖</Link>
          </legend>
          <div className="size-options">
            {p.sizes.map((s) => {
              const available = p.variants.some(
                (v) =>
                  v.size === s && (!color || v.color === color) && v.stock > 0,
              );
              return (
                <button
                  type="button"
                  key={s}
                  disabled={!available}
                  aria-label={`سایز ${s}${!available ? " ناموجود" : ""}`}
                  aria-pressed={size === s}
                  className={size === s ? "active" : ""}
                  onClick={() => {
                    select();
                    setSize(s);
                  }}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </fieldset>
        <div className="purchase">
          <div className="quantity">
            <button
              aria-label="کاهش تعداد"
              disabled={quantity <= 1}
              onClick={() => setQuantity((n) => n - 1)}
            >
              <Minus size={16} />
            </button>
            <output aria-label="تعداد">{digits(quantity)}</output>
            <button
              aria-label="افزایش تعداد"
              disabled={!variant || quantity >= remaining}
              onClick={() => setQuantity((n) => n + 1)}
            >
              <Plus size={16} />
            </button>
          </div>
          <button
            className="button add-button"
            disabled={!!variant && remaining === 0}
            onClick={add}
          >
            <ShoppingBag size={19} />
            {variant && remaining === 0
              ? "موجودی قابل افزودن تمام شد"
              : "افزودن به سبد خرید"}
          </button>
        </div>
        <div
          aria-live="polite"
          className={`feedback ${added ? "success" : ""}`}
        >
          {message}
          {added && <Link href="/cart">مشاهده سبد خرید ←</Link>}
        </div>
        <p className="demo-note">
          موجودی و قیمت‌ها نمونه‌اند؛ خرید واقعی انجام نمی‌شود.
        </p>
        <div className="details-list">
          <details open>
            <summary>جنس و جزئیات</summary>
            <p>
              {p.fabric}
              <br />
              {p.fit}
            </p>
          </details>
          <details>
            <summary>نگهداری لباس</summary>
            <p>{p.care}</p>
          </details>
          <details>
            <summary>ارسال و مرجوعی</summary>
            <p>روش ارسال و شرایط مرجوعی هنوز نهایی نشده‌اند.</p>
            <Link className="text-link" href="/shipping-and-returns">
              اطلاعات نمونه
            </Link>
          </details>
        </div>
      </div>
      <Dialog
        open={zoom}
        onClose={() => setZoom(false)}
        title="نمای بزرگ تصویر نمونه"
      >
        <Image
          src={p.images[image]}
          alt={`تصویر نمونه ${p.name}`}
          width={640}
          height={840}
          style={{ width: "100%", height: "auto" }}
        />
      </Dialog>
    </div>
  );
}
