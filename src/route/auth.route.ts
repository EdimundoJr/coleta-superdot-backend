import express from "express";
import { validateDTO } from "../middleware/validateDTO.middleware";
import * as AuthController from "../controller/auth.controller";
import { researcherDTO } from "../dto/researcher.dto";
import { uploaderConfig } from "../util/uploader";
import { loginDTO, setUserRoleDTO, userRoleDTO } from "../dto/auth.dto";
import { requireRole } from "../middleware/requireRole.middleware";

const authRouter = express.Router();

authRouter.post(
    "/register",
    [uploaderConfig.single("personalData[profilePhoto]"), validateDTO(researcherDTO)],
    AuthController.registerHandler
    
);


authRouter.post("/login", [validateDTO(loginDTO)], AuthController.loginHandler);

authRouter.get(
    "/userRole/:userId",
    [validateDTO(userRoleDTO), requireRole("Administrador")],
    AuthController.userRoleHandler
);

authRouter.patch(
    "/setUserRole",
    [validateDTO(setUserRoleDTO), requireRole("Administrador")],
    AuthController.setUserRoleHandler
);

export { authRouter };
