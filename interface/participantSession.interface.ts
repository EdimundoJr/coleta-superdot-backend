export interface IParticipantSession {
    _id?: string;
    participantEmail: string;
    validationCode?: Number;
    validSession?: boolean;
    createdAt?: string;
    updatedAt?: string;
}
