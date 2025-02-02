import { HashRouter, Routes, Route, BrowserRouter } from "react-router-dom";
import './App.css'
import Home from './Pages/Home';
import Layout from './Layout';
import CreateLobby from './Components/LobbyRoom';
import Recipe from './Pages/Recipe';
import Inventory from './Pages/Inventory';
import AddFridgeItemPopUp from './Pages/AddFridgeItem';
import DietaryForm from './Components/DietaryForm';
// import KitchenRoles from './Components/KitchenRoles';
import Recommendation from './Pages/Recommendation';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="my-fridge" element={<Inventory />} />
          <Route path="create" element={<CreateLobby />} />
          <Route path="add-fridge-item" element={<AddFridgeItemPopUp />} />
          <Route path="my-recipe/:id" element={<Recipe />} />
          <Route path="dietary-form/:lobbyId" element={<DietaryForm />} />
          {/* <Route path="roles" element={<KitchenRoles />} /> */}
          <Route path="recommendations" element={<Recommendation />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App