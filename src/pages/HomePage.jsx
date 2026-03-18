import { useState, useEffect } from 'react'
import Header from '../components/common/Header'
import Footer from '../components/common/Footer'
import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle, Clock, Users, Award, ChevronRight } from 'lucide-react'
import logo from '../assets/logo.png'
import api from '../utils/axios'
import { useAuth } from '../context/AuthContext'

const HomePage = () => {
  const { user } = useAuth();
  const [registrationStatus, setRegistrationStatus] = useState({ 
    enabled: true, 
    message: '', 
    openDate: null, 
    closeDate: null,
    loading: true
  });

  useEffect(() => {
    const checkRegistration = async () => {
      if (user) {
        try {
          const response = await api.get('/admin/settings');
          if (response.data.success) {
            const general = response.data.settings.general;
            setRegistrationStatus({
              enabled: general.registrationEnabled,
              message: general.registrationMessage,
              openDate: general.registrationOpenDate,
              closeDate: general.registrationCloseDate,
              loading: false
            });
            return;
          }
        } catch (error) {
          console.error('Error checking registration status:', error);
        }
      }
      
      setRegistrationStatus({
        enabled: true,
        message: '',
        openDate: null,
        closeDate: null,
        loading: false
      });
    };
    
    checkRegistration();
  }, [user]);

  const features = [
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: 'Quality Training',
      description: 'Practical sessions led by industry experts with hands-on projects'
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'Flexible Learning',
      description: 'Learn at your own pace with structured curriculum and support'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Community Support',
      description: 'Join a network of like-minded individuals and mentors'
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: 'Scholarship Opportunity',
      description: 'Get fully funded training based on your test performance'
    }
  ]

  const courses = [
    'UI/UX Design',
    'Graphic Design & Branding',
    'Frontend Development',
    'Backend Development',
    'Data Analysis',
    'Cyber Security',
    'IoT Embedded Systems',
    'Full-Stack Development',
    'Architectural/Civil Engineering Design Packages'
  ]

  return (
    <div className="min-h-screen flex flex-col w-full max-w-[100vw] overflow-x-hidden">
      <Header />
      
      <main className="flex-grow w-full">
        {/* Hero Section */}
        <section className="relative w-full bg-gradient-to-br from-primary-600 to-primary-800">
          {/* Background overlay */}
          <div className="absolute inset-0 bg-black/5"></div>
          
          {/* Content */}
          <div className="relative container-responsive py-16 md:py-20 lg:py-28 w-full">
            <div className="text-center max-w-4xl mx-auto px-4 sm:px-6">
              {/* Logo */}
              <div className="flex justify-center mb-6 md:mb-8">
                <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 bg-white rounded-2xl p-3 sm:p-4 shadow-2xl">
                  <img 
                    src={logo} 
                    alt="CodeCircle TechHub Logo" 
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              
              {/* Title - FIXED */}
              <h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                Welcome to <span className="text-secondary-300">CodeCircle</span> TechHub Scholarship
              </h1>
              
              {/* Description */}
              <p className="text-white text-base sm:text-lg md:text-xl mb-8 leading-relaxed max-w-3xl mx-auto opacity-90">
                CodeCircle is a tech community dedicated to training and empowering individuals with in-demand digital skills. 
                We offer practical sessions on UI/UX & Graphic Design, Data Analysis, Frontend & Backend Development, 
                Cybersecurity, IoT & Embedded Systems, and essential Application Packages for professionals.
              </p>
              
              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                <a 
                  href="https://www.codecircle.com.ng" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto bg-secondary-500 hover:bg-secondary-600 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center justify-center gap-2"
                >
                  <span>Visit Official Website</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                
                <Link 
                  to="/register" 
                  className="w-full sm:w-auto bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center justify-center gap-2"
                >
                  <span>Apply for Scholarship</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Registration Status Banner */}
              {!registrationStatus.loading && !registrationStatus.enabled && user && (
                <div className="mt-4 p-4 bg-yellow-500/20 border border-yellow-400/30 rounded-lg backdrop-blur-sm max-w-2xl mx-auto">
                  <p className="text-yellow-100">
                    {registrationStatus.message || 'Registration is currently closed. Please check back later.'}
                  </p>
                  {registrationStatus.openDate && (
                    <p className="text-yellow-100/80 text-sm mt-2">
                      Scheduled to open: {new Date(registrationStatus.openDate).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Wave SVG */}
          <div className="absolute bottom-0 left-0 right-0 w-full leading-none pointer-events-none">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 1440 320" 
              className="w-full h-auto"
              style={{ maxHeight: '120px' }}
            >
              <path 
                fill="#ffffff" 
                fillOpacity="1" 
                d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,149.3C960,160,1056,160,1152,138.7C1248,117,1344,75,1392,53.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              />
            </svg>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="container-responsive">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Why Choose <span className="text-primary-600">CodeCircle</span>?
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Comprehensive training designed to help you succeed in the tech industry
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all"
                >
                  <div className="text-primary-600 mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Courses Section */}
        <section className="py-16 bg-gray-50">
          <div className="container-responsive">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Available <span className="text-primary-600">Courses</span>
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Choose from our comprehensive range of tech courses
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.map((course, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-xl p-5 border border-gray-200 hover:border-primary-300 hover:shadow-lg transition-all"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center mr-4 font-bold">
                      {index + 1}
                    </div>
                    <h3 className="font-medium text-gray-900">{course}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="container-responsive">
            <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl shadow-xl p-8 md:p-12 text-white">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
                  Ready to Start Your Tech Journey?
                </h2>
                <p className="text-lg mb-8 opacity-90">
                  Take our scholarship test and get a chance to receive fully funded training in your chosen tech field.
                  Score <span className="font-bold text-secondary-300">80% or above</span> to qualify.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link 
                    to="/register" 
                    className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors shadow-lg"
                  >
                    Register Now
                  </Link>
                  <Link 
                    to="/login" 
                    className="border-2 border-white text-white hover:bg-white/10 px-8 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Login to Continue
                  </Link>
                </div>
                
                <div className="mt-10 pt-8 border-t border-white/20">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold mb-1">80%+</div>
                      <div className="text-sm opacity-80">Passing Score</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold mb-1">10min</div>
                      <div className="text-sm opacity-80">Test Duration</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold mb-1">100%</div>
                      <div className="text-sm opacity-80">Scholarship Coverage</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}

export default HomePage