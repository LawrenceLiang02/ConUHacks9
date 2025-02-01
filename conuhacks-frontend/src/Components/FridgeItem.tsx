import placeholder_image from "../assets/placeholder_food_image.png";

interface FridgeItemProps {
    name: string;
    key: number;
    quantity: number;
    imageUrl: string;
}

const FridgeItemComponent: React.FC<FridgeItemProps> = ({ name, quantity, imageUrl }) => {
    console.log("Image URL:", imageUrl);

    return (
        <div
            className="w-full h-45 rounded-lg shadow-2xl flex flex-row items-end bg-yellow-100"
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

                <p className="text-center capitalize">Quantity: {quantity}</p>
            </div>
        </div>
    );
};

export default FridgeItemComponent;
