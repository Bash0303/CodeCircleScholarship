import { Link } from 'react-router-dom'
import Header from '../components/common/Header'
import Footer from '../components/common/Footer'
import { Mail, Phone, ArrowLeft, AlertCircle, Shield, Lock, User } from 'lucide-react'
import logo from '../assets/logo.png' // Updated path

const ForgotPasswordPage = () => {
  const contactInfo = {
    phone: '+2349063836085',
    email: 'info.codecircle@gmail.com'
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
                to="/login" 
                className="inline-flex items-center text-gray-600 hover:text-primary-600 
                         transition-colors duration-200 mb-6"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Login
              </Link>
              
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 rounded-xl bg-white p-3 shadow-lg">
                  <img src={logo} alt="CodeCircle Logo" className="w-full h-full object-contain" />
                </div>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                Password Assistance
              </h1>
              <p className="text-gray-600 text-lg">
                Contact our admin team for secure password recovery
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <div className="card">
                  <div className="flex items-start mb-8">
                    <AlertCircle className="h-8 w-8 text-secondary-500 flex-shrink-0 mt-0.5" />
                    <div className="ml-4">
                      <h3 className="text-xl font-semibold text-gray-900">Password Recovery Process</h3>
                      <p className="mt-2 text-gray-600">
                        For security reasons, password recovery is handled manually by our admin team. 
                        Please contact them using the information below.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Contact via Phone */}
                    <div className="flex items-start p-6 bg-gradient-to-r from-primary-50 to-primary-100 
                                  rounded-2xl border border-primary-200">
                      <div className="flex-shrink-0">
                        <Phone className="h-8 w-8 text-primary-600" />
                      </div>
                      <div className="ml-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">Call Admin</h4>
                        <a 
                          href={`tel:${contactInfo.phone}`}
                          className="text-2xl font-bold text-primary-600 hover:text-primary-700 
                                   transition-colors duration-200 block mb-3"
                        >
                          {contactInfo.phone}
                        </a>
                        <p className="text-gray-600">
                          Available during business hours (9 AM - 5 PM WAT, Monday - Friday)
                        </p>
                      </div>
                    </div>

                    {/* Contact via Email */}
                    <div className="flex items-start p-6 bg-gradient-to-r from-secondary-50 to-secondary-100 
                                  rounded-2xl border border-secondary-200">
                      <div className="flex-shrink-0">
                        <Mail className="h-8 w-8 text-secondary-600" />
                      </div>
                      <div className="ml-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">Email Admin</h4>
                        <a 
                          href={`mailto:${contactInfo.email}`}
                          className="text-xl font-semibold text-secondary-600 hover:text-secondary-700 
                                   transition-colors duration-200 block mb-3 break-all"
                        >
                          {contactInfo.email}
                        </a>
                        <p className="text-gray-600">
                          Include your full name and registered email in your message
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-10 pt-8 border-t border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <User className="w-5 h-5 mr-2 text-primary-600" />
                      Information to Provide
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-xl p-4">
                        <div className="text-sm font-medium text-gray-500 mb-1">Required</div>
                        <ul className="text-sm text-gray-700 space-y-2">
                          <li className="flex items-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mr-2"></div>
                            Your full name
                          </li>
                          <li className="flex items-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mr-2"></div>
                            Registered email address
                          </li>
                        </ul>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-4">
                        <div className="text-sm font-medium text-gray-500 mb-1">Helpful (Optional)</div>
                        <ul className="text-sm text-gray-700 space-y-2">
                          <li className="flex items-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-secondary-500 mr-2"></div>
                            Phone number used during registration
                          </li>
                          <li className="flex items-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-secondary-500 mr-2"></div>
                            Course you applied for
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="mt-10 text-center">
                    <Link 
                      to="/login" 
                      className="btn-primary inline-flex items-center justify-center space-x-2 px-10"
                    >
                      <ArrowLeft className="w-5 h-5" />
                      <span>Return to Login</span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Security Notice */}
                <div className="card bg-gradient-to-br from-gray-900 to-gray-800 text-white">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    Security Notice
                  </h3>
                  <p className="text-sm text-white/90 leading-relaxed">
                    For your security, never share your password with anyone. 
                    CodeCircle admin will never ask for your password. 
                    Always verify the identity of the person you're communicating with.
                  </p>
                </div>

                {/* Process Info */}
                <div className="card">
                  <h3 className="font-semibold text-gray-900 mb-4">Recovery Timeline</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="w-6 h-6 rounded-full bg-primary-600 text-white text-xs flex items-center justify-center mr-3 mt-0.5">
                        1
                      </div>
                      <div>
                        <p className="font-medium text-sm">Contact Admin</p>
                        <p className="text-xs text-gray-600 mt-1">Call or email with required information</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-6 h-6 rounded-full bg-primary-600 text-white text-xs flex items-center justify-center mr-3 mt-0.5">
                        2
                      </div>
                      <div>
                        <p className="font-medium text-sm">Identity Verification</p>
                        <p className="text-xs text-gray-600 mt-1">Admin will verify your identity</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-6 h-6 rounded-full bg-primary-600 text-white text-xs flex items-center justify-center mr-3 mt-0.5">
                        3
                      </div>
                      <div>
                        <p className="font-medium text-sm">Password Reset</p>
                        <p className="text-xs text-gray-600 mt-1">You'll receive reset instructions</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Warning Card */}
                <div className="card bg-red-50 border-red-200">
                  <div className="flex">
                    <Lock className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">Important</h3>
                      <div className="mt-2 text-sm text-red-700">
                        <p>
                          Do not share your password recovery link with anyone. 
                          It contains sensitive information about your account.
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

export default ForgotPasswordPage