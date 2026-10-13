import { latinDigits } from "./format";
export type CheckoutFields = {
  name: string;
  phone: string;
  province: string;
  city: string;
  address: string;
  postal: string;
  notes: string;
};
export function validateCheckout(fields: CheckoutFields) {
  const errors: Partial<Record<keyof CheckoutFields, string>> = {};
  if (fields.name.trim().length < 3)
    errors.name = "نام و نام خانوادگی را کامل بنویس.";
  if (!/^09\d{9}$/.test(latinDigits(fields.phone).replace(/[\s-]/g, "")))
    errors.phone = "شماره همراه ۱۱ رقمی با ۰۹ شروع می‌شود.";
  if (!fields.province) errors.province = "استان را انتخاب کن.";
  if (fields.city.trim().length < 2) errors.city = "نام شهر را بنویس.";
  if (fields.address.trim().length < 10)
    errors.address = "نشانی کامل شامل خیابان و پلاک را بنویس.";
  if (
    !/^\d{10}$/.test(latinDigits(fields.postal)) ||
    /^(\d)\1{9}$/.test(latinDigits(fields.postal))
  )
    errors.postal = "کد پستی ۱۰ رقمی معتبر وارد کن.";
  return errors;
}
