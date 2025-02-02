import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

type Recipe = {
  title: string;
  image: string;
  servings: number;
  readyInMinutes: number;
  preparationMinutes: number;
  cookingMinutes: number;
  healthScore: number;
  pricePerServing: number;
  dairyFree: boolean;
  glutenFree: boolean;
  ketogenic: boolean;
  vegan: boolean;
  vegetarian: boolean;
  instructions: string;
  summary: string;
  extendedIngredients: {
    id: number;
    original: string;
    amount: number;
    unit: string;
  }[];
};

export default function Recipe() {
  let { id } = useParams();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchRecipe = async () => {
      if (!id) return;
      
      try {
        const response = await fetch(`http://localhost:5000/recipes/getRecipeInformation/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch recipe');
        }
        const data = await response.json();
        setRecipe(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4">
        <header className="py-6 border-b">
          <div className="text-2xl font-bold text-purple-700">PURPLE CARROT</div>
          <nav className="mt-4 space-x-6">
            <a href="/why-plants" className="hover:text-purple-700">WHY PLANTS</a>
            <a href="/menus" className="hover:text-purple-700">MENUS</a>
            <a href="/pricing" className="hover:text-purple-700">PRICING</a>
            <a href="/merch" className="hover:text-purple-700">MERCH</a>
            <a href="/gifts" className="hover:text-purple-700">GIFTS</a>
          </nav>
        </header>
        <div className="mt-8 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
        </div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="max-w-6xl mx-auto px-4">
        <header className="py-6 border-b">
          <div className="text-2xl font-bold text-purple-700">PURPLE CARROT</div>
          <nav className="mt-4 space-x-6">
            <a href="/why-plants" className="hover:text-purple-700">WHY PLANTS</a>
            <a href="/menus" className="hover:text-purple-700">MENUS</a>
            <a href="/pricing" className="hover:text-purple-700">PRICING</a>
            <a href="/merch" className="hover:text-purple-700">MERCH</a>
            <a href="/gifts" className="hover:text-purple-700">GIFTS</a>
          </nav>
        </header>
        <div className="mt-8 text-red-600">
          {error || 'Recipe not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4">
      <header className="">
        <title>{recipe.title}</title>
      </header>

      <div className="mt-8">
        <h1 className="text-4xl font-bold">{recipe.title}</h1>
        <div className="mt-4 text-gray-600 space-y-2">
          <p>Serves: {recipe.servings} people</p>
          <p>Total Time: {recipe.readyInMinutes} minutes</p>
          {recipe.preparationMinutes && <p>Prep Time: {recipe.preparationMinutes} minutes</p>}
          {recipe.cookingMinutes && <p>Cooking Time: {recipe.cookingMinutes} minutes</p>}
        </div>
      </div>

      {/* Recipe Image */}
      <div className="mt-8">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-96 object-cover rounded-lg"
        />
      </div>

      {/* Recipe Summary */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">About This Recipe</h2>
        <div className="prose max-w-none" 
             dangerouslySetInnerHTML={{ __html: recipe.summary }} />
      </div>

      {/* Ingredients */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Ingredients</h2>
        <div className="bg-gray-50 p-6 rounded-lg">
          <ul className="space-y-2">
            {recipe.extendedIngredients.map((ingredient) => (
              <li key={ingredient.id} className="flex items-center">
                <span className="mr-2">•</span>
                {ingredient.original}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Instructions</h2>
        <div className="bg-gray-50 p-6 rounded-lg prose max-w-none"
             dangerouslySetInnerHTML={{ __html: recipe.instructions }} />
      </div>

      {/* Nutrition Information */}
      <div className="mt-8 mb-12">
        <h2 className="text-2xl font-bold mb-4">Nutrition & Dietary Information</h2>
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <p className="mb-2"><strong>Health Score:</strong> {recipe.healthScore}</p>
            <p className="mb-2">
              <strong>Price Per Serving:</strong> ${(recipe.pricePerServing / 100).toFixed(2)}
            </p>
          </div>
          <div className="mt-4 flex flex-wrap gap-4">
            {recipe.dairyFree && (
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full">Dairy Free</span>
            )}
            {recipe.glutenFree && (
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full">Gluten Free</span>
            )}
            {recipe.ketogenic && (
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full">Keto</span>
            )}
            {recipe.vegan && (
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full">Vegan</span>
            )}
            {recipe.vegetarian && (
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full">Vegetarian</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}