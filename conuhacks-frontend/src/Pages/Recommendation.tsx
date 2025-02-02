import React, { useEffect, useState } from 'react';
import RecommendationCardComponent from '../Components/RecommendationCardComponent';
import { Link } from 'react-router-dom';
import placeholder_image from "../assets/placeholder_food_image.png";

export default function Recommendation() {
  const [categorizedRecipes, setCategorizedRecipes] = useState({});

  useEffect(() => {
    fetch('http://localhost:5000/recipes/getRecipesFromIngredientsForRecommendations')
      .then(response => response.json())
      .then(initialData => {
        const recipesData = Array.isArray(initialData) ? initialData : initialData.results || [];
        const ids = recipesData.map(recipe => recipe.id).join(',');
        
        if (!ids) {
          console.error('No recipe IDs found in initial data');
          return;
        }
        
        fetch(`http://localhost:5000/recipes/getBulkRecipeInformation?ids=${ids}`)
          .then(response => response.json())
          .then(bulkData => {
            if (Array.isArray(bulkData)) {
              const categorized = {};
              bulkData.forEach(recipe => {
                const formattedRecipe = {
                  id: recipe.id || 0,
                  title: recipe.title || "No Title",
                  imageUrl: recipe.image || placeholder_image,
                  dishTypes: recipe.dishTypes || [],
                  ingredients: recipe.extendedIngredients
                    ? recipe.extendedIngredients.map(ingredient => ingredient.name)
                    : []
                };
                
                recipe.dishTypes.forEach(type => {
                  if (!categorized[type]) {
                    categorized[type] = [];
                  }
                  categorized[type].push(formattedRecipe);
                });
              });
              setCategorizedRecipes(categorized);
            } else {
              console.error("Bulk API response is not an array:", bulkData);
            }
          })
          .catch(error => console.error('Error fetching bulk recipe information:', error));
      })
      .catch(error => console.error('Error fetching initial recipes:', error));
  }, []);

  return (
    <div className='px-[7%] pt-4 space-y-6'>
      <div>
        <p className='text-6xl font-semibold'>Recommendations</p>
      </div>
      <div className='flex flex-row'>
        <p className='w-full text-2xl font-semibold'>Our recommendations</p>
        <Link to="/" className='w-full h-auto flex flex-row justify-end py-2'>
          <p className='text-blue-400 hover:scale-[105%] hover:underline'>
            Go Back Home
          </p>
        </Link>
      </div>
      {Object.entries(categorizedRecipes).map(([dishType, recipes]) => (
        <div key={dishType} className='mb-6'>
          <p className='text-3xl font-semibold capitalize mb-4'>{dishType}</p>
          <div className='w-full h-96 flex flex-row items-center justify-between space-x-6 overflow-x-auto'>
            {recipes.map(recipe => (
              <RecommendationCardComponent key={recipe.id} {...recipe} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
