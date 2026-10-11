import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg"></div>
              <h1 className="text-2xl font-bold gradient-text">Fwins Club</h1>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600 transition font-medium">Home</Link>
            <Link to="/about" className="text-gray-700 hover:text-blue-600 transition font-medium">About</Link>
            <Link to="/contact" className="text-gray-700 hover:text-blue-600 transition font-medium">Contact</Link>
            {user ? (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 transition font-medium">Dashboard</Link>
                {user.email === import.meta.env.VITE_ADMIN_EMAIL && (
                  <Link to="/admin" className="text-gray-700 hover:text-blue-600 transition font-medium">Admin</Link>
                )}
                <button onClick={handleLogout} className="btn-primary text-sm px-4 py-2">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-blue-600 transition font-medium">Login</Link>
                <Link to="/signup" className="btn-primary text-sm px-4 py-2">Join Now</Link>
              </>
            )}
          </div>
          
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700 focus:outline-none">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {isOpen && (
        <div className="md:hidden animate-slide-up">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            <Link to="/" className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium">Home</Link>
            <Link to="/about" className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium">About</Link>
            <Link to="/contact" className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium">Contact</Link>
            {user ? (
              <>
                <Link to="/dashboard" className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium">Dashboard</Link>
                {user.email === import.meta.env.VITE_ADMIN_EMAIL && (
                  <Link to="/admin" className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium">Admin</Link>
                )}
                <button onClick={handleLogout} className="block w-full text-left px-3 py-2 btn-primary text-center">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium">Login</Link>
                <Link to="/signup" className="block px-3 py-2 btn-primary text-center">Join Now</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}