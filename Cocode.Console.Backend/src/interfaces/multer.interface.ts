import { Request } from "express";
import { FileFilterCallback } from "multer";

export interface MFile {
  fieldname?: string;
  originalname?: string;
  encoding?: string;
  mimetype?: string;
}

export interface MFilter {
  (req: Request, file: MFile, callback: FileFilterCallback): void | undefined;
}
