import type { Product } from "@/types/catalog";
import { categories, colors } from "./categories";
const names = [
  "آوا",
  "رها",
  "لنا",
  "آیلا",
  "نوا",
  "سایه",
  "دریا",
  "باران",
  "آرین",
  "مانا",
  "مهتاب",
  "نیکا",
];
const descriptions = [
  "لینن یقه‌دار",
  "نخی آزاد",
  "راه‌راه کلاسیک",
  "مینیمال",
  "بافت سبک",
  "پنبه‌ای ساده",
  "آستین‌بلند",
  "روزمره",
  "یقه گرد",
  "راحت",
  "برش آزاد",
  "تابستانی",
];
export const products: Product[] = categories.flatMap((category, ci) =>
  names.map((name, i) => {
    const id = `${category.slug}-${i + 1}`;
    const palette = [colors[(i + ci) % 4], colors[(i + ci + 1) % 4]];
    const sizes = ["S", "M", "L", "XL"];
    const price = [690000, 1490000, 390000][ci] + i * 45000;
    return {
      id,
      slug: id,
      name: `${category.name} ${descriptions[i]} ${name}`,
      category: category.slug,
      price,
      compareAt: i % 3 === 0 ? price + 180000 : undefined,
      description:
        "یک انتخاب ساده و خوش‌فرم برای روزهایی که می‌خواهی راحت و به سبک خودت باشی. طراحی آزاد و رنگ‌های آرام، همراه لباس‌های محبوب کمدت. اطلاعات و موجودی این محصول نمونه هستند.",
      images: [
        `/images/${category.slug}-${(i % 4) + 1}.svg`,
        `/images/${category.slug}-${((i + 1) % 4) + 1}.svg`,
      ],
      colors: palette,
      sizes,
      variants: palette.flatMap((color) =>
        sizes.map((size, si) => ({
          id: `${id}-${color.id}-${size}`,
          color: color.id,
          size,
          stock:
            i === 11 || (si === 3 && color === palette[0]) ? 0 : 3 + (i % 6),
        })),
      ),
      fabric:
        ci === 0
          ? "ترکیب لینن و پنبه — نمونه"
          : ci === 1
            ? "پارچه کتان سبک — نمونه"
            : "پنبه نرم — نمونه",
      fit: "برش آزاد؛ اندازه‌های جدول راهنما را بررسی کن.",
      care: "شست‌وشوی ملایم با آب سرد؛ خشک‌کردن در سایه.",
      createdAt: `2026-09-${String(28 - i).padStart(2, "0")}`,
      featured: i % 4 === 0,
    };
  }),
);
