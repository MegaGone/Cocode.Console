import { unlink } from "fs";
import { resolve } from "path";

import { MULTER_DIRECTORY } from "../../config";

export const deleteFile = (filename: string) => {
  try {
    const path = resolve(MULTER_DIRECTORY, filename);

    unlink(path, (err) => {
      if (err) console.error(`[ERROR][FILE][PHYSICAL] - ${filename}:`, err);
    });
  } catch (error) {
    console.error(`[ERROR][FILE][PHYSICAL] `, error);
  }
};
