import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/catalog";
import { money, discount, digits } from "@/lib/format";
import { WishButton } from "./wish-button";
export function ProductCard({
  product: p,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  const available = p.variants.some((v) => v.stock > 0);
  return (
    <article className="product-card" data-price={p.price}>
      <div className="product-image">
        <Link
          href={`/product/${p.slug}`}
          prefetch={false}
          tabIndex={-1}
          aria-hidden="true"
        >
          <Image
            src={p.images[0]}
            preload={priority}
            fetchPriority={priority ? "high" : undefined}
            alt={`تصویر نمونه ${p.name}`}
            width={640}
            height={840}
            sizes="(max-width: 600px) 48vw, (max-width: 1000px) 32vw, 24vw"
          />
        </Link>
        <WishButton id={p.id} name={p.name} />
        {!available ? (
          <span className="badge">ناموجود</span>
        ) : p.compareAt ? (
          <span className="badge sale">
            {digits(discount(p.price, p.compareAt))}٪ تخفیف نمونه
          </span>
        ) : (
          <span className="badge">کالکشن تازه</span>
        )}
        <Link
          className="quick-view"
          href={`/product/${p.slug}`}
          prefetch={false}
        >
          انتخاب رنگ و سایز <span>↖</span>
        </Link>
      </div>
      <div className="card-info">
        <div className="swatches">
          {p.colors.map((c) => (
            <span
              key={c.id}
              style={{ backgroundColor: c.hex }}
              title={c.name}
            />
          ))}
        </div>
        <h3>
          <Link href={`/product/${p.slug}`} prefetch={false}>
            {p.name}
          </Link>
        </h3>
        <div className="price">
          <span>{money(p.price)}</span>
          {p.compareAt && <del>{money(p.compareAt)}</del>}
        </div>
      </div>
    </article>
  );
}
export function ProductGrid({
  products,
  prioritizeFirst = false,
}: {
  products: Product[];
  prioritizeFirst?: boolean;
}) {
  return (
    <div className="product-grid">
      {products.map((p, index) => (
        <ProductCard
          key={p.id}
          product={p}
          priority={prioritizeFirst && index === 0}
        />
      ))}
    </div>
  );
}
