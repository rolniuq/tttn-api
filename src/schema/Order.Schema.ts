import { object, string, number, array } from "yup";

export const CreateOrderSchema = object({
  body: object({
    comment: string(),
    infoGuest: object({
      firstName: string()
        .required("First name is required")
        .min(2, "First name must be included 2 characters"),
      lastName: string()
        .required("Last name is required")
        .min(2, "Last name must be included 2 characters"),
      phone: string()
        .required("Phone is required")
        .length(10, "Phone must be included 10 numbers")
        .matches(/(84|0[3|5|7|8|9])+([0-9]{8,9})\b/, "Phone isn't match"),
      address: string()
        .required("Address is required")
        .min(5, "Address must be included 5 characters"),
    }),
    orderDetails: array().of(
      object({
        product: string().required("Product is required"),
        quantity: number()
          .required("Quantity is required")
          .min(1, "Min quantity is 1"),
        size: string().required("Size is required"),
      })
    ),
  }),
});

export const UpdateStatusOrderSchema = object({
  body: object({
    currentStatus: string().required("Current status is required"),
  })
})
