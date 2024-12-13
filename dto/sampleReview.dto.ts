import { number, object, string, z } from "zod";
import { SAMPLE_STATUS_ARRAY } from "../util/consts";

const createSampleReviewBody = object({
    sampleId: string({
        required_error: "Sample id to review is required.",
    }),
    nextStatus: z.enum(SAMPLE_STATUS_ARRAY, {
        required_error: "Next status is required",
    }),
    qttParticipantsAuthorized: number().optional(),
    reviewMessage: string({
        required_error: "The review message is required!",
    }),
}).strict("A unknown key was found.");

export const createSampleReviewDTO = object({
    body: createSampleReviewBody,
});

const findReviewsBySampleParams = object({
    sampleId: string({
        required_error: "Sample id is required.",
    }),
}).strict();

export const findReviewsBySamplesDTO = object({
    params: findReviewsBySampleParams,
});

export type CreateSampleReviewDTO = z.infer<typeof createSampleReviewDTO>;
export type FindReviewsBySampleDTO = z.infer<typeof findReviewsBySamplesDTO>;
