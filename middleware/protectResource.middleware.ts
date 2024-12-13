import { NextFunction, Request, Response } from "express";
import { getResearcherRole, isAttachmentOwner } from "../service/researcher.service";

export const protectResource = async (req: Request, res: Response, next: NextFunction) => {
    let fileName = req.url;

    if (!fileName) {
        return res.status(403).send("The filename is required.");
    }

    if (fileName.startsWith("/")) {
        fileName = fileName.substring(1);
    }
    const researcherId = res.locals.researcherId;

    if (!researcherId) {
        return res.status(403).send("This resource require a valid session.");
    }

    const userRole = await getResearcherRole(researcherId);

    if (["Administrador", "Revisor"].includes(userRole || "")) {
        return next();
    }

    if (!(await isAttachmentOwner(fileName, researcherId))) {
        return res.status(403).send("This resource is unavailable.");
    }

    next();
};
