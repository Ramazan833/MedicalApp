import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/Navigation.css'

function Navigation() {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          🏥 Медициналық орталық
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-link">Басты бет</Link>
          </li>
          <li className="nav-item">
            <Link to="/doctors" className="nav-link">Дәрігерлер</Link>
          </li>
          <li className="nav-item">
            <Link to="/patients" className="nav-link">Пациенттер</Link>
          </li>
          <li className="nav-item">
            <Link to="/appointments" className="nav-link">Тағайындаулар</Link>
          </li>
          <li className="nav-item">
            <Link to="/services" className="nav-link">Қызметтер</Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navigation
