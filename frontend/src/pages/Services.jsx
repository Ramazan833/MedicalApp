import React, { useState, useEffect } from 'react'
import { servicesAPI } from '../services/api'
import '../styles/Services.css'

function Services() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [availableOnly, setAvailableOnly] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration_minutes: 30,
    is_available: true
  })
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await servicesAPI.getAll()
      setServices(response.data)
    } catch (error) {
      console.error('Error fetching services:', error)
      setError('Қызметтерді жүктеуде қате орын алды')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (name === 'price' || name === 'duration_minutes' ? parseFloat(value) : value)
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
        await servicesAPI.update(editingId, formData)
        console.log('Қызмет сәтті өндіктелді')
      } else {
        await servicesAPI.create(formData)
        console.log('Қызмет сәтті құрылды')
      }
      resetForm()
      fetchServices()
    } catch (error) {
      console.error('Error saving service:', error)
      setError(error.response?.data?.detail || 'Қызметті сақтауда қате орын алды')
    }
  }

  const handleEdit = (service) => {
    setEditingId(service.id)
    setFormData({
      name: service.name,
      description: service.description,
      price: service.price,
      duration_minutes: service.duration_minutes,
      is_available: service.is_available
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Осы қызметті өшіргіңіз келіп жатыр ма?')) {
      try {
        setError(null)
        await servicesAPI.delete(id)
        fetchServices()
        console.log('Қызмет сәтті өшірілді')
      } catch (error) {
        console.error('Error deleting service:', error)
        setError('Қызметті өшіруде қате орын алды')
      }
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      duration_minutes: 30,
      is_available: true
    })
    setEditingId(null)
    setShowForm(false)
  }

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesAvailability = !availableOnly || service.is_available
    return matchesSearch && matchesAvailability
  })

  if (loading) return <div className="loading">Жүктеулілік...</div>

  return (
    <div className="services-container">
      <h1>Медициналық қызметтер</h1>
      
      {error && <div className="error-message">❌ {error}</div>}
      
      <div className="controls">
        <input
          type="text"
          placeholder="Қызметтерді іздеу..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
        <label className="availability-filter">
          <input
            type="checkbox"
            checked={availableOnly}
            onChange={(e) => setAvailableOnly(e.target.checked)}
          />
          Тек қол жәндеген қызметтерді көрсету
        </label>
        <button className="btn-primary" onClick={() => {
          resetForm()
          setShowForm(!showForm)
        }}>
          {showForm ? 'Бас тарту' : '➕ Қызмет қосу'}
        </button>
      </div>

      {showForm && (
        <form className="service-form" onSubmit={handleSubmit}>
          <h2>{editingId ? '✏️ Қызметті өндіктеу' : '➕ Жаңа қызмет қосу'}</h2>
          <input
            type="text"
            name="name"
            placeholder="Қызметтің аты *"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          <textarea
            name="description"
            placeholder="Пікірлеме *"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
          <input
            type="number"
            name="price"
            placeholder="Басы (теңге) *"
            step="0.01"
            min="0"
            value={formData.price}
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
          <label className="availability-checkbox">
            <input
              type="checkbox"
              name="is_available"
              checked={formData.is_available}
              onChange={handleInputChange}
            />
            Қызмет қол жәндеген
          </label>
          <div className="form-buttons">
            <button type="submit" className="btn-primary">
              {editingId ? '💾 Өндіктеуді сақтау' : '💾 Қызметті сақтау'}
            </button>
            <button type="button" className="btn-secondary" onClick={resetForm}>
              ❌ Бас тарту
            </button>
          </div>
        </form>
      )}

      <div className="services-grid">
        {filteredServices.length === 0 ? (
          <p className="no-data">Қызметтер табылмады</p>
        ) : (
          filteredServices.map(service => (
            <div key={service.id} className="service-card">
              <div className="card-header">
                <h3>{service.name}</h3>
                <span className={`availability-badge ${service.is_available ? 'available' : 'unavailable'}`}>
                  {service.is_available ? '✅ Қол жәндеген' : '❌ Қол жәндемеген'}
                </span>
              </div>
              <p><strong>📝 Пікірлеме:</strong> {service.description}</p>
              <p><strong>💰 Басы:</strong> <span className="price">{service.price.toFixed(2)}</span> теңге</p>
              <p><strong>⏱️ Ұзақтығы:</strong> {service.duration_minutes} минут</p>
              <div className="card-actions">
                <button
                  className="btn-edit"
                  onClick={() => handleEdit(service)}
                >
                  ✏️ Өндіктеу
                </button>
                <button
                  className="btn-danger"
                  onClick={() => handleDelete(service.id)}
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

export default Services
