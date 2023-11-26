import dotenv from "dotenv";
dotenv.config();

export const dbConfig = {
  user: process.env.USER,
  password: process.env.PASSWORD,
  connectString: process.env.CONNECTION_STRING,
};
