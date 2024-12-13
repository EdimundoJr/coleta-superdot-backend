import { Request, Response } from "express";
import * as SampleReviewService from "../service/sampleReview.service";
import { CreateSampleReviewDTO, FindReviewsBySampleDTO } from "../dto/sampleReview.dto";
import ISampleReview from "../interface/sampleReview.interface";

export async function createSampleReviewHandler(
    req: Request<{}, {}, CreateSampleReviewDTO["body"], {}>,
    res: Response
) {
    try {
        const researcherId = res.locals.researcherId;

        if (!researcherId) {
            throw new Error("Invalid session!");
        }

        const reviewData: ISampleReview = { ...req.body, reviewerId: researcherId };

        const sampleId = req.body.sampleId;

        const reviewCreated = await SampleReviewService.createReview(sampleId, reviewData);

        res.status(200).json(reviewCreated);
    } catch (e: any) {
        console.log(e);

        // TO DO errors handlers
        res.status(409).json(e.message);
    }
}

export async function findReviewBySample(req: Request<FindReviewsBySampleDTO["params"], {}, {}, {}>, res: Response) {
    try {
        const reviews = await SampleReviewService.findReviewsBySampleId(req.params.sampleId);

        res.status(200).json(reviews);
    } catch (e) {
        console.log(e);

        // TO DO errors handlers
        res.status(409).json(e);
    }
}
