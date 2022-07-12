import Product from '../../models/Product'
const stripe = require('stripe')(
  process.env.STRIPE_SECRET_KEY,
)

import { initMongoose } from '../../lib/mongoose'

export default async function handler(req, res) {
  await initMongoose()

  if (req.method !== 'POST') {
    res.json("should a post but it's not!")
    return
  }

  const { email, name, address, city } = req.body
  const productsIds = req.body.products.split(',')
  const uniqIds = [...new Set(productsIds)]
  const products = await Product.find({
    _id: { $in: uniqIds },
  }).exec()

  let line_items = []
  for (const productId of uniqIds) {
    const quantity = productsIds.filter(
      (id) => id === productId,
    ).length
    const product = products.find(
      (p) => p._id.toString() === productId,
    )
    line_items.push({
      quantity,
      price_data: {
        currency: 'USD',
        product_data: { name: product.name },
        unit_amount: product.price * 100,
      },
    })
  }

  const session = await stripe.checkout.sessions.create({
    line_items,
    mode: 'payment',
    CustomElementRegistry_email: email,
    success_url: `${req.headers.origin}/?success=true`,
    cancel_url: `${req.headers.origin}/?canceled=true`,
  })
  res.redirect(303, session.url)

  res.json(req.method)
}
