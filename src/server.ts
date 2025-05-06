import mongoose from "mongoose";
import env from "./util/validateEnv";
import app from "./app";

console.log("🔄 Iniciando servidor..."); // Log inicial

const startServer = async () => {
    try {

        // Conecta ao MongoDB
        console.log("🔗 Conectando ao MongoDB...");
        await mongoose.connect(env.MONGO_CONNECTION_STRING, { dbName: "superdot" });
        console.log("✅ MongoDB conectado");

        const server = app.listen(env.PORT, () => {
            console.log(`🚀 Servidor rodando na porta ${env.PORT}`);
        });

        module.exports = server;

    } catch (error) {
        console.error("❌ Erro crítico:", error);
        process.exit(1);
    }
};

startServer();