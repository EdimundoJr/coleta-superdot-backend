import { InstituitionType, SampleStatus } from "../util/consts";
import ISampleReview from "./sampleReview.interface";

export default interface ISample {
    _id?: string;
    researchTitle: string;
    sampleTitle: string;
    sampleGroup?: string; // Required only in POST actions, unnecessary in PUT actions
    qttParticipantsRequested: number;
    qttParticipantsAuthorized?: number; // Updated only by backend
    qttParticipantsRegistered?: number; // Updated only by backend
    researchCep: {
        cepCode: string;
        researchDocument?: string;
        tcleDocument?: string;
        taleDocument?: string;
    };
    status?: SampleStatus; // Updated only by backend
    countryRegion: string;
    countryState: string;
    countryCity: string;
    instituition: {
        name: string;
        instType: InstituitionType;
    };
    reviews?: [ISampleReview];
    participants?: [];
    approvedAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}
