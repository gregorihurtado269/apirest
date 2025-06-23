import { Schema, model, Document, Types } from 'mongoose';

export interface IProfile extends Document {
  userId: Types.ObjectId;
  preferences: string[];
  timeAvailable: string;
  cookingSkill: string;
  peopleServed: string;
  cookingFrequency: string;
}

const ProfileSchema = new Schema<IProfile>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  preferences: [{
    type: String,
    enum: ['Ecuatoriana', 'Italiana', 'Mexicana', 'Asiática', 'Postres', 'Rápida']
  }],
  timeAvailable: {
    type: String,
    enum: ['Menos de 15 min', '15-30 min', 'Más de 30 min']
  },
  cookingSkill: {
    type: String,
    enum: ['Principiante', 'Intermedio', 'Avanzado']
  },
  peopleServed: {
    type: String,
    enum: ['Solo yo', '2 personas', '3-4 personas', '5+ personas']
  },
  cookingFrequency: {
    type: String,
    enum: ['Diario', '3-4 veces/sem', 'Fines de semana', 'Pocas veces']
  }
});

export default model<IProfile>('Profile', ProfileSchema);
