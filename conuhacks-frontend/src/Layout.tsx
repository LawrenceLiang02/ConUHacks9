import { Outlet, Link } from "react-router-dom";
import HeaderComponent from "./Components/HeaderComponent";

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <HeaderComponent></HeaderComponent>

      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
