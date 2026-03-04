import { Link } from 'react-router-dom'
import Header from '../components/common/Header'
import Footer from '../components/common/Footer'
import { Home, AlertTriangle } from 'lucide-react'

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center space-y-8 animate-fade-in">
          <div className="flex justify-center">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-12 h-12 text-red-600" />
            </div>
          </div>
          
          <div>
            <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
            <p className="text-gray-600 mb-8">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>
          
          <div className="space-y-4">
            <Link 
              to="/" 
              className="btn-primary inline-flex items-center justify-center space-x-2"
            >
              <Home className="w-5 h-5" />
              <span>Return to Home</span>
            </Link>
            
            <Link 
              to="/login" 
              className="btn-outline inline-flex items-center justify-center space-x-2"
            >
              <span>Go to Login</span>
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}

export default NotFound