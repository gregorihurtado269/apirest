import Recipe, { IRecipe } from '../models/Recipe';
import mongoose from 'mongoose';

const ALLOWED_TYPES = ['Ecuatoriana', 'Italiana', 'Mexicana', 'Asiática', 'Postres', 'Rápida'];
const ALLOWED_DIFFICULTIES = ['Principiante', 'Intermedio', 'Avanzado'];

class RecipeRepository {
  // Crear receta
  async create(data: Partial<IRecipe>): Promise<IRecipe> {
    if (data.timeRequired && data.timeRequired <= 15) {
      data.type = 'Rápida';
    }
    if (data.difficulty && !ALLOWED_DIFFICULTIES.includes(data.difficulty)) {
      throw new Error('Dificultad inválida');
    }
    if (data.type && !ALLOWED_TYPES.includes(data.type)) {
      throw new Error('Tipo de receta inválido');
    }
    return await Recipe.create(data);
  }

  // Actualizar receta por ID
  async updateById(id: string, data: Partial<IRecipe>): Promise<IRecipe | null> {
    if (data.timeRequired && data.timeRequired <= 15) {
      data.type = 'Rápida';
    }
    if (data.difficulty && !ALLOWED_DIFFICULTIES.includes(data.difficulty)) {
      throw new Error('Dificultad inválida');
    }
    if (data.type && !ALLOWED_TYPES.includes(data.type)) {
      throw new Error('Tipo de receta inválido');
    }
    return await Recipe.findByIdAndUpdate(id, data, { new: true }).populate('ingredients.ingredient');
  }

  // Buscar por ID
  async findById(id: string): Promise<IRecipe | null> {
    return await Recipe.findById(id).populate('ingredients.ingredient');
  }

  // Buscar todas
  async findAll(): Promise<IRecipe[]> {
    return await Recipe.find().populate('ingredients.ingredient');
  }

  // Buscar recetas que puedan hacerse con TODOS los ingredientes enviados
  async findByIngredients(ingredientIds: string[]): Promise<IRecipe[]> {
  const objectIds = ingredientIds
    .filter(id => mongoose.Types.ObjectId.isValid(id))
    .map(id => new mongoose.Types.ObjectId(id));

  const recetas = await Recipe.aggregate([
    {
      $addFields: {
        recipeIngredientIds: {
          $map: {
            input: "$ingredients",
            as: "i",
            in: "$$i.ingredient"
          }
        }
      }
    },
    {
      $addFields: {
        matchCount: {
          $size: {
            $setIntersection: ["$recipeIngredientIds", objectIds]
          }
        },
        recipeIngredientCount: { $size: "$recipeIngredientIds" }
      }
    },
    {
      $match: {
        $expr: { $eq: ["$matchCount", "$recipeIngredientCount"] }
      }
    }
  ]);

  // Popula los ingredientes si lo necesitas
  const ids = recetas.map((r: any) => r._id);
  return await Recipe.find({ _id: { $in: ids } }).populate('ingredients.ingredient');
}


  // Buscar por tipo
  async findByType(type: string): Promise<IRecipe[]> {
    return await Recipe.find({ type }).populate('ingredients.ingredient');
  }

  // Buscar por dificultad
  async findByDifficulty(difficulty: string): Promise<IRecipe[]> {
    return await Recipe.find({ difficulty }).populate('ingredients.ingredient');
  }

  // Las más populares
  async findPopular(): Promise<IRecipe[]> {
    return await Recipe.find().sort({ rating: -1 }).limit(10).populate('ingredients.ingredient');
  }

  // Recomendadas (puedes personalizar lógica)
  async findRecommended(userId: string): Promise<IRecipe[]> {
    return await Recipe.find().limit(5).populate('ingredients.ingredient');
  }

  // Calificar receta
  async rateRecipe(recipeId: string, userId: string, value: number): Promise<IRecipe | null> {
    if (value < 1 || value > 5) throw new Error('Valor de rating inválido');
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) return null;

    if ((recipe as any).ratings) {
      let found = (recipe as any).ratings.find((r: any) => r.userId.equals(userId));
      if (found) {
        recipe.ratingTotal! -= found.value;
        recipe.ratingTotal! += value;
        found.value = value;
      } else {
        (recipe as any).ratings.push({ userId: new mongoose.Types.ObjectId(userId), value });
        recipe.ratingTotal = (recipe.ratingTotal || 0) + value;
        recipe.ratingCount = (recipe.ratingCount || 0) + 1;
      }
    } else {
      recipe.ratingTotal = (recipe.ratingTotal || 0) + value;
      recipe.ratingCount = (recipe.ratingCount || 0) + 1;
    }
    recipe.rating = recipe.ratingTotal! / recipe.ratingCount!;
    await recipe.save();
    return await Recipe.findById(recipeId).populate('ingredients.ingredient');
  }
}

export default new RecipeRepository();
