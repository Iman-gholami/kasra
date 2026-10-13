import { Cart } from "@/components/cart";
export const metadata = { title: "سبد خرید" };
export default function CartPage() {
  return (
    <div className="container page">
      <span className="eyebrow">YOUR GOOD FINDS</span>
      <h1>سبد خرید تو</h1>
      <Cart />
    </div>
  );
}
