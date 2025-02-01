import axios from "axios";
import { useEffect, useState } from "react";
import FridgeItemComponent from "../Components/FridgeItem";

type FridgeItem = {
    name: string;
    quantity: number;
    imageUrl: string;
};

type IngredientList = FridgeItem[];

const fetchFridgeIngredients = async (): Promise<IngredientList> => {
    try {
        const response = await axios.get<IngredientList>("http://localhost:5000/recipes/getFridge");
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
            <p className="text-2xl font-semibold mb-4">My Fridge</p>
            <div className="grid grid-cols-5 gap-4">
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