import { expect } from "chai";
import mongoose, { Types } from "mongoose";
import {
    createResearcher,
    deleteResearcher,
    findResearcher,
    updateResearcher,
} from "../service/researcher.service";
import { DateTime } from "luxon";
import IResearcher from "../interface/researcher.interface";
import ResearcherModel from "../model/researcher.model";
import { omit } from "lodash";

describe("Researcher Service", function () {
    describe("Create Researcher", function () {
        it("Should save and return the document", async () => {
            const researcherData = {
                personal_data: {
                    full_name: "Lara Vieira",
                    phone: "9999999",
                    profile_photo: "photo.png",
                    birth_date: DateTime.fromISO("2023-06-21").toJSDate(),
                    country_state: "Bahia",
                },
                email: "test@hotmail.com",
                password_hash: "djasijd9j19dj2198udj9281jd",
                role: "Pesquisador",
                instituition: "IFBA",
            };
            const researcher = await createResearcher(researcherData);

            expect(researcher).to.deep.include(
                {
                    personal_data: {
                        full_name: "LARA VIEIRA",
                        phone: "9999999",
                        profile_photo: "photo.png",
                        birth_date: DateTime.fromISO("2023-06-21").toJSDate(),
                        country_state: "Bahia",
                    },
                    email: "test@hotmail.com",
                    role: "Pesquisador",
                    instituition: "IFBA",
                },
                "The document created isn't equal to the data passed in!"
            );
        });
    });

    describe("Manipulate Research Data", function () {
        let researcher: IResearcher;

        beforeEach("create the researcher data", async () => {
            researcher = await createResearcher({
                personal_data: {
                    full_name: "Felipe Pereira",
                    phone: "9999999",
                    profile_photo: "photo.png",
                    birth_date: DateTime.fromISO("2023-06-21").toJSDate(),
                    country_state: "Bahia",
                },
                email: "test@hotmail.com",
                password_hash: "djasijd9j19dj2198udj9281jd",
                role: "Pesquisador",
                instituition: "IFBA",
            });
        });

        describe("Update Researcher", function () {
            it("Should update and return the document", async function () {
                let newResearcher = researcher;

                newResearcher.personal_data.full_name = "Neymar";

                const researcherReturned = await updateResearcher({
                    _id: researcher._id,
                    ...newResearcher,
                });

                return expect(researcherReturned.personal_data.full_name).equal(
                    "NEYMAR"
                );
            });
        });

        describe("Delete Researcher", function () {
            it("Should delete the document and return it", async function () {
                const id = new Types.ObjectId(researcher._id);

                const researcherReturned = await deleteResearcher(id);

                expect(await ResearcherModel.findById(id).exec()).to.be.null;

                return expect(researcherReturned).to.deep.include({
                    personal_data: {
                        full_name: "FELIPE PEREIRA",
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

        describe("Find Researcher", function () {
            describe("Find by id", function () {
                it("When id exists should return a document", async function () {
                    const researcherReturned = await findResearcher({
                        _id: researcher._id,
                    });
                    expect(researcherReturned).to.deep.equal(
                        omit(researcher, "password_hash")
                    );
                });
            });
            describe("Find by email", function () {
                it("When email exists should return a document", async function () {
                    const researcherReturned = await findResearcher({
                        email: researcher.email,
                    });
                    expect(researcherReturned).to.deep.equal(
                        omit(researcher, "password_hash")
                    );
                });
            });
        });
    });
});
