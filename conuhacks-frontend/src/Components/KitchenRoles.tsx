import React, { useState } from "react";
import { ChefHat, Coffee, Utensils, Soup, Pizza, Fish, Star, ChevronLeft, ChevronRight } from "lucide-react";

const KitchenRoles = () => {
  const [startIndex, setStartIndex] = useState(0);

  const roles = [
    {
      title: "Head Chef",
      icon: ChefHat,
      description: "The kitchen maestro! Creates amazing dishes and runs the show.",
      specialties: ["Secret Recipes", "Magic Sauces", "Perfect Seasoning"],
      powerLevel: 5,
    },
    {
      title: "Sous Chef",
      icon: Utensils,
      description: "Right-hand kitchen ninja and master of all trades.",
      specialties: ["Quick Chopping", "Taste Testing", "Kitchen Magic"],
      powerLevel: 4,
    },
    {
      title: "Pastry Chef",
      icon: Coffee,
      description: "Sweet treats wizard and dessert mastermind.",
      specialties: ["Cookie Magic", "Cake Artistry", "Sugar Spells"],
      powerLevel: 4,
    },
    {
      title: "Saucier",
      icon: Soup,
      description: "Sauce sorcerer who makes everything delicious.",
      specialties: ["Flavor Bombs", "Secret Ingredients", "Tasty Potions"],
      powerLevel: 3,
    },
    {
      title: "Grill Chef",
      icon: Pizza,
      description: "Master of flames and searing perfection.",
      specialties: ["Fire Control", "Grill Marks", "Smoke Master"],
      powerLevel: 3,
    },
    {
      title: "Fish Chef",
      icon: Fish,
      description: "Seafood specialist and fish whisperer.",
      specialties: ["Ocean Magic", "Fresh Catches", "Scale Skills"],
      powerLevel: 3,
    },
  ];

  const nextSlide = () => {
    setStartIndex((prev) => Math.min(prev + 1, roles.length - 3));
  };

  const prevSlide = () => {
    setStartIndex((prev) => Math.max(prev - 1, 0));
  };

  const visibleRoles = roles.slice(startIndex, startIndex + 3);

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-50 p-8 perspective">
      <div className="relative max-w-6xl max-h-l">
        {/* Navigation Buttons */}
        <button 
          onClick={prevSlide}
          disabled={startIndex === 0}
          className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 z-10 p-3 rounded-full 
                     transition-all duration-300 ${startIndex === 0 
                     ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                     : 'bg-white text-gray-800 shadow-lg hover:bg-gray-50'}`}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button 
          onClick={nextSlide}
          disabled={startIndex >= roles.length - 3}
          className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 z-10 p-3 rounded-full 
                     transition-all duration-300 ${startIndex >= roles.length - 3 
                     ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                     : 'bg-white text-gray-800 shadow-lg hover:bg-gray-50'}`}
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Cards Container */}
        <div className="flex gap-6 transition-all duration-500 ease-in-out">
          {visibleRoles.map((role, index) => {
            const Icon = role.icon;
            return (
              <div
                key={role.title}
                className="w-[400px] transform-gpu animate-float"
              >
                <div 
                  className="bg-white shadow-xl rounded-xl overflow-hidden h-[600px] flex flex-col
                           transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl
                           preserve-3d"
                >
                  {/* Colorful Top Banner */}
                  <div className="h-2 bg-gradient-to-r from-indigo-400 to-purple-500" />

                  <div className="p-8 flex flex-col card-content">
                    {/* Header with Icon & Power Level */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="p-4 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg shadow-sm">
                        <Icon className="w-12 h-12 text-indigo-600" />
                      </div>
                      <div className="flex">
                        {[...Array(role.powerLevel)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 text-yellow-400" />
                        ))}
                      </div>
                    </div>

                    {/* Title & Description */}
                    <div className="mb-8">
                      <h3 className="font-bold text-2xl text-gray-800 mb-3">
                        {role.title}
                      </h3>
                      <p className="text-base text-gray-600">{role.description}</p>
                    </div>

                    {/* Specialties */}
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {role.specialties.map((specialty) => (
                        <span
                          key={specialty}
                          className="text-sm px-4 py-2 rounded-full bg-indigo-100 text-indigo-600 font-medium
                                   transform transition-all duration-300 hover:scale-105 hover:shadow-md"
                        >
                          ✨ {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: roles.length - 2 }).map((_, index) => (
            <button
              key={index}
              onClick={() => setStartIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                startIndex === index
                  ? "bg-indigo-600 w-4"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>

      <style jsx global>{`
        .perspective {
          perspective: 2000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
          backface-visibility: hidden;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateZ(0); }
          50% { transform: translateY(-10px) translateZ(20px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
          animation-delay: calc(var(--index) * 0.2s);
        }
        .card-content {
          transform: translateZ(20px);
        }
      `}</style>
    </div>
  );
};

export default KitchenRoles;