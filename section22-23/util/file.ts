import fs from "fs";

namespace FileHelper {
  export const deleteFile = (filePath) => {
    fs.unlink(filePath, (err) => {
      if (err) throw err;
    });
  };
}

export default FileHelper;
