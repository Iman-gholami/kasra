import { test } from "node:test";
import assert from "node:assert/strict";
import { catalog, PAGE_SIZE } from "../src/lib/catalog";
import { products } from "../src/data/products";
import { normalize, latinDigits, money } from "../src/lib/format";
import { validateCheckout, type CheckoutFields } from "../src/lib/checkout";
test("36 unique coherent products and valid inventory", () => {
  assert.equal(products.length, 36);
  assert.equal(new Set(products.map((p) => p.id)).size, 36);
  for (const p of products) {
    assert.ok(!p.compareAt || p.compareAt > p.price);
    assert.equal(p.variants.length, p.colors.length * p.sizes.length);
    for (const v of p.variants) {
      assert.ok(v.stock >= 0);
      assert.ok(p.colors.some((c) => c.id === v.color));
    }
  }
});
test("adapter paginates without duplicating records", async () => {
  const first = await catalog.list({}),
    second = await catalog.list({ page: "2" });
  assert.equal(first.products.length, PAGE_SIZE);
  assert.equal(first.total, 36);
  assert.equal(first.pages, 3);
  assert.ok(
    !second.products.some((p) => first.products.some((f) => f.id === p.id)),
  );
  assert.equal((await catalog.list({ page: "999" })).page, 3);
  assert.equal((await catalog.list({ page: "-1" })).page, 1);
  assert.equal((await catalog.list({ page: "nonsense" })).page, 1);
});
test("normalization and category search", async () => {
  assert.equal(normalize("تيشرت"), normalize("تیشرت"));
  assert.equal(normalize("كیف"), normalize("کیف"));
  assert.equal(latinDigits("۰۹۱٢٣"), "09123");
  assert.equal((await catalog.list({ q: "تيشرت" })).total, 12);
  assert.equal((await catalog.list({ q: "no-match" })).total, 0);
});
test("filters intersect at available variant level", async () => {
  const result = await catalog.list({
    category: "shomiz",
    size: "XL",
    color: "cream",
    available: "1",
  });
  for (const p of result.products)
    assert.ok(
      p.variants.some(
        (v) => v.size === "XL" && v.color === "cream" && v.stock > 0,
      ),
    );
  assert.ok(!result.products.some((p) => p.id === "shomiz-1"));
  assert.equal((await catalog.list({ category: "manto" })).total, 12);
});
test("price filters accept Persian digits and sort in both directions", async () => {
  const result = await catalog.list({
    min: "۵۰۰۰۰۰",
    max: "۱۰۰۰۰۰۰",
    sort: "price-asc",
  });
  assert.ok(
    result.products.every((p) => p.price >= 500000 && p.price <= 1000000),
  );
  assert.deepEqual(
    result.products.map((p) => p.price),
    result.products.map((p) => p.price).sort((a, b) => a - b),
  );
  const desc = await catalog.list({ sort: "price-desc" });
  assert.deepEqual(
    desc.products.map((p) => p.price),
    desc.products.map((p) => p.price).sort((a, b) => b - a),
  );
});
test("discount and availability filters only expose qualifying records", async () => {
  for (const p of (await catalog.list({ sale: "1", available: "1" }))
    .products) {
    assert.ok(p.compareAt && p.compareAt > p.price);
    assert.ok(p.variants.some((v) => v.stock > 0));
  }
  assert.equal((await catalog.list({ available: "1" })).total, 33);
});
test("lookup and selected IDs are bounded and exact", async () => {
  assert.equal((await catalog.get("shomiz-1"))?.id, "shomiz-1");
  assert.equal(await catalog.get("missing"), undefined);
  assert.equal((await catalog.byIds(["shomiz-1", "missing"])).length, 1);
});
const valid: CheckoutFields = {
  name: "کاربر آزمایشی",
  phone: "۰۹۱۲۳۴۵۶۷۸۹",
  province: "تهران",
  city: "تهران",
  address: "خیابان نمونه، پلاک ۱۲",
  postal: "۱۲۳۴۵۶۷۸۹۰",
  notes: "",
};
test("checkout accepts localized sample phone/postal and rejects incomplete fields", () => {
  assert.deepEqual(validateCheckout(valid), {});
  const errors = validateCheckout({
    ...valid,
    name: "",
    phone: "0912",
    postal: "1111111111",
    province: "",
    city: "",
    address: "کوتاه",
  });
  assert.equal(Object.keys(errors).length, 6);
  assert.ok(validateCheckout({ ...valid, phone: "08123456789" }).phone);
  assert.ok(validateCheckout({ ...valid, postal: "123456789" }).postal);
});
test("currency uses Toman and Persian grouping", () => {
  assert.equal(money(1380000), "۱٬۳۸۰٬۰۰۰ تومان");
});
