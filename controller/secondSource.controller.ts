import { Request, Response } from "express";
import * as SecondSourceService from "../service/secondSource.service";
import { ObjectNotExists } from "../error/participant.error";
import { SendValidationSecondSourceEmailDTO } from "../dto/secondSource/sendValidationSecondSourceEmail.dto";
import { ValidateSecondSourceVerificationCodeDTO } from "../dto/secondSource/validateSecondSourceVerificationCode.dto";
import {
    SaveSecondSourcePersonalDataDTO,
    SubmitSecondSourcePersonalDataDTO,
} from "../dto/secondSource/secondSourcePersonalData.dto";
import { AcceptAllSampleDocsDTO } from "../dto/secondSource/acceptAllSampleDocs.dto";

export async function handlerSendVerificationEmail(
    req: Request<SendValidationSecondSourceEmailDTO["params"], {}, SendValidationSecondSourceEmailDTO["body"], {}>,
    res: Response
) {
    try {
        const { secondSourceEmail } = req.body;
        const { participantId, sampleId } = req.params;

        const valid = await SecondSourceService.sendEmailVerification({ secondSourceEmail, participantId, sampleId });

        res.status(201).json(valid);
    } catch (e: any) {
        console.log(e);

        // TO DO errors handlers
        res.status(500).send(e.message);
    }
}

export async function handlerValidateSecondSourceVerificationCode(
    req: Request<ValidateSecondSourceVerificationCodeDTO["params"], {}, {}, {}>,
    res: Response
) {
    try {
        const { sampleId, participantId, secondSourceId, verificationCode } = req.params;

        const token = await SecondSourceService.validateEmailVerificationCode({
            secondSourceId,
            participantId,
            sampleId,
            code: verificationCode,
        });

        res.status(200).json(token);
    } catch (e: any) {
        console.log(e);

        // TO DO errors handlers
        res.status(409).send(e.message);
    }
}

export async function handlerSaveSecondSourceData(
    req: Request<SaveSecondSourcePersonalDataDTO["params"], {}, SaveSecondSourcePersonalDataDTO["body"], {}>,
    res: Response
) {
    try {
        const secondSourceData = req.body;
        const { sampleId } = req.params;
        const { participantId, secondSourceId } = res.locals;

        const saved = await SecondSourceService.saveSecondSourceData({
            sampleId,
            participantId,
            secondSourceId,
            secondSourceData,
        });

        res.status(200).json(saved);
    } catch (e: any) {
        console.log(e);

        if (e instanceof ObjectNotExists) {
            return res.status(404).send(e.message);
        }

        // TO DO errors handlers
        res.status(500).send(e.message);
    }
}

export async function handlerSubmitSecondSourceData(
    req: Request<SubmitSecondSourcePersonalDataDTO["params"], {}, SubmitSecondSourcePersonalDataDTO["body"], {}>,
    res: Response
) {
    try {
        const secondSourceData = req.body;
        const { sampleId } = req.params;
        const { participantId, secondSourceId } = res.locals;

        const token = await SecondSourceService.saveSecondSourceData({
            secondSourceId,
            sampleId,
            participantId,
            secondSourceData,
        });

        res.status(200).json(token);
    } catch (e: any) {
        console.log(e);

        if (e instanceof ObjectNotExists) {
            return res.status(404).send(e.message);
        }

        // TO DO errors handlers
        res.status(500).send(e.message);
    }
}

export async function handlerAcceptAllSampleDocs(
    req: Request<AcceptAllSampleDocsDTO["params"], {}, {}, {}>,
    res: Response
) {
    try {
        const { sampleId } = req.params;

        const { secondSourceId, participantId } = res.locals;

        const accepted = await SecondSourceService.acceptAllSampleDocs({ sampleId, participantId, secondSourceId });

        if (!accepted) {
            throw Error("Cannot accept sample docs.");
        }

        res.status(200).json(accepted);
    } catch (e: any) {
        console.log(e);

        // TO DO errors handlers
        res.status(409).send(e.message);
    }
}
