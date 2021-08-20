import path from "path";
import { v4 as uuid } from "uuid";
import sharp from "sharp";
import fs from "fs";
import {
  FilterQuery,
  DocumentDefinition,
  QueryOptions,
  UpdateQuery,
} from "mongoose";
import Image, { ImageDocument } from "../models/Image.Model";

const FileName = () => {
  return `${uuid()}.png`;
};

const FilePath = (imagePath: string, fileName: string) => {
  return path.resolve(`${imagePath}/${fileName}`);
};

export const SaveImage = async (imagePath: string, buffer: any) => {
  const fileName = FileName();
  const filePath = FilePath(imagePath, fileName);

  await sharp(buffer)
    .resize(300, 300, {
      fit: sharp.fit.inside,
      withoutEnlargement: true,
    })
    .toFile(filePath)
    .catch((e) => {
      console.log(e);
    });

  return fileName;
};

export const UpdateFileImage = (oldName: string, newName: string) => {
  return fs.rename(oldName, newName, (err) => {
    if (err) console.log(err);
  });
};

export const DeleteFileImage = (name: string) => {
  const filePath = path.join("./public", name);

  return fs.unlink(filePath, (err) => {
    if (err) console.log(err);
  });
};

export const CreateImage = async (input: DocumentDefinition<ImageDocument>) => {
  return await Image.create(input);
};

export const GetListImages = async (query: FilterQuery<ImageDocument>) => {
  return await Image.find(query);
};

export const UpdateImage = async (
  query: FilterQuery<ImageDocument>,
  update: UpdateQuery<ImageDocument>,
  options: QueryOptions
) => {
  return await Image.findOneAndUpdate(query, update, options);
};

export const GetImagesByProductID = async (
  query: FilterQuery<ImageDocument>
) => {
  return await Image.find(query).select("name");
};

export const DeleteImages = async (query: FilterQuery<ImageDocument>) => {
  return await Image.deleteMany(query);
};
