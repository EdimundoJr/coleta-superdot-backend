import { object, string, z } from "zod";
import { EAdultFormGroup } from "../../util/consts";

export const getQuestionsByGroupSchema = object({
    params: object({
        formSource: string({ required_error: "Group source is required!" }).transform((val, ctx) => {
            if (Number.isNaN(val)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Form source is not a number.",
                });
            }

            return Number(val);
        }),
        groupSequence: string({ required_error: "Group sequence param is required!" }).transform((val, ctx) => {
            if (Number.isNaN(val)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,

                    message: "Group sequence is not a number.",
                });
            }

            if (!Object.values(EAdultFormGroup).includes(Number(val))) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Group sequence invalid.",
                });
            }

            return Number(val);
        }),
    }),
});

export type GetQuestionsByGroupDTO = z.infer<typeof getQuestionsByGroupSchema>;
