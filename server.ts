import mongoose from "mongoose";
import env from "./util/validateEnv";
import app from "./app";

mongoose.connect(env.MONGO_CONNECTION_STRING).then(() => {
    console.log("Mongoose Connected");
    app.listen(env.PORT, () => {
        console.log("Server running on port: " + env.PORT);
    });
});
