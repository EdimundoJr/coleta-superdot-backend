import { array, number, object, string, z, union, undefined, nullable } from "zod";
import { EQuestionType } from "../../util/consts";
import mongoose from "mongoose";

export const saveQuestionsByGroupSchema = object({
    body: object({
        groupName: string({ required_error: "Group name is required!" }),
        sequence: number({ required_error: "Group sequence is required!" }),
        questions: array(
            object({
                _id: string({ required_error: "Question id is required!" }),
                statement: string({ required_error: "Question statement is required!" }),
                questionType: number({ required_error: "Question type is required!" }).transform((val, ctx) => {
                    if (!Object.values(EQuestionType).includes(Number(val))) {
                        ctx.addIssue({
                            code: z.ZodIssueCode.custom,
                            message: "Question type is invalid.",
                        });
                    }

                    return val;
                }),
                options: array(object({ value: string(), points: number().optional() })).optional(),
                answer: union([array(nullable(string())), string()]).optional(),
            }).transform((question, ctx) => {
                if (Array.isArray(question.answer)) {
                    if (question.questionType !== EQuestionType.MULTIPLE_SELECT && question.answer.length !== 4) {
                        ctx.addIssue({
                            code: z.ZodIssueCode.custom,
                            message: "A multiple response answer needs to have an exact 4 answers.",
                        });
                    }
                }

                return question;
            })
        ),
    }),
    params: object({
        sampleId: string({ required_error: "Sample id param is required!" }).transform((val, ctx) => {
            if (!mongoose.Types.ObjectId.isValid(val)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Sample id param is a invalid ID.",
                });
            }

            return val;
        }),
    }),
}).strip();

export type SaveQuestionsByGroupDTO = z.infer<typeof saveQuestionsByGroupSchema>;
