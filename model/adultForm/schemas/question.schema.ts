import mongoose, { Schema } from "mongoose";
import IQuestion from "../../../interface/adultForm/question.interface";
import { EQuestionType } from "../../../util/consts";

/*
 * Schema used to store the questions and your options.
 * Furthemore, this schema is used to store the participant answers too.
 */
export const questionSchema = new Schema<IQuestion>({
    statement: {
        type: String,
        required: [true, "Question statement is required!"],
    },
    questionType: {
        type: Number,
        enum: EQuestionType,
        required: [true, "Question type is required!"],
    },
    options: [
        {
            value: String,
            points: Number,
        },
    ],
    required: Boolean,
    parentQuestion: {
        parentId: mongoose.Types.ObjectId,
        isRequiredOnParentValue: String,
    },
    answer: Schema.Types.Mixed, // Can be: String | String[]
    answerPoints: Number, // Points received by the participant
});
