import { EAdultFormSource } from "../../util/consts";
import IQuestionsGroup from "./questionsGroup.interface";

export default interface ISourceQuestionsGroup {
    _id?: string;
    source: EAdultFormSource;
    groups: IQuestionsGroup[];
}
