import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT;
const HOST = process.env.HOST;
const USER = process.env.USER;
const PASSWORD = process.env.PASSWORD || "";
const DATABASE_NAME = process.env.DATABASE_NAME;
const SECRETE_KEY = process.env.SECRETE_KEY;
const SECRETE_KEY_REFRESH = process.env.SECRETE_KEY_REFRESH;

export {
  PORT,
  HOST,
  USER,
  PASSWORD,
  DATABASE_NAME,
  SECRETE_KEY,
  SECRETE_KEY_REFRESH,
};
