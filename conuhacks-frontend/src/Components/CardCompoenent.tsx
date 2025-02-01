import { useState } from "react";
import placeholder_image from "../assets/placeholder_food_image.png";

interface Recipe {
    id: number;
    title: string;
    imageUrl: string;
    likes: number;
    usedIngredients: string[];
    missingIngredients: string[];
}

function CardComponent({ id, title, imageUrl, likes, usedIngredients, missingIngredients }: Recipe) {
    const [isChecked, setIsChecked] = useState(false);

    return (
        <div className="w-full h-44 lg:h-full z-20 group perspective ease-in-out duration-200">
            <div 
                className={`w-full h-full relative [transform-style:preserve-3d] duration-1000 ${isChecked ? '[transform:rotateY(180deg)]' : ''} hover:cursor-pointer `} 
                >
                <div
                onMouseEnter={() => setIsChecked(true)}
                className="absolute w-full h-full [backface-visibility:hidden] bg-white rounded-2xl flex flex-col justify-around items-end shadow-lg ease-in-out duration-200">
                    <div
                        style={{
                        backgroundImage: `url(${imageUrl || placeholder_image})`,
                        opacity: 0.9,
                        backgroundSize: "cover",
                        backgroundPosition: "center"}}
                        className="w-full h-2/3 bg-blue-100 rounded-t-lg">
                    </div>
                    <div className="w-full h-auto flex flex-col items-start shadow-t-lg px-4 py-3">
                        <div className="card-text card-text-shadow">{title}</div>
                        <div className="card-text card-text-shadow">Time: 10 min</div>
                        <div className="card-text card-text-shadow">Reviews | Rating </div>
                    </div>
                </div>
                <div
                onMouseLeave={() => setIsChecked(false)}
                className="absolute w-full h-full [backface-visibility:hidden] bg-[#5ba47b] [transform:rotateY(180deg)] rounded-2xl flex flex-col justify-center items-center shadow-lg p-6">
                <div className='flex flex-col items-start w-full h-full space-y-2'>
                    <div className="card-text text-lg">{title}</div>
                    <div className="text-sm">
                        <p><strong>Prep time:</strong> 10 min</p>
                        <p><strong>Cook time:</strong> 10 min</p>
                        <p><strong>Total time:</strong> 20 min</p>
                    </div>
                    <div className="text-sm">
                        <p className="card-text">Used Ingredients:</p>
                        <ul className="list-disc px-4">
                            {usedIngredients.map((ingredient, index) => (
                                <li key={index}>{ingredient}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="text-sm">
                        <p className="card-text">Missing Ingredients:</p>
                        <ul className="list-disc px-4">
                            {missingIngredients.map((ingredient, index) => (
                                <li key={index}>{ingredient}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex flex-row justify-around w-full ">
                        <a href="/create" className="hover:scale-[105%] ease-in-out duration-200 hover:underline px-1">Recipe</a>
                        <a className="flex flex-row justify-between border-l px-1">
                            <p>{likes}</p>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                            </svg>
                        </a>
                        <a href="/create" className="hover:scale-[105%] ease-in-out duration-200 hover:underline px-1 border-l">Reviews</a>
                    </div>
                </div>
                </div>
            </div>
        </div>
    );
}

export default CardComponent;