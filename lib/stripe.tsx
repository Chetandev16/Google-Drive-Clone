import { Stripe } from "stripe";

declare global {
  var stripe: Stripe | undefined;
}

const stripeKey = process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY || "";

export const stripeInstance = globalThis.stripe || new Stripe(stripeKey);
