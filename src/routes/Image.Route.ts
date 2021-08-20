import { Express } from "express";
import ImageMiddleware from "../middleware/Image.Middleware";
import { RequireStaff, VerifyLogin } from "../middleware/Authentication";
import {
  SaveImageHandler,
  UpdateImageHandler,
} from "../controllers/Image.Controller";

const ImageRoute = (app: Express) => {
  app.post(
    "/image/:idProduct",
    VerifyLogin,
    RequireStaff,
    ImageMiddleware.single("image"),
    SaveImageHandler
  );

  app.put(
    "/image/:idProduct",
    VerifyLogin,
    RequireStaff,
    ImageMiddleware.single("image"),
    UpdateImageHandler
  );
};

export default ImageRoute;
