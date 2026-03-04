import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/axios'  // Add this import
import { 
  Award, Search, Download, Filter, CheckCircle,
  XCircle, Clock, TrendingUp, TrendingDown,
  Mail, Phone, User, BookOpen, ChevronLeft, ChevronRight,
  Send, Eye, BarChart3, RefreshCw
} from 'lucide-react'
import toast from 'react-hot-toast'
import * as XLSX from 'xlsx'
import SendMessageModal from '../../components/admin/SendMessageModal'

const AdminResults = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCandidate, setSelectedCandidate] = useState(null)
  const [showMessageModal, setShowMessageModal] = useState(false)
  const [filterScore, setFilterScore] = useState('all')
  
  const [results, setResults] = useState([])
  const [stats, setStats] = useState({
    total: 0,
    passed: 0,
    failed: 0,
    approved: 0,
    averageScore: 0,
    passRate: 0,
    byCourse: {}
  })
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  })
  const [recentActivity, setRecentActivity] = useState([])

  // Fetch results from API
  const fetchResults = async () => {
    setLoading(true)
    try {
      const response = await api.get(
        `/admin/results?page=${currentPage}&limit=10&filter=${filterScore}`
      )

      if (response.data.success) {
        // Map the API response to match your component's expected format
        const mappedResults = response.data.results.map(r => ({
          id: r.id,
          name: r.name,
          email: r.email,
          phone: r.phone,
          course: r.course,
          testDate: r.testDate ? new Date(r.testDate).toLocaleDateString('en-CA') : 'N/A',
          testTime: r.testTime || 'N/A',
          score: r.score,
          percentage: r.score,
          passed: r.passed,
          status: r.status || (r.passed ? 'passed' : 'failed'),
          answers: r.answers || {}
        }))

        setResults(mappedResults)
        setPagination(response.data.pagination)
        setStats(response.data.stats)
      }
    } catch (error) {
      console.error('Error fetching results:', error)
      toast.error(error.response?.data?.message || 'Failed to load results')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // Fetch stats from API
  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/results/stats')

      if (response.data.success) {
        setStats(response.data.stats)
        setRecentActivity(response.data.recentActivity || [])
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  // Fetch single result details
  const fetchResultDetails = async (resultId) => {
    try {
      const response = await api.get(`/admin/results/${resultId}`)

      if (response.data.success) {
        return response.data.result
      }
    } catch (error) {
      console.error('Error fetching result details:', error)
      toast.error(error.response?.data?.message || 'Failed to load result details')
    }
    return null
  }

  // Fetch candidate results
  const fetchCandidateResults = async (candidateId) => {
    try {
      const response = await api.get(`/admin/results/candidate/${candidateId}`)

      if (response.data.success) {
        return response.data.results
      }
    } catch (error) {
      console.error('Error fetching candidate results:', error)
      toast.error(error.response?.data?.message || 'Failed to load candidate results')
    }
    return []
  }

  // Handle approve result
  const handleApproveResult = async (candidate) => {
    try {
      const response = await api.post(`/admin/results/${candidate.id}/approve`)

      if (response.data.success) {
        // Update the result in the list
        setResults(prev => prev.map(r => {
          if (r.id === candidate.id) {
            return { ...r, status: 'approved' }
          }
          return r
        }))
        
        toast.success(response.data.message || `Result approved for ${candidate.name}`)
        fetchStats() // Refresh stats
      }
    } catch (error) {
      console.error('Error approving result:', error)
      toast.error(error.response?.data?.message || 'Failed to approve result')
    }
  }

  // Handle send message
  const handleSendMessage = async (candidate, message) => {
    try {
      const response = await api.post(`/admin/candidates/${candidate.id}/send-message`, { message })

      if (response.data.success) {
        toast.success(response.data.message || `Result notification sent to ${candidate.name}`)
      }
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error(error.response?.data?.message || 'Failed to send message')
    }
  }

  // Export to CSV/Excel
  const exportToCSV = async () => {
    try {
      const format = 'csv'
      // Using axios with blob response type
      const response = await api.get(`/admin/results/export?format=${format}&filter=${filterScore}`, {
        responseType: 'blob'
      })

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const a = document.createElement('a')
      a.href = url
      a.download = `test_results_${new Date().toISOString().split('T')[0]}.${format}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

      toast.success('Results exported successfully!')
    } catch (error) {
      console.error('Error exporting results:', error)
      
      // Fallback to client-side export if API fails
      const exportData = results.map(r => ({
        'Candidate ID': r.id,
        'Name': r.name,
        'Email': r.email,
        'Phone': r.phone,
        'Course': r.course,
        'Test Date': r.testDate,
        'Test Time': r.testTime,
        'Score': `${r.score}%`,
        'Status': r.passed ? 'Passed' : 'Failed',
        'Approved': r.status === 'approved' ? 'Yes' : 'No'
      }))
      
      const worksheet = XLSX.utils.json_to_sheet(exportData)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Results')
      XLSX.writeFile(workbook, `test_results_${new Date().toISOString().split('T')[0]}.xlsx`)
      toast.success('Results exported successfully!')
    }
  }

  // Handle view details
  const handleViewDetails = async (result) => {
    const details = await fetchResultDetails(result.id)
    if (details) {
      // Navigate to result details page or show modal
      console.log('Result details:', details)
      toast.success(`Viewing details for ${result.name}`)
    }
  }

  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true)
    fetchResults()
    fetchStats()
  }

  // Handle filter change
  const handleFilterChange = (e) => {
    setFilterScore(e.target.value)
    setCurrentPage(1)
  }

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
  }

  // Fetch results when page or filter changes
  useEffect(() => {
    fetchResults()
  }, [currentPage, filterScore])

  // Fetch stats on component mount
  useEffect(() => {
    fetchStats()
  }, [])

  // Client-side search filtering
  const filteredResults = results.filter(result => {
    const matchesSearch = 
      result.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.id?.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesSearch
  })

  // Pagination (client-side for display after search)
  const startIndex = (currentPage - 1) * pagination.limit
  const paginatedResults = filteredResults.slice(startIndex, startIndex + pagination.limit)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Test Results
          </h1>
          <p className="text-gray-600 mt-2">
            Review and manage candidate test performances
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="btn-secondary flex items-center space-x-2"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={exportToCSV}
            className="btn-primary flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export Results</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tests</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total || 0}</p>
              <p className="text-sm text-gray-500 mt-2">Completed tests</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Passed</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{stats.passed || 0}</p>
              <p className="text-sm text-gray-500 mt-2">{stats.passRate || 0}% pass rate</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Failed</p>
              <p className="text-3xl font-bold text-red-600 mt-2">{stats.failed || 0}</p>
              <p className="text-sm text-gray-500 mt-2">{100 - (stats.passRate || 0)}% fail rate</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Score</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.averageScore || 0}%</p>
              <p className="text-sm text-gray-500 mt-2">Overall performance</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          
          {/* Score Filter */}
          <select
            value={filterScore}
            onChange={handleFilterChange}
            className="input-field md:w-48"
          >
            <option value="all">All Results</option>
            <option value="passed">Passed (80%+)</option>
            <option value="failed">Failed (Below 80%)</option>
            <option value="approved">Approved</option>
          </select>
        </div>
      </div>

      {/* Loading State */}
      {loading && !refreshing && (
        <div className="card p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-2 text-gray-600">Loading results...</p>
        </div>
      )}

      {/* Results Table */}
      {!loading && (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Candidate
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Test Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedResults.length > 0 ? (
                  paginatedResults.map((result) => (
                    <tr key={result.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                            <span className="text-primary-600 font-bold">
                              {result.name?.charAt(0) || '?'}
                            </span>
                          </div>
                          <div className="ml-3">
                            <p className="font-medium text-gray-900">{result.name}</p>
                            <p className="text-xs text-gray-500">{result.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-gray-900">
                          {result.course}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{result.testDate}</p>
                          <p className="text-xs text-gray-500">{result.testTime}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <span className={`text-lg font-bold ${
                            result.passed ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {result.score}%
                          </span>
                          {result.passed ? (
                            <TrendingUp className="w-4 h-4 text-green-600 ml-2" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-600 ml-2" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {result.passed ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            {result.status === 'approved' ? 'Approved' : 'Passed'}
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <XCircle className="w-3 h-3 mr-1" />
                            Failed
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          {result.passed && result.status !== 'approved' && (
                            <button
                              onClick={() => handleApproveResult(result)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Approve Result"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                          
                          <button
                            onClick={() => {
                              setSelectedCandidate(result)
                              setShowMessageModal(true)
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Send Message"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => handleViewDetails(result)}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                      <Award className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                      <p className="text-lg font-medium">No results found</p>
                      <p className="text-sm">No test results available yet</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {startIndex + 1} to {Math.min(startIndex + pagination.limit, filteredResults.length)} of {filteredResults.length} results
              </p>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="px-4 py-2 text-sm font-medium text-gray-900">
                  Page {currentPage} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === pagination.totalPages}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Recent Activity Section */}
      {recentActivity.length > 0 && (
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{activity.name}</p>
                    <p className="text-xs text-gray-500">{activity.action}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-400">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Send Message Modal */}
      {showMessageModal && selectedCandidate && (
        <SendMessageModal
          candidate={selectedCandidate}
          onClose={() => {
            setShowMessageModal(false)
            setSelectedCandidate(null)
          }}
          onSend={handleSendMessage}
          resultMessage={true}
        />
      )}
    </div>
  )
}

export default AdminResults