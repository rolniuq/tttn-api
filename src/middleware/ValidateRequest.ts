import { AnySchema } from "yup";
import { Request, Response, NextFunction } from "express";

const ValidateRequest = (schema: AnySchema) => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await schema.validate({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    return next();
  } catch (e) {
    return res.sendStatus(400);
  }
};

export default ValidateRequest;
