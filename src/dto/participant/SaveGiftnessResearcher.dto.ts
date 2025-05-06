import { object, string, z, boolean, optional } from "zod";

const giftdnessIndicatorsBody = object({
  giftdnessIndicatorsByResearcher: boolean({
    required_error: "Indicator value is required",
  }),
});

const giftdnessIndicatorsParams = object({
  sampleId: string({
    required_error: "Sample ID is required",
  }),
  participantId: optional(string()),
});

export const giftdnessIndicatorsSchema = object({
  body: giftdnessIndicatorsBody,
  params: giftdnessIndicatorsParams,
});

export type GiftdnessIndicatorsDTO = z.infer<typeof giftdnessIndicatorsSchema>;
