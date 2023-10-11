import { Request, Response } from "express";
import * as ResearcherService from "../service/researcher.service";
import { hashContent } from "../util/hash";
import IResearcher from "../interface/researcher.interface";
import { PaginateResearcherDTO, UpdateResearcherDTO, paginateResearcherParams } from "../dto/researcher.dto";
import { GetResearcherNameBySampleIdDTO } from "../dto/researcher/getResearcherNameBySampleId.dto";

export async function updateResearcherHandler(req: Request<{}, {}, UpdateResearcherDTO["body"], {}>, res: Response) {
    try {
        const newResearcherData: IResearcher = req.body;

        if (req.body.password) {
            newResearcherData.passwordHash = hashContent(req.body.password);
        }

        const researcherId = res.locals.session?.researcherId;

        if (!researcherId) {
            throw new Error("Invalid session!");
        }

        const researcherUpdated = await ResearcherService.updateResearcher({ _id: researcherId }, newResearcherData, {
            new: true,
        });

        res.status(200).json(researcherUpdated);
    } catch (e: any) {
        console.log(e);

        // TO DO errors handlers
        res.status(409).send(e.message);
    }
}

export async function paginateResearchers(
    req: Request<PaginateResearcherDTO["params"], {}, {}, PaginateResearcherDTO["query"]>,
    res: Response
) {
    try {
        const researcherId = res.locals.session?.researcherId;

        if (!researcherId) {
            throw new Error("Invalid session!");
        }

        paginateResearcherParams.parse(req.params);

        const currentPage = Number(req.params.currentPage);
        const itemsPerPage = Number(req.params.itemsPerPage || 10);

        const page = await ResearcherService.paginateResearchers(currentPage, itemsPerPage, req.query, researcherId);

        res.status(200).json(page);
    } catch (e) {
        console.log(e);

        // TO DO errors handlers
        res.status(409).send(e);
    }
}

export async function handlerGetReseacherNameBySampleId(
    req: Request<GetResearcherNameBySampleIdDTO["params"], {}, {}, {}>,
    res: Response
) {
    try {
        const { sampleId } = req.params;

        const researcherName = await ResearcherService.getResearcherNameBySampleId(sampleId);

        res.status(200).json(researcherName);
    } catch (e) {
        console.log(e);

        // TO DO errors handlers
        res.status(409).send(e);
    }
}
