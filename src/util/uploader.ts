import * as path from "path";
import multer from "multer";

const uploadFilePath = path.resolve(__dirname, "../", "storage/uploads/");

const storage = multer.diskStorage({
    destination: uploadFilePath,
    filename: function (req, file, cb) {
        const uniquePreffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniquePreffix + path.extname(file.originalname));
    },
});
// const storage = multer.memoryStorage();

export const uploaderConfig = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter(req, file, callback) {
        const extension: boolean =
            [".png", ".jpg", ".jpeg", ".pdf"].indexOf(path.extname(file.originalname).toLowerCase()) >= 0;
        const mimeType: boolean =
            ["image/png", "image/jpg", "image/jpeg", "application/pdf"].indexOf(file.mimetype) >= 0;

        if (extension && mimeType) {
            return callback(null, true);
        }
        callback(new Error("Invalid file type."));
    },
});
