// models/History.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IHistoryItem {
  recipe: string;
  viewedAt: Date;
}

export interface IHistory extends Document {
  userId: string;
  items: IHistoryItem[];
}

const HistorySchema = new Schema<IHistory>({
  userId: { type: String, required: true, unique: true },
  items: [{
    recipe: { type: Schema.Types.ObjectId, ref: 'Recipe' },
    viewedAt: { type: Date, default: Date.now }
  }]
});

export default mongoose.model<IHistory>('History', HistorySchema);
