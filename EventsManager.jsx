import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

export default function EventsManager() {
  const [events, setEvents] = useState([])
  const [editingEvent, setEditingEvent] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: ''
  })

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true })
    
    if (!error && data) {
      setEvents(data)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (editingEvent) {
      const { error } = await supabase
        .from('events')
        .update(formData)
        .eq('id', editingEvent.id)
      
      if (error) {
        toast.error('Failed to update event')
      } else {
        toast.success('Event updated successfully')
        setEditingEvent(null)
        fetchEvents()
        resetForm()
      }
    } else {
      const { error } = await supabase
        .from('events')
        .insert([formData])
      
      if (error) {
        toast.error('Failed to create event')
      } else {
        toast.success('Event created successfully')
        fetchEvents()
        resetForm()
      }
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id)
      
      if (error) {
        toast.error('Failed to delete event')
      } else {
        toast.success('Event deleted successfully')
        fetchEvents()
      }
    }
  }

  const handleEdit = (event) => {
    setEditingEvent(event)
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date.slice(0, 16),
      location: event.location || ''
    })
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      date: '',
      location: ''
    })
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="mb-8 bg-gray-50 p-6 rounded-lg">
        <h3 className="text-xl font-bold mb-4 gradient-text">
          {editingEvent ? 'Edit Event' : 'Create New Event'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Event Title"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="input-field"
          />
          <input
            type="datetime-local"
            required
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="input-field"
          />
          <input
            type="text"
            placeholder="Location (optional)"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="input-field"
          />
          <textarea
            placeholder="Description"
            required
            rows="3"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="input-field col-span-full"
          />
        </div>
        <div className="flex gap-2 mt-4">
          <button type="submit" className="btn-primary">
            {editingEvent ? 'Update Event' : 'Create Event'}
          </button>
          {editingEvent && (
            <button type="button" onClick={resetForm} className="btn-secondary">
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="space-y-4">
        <h3 className="text-xl font-bold gradient-text">Manage Events</h3>
        {events.map((event) => (
          <div key={event.id} className="border rounded-lg p-4 hover:shadow-md transition">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-semibold text-lg">{event.title}</h4>
                <p className="text-gray-600 mt-1">{event.description}</p>
                <div className="flex items-center mt-2 text-sm text-gray-500">
                  <span>📅 {new Date(event.date).toLocaleString()}</span>
                  {event.location && <span className="ml-4">📍 {event.location}</span>}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(event)}
                  className="text-blue-600 hover:text-blue-700"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(event.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}