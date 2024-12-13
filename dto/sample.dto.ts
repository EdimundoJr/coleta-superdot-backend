import { object, string, z } from "zod";
import { INSTITUITION_TYPE_ARRAY, SAMPLE_STATUS_ARRAY } from "../util/consts";

/* CREATE SAMPLE */
const createSampleBody = object({
    researchTitle: string({
        required_error: "Research title is required!",
    }).trim(),
    sampleTitle: string({
        required_error: "Sample title is required!",
    }),
    sampleGroup: string({
        required_error: "Sample group is required!",
    }),
    qttParticipantsRequested: string({
        required_error: "Is necessary to inform the sample partcipants quantity requested.",
    }).transform((val) => Number(val)),
    researchCep: object({
        cepCode: string({
            required_error: "CEP code is required.",
        }),
    }),
    countryRegion: string({
        required_error: "Sample country region is required.",
    }),
    countryState: string({
        required_error: "Sample country state is required.",
    }),
    countryCity: string({
        required_error: "Sample country city is required.",
    }),
    instituition: object({
        name: string({
            required_error: "Sample instituition name is required.",
        }),
        instType: z.enum(INSTITUITION_TYPE_ARRAY, {
            required_error: "Sample instituition type is required.",
        }),
    }),
}).strict("A unknown key was found.");

export const createSampleDTO = object({
    body: createSampleBody,
});

export type CreateSampleDTO = z.infer<typeof createSampleDTO>;

/* PAGINATE ALL SAMPLES */
export const paginateSampleParams = object({
    currentPage: string(),
    itemsPerPage: string().optional(),
}).strict("A unknown param was found.");

export const paginateAllSampleQuery = object({
    status: z.enum(["", ...SAMPLE_STATUS_ARRAY]),
});

export const paginateAllSampleDTO = object({
    params: paginateSampleParams,
    query: paginateAllSampleQuery,
});

export type PaginateAllSampleDTO = z.infer<typeof paginateAllSampleDTO>;

/* PAGINA RESEARCHER SAMPLES */
export const paginateSampleQuery = object({
    researchTitle: string(),
    sampleTitle: string(),
});

export const paginateSampleDTO = object({
    params: paginateSampleParams,
    query: paginateSampleQuery,
});
export type PaginateSampleDTO = z.infer<typeof paginateSampleDTO>;

/* DELETE SAMPLE */
const deleteSampleParams = object({
    sampleId: string(),
});

export const deleteSampleDTO = object({
    params: deleteSampleParams,
});

export type DeleteSampleDTO = z.infer<typeof deleteSampleDTO>;

/* EDIT SAMPLE */
const editSampleBody = object({
    researchTitle: string({
        required_error: "Research title is required!",
    }).trim(),
    sampleTitle: string({
        required_error: "Sample title is required!",
    }),
    qttParticipantsRequested: string({
        required_error: "Is necessary to inform the sample partcipants quantity requested.",
    }).transform((val) => Number(val)),
    researchCep: object({
        cepCode: string({
            required_error: "CEP code is required.",
        }),
    }),
    countryRegion: string({
        required_error: "Sample country region is required.",
    }),
    countryState: string({
        required_error: "Sample country state is required.",
    }),
    countryCity: string({
        required_error: "Sample country city is required.",
    }),
    instituition: object({
        name: string({
            required_error: "Sample instituition name is required.",
        }),
        instType: z.enum(INSTITUITION_TYPE_ARRAY, {
            required_error: "Sample instituition type is required.",
        }),
    }),
}).strip();

export const editSampleParams = object({
    sampleId: string(),
});

export const editSampleDTO = object({
    body: editSampleBody,
    params: editSampleParams,
});

export type EditSampleDTO = z.infer<typeof editSampleDTO>;

/** GET REQUIRED DOCS */

const getRequiredDocsParams = object({
    sampleId: string({ required_error: "Sample id param is required!" }),
});

export const getRequiredDocsDTO = object({
    params: getRequiredDocsParams,
});

export type GetRequiredDocsDTO = z.infer<typeof getRequiredDocsDTO>;
