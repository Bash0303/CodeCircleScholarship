import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { 
  Home, LogOut, User, Calendar, Clock, AlertCircle, 
  HelpCircle, Shield, Award, Menu, X, LayoutDashboard
} from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import logo from '../../assets/logo.png'

const CandidateLayout = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
  }

  // Check if current route is test page
  const isTestPage = location.pathname.includes('/candidate/test')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="container-responsive">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Toggle sidebar"
              >
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              
              <Link to="/candidate/dashboard" className="flex items-center space-x-3">
                <div className="w-10 h-10">
                  <img src={logo} alt="CodeCircle Logo" className="w-full h-full object-contain" />
                </div>
                <div className="hidden sm:block">
                  <span className="font-bold text-gray-900">Candidate Dashboard</span>
                  <span className="block text-xs text-primary-600 font-medium">CodeCircle TechHub</span>
                </div>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-3 bg-gray-100 rounded-full px-4 py-2">
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-primary-600 font-bold text-sm">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">{user?.name || 'User'}</p>
                  <p className="text-xs text-gray-500">{user?.email || ''}</p>
                </div>
              </div>
              
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="btn-outline border-red-200 text-red-600 hover:bg-red-50 py-2 px-4 text-sm flex items-center"
              >
                <LogOut className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex relative">
        {/* Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 
                       transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                       md:relative md:translate-x-0 transition-transform duration-300 ease-in-out
                       flex flex-col h-screen md:h-auto overflow-y-auto`}>
          <div className="flex-1 flex flex-col pt-6 pb-4">
            {/* User Profile - Mobile */}
            <div className="md:hidden px-6 pb-6 border-b border-gray-200 mb-6">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-primary-600 font-bold text-lg">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="ml-3">
                  <h3 className="font-semibold text-gray-900">{user?.name || 'User'}</h3>
                  <p className="text-sm text-gray-500 break-all">{user?.email || ''}</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-1">
              <Link
                to="/candidate/dashboard"
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 
                         rounded-xl transition-colors group ${
                           location.pathname === '/candidate/dashboard' 
                             ? 'bg-primary-50 text-primary-600' 
                             : ''
                         }`}
              >
                <LayoutDashboard className={`w-5 h-5 mr-3 ${
                  location.pathname === '/candidate/dashboard' 
                    ? 'text-primary-600' 
                    : 'text-gray-500 group-hover:text-primary-600'
                }`} />
                <span className="font-medium">Dashboard</span>
              </Link>
              
              {/* Test Information Section */}
              <div className="mt-8 mb-4 px-4">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Test Information
                </h4>
              </div>
              
              {/* Test Status Cards */}
              <div className="px-4 space-y-3">
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <div className="flex items-center mb-2">
                    <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Test Status</span>
                  </div>
                  <p className="text-xs text-blue-700">
                    {user?.testScheduled 
                      ? `Scheduled: ${user.testDate || 'Date to be announced'}`
                      : 'Awaiting schedule'}
                  </p>
                </div>
                
                <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100">
                  <div className="flex items-center mb-2">
                    <Clock className="w-4 h-4 mr-2 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-800">Duration</span>
                  </div>
                  <p className="text-xs text-yellow-700">10 minutes total time</p>
                </div>
                
                <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                  <div className="flex items-center mb-2">
                    <Award className="w-4 h-4 mr-2 text-green-600" />
                    <span className="text-sm font-medium text-green-800">Passing Score</span>
                  </div>
                  <p className="text-xs text-green-700">80% or above required</p>
                </div>
                
                <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                  <div className="flex items-center mb-2">
                    <AlertCircle className="w-4 h-4 mr-2 text-red-600" />
                    <span className="text-sm font-medium text-red-800">Important</span>
                  </div>
                  <p className="text-xs text-red-700">Anti-cheating measures active</p>
                </div>
              </div>
            </nav>
          </div>
        </aside>

        {/* Main Content - THIS IS WHERE THE CHILD ROUTES WILL RENDER */}
        <main className="flex-1 min-h-[calc(100vh-4rem)] bg-gray-50">
          <div className="container-responsive py-8">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full animate-fade-in">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Logout</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to sign out? You'll need to log in again to access your dashboard.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 btn-outline py-3"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 btn-primary bg-red-600 hover:bg-red-700 py-3"
              >
                Yes, Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CandidateLayout