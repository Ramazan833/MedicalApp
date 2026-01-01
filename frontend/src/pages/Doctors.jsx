import React, { useState, useEffect } from 'react'
import { doctorsAPI } from '../services/api'
import '../styles/Doctors.css'

function Doctors() {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    email: '',
    phone: '',
    license_number: '',
    bio: ''
  })
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchDoctors()
  }, [])

  const fetchDoctors = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await doctorsAPI.getAll()
      setDoctors(response.data)
    } catch (error) {
      console.error('Error fetching doctors:', error)
      setError('Дәрігерлерді жүктеуде қате орын алды')
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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setError(null)
      if (editingId) {
        // Update
        await doctorsAPI.update(editingId, formData)
        console.log('Дәрігер сәтті өндіктелді')
      } else {
        // Create
        await doctorsAPI.create(formData)
        console.log('Дәрігер сәтті құрылды')
      }
      
      resetForm()
      fetchDoctors()
    } catch (error) {
      console.error('Error saving doctor:', error)
      setError(error.response?.data?.detail || 'Дәрігерді сақтауда қате орын алды')
    }
  }

  const handleEdit = (doctor) => {
    setEditingId(doctor.id)
    setFormData({
      name: doctor.name,
      specialization: doctor.specialization,
      email: doctor.email,
      phone: doctor.phone,
      license_number: doctor.license_number,
      bio: doctor.bio || ''
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Осы дәрігерді өшіргіңіз келіп жатыр ма?')) {
      try {
        setError(null)
        await doctorsAPI.delete(id)
        fetchDoctors()
        console.log('Дәрігер сәтті өшірілді')
      } catch (error) {
        console.error('Error deleting doctor:', error)
        setError('Дәрігерді өшіруде қате орын алды')
      }
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      specialization: '',
      email: '',
      phone: '',
      license_number: '',
      bio: ''
    })
    setEditingId(null)
    setShowForm(false)
  }

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) return <div className="loading">Жүктеулілік...</div>

  return (
    <div className="doctors-container">
      <h1>Дәрігерлер</h1>
      
      {error && <div className="error-message">❌ {error}</div>}
      
      <div className="controls">
        <input
          type="text"
          placeholder="Іздеу дәрігер аты немесе мамандығы бойынша..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
        <button className="btn-primary" onClick={() => {
          resetForm()
          setShowForm(!showForm)
        }}>
          {showForm ? 'Бас тарту' : '➕ Дәрігер қосу'}
        </button>
      </div>

      {showForm && (
        <form className="doctor-form" onSubmit={handleSubmit}>
          <h2>{editingId ? '✏️ Дәрігерді өндіктеу' : '➕ Жаңа дәрігер қосу'}</h2>
          <input
            type="text"
            name="name"
            placeholder="Аты-жөні *"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="specialization"
            placeholder="Мамандығы *"
            value={formData.specialization}
            onChange={handleInputChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Электронды пошта *"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Телефон *"
            value={formData.phone}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="license_number"
            placeholder="Лицензия номері *"
            value={formData.license_number}
            onChange={handleInputChange}
            required
          />
          <textarea
            name="bio"
            placeholder="Өмірбаяны (сөзсіз емес)"
            value={formData.bio}
            onChange={handleInputChange}
          />
          <div className="form-buttons">
            <button type="submit" className="btn-primary">
              {editingId ? '💾 Өндіктеуді сақтау' : '💾 Дәрігерді сақтау'}
            </button>
            <button type="button" className="btn-secondary" onClick={resetForm}>
              ❌ Бас тарту
            </button>
          </div>
        </form>
      )}

      <div className="doctors-grid">
        {filteredDoctors.length === 0 ? (
          <p className="no-data">Дәрігерлер табылмады</p>
        ) : (
          filteredDoctors.map(doctor => (
            <div key={doctor.id} className="doctor-card">
              <div className="card-header">
                <h3>{doctor.name}</h3>
                <span className="specialty-badge">{doctor.specialization}</span>
              </div>
              <p><strong>📧 Пошта:</strong> {doctor.email}</p>
              <p><strong>📱 Телефон:</strong> {doctor.phone}</p>
              <p><strong>🆔 Лицензия:</strong> {doctor.license_number}</p>
              {doctor.bio && <p><strong>📝 Мәлімет:</strong> {doctor.bio}</p>}
              <div className="card-actions">
                <button
                  className="btn-edit"
                  onClick={() => handleEdit(doctor)}
                >
                  ✏️ Өндіктеу
                </button>
                <button
                  className="btn-danger"
                  onClick={() => handleDelete(doctor.id)}
                >
                  🗑️ Өшіру
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Doctors
