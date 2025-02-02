import { HashRouter, Routes, Route } from "react-router-dom";
import './App.css'
import Home from './Pages/Home';
import Layout from './Layout';
import CreateLobby from './Pages/CreateLobby';
import Recipe from './Pages/Recipe';
import Inventory from './Pages/Inventory';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/my-fridge" element={<Inventory />} />
          <Route path="/create" element={<CreateLobby />} />
          <Route path="/my-recipe/:id" element={<Recipe />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}

export default App