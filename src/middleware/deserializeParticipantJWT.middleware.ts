import { NextFunction, Request, Response } from "express";
import { get } from "lodash";
import { verifyJwt } from "../util/jwt";

/*
 * Deserialize participant or second source JWT token and save at locals.
 */
export const deserializeParticipantJWT = (req: Request<{}, {}, {}, {}>, res: Response, next: NextFunction) => {
    const publicRoutes = [
        "/api/auth/login",
        "/api/auth/register",
        "/api/participant/validate-verification-code",
        "/api/participant/send-verification-code/sample",
        "/api/researcher/get-researcher-name-by-sample",
        "/api/researcher/get-research-data-by/sample",
        "/api/formulario-adulto",
        "formulario-adulto-segunda-fonte",
        "/api/sample/attachment",
        "/api/second-source/send-verification-code/sample",
        "/api/second-source/validate-verification-code/sample",
        "/iframe_api",
        "/embed/",

    ];

    if (publicRoutes.some(route => req.originalUrl.includes(route))) {
        return next();
    }

    if (!req.originalUrl.startsWith("/api")) {
        return next();
    }

    const token = get(req, "headers.authorization", "").replace(/^Bearer\s/, "");



    const { decoded } = verifyJwt(token, "ACCESS_TOKEN_PUBLIC_KEY");

    if (decoded) {
        res.locals.participantId = get(decoded, "participantId");
        res.locals.secondSourceId = get(decoded, "secondSourceId");
    }

    next();
};
