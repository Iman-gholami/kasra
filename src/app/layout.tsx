import type { Metadata } from "next";
import localFont from "next/font/local";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import "./globals.css";
const vazir = localFont({
  src: "../../node_modules/@fontsource-variable/vazirmatn/files/vazirmatn-arabic-wght-normal.woff2",
  variable: "--font-vazir",
  display: "swap",
  weight: "100 900",
});
export const metadata: Metadata = {
  title: { default: "کسرا بوتیک | به سبک خودت", template: "%s | کسرا بوتیک" },
  description:
    "نسخه نمایشی کسرا بوتیک؛ شومیز، مانتو و تیشرت برای استایل روزمره تو.",
  robots: { index: false, follow: false },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl" className={vazir.variable}>
      <body>
        <a href="#main" className="skip-link">
          رفتن به محتوای اصلی
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
