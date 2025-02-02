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
                            <div className="w-1/2 flex flex-row items-center justify-center border-l-2 px-1 space-x-2">
                                <p className="">Test</p>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RecommendationCardComponent;