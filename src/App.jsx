import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import ProtectedRoute from './components/common/ProtectedRoute'
import Loader from './components/common/Loader'

// Public Pages
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import NotFound from './pages/NotFound'
import RegistrationSuccess from './pages/RegistrationSuccess'

// Candidate Pages
import CandidateLayout from './components/layout/CandidateLayout'
import CandidateDashboard from './pages/candidate/Dashboard'
import TestPage from './pages/candidate/TestPage'
import TestInstructions from './pages/candidate/TestInstructions'

// Admin Pages
import AdminLayout from './components/layout/AdminLayout'
import AdminLogin from './pages/admin/Login'
import AdminDashboard from './pages/admin/Dashboard'
import AdminCandidates from './pages/admin/Candidates'
import AdminQuestions from './pages/admin/Questions'
import AdminResults from './pages/admin/Results'
import AdminSettings from './pages/admin/Settings'

// Auth Redirect Component - FIXED VERSION
const AuthRedirect = ({ children }) => {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <Loader fullScreen />
  }

  // Don't redirect on registration-success page at all
  if (location.pathname === '/registration-success') {
    return children
  }

  // If user is logged in and trying to access public/auth pages
  if (user) {
    const isAuthPage = [
      '/login', 
      '/register', 
      '/admin/login', 
      '/forgot-password'
    ].includes(location.pathname)

    if (isAuthPage) {
      if (user.isAdmin) {
        return <Navigate to="/admin/dashboard" replace />
      } else {
        return <Navigate to="/candidate/dashboard" replace />
      }
    }
  }

  return children
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            success: { style: { background: '#10B981', color: '#fff' } },
            error: { style: { background: '#EF4444', color: '#fff' } }
          }}
        />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route 
            path="/login" 
            element={
              <AuthRedirect>
                <LoginPage />
              </AuthRedirect>
            } 
          />
          <Route 
            path="/register" 
            element={
              <AuthRedirect>
                <RegisterPage />
              </AuthRedirect>
            } 
          />
          <Route 
            path="/admin/login" 
            element={
              <AuthRedirect>
                <AdminLogin />
              </AuthRedirect>
            } 
          />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          
          {/* Registration Success Route */}
          <Route path="/registration-success" element={<RegistrationSuccess />} />
          
          {/* Candidate Routes */}
          <Route path="/candidate" element={
            <ProtectedRoute requireAdmin={false}>
              <CandidateLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/candidate/dashboard" replace />} />
            <Route path="dashboard" element={<CandidateDashboard />} />
            <Route path="test/instructions" element={<TestInstructions />} />
            <Route path="test" element={<TestPage />} />
          </Route>
          
          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="candidates" element={<AdminCandidates />} />
            <Route path="questions" element={<AdminQuestions />} />
            <Route path="results" element={<AdminResults />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
          
          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App