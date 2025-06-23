import { Schema, model, Document, Types } from 'mongoose';

export type RecipeType =
  | 'Ecuatoriana'
  | 'Italiana'
  | 'Mexicana'
  | 'Asiática'
  | 'Postres'
  | 'Rápida';

export type Difficulty = 'Principiante' | 'Intermedio' | 'Avanzado';

export interface IRecipeIngredient {
  ingredient: Types.ObjectId;
  quantity: number | null;
  unit: string | null;
}

export interface IRecipeRating {
  userId: Types.ObjectId;
  value: number;
}

export interface IRecipe extends Document {
  title: string;
  imageUrl: string;
  description?: string;
  timeRequired?: number;
  servings?: number;
  difficulty: Difficulty;
  rating?: number;
  ratingCount?: number;
  ratingTotal?: number;
  ratings?: IRecipeRating[];
  type: RecipeType;
  ingredients: IRecipeIngredient[];
  steps?: string[];
}

const RecipeIngredientSchema = new Schema<IRecipeIngredient>({
  ingredient: { type: Schema.Types.ObjectId, ref: 'Ingredient', required: true },
  quantity:   { type: Number },
  unit:       { type: String },
}, { _id: false });

const RecipeRatingSchema = new Schema<IRecipeRating>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  value:  { type: Number, min: 1, max: 5, required: true }
}, { _id: false });

const RecipeSchema = new Schema<IRecipe>({
  title:       { type: String, required: true, trim: true },
  imageUrl:    { type: String, required: true },
  description: { type: String },
  timeRequired:{ type: Number },
  servings:    { type: Number },
  difficulty:  { type: String, enum: ['Principiante', 'Intermedio', 'Avanzado'], required: true },
  rating:      { type: Number, min: 0, max: 5, default: 0 },
  ratingCount: { type: Number, default: 0 },
  ratingTotal: { type: Number, default: 0 },
  ratings:     { type: [RecipeRatingSchema], default: [] },
  type:        { type: String, enum: ['Ecuatoriana', 'Italiana', 'Mexicana', 'Asiática', 'Postres', 'Rápida'], required: true },
  ingredients: { type: [RecipeIngredientSchema], required: true },
  steps:       [String],
}, { timestamps: true });

export default model<IRecipe>('Recipe', RecipeSchema);
