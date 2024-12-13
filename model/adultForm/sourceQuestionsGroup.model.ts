import { Schema, model } from "mongoose";
import ISourceQuestionsGroup from "../../interface/adultForm/sourceQuestionsGroup.interface";
import { EAdultFormGroup, EAdultFormSource } from "../../util/consts";
import { questionSchema } from "./schemas/question.schema";

const sourceQuestionsGroup = new Schema<ISourceQuestionsGroup>(
    {
        source: {
            type: Number,
            enum: EAdultFormSource,
            required: [true, "A source name is required"],
            unique: true,
        },
        groups: [
            {
                groupName: {
                    type: String,
                    required: [true, "Group name is required!"],
                },
                sequence: {
                    type: Number,
                    enum: EAdultFormGroup,
                    required: [true, "Group sequence is required!"],
                },
                questions: [questionSchema],
            },
        ],
    },
    {
        timestamps: true,
    }
);

const SourceQuestionsGroup = model<ISourceQuestionsGroup>("SourceQuestionsGroup", sourceQuestionsGroup);

export default SourceQuestionsGroup;
