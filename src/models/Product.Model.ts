import mongoose from "mongoose";
import { CategoryDocument } from "./Category.Model";

export interface ProductDocument extends mongoose.Document {
  name: string;
  price: number;
  description: string;
  category: CategoryDocument["_id"];
  createdBy: string;
  updatedBy: string;
  updatedAt: Date;
}

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
    },
    price: {
      type: Number,
      required: true
    },
    description: {
      type: String
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category"
    },
    createdBy: {
      type: String
    },
    updatedBy: {
      type: String
    }
  },
  {
    timestamps: true
  }
)

const Product = mongoose.model("Product", ProductSchema);

export default Product;
