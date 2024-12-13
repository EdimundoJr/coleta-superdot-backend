import { number, object, string, z } from "zod";

export const saveAutobiographySchema = object({
    body: object({
        autobiographyText: string().optional(),
        autobiographyVideo: string().optional(),
    }).transform((val, ctx) => {
        if (!val.autobiographyText?.length && !val.autobiographyVideo?.length) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Autobiography text or video is required!",
            });
        }

        return val;
    }),
    params: object({
        sampleId: string({ required_error: "Sample id param is required!" }),
    }),
    query: object({
        submitForm: string().optional(),
    }),
});


const bodySchema = object({
    idEvalueAutobiography: number().optional(),
    textEvalueAutobiography: string().optional(),
    commentEvalueAutobiography: string().optional(),
    markEvalueAutobiography: string().optional(),
    startEvalueAutobiography: number().optional(),
    endEvalueAutobiography: number().optional(),
    backgroundEvalueAutobiography: string().optional(),
}).refine(data => data.commentEvalueAutobiography?.length || data.textEvalueAutobiography?.length, {
    message: "Evalue Autobiography text or comment is required!",
    path: ["commentEvalueAutobiography", "textEvalueAutobiography"], 
});


const paramsSchema = object({
    sampleId: string({ required_error: "Sample id param is required!" }),
    participantId: string({ required_error: "Participant id param is required!" }),
});

const querySchema = object({
    submitForm: string().optional(),
});

export const saveEvalueAutobiographySchema = object({
    body: bodySchema,
    params: paramsSchema,
    query: querySchema,
});


export type SaveAutobiographyDTO = z.infer<typeof saveAutobiographySchema>;
export type SaveEvalueAutobiographyDTO = z.infer<typeof saveEvalueAutobiographySchema>;
