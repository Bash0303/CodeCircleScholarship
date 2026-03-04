import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useAuth } from '../context/AuthContext'
import Header from '../components/common/Header'
import Footer from '../components/common/Footer'
import { Eye, EyeOff, LogIn, ArrowLeft, Clock, Award, AlertCircle } from 'lucide-react' // Removed Shield
import logo from '../assets/logo.png'

const schema = yup.object({
  email: yup.string().email('Please enter a valid email').required('Email is required'),
  password: yup.string().required('Password is required')
})

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  })

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    
    try {
      await login(data.email, data.password)
    } catch (error) {
      console.error('Login error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // REMOVED handleAdminLogin function

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-8 md:py-12">
        <div className="container-responsive">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Left Side - Login Form */}
              <div className="animate-slide-in">
                <div className="mb-8">
                  <Link 
                    to="/" 
                    className="inline-flex items-center text-gray-600 hover:text-primary-600 
                             transition-colors duration-200 mb-6"
                  >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Home
                  </Link>
                  
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 rounded-xl bg-white p-2 shadow-lg mr-4">
                      <img src={logo} alt="CodeCircle Logo" className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900">Candidate Login</h1>
                      <p className="text-gray-600">Sign in to your scholarship account</p>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        {...register('email')}
                        className={`input-field ${errors.email ? 'input-error' : ''}`}
                        placeholder="Enter your registered email"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          {...register('password')}
                          className={`input-field ${errors.password ? 'input-error' : ''} pr-10`}
                          placeholder="Enter your password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        <Link 
                          to="/forgot-password" 
                          className="text-primary-600 hover:text-primary-700 font-medium"
                        >
                          Forgot your password?
                        </Link>
                      </div>
                    </div>

                    <div>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full btn-primary flex items-center justify-center space-x-2 py-4"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Signing in...</span>
                          </>
                        ) : (
                          <>
                            <LogIn className="w-5 h-5" />
                            <span>Sign In</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="text-center">
                      <p className="text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
                          Apply for scholarship
                        </Link>
                      </p>
                    </div>

                    {/* REMOVED the Admin Login Button section */}
                  </form>
                </div>
              </div>

              {/* Right Side - Info Panel */}
              <div className="space-y-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                {/* Test Info */}
                <div className="card bg-gradient-to-br from-primary-600 to-primary-800 text-white">
                  <h3 className="text-xl font-semibold mb-6 flex items-center text-white/90">
                    <Award className="w-6 h-6 mr-3" />
                    Scholarship Test Information
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <Clock className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Duration</p>
                        <p className="text-white/80 text-sm">10 minutes total time</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <AlertCircle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Passing Score</p>
                        <p className="text-white/80 text-sm">80% or above required</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 pt-6 border-t border-white/20">
                    <p className="text-sm text-white/90">
                      Anti-cheating measures are in place. Test dates will be communicated via email.
                    </p>
                  </div>
                </div>

                {/* Requirements */}
                <div className="card">
                  <h3 className="font-semibold text-gray-900 mb-4">Before You Login</h3>
                  <ul className="space-y-3 text-sm text-gray-600">
                    <li className="flex items-start">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mr-3 mt-1.5"></div>
                      <span>Ensure you have a stable internet connection</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mr-3 mt-1.5"></div>
                      <span>Use a modern browser (Chrome, Firefox, Edge)</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mr-3 mt-1.5"></div>
                      <span>Disable ad-blockers for this site</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mr-3 mt-1.5"></div>
                      <span>Do not refresh during the test</span>
                    </li>
                  </ul>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="card text-center">
                    <div className="text-2xl font-bold text-primary-600 mb-1">10min</div>
                    <div className="text-sm text-gray-600">Test Duration</div>
                  </div>
                  <div className="card text-center">
                    <div className="text-2xl font-bold text-secondary-600 mb-1">80%</div>
                    <div className="text-sm text-gray-600">Passing Score</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}

export default LoginPage