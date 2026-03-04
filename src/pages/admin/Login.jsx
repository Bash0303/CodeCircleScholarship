import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Header from '../../components/common/Header'
import Footer from '../../components/common/Footer'
import { Eye, EyeOff, Shield, Lock, ArrowLeft } from 'lucide-react'
import logo from '../../assets/logo.png'
import toast from 'react-hot-toast'

const AdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  })
  const { login } = useAuth() // Use the login function from AuthContext
  const navigate = useNavigate()

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Use the login function from AuthContext which now handles:
      // - API call to backend
      // - Storing user data
      // - Navigation based on role
      // - Toast messages
      await login(credentials.email || 'admin@codecircle.com', credentials.password)
    } catch (error) {
      console.error('Admin login error:', error)
      // Error is already handled in AuthContext
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 animate-fade-in">
          <div className="text-center">
            <Link 
              to="/" 
              className="inline-flex items-center text-gray-600 hover:text-primary-600 
                       transition-colors duration-200 mb-6"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </Link>
            
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 p-3 shadow-lg">
                <Shield className="w-full h-full text-white" />
              </div>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Admin Portal
            </h1>
            <p className="text-gray-600">
              Restricted access. Admin credentials required.
            </p>
          </div>

          <div className="card">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={credentials.email}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="admin@codecircle.com"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Default: admin@codecircle.com
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Access Code
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={credentials.password}
                    onChange={handleChange}
                    className="input-field pr-10"
                    placeholder="Enter admin access code"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Use the admin password provided in the requirements
                </p>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-primary bg-gray-900 hover:bg-gray-800 
                           flex items-center justify-center space-x-2 py-4"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5" />
                      <span>Access Admin Portal</span>
                    </>
                  )}
                </button>
              </div>

              <div className="text-center">
                <p className="text-gray-600 text-sm">
                  This portal is restricted to authorized administrators only.
                  Unauthorized access is prohibited.
                </p>
              </div>
            </form>
          </div>

          {/* Security Notice */}
          <div className="card bg-gradient-to-r from-gray-900 to-gray-800 text-white">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Lock className="w-5 h-5 mr-2" />
              Security Notice
            </h3>
            <ul className="text-sm text-white/90 space-y-2">
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-white mr-2 mt-1"></div>
                <span>Admin access is logged and monitored</span>
              </li>
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-white mr-2 mt-1"></div>
                <span>Do not share admin credentials</span>
              </li>
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-white mr-2 mt-1"></div>
                <span>All actions are recorded in audit logs</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}

export default AdminLogin