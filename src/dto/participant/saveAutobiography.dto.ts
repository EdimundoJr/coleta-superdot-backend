import { object, string, z } from "zod";

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

export type SaveAutobiographyDTO = z.infer<typeof saveAutobiographySchema>;
