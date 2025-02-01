import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import Home from './Pages/Home';
import Layout from './Layout';
import CreateLobby from './Pages/CreateLobby';
import Inventory from './Pages/Inventory';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="my-fridge" element={<Inventory />} />
          <Route path="create" element={<CreateLobby />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
