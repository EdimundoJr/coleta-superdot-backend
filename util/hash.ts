import bcrypt from "bcrypt";
import env from "./validateEnv";

export function hashContent(rawContent: string) {
    return bcrypt.hashSync(rawContent, env.SALT_ROUNDS);
}

export async function compareHashes(rawText: string, hashedContent: string) {
    return await bcrypt.compare(rawText, hashedContent);
}
