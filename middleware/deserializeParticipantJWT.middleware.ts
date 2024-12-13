import { NextFunction, Request, Response } from "express";
import { get } from "lodash";
import { verifyJwt } from "../util/jwt";

/*
 * Deserialize participant or second source JWT token and save at locals.
 */
export const deserializeParticipantJWT = (req: Request<{}, {}, {}, {}>, res: Response, next: NextFunction) => {
    const token = get(req, "headers.authorization", "").replace(/^Bearer\s/, "");

    const { decoded } = verifyJwt(token, "ACCESS_TOKEN_PUBLIC_KEY");

    if (decoded) {
        res.locals.participantId = get(decoded, "participantId");
        res.locals.secondSourceId = get(decoded, "secondSourceId");
    }

    next();
};
