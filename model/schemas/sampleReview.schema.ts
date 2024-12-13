import { Schema, Types } from "mongoose";
import ISampleReview from "../../interface/sampleReview.interface";
import { SAMPLE_STATUS_ARRAY } from "../../util/consts";

export const sampleReviewSchema = new Schema<ISampleReview>(
    {
        previousStatus: {
            type: String,
            enum: SAMPLE_STATUS_ARRAY,
            required: [true, "Previous state is required."],
        },
        nextStatus: {
            type: String,
            enum: SAMPLE_STATUS_ARRAY,
            required: [true, "Next status is required!"],
        },
        qttParticipantsAuthorized: Number,
        reviewMessage: {
            type: String,
            required: [true, "The review message is required."],
        },
        reviewerId: {
            type: Types.ObjectId,
            ref: "Research",
        },
    },
    {
        timestamps: true,
    }
);
