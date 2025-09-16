// middleware/formDataProcessor.ts
import { NextFunction, Request, Response } from 'express';

export const processFormData = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.headers['content-type']?.includes('multipart/form-data')) {
      // O multer já processou os campos, mas precisamos acessá-los corretamente

      // Para FormData, os campos vêm como chaves planas no req.body
      const existingProfilePhoto = req.body.existingProfilePhoto;
      const fullName = req.body['personalData[fullName]'];

      // Reconstruir o objeto processado
      const processedBody: any = {};

      // Processar campos simples
      if (existingProfilePhoto) processedBody.existingProfilePhoto = existingProfilePhoto;
      if (req.body.currentPassword) processedBody.currentPassword = req.body.currentPassword;
      if (req.body.password) processedBody.password = req.body.password;
      if (req.body.passwordConfirmation) processedBody.passwordConfirmation = req.body.passwordConfirmation;

      // Processar campos aninhados
      if (fullName) {
        processedBody.personalData = { fullName };
      }

      req.body = processedBody;
    }

    next();
  } catch (error) {
    console.error('FormData processing error:', error);
    return res.status(500).json({ message: "Error processing form data" });
  }
};