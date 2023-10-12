const User = require("../models/User");

function getUser(email) {
  const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
  return User.findOne({ email: email }).then((user) => {
    if (!user) {
      throw new Error("User not found");
    }

    const { password, ...userData } = JSON.parse(JSON.stringify(user));
    if (userData.stripeCustomerId) {
      // check if its a valid customer
      return stripe.customers
        .retrieve(userData.stripeCustomerId)
        .then(() => {
          // check if the customer is subscribed to us
          return stripe.subscriptions
            .list({
              customer: userData.stripeCustomerId,
              limit: 1,
            })
            .then((subscription) => {
              if (subscription.data.length > 0) {
                userData.isPlanActive =
                  subscription.data[0].status === "active";
              } else {
                userData.isPlanActive = false;
              }
              return stripe.checkout.sessions.list({
                customer: userData.stripeCustomerId,
                limit: 1,
              });
            })
            .then((session) => {
              if (session.data.length > 0) {
                userData.session_id = session.data[session.data.length - 1].id;
              }
              return Promise.resolve(userData);
            });
        })
        .catch((err) => {
          console.log(
            "This customer does not exist. Deleting customer id from user"
          );
          userData.stripeCustomerId = null;
          return User.updateOne(
            { email: userData.email },
            { stripeCustomerId: null }
          ).then(() => {
            return Promise.resolve(userData);
          });
        });
    } else {
      return Promise.resolve(userData);
    }
  });
}

exports.getUser = getUser;
