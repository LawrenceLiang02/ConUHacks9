import { useEffect, useState } from "react";
import DiscountedItem from "../Components/DiscountedItem";

function Discounts() {
    const [groceryDiscounts, setGroceryDiscounts] = useState({});

    useEffect(() => {
         fetch('http://localhost:5000/recipes/groceries')
            .then(response => response.json())
            .then(data => {
                console.log("API Response (Groceries):", data);
                setGroceryDiscounts(data);
            })
            .catch(error => console.error('Error fetching grocery discounts:', error));
    }, []);
  return (
    <div className='px-20'>
        <div>
            <p className='w-full text-2xl font-semibold'>On discount</p>
            
            {Object.entries(groceryDiscounts).map(([store, discounts]) => (
                <div key={store} className='mt-4'>
                    <p className='text-4xl font-bold py-4 text-red-500 italic'>{store.toUpperCase()}</p>
                    <div className="grid grid-cols-8 gap-4">
                        {discounts.length > 0 ? (
                            discounts.map((discount, index) => (
                                <DiscountedItem store={store} price={discount.price} name={discount.name} imageUrl={''}></DiscountedItem>
                            ))
                        ) : (
                            <p className='text-gray-500'>No discounts available</p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    </div>

  )
}

export default Discounts