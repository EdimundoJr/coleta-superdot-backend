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
            // Se já existe um avatar, usar o mesmo nome E DELETAR O ARQUIVO ANTIGO
            const filePath = path.join(uploadFilePath, existingProfilePhoto);

            // Verificar se o arquivo existe e deletar
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }

            cb(null, existingProfilePhoto);
        } else {
            // Se não existe, criar novo nome aleatório
            const uniquePrefix = Date.now() + "-" + Math.round(Math.random() * 1e9);
            const fileExtension = path.extname(file.originalname).toLowerCase();
            const newFilename = uniquePrefix + fileExtension;
            cb(null, newFilename);
        }
    },
});

export const uploaderConfig = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    preservePath: true,
    fileFilter: (req, file, callback) => {
        const allowedMime = ["image/png", "image/jpg", "image/jpeg"];

        if (allowedMime.includes(file.mimetype)) {
            return callback(null, true);
        }
        callback(new Error("Invalid file type. Only PNG, JPG and JPEG are allowed."));
    },
});