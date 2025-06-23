// models/Ingredient.ts
import { Schema, model, Document } from 'mongoose';

export interface IIngredient extends Document {
  name: string;
  units?: string[];
  defaultUnit?: string;
  category?: string;
}

const IngredientSchema = new Schema<IIngredient>({
  name:        { type: String, required: true, unique: true, trim: true },
  units:       { type: [String], default: [] },
  defaultUnit: { type: String },
  category:    { type: String },
});

export default model<IIngredient>('Ingredient', IngredientSchema);
