import { NextFunction, Request, Response } from "express";

export const requireParticipantJWT = (req: Request<{}, {}, {}, {}>, res: Response, next: NextFunction) => {
    const participantId = res.locals.participantId;

    if (!participantId) {
        return res.status(403).send("This resource require a valid JWT.");
    }

    next();
};
