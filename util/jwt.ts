import jwt, { TokenExpiredError } from "jsonwebtoken";
import env from "./validateEnv";

export function signJwt(
    objectToSign: Object,
    keyName: "ACCESS_TOKEN_PRIVATE_KEY" | "REFRESH_TOKEN_PRIVATE_KEY",
    options?: jwt.SignOptions | undefined
) {
    const signinKey = Buffer.from(env[keyName], "base64").toString("ascii");

    return jwt.sign(objectToSign, signinKey, {
        ...options,
        algorithm: "RS256",
    });
}

export function verifyJwt(
    token: string,
    keyName: "ACCESS_TOKEN_PUBLIC_KEY" | "REFRESH_TOKEN_PUBLIC_KEY"
) {
    const publicKey = Buffer.from(env[keyName], "base64").toString("ascii");

    try {
        const decoded = jwt.verify(token, publicKey);
        return {
            valid: true,
            expired: false,
            decoded,
        };
    } catch (e: any) {
        console.error(e);
        return {
            valid: false,
            expired: e instanceof TokenExpiredError,
            decoded: null,
        };
    }
}
