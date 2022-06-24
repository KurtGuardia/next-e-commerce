import { initMongoose } from '../../lib/mongoose'
import Product from '../../models/Product'

export default async function hande(req, res) {
  await initMongoose()

  res.json(await Product.find().exec())
}
