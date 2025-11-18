import { NextFunction, Request, Response } from "express";
import { get } from "lodash";
import { verifyJwt } from "../util/jwt";
import { issueResearcherAccessToken } from "../service/auth.service";

export const deserializeResearcherJWT = async (req: Request, res: Response, next: NextFunction) => {
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

    const authHeader = get(req, "headers.authorization", "");
    const accessToken = (Array.isArray(authHeader) ? authHeader[0] : authHeader).replace(/^Bearer\s/, "");

    const refreshHeader = get(req, "headers.x-refresh", "");
    const refreshToken = Array.isArray(refreshHeader) ? refreshHeader[0] : refreshHeader;

    const { decoded, expired } = verifyJwt(accessToken, "ACCESS_TOKEN_PUBLIC_KEY");

    if (decoded) {
        res.locals.researcherId = get(decoded, "researcherId");
        return next();
    }

    if (expired && refreshToken) {
        const { decoded: decodedRefresh, expired: refreshExpired } = verifyJwt(refreshToken, "REFRESH_TOKEN_PUBLIC_KEY");

        if (!refreshExpired && decodedRefresh) {
            const researcherId = get(decodedRefresh, "researcherId");
            if (!researcherId) {
                return res.status(401).json({ message: "Refresh token inválido" });
            }

            res.locals.researcherId = researcherId;

            const newAccessToken = issueResearcherAccessToken({
                researcherId,
                role: get(decodedRefresh, "userRole"),
            });

            res.setHeader("x-access-token", newAccessToken);
            return next();
        }
    }

    return res.status(401).json({ message: "jwt expired" });
};
