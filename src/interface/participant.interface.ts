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
import  IBio  from "./evalueAutobiograph";

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
        age: Number;
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
        state: string;
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
    giftdnessIndicatorsByResearcher?: boolean;
    knowledgeAreasIndicatedByResearcher?: string[];
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
    evaluateAutobiography?: IBio[],

    secondSources?: PartialDeep<ISecondSource>[];
    createdAt?: Date;
    updatedAt?: Date;
}
