import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddFridgeItemPopUp: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        quantity: 1,
        imageUrl: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "quantity" ? parseInt(value, 10) || 1 : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await axios.post("http://localhost:5000/recipes/addFridgeItem", formData);
            setFormData({ name: "", quantity: 1, imageUrl: "" });
            navigate("/my-fridge");
        } catch (err) {
            setError("Failed to add item. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-white drop-shadow-lg rounded-lg">
            <h2 className="text-lg font-bold mb-4">Add a New Fridge Item</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="name"
                    placeholder="Item Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="border rounded px-3 py-2 w-full"
                />
                <input
                    type="number"
                    name="quantity"
                    placeholder="Quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    required
                    className="border rounded px-3 py-2 w-full"
                />
                {/* <input
                    type="text"
                    name="imageUrl"
                    placeholder="Image URL"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    className="border rounded px-3 py-2 w-full"
                /> */}
                {error && <p className="text-red-500">{error}</p>}
                <button
                    type="submit"
                    className="w-full px-4 py-2 bg-[#5ba47b] hover:bg-[#47b879] text-white rounded hover:scale-[105%] ease-in-out duration-200 hover:cursor-pointer"
                >
                    {loading ? "Adding..." : "Add Item"}
                </button>
            </form>
        </div>
    );
};

export default AddFridgeItemPopUp;
