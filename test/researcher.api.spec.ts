import { describe } from "mocha";
import supertest from "supertest";
import { expect } from "chai";
import app from "../app";

describe("Researcher Integration Tests", () => {
    describe("POST /api/researcher/new-researcher", () => {
        it("should return the researcher payload", async () => {
            const { statusCode, body } = await supertest(app)
                .post("/api/researcher/new-researcher")
                .send({
                    personal_data: {
                        full_name: "Lara Vieira",
                        phone: "9999999",
                        profile_photo: "photo.png",
                        birth_date: "2023-06-21",
                        country_state: "Bahia",
                    },
                    email: "test@hotmail.com",
                    password: "123456789",
                    password_confirmation: "123456789",
                    role: "Pesquisador",
                    instituition: "IFBA",
                });

            expect(statusCode).to.equal(201);
            expect(body).to.deep.include({
                personal_data: {
                    full_name: "LARA VIEIRA",
                    phone: "9999999",
                    profile_photo: "photo.png",
                    birth_date: "2023-06-21T00:00:00.000Z",
                    country_state: "Bahia",
                },
                email: "test@hotmail.com",
                role: "Pesquisador",
                instituition: "IFBA",
            });
        });
    });
});
