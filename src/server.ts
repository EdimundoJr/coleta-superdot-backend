import mongoose from "mongoose";
import env from "./util/validateEnv";
import app from "./app";

const port = process.env.PORT || 3000;

mongoose.connect(env.MONGO_CONNECTION_STRING, {
    dbName: "superdot"
}).then(() => {
    console.log("Mongoose Connected");
    app.listen(port, () => {
        console.log("Server running on port: " + port);
    });
}).catch(err => console.error(err));
