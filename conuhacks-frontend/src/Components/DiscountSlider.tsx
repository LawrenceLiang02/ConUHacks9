import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import DiscountedItem from "./DiscountedItem";
import { useNavigate } from "react-router-dom";

const DiscountSlider = ({ groceryDiscounts }) => {
    const navigate = useNavigate();
    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 6,  // Adjust visible items
        slidesToScroll: 6,
        autoplay: true,
        autoplaySpeed: 10000,
        arrows: true,  // Enables navigation arrows
        dotsClass: "slick-dots slick-thumb", // Custom dot styling
        centerMode: false, // Ensures spacing between items
        focusOnSelect: false,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3, // Adjusts for tablet view
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2, // Adjusts for mobile
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1, // Adjusts for small screens
                }
            }
        ]
    };

    return (
        <div>
            <div className="w-full flex flex-row justify-between">
                <p className='text-2xl font-semibold'>On discount</p>
                <button onClick={() => navigate("/flyers")} className="text-blue-500 hover:scale-[105%] hover:underline hover:cursor-pointer">View More</button>
            </div>
            

            {Object.entries(groceryDiscounts).map(([store, discounts]) => (
                <div key={store} className=''>
                    <p className='text-4xl font-bold py-4 text-red-500 italic'>{store.toUpperCase()}</p>
                    <Slider {...settings}>
                        {discounts.length > 0 ? (
                            discounts.map((discount, index) => (
                                <div key={index} className="px-4">
                                    <DiscountedItem 
                                        store={store} 
                                        price={discount.price} 
                                        name={discount.name} 
                                        imageUrl={discount.imageUrl || ''} 
                                    />
                                </div>
                            ))
                        ) : (
                            <p className='text-gray-500'>No discounts available</p>
                        )}
                    </Slider>
                </div>
            ))}
        </div>
    );
};

export default DiscountSlider;
