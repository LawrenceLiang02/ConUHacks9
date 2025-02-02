import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
  const { lobbyId } = useParams();
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [restrictions, setRestrictions] = useState(new Set());
  const [allergyList, setAllergyList] = useState<string[]>([]);
  const [dietaryList, setDietaryList] = useState<string[]>([]);

  useEffect(() => {
    if (!lobbyId) return;

    fetch(`http://localhost:5000/get-participants/${lobbyId}`)
      .then(response => response.json())
      .then(data => {
        if (!data.participants) return;

        const allRestrictions = new Set();
        const allergies: string[] = [];
        const dietaryRestrictions: string[] = [];

        data.participants.forEach(participant => {
          participant.allergies?.forEach(allergy => {
            const formattedAllergy = allergy.toLowerCase();
            if (!allRestrictions.has(formattedAllergy)) {
              allergies.push(allergy);
            }
            allRestrictions.add(formattedAllergy);
          });

          participant.dietaryRestrictions?.forEach(restriction => {
            const formattedRestriction = restriction.toLowerCase();
            if (!allRestrictions.has(formattedRestriction)) {
              dietaryRestrictions.push(restriction);
            }
            allRestrictions.add(formattedRestriction);
          });
        });

        setRestrictions(allRestrictions);
        setAllergyList(allergies);
        setDietaryList(dietaryRestrictions);
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
            if (!Array.isArray(bulkData)) {
              console.error("Bulk API response is not an array:", bulkData);
              return;
            }

            const formattedRestrictions = new Set([...restrictions].map(r => r.toLowerCase()));

            const filteredRecipes = bulkData.filter(recipe => {
              if (!recipe.dishTypes?.includes("main course")) return false;

              const recipeTitle = recipe.title.toLowerCase();
              // Ensure the title does not contain any restrictions
              if ([...formattedRestrictions].some(restriction => recipeTitle.includes(restriction))) return false;

              // Ensure no ingredient matches any restriction
              return !recipe.extendedIngredients?.some(ingredient =>
                formattedRestrictions.has(ingredient.name.toLowerCase())
              );
            });

            setRecipes(filteredRecipes.map(recipe => ({
              id: recipe.id || 0,
              title: recipe.title || "No Title",
              imageUrl: recipe.image || "placeholder_image",
              dishTypes: recipe.dishTypes || [],
              ingredients: recipe.extendedIngredients
                ? recipe.extendedIngredients.map(ing => ing.name)
                : []
            })));
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
    <div className="flex flex-col items-center space-y-6 p-6 bg-gradient-to-b from-purple-100 via-indigo-50 to-pink-100 min-h-screen">
      <div className="flex flex-row items-start space-x-12 w-full max-w-7xl mx-auto">
        {/* 🎯 Sidebar for Allergies & Dietary Restrictions */}
        <div className="w-1/3 bg-white p-6 rounded-lg shadow-lg border border-gray-300">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">⚠️ Restrictions</h2>
          <ul className="space-y-3 text-sm text-gray-600">
            {allergyList.length > 0 && (
              <div>
                <h3 className="font-medium text-red-600">Allergies:</h3>
                {allergyList.map((allergy, idx) => (
                  <li key={idx} className="ml-4">- {allergy}</li>
                ))}
              </div>
            )}
            {dietaryList.length > 0 && (
              <div>
                <h3 className="font-medium text-blue-600">Dietary Restrictions:</h3>
                {dietaryList.map((restriction, idx) => (
                  <li key={idx} className="ml-4">- {restriction}</li>
                ))}
              </div>
            )}
          </ul>
        </div>

        {/* 🎡 Roulette Wheel */}
        <div className="relative w-80 h-80 flex items-center justify-center">
          <motion.div
            animate={{ rotate: rotation }}
            transition={{ duration: 5, ease: "easeOut" }}
            className="w-full h-full rounded-full border-8 border-gray-900 flex items-center justify-center shadow-xl"
          >
            <div
              className="w-72 h-72 rounded-full flex flex-col justify-center items-center text-lg font-bold text-white"
              style={{
                background: `conic-gradient(${colors[0]} 0deg 45deg, ${colors[1]} 45deg 90deg, ${colors[2]} 90deg 135deg, ${colors[3]} 135deg 180deg, ${colors[4]} 180deg 225deg, ${colors[5]} 225deg 270deg, ${colors[6]} 270deg 315deg, ${colors[7]} 315deg 360deg)`,
              }}
            >
              🎰 Spin Me!
            </div>
          </motion.div>
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-red-600 rounded-full border-2 border-white"></div>
        </div>
      </div>

      {/* 🎲 Spin Button */}
      <button
        onClick={spinWheel}
        disabled={isSpinning || recipes.length === 0}
        className="bg-indigo-600 text-white text-lg px-8 py-4 rounded-full shadow-lg transition duration-300 hover:bg-indigo-700 disabled:bg-gray-400"
      >
        {isSpinning ? "Spinning..." : "Spin 🎲"}
      </button>

      {/* 🍽️ Recommended Recipe */}
      {result && (
        <div className="mt-8 w-full max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          <p className="text-2xl font-semibold text-gray-800 mb-4">Your Meal:</p>
          <RecommendationCardComponent {...result} />
        </div>
      )}
    </div>
  );
};

export default Roulette;
