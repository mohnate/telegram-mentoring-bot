import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

let DB_HOST = process.env.DB_HOST || "localhost";
let DB_PORT = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432;
let DB_USER = process.env.DB_USER || "postgres";
let DB_PASSWORD = process.env.DB_PASSWORD || "postgres";
let DB_NAME = process.env.DB_NAME || "mentoring";
let BOT_TOKEN = process.env.BOT_TOKEN || "";

const config = {
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  BOT_TOKEN,
};

export default config;
