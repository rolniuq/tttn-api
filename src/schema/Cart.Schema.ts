import { object, string, number, array } from "yup";

export const CreateCartSchema = object({
  body: object({
    product: string().required("Product is required"),
    quantity: number()
      .required("Quantity is required")
      .min(1, "Min quantity is 1"),
    size: string().required("Size is required"),
  }),
});

export const GetCartPriceSelectedSchema = object({
  body: object({
    carts: array().of(string()).required("List cartsID is required"),
  }),
});

export const DeleteCartByID = object({
  body: object({
    product: string().required("ID Product is required"),
  }),
});

export const DeleteListCartByID = object({
  body: object({
    carts: array().of(string()).required("List cartsID is required"),
  }),
});

export const UpdateCartSchema = object({
  body: object({
    product: string().required("ID Product is required"),
    quantity: number().required("Quantity is required"),
    size: string().required("Size is required"),
  }),
});
