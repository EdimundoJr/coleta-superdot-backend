import mongoose from "mongoose";
import { Page } from "../interface/page.interface";
import ISample from "../interface/sample.interface";
import ResearcherModel from "../model/researcher.model";
import { dispatchParticipantIndicationEmail } from "../util/emailSender.util";
import { DashboardInfo, MonthlyProgressItem } from '../model/dashboard.models';


interface GetSampleByIdParams {
    sampleId: string;
}

/**
 * The function `getSampleById` retrieves a sample by its ID from a researcher document.
 * @param {GetSampleByIdParams} Object
 * @param {string} Object.sampleId The ID of the sample to retrieve.
 * @returns an object with two properties: "researcherDoc" and "sample". The researcher doc
 * allow to make changes in the doc and save it.
 */
export async function getSampleById({ sampleId }: GetSampleByIdParams) {
    if (!mongoose.Types.ObjectId.isValid(sampleId)) {
        throw new Error("Sample id is invalid.");
    }

    const researcherDoc = await ResearcherModel.findOne({ "researchSamples._id": sampleId });

    if (!researcherDoc || !researcherDoc.researchSamples) {
        throw new Error("Sample not found.");
    }

    const sample = researcherDoc.researchSamples.find((sample) => sample._id?.toString() === sampleId);

    if (!sample) {
        throw new Error("Sample not found.");
    }

    return {
        researcherDoc,
        sample,
    };
}

export async function createSample(researcherId: string, sampleData: ISample): Promise<ISample> {
    const researcher = await ResearcherModel.findById(researcherId);

    if (!researcher) {
        throw new Error("Cannot find the researcher.");
    }

    if (sampleData.qttParticipantsAuthorized) {
        throw new Error("Cannot create a sample with the quantity participants authorized set.");
    }

    sampleData.status = "Pendente";

    researcher.researchSamples?.push(sampleData);

    await researcher.save();

    return sampleData;
}

export async function editSample(researcherId: string, sampleId: string, newSampleData: ISample): Promise<Boolean> {
    const researcher = await ResearcherModel.findById(researcherId);

    if (!researcher) {
        throw new Error("Cannot find the researcher.");
    }

    if (newSampleData.qttParticipantsAuthorized) {
        throw new Error("Cannot update the qttParticipantsAuthorized field.");
    }

    if (!researcher.researchSamples) {
        throw new Error("Research haven't samples.");
    }

    newSampleData.status = "Pendente";

    researcher.researchSamples = researcher.researchSamples.map((sample) => {
        if (sample._id?.toString() === sampleId) {
            if (!newSampleData.researchCep.researchDocument) {
                newSampleData.researchCep.researchDocument = sample.researchCep.researchDocument;
            }
            if (!newSampleData.researchCep.tcleDocument) {
                newSampleData.researchCep.tcleDocument = sample.researchCep.tcleDocument;
            }
            if (!newSampleData.researchCep.taleDocument) {
                newSampleData.researchCep.taleDocument = sample.researchCep.taleDocument;
            }

            return {
                ...newSampleData,
                _id: sampleId,
                sampleGroup: sample.sampleGroup,
                reviews: sample.reviews,
            };
        } else return sample;
    });

    await researcher.save();

    return true;
}

interface FilterPage {
    researchTitle: string;
    sampleTitle: string;
}

export async function paginateResearcherSamples(
    researcherId: string,
    currentPage: number,
    itemsPerPage: number,
    filters?: FilterPage
) {
    const researcher = await ResearcherModel.findById(researcherId, { researchSamples: true })
        .limit(itemsPerPage * currentPage)
        .skip((currentPage - 1) * itemsPerPage)
        .exec();

    if (!researcher) {
        throw new Error("Cannot find the researcher.");
    }

    let samples = researcher.researchSamples;
    if (researcher.researchSamples) {
        samples = researcher.researchSamples.filter((sample) => {
            let returnElement = true;
            if (filters?.researchTitle) {
                returnElement = sample.researchTitle.includes(filters?.researchTitle);
            }
            if (filters?.sampleTitle) {
                returnElement = sample.sampleTitle.includes(filters?.sampleTitle);
            }
            return returnElement;
        });
    }

    return {
        data: samples,
        pagination: {
            totalItems: researcher.researchSamples?.length || 0,
            page: currentPage,
        },
    };
}

export async function paginateAllSamples(
    currentResearcherId: string,
    currentPage: number,
    itemsPerPage: number,
    filterStatus: string | undefined
) {
    const page = await ResearcherModel.aggregate<Page>()
        .match({ _id: { $ne: currentResearcherId } })
        .unwind("$researchSamples")
        .match(filterStatus ? { "researchSamples.status": filterStatus } : {})
        .project({
            researcherId: "$_id",
            _id: 0,
            sampleId: "$researchSamples._id",
            sampleName: "$researchSamples.sampleTitle",
            researcherName: "$personalData.fullName",
            cepCode: "$researchSamples.researchCep.cepCode",
            qttParticipantsRequested: "$researchSamples.qttParticipantsRequested",
            qttParticipantsAuthorized: "$researchSamples.qttParticipantsAuthorized",
            currentStatus: "$researchSamples.status",
            files: {
                researchDocument: "$researchSamples.researchCep.researchDocument",
                tcleDocument: "$researchSamples.researchCep.tcleDocument",
                taleDocument: "$researchSamples.researchCep.taleDocument",
            },
        })
        .facet({
            pagination: [{ $count: "totalItems" }, { $addFields: { page: currentPage } }],
            data: [{ $skip: (currentPage - 1) * itemsPerPage }, { $limit: itemsPerPage * currentPage }],
        })
        .unwind("$pagination")
        .exec();

    console.log(page);

    if (!page) {
        throw new Error("Any sample request was created yet.");
    }

    if (!page.length) {
        return [];
    }

    // The query should return an array with a single element.
    if (page.length > 1) {
        throw new Error("Unknown error occurred in sample service.");
    }

    return page[0];
}

export async function deleteSample(currentResearcherId: string, sampleId: string) {
    const researcher = await ResearcherModel.findById(currentResearcherId, { researchSamples: true }).exec();

    if (!researcher) {
        throw new Error("Cannot find the researcher.");
    }

    if (!researcher.researchSamples) {
        throw new Error("Research haven't samples.");
    }

    const sampleToDelete = researcher.researchSamples.find((sample) => sample._id?.toString() === sampleId);

    if (!sampleToDelete) {
        throw new Error("Cannot find the research sample.");
    }

    if (sampleToDelete.status === "Autorizado") {
        throw new Error("Cannot delete a sample authorized.");
    }

    researcher.researchSamples = researcher.researchSamples.filter((sample) => sample._id?.toString() !== sampleId);

    await researcher.save();

    return true;
}

interface IRequiredDoc {
    jsonFileKey: string;
    backendFileName: string;
    label: string;
}

export async function getRequiredDocs(sampleId: string) {
    if (!mongoose.Types.ObjectId.isValid(sampleId)) {
        throw new Error("Sample id is invalid.");
    }

    const researcher = await ResearcherModel.findOne(
        { "researchSamples._id": sampleId },
        {
            "researchSamples._id": 1,
            "researchSamples.researchCep.tcleDocument": 1,
            "researchSamples.researchCep.taleDocument": 1,
        }
    );

    if (!researcher || !researcher.researchSamples) {
        throw new Error("Sample not found!");
    }

    const sample = researcher.researchSamples.find((sample) => sample._id?.toString() === sampleId);

    if (!sample) {
        throw new Error("Sample not found!");
    }

    const docs: IRequiredDoc[] = [];

    if (sample.researchCep.taleDocument) {
        docs.push({
            jsonFileKey: "taleDocument",
            backendFileName: sample.researchCep.taleDocument,
            label: "Termo de Anuência Livre e Esclarecido",
        });
    }

    if (sample.researchCep.tcleDocument) {
        docs.push({
            jsonFileKey: "tcleDocument",
            backendFileName: sample.researchCep.tcleDocument,
            label: "Termo de Consentimento Livre e Esclarecido",
        });
    }

    return docs;
}

interface AddParticipantsParams {
    sampleId: string;
    participants: ISample["participants"];
}

/**
 * Add a array of participants inside a sample.
 * @param {AddParticipantsParams} Object
 * @param {string} Object.sampleId - The ID of sample to add the participants
 * @param {ISample["participants"]} Object.participants - The array of new participants
 * @returns a boolean value if the participants was added to the sample.
 */
export async function addParticipants({ sampleId, participants }: AddParticipantsParams) {
    const { researcherDoc, sample } = await getSampleById({ sampleId });

    if (sample.status !== "Autorizado" || !sample.qttParticipantsAuthorized) {
        throw new Error("This sample was not authorized!");
    }

    const participantsFiltered = participants?.filter((newParticipant) => {
        if (!newParticipant.personalData?.email?.length || !newParticipant.personalData?.fullName?.length) {
            return false;
        }

        return sample.participants?.every(
            (participant) => participant.personalData?.email !== newParticipant.personalData?.email
        );
    });

    if (!participantsFiltered?.length) throw new Error("Participants already added!");

    if (sample.participants) {
        sample.participants.push(...participantsFiltered);
    } else {
        sample.participants = [...participantsFiltered];
    }

    if (sample.participants?.length > sample.qttParticipantsAuthorized)
        throw new Error("The new participants quantity is greater then the quantity allowed to this sample.");

    await researcherDoc.save();

    participantsFiltered?.forEach((participant) => {
        dispatchParticipantIndicationEmail({
            participantEmail: participant.personalData?.email as string,
            participantName: participant.personalData?.fullName as string,
            researcherEmail: researcherDoc.email,
            researcherName: researcherDoc.personalData.fullName,
            sampleId,
        });
    });

    return true;
}

export async function loadInformationDashboard() {
    try {
        const result = await ResearcherModel.aggregate([
            {
                $facet: {
                    gender_female: [
                        { $unwind: "$researchSamples" },
                        { $unwind: "$researchSamples.participants" },
                        { $match: { "researchSamples.participants.personalData.gender": "Feminino" } },
                        { $count: "count_female" },
                    ],
                    gender_male: [
                        { $unwind: "$researchSamples" },
                        { $unwind: "$researchSamples.participants" },
                        { $match: { "researchSamples.participants.personalData.gender": "Masculino" } },
                        { $count: "count_male" },
                    ],
                    instituition: [
                        { $unwind: "$researchSamples" },
                        {
                            $group: {
                                _id: "$researchSamples.instituition.name",
                                count: { $sum: 1 }
                            }
                        },
                        {
                            $project: {
                                _id: 0,
                                label: "$_id",
                                count: "$count"
                            }
                        }
                    ],
                    sample: [
                        { $unwind: "$researchSamples" },
                        {
                            $group: {
                                _id: null,
                                total_samples: { $addToSet: "$researchSamples.sampleTitle" },
                            },
                        },
                        {
                            $project: {
                                _id: 0,
                                total_samples: { $size: "$total_samples" },
                            },
                        },
                    ],
                    participants: [
                        { $unwind: "$researchSamples" },
                        { $unwind: "$researchSamples.participants" },
                        {
                            $group: {
                                _id: null,
                                total_participants: { $sum: 1 },
                            },
                        },
                    ],
                    participantProgress: [
                        { $unwind: "$researchSamples" },
                        { $unwind: "$researchSamples.participants" },
                        {
                            $addFields: {
                                isSecondSourceFinished: {
                                    $gt: [
                                        {
                                            $size: {
                                                $filter: {
                                                    input: "$researchSamples.participants.secondSources",
                                                    as: "ss",
                                                    cond: { $ifNull: ["$$ss.adultForm.endFillFormAt", false] }
                                                }
                                            }
                                        },
                                        0
                                    ]
                                }
                            }
                        },
                        {
                            $project: {
                                status: {
                                    $switch: {
                                        branches: [
                                            {
                                                case: { $not: ["$researchSamples.participants.adultForm.startFillFormAt"] },
                                                then: "Não iniciado"
                                            },
                                            {
                                                case: { $not: ["$researchSamples.participants.adultForm.endFillFormAt"] },
                                                then: "Preenchendo"
                                            },
                                            {
                                                case: { $not: ["$isSecondSourceFinished"] },
                                                then: "Aguardando 2ª fonte"
                                            },
                                        ],
                                        default: "Finalizado"
                                    }
                                }
                            }
                        },
                        {
                            $group: {
                                _id: "$status",
                                count: { $sum: 1 }
                            }
                        }
                    ],
                    collectionStatus: [
                        { $unwind: "$researchSamples" },
                        {
                            $group: {
                                _id: "$researchSamples.status",
                                count: { $sum: 1 }
                            }
                        }
                    ],
                    regionalDistribution: [
                        { $unwind: "$researchSamples" },
                        {
                            $group: {
                                _id: "$researchSamples.countryState",
                                count: { $sum: 1 }
                            }
                        },
                        {
                            $project: {
                                _id: 0,
                                label: "$_id",
                                count: "$count"
                            }
                        }
                    ],
                    monthlyProgress: [
                        { $unwind: "$researchSamples" },
                        {
                            $project: {
                                month: { $month: "$researchSamples.createdAt" },
                                year: { $year: "$researchSamples.createdAt" },
                                participantsCount: { $size: "$researchSamples.participants" }
                            }
                        },
                        {
                            $group: {
                                _id: { month: "$month", year: "$year" },
                                totalSamples: { $sum: 1 },
                                totalParticipants: { $sum: "$participantsCount" }
                            }
                        },
                        { $sort: { "_id.year": 1, "_id.month": 1 } },
                    ],
                    ageDistribution: [
                        { $unwind: "$researchSamples" },
                        { $unwind: "$researchSamples.participants" },
                        {
                            $project: {
                                age: {
                                    $dateDiff: {
                                        startDate: "$researchSamples.participants.personalData.birthDate",
                                        endDate: new Date(),
                                        unit: "year"
                                    }
                                }
                            }
                        },
                        {
                            $bucket: {
                                groupBy: "$age",
                                boundaries: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, Infinity],
                                default: "Mais de 110",
                                output: {
                                    count: { $sum: 1 }
                                }
                            }
                        },
                        {
                            $project: {
                                _id: 0,
                                label: {
                                    $switch: {
                                        branches: [
                                            { case: { $eq: ["$_id", 0] }, then: "0-10" },
                                            { case: { $eq: ["$_id", 10] }, then: "11-20" },
                                            { case: { $eq: ["$_id", 20] }, then: "21-30" },
                                            { case: { $eq: ["$_id", 30] }, then: "31-40" },
                                            { case: { $eq: ["$_id", 40] }, then: "41-50" },
                                            { case: { $eq: ["$_id", 50] }, then: "51-60" },
                                            { case: { $eq: ["$_id", 60] }, then: "61-70" },
                                            { case: { $eq: ["$_id", 70] }, then: "71-80" },
                                            { case: { $eq: ["$_id", 80] }, then: "81-90" },
                                            { case: { $eq: ["$_id", 90] }, then: "91-100" },
                                            { case: { $eq: ["$_id", 100] }, then: "101-110" },
                                            { case: { $eq: ["$_id", 110] }, then: "Mais de 110" }
                                        ],
                                        default: "Outros"
                                    }
                                },
                                count: "$count"
                            }
                        },
                    ],
                    knowledgeAreaDistribution: [
                        { $unwind: "$researchSamples" },
                        { $unwind: "$researchSamples.participants" },
                        { $unwind: "$researchSamples.participants.adultForm.knowledgeAreas" },
                        {
                            $group: {
                                _id: "$researchSamples.participants.adultForm.knowledgeAreas",
                                count: { $sum: 1 }
                            }
                        },
                        {
                            $project: {
                                _id: 0,
                                label: "$_id",
                                count: "$count"
                            }
                        }
                    ]
                },
            },
        ]);

        if (!result || result.length === 0) {
            throw new Error("An error occurred while loading information for the dashboard.");
        }

        const data = result[0];

        // Format data for charts
        const monthlyProgressData = data.monthlyProgress.map((item: any) => ({
            month: `${item._id.month}-${item._id.year}`,
            samples: item.totalSamples,
            participants: item.totalParticipants
        }));

        const institutionData = {
            labels: data.instituition.map((item: any) => item.label),
            series: data.instituition.map((item: any) => item.count)
        };

        const regionalData = {
            labels: data.regionalDistribution.map((item: any) => item.label),
            series: data.regionalDistribution.map((item: any) => item.count)
        };

        const collectionStatusData = {
            completed: data.collectionStatus.find((s: any) => s._id === 'Autorizado')?.count || 0,
            pending: data.collectionStatus.find((s: any) => s._id === 'Pendente')?.count || 0,
            rejected: data.collectionStatus.find((s: any) => s._id === 'Não Autorizado')?.count || 0
        };

        const ageDistributionData = {
            labels: data.ageDistribution.map((item: any) => item.label),
            series: data.ageDistribution.map((item: any) => item.count)
        };

        const participantProgressData = data.participantProgress.reduce((acc: { [key: string]: number }, item: any) => {
            acc[item._id] = item.count;
            return acc;
        }, {});

        const knowledgeAreaDistributionData = {
            labels: data.knowledgeAreaDistribution.map((item: any) => item.label),
            series: data.knowledgeAreaDistribution.map((item: any) => item.count)
        };

        return {
            count_female: (data.gender_female[0]?.count_female || 0) as number,
            count_male: (data.gender_male[0]?.count_male || 0) as number,
            total_unique_instituition: (data.instituition.length || 0) as number,
            total_samples: (data.sample[0]?.total_samples || 0) as number,
            total_participants: (data.participants[0]?.total_participants || 0) as number,
            participantProgress: participantProgressData,
            monthlyProgress: monthlyProgressData,
            institutionDistribution: institutionData,
            regionalDistribution: regionalData,
            collectionStatus: collectionStatusData,
            ageDistribution: ageDistributionData,
            knowledgeAreaDistribution: knowledgeAreaDistributionData,
        };
    } catch (error) {
        throw new Error("An error occurred while loading information for the dashboard.");
    }
}

export async function loadanswerByGender() {
    try {
        const result = await ResearcherModel.aggregate([
            {
                $unwind: "$researchSamples"
            },
            {
                $unwind: "$researchSamples.participants"
            },
            {
                $unwind:
                    "$researchSamples.participants.adultForm"
            },
            {
                $unwind:
                    "$researchSamples.participants.adultForm.answersByGroup"
            },
            {
                $unwind:
                    "$researchSamples.participants.adultForm.answersByGroup.questions"
            },
            {
                $facet: {
                    feminino: [
                        {
                            $match: {
                                "researchSamples.participants.personalData.gender":
                                    "Feminino"
                            }
                        },
                        {
                            $match: {
                                $or: [
                                    {
                                        "researchSamples.participants.adultForm.answersByGroup.questions.answer":
                                            "Frequentemente"
                                    },
                                    {
                                        "researchSamples.participants.adultForm.answersByGroup.questions.answer":
                                            "Sempre"
                                    },
                                    {
                                        "researchSamples.participants.adultForm.answersByGroup.questions.answer":
                                            "Ás vezes"
                                    },
                                    {
                                        "researchSamples.participants.adultForm.answersByGroup.questions.answer":
                                            "Raramente"
                                    },
                                    {
                                        "researchSamples.participants.adultForm.answersByGroup.questions.answer":
                                            "Nunca"
                                    }
                                ]
                            }
                        },
                        {
                            $group: {
                                _id: null,
                                frequentemente: {
                                    $sum: {
                                        $cond: [
                                            {
                                                $eq: [
                                                    "$researchSamples.participants.adultForm.answersByGroup.questions.answer",
                                                    "Frequentemente"
                                                ]
                                            },
                                            1,
                                            0
                                        ]
                                    }
                                },
                                sempre: {
                                    $sum: {
                                        $cond: [
                                            {
                                                $eq: [
                                                    "$researchSamples.participants.adultForm.answersByGroup.questions.answer",
                                                    "Sempre"
                                                ]
                                            },
                                            1,
                                            0
                                        ]
                                    }
                                },
                                asVezes: {
                                    $sum: {
                                        $cond: [
                                            {
                                                $eq: [
                                                    "$researchSamples.participants.adultForm.answersByGroup.questions.answer",
                                                    "Ás vezes"
                                                ]
                                            },
                                            1,
                                            0
                                        ]
                                    }
                                },
                                raramente: {
                                    $sum: {
                                        $cond: [
                                            {
                                                $eq: [
                                                    "$researchSamples.participants.adultForm.answersByGroup.questions.answer",
                                                    "Raramente"
                                                ]
                                            },
                                            1,
                                            0
                                        ]
                                    }
                                },
                                nunca: {
                                    $sum: {
                                        $cond: [
                                            {
                                                $eq: [
                                                    "$researchSamples.participants.adultForm.answersByGroup.questions.answer",
                                                    "Nunca"
                                                ]
                                            },
                                            1,
                                            0
                                        ]
                                    }
                                }
                            }
                        }
                    ],
                    masculino: [
                        {
                            $match: {
                                "researchSamples.participants.personalData.gender":
                                    "Masculino"
                            }
                        },
                        {
                            $match: {
                                $or: [
                                    {
                                        "researchSamples.participants.adultForm.answersByGroup.questions.answer":
                                            "Frequentemente"
                                    },
                                    {
                                        "researchSamples.participants.adultForm.answersByGroup.questions.answer":
                                            "Sempre"
                                    },
                                    {
                                        "researchSamples.participants.adultForm.answersByGroup.questions.answer":
                                            "Ás vezes"
                                    },
                                    {
                                        "researchSamples.participants.adultForm.answersByGroup.questions.answer":
                                            "Raramente"
                                    },
                                    {
                                        "researchSamples.participants.adultForm.answersByGroup.questions.answer":
                                            "Nunca"
                                    }
                                ]
                            }
                        },
                        {
                            $group: {
                                _id: null,
                                frequentemente: {
                                    $sum: {
                                        $cond: [
                                            {
                                                $eq: [
                                                    "$researchSamples.participants.adultForm.answersByGroup.questions.answer",
                                                    "Frequentemente"
                                                ]
                                            },
                                            1,
                                            0
                                        ]
                                    }
                                },
                                sempre: {
                                    $sum: {
                                        $cond: [
                                            {
                                                $eq: [
                                                    "$researchSamples.participants.adultForm.answersByGroup.questions.answer",
                                                    "Sempre"
                                                ]
                                            },
                                            1,
                                            0
                                        ]
                                    }
                                },
                                asVezes: {
                                    $sum: {
                                        $cond: [
                                            {
                                                $eq: [
                                                    "$researchSamples.participants.adultForm.answersByGroup.questions.answer",
                                                    "Ás vezes"
                                                ]
                                            },
                                            1,
                                            0
                                        ]
                                    }
                                },
                                raramente: {
                                    $sum: {
                                        $cond: [
                                            {
                                                $eq: [
                                                    "$researchSamples.participants.adultForm.answersByGroup.questions.answer",
                                                    "Raramente"
                                                ]
                                            },
                                            1,
                                            0
                                        ]
                                    }
                                },
                                nunca: {
                                    $sum: {
                                        $cond: [
                                            {
                                                $eq: [
                                                    "$researchSamples.participants.adultForm.answersByGroup.questions.answer",
                                                    "Nunca"
                                                ]
                                            },
                                            1,
                                            0
                                        ]
                                    }
                                }
                            }
                        }
                    ]
                }
            }
        ]);

        if (!result || result.length === 0) {
            throw new Error("An error occurred while loading Answer By Gender.");
        }

        const {
            feminino = [],
            masculino = []
        } = result[0];

        // Preencher com zeros se não houver resultados para feminino ou masculino
        const femininoFilled = feminino.length === 0 ? [{ frequentemente: 0, sempre: 0, asVezes: 0, raramente: 0, nunca: 0 }] : feminino;
        const masculinoFilled = masculino.length === 0 ? [{ frequentemente: 0, sempre: 0, asVezes: 0, raramente: 0, nunca: 0 }] : masculino;

        return {
            feminino: femininoFilled,
            masculino: masculinoFilled
        };

    } catch (error) {
        throw new Error("An error occurred while loading Answer By Gender.");
    }
}