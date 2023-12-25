import { NextResponse } from "next/server";
import { stripeInstance } from "@/lib/stripe";

export async function POST(req: Request) {
  try {
    const host = process.env.NEXT_PUBLIC_HOST || "";

    const stripe = stripeInstance;
    const date = new Date().toISOString();
    const { amount } = await req.json();

    if (!amount)
      return new NextResponse("Internal Server Error", { status: 500 });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "CLOUD_PREMIUM" + date,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      billing_address_collection: "auto",
      shipping_address_collection: {
        allowed_countries: [],
      },
      cancel_url: `${host}/dashboard/home`,
      success_url: `${host}/stripe/success/{CHECKOUT_SESSION_ID}`,
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (err) {
    console.log(err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
