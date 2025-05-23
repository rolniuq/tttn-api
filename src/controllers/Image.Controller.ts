import {
  CreateImage,
  DeleteFileImage,
  DeleteImages,
  GetListImages,
  SaveImage,
  UpdateImage,
} from "../services/Image.Service";
import { Request, Response } from "express";
import { get } from "lodash";
import { FindProduct } from "../services/Product.Service";

export const SaveImageHandler = async (req: Request, res: Response) => {
  const idProduct = await CheckProductExist(req, res);

  const imagePath = "./public/images";
  const fileBuffer = CheckBufferExist(req, res);

  const fileName = await SaveImage(imagePath, fileBuffer);

  const result = await UpdateImage(
    { product: idProduct },
    { name: `/images/${fileName}` },
    { new: true }
  );

  return res.status(200).json({ result });
};

export const UpdateImageHandler = async (req: Request, res: Response) => {
  const idProduct = await CheckProductExist(req, res);
  //@ts-ignore
  await DeleteImagesHandler(idProduct);

  const imagePath = "./public/images";
  const fileBuffer = CheckBufferExist(req, res);

  const fileName = await SaveImage(imagePath, fileBuffer);

  await CreateImage({ ...req.body, product: idProduct });

  const result = await UpdateImage(
    { product: idProduct },
    { name: `/images/${fileName}` },
    { new: true }
  );

  return res.status(200).json({ result });
}

export const DeleteImagesHandler = async (product: string) => {
  const images = await GetListImages({ product: product });
  await DeleteImages({ product: product });

  for (let i = 0; i < images.length; i++) {
    DeleteFileImage(images[i].name);
  }
};

const CheckProductExist = async (req: Request, res: Response) => {
  const idProduct = get(req, "params.idProduct");
  if (!idProduct) {
    return res.status(400).json({ message: "PRODUCT ID IS REQUIRED" });
  }

  const product = await FindProduct({ _id: idProduct });
  if (!product) {
    return res.status(404).json({ message: "PRODUCT HAS NOT FOUND" });
  }

  return idProduct;
}

const CheckBufferExist = (req: Request, res: Response) => {
  const fileBuffer = req.file?.buffer;

  if (!fileBuffer) {
    return res.status(400).json({ message: "IMAGE IS REQUIRED" });
  }

  return fileBuffer;
}
