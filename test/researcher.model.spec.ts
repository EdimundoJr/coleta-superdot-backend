import ResearcherModel from "../model/researcher.model";
import chai, { expect, should } from "chai";
import chaiAsPromise from "chai-as-promised";
import { any } from "zod";

chai.use(chaiAsPromise);
should();

describe("Researcher model", () => {
    describe("Creating model", () => {
        it("should be saved on db", async () => {
            const modelData = {
                personal_data: {
                    full_name: "Rafael Pereira",
                    phone: "9999999",
                    profile_photo: "photo.png",
                    birth_date: "2023-06-21",
                    country_state: "Bahia",
                },
                email: "test@hotmail.com",
                password_hash: "djasijd9j19dj2198udj9281jd",
                role: "Pesquisador",
                instituition: "IFBA",
            };

            const modelCreated = new ResearcherModel(modelData)
                .save()
                .then((model) => {
                    expect(model).equal({
                        personal_data: {
                            full_name: "Rafael Pereira",
                            phone: "9999999",
                            profile_photo: "photo.png",
                            birth_date: "2023-06-21",
                            country_state: "Bahia",
                        },
                        _id: expect(String),
                        email: "test@hotmail.com",
                        password_hash: "djasijd9j19dj2198udj9281jd",
                        role: "Pesquisador",
                        instituition: "IFBA",
                        updatedAt: expect(Date),
                        createdAt: expect(Date),
                        __v: expect(any),
                        ...expect(any),
                    });
                });
        });

        describe("Creating model without full_name", () => {
            it("should throw a exception", async () => {
                const modelData = {
                    personal_data: {
                        phone: "9999999",
                        profile_photo: "photo.png",
                        birth_date: "2023-06-21",
                        country_state: "Bahia",
                    },
                    email: "test@hotmail.com",
                    password_hash: "djasijd9j19dj2198udj9281jd",
                    role: "Pesquisador",
                    instituition: "IFBA",
                };

                const newModel = new ResearcherModel(modelData);
                expect(newModel.save()).to.be.rejected;
            });
        });
    });
});
