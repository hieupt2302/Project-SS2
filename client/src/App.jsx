import { useState } from 'react'
// import './App.css'
import LoginPage from './pages/logInPage'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';
import './index.css'
import Navbar from './components/Navbar';
import Home from './pages/Home';
import RecipeDetail from './components/RecipeDetail';
import CreateRecipe from './pages/CreateRecipe';
import AuthPage from './pages/AuthPage';
import UserDashboard from './pages/UserDashboard';

function App() {

  return (
    <>
      {/* <LoginPage /> */}
      <BrowserRouter>
      <Navbar/>
        <Routes>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/home" element={<Home />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/create" element={<CreateRecipe />} />
          <Route path="/recipes/:id" element={<RecipeDetail />} />
        </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
