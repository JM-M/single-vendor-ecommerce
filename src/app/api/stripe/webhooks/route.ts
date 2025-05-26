import { stripe } from "@/lib/stripe";
import { ExpandedLineItem } from "@/modules/checkout/types";
import config from "@/payload.config";
import { NextResponse } from "next/server";
import { getPayload } from "payload";
import type { Stripe } from "stripe";

export async function POST(req: Request) {
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      await (await req.blob()).text(),
      req.headers.get("stripe-signature") || "",
      process.env.STRIPE_WEBHOOK_SECRET as string,
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    if (error! instanceof Error) {
      console.error(error);
    }
    console.error(`❌ Stripe webhook error: ${errorMessage}`);

    return NextResponse.json(
      {
        message: `Webhook Error: ${errorMessage}`,
      },
      { status: 400 },
    );
  }

  console.log(`✅ Stripe webhook event received: ${event.id} | ${event.type}`);

  const permittedEvents: string[] = ["checkout.session.completed"];

  const payload = await getPayload({ config });

  if (permittedEvents.includes(event.type)) {
    let data;

    try {
      switch (event.type) {
        case "checkout.session.completed":
          data = event.data.object as Stripe.Checkout.Session;

          if (!data.metadata?.userId) {
            console.warn("⚠️ No userId found in metadata");
            throw new Error("User ID is required.");
          }

          const user = await payload.findByID({
            collection: "users",
            id: data.metadata.userId,
          });

          if (!user) {
            console.warn(`⚠️ User not found with ID: ${data.metadata.userId}`);
            throw new Error("User not found.");
          }

          const expandedSession = await stripe.checkout.sessions.retrieve(
            data.id,
            {
              expand: ["line_items.data.price.product"],
            },
          );

          if (!expandedSession.line_items?.data.length) {
            console.warn("⚠️ No line items found in session");
            throw new Error("No line items found in session.");
          }

          const lineItems = expandedSession.line_items
            .data as ExpandedLineItem[];

          for (const item of lineItems) {
            await payload.create({
              collection: "orders",
              data: {
                stripeCheckoutSessionId: data.id,
                user: user.id,
                product: item.price.product.metadata.id,
                name: item.price.product.name,
              },
            });
          }
          break;
        default:
          console.warn(`⚠️ Unhandled event type: ${event.type}`);
          throw new Error(`Unhandled event type: ${event.type}`);
      }
    } catch (error) {
      console.log(error);
      return NextResponse.json(
        {
          message: "Webhook handler failed",
        },
        {
          status: 500,
        },
      );
    }
  }

  return NextResponse.json({ message: "Recieved" }, { status: 200 });
}
