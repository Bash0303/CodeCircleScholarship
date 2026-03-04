import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../utils/axios'
import { useAuth } from '../../context/AuthContext'
import { 
  Clock, AlertCircle, CheckCircle, Calendar, 
  Mail, Phone, MapPin, BookOpen, Award, Shield, HelpCircle,
  Play, User, MapPin as LocationIcon, Calendar as CalendarIcon,
  RefreshCw
} from 'lucide-react'
import toast from 'react-hot-toast'

const CandidateDashboard = () => {
  const { user, updateUser } = useAuth()
  const navigate = useNavigate()
  const [timeRemaining, setTimeRemaining] = useState(null)
  const [isStartingTest, setIsStartingTest] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  // Function to refresh user data from server
  const refreshUserData = async () => {
    try {
      setRefreshing(true)
      console.log('🔄 Refreshing user data')
      
      const response = await api.get('/auth/profile')
      
      if (response.data.success) {
        console.log('✅ Refreshed user data:', response.data.user)
        updateUser(response.data.user)
        toast.success('Profile updated successfully')
      }
    } catch (error) {
      console.error('Error refreshing user data:', error)
      toast.error(error.response?.data?.message || 'Failed to refresh profile')
    } finally {
      setRefreshing(false)
    }
  }

  // Format test schedule from user data
  const testSchedule = user?.testScheduled && user?.testDate
    ? { 
        date: user.testDate, 
        time: user.testTime || '10:00 AM' 
      }
    : null

  // Check if test is still available today
  const isTestAvailableToday = () => {
    if (!user?.testDate || !user?.testTime) return false
    
    try {
      const now = new Date()
      const testDate = new Date(user.testDate)
      
      // Check if it's the same day
      if (testDate.toDateString() !== now.toDateString()) return false
      
      // Parse test time
      const timeStr = user.testTime
      let hours, minutes
      
      if (timeStr.includes(' ')) {
        // Format: "02:30 PM"
        const [time, modifier] = timeStr.split(' ')
        let [h, m] = time.split(':')
        hours = parseInt(h)
        minutes = parseInt(m)
        
        if (modifier === 'PM' && hours !== 12) {
          hours = hours + 12
        }
        if (modifier === 'AM' && hours === 12) {
          hours = 0
        }
      } else {
        // Format: "14:30"
        const [h, m] = timeStr.split(':')
        hours = parseInt(h)
        minutes = parseInt(m)
      }
      
      // Set test end time to 11:59 PM of the test day
      const testEndTime = new Date(testDate)
      testEndTime.setHours(23, 59, 59, 999)
      
      // Check if current time is before 11:59 PM
      return now <= testEndTime
    } catch (error) {
      console.error('Error checking test availability:', error)
      return false
    }
  }

  useEffect(() => {
    if (testSchedule && testSchedule.date) {
      try {
        const now = new Date()
        // Parse the test date properly
        const testDateTime = new Date(testSchedule.date)
        
        // Parse time string (e.g., "02:30 PM")
        if (testSchedule.time) {
          const timeStr = testSchedule.time
          const [time, modifier] = timeStr.split(' ')
          let [hours, minutes] = time.split(':')
          
          if (modifier === 'PM' && hours !== '12') {
            hours = parseInt(hours) + 12
          }
          if (modifier === 'AM' && hours === '12') {
            hours = 0
          }
          
          testDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0)
        }
        
        const diff = testDateTime - now
        
        if (diff > 0) {
          setTimeRemaining(Math.floor(diff / 1000))
          
          const timer = setInterval(() => {
            setTimeRemaining(prev => {
              if (prev <= 1) {
                clearInterval(timer)
                return 0
              }
              return prev - 1
            })
          }, 1000)
          
          return () => clearInterval(timer)
        } else {
          setTimeRemaining(0)
        }
      } catch (error) {
        console.error('Error parsing test date:', error)
      }
    }
  }, [testSchedule])

  const formatTime = (seconds) => {
    if (!seconds) return '00:00:00'
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleStartTest = () => {
    console.log('Start Test clicked - User:', user)
    
    if (!user?.testScheduled) {
      toast('Your test date will be communicated to you via your registered email/phone number. Kindly wait and come back, thank you.', {
        icon: '📧',
        duration: 5000,
      })
      return
    }

    if (user?.hasTakenTest) {
      toast('You have already taken the test. Your results will be communicated to you via email.', {
        icon: '📝',
        duration: 4000,
      })
      return
    }

    // Check if test is still available today (before 11:59 PM)
    if (!isTestAvailableToday()) {
      toast('Test is no longer available for today. Please contact admin if you need to reschedule.', {
        icon: '⏰',
        duration: 5000,
      })
      return
    }

    setIsStartingTest(true)
    setTimeout(() => {
      navigate('/candidate/test/instructions')
      setIsStartingTest(false)
    }, 1000)
  }

  const testRules = [
    'You have exactly 10 minutes to complete the test',
    'Do not copy questions or share them with AI',
    'The system will detect any cheating attempts',
    'Do not refresh or leave the test page',
    'Ensure stable internet connection throughout',
    'Passing score is 80% or above for scholarship'
  ]

  const formatDate = (dateString) => {
    if (!dateString) return 'Not scheduled'
    try {
      const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }
      return new Date(dateString).toLocaleDateString('en-US', options)
    } catch (error) {
      return dateString
    }
  }

  const formatRegistrationDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }
      return new Date(dateString).toLocaleDateString('en-US', options)
    } catch (error) {
      return dateString
    }
  }

  // Check if test time is approaching (within 24 hours)
  const isTestApproaching = () => {
    if (!testSchedule || !testSchedule.date) return false
    try {
      const now = new Date()
      const testDateTime = new Date(testSchedule.date)
      const diff = testDateTime - now
      return diff > 0 && diff < 24 * 60 * 60 * 1000 // Less than 24 hours
    } catch {
      return false
    }
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section with Refresh Button */}
      <div className="card bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2 text-white/90">
              Welcome back, <span className="text-secondary-300">{user?.name || 'Candidate'}</span>!
            </h1>
            <p className="text-white/90">
              Your scholarship test dashboard. Good luck!
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            <button
              onClick={refreshUserData}
              disabled={refreshing}
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <div className="flex items-center space-x-2">
              <Award className="w-6 h-6" />
              <span className="font-semibold">{user?.course || 'Course not selected'}</span>
            </div>
          </div>
        </div>
        
        {/* Show reschedule notification if test was rescheduled */}
        {user?.testRescheduled && (
          <div className="mt-4 bg-yellow-500/20 border border-yellow-400/30 rounded-lg p-3">
            <p className="text-sm text-yellow-100">
              ⚠️ Your test has been rescheduled. Please check the new date and time below.
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Test Info */}
        <div className="lg:col-span-2 space-y-8">
          {/* Test Status Card */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Test Status</h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-xl p-5 text-center">
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-3">
                    {user?.testScheduled ? (
                      <CheckCircle className="w-6 h-6 text-primary-600" />
                    ) : (
                      <Clock className="w-6 h-6 text-yellow-600" />
                    )}
                  </div>
                  <div className="font-semibold text-gray-900 mb-1">
                    {user?.testScheduled ? 'Scheduled' : 'Pending'}
                  </div>
                  <div className="text-sm text-gray-600">Test Status</div>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-5 text-center">
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-3">
                    {user?.hasTakenTest ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : (
                      <Clock className="w-6 h-6 text-yellow-600" />
                    )}
                  </div>
                  <div className="font-semibold text-gray-900 mb-1">
                    {user?.hasTakenTest ? 'Completed' : 'Not Taken'}
                  </div>
                  <div className="text-sm text-gray-600">Test Completion</div>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-5 text-center">
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-3">
                    <Shield className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="font-semibold text-gray-900 mb-1">80%</div>
                  <div className="text-sm text-gray-600">Passing Score</div>
                </div>
              </div>

              {/* Countdown Timer */}
              {timeRemaining !== null && timeRemaining > 0 && (
                <div className={`rounded-xl p-6 border ${
                  isTestApproaching() 
                    ? 'bg-orange-50 border-orange-200' 
                    : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'
                }`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Clock className={`w-5 h-5 mr-2 ${
                        isTestApproaching() ? 'text-orange-600' : 'text-blue-600'
                      }`} />
                      <span className={`font-semibold ${
                        isTestApproaching() ? 'text-orange-800' : 'text-blue-800'
                      }`}>
                        {isTestApproaching() ? 'Test Starting Soon!' : 'Test Starts In'}
                      </span>
                    </div>
                    <Calendar className={`w-5 h-5 ${
                      isTestApproaching() ? 'text-orange-600' : 'text-blue-600'
                    }`} />
                  </div>
                  <div className="text-center">
                    <div className={`text-4xl font-bold font-mono ${
                      isTestApproaching() ? 'text-orange-900' : 'text-blue-900'
                    }`}>
                      {formatTime(timeRemaining)}
                    </div>
                    <p className={`text-sm mt-2 ${
                      isTestApproaching() ? 'text-orange-700' : 'text-blue-700'
                    }`}>
                      Scheduled for {formatDate(testSchedule?.date)} at {testSchedule?.time}
                    </p>
                    {isTestApproaching() && (
                      <p className="text-xs text-orange-600 mt-2 font-medium">
                        ⏰ Your test is starting soon! Please be ready.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Show message if test scheduled but countdown not started */}
              {user?.testScheduled && timeRemaining === null && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                  <div className="flex items-center mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    <span className="font-semibold text-green-800">Test Scheduled</span>
                  </div>
                  <p className="text-green-700">
                    Your test is scheduled for {formatDate(user.testDate)} at {user.testTime}
                  </p>
                </div>
              )}

              {/* Test Rules */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2 text-yellow-600" />
                  Important Test Rules
                </h3>
                <ul className="space-y-3">
                  {testRules.map((rule, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mr-3 mt-1.5"></div>
                      <span className="text-gray-700">{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Start Test Button */}
          <div className="card bg-gradient-to-r from-secondary-500 to-secondary-600 text-white text-center">
            <h3 className="text-xl font-bold mb-4">Ready to Begin?</h3>
            <p className="mb-6 text-white/90">
              {user?.testScheduled 
                ? `Your test is scheduled for ${formatDate(user.testDate)} at ${user.testTime}`
                : 'Your test will be scheduled soon. Check your email for updates.'}
            </p>
            
            <button
              onClick={handleStartTest}
              disabled={isStartingTest || user?.hasTakenTest || !user?.testScheduled}
              className={`btn-primary bg-white text-secondary-600 hover:bg-gray-100 
                       px-12 py-4 text-lg inline-flex items-center justify-center space-x-3 w-full md:w-auto
                       ${(user?.hasTakenTest || !user?.testScheduled) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isStartingTest ? (
                <>
                  <div className="w-5 h-5 border-2 border-secondary-600 border-t-transparent rounded-full animate-spin"></div>
                  <span>Preparing Test...</span>
                </>
              ) : user?.hasTakenTest ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>Test Completed</span>
                </>
              ) : !user?.testScheduled ? (
                <>
                  <Clock className="w-5 h-5" />
                  <span>Awaiting Schedule</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  <span>Start Your Test</span>
                </>
              )}
            </button>
            
            {/* Show test time info */}
            {user?.testScheduled && !user?.hasTakenTest && (
              <p className="text-sm text-white/80 mt-4">
                ⏰ Test starts at {user.testTime} on {formatDate(user.testDate)}
              </p>
            )}
          </div>
        </div>

        {/* Right Column - Info Sidebar */}
        <div className="space-y-6">
          {/* Personal Info */}
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-primary-600" />
              Personal Information
            </h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <Mail className="w-4 h-4 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{user?.email || 'Not provided'}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Phone className="w-4 h-4 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{user?.phone || 'Not provided'}</p>
                </div>
              </div>
              <div className="flex items-center">
                <LocationIcon className="w-4 h-4 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">State / LGA</p>
                  <p className="font-medium">
                    {user?.state || 'Not provided'}
                    {user?.localGovernment && `, ${user.localGovernment}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <BookOpen className="w-4 h-4 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Course</p>
                  <p className="font-medium">{user?.course || 'Not selected'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Test Details */}
          <div className="card bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200">
            <h3 className="font-semibold text-gray-900 mb-4">Test Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Status:</span>
                <span className={`font-semibold ${user?.testScheduled ? 'text-green-600' : 'text-yellow-600'}`}>
                  {user?.testScheduled ? 'Scheduled' : 'Pending'}
                </span>
              </div>
              
              {user?.testDate && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Test Date:</span>
                  <span className="font-semibold">{formatDate(user.testDate)}</span>
                </div>
              )}
              
              {user?.testTime && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Test Time:</span>
                  <span className="font-semibold">{user.testTime}</span>
                </div>
              )}
              
              {/* Show countdown if available */}
              {timeRemaining !== null && timeRemaining > 0 && (
                <div className="flex justify-between items-center pt-2 border-t border-primary-200">
                  <span className="text-gray-600">Time until test:</span>
                  <span className="font-mono font-bold text-primary-700">
                    {formatTime(timeRemaining)}
                  </span>
                </div>
              )}
              
              {/* Score section completely removed - no longer displayed */}
            </div>
          </div>

          {/* Scholarship Info */}
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-4">Scholarship Details</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="w-2 h-2 rounded-full bg-primary-500 mr-3 mt-1.5"></div>
                <span className="text-gray-700">Fully funded training program</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 rounded-full bg-primary-500 mr-3 mt-1.5"></div>
                <span className="text-gray-700">80% passing score required</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 rounded-full bg-primary-500 mr-3 mt-1.5"></div>
                <span className="text-gray-700">Practical hands-on training</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 rounded-full bg-primary-500 mr-3 mt-1.5"></div>
                <span className="text-gray-700">Certificate upon completion</span>
              </li>
            </ul>
          </div>

          {/* Help & Support */}
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <HelpCircle className="w-5 h-5 mr-2 text-primary-600" />
              Need Help?
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Contact our support team if you encounter any issues
            </p>
            <div className="space-y-3">
              <a 
                href="mailto:info.codecircle@gmail.com"
                className="flex items-center text-primary-600 hover:text-primary-700 text-sm"
              >
                <Mail className="w-4 h-4 mr-2" />
                info.codecircle@gmail.com
              </a>
              <a 
                href="tel:+2349063836085"
                className="flex items-center text-primary-600 hover:text-primary-700 text-sm"
              >
                <Phone className="w-4 h-4 mr-2" />
                +234 906 383 6085
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CandidateDashboard