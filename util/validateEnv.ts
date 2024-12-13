import { cleanEnv } from "envalid";
import { num, str } from "envalid/dist/validators";

export default cleanEnv(process.env, {
    SALT_ROUNDS: num(),
    ACCESS_TOKEN_PRIVATE_KEY: str(),
    ACCESS_TOKEN_PUBLIC_KEY: str(),
    REFRESH_TOKEN_PRIVATE_KEY: str(),
    REFRESH_TOKEN_PUBLIC_KEY: str(),
    ACCESS_TOKEN_TTL: str(),
    REFRESH_TOKEN_TTL: str(),
    MONGO_CONNECTION_STRING: str(),
    PORT: num(),
    DEFAULT_APP_ROLE: str(),
    NODE_ENV: str(),
    EMAIL_HOST: str(),
    EMAIL_PORT: num(),
    EMAIL_USER: str(),
    EMAIL_PASS: str(),
    FRONT_END_URL: str(),
    PARTICIPANT_TOKEN_TTL: str(),
});
