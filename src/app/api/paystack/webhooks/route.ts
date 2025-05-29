import crypto from "crypto";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  let event: any;

  const body = await req.json();
  console.log("Request body: ", body);
  const hash = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!)
    .update(JSON.stringify(body))
    .digest("hex");

  if (hash === req.headers.get("x-paystack-signature")) {
    event = body.event;
    console.log("Event: ", event);

    const permittedEvents = ["charge.success"];

    if (permittedEvents.includes(event)) {
      switch (event) {
        case "charge.success":
          const data = body.data;
          const amount = data?.amount;

          // TODO: Compare amount with order amount and update order status
          console.log("✅ Payment recieved: ", amount);
          break;

        default:
          break;
      }
    }
  }

  return NextResponse.json({ message: "Recieved" }, { status: 200 });
}
