export const digits = (value: number) =>
  new Intl.NumberFormat("fa-IR").format(value);
export const money = (value: number) => `${digits(value)} تومان`;
export const normalize = (text: string) =>
  text
    .replace(/ي|ى/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/[\u064B-\u065F\u200c]/g, "")
    .trim()
    .toLowerCase();
export const latinDigits = (text: string) =>
  text.replace(/[۰-۹٠-٩]/g, (c) =>
    String(c.charCodeAt(0) - (c <= "٩" ? 1632 : 1776)),
  );
export const discount = (price: number, original: number) =>
  Math.round((1 - price / original) * 100);
