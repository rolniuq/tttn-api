import { object, array, string, number } from "yup";

export const CreatePaypalSchema = object({
  body: object({
    orderID: string().required("Order id is required"),
    orderDetails: array().of(
      object({
        product: string().required("Product is required"),
        quantity: number()
          .required("Quantity is required")
          .min(1, "Min quantity is 1"),
        size: string().required("Size is required"),
      }).required("Order details are required")
    ),
  }),
});

export const CapturePaypalSchema = object({
  body: object({
    id: string().required("ID Paypal is required"),
  }),
});

export const GetPricePaypalSchema = object({
  body: object({
    list: array()
      .of(
        object({
          product: string().required("id product is required"),
          quantity: number().required("quantity is required"),
          size: string().required("Size is required"),
        })
      )
      .required("List id products are required"),
  }),
});
