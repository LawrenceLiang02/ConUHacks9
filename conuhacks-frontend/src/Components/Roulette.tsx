import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";  // Import useParams
import { motion } from "framer-motion";
import RecommendationCardComponent from "./RecommendationCardComponent";

const getRandomRotation = () => {
  const rounds = Math.floor(Math.random() * 3) + 6;
  const randomAngle = Math.floor(Math.random() * 45);
  return rounds * 360 + randomAngle;
};

const colors = [
  "#F28D35", "#6E4B3A", "#2E8B57", "#76C7A1",
  "#F1A92E", "#FAD02C", "#8D8D8D", "#D3F8E2",
];

const Roulette = () => {
  const { lobbyId } = useParams();  // Get lobbyId from the URL
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [restrictions, setRestrictions] = useState(new Set());

  useEffect(() => {
    if (!lobbyId) return;

    fetch(`http://localhost:5000/get-participants/${lobbyId}`)
      .then(response => response.json())
      .then(data => {
        if (!data.participants) return;

        const allRestrictions = new Set();
        data.participants.forEach(participant => {
          participant.allergies?.forEach(allergy => allRestrictions.add(allergy.toLowerCase()));
          participant.dietaryRestrictions?.forEach(restriction => allRestrictions.add(restriction.toLowerCase()));
        });

        setRestrictions(allRestrictions);
      })
      .catch(error => console.error("Error fetching participants:", error));
  }, [lobbyId]);

  useEffect(() => {
    fetch("http://localhost:5000/recipes/getRecipesFromIngredientsForRecommendations")
      .then(response => response.json())
      .then(initialData => {
        const recipesData = Array.isArray(initialData) ? initialData : initialData.results || [];
        const ids = recipesData.map(recipe => recipe.id).join(",");

        if (!ids) {
          console.error("No recipe IDs found in initial data");
          return;
        }

        fetch(`http://localhost:5000/recipes/getBulkRecipeInformation?ids=${ids}`)
          .then(response => response.json())
          .then(bulkData => {
            if (Array.isArray(bulkData)) {
              const mainCourseRecipes = bulkData.filter(recipe =>
                recipe.dishTypes?.includes("main course")
              );

              const filteredRecipes = mainCourseRecipes.filter(recipe =>
                !recipe.extendedIngredients?.some(ingredient =>
                  restrictions.has(ingredient.name.toLowerCase())
                )
              );

              setRecipes(filteredRecipes.map(recipe => ({
                id: recipe.id || 0,
                title: recipe.title || "No Title",
                imageUrl: recipe.image || "placeholder_image",
                dishTypes: recipe.dishTypes || [],
                ingredients: recipe.extendedIngredients
                  ? recipe.extendedIngredients.map(ing => ing.name)
                  : []
              })));
            } else {
              console.error("Bulk API response is not an array:", bulkData);
            }
          })
          .catch(error => console.error("Error fetching bulk recipe information:", error));
      })
      .catch(error => console.error("Error fetching initial recipes:", error));
  }, [restrictions]);

  const spinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    const newRotation = rotation + getRandomRotation();
    setRotation(newRotation);

    setTimeout(() => {
      if (recipes.length > 0) {
        const randomRecipe = recipes[Math.floor(Math.random() * recipes.length)];
        setResult(randomRecipe);
      }
      setIsSpinning(false);
    }, 5000);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative w-64 h-64 flex items-center justify-center">
        <motion.div
          animate={{ rotate: rotation }}
          transition={{ duration: 5, ease: "easeOut" }}
          className="w-full h-full rounded-full border-4 border-gray-900 flex items-center justify-center shadow-xl"
        >
          <div
            className="w-56 h-56 rounded-full flex flex-col justify-center items-center text-lg font-bold"
            style={{
              background: `conic-gradient(${colors[0]} 0deg 45deg, ${colors[1]} 45deg 90deg, ${colors[2]} 90deg 135deg, ${colors[3]} 135deg 180deg, ${colors[4]} 180deg 225deg, ${colors[5]} 225deg 270deg, ${colors[6]} 270deg 315deg, ${colors[7]} 315deg 360deg)`,
            }}
          >
            🎰 Spin Me!
          </div>
        </motion.div>
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-red-600 rounded-full border-2 border-white"></div>
      </div>
      <button
        onClick={spinWheel}
        disabled={isSpinning || recipes.length === 0}
        className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-md disabled:bg-gray-400"
      >
        {isSpinning ? "Spinning..." : "Spin 🎲"}
      </button>
      {result && (
        <div className="result-container">
          <p className="text-2xl font-semibold">Your Meal:</p>
          <RecommendationCardComponent {...result} />
        </div>
      )}
    </div>
  );
};

export default Roulette;
