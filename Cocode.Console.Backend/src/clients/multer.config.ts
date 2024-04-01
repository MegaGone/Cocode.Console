import multer, { diskStorage, FileFilterCallback, StorageEngine } from "multer";
import {
  MULTER_ALLOWED_FILES,
  MULTER_DIRECTORY,
  MULTER_PARAM,
} from "../config";
import { MFile } from "../interfaces";
import { Request } from "express";

const storage: StorageEngine = diskStorage({
  destination: (_req, _file: MFile, cb) => {
    cb(null, MULTER_DIRECTORY);
  },
  filename: (_req, file: MFile, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (_req: Request, file: MFile, cb: FileFilterCallback) => {
    if (!MULTER_ALLOWED_FILES.split(",").includes(file.mimetype ?? ""))
      return cb(null, false);

    cb(null, true);
  },
}).single(MULTER_PARAM);

export { upload };
