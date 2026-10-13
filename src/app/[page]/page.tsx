import Link from "next/link";
import { notFound } from "next/navigation";
import { DemoAccount } from "@/components/demo-account";
const titles: Record<string, string> = {
  about: "داستان کسرا",
  contact: "کنارت هستیم",
  faq: "پرسش‌های پرتکرار",
  "shipping-and-returns": "ارسال و مرجوعی",
  "size-guide": "راهنمای انتخاب سایز",
  account: "حساب نمایشی تو",
};
export function generateStaticParams() {
  return Object.keys(titles).map((page) => ({ page }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  return { title: titles[(await params).page] || "صفحه پیدا نشد" };
}
export default async function InfoPage({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page } = await params;
  if (!titles[page]) notFound();
  return (
    <div className="container info-page">
      <nav className="breadcrumb">
        <Link href="/">خانه</Link>
        <span>/</span>
        <span>{titles[page]}</span>
      </nav>
      <span className="eyebrow">THE KASRA WAY</span>
      <h1>{titles[page]}</h1>
      {page === "about" && (
        <>
          <p className="lead">استایل خوب، از حس خوب شروع می‌شه.</p>
          <p>
            کسرا در این نسخه نمایشی، تصویری از یک بوتیک امروزی است: لباس‌هایی
            ساده و راحت برای روزهای واقعی. شومیز، مانتو و تیشرت‌هایی که قرار است
            به انتخاب‌های روزمره‌ات نزدیک باشند.
          </p>
          <p>
            این متن، معرفی پیشنهادی برند است. داستان واقعی، تیم و اطلاعات
            کسب‌وکار پس از تأیید صاحب برند جایگزین خواهند شد.
          </p>
          <Link className="button" href="/shop">
            کشف محصولات
          </Link>
        </>
      )}
      {page === "contact" && (
        <>
          <p className="lead">گفت‌وگو، شروع یک انتخاب بهتره.</p>
          <div className="notice">
            اطلاعات تماس واقعی هنوز ارائه نشده است. این فروشگاه نمونه، کانال
            پاسخ‌گویی فعال ندارد.
          </div>
          <p>
            شماره تماس، نشانی، ساعات پاسخ‌گویی و شبکه‌های اجتماعی پس از تأیید
            برند در این صفحه قرار می‌گیرند.
          </p>
          <Link className="text-link" href="/faq">
            پرسش‌های پرتکرار را ببین ←
          </Link>
        </>
      )}
      {page === "faq" && (
        <div className="details-list">
          {[
            [
              "آیا می‌توانم خرید واقعی انجام بدهم؟",
              "خیر. این نسخه فقط برای نمایش تجربه خرید است؛ پرداخت یا ارسال سفارش واقعی ندارد.",
            ],
            [
              "چطور سایز مناسب را انتخاب کنم؟",
              "جدول راهنمای سایز را با اندازه‌های لباس مشابه خود مقایسه کن. اندازه‌ها نمونه‌اند و باید با جدول واقعی هر محصول جایگزین شوند.",
            ],
            [
              "علاقه‌مندی‌ها و سبد خرید کجا ذخیره می‌شوند؟",
              "در همین مرورگر و روی همین دستگاه. با پاک‌کردن داده‌های مرورگر، این انتخاب‌ها هم حذف می‌شوند.",
            ],
            [
              "هزینه و زمان ارسال چقدر است؟",
              "هنوز نهایی نشده است. هزینه صفر در تسویه‌حساب فقط برای نمایش است.",
            ],
            [
              "آیا رنگ تصویر دقیق است؟",
              "خیر. تصاویر لباس‌ها تصویرسازی نمایشی‌اند. عکس واقعی و تطابق رنگ قبل از فروش اضافه خواهند شد.",
            ],
          ].map(([q, a]) => (
            <details key={q}>
              <summary>{q}</summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      )}
      {page === "shipping-and-returns" && (
        <>
          <div className="notice">
            اطلاعات موقت و نمایشی؛ این صفحه سیاست رسمی فروشگاه نیست.
          </div>
          <h2>ارسال</h2>
          <p>
            محدوده ارسال، شرکت حمل، هزینه و بازه تحویل هنوز تعیین نشده‌اند. مبلغ
            صفر در مرحله سفارش، فقط یک فرض نمایشی است.
          </p>
          <h2>مرجوعی</h2>
          <p>
            شرایط پذیرش، مهلت درخواست و نحوه بازگشت وجه باید پیش از شروع فروش
            توسط کسب‌وکار مشخص و تأیید شوند. فعلاً هیچ سفارش یا مرجوعی واقعی
            پردازش نمی‌شود.
          </p>
          <Link className="text-link" href="/contact">
            اطلاعات تماس ←
          </Link>
        </>
      )}
      {page === "size-guide" && (
        <>
          <p className="lead">چند دقیقه اندازه‌گیری، انتخابی راحت‌تر.</p>
          <div className="notice">
            اندازه‌های زیر نمونه‌اند؛ راهنمای دقیق هر محصول باید پیش از فروش
            جایگزین شود. اعداد بر حسب سانتی‌متر هستند.
          </div>
          <div className="table-scroll">
            <table>
              <caption>جدول نمونه اندازه بدن</caption>
              <thead>
                <tr>
                  <th>سایز</th>
                  <th>دور سینه</th>
                  <th>دور کمر</th>
                  <th>دور باسن</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["S", "۸۴–۸۸", "۶۶–۷۰", "۹۲–۹۶"],
                  ["M", "۸۹–۹۴", "۷۱–۷۶", "۹۷–۱۰۲"],
                  ["L", "۹۵–۱۰۱", "۷۷–۸۳", "۱۰۳–۱۰۹"],
                  ["XL", "۱۰۲–۱۰۸", "۸۴–۹۰", "۱۱۰–۱۱۶"],
                ].map((row) => (
                  <tr key={row[0]}>
                    {row.map((cell, i) =>
                      i === 0 ? (
                        <th scope="row" key={i}>
                          {cell}
                        </th>
                      ) : (
                        <td key={i}>{cell}</td>
                      ),
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <h2>چطور اندازه بگیرم؟</h2>
          <ol>
            <li>متر را بدون کشیدن، دور پُرترین قسمت سینه بگیر.</li>
            <li>باریک‌ترین قسمت کمر و پهن‌ترین قسمت باسن را اندازه بگیر.</li>
            <li>متر را موازی زمین نگه دار و فضای راحتی لباس را در نظر بگیر.</li>
            <li>برش و جنس محصول را هم بررسی کن؛ فقط به نام سایز تکیه نکن.</li>
          </ol>
        </>
      )}
      {page === "account" && (
        <>
          <p>بدون ساخت حساب می‌توانی مسیر خرید نمایشی را امتحان کنی.</p>
          <DemoAccount />
          <Link className="text-link" href="/wishlist">
            دیدن علاقه‌مندی‌ها ←
          </Link>
        </>
      )}
    </div>
  );
}
