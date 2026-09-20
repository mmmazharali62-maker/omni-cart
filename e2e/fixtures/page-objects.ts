import type { Page, Locator } from "@playwright/test";

// Page objects (spec section 26): keep selectors in one place.
export class ShopPage {
  constructor(private page: Page) {}

  async open() {
    await this.page.goto("/shop");
  }

  async search(q: string) {
    await this.page.getByRole("searchbox").first().fill(q);
    await this.page.keyboard.press("Enter");
  }

  productCard(slug: string): Locator {
    return this.page.locator(`[data-product-slug="${slug}"]`);
  }

  async filterInStockOnly() {
    await this.page.getByLabel("In stock only").check();
  }

  async sortBy(option: string) {
    await this.page.getByLabel("Sort products").selectOption(option);
  }
}

export class CartPage {
  constructor(private page: Page) {}

  async open() {
    await this.page.goto("/cart");
  }

  async checkout() {
    await this.page.getByRole("link", { name: /checkout/i }).first().click();
  }

  async quantityOf(title: string): Promise<number> {
    const row = this.page.locator("li, tr", { hasText: title }).first();
    return Number(await row.locator("input").inputValue());
  }
}

export class TrackOrderPage {
  constructor(private page: Page) {}

  async open() {
    await this.page.goto("/track-order");
  }

  async track(number: string) {
    await this.page.getByLabel("Tracking number").fill(number);
    await this.page.getByRole("button", { name: "Track" }).click();
  }
}
