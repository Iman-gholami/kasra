import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Ruler, Heart, Layers } from "lucide-react";
import { categories } from "@/data/categories";
import { catalog } from "@/lib/catalog";
import { ProductGrid } from "@/components/product-card";
import { Newsletter } from "@/components/newsletter";
export default async function Home() {
  const fresh = await catalog.list({ sort: "newest" }),
    featured = await catalog.list({ sort: "featured" });
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="tiny-line" /> THE EVERYDAY COLLECTION
          </div>
          <h1>
            استایل هر روزت،
            <br />
            به سبک <em>خودت.</em>
          </h1>
          <p>
            برای قرارهای ساده، قدم‌زدن‌های طولانی
            <br />و تمام لحظه‌هایی که خودت هستی.
          </p>
          <Link className="button" href="/shop">
            مشاهده محصولات <ArrowLeft size={20} />
          </Link>
          <div className="hero-bottom">
            <span>ساده. راحت. خودت.</span>
            <span dir="ltr">01 / EVERYDAY</span>
          </div>
        </div>
        <div className="hero-photo">
          <Image
            src="/images/editorial.webp"
            alt="عکس الهام‌بخش استایل روزمره؛ تصویر محصول کسرا نیست"
            width={1400}
            height={2100}
            preload
            sizes="(max-width: 760px) 100vw, 55vw"
          />
          <div className="photo-caption">
            <span>کمتر، اما با سلیقه‌تر.</span>
            <small>KASRA EDITORIAL / DEMO</small>
          </div>
          <span className="vertical-label">YOUR STYLE. YOUR STORY.</span>
        </div>
      </section>
      <section className="container category-section">
        <div className="section-head">
          <div>
            <span className="eyebrow">FIND YOUR EVERYDAY</span>
            <h2>امروز، حال‌وهوای کدوم رو داری؟</h2>
          </div>
          <Link className="text-link" href="/shop">
            همه محصولات <ArrowLeft size={17} />
          </Link>
        </div>
        <div className="category-grid">
          {categories.map((c, i) => (
            <Link
              className="category-card"
              key={c.slug}
              href={`/category/${c.slug}`}
            >
              <Image
                src={c.image}
                alt={`تصویرسازی نمونه ${c.name}`}
                width={640}
                height={840}
                sizes="(max-width: 600px) 45vw, 33vw"
              />
              <div>
                <small dir="ltr">0{i + 1} / THE EDIT</small>
                <h3>
                  {c.name} <ArrowLeft size={22} />
                </h3>
                <p>{c.subtitle}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <section className="container section">
        <div className="section-head">
          <div>
            <span className="eyebrow">JUST ARRIVED</span>
            <h2>تازه رسیده، برای تو</h2>
          </div>
          <Link href="/shop?sort=newest" className="text-link">
            دیدن همه تازه‌ها <ArrowLeft size={17} />
          </Link>
        </div>
        <ProductGrid products={fresh.products.slice(0, 4)} />
      </section>
      <section className="collection-banner container">
        <span className="eyebrow">THE ART OF EVERYDAY</span>
        <div>
          <h2>
            یک کمد ساده،
            <br />
            هزار جور خودت بودن.
          </h2>
          <p>
            رنگ‌های آرام و فرم‌های راحت؛
            <br />
            انتخاب‌هایی که دوباره و دوباره می‌پوشی.
          </p>
          <Link className="button light" href="/shop?sort=featured">
            کالکشن روزمره <ArrowLeft size={18} />
          </Link>
        </div>
        <span className="collection-word" aria-hidden="true">
          everyday.
        </span>
      </section>
      <section className="container section">
        <div className="section-head">
          <div>
            <span className="eyebrow">CURATED WITH CARE</span>
            <h2>انتخاب‌های کسرا</h2>
          </div>
          <Link className="text-link" href="/shop?sort=featured">
            کشف انتخاب‌ها <ArrowLeft size={17} />
          </Link>
        </div>
        <ProductGrid products={featured.products.slice(0, 4)} />
      </section>
      <section className="values container">
        <div>
          <Layers size={26} />
          <h3>کمتر، اما کاربردی‌تر</h3>
          <p>ترکیب‌های ساده برای روزمره تو</p>
        </div>
        <div>
          <Ruler size={26} />
          <h3>با خیال راحت انتخاب کن</h3>
          <Link href="/size-guide">راهنمای اندازه‌گیری و سایز ←</Link>
        </div>
        <div>
          <Heart size={26} />
          <h3>انتخاب‌هایت را نگه دار</h3>
          <p>یک لیست از لباس‌های محبوبت بساز</p>
        </div>
      </section>
      <Newsletter />
    </>
  );
}
