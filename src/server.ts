import mongoose from "mongoose";
import env from "./util/validateEnv";
import app from "./app";

mongoose.connect(env.MONGO_CONNECTION_STRING, {
    dbName: "superdot"
}).then(() => {
    console.log("Mongoose Connected");
    app.listen(process.env.PORT, () => {
        console.log("Server running on port: " + process.env.PORT);
    });
}).catch(err => console.error(err)); 