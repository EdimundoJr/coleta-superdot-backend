import { PartialDeep } from "type-fest";
import {
    DeviceType,
    EAdultFormGroup,
    EducationLevelType,
    GenderType,
    IncomeLevelType,
    MaritalStatusType,
} from "../util/consts";
import IQuestion from "./adultForm/question.interface";
import { ISecondSource } from "./secondSource.interface";

export interface IParticipant {
    _id?: string;
    personalData: {
        fullName: string;
        phone: string;
        email: string;
        maritalStatus: MaritalStatusType;
        job: string;
        occupation: string;
        educationLevel: EducationLevelType;
        gender: GenderType;
        birthDate: Date;
    };
    familyData: {
        qttChildrens: number;
        qttSiblings: number;
        qttFamilyMembers: string;
        familyMonthIncome: IncomeLevelType;
        houseDevices?: DeviceType[];
        outsideHouseDevices?: DeviceType[];
    };
    addressData: {
        city: string;
        district: string;
        street: string;
        houseNumber: string;
    };
    verification?: {
        code: string;
        generatedAt: Date;
    };
    acceptTcleAt?: Date;
    acceptTaleAt?: Date;
    giftdnessIndicators?: boolean;
    adultForm?: {
        endFillFormAt?: Date;
        startFillFormAt?: Date;
        answersByGroup?: { groupName: string; sequence: EAdultFormGroup; questions: IQuestion[] }[];
        totalPunctuation?: number;
        giftednessIndicators?: boolean;
        knowledgeAreas?: string[];
    };
    autobiography?: {
        text?: string;
        videoUrl?: string;
    };
    secondSources?: PartialDeep<ISecondSource>[];
    createdAt?: Date;
    updatedAt?: Date;
}
