import { createContext, useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import axios from 'axios'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // Get API URL from environment
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

  // Initialize from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedUser = localStorage.getItem('codecircle_user')
        const storedToken = localStorage.getItem('codecircle_token')
        
        console.log('Initializing auth - storedUser:', storedUser)
        console.log('Initializing auth - storedToken:', storedToken ? 'exists' : 'none')
        
        if (storedUser && storedToken) {
          const parsedUser = JSON.parse(storedUser)
          console.log('Parsed stored user:', parsedUser)
          setUser(parsedUser)
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
        localStorage.removeItem('codecircle_user')
        localStorage.removeItem('codecircle_token')
      } finally {
        setLoading(false)
        console.log('Auth initialization complete, loading:', false)
      }
    }

    initializeAuth()
  }, [])

  const login = async (email, password) => {
    console.log('Login attempt started for email:', email)
    setLoading(true)
    
    try {
      // Try admin login first
      console.log('Attempting admin login...')
      let adminResponse
      try {
        adminResponse = await axios.post(`${API_URL}/admin/login`, { email, password })
        console.log('Admin login response status:', adminResponse.status)
        console.log('Admin login response data:', adminResponse.data)

        // If admin login successful
        if (adminResponse.status === 200 && adminResponse.data?.success) {
          console.log('✅ Admin login successful!')
          
          const adminUser = {
            id: adminResponse.data.user.id,
            name: adminResponse.data.user.name,
            email: adminResponse.data.user.email,
            role: 'superadmin',
            isAdmin: true,
            ...adminResponse.data.user
          }
          
          console.log('Setting admin user:', adminUser)
          setUser(adminUser)
          
          console.log('Storing in localStorage...')
          localStorage.setItem('codecircle_user', JSON.stringify(adminUser))
          localStorage.setItem('codecircle_token', adminResponse.data.token)
          
          toast.success('Admin login successful')
          navigate('/admin/dashboard', { replace: true })
          return
        }
      } catch (adminError) {
        console.log('Admin login failed (expected for regular users):', adminError.response?.data?.message)
      }

      // Try candidate login
      console.log('Trying candidate login...')
      const userResponse = await axios.post(`${API_URL}/auth/login`, { email, password })

      console.log('Candidate login response status:', userResponse.status)
      console.log('Candidate login response data:', userResponse.data)

      if (userResponse.status === 200 && userResponse.data?.success) {
        console.log('✅ Candidate login successful!')
        
        const candidateUser = {
          ...userResponse.data.user,
          isAdmin: false,
          role: 'candidate'
        }

        console.log('Setting candidate user:', candidateUser)
        setUser(candidateUser)
        
        localStorage.setItem('codecircle_user', JSON.stringify(candidateUser))
        localStorage.setItem('codecircle_token', userResponse.data.token)
        
        toast.success('Login successful')
        navigate('/candidate/dashboard', { replace: true })
      } else {
        throw new Error(userResponse.data?.message || 'Login failed')
      }

    } catch (error) {
      console.error('❌ Login error:', error)
      console.error('Error response:', error.response?.data)
      toast.error(error.response?.data?.message || error.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
      console.log('Login process complete, loading set to false')
    }
  }

  const register = async (userData) => {
    console.log('Registration attempt for:', userData.email)
    
    try {
      setLoading(true)
      const response = await axios.post(`${API_URL}/auth/register`, userData)

      console.log('Registration response status:', response.status)
      console.log('Registration response data:', response.data)

      if (response.status === 201 && response.data?.success) {
        toast.success('Registration successful! You can now login.')
        navigate('/login')
        return response.data.user
      } else {
        throw new Error(response.data?.message || 'Registration failed')
      }
    } catch (error) {
      console.error('Registration error:', error)
      toast.error(error.response?.data?.message || error.message || 'Registration failed. Please try again.')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    console.log('Logging out user:', user?.email)
    setUser(null)
    localStorage.removeItem('codecircle_user')
    localStorage.removeItem('codecircle_token')
    toast.success('Logged out successfully')
    navigate('/login', { replace: true })
  }

  const updateUser = (updates) => {
    console.log('Updating user with:', updates)
    setUser(prev => {
      const updated = { ...prev, ...updates }
      localStorage.setItem('codecircle_user', JSON.stringify(updated))
      return updated
    })
  }

  console.log('AuthProvider state - user:', user, 'loading:', loading)

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      updateUser,
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  )
}