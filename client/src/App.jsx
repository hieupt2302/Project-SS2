import { useState } from 'react'
// import './App.css'
import LoginPage from './pages/logInPage'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';
import './index.css'
import Navbar from './components/Navbar';
import Home from './pages/Home';
import RecipeDetail from './components/RecipeDetail';

function App() {

  return (
    <>
      {/* <LoginPage /> */}
      <BrowserRouter>
      <Navbar/>
        <Routes>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/home" element={<Home />} />
          <Route path="/recipes/:id" element={<RecipeDetail />} />
        </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
