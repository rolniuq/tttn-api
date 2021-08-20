import mongoose from "mongoose";
import Common from "../utils/Common";
import { OrderDocument } from "./Order.Model";
import { ProductDocument } from "./Product.Model";

export interface OrderDetailDocument extends mongoose.Document {
  order: OrderDocument["_id"];
  product: ProductDocument["_id"];
  quantity: number;
  size: string;
  price: number;
  note: string;
}

const OrderDetailSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order"
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product"
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    size: {
      type: String,
      required: true,
      default: Common.size_product.S,
      enum: Object.values(Common.size_product)
    },
    price: {
      type: Number,
    },
    note: {
      type: String
    }
  },
  {
    timestamps: true
  }
)

const OrderDetail = mongoose.model<OrderDocument>("OrderDetail", OrderDetailSchema);

export default OrderDetail;
