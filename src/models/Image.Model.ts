import { ProductDocument } from "./Product.Model";
import mongoose from "mongoose";

export interface ImageDocument extends mongoose.Document {
  product: ProductDocument["_id"];
  name: string;
}

const ImageSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  name: {
    type: String,
  },
});

const Image = mongoose.model<ImageDocument>("Image", ImageSchema);

export default Image;
