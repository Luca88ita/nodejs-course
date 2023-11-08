import multer from "multer";
import { v4 as uuidv4 } from "uuid";

const storage = multer.diskStorage({
  /* destination: (req, file, cb) => {
    cb(null, path.join(mainPath as string, "images").toString());
  }, */
  destination: (req, file, cb) => {
    cb(null, `images`);
  },
  filename: (erq, file, cb) => {
    cb(
      null,
      `${uuidv4()} - ${
        file.originalname
      }` /* `${Date.now()} - ${file.originalname}` */
    );
  },
});

const fileFilter = (req, file, cb) => {
  switch (file.mimetype) {
    case "image/png":
    case "image/jpg":
    case "image/jpeg":
    case "image/tiff":
    case "image/bmp":
      cb(null, true);
      break;
    default:
      cb(null, false);
      break;
  }
};

const multerSettings = { storage, fileFilter };

export const multerImageMilldeware = multer(multerSettings).single("image");
