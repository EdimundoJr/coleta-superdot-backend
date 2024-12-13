import express from "express";
import * as SampleReviewController from "../controller/sampleReview.controller";
import { validateDTO } from "../middleware/validateDTO.middleware";
import { requireRole } from "../middleware/requireRole.middleware";
import { createSampleReviewDTO, findReviewsBySamplesDTO } from "../dto/sampleReview.dto";

const sampleReviewRouter = express.Router();

sampleReviewRouter.post(
    "/newReview",
    [validateDTO(createSampleReviewDTO), requireRole("Revisor")],
    SampleReviewController.createSampleReviewHandler
);

sampleReviewRouter.get(
    "/findReviews/:sampleId",
    [validateDTO(findReviewsBySamplesDTO), requireRole("Revisor")],
    SampleReviewController.findReviewBySample
);

export { sampleReviewRouter };
