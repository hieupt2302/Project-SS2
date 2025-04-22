import { useState } from 'react'
// import './App.css'
import LoginPage from './pages/logInPage'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';
import './index.css'

function App() {

  return (
    <>
      {/* <LoginPage /> */}
      <BrowserRouter>
        <Routes>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
