import express from "express";
import * as SampleGroupController from "../controller/sampleGroup.controller";
import { requireResearcherJWT } from "../middleware/requireResearcherJWT.middleware";

const sampleGroupRouter = express.Router();

sampleGroupRouter.get("/findAll", requireResearcherJWT, SampleGroupController.findAllHandler);

export { sampleGroupRouter };
