import { Request, Response } from "express";
import { ResearcherDTO } from "../dto/researcher.dto";
import * as ResearcherService from "../service/researcher.service";
import * as SessionService from "../service/session.service";
import { hashContent } from "../util/hash";
import IResearcher from "../interface/researcher.interface";
import { get } from "lodash";
import env from "../util/validateEnv";
import { Types } from "mongoose";
import { LoginDTO, SetUserRoleDTO } from "../dto/auth.dto";
import { UserRoleDTO } from "../dto/auth.dto";

export async function registerHandler(req: Request<{}, {}, ResearcherDTO["body"], {}>, res: Response) {
    try {
        let researcherData: IResearcher = req.body;

        if (req.file) {
            researcherData.personal_data.profile_photo = req.file.filename;
        }

        researcherData.role = env.DEFAULT_APP_ROLE;

        researcherData.password_hash = hashContent(req.body.password);

        const researcherCreated = await ResearcherService.createResearcher(researcherData);

        const session = await SessionService.createSession(
            new Types.ObjectId(get(researcherCreated, "_id")),
            req.get("user-agent") || ""
        );

        const accessToken = SessionService.issueAccessToken(session);
        const refreshToken = SessionService.issueRefreshToken(session);

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

        if (!researcher) {
            return res.status(401).send("Invalid email or password");
        }

        const session = await SessionService.createSession(
            new Types.ObjectId(get(researcher, "_id")),
            req.get("user-agent") || ""
        );

        const accessToken = SessionService.issueAccessToken(session);
        const refreshToken = SessionService.issueRefreshToken(session);

        res.status(200).json({ accessToken, refreshToken });
    } catch (e: any) {
        console.log(e);

        // TO DO errors handlers
        res.status(409).send(e.message);
    }
}

export async function isValidSession(req: Request, res: Response) {
    try {
        const session = res.locals.session;
        res.status(200).json({ valid: session?.valid });
    } catch (e) {
        console.error(e);
        res.status(200).json({ valid: false });
    }
}

export async function userRoleHandler(req: Request<UserRoleDTO["params"], {}, {}, {}>, res: Response) {
    try {
        const { userId } = req.params;
        const role = await ResearcherService.getResearcherRole(userId);

        console.log(role);
        res.status(200).send(role);
    } catch (e) {
        console.error(e);
        res.status(500).send("Unknown error.");
    }
}

export async function setUserRoleHandler(req: Request<{}, {}, SetUserRoleDTO["body"], {}>, res: Response) {
    try {
        const { userId, newRole, emailMessage } = req.body;
        await ResearcherService.updateResearcher({ _id: userId }, { role: newRole });

        if (emailMessage) {
            console.log(emailMessage);
        }

        res.status(200).end();
    } catch (e) {
        console.error(e);
        res.status(500).send("Unknown error.");
    }
}
