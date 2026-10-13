"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Search,
  Heart,
  ShoppingBag,
  Menu,
  ArrowLeft,
  UserRound,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useShop, cartTotal } from "@/lib/store";
import { digits, money } from "@/lib/format";
import { categories } from "@/data/categories";
import { Dialog } from "./dialog";
import type { Product } from "@/types/catalog";
export function Header() {
  const [panel, setPanel] = useState(""),
    [q, setQ] = useState(""),
    [results, setResults] = useState<Product[]>([]),
    [searchStatus, setSearchStatus] = useState("");
  const shop = useShop(),
    path = usePathname();
  const close = () => setPanel("");
  useEffect(() => {
    if (!q.trim()) return;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const r = await fetch(`/api/products?q=${encodeURIComponent(q)}`, {
          signal: controller.signal,
        });
        if (!r.ok) throw Error();
        const data = await r.json();
        setResults(data.products);
        setSearchStatus(data.products.length ? "" : "محصولی پیدا نشد.");
      } catch {
        if (!controller.signal.aborted)
          setSearchStatus("جست‌وجو در دسترس نیست؛ دوباره تلاش کن.");
      }
    }, 250);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [q]);
  return (
    <>
      <div className="announcement">
        کمدی برای خودِ خودت <span>·</span> فروشگاه نمایشی کسرا؛ خرید واقعی انجام
        نمی‌شود
      </div>
      <header className="header">
        <div className="header-inner container">
          <button
            className="icon-button mobile-menu"
            aria-label="باز کردن منو"
            onClick={() => setPanel("menu")}
          >
            <Menu />
          </button>
          <Link className="brand" href="/" aria-label="کسرا بوتیک، خانه">
            <span>
              KASRA<span className="brand-dot">.</span>
            </span>
            <small>BOUTIQUE</small>
          </Link>
          <nav className="desktop-nav" aria-label="منوی اصلی">
            <Link
              href="/shop"
              aria-current={path === "/shop" ? "page" : undefined}
            >
              همه محصولات
            </Link>
            {categories.map((c) => (
              <Link key={c.slug} href={`/category/${c.slug}`}>
                {c.name}
              </Link>
            ))}
            <Link href="/shop?sort=newest">تازه‌ها</Link>
            <Link href="/about">درباره کسرا</Link>
          </nav>
          <div className="header-actions">
            <button
              className="icon-button"
              aria-label="جست‌وجو"
              onClick={() => setPanel("search")}
            >
              <Search size={21} />
            </button>
            <Link
              className="icon-button account-icon"
              href="/account"
              aria-label="حساب نمایشی"
            >
              <UserRound size={21} />
            </Link>
            <Link
              className="icon-button"
              href="/wishlist"
              aria-label="علاقه‌مندی‌ها"
            >
              <Heart size={21} />
              {shop.wishlist.length > 0 && (
                <span className="count">{digits(shop.wishlist.length)}</span>
              )}
            </Link>
            <button
              className="icon-button"
              aria-label="باز کردن سبد خرید"
              onClick={() => setPanel("cart")}
            >
              <ShoppingBag size={21} />
              {shop.cart.length > 0 && (
                <span className="count">
                  {digits(shop.cart.reduce((n, l) => n + l.quantity, 0))}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>
      <Dialog open={panel === "menu"} onClose={close} title="کسرا بوتیک" drawer>
        <nav className="mobile-nav" onClick={close}>
          <Link href="/">خانه</Link>
          <Link href="/shop">همه محصولات</Link>
          {categories.map((c) => (
            <Link key={c.slug} href={`/category/${c.slug}`}>
              {c.name}
              <ArrowLeft size={18} />
            </Link>
          ))}
          <Link href="/about">درباره کسرا</Link>
          <Link href="/account">حساب نمایشی</Link>
        </nav>
      </Dialog>
      <Dialog
        open={panel === "search"}
        onClose={close}
        title="دنبال چی می‌گردی؟"
      >
        <form action="/search" onSubmit={close} className="search-form">
          <label className="sr-only" htmlFor="header-search">
            جست‌وجوی محصول
          </label>
          <input
            id="header-search"
            autoComplete="off"
            name="q"
            value={q}
            placeholder="مثلاً شومیز لینن…"
            onChange={(e) => {
              setQ(e.target.value);
              setResults([]);
              setSearchStatus("در حال جست‌وجو…");
            }}
          />
          {q && (
            <button
              type="button"
              onClick={() => {
                setQ("");
                setResults([]);
              }}
            >
              پاک کردن
            </button>
          )}
          <button className="button" type="submit">
            جست‌وجو
          </button>
        </form>
        <div className="chips">
          {categories.map((c) => (
            <Link
              onClick={close}
              className="chip"
              key={c.slug}
              href={`/category/${c.slug}`}
            >
              {c.name}
            </Link>
          ))}
        </div>
        {q && (
          <div aria-live="polite">
            <p>{searchStatus}</p>
            <ul className="suggestions">
              {results.slice(0, 5).map((p) => (
                <li key={p.id}>
                  <Link onClick={close} href={`/product/${p.slug}`}>
                    {p.name}
                    <span>{money(p.price)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Dialog>
      <Dialog
        open={panel === "cart"}
        onClose={close}
        title="سبد خرید تو"
        drawer
      >
        {shop.cart.length ? (
          <>
            <ul className="mini-cart">
              {shop.cart.map((l) => (
                <li key={l.key}>
                  <Link onClick={close} href={`/product/${l.slug}`}>
                    {l.name}
                  </Link>
                  <small>
                    {l.color} · {l.size} · {digits(l.quantity)} عدد
                  </small>
                  <span>{money(l.price * l.quantity)}</span>
                </li>
              ))}
            </ul>
            <div className="summary-row">
              <span>جمع محصولات</span>
              <b>{money(cartTotal(shop.cart))}</b>
            </div>
            <Link className="button full" onClick={close} href="/cart">
              مشاهده سبد و ادامه خرید <ArrowLeft size={18} />
            </Link>
          </>
        ) : (
          <div className="empty">
            <ShoppingBag size={40} />
            <h3>سبدت منتظر انتخاب توست</h3>
            <p>از تازه‌های کسرا شروع کن.</p>
            <Link className="button" onClick={close} href="/shop">
              دیدن محصولات
            </Link>
          </div>
        )}
      </Dialog>
    </>
  );
}
