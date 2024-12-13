import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import sinon from "sinon";
import SessionModel from "../model/session.model";
import ResearcherModel from "../model/researcher.model";

export const mochaHooks = {
    async afterEach() {
        sinon.restore();
        SessionModel.deleteMany({}).exec();
        ResearcherModel.deleteMany({}).exec();
    },

    async beforeAll() {
        const mongoServer = await MongoMemoryServer.create();
        await mongoose.connect(mongoServer.getUri());
    },

    async afterAll() {
        await mongoose.disconnect();
        await mongoose.connection.close();
    },
};
