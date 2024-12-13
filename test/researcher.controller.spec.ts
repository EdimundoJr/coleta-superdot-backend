import { describe } from "mocha";
import chai from "chai";
import sinonChai from "sinon-chai";
import sinon from "sinon";
import * as ResearcherController from "../controller/researcher.controller";
import { Request, Response } from "express";
import * as ResearcherService from "../service/researcher.service";
import { DateTime } from "luxon";

import * as HashUtil from "../util/hash";

const expect = chai.expect;
chai.use(sinonChai);

describe("Researcher Controller", function () {
    const req = {
        body: {
            personal_data: {
                full_name: "Lara Vieira",
                phone: "9999999",
                profile_photo: "photo.png",
                birth_date: DateTime.fromISO("2023-06-21").toJSDate(),
                country_state: "Bahia",
            },
            email: "test@hotmail.com",
            password: "123456789",
            password_confirmation: "123456789",
            role: "Pesquisador",
            instituition: "IFBA",
        },
    };

    const spyJson = sinon.spy();

    const res = {
        send: sinon.spy,
        status: sinon.stub().returns({ json: spyJson }),
    };

    it("should return 201 status and the researcher data without the password", async function () {
        sinon.stub(HashUtil, "hashContent").returns("password_hashed");
        sinon.stub(ResearcherService, "createResearcher").returns(
            Promise.resolve({
                personal_data: {
                    full_name: "Lara Vieira",
                    phone: "9999999",
                    profile_photo: "photo.png",
                    birth_date: DateTime.fromISO("2023-06-21").toJSDate(),
                    country_state: "Bahia",
                },
                email: "test@hotmail.com",
                role: "Pesquisador",
                instituition: "IFBA",
            })
        );

        await ResearcherController.createResearcherHandler(
            req as Request,
            res as unknown as Response
        );

        expect(res.status.calledOnce).to.be.true;
        expect(res.status.args[0][0]).to.equal(201);
        expect(spyJson.calledOnce).to.be.true;
        expect(spyJson.args[0][0]).to.be.deep.equal({
            personal_data: {
                full_name: "Lara Vieira",
                phone: "9999999",
                profile_photo: "photo.png",
                birth_date: DateTime.fromISO("2023-06-21").toJSDate(),
                country_state: "Bahia",
            },
            email: "test@hotmail.com",
            role: "Pesquisador",
            instituition: "IFBA",
        });
    });
});
