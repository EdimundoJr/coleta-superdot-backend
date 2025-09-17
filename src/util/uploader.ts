import * as fs from "fs";
import * as path from "path";
import multer from "multer";

const uploadFilePath = path.resolve(__dirname, "../", "storage/uploads/");

// Garantir que o diretório existe
if (!fs.existsSync(uploadFilePath)) {
    fs.mkdirSync(uploadFilePath, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadFilePath);
    },
    filename: (req, file, cb) => {
        const existingProfilePhoto = req.body.existingProfilePhoto;

        if (existingProfilePhoto) {
            const filePath = path.join(uploadFilePath, existingProfilePhoto);

            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }

            cb(null, existingProfilePhoto);
        } else {
            const uniquePrefix = Date.now() + "-" + Math.round(Math.random() * 1e9);
            const fileExtension = path.extname(file.originalname).toLowerCase();
            const newFilename = uniquePrefix + fileExtension;
            cb(null, newFilename);
        }
    },
});

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