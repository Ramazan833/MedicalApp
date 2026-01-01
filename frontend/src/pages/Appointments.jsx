import React, { useState, useEffect } from 'react'
import { appointmentsAPI, doctorsAPI, patientsAPI } from '../services/api'
import '../styles/Appointments.css'

function Appointments() {
  const [appointments, setAppointments] = useState([])
  const [doctors, setDoctors] = useState([])
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [statusFilter, setStatusFilter] = useState('all')
  const [formData, setFormData] = useState({
    patient_id: '',
    doctor_id: '',
    appointment_date: '',
    duration_minutes: 30,
    status: 'scheduled',
    notes: ''
  })
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
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
      setError('Деректерді жүктеуде қате орын алды')
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
      setError(null)
      if (editingId) {
        await appointmentsAPI.update(editingId, formData)
        console.log('Тағайын сәтті өндіктелді')
      } else {
        await appointmentsAPI.create(formData)
        console.log('Тағайын сәтті құрылды')
      }
      resetForm()
      fetchData()
    } catch (error) {
      console.error('Error saving appointment:', error)
      setError(error.response?.data?.detail || 'Тағайынды сақтауда қате орын алды')
    }
  }

  const handleEdit = (appointment) => {
    setEditingId(appointment.id)
    setFormData({
      patient_id: appointment.patient_id,
      doctor_id: appointment.doctor_id,
      appointment_date: appointment.appointment_date,
      duration_minutes: appointment.duration_minutes,
      status: appointment.status,
      notes: appointment.notes || ''
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Осы тағайынды өшіргіңіз келіп жатыр ма?')) {
      try {
        setError(null)
        await appointmentsAPI.delete(id)
        fetchData()
        console.log('Тағайын сәтті өшірілді')
      } catch (error) {
        console.error('Error deleting appointment:', error)
        setError('Тағайынды өшіруде қате орын алды')
      }
    }
  }

  const resetForm = () => {
    setFormData({
      patient_id: '',
      doctor_id: '',
      appointment_date: '',
      duration_minutes: 30,
      status: 'scheduled',
      notes: ''
    })
    setEditingId(null)
    setShowForm(false)
  }

  const filteredAppointments = appointments.filter(apt =>
    statusFilter === 'all' || apt.status === statusFilter
  )

  if (loading) return <div className="loading">Жүктеулілік...</div>

  return (
    <div className="appointments-container">
      <h1>Тағайындаулар</h1>
      
      {error && <div className="error-message">❌ {error}</div>}
      
      <div className="controls">
        <select 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)}
          className="status-filter"
        >
          <option value="all">Барлық тағайындаулар</option>
          <option value="scheduled">Сәбепте</option>
          <option value="completed">Аяқталды</option>
          <option value="cancelled">Болдырылды</option>
        </select>
        <button className="btn-primary" onClick={() => {
          resetForm()
          setShowForm(!showForm)
        }}>
          {showForm ? 'Бас тарту' : '➕ Тағайын реттеу'}
        </button>
      </div>

      {showForm && (
        <form className="appointment-form" onSubmit={handleSubmit}>
          <h2>{editingId ? '✏️ Тағайынды өндіктеу' : '➕ Жаңа тағайын реттеу'}</h2>
          <select
            name="patient_id"
            value={formData.patient_id}
            onChange={handleInputChange}
            required
          >
            <option value="">Пациентті таңдау *</option>
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
            <option value="">Дәрігерді таңдау *</option>
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
            placeholder="Ұзақтығы (минут) *"
            min="15"
            step="15"
            value={formData.duration_minutes}
            onChange={handleInputChange}
            required
          />
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
          >
            <option value="scheduled">Сәбепте</option>
            <option value="completed">Аяқталды</option>
            <option value="cancelled">Болдырылды</option>
          </select>
          <textarea
            name="notes"
            placeholder="Ескертемелер"
            value={formData.notes}
            onChange={handleInputChange}
          />
          <div className="form-buttons">
            <button type="submit" className="btn-primary">
              {editingId ? '💾 Өндіктеуді сақтау' : '💾 Тағайынды сақтау'}
            </button>
            <button type="button" className="btn-secondary" onClick={resetForm}>
              ❌ Бас тарту
            </button>
          </div>
        </form>
      )}

      <div className="appointments-list">
        {filteredAppointments.length === 0 ? (
          <p className="no-data">Тағайындаулар табылмады</p>
        ) : (
          filteredAppointments.map(apt => {
            const doctor = doctors.find(d => d.id === apt.doctor_id)
            const patient = patients.find(p => p.id === apt.patient_id)
            const statusText = apt.status === 'scheduled' ? 'Сәбепте' : apt.status === 'completed' ? 'Аяқталды' : 'Болдырылды'
            return (
              <div key={apt.id} className="appointment-card">
                <div className="card-header">
                  <h3>Тағайын #{apt.id}</h3>
                  <span className={`status-badge status-${apt.status}`}>{statusText}</span>
                </div>
                <p><strong>👤 Пациент:</strong> {patient?.first_name} {patient?.last_name}</p>
                <p><strong>👨‍⚕️ Дәрігер:</strong> {doctor?.name} ({doctor?.specialization})</p>
                <p><strong>📅 Уақыты:</strong> {new Date(apt.appointment_date).toLocaleString('kk-KZ')}</p>
                <p><strong>⏱️ Ұзақтығы:</strong> {apt.duration_minutes} минут</p>
                {apt.notes && <p><strong>📝 Ескертемелер:</strong> {apt.notes}</p>}
                <div className="card-actions">
                  <button
                    className="btn-edit"
                    onClick={() => handleEdit(apt)}
                  >
                    ✏️ Өндіктеу
                  </button>
                  <button
                    className="btn-danger"
                    onClick={() => handleDelete(apt.id)}
                  >
                    🗑️ Өшіру
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default Appointments
