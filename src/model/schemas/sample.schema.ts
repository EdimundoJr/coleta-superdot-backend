import { Schema } from "mongoose";
import ISample from "../../interface/sample.interface";
import { sampleReviewSchema } from "./sampleReview.schema";
import {
    DEVICES_ARRAY,
    EAdultFormGroup,
    EDUCATION_LEVEL_ARRAY,
    GENDER_ARRAY,
    INCOME_LEVELS_ARRAY,
    INSTITUITION_TYPE_ARRAY,
    MARITAL_STATUS_ARRAY,
    RELATIONSHIPS_ARRAY,
    RELATIONSHIP_TIME_ARRAY,
    SAMPLE_STATUS_ARRAY,
} from "../../util/consts";
import { questionSchema } from "../adultForm/schemas/question.schema";
import { evalueBioSchema } from "./evalueBio.schema";

export const sampleSchema = new Schema<ISample>(
    {
        researchTitle: {
            type: String,
            required: [true, "Research title is required!"],
        },
        sampleTitle: {
            type: String,
            required: [true, "Sample title is required!"],
        },
        sampleGroup: {
            type: String,
            required: [true, "Sample group is required!"],
        },
        qttParticipantsRequested: {
            type: Number,
            required: [true, "Is necessary to inform the sample partcipants quantity requested."],
        },
        qttParticipantsAuthorized: Number,
        researchCep: {
            cepCode: {
                type: String,
                required: [true, "CEP code is required."],
            },
            researchDocument: {
                type: String,
                required: [true, "Research document is required."],
            },
            tcleDocument: {
                type: String,
                required: [true, "TCLE document is required."],
            },
            taleDocument: String,
        },
        status: {
            type: String,
            enum: SAMPLE_STATUS_ARRAY,
            required: [true, "A status is required."],
        },
        countryRegion: {
            type: String,
            required: [true, "Sample country region is required."],
        },
        countryState: {
            type: String,
            required: [true, "Sample country state is required."],
        },
        countryCity: {
            type: String,
            required: [true, "Sample country city is required."],
        },
        instituition: {
            name: {
                type: String,
                required: [true, "Sample instituition name is required."],
            },
            instType: {
                type: String,
                enum: INSTITUITION_TYPE_ARRAY,
                required: [true, "Sample instituition type is required."],
            },
        },
        reviews: [sampleReviewSchema],

        // I Can't validate participant info directly in this schema, because the participant
        // info can be saved in parts. In other words, the participant can save some fields
        // at a specific moment and, then, save other fields at another's moments.
        participants: [
            {
                personalData: {
                    fullName: String,
                    phone: String,
                    email: String,
                    maritalStatus: {
                        type: String,
                        enum: MARITAL_STATUS_ARRAY,
                    },
                    job: String,
                    occupation: String,
                    educationLevel: {
                        type: String,
                        enum: EDUCATION_LEVEL_ARRAY,
                    },
                    gender: {
                        type: String,
                        enum: GENDER_ARRAY,
                    },
                    age: Number,
                    birthDate: Date,
                },
                familyData: {
                    qttChildrens: Number,
                    qttSiblings: Number,
                    qttFamilyMembers: String,
                    familyMonthIncome: {
                        type: String,
                        enum: INCOME_LEVELS_ARRAY,
                    },
                    houseDevices: {
                        type: Array,
                        of: String,
                        enum: DEVICES_ARRAY,
                    },
                    outsideHouseDevices: {
                        type: Array,
                        of: String,
                        enum: DEVICES_ARRAY,
                    },
                },
                addressData: {
                    state: String,
                    city: String,
                    district: String,
                    street: String,
                    houseNumber: String,
                },
                verification: {
                    code: String,
                    generatedAt: Date,
                },
                acceptTaleAt: Date,
                acceptTcleAt: Date,
                giftdnessIndicatorsByResearcher: Boolean,
                knowledgeAreasIndicatedByResearcher: {
                    type: Array,
                    of: String,
                },
                adultForm: {
                    endFillFormAt: Date,
                    startFillFormAt: Date,
                    totalPunctuation: Number,
                    giftednessIndicators: Boolean,
                    knowledgeAreas: {
                        type: Array,
                        of: String,
                    },
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
                secondSources: [
                    {
                        personalData: {
                            fullName: String,
                            email: {
                                type: String,
                                trim: true,
                                lowercase: true,
                            },
                            age: Number,
                            birthDate: Date,
                            relationship: {
                                type: String,
                                enum: RELATIONSHIPS_ARRAY,
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
                            totalPunctuation: Number,
                            knowledgeAreas: {
                                type: Array,
                                of: String,
                            },
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
                ],
            },
        ],
    },
    {
        timestamps: true,
    }
);
