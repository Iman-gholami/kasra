import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
async function addFirst(page: Page) {
  await page.goto("/product/shomiz-1");
  await page.getByRole("button", { name: "شیری", exact: true }).click();
  await page.getByRole("button", { name: "سایز S", exact: true }).click();
  await page
    .getByRole("button", { name: "افزودن به سبد خرید", exact: true })
    .click();
  await expect(page.getByText("به سبد خریدت اضافه شد.")).toBeVisible();
}
test("homepage, category, and accessible structure", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "استایل هر روزت",
  );
  await page.locator(".category-card").filter({ hasText: "شومیز" }).click();
  await expect(page).toHaveURL(/category\/shomiz/);
  await expect(page.locator(".product-card")).toHaveCount(12);
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
  expect(errors).toEqual([]);
});
test("search normalizes Arabic letters and supports no results", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "جست‌وجو", exact: true }).click();
  await page.getByLabel("جست‌وجوی محصول").fill("تيشرت");
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "جست‌وجو", exact: true })
    .click();
  await expect(page.locator(".product-card")).toHaveCount(12);
  await page.goto("/search?q=zzzz-no-match");
  await expect(page.getByText("هنوز چیزی پیدا نکردیم")).toBeVisible();
});
test("filter, URL persistence, sorting, pagination and back navigation", async ({
  page,
}) => {
  await page.goto("/shop");
  await page.getByRole("button", { name: /فیلتر و مرتب‌سازی/ }).click();
  await page.getByLabel("دسته‌بندی").selectOption("tshirt");
  await page
    .getByRole("combobox", { name: /مرتب‌سازی/ })
    .selectOption("price-asc");
  await page.getByRole("button", { name: "اعمال فیلترها" }).click();
  await expect(page).toHaveURL(/category=tshirt/);
  let prices = await page
    .locator(".product-card")
    .evaluateAll((cards) =>
      cards.map((c) => Number(c.getAttribute("data-price"))),
    );
  expect(prices).toEqual([...prices].sort((a, b) => a - b));
  expect(prices).toHaveLength(12);
  await page.reload();
  await expect(page.locator(".product-card")).toHaveCount(12);
  await page.getByRole("button", { name: /فیلتر و مرتب‌سازی/ }).click();
  await page
    .getByRole("combobox", { name: /مرتب‌سازی/ })
    .selectOption("price-desc");
  await page.getByRole("button", { name: "اعمال فیلترها" }).click();
  prices = await page
    .locator(".product-card")
    .evaluateAll((cards) =>
      cards.map((c) => Number(c.getAttribute("data-price"))),
    );
  expect(prices).toEqual([...prices].sort((a, b) => b - a));
  await page.goto("/shop");
  await page.getByRole("link", { name: "بعدی", exact: false }).click();
  await expect(page).toHaveURL(/page=2/);
  await page.goBack();
  await expect(page).not.toHaveURL(/page=2/);
});
test("selection required, stock disabled, and cart variant totals persist", async ({
  page,
}) => {
  await page.goto("/product/shomiz-1");
  await page
    .getByRole("button", { name: "افزودن به سبد خرید", exact: true })
    .click();
  await expect(
    page.getByText("اول رنگ و سایز دلخواهت را انتخاب کن."),
  ).toBeVisible();
  await page.getByRole("button", { name: "شیری", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "سایز XL ناموجود", exact: true }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "سایز S", exact: true }).click();
  await page
    .getByRole("button", { name: "افزودن به سبد خرید", exact: true })
    .click();
  await page.getByRole("button", { name: "مشکی", exact: true }).click();
  await page.getByRole("button", { name: "سایز M", exact: true }).click();
  await page
    .getByRole("button", { name: "افزودن به سبد خرید", exact: true })
    .click();
  await page.goto("/cart");
  await expect(page.locator(".cart-line")).toHaveCount(2);
  await expect(page.getByTestId("cart-total")).toHaveText("۱٬۳۸۰٬۰۰۰ تومان");
  await page
    .getByRole("button", { name: /افزایش تعداد/ })
    .first()
    .click();
  await expect(page.getByTestId("cart-total")).toHaveText("۲٬۰۷۰٬۰۰۰ تومان");
  await page.reload();
  await expect(page.getByTestId("cart-total")).toHaveText("۲٬۰۷۰٬۰۰۰ تومان");
  await page
    .getByRole("button", { name: /حذف شومیز/ })
    .last()
    .click();
  await expect(page.getByTestId("cart-total")).toHaveText("۱٬۳۸۰٬۰۰۰ تومان");
  await page.getByRole("button", { name: /کاهش تعداد/ }).click();
  await expect(page.getByTestId("cart-total")).toHaveText("۶۹۰٬۰۰۰ تومان");
  await page.getByRole("button", { name: /حذف شومیز/ }).click();
  await expect(page.getByText("سبدت هنوز خالیه")).toBeVisible();
});
test("sold-out product cannot be added", async ({ page }) => {
  await page.goto("/product/shomiz-12");
  for (const size of ["S", "M", "L", "XL"])
    await expect(
      page.getByRole("button", { name: `سایز ${size} ناموجود`, exact: true }),
    ).toBeDisabled();
  await page
    .getByRole("button", { name: "افزودن به سبد خرید", exact: true })
    .click();
  await page.goto("/cart");
  await expect(page.getByText("سبدت هنوز خالیه")).toBeVisible();
});
test("wishlist persists across routes and refresh", async ({ page }) => {
  await page.goto("/product/shomiz-1");
  await page
    .locator(".product-info")
    .getByRole("button", { name: /افزودن به علاقه‌مندی‌ها/ })
    .click();
  await page.goto("/wishlist");
  await expect(page.locator(".product-card")).toHaveCount(1);
  await page.reload();
  await expect(page.locator(".product-card")).toHaveCount(1);
  await page.getByRole("button", { name: /حذف از علاقه‌مندی‌ها/ }).click();
  await expect(page.getByText("اینجا جای انتخاب‌های محبوب توست")).toBeVisible();
});
test("checkout validates then confirms demo without persisting personal information", async ({
  page,
}) => {
  await addFirst(page);
  await page.goto("/checkout");
  await page.getByRole("button", { name: "تأیید سفارش نمایشی" }).click();
  await expect(
    page.getByText("نام و نام خانوادگی را کامل بنویس."),
  ).toBeVisible();
  await expect(page.getByLabel("نام و نام خانوادگی")).toBeFocused();
  await page.getByLabel("نام و نام خانوادگی").fill("کاربر آزمایشی");
  await page.getByLabel("شماره همراه").fill("۰۹۱۲۳۴۵۶۷۸۹");
  await page.getByLabel("استان", { exact: true }).selectOption("تهران");
  await page.getByLabel("شهر", { exact: true }).fill("تهران");
  await page
    .getByLabel("نشانی کامل")
    .fill("خیابان نمونه، کوچه آزمایشی، پلاک ۱۲");
  await page.getByLabel("کد پستی").fill("۱۲۳۴۵۶۷۸۹۰");
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
  await page.getByRole("button", { name: "تأیید سفارش نمایشی" }).click();
  await expect(page).toHaveURL(/order-confirmation/);
  await expect(
    page.getByRole("heading", { name: "تجربه خریدت کامل شد" }),
  ).toBeVisible();
  const stored = await page.evaluate(() =>
    JSON.stringify({ ...localStorage, ...sessionStorage }),
  );
  expect(stored).not.toContain("کاربر آزمایشی");
  expect(stored).not.toContain("۰۹۱۲۳۴۵۶۷۸۹");
  await page.goto("/cart");
  await expect(page.getByText("سبدت هنوز خالیه")).toBeVisible();
});
test("mobile navigation and modal keyboard focus", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "باز کردن منو" });
  await trigger.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await page
    .getByRole("dialog")
    .getByRole("link", { name: "مانتو", exact: true })
    .click();
  await expect(page).toHaveURL(/category\/manto/);
});
for (const width of [320, 375, 390, 430, 768, 1024, 1440])
  test(`responsive overflow ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const route of [
      "/",
      "/shop",
      "/product/shomiz-1",
      "/cart",
      "/checkout",
      "/size-guide",
    ]) {
      await page.goto(route);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBeTruthy();
    }
  });
test("all supporting routes and custom 404 render", async ({ page }) => {
  for (const route of [
    "/about",
    "/contact",
    "/faq",
    "/shipping-and-returns",
    "/size-guide",
    "/account",
  ]) {
    const r = await page.goto(route);
    expect(r?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  }
  expect((await page.goto("/missing-page"))?.status()).toBe(404);
});

test("mobile purchase controls follow variant choices without covering the title", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/product/shomiz-1");
  const title = await page.locator(".product-info h1").boundingBox();
  const sizes = await page.locator(".size-options").boundingBox();
  const purchase = await page.locator(".purchase").boundingBox();
  expect(title).not.toBeNull();
  expect(sizes).not.toBeNull();
  expect(purchase).not.toBeNull();
  expect(purchase!.y).toBeGreaterThanOrEqual(sizes!.y + sizes!.height);
  expect(purchase!.y).toBeGreaterThan(title!.y + title!.height);
});
