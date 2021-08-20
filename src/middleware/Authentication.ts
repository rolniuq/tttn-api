import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../../config/Default";
import { GetRoleUserLogined, ValidatePassword } from "../services/User.Service";
import Common from "../utils/Common";

export const CreateToken = async (req: Request, res: Response) => {
  const getUser = await ValidatePassword(req.body);
  if (!getUser) {
    return res.status(401).send("Invalid username or password");
  }

  const token = jwt.sign(req.body, config.privateKey);

  return res.send({ token });
};

export const VerifyLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authenticationHeader = req.headers["authorization"];
  const token = authenticationHeader?.split(" ")[1];

  if (!token) {
    return res.sendStatus(401);
  }

  //@ts-ignore
  req.user = jwt.verify(token, config.privateKey, (error, decoded) => {
    if (error) {
      console.log(error);
      return null;
    }

    return decoded;
  });

  next();
};

export const RequireStaff = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const role = await GetRoleUserLogined(req);
  if (role === Common.role.GUEST) {
    return res.status(403).json({ message: "NOT PERMISSION" });
  }

  next();
};

export const RequireAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const role = await GetRoleUserLogined(req);
  if (role !== Common.role.ADMIN) {
    return res.status(403).json({ message: "NOT PERMISSION" });
  }

  next();
};
