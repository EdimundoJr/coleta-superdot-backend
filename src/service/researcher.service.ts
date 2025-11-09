import { FilterQuery, QueryOptions, Types, UpdateQuery } from "mongoose";
import IResearcher from "../interface/researcher.interface";
import ResearcherModel from "../model/researcher.model";
import { omit } from "lodash";
import { compareHashes } from "../util/hash";
import { getSampleById } from "./sample.service";
import { findParticipantById } from "./participant.service";


export async function createResearcher(researcherData: IResearcher) {
    try {
        const researcher = await ResearcherModel.create(researcherData);
        return omit(researcher.toJSON(), "passwordHash");
    } catch (e: any) {
        console.error("Erro ao criar pesquisador:", e);

        if (e.code === 11000 && e.keyPattern?.email) {
            throw new Error("Este e-mail já está cadastrado no sistema.");
        }

        throw new Error("Erro interno ao criar pesquisador.");
    }
}

export async function updateResearcher(
    query: FilterQuery<IResearcher>,
    update: UpdateQuery<IResearcher>,
    options: QueryOptions = {}
): Promise<IResearcher> {
    try {
        const researcherUpdated = await ResearcherModel.findOneAndUpdate(query, update, options).exec();

        if (!researcherUpdated) {
            throw new Error("Researcher is not found");
        }

        return omit(researcherUpdated.toJSON(), "passwordHash");
    } catch {
        throw new Error("Is not possible updated Researcher");
    }
}

export async function deleteResearcher(researcherId: Types.ObjectId): Promise<IResearcher> {
    try {
        const researcherDeleted = await ResearcherModel.findByIdAndDelete(researcherId).exec();
        if (!researcherDeleted) {
            throw new Error("Researcher is not found");
        }
        return omit(researcherDeleted.toJSON(), "passwordHash");
    } catch {
        throw new Error("Is not possible delete Researcher");
    }
}

export async function paginateResearchers(
    currentPage: number,
    itemsPerPage: number,
    filter: { userName?: string; userEmail?: string },
    currentResearcherId: string
) {
    try {
        const query = ResearcherModel.find(
            {
                $and: [
                    filter.userName ? { "personalData.fullName": RegExp(filter.userName, "i") } : {},
                    filter.userEmail ? { email: RegExp(filter.userEmail, "i") } : {},
                ],
            },
            {
                fullname: "$personalData.fullName",
                role: true,
                email: true,
            }
        )
            .where("_id")
            .ne(currentResearcherId)
            .limit(itemsPerPage)
            .skip((currentPage - 1) * itemsPerPage);

        const researchers = await query.exec();

        // O countDocuments precisa usar a mesma query para ser preciso
        const countQuery = ResearcherModel.countDocuments({
            $and: [
                filter.userName ? { "personalData.fullName": RegExp(filter.userName, "i") } : {},
                filter.userEmail ? { email: RegExp(filter.userEmail, "i") } : {},
            ],
        }).where("_id").ne(currentResearcherId);

        const totalResearchers = await countQuery.exec();

        return {
            researchers,
            totalResearchers,
        };
    } catch (error) {
        console.error(error);
        throw new Error("Cannot paginate researchers.");
    }
}

export async function findResearcher(query: FilterQuery<IResearcher>): Promise<IResearcher> {
    const researcher = await ResearcherModel.findOne(query).lean().exec();
    if (!researcher) {
        throw new Error("Researcher is not found");
    }
    return omit(researcher, "passwordHash");
}

export async function validatePassword({ email, password }: { email: string; password: string }) {
    const researcher = await ResearcherModel.findOne({ email });

    if (!researcher) {
        throw new Error("Email not found");
    }

    const isValid = await compareHashes(password, researcher.passwordHash || "");

    if (!isValid) {
        throw new Error("Passwords don't match!");
    }

    return omit(researcher.toJSON(), "passwordHash");
}

export async function getResearcherRole(id: string): Promise<string | undefined> {
    try {
        const researcher = await ResearcherModel.findById(id, { role: true }).lean().exec();
        if (!researcher) {
            throw new Error("Researcher not found");
        }
        return researcher.role;
    } catch (error) {
        console.error(error);
        throw new Error("Unknown error");
    }
}

export async function isAttachmentOwner(fileName: string, researcherId: string) {
    const researcher = await ResearcherModel.findOne({
        $or: [
            { "researchSamples.researchCep.researchDocument": fileName },
            { "researchSamples.researchCep.tcleDocument": fileName },
            { "researchSamples.researchCep.taleDocument": fileName },
        ],
    });

    if (researcher?._id.toString() !== researcherId.toString()) {
        return false;
    }

    return true;
}

export async function getResearcherNameBySampleId(sampleId: string) {
    const { researcherDoc } = await getSampleById({ sampleId });
    return researcherDoc.personalData.fullName;
}

interface GetResearchDataBySampleIdAndParticipantIdParams {
    sampleId: string;
    participantId: string;
}

export async function getResearchDataBySampleIdAndParticipantId({
    sampleId,
    participantId,
}: GetResearchDataBySampleIdAndParticipantIdParams) {
    const { researcherDoc, sample } = await getSampleById({ sampleId });
    const participant = findParticipantById({ sample, participantId });

    return {
        researcherName: researcherDoc.personalData.fullName,
        participantName: participant.personalData?.fullName,
    };
}
