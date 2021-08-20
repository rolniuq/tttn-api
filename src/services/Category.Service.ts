import {
  DocumentDefinition,
  FilterQuery,
  QueryOptions,
  UpdateQuery,
} from "mongoose";
import Category, { CategoryDocument } from "../models/Category.Model";

export const CreateCategory = async (
  input: DocumentDefinition<CategoryDocument>
) => {
  try {
    return await Category.create(input);
  } catch (e) {
    throw new Error("Error create category");
  }
};

export const FindCategory = async (query: FilterQuery<CategoryDocument>) => {
  return await Category.findOne(query).lean();
};

export const FindNameCategory = async (
  query: FilterQuery<CategoryDocument>
) => {
  return await Category.findById(query).select("name");
};

export const GetListCategory = async (query: FilterQuery<CategoryDocument>) => {
  return await Category.find(query);
};

export const GetListCategorySortedByName = async (by: number) => {
  return await Category.aggregate([{ $sort: { name: by } }]);
};

export const UpdateCategory = async (
  query: FilterQuery<CategoryDocument>,
  update: UpdateQuery<CategoryDocument>,
  options: QueryOptions
) => {
  return Category.findOneAndUpdate(query, update, options);
};

export const DeleteCategory = async (query: FilterQuery<CategoryDocument>) => {
  return Category.findOneAndRemove(query);
};

export const TypeIsSuitable = (type: string) => {
  if (type !== "increment" && type !== "decrement") {
    return false;
  }
  return true;
}

export const GetTypeSort = (type: string) => {
  if (type === "increment" ) {
    return 1;
  }
  return -1;
}
