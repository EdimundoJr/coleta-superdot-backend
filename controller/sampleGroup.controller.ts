import { Request, Response } from "express";
import * as SampleGroupService from "../service/sampleGroup.service";

export async function findAllHandler(req: Request, res: Response) {
    try {
        const sampleGroups = await SampleGroupService.findAll();
        res.status(200).json(sampleGroups);
    } catch (e: any) {
        console.log(e);

        // TO DO errors handlers
        res.status(409).send(e.message);
    }
}
