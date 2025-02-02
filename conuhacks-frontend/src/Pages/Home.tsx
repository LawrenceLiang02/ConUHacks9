import React, { useEffect, useState } from 'react';
import CardComponent from '../Components/CardCompoenent';
import { Link } from 'react-router-dom';
import placeholder_image from "../assets/placeholder_food_image.png";
import DiscountedItem from '../Components/DiscountedItem';
import DiscountSlider from '../Components/DiscountSlider';

export default function Home() {
    const [recipes, setRecipes] = useState([]);
    const [groceryDiscounts, setGroceryDiscounts] = useState({});

    useEffect(() => {
        // Fetch recipes from your Flask API
        fetch('http://localhost:5000/recipes/getRecipesFromIngredients')
            .then(response => response.json())
            .then(data => {
                console.log("API Response:", data); // Debug: Log the API response

                // Ensure the data is an array
                if (Array.isArray(data)) {
                    const mappedRecipes = data.map(recipe => ({
                        id: recipe.id || 0,
                        title: recipe.title || "No Title",
                        imageUrl: recipe.image || placeholder_image,
                        likes: recipe.likes || 0,
                        usedIngredients: recipe.usedIngredients ? recipe.usedIngredients.map(ingredient => ingredient.original) : [],
                        missingIngredients: recipe.missedIngredients ? recipe.missedIngredients.map(ingredient => ingredient.original) : [],
                        total_price: recipe.total_price || 0,
                        original_price: recipe.original_price || 0,
                    }));
                    console.log("Mapped Recipes:", mappedRecipes); // Debug: Log the mapped recipes
                    setRecipes(mappedRecipes);
                } else {
                    console.error("API response is not an array:", data);
                }
            })
            .catch(error => console.error('Error fetching recipes:', error));

         fetch('http://localhost:5000/recipes/groceries')
            .then(response => response.json())
            .then(data => {
                console.log("API Response (Groceries):", data);
                setGroceryDiscounts(data);
            })
            .catch(error => console.error('Error fetching grocery discounts:', error));
    }, []);

    return (
        <div className='px-[7%] pt-4 space-y-6'>
            <div className=''>
                <p className='text-6xl font-semibold'>Welcome Chef!</p>
            </div>

            <div className='flex flex-row'>
               <p className='w-full text-2xl font-semibold'>Our recommendations</p>

                <Link to="/recommendations" className='w-full h-auto flex flex-row justify-end py-2'>
                    <p className=' text-blue-400 hover:scale-[105%] hover:underline'>
                        More recipes
                    </p>
                </Link> 
            </div>
            

            <div className='w-full h-96 flex flex-row items-center justify-between space-x-6'>
                {recipes.map((recipe, index) => (
                    <CardComponent key={index} {...recipe} />
                ))}
            </div>

            <div className='pb-20'>
                <DiscountSlider groceryDiscounts={groceryDiscounts} />
            </div>

            
        </div>
    );
}