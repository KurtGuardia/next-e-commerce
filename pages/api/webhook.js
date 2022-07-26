import { initMongoose } from '../../lib/mongoose'
import { buffer } from 'micro'
import Order from '../../models/Order'

const stripe = require('stripe')(
  process.env.STRIPE_SECRET_KEY,
)

export default async function handler(req, res) {
  await initMongoose()
  const signingSecret =
    'whsec_85cbafff9fee4149ccda8a0b16be6ad358c7a0a74835f6f17b9ab5ba86870ec8'
  const payload = await buffer(request)
  const signature = req.headers['stripe-signature']
  const event = stripe.webhooks.constructEvent(
    payload,
    signature,
    signingSecret,
  )

  if (event?.type === 'checkout.session.complete') {
    const metadata = event.data?.object?.metadata
    const paymentStatus = event.data?.object?.payment_status
    if (metadata?.orderId && paymentStatus === 'paid') {
      await Order.findByIdAndUpdate(metadata.orderId, {
        paid: 1,
      })
    }
  }

  res.json('ok')
}

export const config = {
  api: {
    bodyParser: false,
  },
}
