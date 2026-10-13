export default function Loading() {
  return (
    <div
      className="container page"
      aria-busy="true"
      aria-label="در حال بارگذاری"
    >
      <div className="skeleton heading-skeleton" />
      <div className="product-grid">
        {[1, 2, 3, 4].map((n) => (
          <div className="skeleton product-skeleton" key={n} />
        ))}
      </div>
      <p role="status">در حال آماده‌کردن انتخاب‌های تو…</p>
    </div>
  );
}
