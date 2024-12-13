import { Schema, model } from "mongoose";
import { IParticipant } from "../../interface/participant.interface";
import {
    DEVICES_ARRAY,
    EAdultFormGroup,
    EDUCATION_LEVEL_ARRAY,
    GENDER_ARRAY,
    INCOME_LEVELS_ARRAY,
    MARITAL_STATUS_ARRAY,
} from "../../util/consts";
import { secondSourceSchema } from "./secondSource.schema";
import { questionSchema } from "../adultForm/schemas/question.schema";
import { evalueBioSchema } from "./evalueBio.schema";

export const participantSchema = new Schema<IParticipant>(
    {
        personalData: {
            fullName: {
                type: String,
                required: [true, "Participant full name is required!"],
            },
            phone: {
                type: String,
                required: [true, "Participant phone is required!"],
            },
            email: {
                type: String,
                required: [true, "Participant email is required!"],
            },
            maritalStatus: {
                type: String,
                enum: MARITAL_STATUS_ARRAY,
                required: [true, "Participant marital status is required!"],
            },
            job: {
                type: String,
                required: [true, "Participant job is required!"],
            },
            occupation: {
                type: String,
            },
            educationLevel: {
                type: String,
                enum: EDUCATION_LEVEL_ARRAY,
                required: [true, "Participant education level is required!"],
            },
            gender: {
                type: String,
                enum: GENDER_ARRAY,
                required: [true, "Participant gender is required!"],
            },
            age: {
                type: Number,
            },
            birthDate: {
                type: Date,
                required: [true, "Participant birthDate is required!"],
            },
        },
        familyData: {
            qttChildrens: {
                type: Number,
                required: [true, "Participant childrens quantity is required!"],
            },
            qttSiblings: {
                type: Number,
                required: [true, "Participant siblings quantity is required!"],
            },
            qttFamilyMembers: {
                type: String,
                required: [true, "Participant family members quantity is required!"],
            },
            familyMonthIncome: {
                type: String,
                enum: INCOME_LEVELS_ARRAY,
                required: [true, "Participant family month income is required!"],
            },
            houseDevices: {
                type: [String],
                enum: DEVICES_ARRAY,
            },
            outsideHouseDevices: {
                type: [String],
                enum: DEVICES_ARRAY,
            },
        },
        addressData: {
            state: {
                type: String,
            },
            city: {
                type: String,
                required: [true, "Participant city is required!"],
            },
            district: {
                type: String,
                required: [true, "Participant district is required!"],
            },
            street: {
                type: String,
                required: [true, "Participant street is required!"],
            },
            houseNumber: {
                type: String,
                required: [true, "Participant houseNumber is required!"],
            },
        },
        acceptTaleAt: Date,
        acceptTcleAt: Date,
        giftdnessIndicatorsByResearcher: Boolean,
        knowledgeAreasIndicatedByResearcher: [String],
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
        autobiography: {
            text: String,
            videoUrl: String,
        },
        evaluateAutobiography: [evalueBioSchema],
        secondSources: [secondSourceSchema],
    },
    {
        timestamps: true,
    }
);

export const ParticipantModel = model<IParticipant>("Participant", participantSchema);
