import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/axios'  // Import api (only once)
import { 
  Users, Calendar, CheckCircle, XCircle, Award,
  TrendingUp, Clock, Mail, Phone, MapPin,
  BarChart3, PieChart, Download, Filter,
  FileText, Loader
} from 'lucide-react'
import toast from 'react-hot-toast'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js'
import { Line, Pie } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

const AdminDashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [exportLoading, setExportLoading] = useState(false)
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalCandidates: 0,
      testsScheduled: 0,
      testsTaken: 0,
      passed: 0,
      failed: 0,
      pending: 0,
      avgScore: 0,
      passRate: 0,
      changes: {
        totalCandidates: '0%',
        testsScheduled: '0%',
        passed: '0%'
      }
    },
    charts: {
      registrationData: {
        labels: [],
        datasets: []
      },
      courseDistribution: {
        labels: [],
        datasets: []
      }
    },
    recentRegistrations: [],
    recentTests: [],
    quickActions: {
      pendingApprovals: 0,
      totalQuestions: 150,
      passedCount: 0
    }
  })
  const [dateRange, setDateRange] = useState('7days')

  // Fetch dashboard data
  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const response = await api.get('/admin/dashboard')
      
      if (response.data.success) {
        setDashboardData(response.data)
      } else {
        toast.error('Failed to load dashboard data')
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast.error(error.response?.data?.message || 'Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = async (range) => {
    try {
      setDateRange(range)
      setLoading(true)
      const response = await api.get(`/admin/dashboard/filter?range=${range}`)
      
      if (response.data.success) {
        // Update dashboard with filtered data
        toast.success(`Showing data for ${range === '7days' ? 'last 7 days' : range === '30days' ? 'last 30 days' : 'last 90 days'}`)
        
        // You might want to update specific parts of dashboardData here
        // based on the filtered response
      }
    } catch (error) {
      console.error('Error filtering dashboard:', error)
      toast.error(error.response?.data?.message || 'Failed to filter data')
    } finally {
      setLoading(false)
    }
  }

  const handleExportReport = async (format = 'json') => {
    try {
      setExportLoading(true)
      
      // For file downloads, we need to handle the response differently
      const response = await api.get(`/admin/dashboard/export?format=${format}`, {
        responseType: format === 'csv' ? 'blob' : 'json'
      })

      if (format === 'csv') {
        // Download CSV file
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `dashboard-report-${new Date().toISOString().split('T')[0]}.csv`)
        document.body.appendChild(link)
        link.click()
        link.remove()
        window.URL.revokeObjectURL(url)
        toast.success('Report downloaded successfully')
      } else {
        // For JSON, check if response.data has report property
        const reportData = response.data.report || response.data
        const dataStr = JSON.stringify(reportData, null, 2)
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
        const exportFileDefaultName = `dashboard-report-${new Date().toISOString().split('T')[0]}.json`
        
        const linkElement = document.createElement('a')
        linkElement.setAttribute('href', dataUri)
        linkElement.setAttribute('download', exportFileDefaultName)
        linkElement.click()
        toast.success('Report downloaded successfully')
      }
    } catch (error) {
      console.error('Error exporting report:', error)
      toast.error(error.response?.data?.message || 'Failed to export report')
    } finally {
      setExportLoading(false)
    }
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-primary-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Welcome back, <span className="text-primary-600">{user?.name || 'Admin'}</span>
          </h1>
          <p className="text-gray-600 mt-2">
            Here's what's happening with your scholarship program today.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => handleExportReport('json')}
            disabled={exportLoading}
            className="btn-outline flex items-center space-x-2"
          >
            {exportLoading ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>Export JSON</span>
          </button>
          <button 
            onClick={() => handleExportReport('csv')}
            disabled={exportLoading}
            className="btn-outline flex items-center space-x-2"
          >
            {exportLoading ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <FileText className="w-4 h-4" />
            )}
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Candidates</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {dashboardData.stats.totalCandidates}
              </p>
              <p className="text-sm text-green-600 mt-2">
                ↑ {dashboardData.stats.changes.totalCandidates} from last week
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tests Scheduled</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {dashboardData.stats.testsScheduled}
              </p>
              <p className="text-sm text-green-600 mt-2">
                ↑ {dashboardData.stats.changes.testsScheduled} from last week
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="card hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Passed</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {dashboardData.stats.passed}
              </p>
              <p className="text-sm text-green-600 mt-2">
                ↑ {dashboardData.stats.changes.passed} from last week
              </p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="card hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Score</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {dashboardData.stats.avgScore}%
              </p>
              <p className="text-sm text-yellow-600 mt-2">
                Based on {dashboardData.stats.testsTaken} tests
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Weekly Registrations</h2>
            <select 
              value={dateRange}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="7days">Last 7 days</option>
              <option value="30days">Last 30 days</option>
              <option value="90days">Last 90 days</option>
            </select>
          </div>
          <div className="h-64">
            {dashboardData.charts.registrationData.labels?.length > 0 ? (
              <Line data={dashboardData.charts.registrationData} options={chartOptions} />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                No registration data available
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Course Distribution</h2>
            <button 
              onClick={() => navigate('/admin/candidates')}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              View Details
            </button>
          </div>
          <div className="h-64 flex items-center justify-center">
            {dashboardData.charts.courseDistribution.labels?.length > 0 ? (
              <Pie data={dashboardData.charts.courseDistribution} options={chartOptions} />
            ) : (
              <div className="text-gray-500">No course data available</div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Recent Registrations</h2>
            <button 
              onClick={() => navigate('/admin/candidates')}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              View All
            </button>
          </div>
          <div className="space-y-4">
            {dashboardData.recentRegistrations.length > 0 ? (
              dashboardData.recentRegistrations.map((registration) => (
                <div key={registration.id || registration._id} className="flex items-start p-4 bg-gray-50 rounded-xl">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-primary-600 font-bold text-sm">
                        {registration.fullName?.charAt(0) || 'U'}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">{registration.fullName}</h4>
                      <span className="text-xs text-gray-500">
                        {new Date(registration.registeredDate).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {registration.email}
                      <span className="ml-2 text-primary-600">• {registration.course}</span>
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No recent registrations
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h2>
          <div className="space-y-4">
            <button 
              onClick={() => navigate('/admin/candidates')}
              className="w-full flex items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl hover:shadow-md transition-shadow"
            >
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div className="ml-4 text-left">
                <p className="font-medium text-gray-900">Review Candidates</p>
                <p className="text-sm text-gray-600">
                  {dashboardData.quickActions.pendingApprovals} pending approvals
                </p>
              </div>
            </button>

            <button 
              onClick={() => navigate('/admin/questions')}
              className="w-full flex items-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl hover:shadow-md transition-shadow"
            >
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div className="ml-4 text-left">
                <p className="font-medium text-gray-900">Manage Questions</p>
                <p className="text-sm text-gray-600">
                  {dashboardData.quickActions.totalQuestions} total questions
                </p>
              </div>
            </button>

            <button 
              onClick={() => navigate('/admin/results')}
              className="w-full flex items-center p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl hover:shadow-md transition-shadow"
            >
              <div className="w-10 h-10 bg-yellow-600 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 text-white" />
              </div>
              <div className="ml-4 text-left">
                <p className="font-medium text-gray-900">View Results</p>
                <p className="text-sm text-gray-600">
                  {dashboardData.quickActions.passedCount} candidates passed
                </p>
              </div>
            </button>

            <button 
              onClick={() => navigate('/admin/settings')}
              className="w-full flex items-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl hover:shadow-md transition-shadow"
            >
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div className="ml-4 text-left">
                <p className="font-medium text-gray-900">Send Notifications</p>
                <p className="text-sm text-gray-600">Bulk email to candidates</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard