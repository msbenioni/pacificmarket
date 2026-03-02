import Stripe from "stripe";

export async function POST(request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2024-04-10",
  });
  const body = await request.json();
  const { priceId, successUrl, cancelUrl, customerEmail, metadata } = body;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: customerEmail,
      metadata,
    });

    return Response.json({ url: session.url });
  } catch (error) {
    return new Response(error.message || "Stripe error", { status: 500 });
  }
}
