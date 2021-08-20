import mongoose from "mongoose";
import { ProductDocument } from "./Product.Model";
import { UserDocument } from "./User.Model";

export interface CartDocument extends mongoose.Document {
  user: UserDocument["_id"];
  product: ProductDocument["_id"];
  quantity: number;
  total: number;
  size: string;
  isSelected: any;
}

const CartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product"
    },
    quantity: {
      type: Number,
      required: true
    },
    total: {
      type: Number
    }, 
    size: {
      type: String,
      default: "S",
      enum: ["S", "M", "L"]
    },
    isSelected: {
      type: Boolean,
      default: true
    }
  }, 
  {
    timestamps: true
  }
)

const Cart = mongoose.model<CartDocument>("Cart", CartSchema);

export default Cart;

