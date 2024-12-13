import { describe } from "mocha";
import chai from "chai";
import sinonChai from "sinon-chai";
import sinon from "sinon";
import * as SessionController from "../../controller/session.controller";
import { Request, Response } from "express";
import mongoose, { Types } from "mongoose";
import * as ResearcherService from "../../service/researcher.service";
import * as SessionService from "../../service/session.service";
import { DateTime } from "luxon";

const expect = chai.expect;
chai.use(sinonChai);

describe("Session Controller", function () {
    const req = {
        body: {
            email: "test@outlook.com",
            password: "123456789",
        },
        get: function (header: string) {
            return "Mozilla Firefox";
        },
    };

    const spyJson = sinon.spy();

    const res = {
        send: sinon.spy,
        status: sinon.stub().returns({ json: spyJson }),
    };

    afterEach(function () {
        sinon.restore();
    });

    it("should return jwt tokens", async function () {
        sinon.stub(ResearcherService, "validatePassword").returns(
            Promise.resolve({
                _id: new Types.ObjectId().toString(),
                personal_data: {
                    full_name: "Rafael Pereira",
                    phone: "9999999",
                    profile_photo: "photo.png",
                    birth_date: DateTime.fromISO("2023-06-21").toJSDate(),
                    country_state: "Bahia",
                },
                email: "test@hotmail.com",
                password_hash: "djasijd9j19dj2198udj9281jd",
                role: "Pesquisador",
                instituition: "IFBA",
            })
        );
        sinon
            .stub(SessionService, "issueAccessToken")
            .returns("jwt_access_token");
        sinon
            .stub(SessionService, "issueRefreshToken")
            .returns("jwt_refresh_token");

        sinon.stub(SessionService, "createSession").returns(
            Promise.resolve({
                _id: "session_id",
                researcher_id: "researcher_id",
                valid: true,
                userAgent: "Mozila Firefox",
            })
        );

        await SessionController.createSessionHandler(
            req as Request,
            res as unknown as Response
        );

        expect(res.status.calledOnce).to.be.true;
        expect(res.status.args[0][0]).to.equal(201);
        expect(spyJson.calledOnce).to.be.true;
        expect(spyJson.args[0][0]).to.be.deep.equal({
            accessToken: "jwt_access_token",
            refreshToken: "jwt_refresh_token",
        });
    });
});
