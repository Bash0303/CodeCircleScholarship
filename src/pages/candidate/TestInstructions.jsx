import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { 
  AlertTriangle, Clock, Shield, CheckCircle, XCircle,
  AlertCircle, HelpCircle, Play
} from 'lucide-react'
import toast from 'react-hot-toast'

const TestInstructions = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [acceptedRules, setAcceptedRules] = useState(false)
  const [isStarting, setIsStarting] = useState(false)

  const instructions = [
    {
      icon: <Clock className="w-5 h-5" />,
      title: 'Time Limit',
      description: 'You have exactly 10 minutes to complete the entire test. The timer starts when you begin.',
      warning: true
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: 'Anti-Cheating System',
      description: 'The system monitors tab switching, copy-paste attempts, and suspicious activity.',
      warning: true
    },
    {
      icon: <AlertCircle className="w-5 h-5" />,
      title: 'No Copying',
      description: 'Do not copy questions or share with AI tools. Violations will lead to disqualification.',
      warning: true
    },
    {
      icon: <CheckCircle className="w-5 h-5" />,
      title: 'Answer Selection',
      description: 'Select the best answer for each question. You can navigate between questions.',
      warning: false
    },
    {
      icon: <XCircle className="w-5 h-5" />,
      title: 'No Going Back',
      description: 'Once submitted, you cannot retake the test. Ensure you review before submitting.',
      warning: false
    }
  ]

  const warnings = [
    'The test will auto-submit when time expires',
    'Switching tabs/windows may trigger warnings',
    'Internet connectivity is your responsibility',
    'Passing score: 80% or above for scholarship',
    'Results communicated via email within 48 hours'
  ]

  const handleStartTest = () => {
    if (!acceptedRules) {
      toast.error('You must accept the test rules to continue')
      return
    }

    setIsStarting(true)
    
    setTimeout(() => {
      navigate('/candidate/test')
      setIsStarting(false)
    }, 1500)
  }

  const handleCancel = () => {
    navigate('/candidate/dashboard')
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-primary-100 to-secondary-100 mb-6">
          <AlertTriangle className="w-8 h-8 text-primary-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Scholarship Test Instructions
        </h1>
        <p className="text-gray-600 text-lg">
          Read these instructions carefully before starting your test
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Instructions */}
        <div className="lg:col-span-2">
          <div className="card mb-8">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center mr-4">
                <AlertTriangle className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Critical Information</h2>
                <p className="text-gray-600">You must understand these rules before proceeding</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {instructions.map((instruction, index) => (
                <div 
                  key={index}
                  className={`p-5 rounded-xl border ${instruction.warning ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`}
                >
                  <div className="flex items-start mb-3">
                    <div className={`p-2 rounded-lg ${instruction.warning ? 'bg-red-100 text-red-600' : 'bg-primary-100 text-primary-600'} mr-3`}>
                      {instruction.icon}
                    </div>
                    <h3 className="font-semibold text-gray-900">{instruction.title}</h3>
                  </div>
                  <p className="text-gray-600 text-sm">{instruction.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Warnings */}
          <div className="card bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 text-red-600" />
              Important Warnings
            </h3>
            <ul className="space-y-3">
              {warnings.map((warning, index) => (
                <li key={index} className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-red-500 mr-3 mt-1.5"></div>
                  <span className="text-gray-700">{warning}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Sidebar - Start Test */}
        <div className="space-y-6">
          {/* Test Summary */}
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-4">Test Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                <span className="text-gray-600">Duration</span>
                <span className="font-semibold">10 minutes</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                <span className="text-gray-600">Questions</span>
                <span className="font-semibold">40 questions</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                <span className="text-gray-600">Passing Score</span>
                <span className="font-semibold text-green-600">80% or above</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Your Course</span>
                <span className="font-semibold">{user?.course}</span>
              </div>
            </div>
          </div>

          {/* Rules Acceptance */}
          <div className="card">
            <div className="flex items-start mb-6">
              <input
                type="checkbox"
                id="acceptRules"
                checked={acceptedRules}
                onChange={(e) => setAcceptedRules(e.target.checked)}
                className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500 border-gray-300 mt-0.5"
              />
              <label htmlFor="acceptRules" className="ml-3">
                <span className="font-medium text-gray-900">I accept all test rules</span>
                <p className="text-sm text-gray-600 mt-1">
                  I confirm that I have read and understood all instructions. I will not engage in any form of cheating or malpractice.
                </p>
              </label>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleStartTest}
                disabled={!acceptedRules || isStarting}
                className={`w-full btn-primary flex items-center justify-center space-x-2 py-4
                         ${!acceptedRules ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isStarting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Preparing Test Environment...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    <span>Start Test Now</span>
                  </>
                )}
              </button>

              <button
                onClick={handleCancel}
                className="w-full btn-outline py-4"
              >
                Cancel & Return to Dashboard
              </button>
            </div>
          </div>

          {/* Help */}
          <div className="card bg-blue-50 border-blue-200">
            <div className="flex items-center mb-3">
              <HelpCircle className="w-5 h-5 text-blue-600 mr-2" />
              <h4 className="font-medium text-blue-800">Technical Issues?</h4>
            </div>
            <p className="text-sm text-blue-700 mb-3">
              If you experience technical issues during the test:
            </p>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Refresh only if absolutely necessary</li>
              <li>• Contact support immediately</li>
              <li>• Take screenshots of any errors</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TestInstructions