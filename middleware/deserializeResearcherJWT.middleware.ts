import { NextFunction, Request, Response } from "express";
import { get } from "lodash";
import { verifyJwt } from "../util/jwt";
import { issueResearcherAccessToken } from "../service/auth.service";

export const deserializeResearcherJWT = async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = get(req, "headers.authorization", "").replace(/^Bearer\s/, "");

    const refreshToken = get(req, "headers.x-refresh", "");

    const { decoded, expired } = verifyJwt(accessToken, "ACCESS_TOKEN_PUBLIC_KEY");

    if (decoded) {
        res.locals.researcherId = get(decoded, "researcherId");
        return next();
    }

    if (expired && refreshToken) {
        const { decoded, expired } = verifyJwt(refreshToken as string, "REFRESH_TOKEN_PUBLIC_KEY");

        if (expired) {
            return next();
        }

        const researcherId = get(decoded, "researcherId");
        if (!researcherId) {
            return next();
        }

        res.locals.researcherId = get(decoded, "researcherId");

        const newAccessToken = issueResearcherAccessToken({
            researcherId,
            role: get(decoded, "userRole"),
        });

        res.setHeader("x-access-token", newAccessToken);
    }

    next();
};
