const router = require("express").Router();
const bodyParser = require("body-parser");
// Source: https://stripe.com/docs/billing/quickstart?lang=node&client=react

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const YOUR_DOMAIN = process.env.FRONTEND_ENDPOINT || "http://localhost:3000";
// import middleware
const { jwtCheck } = require("../middleware/middleware");

const User = require("../models/User");

router.post("/create-checkout-session", jwtCheck, async (req, res) => {
  const prices = await stripe.prices.list({
    lookup_keys: [req.body.lookup_key],
    expand: ["data.product"],
  });
  const session = await stripe.checkout.sessions.create({
    billing_address_collection: "auto",
    line_items: [
      {
        price: prices.data[0].id,
        // For metered billing, do not pass quantity
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `${YOUR_DOMAIN}?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${YOUR_DOMAIN}?canceled=true`,
  });

  res.json({ id: session.id, url: session.url });
});

router.post("/create-portal-session", jwtCheck, async (req, res) => {
  // For demonstration purposes, we're using the Checkout session to retrieve the customer ID.
  // Typically this is stored alongside the authenticated user in your database.
  const { session_id } = req.body;
  const checkoutSession = await stripe.checkout.sessions.retrieve(session_id);

  // This is the url to which the customer will be redirected when they are done
  // managing their billing with the portal.
  const returnUrl = `${YOUR_DOMAIN}?returnedFromPortal=true`;

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: checkoutSession.customer,
    return_url: returnUrl,
  });

  res.json({ url: portalSession.url });
});

router.post("/save-customer-id", jwtCheck, async (req, res) => {
  const { session_id, email } = req.body;
  try {
    const checkoutSession = await stripe.checkout.sessions.retrieve(session_id);

    if (!checkoutSession) {
      res.status(404).json({ message: "Checkout session not found" });
      return;
    }

    const user = await User.findOneAndUpdate(
      { email: email },
      { stripeCustomerId: checkoutSession.customer },
      { new: true }
    );

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const { password, ...others } = JSON.parse(JSON.stringify(user));

    res.status(200).json({
      ...others,
      isPlanActive: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.post(
  "/webhook",

  bodyParser.raw({ type: "application/json" }),
  async (request, response) => {
    let event;
    // Replace this endpoint secret with your endpoint's unique secret
    // If you are testing with the CLI, find the secret by running 'stripe listen'
    // If you are using an endpoint defined with the API or dashboard, look in your webhook settings
    // at https://dashboard.stripe.com/webhooks
    // Only verify the event if you have an endpoint secret defined.
    // Otherwise use the basic event deserialized with JSON.parse
    if (process.env.STRIPE_ENDPOINT_SK) {
      // Get the signature sent by Stripe
      const signature = request.headers["stripe-signature"];
      try {
        event = await stripe.webhooks.constructEvent(
          request.rawBody,
          signature,
          process.env.STRIPE_ENDPOINT_SK
        );
      } catch (err) {
        console.log(`Webhook signature verification failed.`, err.message);
        return response.sendStatus(400);
      }
    }

    if (!event) {
      console.log("No event object");
      return response.sendStatus(400);
    }

    let subscription;
    let status;

    // find user by subscription.customer

    // Handle the event
    switch (event.type) {
      case "customer.subscription.trial_will_end":
        subscription = event.data.object;
        status = subscription.status;
        console.log(`Subscription status is ${status}.`);
        // Then define and call a method to handle the subscription trial ending.
        // handleSubscriptionTrialEnding(subscription);
        break;
      case "customer.subscription.deleted":
        subscription = event.data.object;
        status = subscription.status;
        console.log(`Subscription status is ${status}.`);
        // Then define and call a method to handle the subscription deleted.
        // handleSubscriptionDeleted(subscriptionDeleted);
        break;
      case "customer.subscription.created":
        subscription = event.data.object;
        status = subscription.status;
        console.log(`Subscription status is ${status}.`);
        // Then define and call a method to handle the subscription created.
        // handleSubscriptionCreated(subscription);
        break;
      case "customer.subscription.updated":
        subscription = event.data.object;
        status = subscription.status;
        console.log(`Subscription status is ${status}.`);
        // Then define and call a method to handle the subscription update.
        // handleSubscriptionUpdated(subscription);
        break;
      default:
        // Unexpected event type
        console.log(`Unhandled event type ${event.type}.`);
    }
    // Return a 200 response to acknowledge receipt of the event
    response.send();
  }
);
module.exports = router;
