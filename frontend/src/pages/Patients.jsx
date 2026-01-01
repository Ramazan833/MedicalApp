import React, { useState, useEffect } from 'react'
import { patientsAPI } from '../services/api'
import '../styles/Patients.css'

function Patients() {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
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
      const response = await patientsAPI.getAll()
      setPatients(response.data)
    } catch (error) {
      console.error('Error fetching patients:', error)
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
      await patientsAPI.create(formData)
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
      setShowForm(false)
      fetchPatients()
    } catch (error) {
      console.error('Error creating patient:', error)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await patientsAPI.delete(id)
        fetchPatients()
      } catch (error) {
        console.error('Error deleting patient:', error)
      }
    }
  }

  if (loading) return <div className="loading">Жүктеулілік...</div>

  return (
    <div className="patients-container">
      <h1>Пациенттер</h1>
      
      <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Бас тарту' : 'Пациент қосу'}
      </button>

      {showForm && (
        <form className="patient-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="first_name"
            placeholder="Аты"
            value={formData.first_name}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="last_name"
            placeholder="Тәуық"
            value={formData.last_name}
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
            type="date"
            name="date_of_birth"
            value={formData.date_of_birth}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="address"
            placeholder="Мекен-жайы"
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
          <button type="submit" className="btn-primary">Пациентті сақтау</button>
        </form>
      )}

      <div className="patients-grid">
        {patients.map(patient => (
          <div key={patient.id} className="patient-card">
            <h3>{patient.first_name} {patient.last_name}</h3>
            <p><strong>Электронды пошта:</strong> {patient.email}</p>
            <p><strong>Телефон:</strong> {patient.phone}</p>
            <p><strong>Төрілген күні:</strong> {patient.date_of_birth}</p>
            <p><strong>Мекен-жайы:</strong> {patient.address}</p>
            {patient.medical_history && <p><strong>Медициналық тарихы:</strong> {patient.medical_history}</p>}
            {patient.allergies && <p><strong>Аллергиялық:</strong> {patient.allergies}</p>}
            <button
              className="btn-danger"
              onClick={() => handleDelete(patient.id)}
            >
              Өшіру
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Patients
