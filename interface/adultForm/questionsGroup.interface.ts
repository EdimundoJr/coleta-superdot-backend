import { EAdultFormGroup } from "../../util/consts";
import IQuestion from "./question.interface";

export default interface IQuestionsGroup {
    groupName: string;
    sequence: EAdultFormGroup;
    questions: IQuestion[];
}
