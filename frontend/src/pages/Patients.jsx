import React, { useState, useEffect } from 'react'
import { patientsAPI } from '../services/api'
import '../styles/Patients.css'

function Patients() {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    address: '',
    medical_history: '',
    allergies: ''
  })
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetchPatients()
  }, [])

  const fetchPatients = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await patientsAPI.getAll()
      setPatients(response.data)
    } catch (error) {
      console.error('Error fetching patients:', error)
      setError('Пациенттерді жүктеуде қате орын алды')
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
        await patientsAPI.update(editingId, formData)
        console.log('Пациент сәтті өндіктелді')
      } else {
        await patientsAPI.create(formData)
        console.log('Пациент сәтті құрылды')
      }
      resetForm()
      fetchPatients()
    } catch (error) {
      console.error('Error saving patient:', error)
      setError(error.response?.data?.detail || 'Пациентті сақтауда қате орын алды')
    }
  }

  const handleEdit = (patient) => {
    setEditingId(patient.id)
    setFormData({
      first_name: patient.first_name,
      last_name: patient.last_name,
      email: patient.email,
      phone: patient.phone,
      date_of_birth: patient.date_of_birth,
      address: patient.address,
      medical_history: patient.medical_history || '',
      allergies: patient.allergies || ''
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Осы пациентті өшіргіңіз келіп жатыр ма?')) {
      try {
        setError(null)
        await patientsAPI.delete(id)
        fetchPatients()
        console.log('Пациент сәтті өшірілді')
      } catch (error) {
        console.error('Error deleting patient:', error)
        setError('Пациентті өшіруде қате орын алды')
      }
    }
  }

  const resetForm = () => {
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      date_of_birth: '',
      address: '',
      medical_history: '',
      allergies: ''
    })
    setEditingId(null)
    setShowForm(false)
  }

  const filteredPatients = patients.filter(patient =>
    patient.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) return <div className="loading">Жүктеулілік...</div>

  return (
    <div className="patients-container">
      <h1>Пациенттер</h1>
      
      {error && <div className="error-message">❌ {error}</div>}
      
      <div className="controls">
        <input
          type="text"
          placeholder="Іздеу пациент аты немесе электронды пошта бойынша..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
        <button className="btn-primary" onClick={() => {
          resetForm()
          setShowForm(!showForm)
        }}>
          {showForm ? 'Бас тарту' : '➕ Пациент қосу'}
        </button>
      </div>

      {showForm && (
        <form className="patient-form" onSubmit={handleSubmit}>
          <h2>{editingId ? '✏️ Пациентті өндіктеу' : '➕ Жаңа пациент қосу'}</h2>
          <input
            type="text"
            name="first_name"
            placeholder="Аты *"
            value={formData.first_name}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="last_name"
            placeholder="Тәуық *"
            value={formData.last_name}
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
            type="date"
            name="date_of_birth"
            value={formData.date_of_birth}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="address"
            placeholder="Мекен-жайы *"
            value={formData.address}
            onChange={handleInputChange}
            required
          />
          <textarea
            name="medical_history"
            placeholder="Медициналық тарихы"
            value={formData.medical_history}
            onChange={handleInputChange}
          />
          <textarea
            name="allergies"
            placeholder="Аллергиялық реакциялар"
            value={formData.allergies}
            onChange={handleInputChange}
          />
          <div className="form-buttons">
            <button type="submit" className="btn-primary">
              {editingId ? '💾 Өндіктеуді сақтау' : '💾 Пациентті сақтау'}
            </button>
            <button type="button" className="btn-secondary" onClick={resetForm}>
              ❌ Бас тарту
            </button>
          </div>
        </form>
      )}

      <div className="patients-grid">
        {filteredPatients.length === 0 ? (
          <p className="no-data">Пациенттер табылмады</p>
        ) : (
          filteredPatients.map(patient => (
            <div key={patient.id} className="patient-card">
              <div className="card-header">
                <h3>{patient.first_name} {patient.last_name}</h3>
              </div>
              <p><strong>📧 Пошта:</strong> {patient.email}</p>
              <p><strong>📱 Телефон:</strong> {patient.phone}</p>
              <p><strong>🎂 Төрілген:</strong> {new Date(patient.date_of_birth).toLocaleDateString('kk-KZ')}</p>
              <p><strong>🏠 Мекен:</strong> {patient.address}</p>
              {patient.medical_history && <p><strong>🏥 Тарихы:</strong> {patient.medical_history}</p>}
              {patient.allergies && <p><strong>⚠️ Аллергия:</strong> {patient.allergies}</p>}
              <div className="card-actions">
                <button
                  className="btn-edit"
                  onClick={() => handleEdit(patient)}
                >
                  ✏️ Өндіктеу
                </button>
                <button
                  className="btn-danger"
                  onClick={() => handleDelete(patient.id)}
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

export default Patients
