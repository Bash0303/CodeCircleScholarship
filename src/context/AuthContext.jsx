import { createContext, useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

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
      const adminResponse = await fetch('http://localhost:5000/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      console.log('Admin login response status:', adminResponse.status)
      const adminData = await adminResponse.json()
      console.log('Admin login response data:', adminData)

      // If admin login successful
      if (adminResponse.ok && adminData.success) {
        console.log('✅ Admin login successful!')
        
        const adminUser = {
          id: adminData.user.id,
          name: adminData.user.name,
          email: adminData.user.email,
          role: 'superadmin',
          isAdmin: true,
          ...adminData.user
        }
        
        console.log('Setting admin user:', adminUser)
        setUser(adminUser)
        
        console.log('Storing in localStorage...')
        localStorage.setItem('codecircle_user', JSON.stringify(adminUser))
        localStorage.setItem('codecircle_token', adminData.token)
        
        console.log('Verifying localStorage after set:')
        console.log('- stored user:', localStorage.getItem('codecircle_user'))
        console.log('- stored token:', localStorage.getItem('codecircle_token') ? 'exists' : 'none')
        
        toast.success('Admin login successful')
        console.log('Navigating to /admin/dashboard...')
        navigate('/admin/dashboard', { replace: true })
        return
      }

      console.log('Admin login failed, trying candidate login...')
      
      // If admin login fails, try candidate login
      const userResponse = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      console.log('Candidate login response status:', userResponse.status)
      const userData = await userResponse.json()
      console.log('Candidate login response data:', userData)

      if (!userResponse.ok || !userData.success) {
        throw new Error(userData.message || 'Login failed')
      }

      console.log('✅ Candidate login successful!')
      
      const candidateUser = {
        ...userData.user,
        isAdmin: false,
        role: 'candidate'
      }

      console.log('Setting candidate user:', candidateUser)
      setUser(candidateUser)
      
      localStorage.setItem('codecircle_user', JSON.stringify(candidateUser))
      localStorage.setItem('codecircle_token', userData.token)
      
      toast.success('Login successful')
      console.log('Navigating to /candidate/dashboard...')
      navigate('/candidate/dashboard', { replace: true })

    } catch (error) {
      console.error('❌ Login error:', error)
      toast.error(error.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
      console.log('Login process complete, loading set to false')
    }
  }

  const register = async (userData) => {
    console.log('Registration attempt for:', userData.email)
    
    try {
      setLoading(true)
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      })

      console.log('Registration response status:', response.status)
      const result = await response.json()
      console.log('Registration response data:', result)

      if (!response.ok) {
        throw new Error(result.message || 'Registration failed')
      }

      if (result.success) {
        toast.success('Registration successful! You can now login.')
        navigate('/login')
        return result.user
      }
    } catch (error) {
      console.error('Registration error:', error)
      toast.error(error.message || 'Registration failed. Please try again.')
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

  // ADD THIS FUNCTION - Update user in state and localStorage
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
      updateUser, // ADD THIS LINE
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  )
}