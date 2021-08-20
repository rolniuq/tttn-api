import mongoose from "mongoose";
import Common from "../utils/Common";
import { UserDocument } from "./User.Model";

export interface OrderDocument extends mongoose.Document {
  user: UserDocument["_id"];
  status: string;
  comment: string;
  requiredDate: Date;
  shippedDate: Date;
  updatedBy: UserDocument["_id"];
  shipFee: number;
  total: number;
}

const infoGuest = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    }
  }
)

const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    status: {
      type: String,
      default: Common.status.UNCONFIRMED,
      enum: Object.values(Common.status),
    },
    comment: {
      type: String
    },
    requiredDate: {
      type: Date,
      default: Date.now()
    },
    shippedDate: {
      type: Date
    },
    updatedBy: {
      type: String
    },
    shipFee: {
      type: Number,
      default: Common.shipFee
    },
    total: {
      type: Number
    },
    infoGuest: {
      type: infoGuest,
      required: true
    }
  }
)

const Order = mongoose.model<OrderDocument>("Order", OrderSchema);

export default Order;
