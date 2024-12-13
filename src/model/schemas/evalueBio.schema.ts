import { Schema } from "mongoose";
import IBio from "../../interface/evalueAutobiograph";

export const evalueBioSchema = new Schema<IBio>(
  {
  id:  Number,
  text: String ,
  comment: String ,
  mark: String,
  start: Number,
  end: Number ,
  background: String ,
});
