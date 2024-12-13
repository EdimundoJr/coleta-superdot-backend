import mongoose from "mongoose";
import ISampleReview from "../interface/sampleReview.interface";
import ResearcherModel from "../model/researcher.model";
import * as EmailUtils from "../util/emailSender.util";
import { findResearcher } from "./researcher.service";
import IResearcher from "../interface/researcher.interface";
import { DateTime } from "luxon";

export async function createReview(sampleId: string, reviewData: ISampleReview) {
    const researcher = await ResearcherModel.findOne(
        { "researchSamples._id": sampleId },
        {
            "researchSamples._id": 1,
            email: 1,
            "personalData.fullName": 1,
            "researchSamples.sampleTitle": 1,
            "researchSamples.status": 1,
            "researchSamples.reviews": 1,
        }
    );

    if (!researcher) {
        throw new Error("Researcher not found.");
    }

    if (!researcher.researchSamples) {
        throw new Error("This researcher hasn't samples.");
    }

    const sample = researcher.researchSamples.find((sample) => sample._id?.toString() === sampleId);

    if (!sample) {
        throw new Error("Sample not found.");
    }

    reviewData.previousStatus = sample.status;

    sample.status = reviewData.nextStatus;

    if (sample.status === "Autorizado" && !reviewData.qttParticipantsAuthorized) {
        throw new Error("Review with 'Autorizado' status require the quantity of participantes authorized.");
    }

    sample.qttParticipantsAuthorized = reviewData.qttParticipantsAuthorized;

    sample.reviews?.push(reviewData);

    await researcher.save();

    /** SEDING EMAIL */
    const reviewer = await findResearcher({ _id: reviewData.reviewerId });
    EmailUtils.dispatchReviewRequestEmail({
        qttParticipantsAuthorized: sample.qttParticipantsAuthorized,
        researcherEmail: researcher.email,
        researcherName: researcher.personalData.fullName,
        reviewerEmail: reviewer.email,
        reviewerFullName: reviewer.personalData.fullName,
        reviewerMessage: reviewData.reviewMessage,
        sampleName: sample.sampleTitle,
        sampleStatus: sample.status,
        reviewDate: DateTime.fromJSDate(new Date()).toFormat("dd/LL/yyyy - HH:mm"),
    });

    return reviewData;
}

interface SampleReviewWithReviewerName {
    review_details: ISampleReview;
    reviewer_full_name: string;
}

export async function findReviewsBySampleId(sampleId: string) {
    const researcher = await ResearcherModel.aggregate<SampleReviewWithReviewerName>()
        .unwind("$researchSamples")
        .match({ "researchSamples._id": new mongoose.Types.ObjectId(sampleId) })
        .unwind("$researchSamples.reviews")
        .sort({ "researchSamples.reviews.createdAt": -1 })
        .lookup({
            from: "researchers",
            localField: "researchSamples.reviews.reviewerId",
            foreignField: "_id",
            as: "reviewer",
        })
        .unwind("$reviewer")
        .project({
            reviewDetails: "$researchSamples.reviews",
            reviewerFullName: "$reviewer.personalData.fullName",
            _id: 0,
        })
        .exec();

    if (!researcher) {
        throw new Error("Sample hasn't reviews yet.");
    }

    return researcher;
}
