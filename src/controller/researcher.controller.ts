import { Request, Response } from "express";
import * as ResearcherService from "../service/researcher.service";
import { hashContent } from "../util/hash";
import IResearcher from "../interface/researcher.interface";
import { PaginateResearcherDTO,  UpdateResearcherDTO, paginateResearcherParams } from "../dto/researcher.dto";
import { GetResearcherNameBySampleIdDTO } from "../dto/researcher/getResearcherNameBySampleId.dto";
import { GetResearchDataBySampleIdAndParticipantIdDTO } from "../dto/researcher/getResearchDataBySampleIdAndParticipantId.dto";

export async function updateResearcherHandler(req: Request<{}, {}, UpdateResearcherDTO["body"], {}>, res: Response) {
    try {
        const newResearcherData: IResearcher = req.body;

        if (req.body.password) {
            newResearcherData.passwordHash = hashContent(req.body.password);
        }

        const researcherId = res.locals.researcherId;

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


export const researcherBody = async (req: Request<{}, {}, {}, {}>, res: Response) => {
    try {
        
        const researcherId = res.locals.researcherId;

        if (!researcherId) {
            throw new Error("Invalid session!");
        }

        const researcher = await ResearcherService.findResearcher({ _id: researcherId });
        // console.log("Corpo da requisição:", researcher.personalData); 
        if (!researcher) {
            throw new Error("Researcher not found!");
        }
        const responseData = {
            researcher: researcher.personalData,
            role: researcher.role
        };

        // Enviamos o objeto como resposta
        res.status(200).json(responseData);
    
    } catch (e: any) {
        console.error(e);

        // TO DO errors handlers
        res.status(409).send(e.message);
    }
};


export async function paginateResearchers(
    req: Request<PaginateResearcherDTO["params"], {}, {}, PaginateResearcherDTO["query"]>,
    res: Response
) {
    try {
        const researcherId = res.locals.researcherId;

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

export async function handlerGetReseachDataBySampleIdAndParticipantId(
    req: Request<GetResearchDataBySampleIdAndParticipantIdDTO["params"], {}, {}, {}>,
    res: Response
) {
    try {
        const { sampleId, participantId } = req.params;

        const researcherName = await ResearcherService.getResearchDataBySampleIdAndParticipantId({
            sampleId,
            participantId,
        });

        res.status(200).json(researcherName);
    } catch (e) {
        console.log(e);

        // TO DO errors handlers
        res.status(409).send(e);
    }
}
