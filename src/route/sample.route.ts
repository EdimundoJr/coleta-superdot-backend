import express from "express";
import * as SampleController from "../controller/sample.controller";
import {
    createSampleDTO,
    deleteSampleDTO,
    editSampleDTO,
    getRequiredDocsDTO,
    paginateAllSampleDTO,
    paginateSampleDTO,
} from "../dto/sample.dto";
import { validateDTO } from "../middleware/validateDTO.middleware";
import { uploaderConfig } from "../util/uploader";
import { requireRole } from "../middleware/requireRole.middleware";
import { requireParticipantJWT } from "../middleware/requireParticipantJWT.middleware";
import { requireResearcherJWT } from "../middleware/requireResearcherJWT.middleware";
import { addParticipantsSchema } from "../dto/sample/addParticipants.dto";
import { getSampleByIdSchema } from "../dto/sample/getSampleById.dto";
import * as path from "path";

const sampleRouter = express.Router();

const uploaderFields = uploaderConfig.fields([
    { name: "researchCep[researchDocument]", maxCount: 1 },
    { name: "researchCep[tcleDocument]", maxCount: 1 },
    { name: "researchCep[taleDocument]", maxCount: 1 },
]);

sampleRouter.post(
    "/newSample",
    [uploaderFields, validateDTO(createSampleDTO), requireResearcherJWT],
    SampleController.createSampleHandler
);

sampleRouter.put(
    "/updateSample/:sampleId",
    [uploaderFields, validateDTO(editSampleDTO), requireResearcherJWT],
    SampleController.editSampleHandler
);

sampleRouter.get(
    "/paginate/:itemsPerPage/page/:currentPage",
    [validateDTO(paginateSampleDTO), requireResearcherJWT],
    SampleController.paginateResearcherSamples
);

sampleRouter.get(
    "/paginateAll/:itemsPerPage/page/:currentPage",
    [validateDTO(paginateAllSampleDTO), requireRole("Revisor")],
    SampleController.paginateAllSamples
);

sampleRouter.get(
    "/listRequiredDocs/:sampleId",
    [validateDTO(getRequiredDocsDTO), requireParticipantJWT],
    SampleController.handlerGetRequiredDocs
);

sampleRouter.use("/attachment", express.static(path.resolve(__dirname, "../", "storage/uploads/")));

sampleRouter.delete(
    "/deleteSample/:sampleId",
    [validateDTO(deleteSampleDTO), requireResearcherJWT],
    SampleController.deleteSample
);

sampleRouter.post(
    "/add-participants/sample/:sampleId",
    validateDTO(addParticipantsSchema),
    requireResearcherJWT,
    SampleController.handlerAddParticipants
);

sampleRouter.get(
    "/get-sample-by-id/:sampleId",
    validateDTO(getSampleByIdSchema),
    requireResearcherJWT,
    SampleController.handlerGetSampleById
);

sampleRouter.get(
    "/load-Information-deashboard",
    SampleController.loadDashboard
)

sampleRouter.get(
    "/answer-by-gender",
    SampleController.answerByGender
)

export { sampleRouter };
