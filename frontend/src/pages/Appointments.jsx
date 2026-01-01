import React, { useState, useEffect } from 'react'
import { appointmentsAPI, doctorsAPI, patientsAPI } from '../services/api'
import '../styles/Appointments.css'

function Appointments() {
  const [appointments, setAppointments] = useState([])
  const [doctors, setDoctors] = useState([])
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    patient_id: '',
    doctor_id: '',
    appointment_date: '',
    duration_minutes: 30,
    notes: ''
  })
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [appRes, docRes, patRes] = await Promise.all([
        appointmentsAPI.getAll(),
        doctorsAPI.getAll(),
        patientsAPI.getAll()
      ])
      setAppointments(appRes.data)
      setDoctors(docRes.data)
      setPatients(patRes.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'duration_minutes' ? parseInt(value) : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await appointmentsAPI.create(formData)
      setFormData({
        patient_id: '',
        doctor_id: '',
        appointment_date: '',
        duration_minutes: 30,
        notes: ''
      })
      setShowForm(false)
      fetchData()
    } catch (error) {
      console.error('Error creating appointment:', error)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await appointmentsAPI.delete(id)
        fetchData()
      } catch (error) {
        console.error('Error deleting appointment:', error)
      }
    }
  }

  if (loading) return <div className="loading">Жүктеулілік...</div>

  return (
    <div className="appointments-container">
      <h1>Тағайындаулар</h1>
      
      <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Бас тарту' : 'Тағайын реттеу'}
      </button>

      {showForm && (
        <form className="appointment-form" onSubmit={handleSubmit}>
          <select
            name="patient_id"
            value={formData.patient_id}
            onChange={handleInputChange}
            required
          >
            <option value="">Пациентті таңдау</option>
            {patients.map(p => (
              <option key={p.id} value={p.id}>
                {p.first_name} {p.last_name}
              </option>
            ))}
          </select>
          <select
            name="doctor_id"
            value={formData.doctor_id}
            onChange={handleInputChange}
            required
          >
            <option value="">Дәрігерді таңдау</option>
            {doctors.map(d => (
              <option key={d.id} value={d.id}>
                {d.name} - {d.specialization}
              </option>
            ))}
          </select>
          <input
            type="datetime-local"
            name="appointment_date"
            value={formData.appointment_date}
            onChange={handleInputChange}
            required
          />
          <input
            type="number"
            name="duration_minutes"
            placeholder="Ұзақтығы (минут)"
            value={formData.duration_minutes}
            onChange={handleInputChange}
          />
          <textarea
            name="notes"
            placeholder="Ескертемелер"
            value={formData.notes}
            onChange={handleInputChange}
          />
          <button type="submit" className="btn-primary">Тағайын реттеу</button>
        </form>
      )}

      <div className="appointments-list">
        {appointments.map(apt => {
          const doctor = doctors.find(d => d.id === apt.doctor_id)
          const patient = patients.find(p => p.id === apt.patient_id)
          return (
            <div key={apt.id} className="appointment-card">
              <h3>Тағайын #{apt.id}</h3>
              <p><strong>Пациент:</strong> {patient?.first_name} {patient?.last_name}</p>
              <p><strong>Дәрігер:</strong> {doctor?.name}</p>
              <p><strong>Тарихы:</strong> {new Date(apt.appointment_date).toLocaleString('kk-KZ')}</p>
              <p><strong>Ұзақтығы:</strong> {apt.duration_minutes} минут</p>
              <p><strong>Ләкі:</strong> <span className={`status-${apt.status}`}>{apt.status === 'scheduled' ? 'Сәбепте' : apt.status === 'completed' ? 'Аяқталды' : 'Болдырылды'}</span></p>
              {apt.notes && <p><strong>Ескертемелер:</strong> {apt.notes}</p>}
              <button
                className="btn-danger"
                onClick={() => handleDelete(apt.id)}
              >
                Өшіру
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Appointments
