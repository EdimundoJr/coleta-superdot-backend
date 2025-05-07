import express, { NextFunction, Request, Response } from "express";
import { deserializeResearcherJWT } from "./middleware/deserializeResearcherJWT.middleware";
import createHttpError, { isHttpError } from "http-errors";
import { researcherRouter } from "./route/reseacher.route";
import cors from "cors";
import morgan from "morgan";
import { authRouter } from "./route/auth.route";
import { sampleGroupRouter } from "./route/sampleGroup.route";
import { sampleRouter } from "./route/sample.route";
import { sampleReviewRouter } from "./route/sampleReview.route";
import { adultFormRoute } from "./route/adultForm.route";
import { deserializeParticipantJWT } from "./middleware/deserializeParticipantJWT.middleware";
import { participantRouter } from "./route/participant.route";
import { secondSourceRouter } from "./route/secondSource.route";

const app = express();


app.use(morgan("dev"));

const allowedOrigins = [
    process.env.FRONT_END_URL,
    "http://localhost:5173"
];


app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));


app.use(express.json());


app.use(deserializeResearcherJWT);
app.use(deserializeParticipantJWT);

app.get("/", (req, res) => {
    res.send("API está online!");
});

app.use("/api/auth", authRouter);

app.use("/api/researcher", researcherRouter);

app.use("/api/sample-group", sampleGroupRouter);

app.use("/api/sample", sampleRouter);

app.use("/api/sample-review", sampleReviewRouter);

app.use("/api/adult-form", adultFormRoute);

app.use("/api/participant", participantRouter);

app.use("/api/second-source", secondSourceRouter);

app.use((req, res, next) => {
    next(createHttpError(404, "Endpoint not found"));
});


app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
    console.error(error);
    let errorMessage = "unknown error";
    let statusCode = 500;
    if (isHttpError(error)) {
        errorMessage = error.message;
        statusCode = error.status;
    }

    res.status(statusCode).json({
        error: errorMessage,
        ...(process.env.NODE_ENV === "development" && { stack: error })
    });
});

export default app;
