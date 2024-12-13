import SampleGroupModel from "../model/sampleGroup.model";
import ISampleGroup from "../interface/sampleGroup.interface";

export async function findAll(): Promise<ISampleGroup[]> {
    try {
        const sampleGroups = await SampleGroupModel.find({}).lean().exec();
        return sampleGroups;
    } catch (e: any) {
        console.error(e);
        throw new Error("Cannot find a sample group");
    }
}
