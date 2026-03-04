import { Link } from 'react-router-dom'
import { Globe, Mail, Phone, MapPin, Code2 } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="container-responsive py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <Code2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">CodeCircle TechHub</h3>
                <p className="text-blue-300 text-sm">Scholarship Program</p>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Empowering individuals with in-demand digital skills through practical training 
              and community support. Join us to learn, build, and grow in tech.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/" 
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/register" 
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Apply for Scholarship
                </Link>
              </li>
              <li>
                <Link 
                  to="/login" 
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Candidate Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <Globe className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <a 
                  href="https://www.codecircle.com.ng" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  www.codecircle.com.ng
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <a 
                  href="mailto:info.codecircle@gmail.com"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  info.codecircle@gmail.com
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <a 
                  href="tel:+2349063836085"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  +234 906 383 6085
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300">
                  K.M 5, Dalex Royal College, Sango, Ilorin, Kwara State
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-center md:text-left">
              &copy; {currentYear} CodeCircle TechHub Scholarship. All rights reserved.
            </p>
            <p className="text-gray-500 text-sm mt-2 md:mt-0">
              Powered by CodeCircle 2026 Tech Scholarship
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer