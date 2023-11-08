import fs from "fs";
import path from "path";
import mainPath from "./path";

namespace FileHelper {
  export const deleteFile = (filePath) => {
    const fPath = path.join(mainPath as string, filePath).toString();
    fs.unlink(fPath, (err) => {
      if (err) return false;
      return true;
    });
  };
}

export default FileHelper;
