import { array, object, string, z } from "zod";

export const addParticipantsSchema = object({
    body: object({
        participants: array(
            object({
                personalData: object({
                    fullName: string({ required_error: "Participant name is required!" }),
                    email: string({ required_error: "Participant email is required!" }).email(
                        "Participant email is invalid!"
                    ),
                }),
            }),
            {
                required_error: "Participants array is required!",
            }
        ),
    }),
    params: object({
        sampleId: string({ required_error: "Sample id param is required!" }),
    }),
});

export type AddParticipantsDTO = z.infer<typeof addParticipantsSchema>;
