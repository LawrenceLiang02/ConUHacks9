import { useNavigate } from "react-router-dom";
import placeholder_image from "../assets/placeholder_food_image.png";

interface FridgeItemProps {
    name: string;
    key: number;
    quantity: number;
    imageUrl: string;
}

const FridgeItemComponent: React.FC<FridgeItemProps> = ({ name, quantity, imageUrl }) => {
    const handleDelete = async () => {
        try {
            const response = await fetch("http://localhost:5000/recipes/deleteFridgeItem", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ingredient: name }),
            });

            const data = await response.json();
            if (response.ok) {
                console.log("Deleted:", data);
                window.location.reload();
            } else {
                alert(data.error || "Error removing ingredient.");
            }
        } catch (error) {
            console.error("Error deleting ingredient:", error);
            alert("Failed to delete ingredient.");
        }
    };

    return (
        <div
            className="w-full h-45 rounded-lg shadow-2xl flex flex-row items-end bg-yellow-100 relative"
            style={{
                backgroundImage: `url(${imageUrl || placeholder_image})`, // Ensuring a valid URL
                opacity: 0.9,
                backgroundSize: "cover",
                backgroundPosition: "center"
            }}
        >

        <div onClick={handleDelete} className="absolute top-0 right-0 p-2 text-red-500 hover:text-red-600 hover:scale-[105%] ease-in-out duration-200 hover:cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" className="w-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
        </div>

        <div className="w-full bg-white py-2 rounded-b-lg">
            <p className="text-center text-lg font-semibold capitalize">
                {name}
            </p>

                <div className="capitalize flex flex-row items-center justify-center space-x-2">
                    <p>Quantity:</p>
                    
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-4">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                    </div>
                    
                    <p>{quantity}</p>
                    <div >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-4">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FridgeItemComponent;
