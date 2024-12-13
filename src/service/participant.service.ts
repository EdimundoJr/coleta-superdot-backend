import mongoose from "mongoose";
import ResearcherModel from "../model/researcher.model";
import * as EmailUtils from "../util/emailSender.util";
import { DateTime } from "luxon";
import { VERIFICATION_CODE_VALID_TIME_IN_MILISECONDS } from "../util/consts";
import { IParticipant } from "../interface/participant.interface";
import { ISecondSource } from "../interface/secondSource.interface";
import { PartialDeep } from "type-fest";
import { getSampleById } from "./sample.service";
import crypto from "crypto";
import { ParticipantModel } from "../model/schemas/participant.schema";
import { issueParticipantAccessToken } from "./auth.service";
import ISample from "../interface/sample.interface";
import { omit, update } from "lodash";
import { finishForm } from "./adultForm.service";
import { FormAlreadyFinished } from "../error/participant.error";

interface FindParticipantByEmailParams {
    sample: ISample;
    participantEmail: string;
}

export function findParticipantByEmail({ sample, participantEmail }: FindParticipantByEmailParams) {
    const participant = sample.participants?.find(
        (participant) => participant?.personalData?.email === participantEmail
    );

    return participant;
}

interface FindParticipantByIdParams {
    sample: ISample;
    participantId: string;
}

export function findParticipantById({ sample, participantId }: FindParticipantByIdParams) {
    console.log("aqui 2")
    console.log(participantId)

    if (!mongoose.Types.ObjectId.isValid(participantId)) {
        throw new Error("Participant id is invalid!");
    }

    const participant = sample.participants?.find((participant) => participant?._id?.toString() === participantId);

    if (!participant) {
        throw new Error("Participant not found");
    }

    return participant;
}

interface SendEmailVerificationParams {
    participantEmail: string;
    sampleId: string;
}

export async function sendEmailVerification({ participantEmail, sampleId }: SendEmailVerificationParams) {
    const verificationCode = crypto.randomBytes(128).toString("hex");

    const { researcherDoc, sample } = await getSampleById({ sampleId });

    if (sample.status !== "Autorizado" || !sample.qttParticipantsAuthorized) {
        throw new Error("This sample was not authorized!");
    }

    if ((sample.participants?.length || 0) + 1 > sample.qttParticipantsAuthorized)
        throw new Error("This sample is full of participants.");

    let participant = findParticipantByEmail({ sample, participantEmail });

    if (participant?.adultForm?.endFillFormAt) {
        throw new FormAlreadyFinished("The form was already finished by the participant.");
    }

    if (participant) {
        participant.verification = {
            code: verificationCode,
            generatedAt: new Date(),
        };
    } else {
        // New participant
        participant = {
            personalData: { email: participantEmail },
            verification: {
                code: verificationCode,
                generatedAt: new Date(),
            },
        };

        let arrLen = sample.participants?.push(participant);
        if (sample.participants && arrLen) {
            participant = sample.participants[arrLen - 1]; // Get participant id
        }
    }

    if (!participant._id) {
        throw new Error("Cannot send the verification email.");
    }

    await researcherDoc.save();

    EmailUtils.dispatchParticipantVerificationEmail({
        participantName: participant.personalData?.fullName,
        participantEmail,
        verificationCode,
        participantId: participant._id,
        sampleId,
    });

    return true;
}

interface ValidateEmailVerificationParams {
    participantId: string;
    sampleId: string;
    code: string;
}

export async function validateEmailVerificationCode({
    participantId,
    sampleId,
    code,
}: ValidateEmailVerificationParams) {
    const { researcherDoc, sample } = await getSampleById({ sampleId });
    const participant = findParticipantById({ sample, participantId });

    if (!participant?._id) {
        throw Error("Participant email not found.");
    }

    if (!participant.verification || !participant.verification.code || !participant.verification.generatedAt) {
        throw Error("Verification code not requested!");
    }

    if (participant.verification.code !== code) {
        throw Error("Invalid verification code!");
    }

    const codeGeneratedAtInMs = DateTime.fromJSDate(participant.verification.generatedAt).toMillis();
    const currentDateInMs = DateTime.now().toMillis();

    if (currentDateInMs - codeGeneratedAtInMs > VERIFICATION_CODE_VALID_TIME_IN_MILISECONDS) {
        throw Error("Verification code expired!");
    }

    return {
        token: issueParticipantAccessToken({ participantId: participant._id }),
        participant,
        researcherName: researcherDoc.personalData.fullName,
    };
}

interface SaveParticipantDataParams {
    sampleId: string;
    participantId: string;
    participantData: PartialDeep<IParticipant>;
}

export async function saveParticipantData({ sampleId, participantId, participantData }: SaveParticipantDataParams) {
    let { sample } = await getSampleById({ sampleId });
    const participant = findParticipantById({ participantId, sample });
    if (participant.personalData?.email) {
        participantData = {
            ...participantData,
            personalData: {
                ...participantData.personalData,
                email: participant.personalData.email,
            },
        };
    }

    await ResearcherModel.findOneAndUpdate(
        { "researchSamples._id": sampleId, "researchSamples.participants._id": participantId },
        {
            $set: {
                "researchSamples.$[sam].participants.$[part].personalData": participantData.personalData,
                "researchSamples.$[sam].participants.$[part].familyData": participantData.familyData,
                "researchSamples.$[sam].participants.$[part].addressData": participantData.addressData,
                "researchSamples.$[sam].participants.$[part].adultForm.startFillFormAt": new Date(),
            },
        },
        {
            arrayFilters: [{ "sam._id": sampleId }, { "part._id": participantId }],
            new: true,
        }
    );

    return true;
}

interface SubmitParticipantDataParams {
    sampleId: string;
    participantId: string;
    participantData: PartialDeep<IParticipant>;
}

export async function submitParticipantData({ sampleId, participantId, participantData }: SubmitParticipantDataParams) {
    try {
        ParticipantModel.validate(participantData);
    } catch (e) {
        console.error(e);
        throw new Error("Participant data is invalid!");
    }

    await saveParticipantData({ sampleId, participantId, participantData });

    return true;
}

interface AcceptAllSampleDocs {
    sampleId: string;
    participantId: string;
}

export async function acceptAllSampleDocs({ sampleId, participantId }: AcceptAllSampleDocs) {
    const { researcherDoc, sample } = await getSampleById({ sampleId });
    const participant = findParticipantById({ sample, participantId });

    if (sample.researchCep.taleDocument) {
        participant.acceptTaleAt = new Date();
    }

    if (sample.researchCep.tcleDocument) {
        participant.acceptTcleAt = new Date();
    }

    await researcherDoc.save();

    return true;
}

interface SaveSecondSourcesParams {
    sampleId: string;
    participantId: string;
    secondSources: ISecondSource[];
}

export async function saveSecondSources({ sampleId, participantId, secondSources }: SaveSecondSourcesParams) {
    const secondSourcesIndicated = secondSources.map((secondSource) => {
        return {
            ...secondSource,
            indicated: true,
        };
    });

    await ResearcherModel.findOneAndUpdate(
        { "researchSamples._id": sampleId, "researchSamples.participants._id": participantId },
        {
            $set: {
                "researchSamples.$[sam].participants.$[part].secondSources": secondSourcesIndicated,
            },
        },
        {
            arrayFilters: [{ "sam._id": sampleId }, { "part._id": participantId }],
        }
    );

    return true;
}

interface AutobiographyParams {
    sampleId: string;
    participantId: string;
    autobiographyVideo?: string;
    autobiographyText?: string;
    submitForm?: boolean;
}

export async function saveAutobiography({
    sampleId,
    participantId,
    autobiographyVideo,
    autobiographyText,
    submitForm,
}: AutobiographyParams) {
    if (!autobiographyText?.length && !autobiographyVideo?.length) {
        throw new Error("Autobiography text or video is required!");
    }

    const { researcherDoc, sample } = await getSampleById({ sampleId });
    const participant = findParticipantById({ sample, participantId });

    participant.autobiography = {
        text: autobiographyText,
        videoUrl: autobiographyVideo,
    };

    await researcherDoc.save();

    if (submitForm) {
        if (!participant.secondSources) {
            throw new Error("The participant don't indicate second sources.");
        }

        await finishForm({
            participantId,
            sampleId,
            secondSourcesToDispatchEmails: participant.secondSources,
        });
    }

    return true;
}

interface evaluateAutobiographyParams {
    sampleId: string;
    participantId: string;
    idEvalueAutobiography?: number;
    textEvalueAutobiography?: string;
    commentEvalueAutobiography?: string;
    markEvalueAutobiography?: string;
    startEvalueAutobiography?: number;
    endEvalueAutobiography?: number;
    backgroundEvalueAutobiography?: string,
    submitForm?: boolean
};

export async function saveEvalueAutobiography({
    sampleId,
    participantId,
    idEvalueAutobiography,
    textEvalueAutobiography,
    commentEvalueAutobiography,
    markEvalueAutobiography,
    startEvalueAutobiography,
    endEvalueAutobiography,
    backgroundEvalueAutobiography,
    submitForm,
}: evaluateAutobiographyParams) {



    await ResearcherModel.findOneAndUpdate(
        { "researchSamples._id": sampleId, "researchSamples.participants._id": participantId },
        {
            $push: {
                "researchSamples.$[sam].participants.$[part].evaluateAutobiography": {
                    id: idEvalueAutobiography,
                    text: textEvalueAutobiography,
                    comment: commentEvalueAutobiography,
                    mark: markEvalueAutobiography,
                    start: startEvalueAutobiography,
                    end: endEvalueAutobiography,
                    background: backgroundEvalueAutobiography,
                }

            },
        },

        {
            arrayFilters: [{ "sam._id": sampleId }, { "part._id": participantId }],
        }
    );

    return true; 


}



interface GetParticipantDataByIdParams {
    sampleId: string;
    participantId: string;
}

export async function getParticipantDataById({ sampleId, participantId }: GetParticipantDataByIdParams) {
    const { sample } = await getSampleById({ sampleId });
    const participant = findParticipantById({ sample, participantId });

    return omit(participant, "verification");
}
