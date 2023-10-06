import { array, object, string, z } from "zod";
import { RELATIONSHIPS_ARRAY } from "../../util/consts";

export const saveSecondSourcesSchema = object({
    body: object({
        secondSources: array(
            object({
                personalData: object({
                    relationship: z.enum(RELATIONSHIPS_ARRAY, { required_error: "Invalid relationship!" }),
                    fullName: string({ required_error: "Second source name is required." }),
                    email: string({ required_error: "Second source email is required." }).email("Invalid e-mail."),
                }),
                teacherSubject: string().optional(),
            }),
            { required_error: "Second source array is required!" }
        ),
    }),
    params: object({
        sampleId: string({ required_error: "Sample id param is required!" }),
    }),
});

export type SaveSecondSourcesDTO = z.infer<typeof saveSecondSourcesSchema>;
