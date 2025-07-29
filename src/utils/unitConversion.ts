// unitConversion.ts

type Unit = "gramo" | "mililitro" | "cucharadita" | "cucharada" | "taza"; // Definir las unidades permitidas

// Definición de tasas de conversión entre unidades
const conversionRates: { [key in Unit]: { [key in Unit]: number } } = {
  "gramo": {
    "gramo": 1,
    "mililitro": 1, // Dependerá del tipo de ingrediente, para agua esto es 1:1
    "cucharadita": 5,
    "cucharada": 15,
    "taza": 200,
  },
  "mililitro": {
    "gramo": 1, // Para agua es 1:1, pero depende del ingrediente
    "mililitro": 1,
    "cucharadita": 5,
    "cucharada": 15,
    "taza": 200,
  },
  "cucharadita": {
    "gramo": 5,
    "mililitro": 5,
    "cucharadita": 1,
    "cucharada": 3,
    "taza": 0.2,
  },
  "cucharada": {
    "gramo": 15,
    "mililitro": 15,
    "cucharadita": 3,
    "cucharada": 1,
    "taza": 0.05,
  },
  "taza": {
    "gramo": 200,
    "mililitro": 200,
    "cucharadita": 20,
    "cucharada": 60,
    "taza": 1,
  },
};

// Función para convertir la cantidad de un ingrediente de una unidad a otra
export function convertUnit(ingredientName: string, quantity: number, fromUnit: Unit, toUnit: Unit): number {
  if (fromUnit === toUnit) {
    return quantity; // Si las unidades son iguales, no hace falta convertir
  }

  // Verificamos si existe una tasa de conversión entre las unidades solicitadas
  const conversionRate = conversionRates[fromUnit]?.[toUnit];

  if (conversionRate !== undefined) {
    return quantity * conversionRate;
  } else {
    throw new Error(`No se puede convertir de ${fromUnit} a ${toUnit} para el ingrediente ${ingredientName}`);
  }
}
