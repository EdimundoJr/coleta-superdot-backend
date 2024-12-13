import { NextFunction, Request, Response } from "express";

export const requireSecondSourceJWT = (req: Request<{}, {}, {}, {}>, res: Response, next: NextFunction) => {
    const secondSourceId = res.locals.secondSourceId;

    if (!secondSourceId) {
        return res.status(403).send("This resource require a valid JWT.");
    }

    next();
};
