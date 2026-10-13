import Link from "next/link";
export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <Link className="brand" href="/">
            <span>KASRA.</span>
            <small>BOUTIQUE</small>
          </Link>
          <p>
            لباس‌هایی برای روزهای واقعی.
            <br />
            ساده، راحت و به سبک خودت.
          </p>
          <small>این وب‌سایت نمونه است؛ محصولی فروخته نمی‌شود.</small>
        </div>
        <div>
          <h3>دنیای کسرا</h3>
          <Link href="/shop">همه محصولات</Link>
          <Link href="/about">داستان کسرا</Link>
          <Link href="/wishlist">علاقه‌مندی‌ها</Link>
          <Link href="/account">حساب نمایشی</Link>
        </div>
        <div>
          <h3>کنارت هستیم</h3>
          <Link href="/size-guide">راهنمای سایز</Link>
          <Link href="/shipping-and-returns">ارسال و مرجوعی نمونه</Link>
          <Link href="/faq">پرسش‌های پرتکرار</Link>
          <Link href="/contact">تماس با ما</Link>
        </div>
        <div className="footer-note">
          <span className="eyebrow">MADE FOR YOUR EVERYDAY</span>
          <p>
            استایل خوب،
            <br />
            از حس خوب شروع می‌شه.
          </p>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>کسرا بوتیک · نسخه نمایشی</span>
        <span dir="ltr">A little less, a little better.</span>
      </div>
    </footer>
  );
}
