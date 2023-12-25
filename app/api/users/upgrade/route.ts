import { currentUser } from "@/lib/current-user";
import { db } from "@/lib/db";
import { stripeInstance } from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  try {
    const user = await currentUser();
    const { session_id } = await req.json();
    if (!user || !session_id) throw new Error();

    const session = await stripeInstance.checkout.sessions.retrieve(session_id);

    if (session.payment_status !== "paid") throw new Error();

    await db.user.update({
      where: { id: user.id },
      data: {
        tier: "PREMIUM",
      },
    });

    return NextResponse.json({ status: "OK" });
  } catch (err) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
