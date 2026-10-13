import { Checkout } from "@/components/checkout";
export const metadata = {
  title: "ثبت سفارش نمایشی",
  robots: { index: false, follow: false },
};
export default function CheckoutPage() {
  return (
    <div className="container page">
      <span className="eyebrow">ONE LAST STEP</span>
      <h1>ثبت سفارش نمایشی</h1>
      <Checkout />
    </div>
  );
}
