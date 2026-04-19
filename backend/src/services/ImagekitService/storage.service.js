import Imagekit from '@imagekit/nodejs'
import { config } from '../../config/config.js'

const imageKitClient = new Imagekit({
 privateKey: config.IMAGEKIT_PRIVATE_KEY
})

export async function storeImage(product) {
 const response = await imageKitClient.files.upload({
  file: await Imagekit.toFile(product.buffer),
  fileName:product.originalname,
  folder:'Snitch/'
 })
 return response;
}