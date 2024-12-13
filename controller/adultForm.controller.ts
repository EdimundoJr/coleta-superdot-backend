import { Request, Response } from "express";
import * as AdultFormService from "../service/adultForm.service";
import IQuestionsGroup from "../interface/adultForm/questionsGroup.interface";
import { GetQuestionsByGroupDTO } from "../dto/adultForm/getQuestionsByGroup.dto";
import { SaveQuestionsByGroupDTO } from "../dto/adultForm/saveQuestionsByGroup.dto";

export async function handlerGetQuestionsByGroup(
    req: Request<GetQuestionsByGroupDTO["params"], {}, {}, {}>,
    res: Response
) {
    try {
        const { groupSequence, formSource } = req.params;

        const groupQuestions = await AdultFormService.getQuestionsByGroup({ sourceForm: formSource, groupSequence });

        if (!groupQuestions) {
            throw Error("Group questions not found");
        }

        res.status(200).json(groupQuestions);
    } catch (e: any) {
        console.log(e);

        // TO DO errors handlers
        res.status(409).send(e.message);
    }
}

export async function handlerSaveQuestionsByGroup(
    req: Request<SaveQuestionsByGroupDTO["params"], {}, SaveQuestionsByGroupDTO["body"], {}>,
    res: Response
) {
    try {
        const { sampleId } = req.params;
        const { participantId, secondSourceId } = res.locals;

        if (secondSourceId) {
            throw new Error("Cannot save participant questions using a second source JWT token.");
        }

        const groupQuestionsWithAnswers: IQuestionsGroup = req.body;

        const response = await AdultFormService.saveGroupQuestions({
            sampleId,
            participantId: participantId as string,
            groupQuestionsWithAnswers,
        });

        if (!response) {
            throw Error("Cannot submit these questions.");
        }

        res.status(200).json(response);
    } catch (e: any) {
        console.log(e);

        // TO DO errors handlers
        res.status(409).send(e.message);
    }
}

export async function handlerSaveSecondSourceQuestionsByGroup(
    req: Request<SaveQuestionsByGroupDTO["params"], {}, SaveQuestionsByGroupDTO["body"], {}>,
    res: Response
) {
    try {
        const { sampleId } = req.params;
        const { participantId, secondSourceId } = res.locals;
        const groupQuestionsWithAnswers: IQuestionsGroup = req.body;

        const response = await AdultFormService.saveSecondSourceGroupQuestions({
            secondSourceId,
            sampleId,
            participantId: participantId as string,
            groupQuestionsWithAnswers,
        });

        if (!response) {
            throw Error("Cannot submit these questions.");
        }

        res.status(200).json(response);
    } catch (e: any) {
        console.log(e);

        // TO DO errors handlers
        res.status(409).send(e.message);
    }
}
