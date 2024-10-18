import { Schema, model, Document, Types } from "mongoose";

export interface ITodo extends Document {
  _id: Schema.Types.ObjectId;
  title: string;
  completed: boolean;
  sequence: number;
}

const TodoSchema = new Schema<ITodo>({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  sequence: { type: Number, default: 0 },
});

export default model<ITodo>("Todo", TodoSchema);
