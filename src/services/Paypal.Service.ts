import { DocumentDefinition, FilterQuery, _FilterQuery } from "mongoose";
import Paypal, { PaypalDocument } from "../models/Paypal.Model";

export const CreatePaypal = async (input: DocumentDefinition<PaypalDocument>) => {
  try {
    return await Paypal.create(input);
  }
  catch(e) {
    throw new Error("Error when create paypal");
  }
}

export const FindPaypal = async (query: FilterQuery<PaypalDocument>) => {
  return await Paypal.findOne(query);
}

export const GetListPaypal = async (query: _FilterQuery<PaypalDocument>) => {
  return await Paypal.find(query);
}
