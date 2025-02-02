import axios from "axios";
import { useEffect, useState } from "react";
import FridgeItemComponent from "../Components/FridgeItem";
import { Link } from "react-router-dom";

type FridgeItem = {
    name: string;
    quantity: number;
    imageUrl: string;
};

type IngredientList = FridgeItem[];

const fetchFridgeIngredients = async (): Promise<IngredientList> => {
    try {
        const response = await axios.get<IngredientList>("http://localhost:5000/recipes/getFridgeItems");
        console.log(response.data)
        return response.data;
    } catch (error) {
        console.error("API Error:", error);
        return [];
    }
};

const Inventory: React.FC = () => {
    const [fridgeIngredients, setFridgeIngredients] = useState<IngredientList>([]);

    useEffect(() => {
        fetchFridgeIngredients().then(setFridgeIngredients);
    }, []);

    return (
        <div className="w-full min-h-screen px-[8%] pt-6">
            <div className="mb-4 flex flex-row justify-between">
                <p className="text-2xl font-semibold ">My Fridge</p>
                <div className="flex flex-row space-x-4">
                    <div className="px-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                            <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                        </svg>

                    </div>

                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                        </svg>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-5 gap-4">
                <Link to="/add-fridge-item">
                    <button className="w-full h-45 rounded-lg border-4 border-dashed border-gray-300 flex flex-row items-center justify-around text-gray-400 hover:scale-[102%] hover:cursor-pointer ease-in-out duration-300">
                        <p className="">Add an item</p>
                    </button>
                </Link>
                {fridgeIngredients.map((ingredient, index) => (
                    <FridgeItemComponent 
                        name={ingredient.name} 
                        quantity={ingredient.quantity} 
                        imageUrl={ingredient.imageUrl} 
                        key={index} 
                    />
                ))}
            </div>
        </div>
    );
};

export default Inventory;