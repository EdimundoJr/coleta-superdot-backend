import mongoose from "mongoose";
import env from "./util/validateEnv";
import app from "./app";

const startServer = async () => {
    try {
        await mongoose.connect(env.MONGO_CONNECTION_STRING, { dbName: "superdot" });
        console.log("Mongoose Connected");

        const server = app.listen(env.PORT, () => {
            console.log("Server running on port: " + env.PORT);
        });

        module.exports = server;

    } catch (error) {
        console.error("Failed to connect to MongoDB:", error);
        process.exit(1);
    }
};

startServer();