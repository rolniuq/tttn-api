import multer from "multer";

const ImageMiddleware = multer({
  limits: {
    fileSize: 4 * 1024 * 1024,
  },
});

export default ImageMiddleware;
