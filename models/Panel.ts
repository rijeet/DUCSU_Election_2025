import mongoose, { Schema, models, model } from "mongoose";

export interface IPanel {
  _id?: string;
  ownerId: string; // JWT subject (random UUID if anonymous)
  selections: {
    [positionKey: string]: string[]; // array of candidate IDs (member allows multiple)
  };
}

const PanelSchema = new Schema<IPanel>({
  ownerId: { type: String, required: true, index: true },
  selections: { type: Schema.Types.Mixed, default: {} },
}, { timestamps: true });

export default models.Panel || model<IPanel>("Panel", PanelSchema);
