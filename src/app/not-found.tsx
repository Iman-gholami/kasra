import Link from "next/link";
export default function NotFound() {
  return (
    <div className="container empty">
      <span className="eyebrow">۴۰۴</span>
      <h1>این صفحه را پیدا نکردیم</h1>
      <p>شاید لباس دلخواهت یک جای دیگر منتظرت باشد.</p>
      <Link className="button" href="/shop">
        رفتن به فروشگاه
      </Link>
    </div>
  );
}
