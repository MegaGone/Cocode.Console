import "dotenv/config";

const PORT = process.env.PORT || "3000";
const TOKEN = process.env.TOKEN || "x-token";
const SECRETKEY = process.env.SECRETKEY || "";

// SQL Database
const SQL_HOST = process.env.SQL_HOST || "127.0.0.1";
const SQl_PORT = process.env.SQL_PORT || 53110;
const SQL_USER = process.env.SQL_USER || "";
const SQL_PASSWORD = process.env.SQL_PASSWORD || "";
const SQL_DATABASE = process.env.SQL_DATABASE || "";
const SQL_LOGGING = process.env.SQL_LOGGING || false;
const SQL_CACHE = process.env.SQL_CACHE || false;
const SQL_MAX_SIZE_IMAGE = process.env.SQL_MAX_SIZE_IMAGES || "8mb";
const SQL_PARAMETER_LIMIT_IMAGE = 8000;

// Multer
const MULTER_DIRECTORY = process.env.MULTER_DIRECTORY || "payments";
const MULTER_PARAM = process.env.MULTER_PARAM || "evidence";
const MULTER_ALLOWED_FILES =
  process.env.MULTER_ALLOWED_FILES || "application/pdf";

export {
  PORT,
  TOKEN,
  SQL_HOST,
  SQl_PORT,
  SQL_USER,
  SQL_PASSWORD,
  SQL_DATABASE,
  SQL_LOGGING,
  SQL_CACHE,
  SECRETKEY,
  SQL_MAX_SIZE_IMAGE,
  SQL_PARAMETER_LIMIT_IMAGE,
  MULTER_DIRECTORY,
  MULTER_PARAM,
  MULTER_ALLOWED_FILES,
};
