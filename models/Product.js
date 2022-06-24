import { model, models, Schema } from 'mongoose'

const ProductShema = new Schema({
  name: String,
  description: String,
  price: Number,
  category: String,
  picture: String,
})

const Product =
  models?.Product || model('Product', ProductShema)

export default Product
