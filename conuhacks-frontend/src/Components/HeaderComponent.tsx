import { Link } from "react-router-dom";
import logo from "../assets/we_cook_logo.png";

function HeaderComponent() {
  return (
    <div className="w-full h-auto relative">
      <div className=" absolute top-0 left-0 py-4 px-8">
        <Link to="/" className="">
          <button className="button-default flex flex-row items-center justfiy-between">
            <img src={logo} alt="Button Icon" className="w-18" />
            <p className="px-8 text-2xl font-bold capitalize text-white">Let us cook</p>
          </button>
        </Link>
      </div>

      <div className="flex flex-row justify-end bg-[#5ba47b] px-14 py-6 space-x-12">
        <Link to="/" className="">
          <button className="button-default bg-white py-2 px-8 rounded-lg shadow-lg">
            <p className="uppercase font-semibold text-lg">Join Lobby</p>
          </button>
        </Link>

        <Link to="/create" className="">
          <button className="button-default bg-white py-2 px-8 rounded-lg shadow-lg">
            <p className="uppercase font-semibold text-lg">Create Lobby</p>
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

      </div>
    </div>
  )
}

export default HeaderComponent