import React, { useState } from "react";
import { motion } from "framer-motion";

const segments = ["🍕 Pizza", "🍔 Burger", "🍣 Sushi", "🥗 Salad", "🌮 Taco", "🍩 Donut", "🍜 Ramen", "🍎 Apple"];

const getRandomRotation = () => {
  const rounds = Math.floor(Math.random() * 3) + 6; // 6 to 8 full spins
  const randomAngle = Math.floor(Math.random() * 45); // Random stopping angle
  return rounds * 360 + randomAngle;
};

const colors = [
  "#F28D35", // Pizza (Orange)
  "#6E4B3A", // Burger (Brown)
  "#2E8B57", // Sushi (Green)
  "#76C7A1", // Salad (Light Green)
  "#F1A92E", // Taco (Yellow-Orange)
  "#FAD02C", // Donut (Yellow)
  "#8D8D8D", // Ramen (Gray)
  "#D3F8E2", // Apple (Light Green)
];

const Roulette = () => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState("");

  const spinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    const newRotation = rotation + getRandomRotation();
    setRotation(newRotation);

    setTimeout(() => {
      const stoppingAngle = newRotation % 360;
      const selectedIndex = Math.floor(stoppingAngle / 45);
      setResult(segments[selectedIndex]);
      setIsSpinning(false);
    }, 5000); // Match animation duration
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative w-64 h-64 flex items-center justify-center">
        <motion.div
          animate={{ rotate: rotation }}
          transition={{ duration: 5, ease: "easeOut" }} // Slows down gradually
          className="w-full h-full rounded-full border-4 border-gray-900 flex items-center justify-center shadow-xl"
        >
          <div
            className="w-56 h-56 rounded-full flex flex-col justify-center items-center text-lg font-bold"
            style={{
              background: `conic-gradient(${colors[0]} 0deg 45deg, ${colors[1]} 45deg 90deg, ${colors[2]} 90deg 135deg, ${colors[3]} 135deg 180deg, ${colors[4]} 180deg 225deg, ${colors[5]} 225deg 270deg, ${colors[6]} 270deg 315deg, ${colors[7]} 315deg 360deg)`,
            }}
          >
            🎰 Spin Me!
          </div>
        </motion.div>
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-red-600 rounded-full border-2 border-white"></div>
      </div>
      <button
        onClick={spinWheel}
        disabled={isSpinning}
        className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-md disabled:bg-gray-400"
      >
        {isSpinning ? "Spinning..." : "Spin 🎲"}
      </button>
      {result && <p className="text-lg font-semibold text-gray-800">Result: {result}</p>}
    </div>
  );
};

export default Roulette;
