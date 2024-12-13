import { Schema, model } from "mongoose";
import IResearcher from "../interface/researcher.interface";
import { sampleSchema } from "./schemas/sample.schema";

const researcherSchema = new Schema<IResearcher>(
    {
        personalData: {
            fullName: {
                type: String,
                uppercase: true,
                trim: true,
                required: [true, "Full name is required"],
            },
            phone: {
                type: String,
                required: [true, "Phone number is required"],
            },
            profilePhoto: String,
            birthDate: {
                type: Date,
                required: [true, "Birth date is required"],
            },
            countryState: {
                type: String,
                trim: true,
                required: [true, "Country state is required"],
            },
        },
        email: {
            type: String,
            match: [
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                "E-mail should be valid",
            ],
            unique: true,
            trim: true,
            lowercase: true,
            required: [true, "Email is required"],
        },
        passwordHash: {
            type: String,
            required: [true, "Password hash is required"],
        },
        role: {
            type: String,
            enum: ["Pesquisador", "Revisor", "Administrador"],
            required: [true, "Role is required"],
        },
        instituition: {
            type: String,
            required: [true, "Instituition is required"],
        },
        researchSamples: [sampleSchema],
    },
    {
        timestamps: true,
    }
);

const ResearcherModel = model<IResearcher>("Researcher", researcherSchema);

export default ResearcherModel;
