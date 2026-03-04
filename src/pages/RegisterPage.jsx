import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import toast from 'react-hot-toast'
import Header from '../components/common/Header'
import Footer from '../components/common/Footer'
import { Eye, EyeOff, Check, User, Mail, Phone, MapPin, Lock, ArrowLeft, Shield } from 'lucide-react'
import { COURSES } from '../data/courses'
import { NIGERIAN_STATES } from '../data/states'
import logo from '../assets/logo.png'

const schema = yup.object({
  fullName: yup.string().required('Full name is required').min(3, 'Name must be at least 3 characters'),
  email: yup.string().email('Please enter a valid email').required('Email is required'),
  phoneNumber: yup.string()
    .required('Phone number is required')
    .matches(/^[0-9]{11}$/, 'Phone number must be 11 digits'),
  state: yup.string().required('State is required'),
  localGovernment: yup.string().required('Local government is required'),
  gender: yup.string().required('Gender is required').oneOf(['Male', 'Female']),
  course: yup.string().required('Course selection is required'),
  password: yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[!@#$%^&*]/, 'Password must contain at least one special character'),
  confirmPassword: yup.string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password'), null], 'Passwords must match')
})

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      gender: 'Male'
    }
  })

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    
    try {
      // Call your backend API
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Registration failed')
      }

      if (result.success) {
        toast.success(result.message || 'Registration successful!')
        
        // Store token if your API returns one
        if (result.token) {
          localStorage.setItem('token', result.token)
          localStorage.setItem('user', JSON.stringify(result.user))
        }
        
        // Navigate to success page with WhatsApp link
        navigate('/registration-success')
      } else {
        throw new Error(result.message || 'Registration failed')
      }
    } catch (error) {
      console.error('Registration error:', error)
      toast.error(error.message || 'Registration failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-8 md:py-12">
        <div className="container-responsive">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-10">
              <Link 
                to="/" 
                className="inline-flex items-center text-gray-600 hover:text-primary-600 
                         transition-colors duration-200 mb-6"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Home
              </Link>
              
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 rounded-xl bg-white p-3 shadow-lg">
                  <img src={logo} alt="CodeCircle Logo" className="w-full h-full object-contain" />
                </div>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                Scholarship Application
              </h1>
              <p className="text-gray-600 text-lg">
                Fill in your details to apply for the CodeCircle TechHub Scholarship
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Form */}
              <div className="lg:col-span-2">
                <div className="card">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Full Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-2 text-gray-500" />
                            Full Name
                          </div>
                        </label>
                        <input
                          type="text"
                          {...register('fullName')}
                          className={`input-field ${errors.fullName ? 'input-error' : ''}`}
                          placeholder="Enter your full name"
                        />
                        {errors.fullName && (
                          <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
                        )}
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <div className="flex items-center">
                            <Mail className="w-4 h-4 mr-2 text-gray-500" />
                            Email Address
                          </div>
                        </label>
                        <input
                          type="email"
                          {...register('email')}
                          className={`input-field ${errors.email ? 'input-error' : ''}`}
                          placeholder="you@example.com"
                        />
                        {errors.email && (
                          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                        )}
                      </div>

                      {/* Phone Number */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <div className="flex items-center">
                            <Phone className="w-4 h-4 mr-2 text-gray-500" />
                            Phone Number
                          </div>
                        </label>
                        <input
                          type="tel"
                          {...register('phoneNumber')}
                          className={`input-field ${errors.phoneNumber ? 'input-error' : ''}`}
                          placeholder="08012345678"
                        />
                        {errors.phoneNumber && (
                          <p className="text-red-500 text-sm mt-1">{errors.phoneNumber.message}</p>
                        )}
                      </div>

                      {/* State */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                            State
                          </div>
                        </label>
                        <select
                          {...register('state')}
                          className={`input-field ${errors.state ? 'input-error' : ''}`}
                        >
                          <option value="">Select State</option>
                          {NIGERIAN_STATES.map((state) => (
                            <option key={state} value={state}>{state}</option>
                          ))}
                        </select>
                        {errors.state && (
                          <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>
                        )}
                      </div>

                      {/* Local Government */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Local Government Area
                        </label>
                        <input
                          type="text"
                          {...register('localGovernment')}
                          className={`input-field ${errors.localGovernment ? 'input-error' : ''}`}
                          placeholder="Enter your LGA"
                        />
                        {errors.localGovernment && (
                          <p className="text-red-500 text-sm mt-1">{errors.localGovernment.message}</p>
                        )}
                      </div>

                      {/* Gender */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Gender
                        </label>
                        <div className="flex space-x-6">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              {...register('gender')}
                              value="Male"
                              className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                            />
                            <span className="ml-2">Male</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              {...register('gender')}
                              value="Female"
                              className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                            />
                            <span className="ml-2">Female</span>
                          </label>
                        </div>
                        {errors.gender && (
                          <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>
                        )}
                      </div>

                      {/* Course Selection */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Select Course
                        </label>
                        <select
                          {...register('course')}
                          className={`input-field ${errors.course ? 'input-error' : ''}`}
                        >
                          <option value="">Choose a course</option>
                          {COURSES.map((course) => (
                            <option key={course} value={course}>{course}</option>
                          ))}
                        </select>
                        {errors.course && (
                          <p className="text-red-500 text-sm mt-1">{errors.course.message}</p>
                        )}
                      </div>

                      {/* Password */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <div className="flex items-center">
                            <Lock className="w-4 h-4 mr-2 text-gray-500" />
                            Password
                          </div>
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            {...register('password')}
                            className={`input-field ${errors.password ? 'input-error' : ''} pr-10`}
                            placeholder="Create a password"
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

                      {/* Confirm Password */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            {...register('confirmPassword')}
                            className={`input-field ${errors.confirmPassword ? 'input-error' : ''} pr-10`}
                            placeholder="Confirm your password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                          >
                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                        {errors.confirmPassword && (
                          <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
                        )}
                      </div>
                    </div>

                    {/* Terms Agreement */}
                    <div className="flex items-start p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center h-5">
                        <input
                          id="terms"
                          type="checkbox"
                          required
                          className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        />
                      </div>
                      <div className="ml-3">
                        <label htmlFor="terms" className="text-sm text-gray-600">
                          I agree to the terms and conditions of the CodeCircle TechHub Scholarship program. 
                          I understand that my information will be used solely for scholarship purposes and 
                          will be kept confidential.
                        </label>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full btn-primary flex items-center justify-center space-x-2 py-4"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Processing Registration...</span>
                          </>
                        ) : (
                          <>
                            <Check className="w-5 h-5" />
                            <span>Register for Scholarship</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Login Link */}
                    <div className="text-center pt-4">
                      <p className="text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                          Login here
                        </Link>
                      </p>
                    </div>
                  </form>
                </div>
              </div>

              {/* Sidebar Info */}
              <div className="space-y-6">
                {/* Password Requirements */}
                <div className="card">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-primary-600" />
                    Password Requirements
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mr-2"></div>
                      At least 8 characters
                    </li>
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mr-2"></div>
                      One uppercase letter
                    </li>
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mr-2"></div>
                      One lowercase letter
                    </li>
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mr-2"></div>
                      One number (0-9)
                    </li>
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mr-2"></div>
                      One special character (!@#$%^&*)
                    </li>
                  </ul>
                </div>

                {/* Process Info */}
                <div className="card bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200">
                  <h3 className="font-semibold text-gray-900 mb-4">Application Process</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="w-6 h-6 rounded-full bg-primary-600 text-white text-xs flex items-center justify-center mr-3 mt-0.5">
                        1
                      </div>
                      <div>
                        <p className="font-medium text-sm">Complete Registration</p>
                        <p className="text-xs text-gray-600 mt-1">Fill in all required details accurately</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-6 h-6 rounded-full bg-primary-600 text-white text-xs flex items-center justify-center mr-3 mt-0.5">
                        2
                      </div>
                      <div>
                        <p className="font-medium text-sm">Await Test Schedule</p>
                        <p className="text-xs text-gray-600 mt-1">Check email for test date & time</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-6 h-6 rounded-full bg-primary-600 text-white text-xs flex items-center justify-center mr-3 mt-0.5">
                        3
                      </div>
                      <div>
                        <p className="font-medium text-sm">Take Scholarship Test</p>
                        <p className="text-xs text-gray-600 mt-1">10-minute online assessment</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Success Note */}
                <div className="card bg-green-50 border-green-200">
                  <div className="flex">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800">Registration Complete</h3>
                      <div className="mt-2 text-sm text-green-700">
                        <p>
                          After registration, you'll be able to login and access your scholarship test when scheduled.
                          Test dates will be communicated via email and SMS.
                        </p>
                      </div>
                    </div>
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

export default RegisterPage