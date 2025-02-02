import { useNavigate } from "react-router-dom";
import placeholder_image from "../assets/placeholder_food_image.png";

interface DiscountedItemProps {
    name: string;
    price: number;
    store: string;
    imageUrl: string;
}

const DiscountedItem: React.FC<DiscountedItemProps> = ({ name, price, store, imageUrl }) => {

    return (
        <div
            className="w-full h-45 rounded-lg shadow-lg flex flex-row items-end bg-yellow-100 relative z-20"
            style={{
                backgroundImage: `url(${imageUrl || placeholder_image})`, // Ensuring a valid URL
                opacity: 0.9,
                backgroundSize: "cover",
                backgroundPosition: "center"
            }}
        >

        <div className="w-full bg-white py-2 rounded-b-lg">
            <p className="text-center text-lg font-semibold capitalize">
                {name}
            </p>

                <div className="capitalize flex flex-row items-center justify-center space-x-2">
                    <p>Price:</p>
                    
                    <p className="text-red-500">${price}</p>
                </div>
            </div>
        </div>
    );
};

export default DiscountedItem;
