import { Schema, model, Document, Types } from 'mongoose';

export interface IFridgeItem {
  ingredient: Types.ObjectId; // Referencia a Ingredient
  quantity: number;           // Cantidad
  unit: string;               // Unidad ("g", "unidad", etc)
  addedAt?: Date;
}

export interface IFridge extends Document {
  userId: Types.ObjectId;
  items: IFridgeItem[];
}

const FridgeItemSchema = new Schema<IFridgeItem>({
  ingredient: { type: Schema.Types.ObjectId, ref: 'Ingredient', required: true },
  quantity: { type: Number, required: true, min: 0 },
  unit: { type: String, required: true },
  addedAt: { type: Date, default: Date.now }
}, { _id: false });

const FridgeSchema = new Schema<IFridge>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: [FridgeItemSchema]
});

export default model<IFridge>('Fridge', FridgeSchema);
