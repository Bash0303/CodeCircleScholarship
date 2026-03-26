// import { useState, useEffect } from 'react'
// import { useNavigate } from 'react-router-dom'
// import api from '../../utils/axios'
// import { useAuth } from '../../context/AuthContext'
// import { 
//   Users, Search, Download, Filter, Calendar,
//   Mail, Phone, MapPin, BookOpen, CheckCircle,
//   XCircle, Clock, ChevronLeft, ChevronRight,
//   Upload, Send, MoreVertical, Eye, RefreshCw
// } from 'lucide-react'
// import toast from 'react-hot-toast'
// import * as XLSX from 'xlsx'
// import UploadTestModal from '../../components/admin/UploadTestModal'
// import SendMessageModal from '../../components/admin/SendMessageModal'
// import RescheduleTestModal from '../../components/admin/RescheduleTestModal'

// const AdminCandidates = () => {
//   const { user } = useAuth()
//   const navigate = useNavigate()
//   const [loading, setLoading] = useState(false)
//   const [refreshing, setRefreshing] = useState(false)
//   const [searchTerm, setSearchTerm] = useState('')
//   const [currentPage, setCurrentPage] = useState(1)
//   const [selectedCandidate, setSelectedCandidate] = useState(null)
//   const [showUploadModal, setShowUploadModal] = useState(false)
//   const [showMessageModal, setShowMessageModal] = useState(false)
//   const [showRescheduleModal, setShowRescheduleModal] = useState(false)
//   const [filterStatus, setFilterStatus] = useState('all')
//   const [filterCourse, setFilterCourse] = useState('all')
  
//   // State for API data
//   const [candidates, setCandidates] = useState([])
//   const [pagination, setPagination] = useState({
//     total: 0,
//     page: 1,
//     limit: 10,
//     totalPages: 1
//   })
//   const [availableCourses, setAvailableCourses] = useState([])

//   // Fetch candidates
//   const fetchCandidates = async () => {
//     setLoading(true)
//     try {
//       const response = await api.get(
//         `/admin/candidates?page=${currentPage}&limit=10&status=${filterStatus}&course=${filterCourse}`
//       )

//       if (response.data.success) {
//         const mappedCandidates = response.data.candidates.map(candidate => ({
//           id: candidate.id,
//           name: candidate.name,
//           email: candidate.email,
//           phone: candidate.phone,
//           state: candidate.state,
//           lga: candidate.lga,
//           gender: candidate.gender,
//           course: candidate.course,
//           registeredDate: candidate.registeredDate,
//           testScheduled: candidate.testScheduled === true,
//           testDate: candidate.testDate ? new Date(candidate.testDate).toLocaleDateString('en-CA') : null,
//           testTime: candidate.testTime,
//           hasTakenTest: candidate.hasTakenTest === true,
//           testScore: candidate.testScore,
//           status: candidate.approved ? 'approved' : 
//                   candidate.hasTakenTest ? (candidate.testScore >= 80 ? 'passed' : 'failed') :
//                   candidate.testScheduled ? 'scheduled' : 'pending',
//           approved: candidate.approved === true,
//           passed: candidate.passed === true
//         }))

//         setCandidates(mappedCandidates)
//         setPagination(response.data.pagination)
//         setAvailableCourses(response.data.filters?.courses || [])
//       }
//     } catch (error) {
//       console.error('Error fetching candidates:', error)
//       toast.error(error.response?.data?.message || 'Failed to load candidates')
//     } finally {
//       setLoading(false)
//       setRefreshing(false)
//     }
//   }

//   // Fetch single candidate details
//   const fetchCandidateDetails = async (candidateId) => {
//     try {
//       const response = await api.get(`/admin/candidates/${candidateId}`)
//       if (response.data.success) {
//         return response.data.candidate
//       }
//     } catch (error) {
//       console.error('Error fetching candidate details:', error)
//       toast.error(error.response?.data?.message || 'Failed to load candidate details')
//     }
//     return null
//   }

//   // Handle schedule test
//   const handleUploadTest = async (candidate, testDate, testTime) => {
//     try {
//       const response = await api.post(`/admin/candidates/${candidate.id}/schedule-test`, {
//         testDate,
//         testTime
//       })

//       if (response.data.success) {
//         setCandidates(prev => prev.map(c => 
//           c.id === candidate.id 
//             ? { ...c, testScheduled: true, testDate, testTime, status: 'scheduled' }
//             : c
//         ))
//         toast.success(response.data.message || `Test scheduled for ${candidate.name}`)
//         setShowUploadModal(false)
//         setSelectedCandidate(null)
//       }
//     } catch (error) {
//       console.error('Error scheduling test:', error)
//       toast.error(error.response?.data?.message || 'Failed to schedule test')
//     }
//   }

//   // Handle reschedule test
//   const handleRescheduleTest = async (candidate, testDate, testTime, reason) => {
//     try {
//       setLoading(true)
      
//       const response = await api.put(`/admin/candidates/${candidate.id}/reschedule-test`, {
//         testDate,
//         testTime,
//         reason
//       })

//       if (response.data.success) {
//         setCandidates(prev => prev.map(c => 
//           c.id === candidate.id 
//             ? { 
//                 ...c, 
//                 testScheduled: true,
//                 hasTakenTest: false,
//                 testScore: null,
//                 approved: false,
//                 passed: false,
//                 testDate,
//                 testTime,
//                 status: 'scheduled'
//               }
//             : c
//         ))
        
//         setShowRescheduleModal(false)
//         setSelectedCandidate(null)
//         toast.success(`Test rescheduled for ${candidate.name}`)
//         fetchCandidates()
//       }
//     } catch (error) {
//       console.error('Error rescheduling test:', error)
//       toast.error(error.response?.data?.message || 'Failed to reschedule test')
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Handle bulk schedule
//   const handleBulkSchedule = async (candidateIds, testDate, testTime) => {
//     try {
//       const response = await api.post('/admin/candidates/bulk-schedule', {
//         candidateIds,
//         testDate,
//         testTime
//       })

//       if (response.data.success) {
//         fetchCandidates()
        
//         if (response.data.results.success.length > 0) {
//           toast.success(`Successfully scheduled tests for ${response.data.results.success.length} candidates`)
//         }
//         if (response.data.results.failed.length > 0) {
//           toast.error(`Failed to schedule for ${response.data.results.failed.length} candidates`)
//         }
//       }
//     } catch (error) {
//       console.error('Error bulk scheduling:', error)
//       toast.error(error.response?.data?.message || 'Failed to schedule tests')
//     }
//   }

//   // Handle approve score
//   const handleApproveScore = async (candidate) => {
//     try {
//       const response = await api.post(`/admin/candidates/${candidate.id}/approve`)

//       if (response.data.success) {
//         setCandidates(prev => prev.map(c => 
//           c.id === candidate.id 
//             ? { ...c, approved: true, status: 'approved' }
//             : c
//         ))
//         toast.success(response.data.message || `Score approved for ${candidate.name}`)
//       }
//     } catch (error) {
//       console.error('Error approving score:', error)
//       toast.error(error.response?.data?.message || 'Failed to approve score')
//     }
//   }

//   // Handle send message
//   const handleSendMessage = async (candidate, message) => {
//     try {
//       const response = await api.post(`/admin/candidates/${candidate.id}/send-message`, { message })

//       if (response.data.success) {
//         toast.success(response.data.message || `Message sent to ${candidate.name}`)
//         setShowMessageModal(false)
//         setSelectedCandidate(null)
//       }
//     } catch (error) {
//       console.error('Error sending message:', error)
//       toast.error(error.response?.data?.message || 'Failed to send message')
//     }
//   }

//   // Export to CSV
//   const exportToCSV = () => {
//     const exportData = candidates.map(c => ({
//       ID: c.id,
//       Name: c.name,
//       Email: c.email,
//       Phone: c.phone,
//       State: c.state,
//       LGA: c.lga,
//       Gender: c.gender,
//       Course: c.course,
//       'Registered Date': c.registeredDate,
//       'Test Scheduled': c.testScheduled ? 'Yes' : 'No',
//       'Test Date': c.testDate || 'N/A',
//       'Test Time': c.testTime || 'N/A',
//       'Has Taken Test': c.hasTakenTest ? 'Yes' : 'No',
//       'Test Score': c.testScore || 'N/A',
//       Status: c.status,
//       Approved: c.approved ? 'Yes' : 'No'
//     }))

//     const worksheet = XLSX.utils.json_to_sheet(exportData)
//     const workbook = XLSX.utils.book_new()
//     XLSX.utils.book_append_sheet(workbook, worksheet, 'Candidates')
//     XLSX.writeFile(workbook, `candidates_${new Date().toISOString().split('T')[0]}.xlsx`)
//     toast.success('Candidates exported successfully!')
//   }

//   // Handle refresh
//   const handleRefresh = () => {
//     setRefreshing(true)
//     fetchCandidates()
//   }

//   // Handle view details
//   const handleViewDetails = async (candidate) => {
//     const details = await fetchCandidateDetails(candidate.id)
//     if (details) {
//       navigate(`/admin/candidates/${candidate.id}`, { state: { candidate: details } })
//     }
//   }

//   // Filter candidates (client-side filtering for UI responsiveness)
//   const filteredCandidates = candidates.filter(candidate => {
//     const matchesSearch = 
//       candidate.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       candidate.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       candidate.id?.toLowerCase().includes(searchTerm.toLowerCase())
    
//     const matchesStatus = filterStatus === 'all' || candidate.status === filterStatus
//     const matchesCourse = filterCourse === 'all' || candidate.course === filterCourse
    
//     return matchesSearch && matchesStatus && matchesCourse
//   })

//   // Pagination (client-side for display)
//   const startIndex = (currentPage - 1) * pagination.limit
//   const paginatedCandidates = filteredCandidates.slice(startIndex, startIndex + pagination.limit)

//   // Fetch candidates when filters or page changes
//   useEffect(() => {
//     fetchCandidates()
//   }, [currentPage, filterStatus, filterCourse])

//   const getStatusBadge = (status) => {
//     const statusConfig = {
//       pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Pending' },
//       scheduled: { color: 'bg-blue-100 text-blue-800', icon: Calendar, label: 'Scheduled' },
//       passed: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Passed' },
//       failed: { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Failed' },
//       approved: { color: 'bg-emerald-100 text-emerald-800', icon: CheckCircle, label: 'Approved' }
//     }
//     const config = statusConfig[status] || statusConfig.pending
//     const Icon = config.icon
    
//     return (
//       <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
//         <Icon className="w-3 h-3 mr-1" />
//         {config.label}
//       </span>
//     )
//   }

//   return (
//     <div className="space-y-8">
//       {/* Header */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between">
//         <div>
//           <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
//             Registered Candidates
//           </h1>
//           <p className="text-gray-600 mt-2">
//             Manage and schedule tests for {pagination.total} registered candidates
//           </p>
//         </div>
//         <div className="mt-4 md:mt-0 flex space-x-3">
//           <button
//             onClick={handleRefresh}
//             disabled={refreshing}
//             className="btn-secondary flex items-center space-x-2"
//           >
//             <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
//             <span>Refresh</span>
//           </button>
//           <button
//             onClick={exportToCSV}
//             className="btn-primary flex items-center space-x-2"
//           >
//             <Download className="w-4 h-4" />
//             <span>Export CSV</span>
//           </button>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="card">
//         <div className="flex flex-col md:flex-row gap-4">
//           {/* Search */}
//           <div className="flex-1 relative">
//             <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search by name, email or ID..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="input-field pl-10"
//             />
//           </div>
          
//           {/* Status Filter */}
//           <select
//             value={filterStatus}
//             onChange={(e) => {
//               setFilterStatus(e.target.value)
//               setCurrentPage(1)
//             }}
//             className="input-field md:w-48"
//           >
//             <option value="all">All Status</option>
//             <option value="pending">Pending</option>
//             <option value="scheduled">Scheduled</option>
//             <option value="passed">Passed</option>
//             <option value="failed">Failed</option>
//             <option value="approved">Approved</option>
//           </select>

//           {/* Course Filter */}
//           <select
//             value={filterCourse}
//             onChange={(e) => {
//               setFilterCourse(e.target.value)
//               setCurrentPage(1)
//             }}
//             className="input-field md:w-48"
//           >
//             <option value="all">All Courses</option>
//             {availableCourses.map(course => (
//               <option key={course} value={course}>{course}</option>
//             ))}
//           </select>
//         </div>
//       </div>

//       {/* Loading State */}
//       {loading && (
//         <div className="card p-8 text-center">
//           <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
//           <p className="mt-2 text-gray-600">Loading candidates...</p>
//         </div>
//       )}

//       {/* Candidates Table */}
//       {!loading && (
//         <div className="card overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gray-50 border-b border-gray-200">
//                 <tr>
//                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                     Candidate
//                   </th>
//                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                     Contact
//                   </th>
//                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                     Course
//                   </th>
//                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                     Status
//                   </th>
//                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                     Test Date
//                   </th>
//                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                     Score
//                   </th>
//                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 {paginatedCandidates.length > 0 ? (
//                   paginatedCandidates.map((candidate) => (
//                     <tr key={candidate.id} className="hover:bg-gray-50 transition-colors">
//                       <td className="px-6 py-4">
//                         <div className="flex items-center">
//                           <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
//                             <span className="text-primary-600 font-bold">
//                               {candidate.name?.charAt(0) || '?'}
//                             </span>
//                           </div>
//                           <div className="ml-3">
//                             <p className="font-medium text-gray-900">{candidate.name}</p>
//                             <p className="text-xs text-gray-500">{candidate.id}</p>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="space-y-1">
//                           <div className="flex items-center text-sm">
//                             <Mail className="w-3 h-3 mr-2 text-gray-400" />
//                             <span className="text-gray-600">{candidate.email}</span>
//                           </div>
//                           <div className="flex items-center text-sm">
//                             <Phone className="w-3 h-3 mr-2 text-gray-400" />
//                             <span className="text-gray-600">{candidate.phone}</span>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="space-y-1">
//                           <span className="text-sm font-medium text-gray-900">
//                             {candidate.course}
//                           </span>
//                           <div className="flex items-center text-xs text-gray-500">
//                             <MapPin className="w-3 h-3 mr-1" />
//                             {candidate.state}, {candidate.lga}
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">
//                         {getStatusBadge(candidate.status)}
//                       </td>
//                       <td className="px-6 py-4">
//                         {candidate.testScheduled ? (
//                           <div>
//                             <p className="text-sm font-medium text-gray-900">{candidate.testDate}</p>
//                             <p className="text-xs text-gray-500">{candidate.testTime}</p>
//                           </div>
//                         ) : (
//                           <span className="text-sm text-gray-500">Not scheduled</span>
//                         )}
//                       </td>
//                       <td className="px-6 py-4">
//                         {candidate.testScore ? (
//                           <span className={`text-sm font-semibold ${
//                             candidate.testScore >= 80 ? 'text-green-600' : 'text-red-600'
//                           }`}>
//                             {candidate.testScore}%
//                           </span>
//                         ) : (
//                           <span className="text-sm text-gray-400">-</span>
//                         )}
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="flex items-center space-x-2">
//                           {/* Schedule button - only for unscheduled */}
//                           {!candidate.testScheduled && (
//                             <button
//                               onClick={() => {
//                                 setSelectedCandidate(candidate)
//                                 setShowUploadModal(true)
//                               }}
//                               className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
//                               title="Schedule Test"
//                             >
//                               <Calendar className="w-4 h-4" />
//                             </button>
//                           )}
                          
//                           {/* Reschedule button - for scheduled candidates OR failed candidates */}
//                           {(candidate.testScheduled && !candidate.hasTakenTest) || 
//                            (candidate.hasTakenTest && candidate.status === 'failed') ? (
//                             <button
//                               onClick={() => {
//                                 setSelectedCandidate(candidate)
//                                 setShowRescheduleModal(true)
//                               }}
//                               className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
//                               title="Reschedule Test"
//                             >
//                               <RefreshCw className="w-4 h-4" />
//                             </button>
//                           ) : null}
                          
//                           {/* Approve button - for passed but not approved */}
//                           {candidate.hasTakenTest && candidate.status === 'passed' && !candidate.approved && (
//                             <button
//                               onClick={() => handleApproveScore(candidate)}
//                               className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
//                               title="Approve Score"
//                             >
//                               <CheckCircle className="w-4 h-4" />
//                             </button>
//                           )}
                          
//                           {/* Send message button - for anyone who has taken test */}
//                           {candidate.hasTakenTest && (
//                             <button
//                               onClick={() => {
//                                 setSelectedCandidate(candidate)
//                                 setShowMessageModal(true)
//                               }}
//                               className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//                               title="Send Message"
//                             >
//                               <Send className="w-4 h-4" />
//                             </button>
//                           )}
                          
//                           {/* View details button - for everyone */}
//                           <button
//                             onClick={() => handleViewDetails(candidate)}
//                             className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
//                             title="View Details"
//                           >
//                             <Eye className="w-4 h-4" />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
//                       <Users className="w-12 h-12 mx-auto mb-3 text-gray-400" />
//                       <p className="text-lg font-medium">No candidates found</p>
//                       <p className="text-sm">Try adjusting your search or filters</p>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination */}
//           {pagination.totalPages > 1 && (
//             <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
//               <p className="text-sm text-gray-600">
//                 Showing {startIndex + 1} to {Math.min(startIndex + pagination.limit, filteredCandidates.length)} of {filteredCandidates.length} candidates
//               </p>
//               <div className="flex items-center space-x-2">
//                 <button
//                   onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//                   disabled={currentPage === 1}
//                   className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   <ChevronLeft className="w-5 h-5" />
//                 </button>
//                 <span className="px-4 py-2 text-sm font-medium text-gray-900">
//                   Page {currentPage} of {pagination.totalPages}
//                 </span>
//                 <button
//                   onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
//                   disabled={currentPage === pagination.totalPages}
//                   className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   <ChevronRight className="w-5 h-5" />
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       )}

//       {/* Upload Test Modal */}
//       {showUploadModal && selectedCandidate && (
//         <UploadTestModal
//           candidate={selectedCandidate}
//           onClose={() => {
//             setShowUploadModal(false)
//             setSelectedCandidate(null)
//           }}
//           onUpload={handleUploadTest}
//         />
//       )}

//       {/* Send Message Modal */}
//       {showMessageModal && selectedCandidate && (
//         <SendMessageModal
//           candidate={selectedCandidate}
//           onClose={() => {
//             setShowMessageModal(false)
//             setSelectedCandidate(null)
//           }}
//           onSend={handleSendMessage}
//         />
//       )}

//       {/* Reschedule Test Modal */}
//       {showRescheduleModal && selectedCandidate && (
//         <RescheduleTestModal
//           candidate={selectedCandidate}
//           onClose={() => {
//             setShowRescheduleModal(false)
//             setSelectedCandidate(null)
//           }}
//           onReschedule={handleRescheduleTest}
//         />
//       )}
//     </div>
//   )
// }

// export default AdminCandidates
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../utils/axios'
import { useAuth } from '../../context/AuthContext'
import { 
  Users, Search, Download, Filter, Calendar,
  Mail, Phone, MapPin, BookOpen, CheckCircle,
  XCircle, Clock, ChevronLeft, ChevronRight,
  Upload, Send, MoreVertical, Eye, RefreshCw
} from 'lucide-react'
import toast from 'react-hot-toast'
import * as XLSX from 'xlsx'
import UploadTestModal from '../../components/admin/UploadTestModal'
import SendMessageModal from '../../components/admin/SendMessageModal'
import RescheduleTestModal from '../../components/admin/RescheduleTestModal'

const AdminCandidates = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCandidate, setSelectedCandidate] = useState(null)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showMessageModal, setShowMessageModal] = useState(false)
  const [showRescheduleModal, setShowRescheduleModal] = useState(false)
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterCourse, setFilterCourse] = useState('all')
  
  // State for API data
  const [candidates, setCandidates] = useState([])
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1
  })
  const [availableCourses, setAvailableCourses] = useState([])

  // Fetch candidates from API
  const fetchCandidates = async () => {
    setLoading(true)
    try {
      // Build query parameters
      const params = new URLSearchParams()
      params.append('page', currentPage)
      params.append('limit', 10)
      if (filterStatus !== 'all') params.append('status', filterStatus)
      if (filterCourse !== 'all') params.append('course', filterCourse)
      if (searchTerm) params.append('search', searchTerm)

      const response = await api.get(`/admin/candidates?${params.toString()}`)

      if (response.data.success) {
        const mappedCandidates = response.data.candidates.map(candidate => ({
          id: candidate.id,
          name: candidate.name,
          email: candidate.email,
          phone: candidate.phone,
          state: candidate.state,
          lga: candidate.lga,
          gender: candidate.gender,
          course: candidate.course,
          registeredDate: candidate.registeredDate,
          testScheduled: candidate.testScheduled === true,
          testDate: candidate.testDate ? new Date(candidate.testDate).toLocaleDateString('en-CA') : null,
          testTime: candidate.testTime,
          hasTakenTest: candidate.hasTakenTest === true,
          testScore: candidate.testScore,
          status: candidate.approved ? 'approved' : 
                  candidate.hasTakenTest ? (candidate.testScore >= 80 ? 'passed' : 'failed') :
                  candidate.testScheduled ? 'scheduled' : 'pending',
          approved: candidate.approved === true,
          passed: candidate.passed === true
        }))

        setCandidates(mappedCandidates)
        setPagination(response.data.pagination)
        setAvailableCourses(response.data.filters?.courses || [])
      }
    } catch (error) {
      console.error('Error fetching candidates:', error)
      toast.error(error.response?.data?.message || 'Failed to load candidates')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // Fetch single candidate details
  const fetchCandidateDetails = async (candidateId) => {
    try {
      const response = await api.get(`/admin/candidates/${candidateId}`)
      if (response.data.success) {
        return response.data.candidate
      }
    } catch (error) {
      console.error('Error fetching candidate details:', error)
      toast.error(error.response?.data?.message || 'Failed to load candidate details')
    }
    return null
  }

  // Handle schedule test
  const handleUploadTest = async (candidate, testDate, testTime) => {
    try {
      const response = await api.post(`/admin/candidates/${candidate.id}/schedule-test`, {
        testDate,
        testTime
      })

      if (response.data.success) {
        setCandidates(prev => prev.map(c => 
          c.id === candidate.id 
            ? { ...c, testScheduled: true, testDate, testTime, status: 'scheduled' }
            : c
        ))
        toast.success(response.data.message || `Test scheduled for ${candidate.name}`)
        setShowUploadModal(false)
        setSelectedCandidate(null)
      }
    } catch (error) {
      console.error('Error scheduling test:', error)
      toast.error(error.response?.data?.message || 'Failed to schedule test')
    }
  }

  // Handle reschedule test
  const handleRescheduleTest = async (candidate, testDate, testTime, reason) => {
    try {
      setLoading(true)
      
      const response = await api.put(`/admin/candidates/${candidate.id}/reschedule-test`, {
        testDate,
        testTime,
        reason
      })

      if (response.data.success) {
        setCandidates(prev => prev.map(c => 
          c.id === candidate.id 
            ? { 
                ...c, 
                testScheduled: true,
                hasTakenTest: false,
                testScore: null,
                approved: false,
                passed: false,
                testDate,
                testTime,
                status: 'scheduled'
              }
            : c
        ))
        
        setShowRescheduleModal(false)
        setSelectedCandidate(null)
        toast.success(`Test rescheduled for ${candidate.name}`)
        fetchCandidates()
      }
    } catch (error) {
      console.error('Error rescheduling test:', error)
      toast.error(error.response?.data?.message || 'Failed to reschedule test')
    } finally {
      setLoading(false)
    }
  }

  // Handle bulk schedule
  const handleBulkSchedule = async (candidateIds, testDate, testTime) => {
    try {
      const response = await api.post('/admin/candidates/bulk-schedule', {
        candidateIds,
        testDate,
        testTime
      })

      if (response.data.success) {
        fetchCandidates()
        
        if (response.data.results.success.length > 0) {
          toast.success(`Successfully scheduled tests for ${response.data.results.success.length} candidates`)
        }
        if (response.data.results.failed.length > 0) {
          toast.error(`Failed to schedule for ${response.data.results.failed.length} candidates`)
        }
      }
    } catch (error) {
      console.error('Error bulk scheduling:', error)
      toast.error(error.response?.data?.message || 'Failed to schedule tests')
    }
  }

  // Handle approve score
  const handleApproveScore = async (candidate) => {
    try {
      const response = await api.post(`/admin/candidates/${candidate.id}/approve`)

      if (response.data.success) {
        setCandidates(prev => prev.map(c => 
          c.id === candidate.id 
            ? { ...c, approved: true, status: 'approved' }
            : c
        ))
        toast.success(response.data.message || `Score approved for ${candidate.name}`)
      }
    } catch (error) {
      console.error('Error approving score:', error)
      toast.error(error.response?.data?.message || 'Failed to approve score')
    }
  }

  // Handle send message
  const handleSendMessage = async (candidate, message) => {
    try {
      const response = await api.post(`/admin/candidates/${candidate.id}/send-message`, { message })

      if (response.data.success) {
        toast.success(response.data.message || `Message sent to ${candidate.name}`)
        setShowMessageModal(false)
        setSelectedCandidate(null)
      }
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error(error.response?.data?.message || 'Failed to send message')
    }
  }

  // Export to CSV
  const exportToCSV = () => {
    const exportData = candidates.map(c => ({
      ID: c.id,
      Name: c.name,
      Email: c.email,
      Phone: c.phone,
      State: c.state,
      LGA: c.lga,
      Gender: c.gender,
      Course: c.course,
      'Registered Date': c.registeredDate,
      'Test Scheduled': c.testScheduled ? 'Yes' : 'No',
      'Test Date': c.testDate || 'N/A',
      'Test Time': c.testTime || 'N/A',
      'Has Taken Test': c.hasTakenTest ? 'Yes' : 'No',
      'Test Score': c.testScore || 'N/A',
      Status: c.status,
      Approved: c.approved ? 'Yes' : 'No'
    }))

    const worksheet = XLSX.utils.json_to_sheet(exportData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Candidates')
    XLSX.writeFile(workbook, `candidates_${new Date().toISOString().split('T')[0]}.xlsx`)
    toast.success('Candidates exported successfully!')
  }

  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true)
    fetchCandidates()
  }

  // Handle view details
  const handleViewDetails = async (candidate) => {
    const details = await fetchCandidateDetails(candidate.id)
    if (details) {
      navigate(`/admin/candidates/${candidate.id}`, { state: { candidate: details } })
    }
  }

  // Handle search input - debounced
  const handleSearch = (value) => {
    setSearchTerm(value)
    setCurrentPage(1) // Reset to first page when searching
  }

  // Handle filter change
  const handleStatusChange = (value) => {
    setFilterStatus(value)
    setCurrentPage(1)
  }

  const handleCourseChange = (value) => {
    setFilterCourse(value)
    setCurrentPage(1)
  }

  // Fetch candidates when filters or page changes
  useEffect(() => {
    fetchCandidates()
  }, [currentPage, filterStatus, filterCourse, searchTerm])

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Pending' },
      scheduled: { color: 'bg-blue-100 text-blue-800', icon: Calendar, label: 'Scheduled' },
      passed: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Passed' },
      failed: { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Failed' },
      approved: { color: 'bg-emerald-100 text-emerald-800', icon: CheckCircle, label: 'Approved' }
    }
    const config = statusConfig[status] || statusConfig.pending
    const Icon = config.icon
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </span>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Registered Candidates
          </h1>
          <p className="text-gray-600 mt-2">
            Manage and schedule tests for {pagination.total} registered candidates
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
            <span>Export CSV</span>
          </button>
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
              onChange={(e) => handleSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          
          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="input-field md:w-48"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="scheduled">Scheduled</option>
            <option value="passed">Passed</option>
            <option value="failed">Failed</option>
            <option value="approved">Approved</option>
          </select>

          {/* Course Filter */}
          <select
            value={filterCourse}
            onChange={(e) => handleCourseChange(e.target.value)}
            className="input-field md:w-48"
          >
            <option value="all">All Courses</option>
            {availableCourses.map(course => (
              <option key={course} value={course}>{course}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="card p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-2 text-gray-600">Loading candidates...</p>
        </div>
      )}

      {/* Candidates Table */}
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
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Test Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {candidates.length > 0 ? (
                  candidates.map((candidate) => (
                    <tr key={candidate.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                            <span className="text-primary-600 font-bold">
                              {candidate.name?.charAt(0) || '?'}
                            </span>
                          </div>
                          <div className="ml-3">
                            <p className="font-medium text-gray-900">{candidate.name}</p>
                            <p className="text-xs text-gray-500">{candidate.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <Mail className="w-3 h-3 mr-2 text-gray-400" />
                            <span className="text-gray-600">{candidate.email}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Phone className="w-3 h-3 mr-2 text-gray-400" />
                            <span className="text-gray-600">{candidate.phone}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <span className="text-sm font-medium text-gray-900">
                            {candidate.course}
                          </span>
                          <div className="flex items-center text-xs text-gray-500">
                            <MapPin className="w-3 h-3 mr-1" />
                            {candidate.state}, {candidate.lga}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(candidate.status)}
                      </td>
                      <td className="px-6 py-4">
                        {candidate.testScheduled ? (
                          <div>
                            <p className="text-sm font-medium text-gray-900">{candidate.testDate}</p>
                            <p className="text-xs text-gray-500">{candidate.testTime}</p>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">Not scheduled</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {candidate.testScore ? (
                          <span className={`text-sm font-semibold ${
                            candidate.testScore >= 80 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {candidate.testScore}%
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          {/* Schedule button - only for unscheduled */}
                          {!candidate.testScheduled && (
                            <button
                              onClick={() => {
                                setSelectedCandidate(candidate)
                                setShowUploadModal(true)
                              }}
                              className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                              title="Schedule Test"
                            >
                              <Calendar className="w-4 h-4" />
                            </button>
                          )}
                          
                          {/* Reschedule button - for scheduled candidates OR failed candidates */}
                          {(candidate.testScheduled && !candidate.hasTakenTest) || 
                           (candidate.hasTakenTest && candidate.status === 'failed') ? (
                            <button
                              onClick={() => {
                                setSelectedCandidate(candidate)
                                setShowRescheduleModal(true)
                              }}
                              className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                              title="Reschedule Test"
                            >
                              <RefreshCw className="w-4 h-4" />
                            </button>
                          ) : null}
                          
                          {/* Approve button - for passed but not approved */}
                          {candidate.hasTakenTest && candidate.status === 'passed' && !candidate.approved && (
                            <button
                              onClick={() => handleApproveScore(candidate)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Approve Score"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                          
                          {/* Send message button - for anyone who has taken test */}
                          {candidate.hasTakenTest && (
                            <button
                              onClick={() => {
                                setSelectedCandidate(candidate)
                                setShowMessageModal(true)
                              }}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Send Message"
                            >
                              <Send className="w-4 h-4" />
                            </button>
                          )}
                          
                          {/* View details button - for everyone */}
                          <button
                            onClick={() => handleViewDetails(candidate)}
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
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                      <Users className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                      <p className="text-lg font-medium">No candidates found</p>
                      <p className="text-sm">Try adjusting your search or filters</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination - FIXED: Use pagination from API directly */}
          {pagination.totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {(pagination.page - 1) * pagination.limit + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} candidates
              </p>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="px-4 py-2 text-sm font-medium text-gray-900">
                  Page {currentPage} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
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

      {/* Upload Test Modal */}
      {showUploadModal && selectedCandidate && (
        <UploadTestModal
          candidate={selectedCandidate}
          onClose={() => {
            setShowUploadModal(false)
            setSelectedCandidate(null)
          }}
          onUpload={handleUploadTest}
        />
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
        />
      )}

      {/* Reschedule Test Modal */}
      {showRescheduleModal && selectedCandidate && (
        <RescheduleTestModal
          candidate={selectedCandidate}
          onClose={() => {
            setShowRescheduleModal(false)
            setSelectedCandidate(null)
          }}
          onReschedule={handleRescheduleTest}
        />
      )}
    </div>
  )
}

export default AdminCandidates