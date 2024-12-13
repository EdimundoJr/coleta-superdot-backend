import { Request, Response } from "express";
import { ResearcherDTO } from "../dto/researcher.dto";
import * as ResearcherService from "../service/researcher.service";
import { hashContent } from "../util/hash";
import IResearcher from "../interface/researcher.interface";
import { get } from "lodash";
import env from "../util/validateEnv";
import { Types } from "mongoose";
import { LoginDTO, SetUserRoleDTO } from "../dto/auth.dto";
import { UserRoleDTO } from "../dto/auth.dto";
import { dispatchNewRoleEmail } from "../util/emailSender.util";
import { RolesType } from "../util/consts";
import { issueResearcherAccessToken, issueResearcherRefreshToken } from "../service/auth.service";

export async function registerHandler(req: Request<{}, {}, ResearcherDTO["body"], {}>, res: Response) {
    try {
        let researcherData: IResearcher = req.body;

        if (req.file) {
            researcherData.personalData.profilePhoto = req.file.filename;
        }

        researcherData.role = env.DEFAULT_APP_ROLE;

        researcherData.passwordHash = hashContent(req.body.password);

        const researcherCreated = await ResearcherService.createResearcher(researcherData);

        if (!researcherCreated._id) throw new Error("Cannot create researcher object");

        const accessToken = issueResearcherAccessToken({
            researcherId: researcherCreated._id,
            role: researcherCreated.role,
        });

        const refreshToken = issueResearcherRefreshToken({
            researcherId: researcherCreated._id,
        });

        res.status(200).json({ accessToken, refreshToken });
    } catch (e: any) {
        console.log(e);

        // TO DO errors handlers
        res.status(409).send(e.message);
    }
}

export async function loginHandler(req: Request<{}, {}, LoginDTO["body"], {}>, res: Response) {
    try {
        const researcher = await ResearcherService.validatePassword(req.body);

        if (!researcher || !researcher._id) {
            return res.status(401).send("Invalid email or password");
        }

        const accessToken = issueResearcherAccessToken({
            researcherId: researcher._id,
            role: researcher.role,
        });

        const refreshToken = issueResearcherRefreshToken({
            researcherId: researcher._id,
        });

        res.status(200).json({ accessToken, refreshToken });
    } catch (e: any) {
        console.log(e);

        // TO DO errors handlers
        res.status(409).send(e.message);
    }
}

export async function userRoleHandler(req: Request<UserRoleDTO["params"], {}, {}, {}>, res: Response) {
    try {
        const { userId } = req.params;
        const role = await ResearcherService.getResearcherRole(userId);

        // console.log(role);
        res.status(200).send(role);
    } catch (e) {
        console.error(e);
        res.status(500).send("Unknown error.");
    }
}

export async function setUserRoleHandler(req: Request<{}, {}, SetUserRoleDTO["body"], {}>, res: Response) {
    try {
        const adm = await ResearcherService.findResearcher({ _id: res.locals.researcherId });

        if (!adm) {
            throw new Error("Invalid session!");
        }

        const { userId, emailMessage } = req.body;
        if (!req.body.newRole.match("Pesquisador|Administrador|Revisor")) {
            throw new Error("Invalid role!");
        }
        const newRole = req.body.newRole as RolesType;

        const researcherUpdated = await ResearcherService.updateResearcher({ _id: userId }, { role: newRole });

        dispatchNewRoleEmail({
            admEmail: adm.email,
            admMessage: emailMessage,
            admName: adm.personalData.fullName,
            newRole,
            researcherEmail: researcherUpdated.email,
            researcherName: researcherUpdated.personalData.fullName,
        });

        res.status(200).end();
    } catch (e) {
        console.error(e);
        res.status(500).send("Unknown error.");
    }
}
