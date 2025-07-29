// src/services/recipeService.ts

import recipeRepository from '../repositories/recipeRepository';
import fridgeRepository from '../repositories/fridgeRepository';
import ingredientRepository from '../repositories/ingredientRepository';
import { IRecipe } from '../models/Recipe';
import { convertUnit } from '../utils/unitConversion';

type Unit = 'gramo' | 'mililitro' | 'cucharadita' | 'cucharada' | 'taza';

/**
 * Helper para obtener el ID de un ingrediente desde distintos formatos de objeto.
 */
function getIngredientId(ingredient: any): string {
  if (!ingredient) return '';
  if (typeof ingredient === 'string') return ingredient;
  if (ingredient._id) return ingredient._id.toString();
  if (ingredient.toString) return ingredient.toString();
  return '';
}

class RecipeService {
  /**
   * Crea una nueva receta.
   */
  async createRecipe(data: Partial<IRecipe>): Promise<IRecipe> {
    return await recipeRepository.create(data);
  }

  /**
   * Actualiza una receta existente.
   */
  async updateRecipe(id: string, data: Partial<IRecipe>): Promise<IRecipe | null> {
    return await recipeRepository.updateById(id, data);
  }

  /**
   * Obtiene una receta por su ID.
   */
  async getRecipeById(id: string): Promise<IRecipe | null> {
    return await recipeRepository.findById(id);
  }

  /**
   * Lista todas las recetas.
   */
  async getAllRecipes(): Promise<IRecipe[]> {
    return await recipeRepository.findAll();
  }

  /**
   * Busca recetas por los IDs de ingredientes (deben estar todos).
   */
  async findRecipesByIngredients(ingredientIds: string[]): Promise<IRecipe[]> {
    return await recipeRepository.findByIngredients(ingredientIds);
  }

  /**
   * Busca recetas por tipo.
   */
  async getRecipesByType(type: string): Promise<IRecipe[]> {
    return await recipeRepository.findByType(type);
  }

  /**
   * Busca recetas por dificultad.
   */
  async getRecipesByDifficulty(difficulty: string): Promise<IRecipe[]> {
    return await recipeRepository.findByDifficulty(difficulty);
  }

  /**
   * Obtiene las recetas más populares.
   */
  async getPopularRecipes(): Promise<IRecipe[]> {
    return await recipeRepository.findPopular();
  }

  /**
   * Obtiene recetas recomendadas para un usuario.
   */
  async getRecommendedRecipes(userId: string): Promise<IRecipe[]> {
    return await recipeRepository.findRecommended(userId);
  }

  /**
   * Califica una receta.
   */
  async rateRecipe(recipeId: string, userId: string, value: number): Promise<IRecipe | null> {
    if (value < 1 || value > 5) throw new Error('Valor de rating inválido');
    
    // Llamamos al repositorio para actualizar o agregar la calificación
    return await recipeRepository.rateRecipe(recipeId, userId, value);
  }


  /**
   * "Cocina" una receta: descuenta los ingredientes del fridge del usuario.
   * Si algún ingrediente llega a cero o menos, lo elimina del fridge.
   * @returns El estado actualizado del fridge.
   */
  async cookRecipe(recipeId: string, userId: string): Promise<any> {
    const recipe = await this.getRecipeById(recipeId);
    if (!recipe) throw new Error('Receta no encontrada');

    const fridge = await fridgeRepository.findByUserId(userId);
    if (!fridge) throw new Error('No tienes ingredientes en tu nevera');

    let updated = false;

    for (const rIng of recipe.ingredients) {
      const rIngId = getIngredientId(rIng.ingredient);
      const idx = fridge.items.findIndex(
        (f) => getIngredientId(f.ingredient) === rIngId && f.unit === rIng.unit
      );
      if (idx !== -1) {
        let cantidadRestar: number | null = 0;
        const ingredient = await ingredientRepository.findById(rIngId);
        if (!ingredient) {
          throw new Error(`Ingrediente con ID ${rIngId} no encontrado`);
        }

        if (fridge.items[idx].unit.trim().toLowerCase() === (rIng.unit ?? '').trim().toLowerCase()) {
          cantidadRestar = rIng.quantity || 0;
        } else {
          cantidadRestar = convertUnit(
            ingredient.name,
            rIng.quantity || 0,
            rIng.unit as Unit,
            fridge.items[idx].unit as Unit
          );
        }

        if (cantidadRestar && cantidadRestar > 0) {
          if (fridge.items[idx].quantity > cantidadRestar) {
            fridge.items[idx].quantity -= cantidadRestar;
            if (fridge.items[idx].quantity <= 0) {
              fridge.items.splice(idx, 1); // Elimina si llega a cero
            }
          } else {
            fridge.items.splice(idx, 1); // Elimina si la resta es igual o mayor
          }
          updated = true;
        }
      }
    }

    if (updated) await fridge.save();
    return fridge.items;
  }

  /**
   * Busca recetas por proximidad: devuelve recetas con al menos un ingrediente coincidente,
   * ordenando por porcentaje de match y menor cantidad de ingredientes.
   */
  async findRecipesByProximity(ingredientIds: string[]): Promise<any[]> {
    const recipes = await this.getAllRecipes();
    const recipeMatches = recipes.map((recipe) => {
      const recipeIngredientIds = (recipe.ingredients as any[]).map((ing) => getIngredientId(ing.ingredient));
      const total = recipeIngredientIds.length;
      const matched = recipeIngredientIds.filter((id) => ingredientIds.includes(id)).length;
      const percentage = total > 0 ? matched / total : 0;
      return {
        recipe,
        matched,
        total,
        missing: total - matched,
        matchedIngredientIds: recipeIngredientIds.filter((id) => ingredientIds.includes(id)),
        missingIngredientIds: recipeIngredientIds.filter((id) => !ingredientIds.includes(id)),
        percentage
      };
    });

    const filteredMatches = recipeMatches.filter(r => r.matched > 0);

    filteredMatches.sort((a, b) => {
      if (a.total !== b.total) return a.total - b.total;
      if (b.percentage !== a.percentage) return b.percentage - a.percentage;
      return a.missing - b.missing;
    });

    return filteredMatches;
  }
}

export default new RecipeService();
