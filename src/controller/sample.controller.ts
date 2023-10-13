import { Request, Response } from "express";
import * as SampleService from "../service/sample.service";
import ISample from "../interface/sample.interface";
import {
    CreateSampleDTO,
    DeleteSampleDTO,
    EditSampleDTO,
    GetParticipantRegistrationProgressDTO,
    GetRequiredDocsDTO,
    PaginateAllSampleDTO,
    PaginateSampleDTO,
} from "../dto/sample.dto";
import { AddParticipantsDTO } from "../dto/sample/addParticipants.dto";

export async function createSampleHandler(req: Request<{}, {}, CreateSampleDTO["body"], {}>, res: Response) {
    try {
        const researcherId = res.locals.researcherId;

        if (!researcherId) {
            throw new Error("Invalid session!");
        }

        const sampleData: ISample = req.body;

        const files = req.files as { [fieldname: string]: Express.Multer.File[] };

        if (files) {
            Object.keys(files).forEach((key) => {
                if (key === "researchCep[researchDocument]") {
                    sampleData.researchCep.researchDocument = files[key][0].filename;
                } else if (key === "researchCep[tcleDocument]") {
                    sampleData.researchCep.tcleDocument = files[key][0].filename;
                } else if (key === "researchCep[taleDocument]") {
                    sampleData.researchCep.taleDocument = files[key][0].filename;
                }
            });
        }

        const sampleCreated = await SampleService.createSample(researcherId, sampleData);

        res.status(201).json(sampleCreated);
    } catch (e: any) {
        console.log(e);

        // TO DO errors handlers
        res.status(409).json(e.message);
    }
}

export async function editSampleHandler(
    req: Request<EditSampleDTO["params"], {}, EditSampleDTO["body"], {}>,
    res: Response
) {
    try {
        const researcherId = res.locals.researcherId;

        if (!researcherId) {
            throw new Error("Invalid session!");
        }

        const sampleData: ISample = req.body;

        const files = req.files as { [fieldname: string]: Express.Multer.File[] };

        if (files) {
            Object.keys(files).forEach((key) => {
                if (key === "researchCep[researchDocument]") {
                    sampleData.researchCep.researchDocument = files[key][0].filename;
                } else if (key === "researchCep[tcleDocument]") {
                    sampleData.researchCep.tcleDocument = files[key][0].filename;
                } else if (key === "researchCep[taleDocument]") {
                    sampleData.researchCep.taleDocument = files[key][0].filename;
                }
            });
        }

        const sampleUpdated = await SampleService.editSample(researcherId, req.params.sampleId, sampleData);

        res.status(200).json(sampleUpdated);
    } catch (e: any) {
        console.log(e);

        // TO DO errors handlers
        res.status(409).json(e.message);
    }
}

export async function paginateResearcherSamples(
    req: Request<PaginateSampleDTO["params"], {}, {}, PaginateSampleDTO["query"]>,
    res: Response
) {
    try {
        const researcherId = res.locals.researcherId;

        if (!researcherId) {
            throw new Error("Invalid session!");
        }

        const currentPage = Number(req.params.currentPage);
        const itemsPerPage = Number(req.params.itemsPerPage || 10);

        const page = await SampleService.paginateResearcherSamples(researcherId, currentPage, itemsPerPage, req.query);

        res.status(200).json(page);
    } catch (e) {
        console.log(e);

        // TO DO errors handlers
        res.status(409).json(e);
    }
}

export async function paginateAllSamples(
    req: Request<PaginateAllSampleDTO["params"], {}, {}, PaginateAllSampleDTO["query"]>,
    res: Response
) {
    try {
        const researcherId = res.locals.researcherId;

        if (!researcherId) {
            throw new Error("Invalid session!");
        }

        const currentPage = Number(req.params.currentPage);
        const itemsPerPage = Number(req.params.itemsPerPage || 10);

        const page = await SampleService.paginateAllSamples(researcherId, currentPage, itemsPerPage, req.query.status);

        res.status(200).json(page);
    } catch (e) {
        console.log(e);

        // TO DO errors handlers
        res.status(409).json(e);
    }
}

export async function deleteSample(req: Request<DeleteSampleDTO["params"], {}, {}, {}>, res: Response) {
    try {
        const researcherId = res.locals.researcherId;

        if (!researcherId) {
            throw new Error("Invalid session!");
        }

        const sampleToDelete = req.params.sampleId;

        await SampleService.deleteSample(researcherId, sampleToDelete);

        res.status(200).send();
    } catch (e) {
        console.log(e);

        // TO DO errors handlers
        res.status(409).json(e);
    }
}

export async function handlerGetRequiredDocs(req: Request<GetRequiredDocsDTO["params"], {}, {}, {}>, res: Response) {
    try {
        const sampleId = req.params.sampleId;

        const docs = await SampleService.getRequiredDocs(sampleId);

        res.status(200).json(docs);
    } catch (e) {
        console.error(e);

        // TO DO errors handlers
        res.status(409).json(e);
    }
}

export async function handlerGetParticipantRegistrationProgress(
    req: Request<GetParticipantRegistrationProgressDTO["params"], {}, {}, {}>,
    res: Response
) {
    try {
        const sampleId = req.params.sampleId;

        const participants = await SampleService.getParticipantRegistrationProgress(sampleId);

        res.status(200).json(participants);
    } catch (e) {
        console.error(e);

        // TO DO errors handlers
        res.status(409).json(e);
    }
}

export async function handlerAddParticipants(
    req: Request<AddParticipantsDTO["params"], {}, AddParticipantsDTO["body"], {}>,
    res: Response
) {
    try {
        const { sampleId } = req.params;
        const { participants } = req.body;

        const indicated = await SampleService.addParticipants({ sampleId, participants });

        res.status(201).json(indicated);
    } catch (e: any) {
        console.error(e);

        // TO DO errors handlers
        res.status(409).send(e.message);
    }
}
