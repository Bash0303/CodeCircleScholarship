import { Link, useLocation } from 'react-router-dom'
import { Home, LogIn, Menu, X } from 'lucide-react'
import { useState } from 'react'
import logo from '../../assets/logo.png' // Correct path
const Header = () => {
  const location = useLocation()
  const isHomePage = location.pathname === '/'
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <nav className="container-responsive">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10">
              <img 
                src={logo} 
                alt="CodeCircle Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-xl text-gray-900">CodeCircle</span>
              <span className="block text-xs text-primary-600 font-medium">
                TechHub Scholarship
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {!isHomePage && (
              <Link 
                to="/" 
                className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 
                         transition-colors duration-200 font-medium"
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Link>
            )}
            <Link 
              to="/register" 
              className="text-primary-600 hover:text-primary-700 font-medium 
                       transition-colors duration-200"
            >
              Apply
            </Link>
            <Link 
              to="/login" 
              className="btn-primary py-2.5 px-6 text-sm"
            >
              Login
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden animate-slide-in">
            <div className="pt-4 pb-6 border-t border-gray-200 space-y-4">
              {!isHomePage && (
                <Link 
                  to="/" 
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-50 
                           transition-colors duration-200 text-gray-700"
                >
                  <Home className="w-5 h-5" />
                  <span>Home</span>
                </Link>
              )}
              <Link 
                to="/register" 
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-50 
                         transition-colors duration-200 text-gray-700"
              >
                <span>Apply for Scholarship</span>
              </Link>
              <Link 
                to="/login" 
                onClick={() => setIsMenuOpen(false)}
                className="btn-primary w-full justify-center py-3 flex items-center"
              >
                <LogIn className="w-5 h-5 mr-2" />
                Login
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

export default Header