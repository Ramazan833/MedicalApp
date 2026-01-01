import React, { useState, useEffect } from 'react'
import { doctorsAPI } from '../services/api'
import '../styles/Doctors.css'

function Doctors() {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    email: '',
    phone: '',
    license_number: '',
    bio: ''
  })
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetchDoctors()
  }, [])

  const fetchDoctors = async () => {
    try {
      const response = await doctorsAPI.getAll()
      setDoctors(response.data)
    } catch (error) {
      console.error('Error fetching doctors:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await doctorsAPI.create(formData)
      setFormData({
        name: '',
        specialization: '',
        email: '',
        phone: '',
        license_number: '',
        bio: ''
      })
      setShowForm(false)
      fetchDoctors()
    } catch (error) {
      console.error('Error creating doctor:', error)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await doctorsAPI.delete(id)
        fetchDoctors()
      } catch (error) {
        console.error('Error deleting doctor:', error)
      }
    }
  }

  if (loading) return <div className="loading">Жүктеулілік...</div>

  return (
    <div className="doctors-container">
      <h1>Дәрігерлер</h1>
      
      <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Бас тарту' : 'Дәрігер қосу'}
      </button>

      {showForm && (
        <form className="doctor-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Аты-жөні"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="specialization"
            placeholder="Мамандығы"
            value={formData.specialization}
            onChange={handleInputChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Электронды пошта"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Телефон"
            value={formData.phone}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="license_number"
            placeholder="Лицензия номері"
            value={formData.license_number}
            onChange={handleInputChange}
            required
          />
          <textarea
            name="bio"
            placeholder="Өмірбаяны"
            value={formData.bio}
            onChange={handleInputChange}
          />
          <button type="submit" className="btn-primary">Дәрігерді сақтау</button>
        </form>
      )}

      <div className="doctors-grid">
        {doctors.map(doctor => (
          <div key={doctor.id} className="doctor-card">
            <h3>{doctor.name}</h3>
            <p><strong>Мамандығы:</strong> {doctor.specialization}</p>
            <p><strong>Электронды пошта:</strong> {doctor.email}</p>
            <p><strong>Телефон:</strong> {doctor.phone}</p>
            <p><strong>Лицензия:</strong> {doctor.license_number}</p>
            {doctor.bio && <p><strong>Өмірбаяны:</strong> {doctor.bio}</p>}
            <button
              className="btn-danger"
              onClick={() => handleDelete(doctor.id)}
            >
              Өшіру
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Doctors
