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

  // Buscar receta por ID
  async findById(id: string): Promise<IRecipe | null> {
    return await Recipe.findById(id).populate('ingredients.ingredient');
  }

  // Buscar todas las recetas
  async findAll(): Promise<IRecipe[]> {
    return await Recipe.find().populate('ingredients.ingredient');
  }

  /**
   * Buscar recetas que puedan hacerse con TODOS los ingredientes enviados.
   * Retorna solo recetas cuyas recetas estén completamente contenidas en ingredientIds.
   */
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
            $size: { $setIntersection: ["$recipeIngredientIds", objectIds] }
          },
          recipeIngredientCount: { $size: "$recipeIngredientIds" }
        }
      },
      {
        $match: { $expr: { $eq: ["$matchCount", "$recipeIngredientCount"] } }
      }
    ]);

    // Obtiene los IDs de las recetas encontradas
    const ids = recetas.map((r: any) => r._id);
    return await Recipe.find({ _id: { $in: ids } }).populate('ingredients.ingredient');
  }

  // Buscar recetas por tipo
  async findByType(type: string): Promise<IRecipe[]> {
    return await Recipe.find({ type }).populate('ingredients.ingredient');
  }

  // Buscar recetas por dificultad
  async findByDifficulty(difficulty: string): Promise<IRecipe[]> {
    return await Recipe.find({ difficulty }).populate('ingredients.ingredient');
  }

  // Recetas más populares (por rating)
  async findPopular(): Promise<IRecipe[]> {
    return await Recipe.find().sort({ rating: -1 }).limit(10).populate('ingredients.ingredient');
  }

  // Recomendadas para usuario (puedes personalizar esta lógica)
  async findRecommended(userId: string): Promise<IRecipe[]> {
    return await Recipe.find().limit(5).populate('ingredients.ingredient');
  }


  // Calificar receta
async rateRecipe(recipeId: string, userId: string, value: number): Promise<IRecipe | null> {
  if (value < 1 || value > 5) throw new Error('Valor de rating inválido');
  
  const recipe = await Recipe.findById(recipeId);
  if (!recipe) return null;

  // Busca rating previo
  let found = recipe.ratings?.find((r: any) => r.userId.toString() === userId.toString());
  
  if (found) {
    // Actualizar rating existente
    recipe.ratingTotal! -= found.value;
    recipe.ratingTotal! += value;
    found.value = value;
  } else {
    // Agregar nuevo rating
    recipe.ratings?.push({ userId: new mongoose.Types.ObjectId(userId), value });
    recipe.ratingTotal = (recipe.ratingTotal || 0) + value;
    recipe.ratingCount = (recipe.ratingCount || 0) + 1;
  }

  // Recalcular promedio de calificación
  recipe.rating = recipe.ratingTotal! / recipe.ratingCount!;
  
  // Guardar la receta con la calificación actualizada
  await recipe.save();

  // Devuelve la receta actualizada
  return await Recipe.findById(recipeId).populate('ingredients.ingredient');
}

  /**
   * Buscar recetas por proximidad:
   * 1. Solo devuelve recetas con al menos 1 coincidencia de ingrediente (matched > 0).
   * 2. Ordena primero por menor cantidad total de ingredientes (más sencillas primero),
   *    luego por mayor porcentaje de match,
   *    luego por menor cantidad de ingredientes faltantes.
   */
  async findByProximityOrdered(ingredientIds: string[]): Promise<any[]> {
    const allRecipes = await Recipe.find().populate('ingredients.ingredient');
    return allRecipes
      .map(recipe => {
        const recipeIngredientIds = recipe.ingredients.map((ing: any) =>
          typeof ing.ingredient === 'string'
            ? ing.ingredient
            : (ing.ingredient?._id?.toString() ?? '')
        ).filter(Boolean);

        const matched = recipeIngredientIds.filter(id => ingredientIds.includes(id)).length;
        const total = recipeIngredientIds.length;
        const percentage = total > 0 ? matched / total : 0;
        const missing = total - matched;

        return {
          recipe,
          matched,
          total,
          percentage,
          missing,
          matchedIngredientIds: recipeIngredientIds.filter(id => ingredientIds.includes(id)),
          missingIngredientIds: recipeIngredientIds.filter(id => !ingredientIds.includes(id)),
        };
      })
      .filter(item => item.matched > 0) // Solo recetas con al menos una coincidencia
      .sort((a, b) => {
        // 1. Menor cantidad total de ingredientes
        if (a.total !== b.total) return a.total - b.total;
        // 2. Mayor porcentaje de coincidencia
        if (b.percentage !== a.percentage) return b.percentage - a.percentage;
        // 3. Menor cantidad de ingredientes faltantes
        return a.missing - b.missing;
      });
  }
}

export default new RecipeRepository();
