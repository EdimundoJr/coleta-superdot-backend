import nodemailer from "nodemailer";
import env from "./validateEnv";
import Email from "email-templates";
import * as path from "path";
import { RolesType, SampleStatus } from "./consts";
import fs from "fs";

const templatesPath = path.join(__dirname, "../storage/emailTemplates");


console.log("🔍 __dirname real:", __dirname);
console.log("📁 Resolvendo para:", templatesPath);
console.log("📦 Existe?", fs.existsSync(templatesPath));

if (!fs.existsSync(templatesPath)) {
    console.error("❌ Template path not found:", templatesPath);
} else {
    console.log("✅ Caminho dos templates:", templatesPath);
}

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
    qttParticipantsAuthorized?: number;
    reviewerFullName: string;
    reviewerEmail: string;
    reviewDate: string;
    reviewerMessage: string;
}

export const dispatchReviewRequestEmail = async (requestBody: EmailReviewRequest): Promise<void> => {
    try {
        const templateDir = path.join(templatesPath, "reviewRequestSample");
        console.log("Verificando diretório do template:", templateDir);

        const textFallback = `Prezado(a) ${requestBody.researcherName},\n\nSua amostra "${requestBody.sampleName}" foi revisada.\nStatus: ${requestBody.sampleStatus}\n\nMensagem: ${requestBody.reviewerMessage}\n\nAcesse: ${env.FRONT_END_URL}`;

        let htmlContent;
        try {
            htmlContent = await email.render("reviewRequestSample/html", {
                locals: { ...requestBody, systemURL: env.FRONT_END_URL }
            });
        } catch (renderError) {
            console.warn("Falha ao renderizar template HTML, usando fallback:", renderError);
            htmlContent = `<p>${textFallback.replace(/\n/g, '<br>')}</p>`;
        }

        await email.send({
            template: "reviewRequestSample",
            message: {
                to: requestBody.researcherEmail,
                subject: "Sua solicitação de amostra foi revisada!",
                text: textFallback,
                html: htmlContent
            },
            locals: { ...requestBody, systemURL: env.FRONT_END_URL }
        });

    } catch (error) {
        console.error("Falha no processo de envio:", error);

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
