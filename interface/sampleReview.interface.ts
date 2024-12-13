import { SampleStatus } from "../util/consts";
import IResearcher from "./researcher.interface";

export default interface ISampleReview {
    _id?: string;
    previousStatus?: SampleStatus;
    nextStatus: SampleStatus;
    qttParticipantsAuthorized?: number;
    reviewMessage: string;
    reviewerId: IResearcher["_id"];
    createdAt?: Date;
    updatedAt?: Date;
}
