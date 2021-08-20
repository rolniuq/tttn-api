import { Request, Response } from "express";
import {
  CreateCategory,
  DeleteCategory,
  FindCategory,
  GetListCategory,
  GetListCategorySortedByName,
  UpdateCategory,
  TypeIsSuitable,
  GetTypeSort,
} from "../services/Category.Service";
import { get } from "lodash";
import { FindUser, GetUserID } from "../services/User.Service";
import { FindProduct } from "../services/Product.Service";

export const CreateCategoryHandler = async (req: Request, res: Response) => {
  try {
    const category = await CreateCategory(req.body);

    const userID = await GetUserID(req);
    const result = await UpdateCategory(
      { _id: category._id },
      {
        createdBy: userID,
        updatedBy: userID,
      },
      {
        new: true,
      }
    );

    return res.status(200).json({ result });
  } catch (e) {
    return res.sendStatus(409);
  }
};

export const GetCategoryHandler = async (req: Request, res: Response) => {
  const _id = get(req, "params.id");
  const result = await FindCategory({ _id });
  if (!result) {
    return res.status(404).json({ message: "CATEGORY HAS NOT FOUND" });
  }

  const user = await FindUser({ _id: result.createdBy });
  result.createdBy = user?.lastName + " " + user?.firstName;

  return res.status(200).json({ result });
};

export const GetListCategoryHandler = async (req: Request, res: Response) => {
  const list = await GetListCategory({});
  if (!list) {
    return res.status(404).json({ message: "LIST CATEGORY IS EMPTY " });
  }

  const result = await BodyGetResult(list);

  return res.status(200).json({ result });
};

export const GetListCategorySortedByNameHandler = async (
  req: Request,
  res: Response
) => {
  const type = req.body.type;
  if (!TypeIsSuitable(type)) {
    return res
      .status(400)
      .json({ message: "TYPE IS 'INCREMENT' OR 'DECREMENT" });
  }

  const by = GetTypeSort(type);
  const list = await GetListCategorySortedByName(by);
  if (!list) {
    return res.status(404).json({ message: "LSIT CATEGORIES IS EMPTY" });
  }

  const result = await BodyGetResult(list);

  return res.status(200).json({ result });
};

export const UpdateCategoryHandler = async (req: Request, res: Response) => {
  const _id = get(req, "params.id");
  if (!_id) {
    return res.status(400).json({ message: "ID CATEGORY IS REQUIRED" });
  }

  const category = await FindCategory({ _id });
  if (!category) {
    return res.status(404).json({ nessage: "CATEGORY HAS NOT FOUND" });
  }

  const name = req.body.name;
  const userID = await GetUserID(req);

  const result = await UpdateCategory(
    { _id },
    { name: name, updatedBy: userID },
    { new: true }
  );

  return res.status(200).json({ result });
};

export const DeleteCategoryByIDHandler = async (
  req: Request,
  res: Response
) => {
  const categoryID = get(req, "params.id");
  if (!categoryID) {
    return res.status(400).json({ message: "ID CATEGORY IS REQUIRED" });
  }

  const products = await FindProduct({ category: categoryID });
  if (products) {
    return res.status(405).json({ message: "CANT NOT REMOVE THIS CATEGORY" });
  }

  const category = await FindCategory({ _id: categoryID });
  if (!category) {
    return res.status(404).json({ message: "CATEGORY HAS NOT FOUND" });
  }
  await DeleteCategory({ _id: categoryID });
  return res.status(200).json({ message: "DELETE SUCCESSFUL" });
};

const BodyGetResult = async (result: any) => {
  for (let i = 0; i < result.length; i++) {
    const userCreate = await FindUser({ _id: result[i].createdBy });
    result[i].createdBy = userCreate?.lastName + " " + userCreate?.firstName;

    const userUpdated = await FindUser({ _id: result[i].updatedBy });
    result[i].updatedBy = userUpdated?.lastName + " " + userUpdated?.firstName;
  }

  return result;
};
