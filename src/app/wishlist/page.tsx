import { Wishlist } from "@/components/wishlist";
export const metadata = { title: "علاقه‌مندی‌ها" };
export default function WishlistPage() {
  return (
    <div className="container page">
      <span className="eyebrow">SAVED FOR LATER</span>
      <h1>انتخاب‌های محبوب تو</h1>
      <p className="muted intro">
        چیزهایی که دوست داری، همین‌جا منتظرت می‌مانند.
      </p>
      <Wishlist />
    </div>
  );
}
