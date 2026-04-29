import RazorPay from 'razorpay'
import { config } from '../../config/config.js'

const razorpay = new RazorPay({
 key_id: config.RAZORPAY_KEY_ID,
 key_secret: config.RAZORPAY_KEY_SECRET
})


export async function createOrder({amount,currency="INR"}) {
  const options = {
   amount: amount*100, // Razorpay uses the smallest unitof  amount means if amount is 100rs but razorpay get this 1oopaise thats why we are multiply by 100 to  create this in rupee
   currency
  }
  const order = await razorpay.orders.create(options)
  return order;
}