import nodemailer from "nodemailer";
import env from "./validateEnv";
import Email from "email-templates";
import * as path from "path";
import { RolesType, SampleStatus } from "./consts";

const templatesPath = path.resolve(__dirname, "../", "storage/emailTemplates/");

const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: env.EMAIL_USER,
        pass: env.EMAIL_PASS,
    },
});

const email = new Email({
    views: {
        root: templatesPath,
        options: {
            extension: "pug",
        },
    },
    juice: true,
    juiceSettings: {
        tableElements: ['TABLE']
    },
    message: {
        from: `Superdot Coleta - <${env.EMAIL_USER}>`,
    },
    transport,
});


interface EmailReviewRequest {
    researcherName: string;
    researcherEmail: string;
    sampleName: string;
    sampleStatus: SampleStatus;
    quantityParticipantsAuthorized?: number;
    reviewerFullName: string;
    reviewerEmail: string;
    reviewDate: string;
    reviewerMessage: string;
}

export const dispatchReviewRequestEmail = async (requestBody: EmailReviewRequest): Promise<void> => {
    try {
        const renderedTemplate = await email.render("reviewRequestSample/html", {
            locals: {
                researcherName: requestBody.researcherName,
                sampleName: requestBody.sampleName,
                sampleStatus: requestBody.sampleStatus,
                quantityParticipantsAuthorized: requestBody.quantityParticipantsAuthorized,
                reviewerFullName: requestBody.reviewerFullName,
                reviewerEmail: requestBody.reviewerEmail,
                reviewDate: requestBody.reviewDate,
                reviewerMessage: requestBody.reviewerMessage,
                systemURL: env.FRONT_END_URL,
            },
        });

        console.log("Template renderizado com sucesso:", renderedTemplate);

        const sendResult = await email.send({
            template: "reviewRequestSample",
            message: {
                to: requestBody.researcherEmail,
                subject: "A sua solicitação de amostra foi revisada!",
                text: `Prezado(a) ${requestBody.researcherName},\n\nSua amostra "${requestBody.sampleName}" foi revisada com o status: ${requestBody.sampleStatus}.\n\nMensagem do revisor: ${requestBody.reviewerMessage}\n\nAcesse o sistema: ${env.FRONT_END_URL}`,
            },
            locals: {
                researcherName: requestBody.researcherName,
                sampleName: requestBody.sampleName,
                sampleStatus: requestBody.sampleStatus,
                quantityParticipantsAuthorized: requestBody.quantityParticipantsAuthorized,
                reviewerFullName: requestBody.reviewerFullName,
                reviewerEmail: requestBody.reviewerEmail,
                reviewDate: requestBody.reviewDate,
                reviewerMessage: requestBody.reviewerMessage,
                systemURL: env.FRONT_END_URL,
            },
        });

        console.log("E-mail enviado com sucesso:", sendResult);
    } catch (error) {
        console.error("Falha ao enviar e-mail:", error);
        throw new Error(`Erro no envio de e-mail: ${error instanceof Error ? error.message : String(error)}`);
    }
};


interface IEmailSecondSourceINdication {
    secondSourceName: string;
    secondSourceEmail: string;
    participantName: string;
    participantEmail: string;
    sampleId: string;
    participantId: string;
}

export const dispatchSecondSourceIndicationEmail = (body: IEmailSecondSourceINdication) => {
    email
        .send({
            template: "secondSourceIndication",
            message: {
                to: body.secondSourceEmail,
                subject: "Você foi indicado como segunda fonte!",
            },
            locals: {
                secondSourceName: body.secondSourceName,
                participantName: body.participantName,
                participantEmail: body.participantEmail,
                systemURL: `${env.FRONT_END_URL}/formulario-adulto-segunda-fonte/${body.sampleId}/${body.participantId}`,
            },
        })
        .then(console.log)
        .catch(console.error);
};

interface IEmailParticipantVerification {
    participantName?: string;
    verificationCode: string;
    participantEmail: string;
    sampleId: string;
    participantId: string;
}

export const dispatchParticipantVerificationEmail = (body: IEmailParticipantVerification) => {
    email
        .send({
            template: "verifyParticipant",
            message: {
                to: body.participantEmail,
                subject: "SuperDot - Seu link de verificação.",
            },
            locals: {
                participantName: body.participantName,
                verificationUrl: `${env.FRONT_END_URL}/formulario-adulto/${body.sampleId}/${body.participantId}/${body.verificationCode}`,
            },
        })
        .then(console.log)
        .catch(console.error);
};

interface IEmailSecondSourceVerification {
    secondSourceName?: string;
    verificationCode: string;
    secondSourceEmail: string;
    sampleId: string;
    participantId: string;
    secondSourceId: string;
}

export const dispatchSecondSourceVerificationEmail = (body: IEmailSecondSourceVerification) => {
    email
        .send({
            template: "verifySecondSource",
            message: {
                to: body.secondSourceEmail,
                subject: "SuperDot - Seu link de verificação.",
            },
            locals: {
                secondSourceName: body.secondSourceName,
                participantName: body.secondSourceName,
                verificationUrl: `${env.FRONT_END_URL}/formulario-adulto-segunda-fonte/${body.sampleId}/${body.participantId}/${body.secondSourceId}/${body.verificationCode}`,
            },
        })
        .then(console.log)
        .catch(console.error);
};

interface IEmailNewRole {
    researcherName: string;
    researcherEmail: string;
    admName: string;
    newRole: RolesType;
    admEmail: string;
    admMessage?: string;
}

export const dispatchNewRoleEmail = (body: IEmailNewRole) => {
    email
        .send({
            template: "newProfile",
            message: {
                to: body.researcherEmail,
                subject: "SuperDot - Alteração de perfil.",
            },
            locals: {
                researcherName: body.researcherName,
                admName: body.admName,
                newRole: body.newRole,
                admEmail: body.admEmail,
                admMessage: body.admMessage,
                systemURL: env.FRONT_END_URL,
            },
        })
        .then(console.log)
        .catch(console.error);
};

interface IEmailParticipantIndication {
    participantEmail: string;
    participantName: string;
    researcherName: string;
    researcherEmail: string;
    sampleId: string;
}

export const dispatchParticipantIndicationEmail = ({
    participantEmail,
    participantName,
    researcherName,
    researcherEmail,
    sampleId,
}: IEmailParticipantIndication) => {
    email
        .send({
            template: "participantIndication",
            message: {
                to: participantEmail,
                subject: "Você foi convidado para participar de uma pesquisa!",
            },
            locals: {
                participantEmail: participantEmail,
                participantName: participantName,
                researcherEmail: researcherEmail,
                researcherName: researcherName,
                formURL: `${env.FRONT_END_URL}/formulario-adulto/${sampleId}`,
            },
        })
        .then(console.log)
        .catch(console.error);
};
