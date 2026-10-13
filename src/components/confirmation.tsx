"use client";
import { useSyncExternalStore } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { money, digits } from "@/lib/format";
const subscribe = () => () => {};
const snapshot = () => {
  try {
    return sessionStorage.getItem("kasra-demo-order") || "";
  } catch {
    return "";
  }
};
export function Confirmation() {
  const raw = useSyncExternalStore(subscribe, snapshot, () => "");
  let order: { id: string; total: number; count: number } | null = null;
  try {
    const data = JSON.parse(raw);
    if (
      data &&
      typeof data.id === "string" &&
      Number.isFinite(data.total) &&
      Number.isFinite(data.count)
    )
      order = data;
  } catch {}
  return (
    <div className="confirmation">
      <div className="confirmation-icon">
        <Check size={36} />
      </div>
      <span className="eyebrow">JUST A LITTLE DEMO</span>
      <h1>{order ? "تجربه خریدت کامل شد" : "تأیید سفارش نمایشی"}</h1>
      <p>هیچ پرداختی انجام نشده و هیچ سفارشی برای فروشگاه ارسال نشده است.</p>
      {order ? (
        <div className="notice">
          <p>
            شناسه نمونه: <bdi>{order.id}</bdi>
          </p>
          <p>
            {digits(order.count)} کالا · {money(order.total)}
          </p>
        </div>
      ) : (
        <p>در این نشست، سفارش نمایشی تأییدشده‌ای وجود ندارد.</p>
      )}
      <Link className="button" href="/shop">
        بازگشت به محصولات
      </Link>
    </div>
  );
}
