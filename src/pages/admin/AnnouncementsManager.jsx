import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

export default function AnnouncementsManager() {
  const [announcements, setAnnouncements] = useState([])
  const [editingAnnouncement, setEditingAnnouncement] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  })

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  const fetchAnnouncements = async () => {
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (!error && data) {
      setAnnouncements(data)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (editingAnnouncement) {
      const { error } = await supabase
        .from('announcements')
        .update(formData)
        .eq('id', editingAnnouncement.id)
      
      if (error) {
        toast.error('Failed to update announcement')
      } else {
        toast.success('Announcement updated successfully')
        setEditingAnnouncement(null)
        fetchAnnouncements()
        resetForm()
      }
    } else {
      const { error } = await supabase
        .from('announcements')
        .insert([formData])
      
      if (error) {
        toast.error('Failed to create announcement')
      } else {
        toast.success('Announcement created successfully')
        fetchAnnouncements()
        resetForm()
      }
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      const { error } = await supabase
        .from('announcements')
        .delete()
        .eq('id', id)
      
      if (error) {
        toast.error('Failed to delete announcement')
      } else {
        toast.success('Announcement deleted successfully')
        fetchAnnouncements()
      }
    }
  }

  const handleEdit = (announcement) => {
    setEditingAnnouncement(announcement)
    setFormData({
      title: announcement.title,
      content: announcement.content
    })
  }

  const resetForm = () => {
    setFormData({
      title: '',
      content: ''
    })
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="mb-8 bg-gray-50 p-6 rounded-lg">
        <h3 className="text-xl font-bold mb-4 gradient-text">
          {editingAnnouncement ? 'Edit Announcement' : 'Post Announcement'}
        </h3>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Announcement Title"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="input-field"
          />
          <textarea
            placeholder="Announcement Content"
            required
            rows="4"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="input-field"
          />
        </div>
        <div className="flex gap-2 mt-4">
          <button type="submit" className="btn-primary">
            {editingAnnouncement ? 'Update Announcement' : 'Post Announcement'}
          </button>
          {editingAnnouncement && (
            <button type="button" onClick={resetForm} className="btn-secondary">
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="space-y-4">
        <h3 className="text-xl font-bold gradient-text">Manage Announcements</h3>
        {announcements.map((announcement) => (
          <div key={announcement.id} className="border rounded-lg p-4 hover:shadow-md transition">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-semibold text-lg">{announcement.title}</h4>
                <p className="text-gray-600 mt-1">{announcement.content}</p>
                <p className="text-xs text-gray-400 mt-2">
                  Posted: {new Date(announcement.created_at).toLocaleString()}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(announcement)}
                  className="text-blue-600 hover:text-blue-700"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(announcement.id)}
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