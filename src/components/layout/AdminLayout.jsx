// import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
// import { useAuth } from '../../context/AuthContext'
// import { 
//   LayoutDashboard, Users, FileText, Award, 
//   Settings, LogOut, Menu, X, ChevronDown,
//   Shield, Home
// } from 'lucide-react'
// import { useState } from 'react'
// import toast from 'react-hot-toast'
// import logo from '../../assets/logo.png'

// const AdminLayout = () => {
//   const { user, logout } = useAuth()
//   const navigate = useNavigate()
//   const location = useLocation()
//   const [sidebarOpen, setSidebarOpen] = useState(false)
//   const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
//   const [showProfileMenu, setShowProfileMenu] = useState(false)

//   const handleLogout = () => {
//     logout()
//     toast.success('Logged out successfully')
//   }

//   const navigation = [
//     { 
//       name: 'Dashboard', 
//       href: '/admin/dashboard', 
//       icon: LayoutDashboard,
//       current: location.pathname === '/admin/dashboard'
//     },
//     { 
//       name: 'Registered Candidates', 
//       href: '/admin/candidates', 
//       icon: Users,
//       current: location.pathname === '/admin/candidates'
//     },
//     { 
//       name: 'Set Questions', 
//       href: '/admin/questions', 
//       icon: FileText,
//       current: location.pathname === '/admin/questions'
//     },
//     { 
//       name: 'Check Results', 
//       href: '/admin/results', 
//       icon: Award,
//       current: location.pathname === '/admin/results'
//     },
//     { 
//       name: 'Settings', 
//       href: '/admin/settings', 
//       icon: Settings,
//       current: location.pathname === '/admin/settings'
//     }
//   ]

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
//         <div className="px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             <div className="flex items-center space-x-3">
//               <button
//                 onClick={() => setSidebarOpen(!sidebarOpen)}
//                 className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
//               >
//                 {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
//               </button>
              
//               <Link to="/admin/dashboard" className="flex items-center space-x-3">
//                 <div className="w-10 h-10">
//                   <img src={logo} alt="CodeCircle Logo" className="w-full h-full object-contain" />
//                 </div>
//                 <div>
//                   <span className="font-bold text-gray-900">Admin Dashboard</span>
//                   <span className="block text-xs text-primary-600 font-medium">CodeCircle TechHub</span>
//                 </div>
//               </Link>
//             </div>
            
//             <div className="flex items-center space-x-4">
//               <Link 
//                 to="/" 
//                 className="hidden md:flex items-center text-gray-600 hover:text-primary-600 transition-colors"
//               >
//                 <Home className="w-4 h-4 mr-1" />
//                 <span className="text-sm">Website</span>
//               </Link>

//               <div className="relative">
//                 <button
//                   onClick={() => setShowProfileMenu(!showProfileMenu)}
//                   className="flex items-center space-x-3 bg-gray-100 rounded-full px-4 py-2 hover:bg-gray-200 transition-colors"
//                 >
//                   <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center">
//                     <Shield className="w-4 h-4 text-white" />
//                   </div>
//                   <div className="hidden md:block text-left">
//                     <p className="font-medium text-gray-900 text-sm">{user?.name || 'Admin'}</p>
//                     <p className="text-xs text-gray-500">Administrator</p>
//                   </div>
//                   <ChevronDown className="w-4 h-4 text-gray-500 hidden md:block" />
//                 </button>

//                 {showProfileMenu && (
//                   <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-50 animate-fade-in">
//                     <Link
//                       to="/admin/settings"
//                       className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
//                       onClick={() => setShowProfileMenu(false)}
//                     >
//                       <Settings className="w-4 h-4 mr-3" />
//                       Settings
//                     </Link>
//                     <button
//                       onClick={() => {
//                         setShowProfileMenu(false)
//                         setShowLogoutConfirm(true)
//                       }}
//                       className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
//                     >
//                       <LogOut className="w-4 h-4 mr-3" />
//                       Sign Out
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </header>

//       <div className="flex relative">
//         {/* Sidebar Overlay */}
//         {sidebarOpen && (
//           <div 
//             className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
//             onClick={() => setSidebarOpen(false)}
//           />
//         )}

//         {/* Sidebar */}
//         <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 
//                        transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
//                        lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out
//                        flex flex-col h-screen lg:h-auto overflow-y-auto`}>
          
//           {/* Admin Info */}
//           <div className="p-6 border-b border-gray-200">
//             <div className="flex items-center space-x-4">
//               <div className="w-12 h-12 rounded-full bg-primary-600 flex items-center justify-center">
//                 <Shield className="w-6 h-6 text-white" />
//               </div>
//               <div>
//                 <h3 className="font-semibold text-gray-900">{user?.name || 'Admin User'}</h3>
//                 <p className="text-sm text-gray-500">{user?.email || 'admin@codecircle.com'}</p>
//               </div>
//             </div>
//           </div>

//           {/* Navigation */}
//           <nav className="flex-1 px-4 py-6 space-y-1">
//             {navigation.map((item) => (
//               <Link
//                 key={item.name}
//                 to={item.href}
//                 onClick={() => setSidebarOpen(false)}
//                 className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 group
//                   ${item.current 
//                     ? 'bg-primary-50 text-primary-600' 
//                     : 'text-gray-700 hover:bg-gray-100'
//                   }`}
//               >
//                 <item.icon className={`w-5 h-5 mr-3 ${
//                   item.current ? 'text-primary-600' : 'text-gray-500 group-hover:text-primary-600'
//                 }`} />
//                 <span className={`font-medium ${item.current ? 'text-primary-600' : 'text-gray-700'}`}>
//                   {item.name}
//                 </span>
//               </Link>
//             ))}
//           </nav>

//           {/* Logout Button - Mobile */}
//           <div className="p-4 border-t border-gray-200 lg:hidden">
//             <button
//               onClick={() => setShowLogoutConfirm(true)}
//               className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
//             >
//               <LogOut className="w-5 h-5 mr-3" />
//               <span className="font-medium">Sign Out</span>
//             </button>
//           </div>
//         </aside>

//         {/* Main Content */}
//         <main className="flex-1 min-h-[calc(100vh-4rem)] bg-gray-50 p-6 lg:p-8">
//           <Outlet />
//         </main>
//       </div>

//       {/* Logout Confirmation Modal */}
//       {showLogoutConfirm && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-2xl p-6 max-w-md w-full animate-fade-in">
//             <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mx-auto mb-6">
//               <LogOut className="w-8 h-8 text-red-600" />
//             </div>
//             <h3 className="text-xl font-bold text-gray-900 text-center mb-4">
//               Confirm Logout
//             </h3>
//             <p className="text-gray-600 text-center mb-6">
//               Are you sure you want to sign out of the admin portal?
//             </p>
//             <div className="flex space-x-3">
//               <button
//                 onClick={() => setShowLogoutConfirm(false)}
//                 className="flex-1 btn-outline py-3"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleLogout}
//                 className="flex-1 btn-primary bg-red-600 hover:bg-red-700 py-3"
//               >
//                 Yes, Sign Out
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// export default AdminLayout

import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { 
  LayoutDashboard, Users, FileText, Award, 
  Settings, LogOut, Menu, X, ChevronDown,
  Shield, Home
} from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import logo from '../../assets/logo.png'

const AdminLayout = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
  }

  const navigation = [
    { 
      name: 'Dashboard', 
      href: '/admin/dashboard', 
      icon: LayoutDashboard,
      current: location.pathname === '/admin/dashboard'
    },
    { 
      name: 'Registered Candidates', 
      href: '/admin/candidates', 
      icon: Users,
      current: location.pathname === '/admin/candidates'
    },
    { 
      name: 'Set Questions', 
      href: '/admin/questions', 
      icon: FileText,
      current: location.pathname === '/admin/questions'
    },
    { 
      name: 'Check Results', 
      href: '/admin/results', 
      icon: Award,
      current: location.pathname === '/admin/results'
    },
    { 
      name: 'Settings', 
      href: '/admin/settings', 
      icon: Settings,
      current: location.pathname === '/admin/settings'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              
              <Link to="/admin/dashboard" className="flex items-center space-x-3">
                <div className="w-10 h-10">
                  <img src={logo} alt="CodeCircle Logo" className="w-full h-full object-contain" />
                </div>
                <div>
                  <span className="font-bold text-gray-900">Admin Dashboard</span>
                  <span className="block text-xs text-primary-600 font-medium">CodeCircle TechHub</span>
                </div>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link 
                to="/" 
                className="hidden md:flex items-center text-gray-600 hover:text-primary-600 transition-colors"
              >
                <Home className="w-4 h-4 mr-1" />
                <span className="text-sm">Website</span>
              </Link>

              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-3 bg-gray-100 rounded-full px-4 py-2 hover:bg-gray-200 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="font-medium text-gray-900 text-sm">{user?.name || 'Admin'}</p>
                    <p className="text-xs text-gray-500">Administrator</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-500 hidden md:block" />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-50 animate-fade-in">
                    <Link
                      to="/admin/settings"
                      className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <Settings className="w-4 h-4 mr-3" />
                      Settings
                    </Link>
                    <button
                      onClick={() => {
                        setShowProfileMenu(false)
                        setShowLogoutConfirm(true)
                      }}
                      className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-screen overflow-hidden">
        {/* Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar - FIXED: Made sticky and proper height */}
        <aside className={`fixed lg:sticky top-0 left-0 z-50 w-72 h-screen bg-white border-r border-gray-200 
                       transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                       lg:translate-x-0 transition-transform duration-300 ease-in-out
                       flex flex-col overflow-y-auto`}>
          
          {/* Admin Info */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-primary-600 flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{user?.name || 'Admin User'}</h3>
                <p className="text-sm text-gray-500 truncate">{user?.email || 'admin@codecircle.com'}</p>
              </div>
            </div>
          </div>

          {/* Navigation - FIXED: No dropdown issues */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 group
                  ${item.current 
                    ? 'bg-primary-50 text-primary-600' 
                    : 'text-gray-700 hover:bg-gray-100'
                  }`}
              >
                <item.icon className={`w-5 h-5 mr-3 flex-shrink-0 ${
                  item.current ? 'text-primary-600' : 'text-gray-500 group-hover:text-primary-600'
                }`} />
                <span className={`font-medium whitespace-nowrap ${item.current ? 'text-primary-600' : 'text-gray-700'}`}>
                  {item.name}
                </span>
                {item.current && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-600 flex-shrink-0"></div>
                )}
              </Link>
            ))}
          </nav>

          {/* Logout Button - Mobile */}
          <div className="p-4 border-t border-gray-200 lg:hidden">
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
            >
              <LogOut className="w-5 h-5 mr-3 flex-shrink-0" />
              <span className="font-medium whitespace-nowrap">Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Main Content - FIXED: Proper scrolling */}
        <main className="flex-1 h-screen overflow-y-auto bg-gray-50">
          <div className="p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full animate-fade-in">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mx-auto mb-6">
              <LogOut className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 text-center mb-4">
              Confirm Logout
            </h3>
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to sign out of the admin portal?
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

export default AdminLayout