import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/axios'
import { 
  Clock, AlertTriangle, ChevronLeft, ChevronRight, 
  CheckCircle, Shield, Send, AlertCircle, Loader,
  Calendar
} from 'lucide-react'
import toast from 'react-hot-toast'

const TestPage = () => {
  const { user, updateUser } = useAuth()
  const navigate = useNavigate()
  
  // Test state
  const [loading, setLoading] = useState(true)
  const [testId, setTestId] = useState(null)
  const [questions, setQuestions] = useState([])
  const [timeLeft, setTimeLeft] = useState(600) // 10 minutes in seconds
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false)
  const [warningCount, setWarningCount] = useState(0)
  const [startTime, setStartTime] = useState(null)
  const [answerTimers, setAnswerTimers] = useState({})
  const [currentQuestionStartTime, setCurrentQuestionStartTime] = useState(Date.now())

  // Add this effect to handle page refresh/close
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };

    const handleUnload = async () => {
      if (testId && !isSubmitting) {
        try {
          const data = JSON.stringify({ 
            testId, 
            reason: 'page-closed',
            answers: answers,
            timeLeft: timeLeft
          });
          
          navigator.sendBeacon(`${api.defaults.baseURL}/tests/abandon`, 
            new Blob([data], { type: 'application/json' })
          );
        } catch (error) {
          console.error('Error marking test as abandoned:', error);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('unload', handleUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('unload', handleUnload);
    };
  }, [testId, isSubmitting, answers, timeLeft]);

  // Format test date/time from user data
  const formatTestDateTime = () => {
    if (!user?.testDate) return 'Not scheduled'
    
    try {
      const testDate = new Date(user.testDate)
      const formattedDate = testDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
      
      let formattedTime = user.testTime || 'Not specified'
      
      return `${formattedDate} at ${formattedTime}`
    } catch (error) {
      console.error('Error formatting test date:', error)
      return `${user.testDate} at ${user.testTime}`
    }
  }

  // Check if test time has arrived
  const isTestTimeArrived = () => {
    if (!user?.testDate || !user?.testTime) return false
    
    try {
      const now = new Date()
      const testDateTime = new Date(user.testDate)
      
      if (user.testTime) {
        const timeStr = user.testTime
        if (timeStr.includes(' ')) {
          const [time, modifier] = timeStr.split(' ')
          let [hours, minutes] = time.split(':')
          
          if (modifier === 'PM' && hours !== '12') {
            hours = parseInt(hours) + 12
          }
          if (modifier === 'AM' && hours === '12') {
            hours = 0
          }
          testDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0)
        } else {
          const [hours, minutes] = timeStr.split(':')
          testDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0)
        }
      }
      
      return now >= testDateTime
    } catch (error) {
      console.error('Error checking test time:', error)
      return false
    }
  }

  // Check if test is still available today (before 11:59 PM)
  const isTestAvailableToday = () => {
    if (!user?.testDate || !user?.testTime) return false
    
    try {
      const now = new Date()
      const testDate = new Date(user.testDate)
      
      if (testDate.toDateString() !== now.toDateString()) return false
      
      const timeStr = user.testTime
      let hours, minutes
      
      if (timeStr.includes(' ')) {
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
        const [h, m] = timeStr.split(':')
        hours = parseInt(h)
        minutes = parseInt(m)
      }
      
      const testEndTime = new Date(testDate)
      testEndTime.setHours(23, 59, 59, 999)
      
      return now <= testEndTime
    } catch (error) {
      console.error('Error checking test availability:', error)
      return false
    }
  }

  // Start test on component mount
  useEffect(() => {
    const startTest = async () => {
      setLoading(true)
      try {
        console.log('🔑 Starting test...')

        if (!user?.testScheduled) {
          toast.error('Your test has not been scheduled yet')
          navigate('/candidate/dashboard')
          return
        }

        if (user?.hasTakenTest) {
          toast.error('You have already taken this test')
          navigate('/candidate/dashboard')
          return
        }

        if (!isTestTimeArrived()) {
          const testDateTime = formatTestDateTime()
          toast.error(`Your test is scheduled for ${testDateTime}. Please wait until your scheduled time.`, {
            duration: 5000,
            icon: '⏰'
          })
          navigate('/candidate/dashboard')
          return
        }

        if (!isTestAvailableToday()) {
          toast.error('Test is no longer available for today. Please contact admin if you need to reschedule.', {
            duration: 5000,
            icon: '⏰'
          })
          navigate('/candidate/dashboard')
          return
        }

        const screenResolution = `${window.screen.width}x${window.screen.height}`
        
        const response = await api.post('/tests/start', { screenResolution })

        if (response.data.success) {
          setTestId(response.data.data.testId)
          setQuestions(response.data.data.questions)
          setTimeLeft(response.data.data.timeLimit)
          setStartTime(response.data.data.startTime)
          setCurrentQuestionStartTime(Date.now())
          
          if (response.data.data.answers) {
            setAnswers(response.data.data.answers)
          }
          
          toast.success('Test started successfully! Good luck!')
        }
      } catch (error) {
        console.error('Error starting test:', error)
        toast.error(error.response?.data?.message || 'Failed to start test')
        navigate('/candidate/dashboard')
      } finally {
        setLoading(false)
      }
    }

    startTest()
  }, [navigate, user])

  // Timer effect
  useEffect(() => {
    if (loading || timeLeft <= 0) {
      if (timeLeft <= 0 && !loading && !isSubmitting) {
        handleAutoSubmit()
      }
      return
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    const syncTimer = setInterval(async () => {
      try {
        if (testId) {
          await api.post('/tests/timer', { testId, timeLeft })
        }
      } catch (error) {
        console.error('Failed to sync timer:', error)
      }
    }, 30000)

    return () => {
      clearInterval(timer)
      clearInterval(syncTimer)
    }
  }, [loading, timeLeft, testId, isSubmitting])

  // Anti-cheating measures
  useEffect(() => {
    const logCheatAttempt = async (type, details) => {
      try {
        if (!testId) return
        
        const response = await api.post('/tests/cheat-log', { 
          testId, 
          type, 
          details 
        })

        if (response.data.success) {
          setWarningCount(prev => prev + 1)
          
          if (response.data.data.cheatingDetected) {
            toast.error('Cheating detected! Test will be auto-submitted.', {
              duration: 5000,
              icon: '🚫'
            })
            handleAutoSubmit()
          } else {
            toast.error(response.data.data.warning || `Warning ${warningCount + 1}/3: ${details}`, {
              duration: 3000,
              icon: '⚠️'
            })
          }
        }
      } catch (error) {
        console.error('Failed to log cheat attempt:', error)
      }
    }

    const handleVisibilityChange = () => {
      if (document.hidden && testId) {
        logCheatAttempt('tab-switch', 'User switched to another tab')
      }
    }

    const handleCopy = (e) => {
      e.preventDefault()
      if (testId) {
        logCheatAttempt('copy', 'User attempted to copy content')
      }
    }

    const handleContextMenu = (e) => {
      e.preventDefault()
    }

    const handleKeyDown = (e) => {
      if (e.ctrlKey && ['c', 'v', 'p', 's', 'u'].includes(e.key.toLowerCase())) {
        e.preventDefault()
        if (testId) {
          logCheatAttempt('keyboard-shortcut', `User pressed Ctrl+${e.key}`)
        }
      }
      
      if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && ['I', 'J'].includes(e.key))) {
        e.preventDefault()
        if (testId) {
          logCheatAttempt('devtools', 'User attempted to open dev tools')
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    document.addEventListener('copy', handleCopy)
    document.addEventListener('contextmenu', handleContextMenu)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      document.removeEventListener('copy', handleCopy)
      document.removeEventListener('contextmenu', handleContextMenu)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [testId, warningCount])

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleAnswerSelect = async (questionId, answer) => {
    const timeSpent = Math.floor((Date.now() - currentQuestionStartTime) / 1000)
    
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))

    setAnswerTimers(prev => ({
      ...prev,
      [questionId]: timeSpent
    }))

    try {
      await api.post('/tests/answer', { 
        testId, 
        questionId, 
        answer,
        timeSpent
      })
    } catch (error) {
      console.error('Error saving answer:', error)
      toast.error('Failed to save answer. Please try again.')
    }

    setCurrentQuestionStartTime(Date.now())
  }

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
      setCurrentQuestionStartTime(Date.now())
    }
  }

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
      setCurrentQuestionStartTime(Date.now())
    }
  }

  const handleAutoSubmit = useCallback(async () => {
    if (isSubmitting) return
    
    setIsSubmitting(true)
    
    try {
      const response = await api.post('/tests/auto-submit', { testId })

      if (response.data.success) {
        updateUser({
          hasTakenTest: true,
          testScore: response.data.data.score,
          passed: response.data.data.passed,
          testStatus: 'completed'
        })
        
        toast('Time is up! Your test has been auto-submitted.', {
          icon: '⏰',
          duration: 5000,
        })
        
        setTimeout(() => {
          navigate('/candidate/dashboard')
        }, 2000)
      }
    } catch (error) {
      console.error('Error auto-submitting test:', error)
      await handleSubmit(true)
    } finally {
      setIsSubmitting(false)
    }
  }, [testId, navigate, updateUser, isSubmitting])

  const handleSubmit = async (isAuto = false) => {
    if (!isAuto) {
      setShowSubmitConfirm(false)
    }
    
    if (isSubmitting) return
    
    setIsSubmitting(true)
    
    try {
      const lastQuestionTimeSpent = Math.floor((Date.now() - currentQuestionStartTime) / 1000)
      const finalAnswerTimers = {
        ...answerTimers,
        [questions[currentQuestion]?.id]: lastQuestionTimeSpent
      }

      const response = await api.post('/tests/submit', { 
        testId, 
        answers,
        timeLeft,
        answerTimers: finalAnswerTimers
      })

      if (response.data.success) {
        updateUser({
          hasTakenTest: true,
          testScore: response.data.data.score,
          passed: response.data.data.passed,
          testStatus: 'completed'
        })

        if (isAuto) {
          toast('Time is up! Your test has been auto-submitted.', {
            icon: '⏰',
            duration: 5000,
          })
        } else {
          toast.success('Test submitted successfully!', {
            duration: 4000,
          })
        }

        setTimeout(() => {
          if (!isAuto) {
            toast(response.data.data.passed ? 
              'Congratulations! You passed the test. Results will be communicated via email.' :
              'Thank you for taking the test. Results will be communicated via email.',
              {
                duration: 6000,
                icon: response.data.data.passed ? '🎉' : '📧'
              }
            )
          }
          
          navigate('/candidate/dashboard')
        }, isAuto ? 2000 : 1500)
      }
    } catch (error) {
      console.error('Error submitting test:', error)
      toast.error(error.response?.data?.message || 'Failed to submit test')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="card p-12 text-center">
          <Loader className="w-12 h-12 animate-spin text-primary-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Starting Test...</h2>
          <p className="text-gray-600">Please wait while we prepare your test.</p>
        </div>
      </div>
    )
  }

  if (!testId || questions.length === 0) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="card p-12 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Test Not Available</h2>
          <p className="text-gray-600 mb-4">Your test is scheduled for: <strong>{formatTestDateTime()}</strong></p>
          <p className="text-gray-600 mb-6">Please wait until your scheduled time.</p>
          <button
            onClick={() => navigate('/candidate/dashboard')}
            className="btn-primary"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    )
  }

  const currentQuestionData = questions[currentQuestion]
  const answeredQuestions = Object.keys(answers).length
  const totalQuestions = questions.length

  return (
    <div className="max-w-6xl mx-auto">
      {/* Test Header */}
      <div className="card bg-gradient-to-r from-primary-600 to-primary-800 text-white mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Scholarship Test</h1>
            <p className="text-white/90">Course: {user?.course}</p>
            <div className="flex items-center mt-2 text-white/80 text-sm">
              <Calendar className="w-4 h-4 mr-1" />
              <span>Scheduled: {formatTestDateTime()}</span>
            </div>
          </div>
          
          <div className="mt-4 md:mt-0">
            <div className="flex items-center justify-center space-x-6">
              {/* Timer */}
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Clock className="w-5 h-5 mr-2" />
                  <span className={`text-2xl font-bold font-mono ${
                    timeLeft <= 60 ? 'text-yellow-300' : ''
                  }`}>
                    {formatTime(timeLeft)}
                  </span>
                </div>
                <div className="text-sm text-white/80">Time Remaining</div>
              </div>
              
              {/* Progress */}
              <div className="text-center">
                <div className="text-2xl font-bold mb-1">
                  {answeredQuestions}/{totalQuestions}
                </div>
                <div className="text-sm text-white/80">Questions Answered</div>
              </div>
            </div>
            
            {/* Time Warning */}
            {timeLeft <= 60 && (
              <div className="flex items-center justify-center mt-4 text-yellow-300">
                <AlertTriangle className="w-4 h-4 mr-2" />
                <span className="text-sm">Less than 1 minute remaining!</span>
              </div>
            )}

            {/* Cheat Warning */}
            {warningCount > 0 && (
              <div className="flex items-center justify-center mt-2 text-red-300">
                <Shield className="w-4 h-4 mr-2" />
                <span className="text-sm">Warnings: {warningCount}/3</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Questions Navigation */}
        <div className="lg:col-span-1">
          <div className="card sticky top-24">
            <h3 className="font-semibold text-gray-900 mb-4">Questions</h3>
            <div className="grid grid-cols-5 lg:grid-cols-2 gap-2">
              {questions.map((q, index) => (
                <button
                  key={q.id}
                  onClick={() => {
                    setCurrentQuestion(index)
                    setCurrentQuestionStartTime(Date.now())
                  }}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium
                           ${currentQuestion === index 
                             ? 'bg-primary-600 text-white' 
                             : answers[q.id] 
                               ? 'bg-green-100 text-green-700 border border-green-200'
                               : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center mb-3">
                <Shield className="w-4 h-4 text-gray-400 mr-2" />
                <span className="text-sm font-medium text-gray-700">Test Security</span>
              </div>
              <p className="text-xs text-gray-500">
                Anti-cheating measures are active. Do not switch tabs or copy content.
              </p>
              <p className="text-xs text-red-500 mt-2">
                Warnings: {warningCount}/3
              </p>
            </div>
          </div>
        </div>

        {/* Question Area */}
        <div className="lg:col-span-3">
          <div className="card">
            {/* Question Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <span className="text-sm font-medium text-primary-600">
                  Question {currentQuestion + 1} of {totalQuestions}
                </span>
                <h2 className="text-xl font-bold text-gray-900 mt-1">
                  {currentQuestionData.question}
                </h2>
                <span className="text-xs text-gray-500 mt-2 inline-block">
                  Difficulty: {currentQuestionData.difficulty} | Category: {currentQuestionData.category}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {answers[currentQuestionData.id] && (
                  <div className="flex items-center text-green-600 text-sm">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Answered
                  </div>
                )}
              </div>
            </div>

            {/* Options */}
            <div className="space-y-4 mb-10">
              {Object.entries(currentQuestionData.options).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => handleAnswerSelect(currentQuestionData.id, key)}
                  className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-200
                           ${answers[currentQuestionData.id] === key
                             ? 'border-primary-500 bg-primary-50'
                             : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
                >
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4
                                 ${answers[currentQuestionData.id] === key
                                   ? 'bg-primary-600 text-white'
                                   : 'bg-gray-100 text-gray-700'}`}>
                      {key.toUpperCase()}
                    </div>
                    <span className="text-gray-800">{value}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center pt-8 border-t border-gray-200">
              <button
                onClick={handlePrevQuestion}
                disabled={currentQuestion === 0}
                className="btn-outline flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
                <span>Previous</span>
              </button>
              
              <div className="flex items-center space-x-4">
                {currentQuestion === totalQuestions - 1 ? (
                  <button
                    onClick={() => setShowSubmitConfirm(true)}
                    disabled={isSubmitting}
                    className="btn-primary bg-green-600 hover:bg-green-700 flex items-center space-x-2"
                  >
                    <Send className="w-5 h-5" />
                    <span>Finish Test</span>
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <span>Next Question</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Progress Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="card text-center">
              <div className="text-2xl font-bold text-primary-600 mb-1">
                {answeredQuestions}
              </div>
              <div className="text-sm text-gray-600">Answered</div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold text-gray-600 mb-1">
                {totalQuestions - answeredQuestions}
              </div>
              <div className="text-sm text-gray-600">Remaining</div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {totalQuestions}
              </div>
              <div className="text-sm text-gray-600">Total Questions</div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full animate-fade-in">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-yellow-600" />
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 text-center mb-4">
              Submit Test?
            </h3>
            
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to submit your test? Once submitted, you cannot make changes.
            </p>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
              <div className="flex items-center mb-2">
                <Clock className="w-4 h-4 text-yellow-600 mr-2" />
                <span className="font-medium text-yellow-800">Time Remaining: {formatTime(timeLeft)}</span>
              </div>
              <p className="text-sm text-yellow-700">
                {answeredQuestions === totalQuestions 
                  ? 'All questions answered'
                  : `${totalQuestions - answeredQuestions} unanswered question(s)`}
              </p>
              {warningCount > 0 && (
                <p className="text-sm text-red-600 mt-2">
                  Warnings: {warningCount}/3
                </p>
              )}
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowSubmitConfirm(false)}
                className="flex-1 btn-outline py-3"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSubmit(false)}
                disabled={isSubmitting}
                className="flex-1 btn-primary bg-green-600 hover:bg-green-700 py-3"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  'Yes, Submit Test'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Time Up Modal */}
      {timeLeft === 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full animate-fade-in">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 text-center mb-4">
              Time's Up!
            </h3>
            
            <p className="text-gray-600 text-center mb-6">
              Your test has been automatically submitted. Results will be communicated via your registered email.
            </p>
            
            <div className="text-center">
              <button
                onClick={() => navigate('/candidate/dashboard')}
                disabled={isSubmitting}
                className="btn-primary w-full py-3"
              >
                {isSubmitting ? 'Submitting...' : 'Return to Dashboard'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TestPage