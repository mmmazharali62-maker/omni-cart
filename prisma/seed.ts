// Seed: two suppliers, two categories, a few demo products.
// Run with `npm run db:seed` after `prisma migrate dev`.
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  const cj = await db.supplier.upsert({
    where: { id: "supplier-cj" },
    update: {},
    create: { id: "supplier-cj", name: "CJ_DROPSHIPPING", displayName: "CJ Dropshipping", isActive: true }
  });
  const ali = await db.supplier.upsert({
    where: { id: "supplier-aliexpress" },
    update: {},
    create: { id: "supplier-aliexpress", name: "ALIEXPRESS", displayName: "AliExpress", isActive: true }
  });

  const kitchen = await db.category.upsert({
    where: { slug: "kitchen" },
    update: {},
    create: { name: "Kitchen", slug: "kitchen" }
  });
  const tech = await db.category.upsert({
    where: { slug: "tech-accessories" },
    update: {},
    create: { name: "Tech Accessories", slug: "tech-accessories" }
  });

  const products = [
    { slug: "demo-silicone-spatula-set", title: "Silicone Spatula Set (5 pcs)", category: kitchen.id, price: 14.99 },
    { slug: "demo-magnetic-phone-mount", title: "Magnetic Car Phone Mount", category: tech.id, price: 12.5 },
    { slug: "demo-led-desk-lamp", title: "Rechargeable LED Desk Lamp", category: tech.id, price: 24.99 },
    { slug: "demo-knife-sharpener", title: "2-Stage Knife Sharpener", category: kitchen.id, price: 9.99 }
  ];

  for (const p of products) {
    await db.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        slug: p.slug,
        title: p.title,
        description: `Demo product seeded for development. ${p.title} - full description will be imported from the supplier via one-click import.`,
        categoryId: p.category,
        images: [],
        basePrice: p.price,
        currency: "USD",
        status: "active",
        variants: {
          create: [{ sku: `DEMO-${p.slug.toUpperCase().slice(0, 12)}`, options: { default: "standard" }, price: p.price, stock: 50, inventory: { create: { quantity: 50 } } }]
        }
      }
    });
  }

  console.log("Seeded suppliers:", cj.displayName, "+", ali.displayName, "and", products.length, "products");
}

main().finally(() => db.$disconnect());
