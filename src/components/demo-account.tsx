"use client";
import { useState } from "react";
export function DemoAccount() {
  const [message, setMessage] = useState("");
  return (
    <form
      className="account-form"
      onSubmit={(e) => {
        e.preventDefault();
        setMessage(
          "این بخش نمایشی است؛ ورود، ارسال پیامک و ساخت حساب هنوز متصل نیست.",
        );
      }}
    >
      <label>
        شماره همراه نمونه
        <input
          inputMode="tel"
          dir="ltr"
          placeholder="09123456789"
          required
          pattern="09[0-9]{9}"
          maxLength={11}
        />
      </label>
      <button className="button">نمایش مرحله ورود</button>
      <p role="status">{message}</p>
      <small>شماره‌ای ذخیره یا ارسال نمی‌شود.</small>
    </form>
  );
}
