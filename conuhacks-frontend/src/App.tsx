import { HashRouter, Routes, Route } from "react-router-dom";
import './App.css'
import Home from './Pages/Home';
import Layout from './Layout';
import CreateLobby from './Components/LobbyRoom';
import Recipe from './Pages/Recipe';
import Inventory from './Pages/Inventory';
import AddFridgeItemPopUp from './Pages/AddFridgeItem';
import DietaryForm from './Components/DietaryForm';
import KitchenRoles from './Components/KitchenRoles';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="my-fridge" element={<Inventory />} />
          <Route path="create" element={<CreateLobby />} />
          <Route path="add-fridge-item" element={<AddFridgeItemPopUp />} />
          <Route path="my-recipe/:id" element={<Recipe />} />
          <Route path="dietary-form/:lobbyId" element={<DietaryForm />} />
          <Route path="roles" element={<KitchenRoles />} />

        </Route>
      </Routes>
    </HashRouter>
  )
}

export default App