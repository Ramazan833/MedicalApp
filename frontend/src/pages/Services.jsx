import React, { useState, useEffect } from 'react'
import { servicesAPI } from '../services/api'
import '../styles/Services.css'

function Services() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration_minutes: 30
  })
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const response = await servicesAPI.getAll()
      setServices(response.data)
    } catch (error) {
      console.error('Error fetching services:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'duration_minutes' ? parseFloat(value) : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await servicesAPI.create(formData)
      setFormData({
        name: '',
        description: '',
        price: '',
        duration_minutes: 30
      })
      setShowForm(false)
      fetchServices()
    } catch (error) {
      console.error('Error creating service:', error)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await servicesAPI.delete(id)
        fetchServices()
      } catch (error) {
        console.error('Error deleting service:', error)
      }
    }
  }

  if (loading) return <div className="loading">Жүктеулілік...</div>

  return (
    <div className="services-container">
      <h1>Медициналық қызметтер</h1>
      
      <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Бас тарту' : 'Қызмет қосу'}
      </button>

      {showForm && (
        <form className="service-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Қызметтің аты"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          <textarea
            name="description"
            placeholder="Пікірлеме"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
          <input
            type="number"
            name="price"
            placeholder="Басы"
            step="0.01"
            value={formData.price}
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
          <button type="submit" className="btn-primary">Қызметті сақтау</button>
        </form>
      )}

      <div className="services-grid">
        {services.map(service => (
          <div key={service.id} className="service-card">
            <h3>{service.name}</h3>
            <p><strong>Пікірлеме:</strong> {service.description}</p>
            <p><strong>Басы:</strong> {service.price.toFixed(2)} теңге</p>
            <p><strong>Ұзақтығы:</strong> {service.duration_minutes} минут</p>
            <p><strong>Ләкі:</strong> {service.is_available ? '✅ қол жәндеді' : '❌ болғаны ұзақ'}</p>
            <button
              className="btn-danger"
              onClick={() => handleDelete(service.id)}
            >
              Өшіру
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Services
