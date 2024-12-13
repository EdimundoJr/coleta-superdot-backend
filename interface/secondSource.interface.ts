import { EAdultFormGroup, EducationLevelType, RelationshipsType, TRelationshipTime } from "../util/consts";
import IQuestion from "./adultForm/question.interface";

export interface ISecondSource {
    _id?: string;
    personalData: {
        email: string;
        fullName: string;
        birthDate: Date;
        relationship: RelationshipsType;
        relationshipTime: TRelationshipTime;
        job: string;
        occupation: string;
        street: string;
        district: string;
        countryCity: string;
        phone: string;
        educationLevel: EducationLevelType;
    };
    verification?: {
        code: string;
        generatedAt: Date;
    };
    acceptTcleAt?: Date;
    acceptTaleAt?: Date;
    adultForm?: {
        endFillFormAt?: Date;
        startFillFormAt?: Date;
        answersByGroup?: { groupName: string; sequence: EAdultFormGroup; questions: IQuestion[] }[];
        totalPunctuation?: number;
        knowledgeAreas?: string[];
    };
    teacherSubject?: string;
    createdAt?: string;
}
