import { Schema, model } from "mongoose";
import { EAdultFormGroup, RELATIONSHIPS_ARRAY, RELATIONSHIP_TIME_ARRAY } from "../../util/consts";
import { ISecondSource } from "../../interface/secondSource.interface";
import { questionSchema } from "../adultForm/schemas/question.schema";

export const secondSourceSchema = new Schema<ISecondSource>(
    {
        personalData: {
            fullName: {
                type: String,
                uppercase: true,
                trim: true,
                required: [true, "Second source name is required!"],
            },
            email: {
                type: String,
                match: [
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                    "E-mail should be valid",
                ],
                trim: true,
                lowercase: true,
                required: [true, "Second source is required!"],
            },
            birthDate: Date,
            relationship: {
                type: String,
                enum: RELATIONSHIPS_ARRAY,
                required: [true, "Second source relationship is required!"],
            },
            relationshipTime: {
                type: String,
                enum: RELATIONSHIP_TIME_ARRAY,
            },
            job: String,
            occupation: String,
            street: String,
            district: String,
            countryCity: String,
            phone: String,
            educationLevel: String,
        },
        verification: {
            code: String,
            generatedAt: Date,
        },
        acceptTaleAt: Date,
        acceptTcleAt: Date,
        adultForm: {
            endFillFormAt: Date,
            startFillFormAt: Date,
            answersByGroup: [
                {
                    groupName: String,
                    sequence: {
                        type: Number,
                        enum: EAdultFormGroup,
                    },
                    questions: [questionSchema],
                },
            ],
        },
        teacherSubject: String,
    },
    {
        timestamps: true,
    }
);

export const SecondSourceModel = model<ISecondSource>("SecondSource", secondSourceSchema);
