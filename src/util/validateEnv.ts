import { cleanEnv } from "envalid";
import { num, str } from "envalid/dist/validators";

export default cleanEnv(process.env, {
    SALT_ROUNDS: num({ default: 10, desc: "Corresponde ao número de rodadas para calcular o hash das senhas. Quanto maior o número, mais difícil é executar um ataque de força bruta." }),
    ACCESS_TOKEN_PRIVATE_KEY: str({ desc: "Chave privada para assinar o access token JWT." }),
    ACCESS_TOKEN_PUBLIC_KEY: str({ desc: "Chave pública para verificar o access token JWT." }),
    REFRESH_TOKEN_PRIVATE_KEY: str({ desc: "Chave privada para assinar o refresh token JWT." }),
    REFRESH_TOKEN_PUBLIC_KEY: str({ desc: "Chave pública para verificar o refresh token JWT." }),
    ACCESS_TOKEN_TTL: num({ default: 3600, desc: "Tempo de expiração de um access token ." }),
    REFRESH_TOKEN_TTL: num({ default: 3600, desc: "Tempo de expiração de um refresh token ." }),
    PARTICIPANT_TOKEN_TTL: num({ default: 3600, desc: "Tempo de expiração de um access token de um participante de pesquisa." }),
    MONGO_CONNECTION_STRING: str({ desc: "URI de conexão com o banco de dados." }),
    PORT: num({ default: 3000, desc: "Porta em que a API deve ficar escutando as requisições." }),
    NODE_ENV: str({ choices: ['development', 'test', 'production'], default: "development" }),
    EMAIL_HOST: str({ devDefault: "", desc: "Host do servidor SMTP." }),
    EMAIL_PORT: num({ devDefault: 0, desc: "Porta do servidor SMTP." }),
    EMAIL_USER: str({ devDefault: "", desc: "Usuário a ser utilizado no servidor SMTP." }),
    EMAIL_PASS: str({ devDefault: "", desc: "Senha do usuário a ser utilizado no servidor SMTP." }),
    FRONT_END_URL: str({ desc: "URL do frontend." }),
});
