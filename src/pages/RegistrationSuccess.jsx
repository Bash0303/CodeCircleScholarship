import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CheckCircle, MessageCircle, ArrowRight, LogIn } from 'lucide-react'
import logo from '../assets/logo.png'

const RegistrationSuccess = () => {
  const navigate = useNavigate()
  const [countdown, setCountdown] = useState(20)
  
  const whatsappLink = "https://chat.whatsapp.com/FEhs852KR03LrsY6XGjnMf?mode=gi_t"

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          navigate('/login')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [navigate])

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary-50 to-primary-100">
      {/* Header with logo */}
      <header className="bg-white shadow-sm py-4 sticky top-0 z-10">
        <div className="container-responsive">
          <div className="flex items-center justify-center">
            <div className="w-12 h-12 mr-3">
              <img src={logo} alt="CodeCircle Logo" className="w-full h-full object-contain" />
            </div>
            <span className="font-bold text-xl text-gray-900">CodeCircle TechHub</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="max-w-2xl w-full animate-fade-in">
          {/* Success Card */}
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 lg:p-12 text-center">
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
            </div>

            {/* Success Message */}
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Registration Successful! 🎉
            </h1>
            
            <p className="text-base md:text-lg text-gray-600 mb-8">
              Welcome to <span className="font-semibold text-primary-600">CodeCircle TechHub Scholarship</span> community!
            </p>

            {/* WhatsApp Join Section */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
              <div className="flex items-center justify-center mb-4">
                <MessageCircle className="w-6 h-6 md:w-8 md:h-8 text-green-600 mr-3" />
                <h2 className="text-lg md:text-xl font-semibold text-gray-900">Join our WhatsApp Community</h2>
              </div>
              
              <p className="text-sm md:text-base text-gray-600 mb-6">
                Connect with fellow scholars, get updates, and be part of our tech community!
              </p>

              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center space-x-2 w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-medium py-3 md:py-4 px-6 md:px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl text-sm md:text-base"
              >
                <MessageCircle className="w-4 h-4 md:w-5 md:h-5" />
                <span>Join WhatsApp Group</span>
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
              </a>
            </div>

            {/* Login Redirect Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-center justify-center mb-3">
                <LogIn className="w-5 h-5 md:w-6 md:h-6 text-blue-600 mr-2" />
                <h3 className="text-base md:text-lg font-semibold text-gray-900">Ready to access your dashboard?</h3>
              </div>
              
              <p className="text-sm md:text-base text-gray-600 mb-4">
                You'll be automatically redirected to login in <span className="font-bold text-primary-600">{countdown}</span> seconds
              </p>

              <Link
                to="/login"
                className="inline-flex items-center justify-center space-x-2 text-primary-600 hover:text-primary-700 font-medium text-sm md:text-base"
              >
                <span>Login now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Progress Bar */}
            <div className="mt-8 w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary-600 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${(countdown / 20) * 100}%` }}
              ></div>
            </div>
            <p className="text-xs md:text-sm text-gray-500 mt-2">
              Redirecting in {countdown} seconds...
            </p>
          </div>

          {/* Footer Note */}
          <p className="text-center text-gray-500 text-xs md:text-sm mt-6">
            © 2026 CodeCircle TechHub Scholarship. All rights reserved.
          </p>
        </div>
      </main>
    </div>
  )
}

export default RegistrationSuccess