import express from "express";
import { validateDTO } from "../middleware/validateDTO.middleware";
import * as AdultFormController from "../controller/adultForm.controller";
import { requireParticipantJWT } from "../middleware/requireParticipantJWT.middleware";
import { getQuestionsByGroupSchema } from "../dto/adultForm/getQuestionsByGroup.dto";
import { saveQuestionsByGroupSchema } from "../dto/adultForm/saveQuestionsByGroup.dto";
import { requireSecondSourceJWT } from "../middleware/requireSecondSourceJWT.middleware";

const adultFormRoute = express.Router();

adultFormRoute.get(
    "/questions-by-group/group-sequence/:groupSequence/source/:formSource",
    validateDTO(getQuestionsByGroupSchema),
    requireParticipantJWT,
    AdultFormController.handlerGetQuestionsByGroup
);

adultFormRoute.patch(
    "/save-questions-by-group/sample/:sampleId",
    validateDTO(saveQuestionsByGroupSchema),
    requireParticipantJWT,
    AdultFormController.handlerSaveQuestionsByGroup
);

adultFormRoute.patch(
    "/save-second-source-questions-by-group/sample/:sampleId",
    validateDTO(saveQuestionsByGroupSchema),
    requireParticipantJWT,
    requireSecondSourceJWT,
    AdultFormController.handlerSaveSecondSourceQuestionsByGroup
);

export { adultFormRoute };
