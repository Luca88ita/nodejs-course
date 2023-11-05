import fs from "fs";
import path from "path";
import mainPath from "./path";

namespace FileHelper {
  export const deleteFile = (filePath) => {
    const fPath = path.join(mainPath as string, filePath).toString();
    fs.unlink(fPath, (err) => {
      if (err) throw err;
    });
  };
}

export default FileHelper;
