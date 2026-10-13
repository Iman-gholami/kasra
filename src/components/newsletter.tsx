"use client";
import { useState } from "react";
export function Newsletter() {
  const [done, setDone] = useState(false);
  return (
    <section className="newsletter container">
      <div>
        <span className="eyebrow">STAY IN THE KNOW</span>
        <h2>اولین نفر از تازه‌ها باخبر شو</h2>
        <p>فرم نمایشی است؛ ایمیلی ذخیره یا ارسال نمی‌شود.</p>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setDone(true);
          e.currentTarget.reset();
        }}
      >
        <label className="sr-only" htmlFor="newsletter">
          ایمیل
        </label>
        <input
          id="newsletter"
          type="email"
          placeholder="ایمیل تو"
          required
          dir="auto"
        />
        <button type="submit" className="button">
          عضویت نمایشی
        </button>
        <p role="status">
          {done ? "نمونه عضویت انجام شد؛ اطلاعاتی ثبت نشد." : ""}
        </p>
      </form>
    </section>
  );
}
