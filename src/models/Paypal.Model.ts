import mongoose from "mongoose";
import { OrderDocument } from "./Order.Model";
import { UserDocument } from "./User.Model";

export interface PaypalProps {
  product: string;
  quantity: number;
  size: string;
}

export interface PaypalDocument extends mongoose.Document {
  order: OrderDocument["_id"];
  user: UserDocument["_id"];
  orderID: string;
}

const PaypalSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  orderID: {
    type: String,
    required: true,
  },
});

const Paypal = mongoose.model<PaypalDocument>("Paypal", PaypalSchema);

export default Paypal;
