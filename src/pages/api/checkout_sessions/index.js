import { PrismaClient } from '@prisma/client';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const prisma = new PrismaClient()

async function CreateStripeSession(req, res) {
  const { order } = req.body;

  const orders = await prisma.order.findUnique({
    where: {
      id: order.id
    },
    include: {
      customizedProducts: true,
      Customer: true
    }
  })
  
  const price = await prisma.customizedProduct.findMany({
    where: {
      id: {
        in: orders.customizedProducts.map(product => product.customizedProductId)
      }
    },
    include: {
      Product: true
    }
  })
  const totalPrice = price.reduce((prev, { amount, Product }) => prev + amount * (Product.price ?? 0), 0);

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: 'eur',
          unit_amount: totalPrice * 100,
          product: 'prod_NbQs2J9EZvE2nC'
        },
        quantity: 1,
      },
    ],
    customer_email: orders.Customer.email,
    mode: 'payment',
    success_url: `${req.headers.origin}/?success=true`,
    cancel_url: `${req.headers.origin}/?canceled=true`,
  });

  res.json({ id: session.id });
}

export default CreateStripeSession;