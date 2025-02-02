import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Import useParams
import axios from "axios";
import { ChefHat, Coffee, Utensils, Soup, Pizza, Fish, Star, ChevronLeft, ChevronRight } from "lucide-react";

const KitchenRoles = () => {
  const { lobbyId } = useParams(); 
  const [startIndex, setStartIndex] = useState(0);
  const [roles, setRoles] = useState<any[]>([]); 

  // Random descriptions and power levels
  const randomDescriptions = [
    "The kitchen maestro! Creates amazing dishes and runs the show.",
    "Right-hand kitchen ninja and master of all trades.",
    "Sweet treats wizard and dessert mastermind.",
    "Sauce sorcerer who makes everything delicious.",
    "Master of flames and searing perfection.",
    "Seafood specialist and fish whisperer.",
  ];

  const fetchParticipants = async () => {
    if (!lobbyId) return; 
    try {
      const response = await axios.get(`http://localhost:5000/get-participants/${lobbyId}`);
      const participants = response.data.participants;

      const rolesData = participants.map((participant: any) => ({
        title: participant.name || "Unknown Chef",
        icon: getIconForRole(participant),
        description: randomDescriptions[Math.floor(Math.random() * randomDescriptions.length)],
        specialties: participant.specialties || ["Mystery Skill"],
        allergies: participant.allergies || ["None"],
        dietaryRestrictions: participant.dietaryRestrictions || ["None"],
        powerLevel: Math.floor(Math.random() * 5) + 1, 
      }));

      setRoles(rolesData);
    } catch (error) {
      console.error("Failed to fetch participants", error);
    }
  };

  useEffect(() => {
    fetchParticipants();
  }, [lobbyId]); 

  const nextSlide = () => {
    setStartIndex((prev) => Math.min(prev + 1, roles.length - 3));
  };

  const prevSlide = () => {
    setStartIndex((prev) => Math.max(prev - 1, 0));
  };

  const visibleRoles = roles.slice(startIndex, startIndex + 3);

  const getIconForRole = (participant: any) => {
    if (participant.role === "Head Chef") return ChefHat;
    if (participant.role === "Sous Chef") return Utensils;
    if (participant.role === "Pastry Chef") return Coffee;
    if (participant.role === "Saucier") return Soup;
    if (participant.role === "Grill Chef") return Pizza;
    return Fish; 
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-white p-8 perspective">
      <h1 className="z-20 -top-90 -left-30 relative text-5xl font-serif">The Team</h1>
      <div className="relative max-w-6xl max-h-l">
        <button
          onClick={prevSlide}
          disabled={startIndex === 0}
          className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-20 z-10 p-3 rounded-full cursor-pointer
                    transition-all duration-300 ${startIndex === 0
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-800 shadow-lg hover:bg-gray-50"}`}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={nextSlide}
          disabled={startIndex >= roles.length - 3}
          className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-20 z-10 p-3 rounded-full cursor-pointer
                    transition-all duration-300 ${startIndex >= roles.length - 3
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-800 shadow-lg hover:bg-gray-50"}`}
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        <div className="flex gap-6 transition-all duration-500 ease-in-out">
          {visibleRoles.map((role, index) => {
            const Icon = role.icon;
            return (
              <div key={role.title} className="w-[400px] transform-gpu animate-float">
                <div
                  className="bg-white shadow-xl rounded-xl overflow-hidden h-[600px] flex flex-col
                           transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl
                           preserve-3d"
                >

                  <div className="h-2 bg-gradient-to-r from-indigo-400 to-purple-500" />

                  <div className="p-8 flex flex-col card-content">
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

                    <div className="mb-8">
                      <h3 className="font-bold text-2xl text-gray-800 mb-3">{role.title}</h3>
                      <p className="text-base text-gray-600">{role.description}</p>
                    </div>

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
                      {role.allergies.map((allergy) => (
                        <span key={allergy} className="text-sm px-4 py-2 rounded-full bg-red-100 text-red-600 font-medium">
                          🚨 {allergy}
                        </span>
                      ))}
                      {role.dietaryRestrictions.map((restriction) => (
                        <span key={restriction} className="text-sm px-4 py-2 rounded-full bg-yellow-100 text-yellow-600 font-medium">
                          ⚠️ {restriction}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default KitchenRoles;
