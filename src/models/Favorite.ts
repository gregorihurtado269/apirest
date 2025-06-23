import { Schema, model, Document, Types } from 'mongoose';

export interface IFavorite extends Document {
  userId: Types.ObjectId;
  recipes: Types.ObjectId[]; // Referencia a recetas
}

const FavoriteSchema = new Schema<IFavorite>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  recipes: [{ type: Schema.Types.ObjectId, ref: 'Recipe' }]
});

export default model<IFavorite>('Favorite', FavoriteSchema);
