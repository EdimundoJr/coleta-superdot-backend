import { Request, Response } from "express";
import * as ParticipantService from "../service/participant.service";
import { IParticipant } from "../interface/participant.interface";
import { EmailAlreadyRegisteredError, FormAlreadyFinished, ObjectNotExists } from "../error/participant.error";
import { PartialDeep } from "type-fest";
import { SendValidationEmailDTO } from "../dto/participant/sendValidationEmail.dto";
import { VerifyValidationCodeDTO } from "../dto/participant/verifyValidationCode.dto";
import { ParticipantDataDTO } from "../dto/participant/participant.dto";
import { AcceptAllSampleDocsDTO } from "../dto/participant/acceptDocs.dto";
import { SaveAutobiographyDTO, SaveEvalueAutobiographyDTO } from "../dto/participant/saveAutobiography.dto";
import { ISecondSource } from "../interface/secondSource.interface";
import { GetInfoBioDTO, GetInfoDTO } from "../dto/participant/getInfo.dto";
import { getSampleById } from "../service/sample.service";
import { finishForm } from "../service/adultForm.service";
import { SaveSecondSourcesDTO } from "../dto/participant/saveSecondSources.dto";

export async function handlerValidateEmailInSample(
    req: Request<SendValidationEmailDTO["params"], {}, SendValidationEmailDTO["body"], {}>,
    res: Response
) {
    try {
        const { participantEmail } = req.body;
        const { sampleId } = req.params;

        const sent = await ParticipantService.sendEmailVerification({ participantEmail, sampleId });

        res.status(201).json(sent);
    } catch (e: any) {
        console.log(e);

        if (e instanceof EmailAlreadyRegisteredError) {
            return res.status(409).send(e.message);
        }

        if (e instanceof ObjectNotExists) {
            return res.status(404).send(e.message);
        }

        if (e instanceof FormAlreadyFinished) {
            return res.status(401).send(e.message);
        }

        // TO DO errors handlers
        res.status(500).send(e.message);
    }
}

export async function handlerValidateVerificationCode(
    req: Request<VerifyValidationCodeDTO["params"], {}, {}, {}>,
    res: Response
) {
    try {
        const { sampleId, participantId, verificationCode } = req.params;

        const data = await ParticipantService.validateEmailVerificationCode({
            participantId,
            sampleId,
            code: verificationCode,
        });

        res.status(200).json(data);
    } catch (e: any) {
        console.log(e);

        // TO DO errors handlers
        res.status(409).send(e.message);
    }
}

export async function handlerSaveParticipantData(
    req: Request<ParticipantDataDTO["params"], {}, ParticipantDataDTO["body"], {}>,
    res: Response
) {
    try {
        const participantData: PartialDeep<IParticipant> = req.body;
        const { sampleId } = req.params;

        const participantId = res.locals.participantId;

        if (!participantId) {
            throw Error("Invalid participant JWT.");
        }

        const saved = await ParticipantService.saveParticipantData({ sampleId, participantId, participantData });

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

export async function handlerSubmitParticipantData(
    req: Request<ParticipantDataDTO["params"], {}, ParticipantDataDTO["body"], {}>,
    res: Response
) {
    try {
        const participantData: PartialDeep<IParticipant> = req.body;
        const { sampleId } = req.params;

        const participantId = res.locals.participantId;

        if (!participantId) {
            throw Error("Invalid participant JWT.");
        }

        const success = await ParticipantService.submitParticipantData({ sampleId, participantId, participantData });

        res.status(200).json(success);
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

        const participantId = res.locals.participantId;

        if (!participantId) {
            throw Error("Invalid participant JWT.");
        }

        const accepted = await ParticipantService.acceptAllSampleDocs({ sampleId, participantId });

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

export async function handlerSaveSecondSources(
    req: Request<SaveSecondSourcesDTO["params"], {}, SaveSecondSourcesDTO["body"], {}>,
    res: Response
) {
    try {
        const { sampleId } = req.params;
        const secondSources = req.body.secondSources;

        const participantId = res.locals.participantId;
        if (!participantId) {
            throw Error("Invalid participant JWT.");
        }

        const created = await ParticipantService.saveSecondSources({
            sampleId,
            participantId,
            secondSources: secondSources as ISecondSource[],
        });

        if (!created) {
            throw Error("Cannot accept save the second source info.");
        }

        res.status(200).json(created);
    } catch (e: any) {
        console.log(e);

        // TO DO errors handlers
        res.status(409).send(e.message);
    }
}

export async function handlerSaveAutobiography(
    req: Request<SaveAutobiographyDTO["params"], {}, SaveAutobiographyDTO["body"], SaveAutobiographyDTO["query"]>,
    res: Response
) {
    try {
        const { sampleId } = req.params;
        const { autobiographyText, autobiographyVideo } = req.body;
        const submitForm = req.query.submitForm === "true";

        const participantId = res.locals.participantId;
        if (!participantId) {
            throw Error("Invalid participant JWT.");
        }

        const saved = await ParticipantService.saveAutobiography({
            sampleId,
            participantId,
            autobiographyVideo,
            autobiographyText,
            submitForm,
        });

        if (!saved) {
            throw Error("Cannot save this autobiography.");
        }

        res.status(200).json(true);
    } catch (e: any) {
        console.log(e);

        // TO DO errors handlers
        res.status(409).send(e.message);
    }
}

export async function handlerSaveEvalueAutobiography(
    req: Request<SaveEvalueAutobiographyDTO["params"], {}, SaveEvalueAutobiographyDTO["body"], SaveEvalueAutobiographyDTO["query"]>,
    res: Response
) {

    try {
        const { sampleId, participantId } = req.params;       
        const { idEvalueAutobiography, endEvalueAutobiography, markEvalueAutobiography, startEvalueAutobiography, textEvalueAutobiography, commentEvalueAutobiography , backgroundEvalueAutobiography } = req.body;
               
        if (!participantId) {
            throw Error("Invalid participant JWT.");
        }

        const submitForm = req.query.submitForm === "true";       

        const saved = await ParticipantService.saveEvalueAutobiography({
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
        });

        if (!saved) {
            throw Error("Cannot save this Evaluate Autobiography.");
        }

        res.status(200).json(true);
    } catch (e: any) {
        console.log(e);

        // TO DO errors handlers
        res.status(409).send(e.message);
    }
}

export async function handlerGetParticipantInfo(req: Request<GetInfoDTO["params"], {}, {}, {}>, res: Response) {
    try {
        const { sampleId } = req.params;

        const participantId = res.locals.participantId;
        if (!participantId) {
            throw Error("Invalid participant JWT.");
        }

        const participantData = await ParticipantService.getParticipantDataById({
            sampleId,
            participantId,
        });

        console.log(participantData);

        res.status(200).json(participantData);
    } catch (e: any) {
        console.log(e);

        // TO DO errors handlers
        res.status(409).send(e.message);
    }
}
export async function handlerGetParticipantInfoBio(req: Request<GetInfoBioDTO["params"], {}, {}, {}>, res: Response) {
    try {
        const { sampleId, participantId } = req.params;
               
       
        if (!participantId) {
            throw Error("Invalid participant JWT.");
        }

        const participantData = await ParticipantService.getParticipantDataById({
            sampleId,
            participantId,
        });        

        res.status(200).json(participantData);
    } catch (e: any) {
        console.log(e);
        // TO DO errors handlers
        res.status(409).send(e.message);
    }
}