import { NextFunction, Request, Response } from "express";

export const requireResearcherJWT = (req: Request<{}, {}, {}, {}>, res: Response, next: NextFunction) => {
    if (!res.locals.researcherId) {
        return res.status(403).send("This resource require a valid JWT.");
    }

    next();
};
