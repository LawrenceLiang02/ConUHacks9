import { useState } from "react";
import placeholder_image from "../assets/placeholder_food_image.png";
import Recipe from "../Pages/Recipe";
import { Link, useNavigate } from 'react-router-dom';

interface Recipe {
    id: number;
    title: string;
    imageUrl: string;
    ingredients: string[];
    dishTypes: string[];
}

function RecommendationCardComponent({ id, title, imageUrl, dishTypes, ingredients }: Recipe) {
    const [isChecked, setIsChecked] = useState(false);
    const navigate = useNavigate();

    // Limit ingredients to first 4
    const displayedIngredients = ingredients.slice(0, 4);

    return (
        <div className="w-full h-44 lg:h-full z-20 group perspective ease-in-out duration-200">
            <div 
                className={`w-full h-full relative [transform-style:preserve-3d] duration-1000 ${isChecked ? '[transform:rotateY(180deg)]' : ''} hover:cursor-pointer `}
                onClick={() => navigate(`/my-recipe/${id}`)}
            >
                <div
                    onMouseEnter={() => setIsChecked(true)}
                    className="absolute w-full h-full [backface-visibility:hidden] bg-white rounded-2xl flex flex-col justify-around items-end shadow-lg ease-in-out duration-200"
                >
                    <div
                        style={{
                            backgroundImage: `url(${imageUrl || placeholder_image})`,
                            opacity: 0.9,
                            backgroundSize: "cover",
                            backgroundPosition: "center"
                        }}
                        className="w-full h-2/3 bg-blue-100 rounded-t-lg">
                    </div>
                    <div className="w-full h-auto flex flex-col items-start shadow-t-lg px-4 py-3 space-y-2">
                        <div className="card-text card-text-shadow">{title}</div>
                    </div>
                </div>
                <div
                    onMouseLeave={() => setIsChecked(false)}
                    className="absolute w-full h-full [backface-visibility:hidden] bg-[#5ba47b] [transform:rotateY(180deg)] rounded-2xl flex flex-col justify-center items-center shadow-lg p-6"
                >
                    <div className='w-full h-full flex flex-col items-start justify-between w-full h-full space-y-2'>
                        <div>
                            <div className="card-text text-lg">{title}</div>
                            <div className="text-sm">
                                <p className="card-text">Ingredients:</p>
                                <ul className="list-disc px-4">
                                    {displayedIngredients.map((ingredient, index) => (
                                        <li key={index}>{ingredient}</li>
                                    ))}
                                    {ingredients.length > 5 && (
                                        <li className="italic">...and {ingredients.length - 5} more</li>
                                    )}
                                </ul>
                            </div>
                        </div>

                        <div className="w-full flex flex-row justify-around w-full">
                            <Link to={`/my-recipe/${id}`} className="text-center w-1/2 hover:scale-[105%] ease-in-out duration-200 hover:underline px-1">
                                Recipe
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RecommendationCardComponent;