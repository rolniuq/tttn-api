import { ChangePasswordUserHandler } from "../controllers/User.Controller";
import { Express } from "express";
import {
  CreateUserHandler,
  GetProfileUserHandler,
  UpdateProfileUserHandler,
} from "../controllers/User.Controller";
import { CreateToken, VerifyLogin } from "../middleware/Authentication";
import ValidateRequest from "../middleware/ValidateRequest";
import {
  ChangePasswordUserSchema,
  CreateUserSchema,
} from "../schema/User.Schema";

const UserRoute = (app: Express) => {
  app.get("/profile", VerifyLogin, GetProfileUserHandler);

  app.post("/user", 
  //ValidateRequest(CreateUserSchema), 
  CreateUserHandler);
  app.post("/login", CreateToken);

  app.put("/profile", VerifyLogin, UpdateProfileUserHandler);
  app.put(
    "/change-password",
    VerifyLogin,
    ValidateRequest(ChangePasswordUserSchema),
    ChangePasswordUserHandler
  );
};

export default UserRoute;
