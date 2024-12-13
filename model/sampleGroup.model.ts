import { Schema, model } from "mongoose";
import ISampleGroup from "../interface/sampleGroup.interface";

const sampleGroupSchema = new Schema<ISampleGroup>(
    {
        title: {
            type: String,
            required: [true, "A group title is required."],
            trim: true,
            unique: true,
        },
        forms: {
            type: [String],
            required: [true, "The group sample forms is required."],
        },
        available: {
            type: Boolean,
            required: [true, "The available flag is required."],
        },
    },
    {
        timestamps: true,
    }
);

const SampleGroupModel = model<ISampleGroup>("SampleGroup", sampleGroupSchema);

export default SampleGroupModel;
