import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  username: string;  // Nuevo campo
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true, trim: true }, // Nuevo campo
  email: { type: String, required: true, unique: true, trim: true },
  passwordHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Actualiza automáticamente updatedAt en cada guardado
UserSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

// Evita guardar accidentalmente 'password' sin hash
UserSchema.pre('save', function (next) {
  if ((this as any).password) {
    delete (this as any).password;
  }
  next();
});

export default model<IUser>('User', UserSchema);
