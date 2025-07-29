import User, { IUser } from '../models/User';

/**
 * Valida que el email tenga un formato correcto.
 */
export function isValidEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.trim().toLowerCase());
}

/**
 * Valida que el nombre solo contenga letras, espacios y tildes.
 */
export function isValidName(name: string): boolean {
  return /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(name.trim());
}

/**
 * Valida que el username solo tenga letras, números, guion bajo y punto.
 */
export function isValidUsername(username: string): boolean {
  return /^[a-zA-Z0-9_.]+$/.test(username.trim());
}

/**
 * Valida que la contraseña sea fuerte:
 * - Mínimo 8 caracteres
 * - Al menos una minúscula, una mayúscula, un número y un signo
 */
export function isStrongPassword(password: string): boolean {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  return regex.test(password);
}

/**
 * Verifica si un email ya está registrado (excluyendo un ID opcional).
 */
export async function isEmailTaken(email: string, excludeUserId?: string): Promise<boolean> {
  const user = await User.findOne({ email: email.trim().toLowerCase() });
  if (!user) return false;

  // Chequeo seguro de _id (para evitar el error de TS)
  if (
    excludeUserId &&
    user._id &&
    typeof user._id.toString === 'function' &&
    user._id.toString() === excludeUserId
  ) {
    return false;
  }
  return true;
}

/**
 * Verifica si un username ya está en uso (excluyendo un ID opcional).
 */
export async function isUsernameTaken(username: string, excludeUserId?: string): Promise<boolean> {
  const user = await User.findOne({ username: username.trim().toLowerCase() });
  if (!user) return false;

  // Chequeo seguro de _id (para evitar el error de TS)
  if (
    excludeUserId &&
    user._id &&
    typeof user._id.toString === 'function' &&
    user._id.toString() === excludeUserId
  ) {
    return false;
  }
  return true;
}
