import { object, string, array, boolean, optional, z } from "zod";

const knowledgeAreasBody = object({
  knowledgeAreasIndicatedByResearcher: object({
    general: array(string()).optional(),
    specific: array(string()).optional(),
  }),
  submitForm: optional(boolean()),
});

const knowledgeAreasParams = object({
  sampleId: string({
    required_error: "Sample ID is required",
  }),
  participantId: string({
    required_error: "Participant ID is required",
  }),
});

export const knowledgeAreasSchema = object({
  body: knowledgeAreasBody,
  params: knowledgeAreasParams,
});

export type KnowledgeAreasDTO = z.infer<typeof knowledgeAreasSchema>;
