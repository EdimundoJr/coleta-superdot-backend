import { Schema, Types, model } from "mongoose";
import { IParticipantSession } from "../interface/participantSession.interface";

const participantSessionSchema = new Schema<IParticipantSession>(
    {
        participantEmail: {
            type: String,
            required: [true, "All participant sessions require a participant email."],
        },
        validationCode: Number,
        validSession: Boolean,
    },
    {
        timestamps: true,
    }
);

const ParticipantSessionModel = model<IParticipantSession>("ParticipantSession", participantSessionSchema);

export default ParticipantSessionModel;
