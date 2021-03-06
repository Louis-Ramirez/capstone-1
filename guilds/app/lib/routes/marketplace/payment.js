const express = require('express');
// const stripe = require('stripe')('sk_test_zlDbmmvqhO05kEFUcfFDRzGX00yMAVDGIv');
const bodyParser = require('body-parser'); // already declared
const exphbs = require('express-handlebars');
let Listing = require('../../models/Listing').Listing;
let Payment = require('../../models/Payments').Payment;

const cors = require("cors");
const stripe = require("stripe")("sk_test_zlDbmmvqhO05kEFUcfFDRzGX00yMAVDGIv");
const { uuid } = require("uuidv4");

const app = express();

const auth = require('../../middleware/auth');

// middleware
app.use(express.json());
app.use(cors());

// Testing route
app.get("/", (req, res) => {
  res.send("Add your Stripe Secret Key to the .require('stripe') statement!");
});


// post payment to Stripe
app.post('/charge', auth, async (req, res) => {
  console.log(req.user.id,"Request:", req.body);

  let error;
  let status;
  try {    
    const { product, token } = req.body;

    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id
    });

    const idempotency_key = uuid();
    const charge = await stripe.charges.create(
      {
        amount: product.formatted_price * 100,
        currency: "usd",
        customer: customer.id,
        receipt_email: token.email,
        description: `Purchased the ${product.name}`,
        shipping: {
          name: token.card.name,
          address: {
            line1: token.card.address_line1,
            line2: token.card.address_line2,
            city: token.card.address_city,
            country: token.card.address_country,
            postal_code: token.card.address_zip
          }
        }
      },
      {
        idempotency_key
      }
    );
    console.log("Charge:", { charge });
    status = "success";

    final_charge = {
      charge: charge,
      borrower_id: req.user.id, // a lender is never going to be paying for something
      listing_id: product.listingid,
      listing_type: product.listing_type,
      lender_id: product.lenderid
    }

    payresult = await Payment.newPayment([final_charge],res)
    console.log('created payment in db')
  } catch (error) {
    console.error("Error:", error);
    status="failure";
  }
  res.json({error, status});
});

module.exports = app;
