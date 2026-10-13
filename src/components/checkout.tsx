"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useShop, useShopReady, cartTotal, clearCart } from "@/lib/store";
import { validateCheckout, type CheckoutFields } from "@/lib/checkout";
import { OrderSummary } from "./cart";
import { money } from "@/lib/format";
const provinces = [
  "آذربایجان شرقی",
  "آذربایجان غربی",
  "اردبیل",
  "اصفهان",
  "البرز",
  "ایلام",
  "بوشهر",
  "تهران",
  "چهارمحال و بختیاری",
  "خراسان جنوبی",
  "خراسان رضوی",
  "خراسان شمالی",
  "خوزستان",
  "زنجان",
  "سمنان",
  "سیستان و بلوچستان",
  "فارس",
  "قزوین",
  "قم",
  "کردستان",
  "کرمان",
  "کرمانشاه",
  "کهگیلویه و بویراحمد",
  "گلستان",
  "گیلان",
  "لرستان",
  "مازندران",
  "مرکزی",
  "هرمزگان",
  "همدان",
  "یزد",
];
const empty: CheckoutFields = {
  name: "",
  phone: "",
  province: "",
  city: "",
  address: "",
  postal: "",
  notes: "",
};
export function Checkout() {
  const { cart } = useShop(),
    ready = useShopReady(),
    router = useRouter(),
    form = useRef<HTMLFormElement>(null);
  const [fields, setFields] = useState(empty),
    [errors, setErrors] = useState<
      Partial<Record<keyof CheckoutFields, string>>
    >({}),
    [busy, setBusy] = useState(false),
    [failure, setFailure] = useState("");
  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    const next = validateCheckout(fields);
    setErrors(next);
    const first = Object.keys(next)[0];
    if (first) {
      form.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setBusy(true);
    try {
      sessionStorage.setItem(
        "kasra-demo-order",
        JSON.stringify({
          id: `DEMO-${Date.now().toString(36).toUpperCase()}`,
          total: cartTotal(cart),
          count: cart.reduce((n, l) => n + l.quantity, 0),
        }),
      );
      clearCart();
      router.push("/order-confirmation");
    } catch {
      setFailure(
        "مرورگر امکان ذخیره تأیید نمونه را ندارد. ذخیره‌سازی مرورگر را فعال کن و دوباره تلاش کن.",
      );
      setBusy(false);
    }
  }
  const field = (
    key: keyof CheckoutFields,
    label: string,
    extra: React.InputHTMLAttributes<HTMLInputElement> = {},
  ) => (
    <label className={key === "address" ? "wide" : ""}>
      {label}
      <input
        name={key}
        value={fields[key]}
        aria-invalid={!!errors[key]}
        aria-describedby={errors[key] ? `error-${key}` : undefined}
        onChange={(e) => setFields({ ...fields, [key]: e.target.value })}
        {...extra}
      />
      {errors[key] && (
        <span id={`error-${key}`} className="field-error">
          {errors[key]}
        </span>
      )}
    </label>
  );
  if (!ready) return <p role="status">در حال آماده‌سازی…</p>;
  if (!cart.length && !busy)
    return (
      <div className="empty">
        <h2>اول یک لباس انتخاب کن</h2>
        <Link className="button" href="/shop">
          مشاهده محصولات
        </Link>
      </div>
    );
  return (
    <>
      <div className="notice">
        <strong>این یک تجربه نمایشی است.</strong> لطفاً اطلاعات آزمایشی وارد کن.
        اطلاعات نشانی ارسال یا ذخیره نمی‌شود و پرداختی در کار نیست.
      </div>
      <form ref={form} onSubmit={submit} noValidate className="checkout-layout">
        <div>
          <h2>اطلاعات دریافت‌کننده نمونه</h2>
          <div className="form-grid">
            {field("name", "نام و نام خانوادگی", {
              autoComplete: "off",
              maxLength: 100,
            })}
            {field("phone", "شماره همراه", {
              inputMode: "tel",
              dir: "ltr",
              placeholder: "09123456789",
              maxLength: 15,
            })}
            <label>
              استان
              <select
                name="province"
                value={fields.province}
                aria-invalid={!!errors.province}
                aria-describedby={
                  errors.province ? "error-province" : undefined
                }
                onChange={(e) =>
                  setFields({ ...fields, province: e.target.value })
                }
              >
                <option value="">انتخاب استان</option>
                {provinces.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
              {errors.province && (
                <span id="error-province" className="field-error">
                  {errors.province}
                </span>
              )}
            </label>
            {field("city", "شهر", { maxLength: 80 })}
            {field("address", "نشانی کامل", { maxLength: 500 })}
            {field("postal", "کد پستی", {
              inputMode: "numeric",
              dir: "ltr",
              maxLength: 10,
            })}
            <label className="wide">
              یادداشت سفارش (اختیاری)
              <textarea
                name="notes"
                value={fields.notes}
                onChange={(e) =>
                  setFields({ ...fields, notes: e.target.value })
                }
                maxLength={500}
              />
            </label>
          </div>
          <h2>روش ارسال نمونه</h2>
          <div className="notice">
            ارسال آزمایشی با هزینه صفر؛ روش و زمان واقعی ارسال هنوز تعیین نشده
            است.
          </div>
        </div>
        <OrderSummary cart={cart}>
          <ul className="checkout-items">
            {cart.map((l) => (
              <li key={l.key}>
                {l.name}
                <small>
                  {l.color} / {l.size} × {l.quantity}
                </small>
                <span>{money(l.price * l.quantity)}</span>
              </li>
            ))}
          </ul>
          <button className="button full" disabled={busy} type="submit">
            {busy ? "در حال تأیید…" : "تأیید سفارش نمایشی"}
          </button>
          <p role="alert" className="field-error">
            {failure}
          </p>
          <Link className="text-link" href="/cart">
            ویرایش سبد خرید
          </Link>
        </OrderSummary>
      </form>
    </>
  );
}
