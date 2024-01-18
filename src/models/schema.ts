import { Schema, model } from "mongoose";

// Document interface
interface User {
  name: string;
  email: string;
  age: number;
  gender: string;
  password: string;
  phone: number;
  imageUrl: string;
  roles: string;
}
interface Product {
  name: string;
  quantity: number;
  productImageUrl:Array<string>;
}

// Schema user
const schema = new Schema<User>({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  email: { type: String, required: true, unique: true },
  gender: { type: String, required: true },
  password: { type: String, required: true },
  phone: { type: Number, required: true },
  imageUrl: { type: String, required: false },
  roles: {
    type: String,
    required: true,
    enum: ["admin", "user"],
    default: "user",
  },
});

// Schema product
export const schema2 = new Schema<Product>({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  productImageUrl:[String],
});
const User=  model("User", schema)
const Product=  model("Product", schema2)
export {User,Product}
