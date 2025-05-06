import mongoose from "mongoose";
import env from "./util/validateEnv";
import app from "./app";

// Conecta ao MongoDB e inicia o servidor
const startServer = async () => {
    try {
        await mongoose.connect(env.MONGO_CONNECTION_STRING, { dbName: "superdot" });
        console.log("Mongoose Connected");

        const server = app.listen(env.PORT, () => {
            console.log("Server running on port: " + env.PORT);
        });

        // Exporta o servidor para a Vercel (obrigatório para serverless)
        module.exports = server;

    } catch (error) {
        console.error("Failed to connect to MongoDB:", error);
        process.exit(1); // Encerra o processo em caso de erro
    }
};

startServer();