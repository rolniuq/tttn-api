import mongoose from "mongoose";

export interface CategoryDocument extends mongoose.Document {
  name: string;
  createdBy: string;
  updatedBy: string;
}

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true
    },
    createdBy: {
      type: String,
    },
    updatedBy: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

const Category = mongoose.model<CategoryDocument>("Category", CategorySchema);

export default Category;
