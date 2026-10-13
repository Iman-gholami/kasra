"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="container empty">
      <h1>بارگذاری کامل نشد</h1>
      <p>دوباره امتحان کن.</p>
      <button className="button" onClick={reset}>
        تلاش دوباره
      </button>
    </div>
  );
}
