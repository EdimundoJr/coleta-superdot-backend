import mongoose from "mongoose";
import env from "./util/validateEnv";
import app from "./app";

const vercelConfig = async () => {
    try {
        console.log("🔗 Conectando ao MongoDB...");
        await mongoose.connect(env.MONGO_CONNECTION_STRING, {
            dbName: "superdot",
            serverSelectionTimeoutMS: 5000
        });

        console.log("✅ MongoDB conectado");

        return app;
    } catch (error) {
        console.error("❌ Erro crítico:", error);
        throw error;
    }
};

export default vercelConfig();

if (process.env.NODE_ENV !== "production") {
    const port = env.PORT || 3001;
    const server = app.listen(port, () => {
        console.log(`🚀 Servidor rodando localmente na porta ${port}`);
    });
}