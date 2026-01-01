import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import Home from './pages/Home'
import Doctors from './pages/Doctors'
import Appointments from './pages/Appointments'
import Patients from './pages/Patients'
import Services from './pages/Services'
import './styles/App.css'

function App() {
  return (
    <BrowserRouter>
      <Navigation />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/services" element={<Services />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App
