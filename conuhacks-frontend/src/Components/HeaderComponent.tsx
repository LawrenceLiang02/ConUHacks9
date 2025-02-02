import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/we_cook_logo.png";

function HeaderComponent() {
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [lobbyCode, setLobbyCode] = useState('');
  const navigate = useNavigate();

  const handleLobbyCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (lobbyCode) {
      navigate(`/dietary-form/${lobbyCode}`);
      setIsInputVisible(false); // Hide the input field after form submission
      setLobbyCode(''); // Optionally, reset the input field
    }
  };

  return (
    <div className="w-full h-auto relative">
      <div className="absolute top-0 left-0 py-4 px-8">
        <Link to="/" className="">
          <button className="button-default flex flex-row items-center justify-between">
            <img src={logo} alt="Button Icon" className="w-18" />
            <p className="px-8 text-2xl font-bold capitalize text-white">Let us cook</p>
          </button>
        </Link>
      </div>

      <div className="flex flex-row justify-end bg-[#5ba47b] px-14 py-6 space-x-12">
        {!isInputVisible ? (
          <button
            className="button-default bg-white py-2 px-8 rounded-lg shadow-lg"
            onClick={() => setIsInputVisible(true)} // Show input field when button is clicked
          >
            <p className="uppercase font-semibold text-lg">Join Party</p>
          </button>
        ) : (
          <form onSubmit={handleLobbyCodeSubmit} className="flex items-center">
            <input
              type="text"
              placeholder="Enter Lobby Code"
              value={lobbyCode}
              onChange={(e) => setLobbyCode(e.target.value)}
              className="py-2 px-4 rounded-lg mr-4"
            />
            <button type="submit" className="button-default bg-white py-2 px-8 rounded-lg shadow-lg">
              <p className="uppercase font-semibold text-lg">Submit</p>
            </button>
          </form>
        )}

        <Link to="/create" className="">
          <button className="button-default bg-white py-2 px-8 rounded-lg shadow-lg">
            <p className="uppercase font-semibold text-lg">Create Party</p>
          </button>
        </Link>
      </div>

      <div className="flex flex-row justify-center bg-white shadow-lg z-15 space-x-16">
        <Link to="/recommendations" className="">
          <button className="button-default py-2 px-2">
            <p className="uppercase font-semibold text-md">Recommendations</p>
          </button>
        </Link>

        <Link to="/" className="">
          <button className="button-default py-2 px-2">
            <p className="uppercase font-semibold text-md">Browse</p>
          </button>
        </Link>

        <Link to="/my-fridge" className="">
          <button className="button-default py-2 px-2">
            <p className="uppercase font-semibold text-md">My Fridge</p>
          </button>
        </Link>

        <Link to="/flyers" className="">
          <button className="button-default py-2 px-2">
            <p className="uppercase font-semibold text-md">Flyers</p>
          </button>
        </Link>

      </div>
    </div>
  );
}

export default HeaderComponent;
