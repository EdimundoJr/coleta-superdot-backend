import express from "express";
import { validateDTO } from "../middleware/validateDTO.middleware";
import * as ParticipantController from "../controller/participant.controller";
import { requireParticipantJWT } from "../middleware/requireParticipantJWT.middleware";
import { sendValidationEmailSchema } from "../dto/participant/sendValidationEmail.dto";
import { verifyValidationCodeSchema } from "../dto/participant/verifyValidationCode.dto";
import { participantDataSchema } from "../dto/participant/participant.dto";
import { acceptAllSampleDocsSchema } from "../dto/participant/acceptDocs.dto";
import { saveAutobiographySchema, saveEvalueAutobiographySchema } from "../dto/participant/saveAutobiography.dto";
import { saveSecondSourcesSchema } from "../dto/participant/saveSecondSources.dto";
import { getInfoBioSchema, getInfoSchema } from "../dto/participant/getInfo.dto";

const participantRouter = express.Router();

participantRouter.post(
    "/send-verification-code/sample/:sampleId",
    validateDTO(sendValidationEmailSchema),
    ParticipantController.handlerValidateEmailInSample
);

participantRouter.patch(
    "/validate-verification-code/sample/:sampleId/participant/:participantId/code/:verificationCode",
    validateDTO(verifyValidationCodeSchema),
    ParticipantController.handlerValidateVerificationCode
);

participantRouter.get(
    "/get-participant-info/sample/:sampleId",
    validateDTO(getInfoSchema),
    requireParticipantJWT,
    ParticipantController.handlerGetParticipantInfo
);

participantRouter.get(
    "/get-participant-info-bio/sample/:sampleId/participant/:participantId",
    validateDTO(getInfoBioSchema),   
    ParticipantController.handlerGetParticipantInfoBio
);

participantRouter.put(
    "/save-participant-data/sample/:sampleId",
    validateDTO(participantDataSchema),
    requireParticipantJWT,
    ParticipantController.handlerSaveParticipantData
);

participantRouter.put(
    "/submit-participant-data/sample/:sampleId",
    validateDTO(participantDataSchema),
    requireParticipantJWT,
    ParticipantController.handlerSubmitParticipantData
);

participantRouter.patch(
    "/accept-all-sample-docs/sample/:sampleId",
    validateDTO(acceptAllSampleDocsSchema),
    requireParticipantJWT,
    ParticipantController.handlerAcceptAllSampleDocs
);

participantRouter.patch(
    "/save-second-sources/sample/:sampleId",
    validateDTO(saveSecondSourcesSchema),
    requireParticipantJWT,
    ParticipantController.handlerSaveSecondSources
);

participantRouter.patch(
    "/save-autobiography/sample/:sampleId",
    validateDTO(saveAutobiographySchema),
    requireParticipantJWT,
    ParticipantController.handlerSaveAutobiography
);

participantRouter.patch(
    "/save-evalueAutobiography/sample/:sampleId/participant/:participantId",
     validateDTO(saveEvalueAutobiographySchema),    
    ParticipantController.handlerSaveEvalueAutobiography
);

export { participantRouter };
