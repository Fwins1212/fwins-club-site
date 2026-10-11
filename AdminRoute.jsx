import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from './LoadingSpinner'

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth()
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL
  
  if (loading) return <LoadingSpinner />
  
  if (!user || user.email !== adminEmail) {
    return <Navigate to="/dashboard" />
  }
  
  return children
}