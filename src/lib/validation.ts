import { z } from "zod";

// Zod schemas shared between API routes and client forms (spec section 17).

export const addToCartSchema = z.object({
  variantId: z.string().min(1),
  quantity: z.number().int().positive().max(99)
});

export const addressSchema = z.object({
  fullName: z.string().min(2).max(120),
  line1: z.string().min(3).max(200),
  line2: z.string().max(200).optional(),
  city: z.string().min(1).max(100),
  state: z.string().max(100).optional(),
  postalCode: z.string().min(2).max(20),
  country: z.enum(["US", "GB"]),
  phone: z.string().max(30).optional()
});

export const checkoutSchema = z.object({
  items: z.array(addToCartSchema).min(1),
  email: z.string().email(),
  shippingAddress: addressSchema,
  billingAddress: addressSchema.optional(),
  shippingMethod: z.enum(["standard", "express"]),
  couponCode: z.string().max(40).optional()
});

export const supplierImportSchema = z.object({
  supplierProductId: z.string().min(3).max(500)
});

export const reviewSchema = z.object({
  productId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  title: z.string().max(120).optional(),
  body: z.string().max(4000).optional()
});
