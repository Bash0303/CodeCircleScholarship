import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { 
  FileText, Plus, Trash2, Edit, Save, X,
  ChevronDown, ChevronUp, Copy, CheckCircle,
  AlertCircle, Upload, RefreshCw
} from 'lucide-react'
import toast from 'react-hot-toast'

const AdminQuestions = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [questions, setQuestions] = useState([])
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  })
  const [availableCategories, setAvailableCategories] = useState([])

  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [expandedId, setExpandedId] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedQuestions, setSelectedQuestions] = useState([]) // For bulk selection
  const [showBulkActions, setShowBulkActions] = useState(false)
  const [stats, setStats] = useState({
    total: 0,
    byCategory: [],
    byDifficulty: []
  })

  // COMPREHENSIVE CATEGORY LIST (Fallback)
  const DEFAULT_CATEGORIES = [
    'Frontend',
    'Backend', 
    'JavaScript',
    'Python',
    'Database',
    'UI/UX',
    'Cyber Security',
    'Data Analysis',
    'IoT',
    'General',
    'HTML',
    'CSS',
    'React',
    'Node.js',
    'MongoDB',
    'Programming Basics',
    'Algorithms',
    'System Design'
  ]

  const [newQuestion, setNewQuestion] = useState({
    question: '',
    options: { a: '', b: '', c: '', d: '' },
    correctAnswer: 'a',
    category: '',
    difficulty: 'Easy',
    tags: []
  })

  const difficulties = ['Easy', 'Medium', 'Hard']

  // Fetch questions from API
  const fetchQuestions = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('codecircle_token')
      const response = await fetch(
        `http://localhost:5000/api/admin/questions?page=${currentPage}&limit=10&category=${selectedCategory}&difficulty=${selectedDifficulty}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch questions')
      }

      if (result.success) {
        setQuestions(result.questions)
        setPagination(result.pagination)
        
        // If API returns categories, use them; otherwise use DEFAULT_CATEGORIES
        if (result.filters?.categories && result.filters.categories.length > 0) {
          setAvailableCategories(result.filters.categories)
        } else {
          // Extract unique categories from questions as fallback
          const uniqueCategories = [...new Set(result.questions.map(q => q.category).filter(Boolean))]
          if (uniqueCategories.length > 0) {
            setAvailableCategories(uniqueCategories)
          } else {
            setAvailableCategories(DEFAULT_CATEGORIES)
          }
        }
      }
    } catch (error) {
      console.error('Error fetching questions:', error)
      toast.error(error.message || 'Failed to load questions')
      // Ensure categories still display even on error
      setAvailableCategories(DEFAULT_CATEGORIES)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // Fetch stats
  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('codecircle_token')
      const response = await fetch('http://localhost:5000/api/admin/questions/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch stats')
      }

      if (result.success) {
        setStats(result.stats)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  // Handle add question
  const handleAddQuestion = async () => {
    if (!newQuestion.question.trim()) {
      toast.error('Please enter a question')
      return
    }
    if (!newQuestion.options.a.trim() || !newQuestion.options.b.trim() || 
        !newQuestion.options.c.trim() || !newQuestion.options.d.trim()) {
      toast.error('Please fill in all options')
      return
    }
    if (!newQuestion.category) {
      toast.error('Please select a category')
      return
    }

    setLoading(true)
    try {
      const token = localStorage.getItem('codecircle_token')
      const response = await fetch('http://localhost:5000/api/admin/questions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newQuestion)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to add question')
      }

      if (result.success) {
        toast.success(result.message || 'Question added successfully!')
        setNewQuestion({
          question: '',
          options: { a: '', b: '', c: '', d: '' },
          correctAnswer: 'a',
          category: '',
          difficulty: 'Easy',
          tags: []
        })
        setShowAddForm(false)
        fetchQuestions() // Refresh the list
        fetchStats() // Refresh stats
      }
    } catch (error) {
      console.error('Error adding question:', error)
      toast.error(error.message || 'Failed to add question')
    } finally {
      setLoading(false)
    }
  }

  // Handle edit question
  const handleEditQuestion = (question) => {
    setEditingId(question.id)
    setNewQuestion({
      question: question.question,
      options: { ...question.options },
      correctAnswer: question.correctAnswer,
      category: question.category,
      difficulty: question.difficulty,
      tags: question.tags || []
    })
    setShowAddForm(true)
  }

  // Handle update question
  const handleUpdateQuestion = async () => {
    if (!newQuestion.question.trim()) {
      toast.error('Please enter a question')
      return
    }

    setLoading(true)
    try {
      const token = localStorage.getItem('codecircle_token')
      const response = await fetch(`http://localhost:5000/api/admin/questions/${editingId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newQuestion)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to update question')
      }

      if (result.success) {
        toast.success(result.message || 'Question updated successfully!')
        setEditingId(null)
        setNewQuestion({
          question: '',
          options: { a: '', b: '', c: '', d: '' },
          correctAnswer: 'a',
          category: '',
          difficulty: 'Easy',
          tags: []
        })
        setShowAddForm(false)
        fetchQuestions() // Refresh the list
      }
    } catch (error) {
      console.error('Error updating question:', error)
      toast.error(error.message || 'Failed to update question')
    } finally {
      setLoading(false)
    }
  }

  // Handle delete question
  const handleDeleteQuestion = async (id) => {
    if (!window.confirm('Are you sure you want to delete this question?')) {
      return
    }

    setLoading(true)
    try {
      const token = localStorage.getItem('codecircle_token')
      const response = await fetch(`http://localhost:5000/api/admin/questions/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to delete question')
      }

      if (result.success) {
        toast.success(result.message || 'Question deleted successfully!')
        // Remove from selected questions if selected
        setSelectedQuestions(prev => prev.filter(qId => qId !== id))
        fetchQuestions() // Refresh the list
        fetchStats() // Refresh stats
      }
    } catch (error) {
      console.error('Error deleting question:', error)
      toast.error(error.message || 'Failed to delete question')
    } finally {
      setLoading(false)
    }
  }

  // Handle bulk upload
  // Handle bulk upload - FIXED VERSION
const handleBulkUpload = async (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  setUploading(true)
  
  try {
    // Read the file content
    const fileContent = await file.text()
    
    // Parse the JSON content
    let questionsData
    try {
      questionsData = JSON.parse(fileContent)
    } catch (parseError) {
      toast.error('Invalid JSON file format')
      setUploading(false)
      event.target.value = ''
      return
    }

    // Ensure the data has the correct structure
    // If the file contains a direct array, wrap it in { questions: [...] }
    let payload
    if (Array.isArray(questionsData)) {
      // File contains a direct array of questions
      payload = { questions: questionsData }
    } else if (questionsData.questions && Array.isArray(questionsData.questions)) {
      // File already has the correct { questions: [...] } structure
      payload = questionsData
    } else {
      toast.error('Invalid JSON structure. Expected an array of questions or { questions: [...] }')
      setUploading(false)
      event.target.value = ''
      return
    }

    const token = localStorage.getItem('codecircle_token')
    const response = await fetch('http://localhost:5000/api/admin/questions/bulk-upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json' // Important: Send as JSON, not FormData
      },
      body: JSON.stringify(payload) // Send the wrapped payload
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || 'Failed to upload questions')
    }

    if (result.success) {
      toast.success(result.message || `Successfully uploaded ${result.count} questions`)
      fetchQuestions() // Refresh the list
      fetchStats() // Refresh stats
    }
  } catch (error) {
    console.error('Error uploading questions:', error)
    toast.error(error.message || 'Failed to upload questions')
  } finally {
    setUploading(false)
    event.target.value = '' // Reset file input
  }
}
  // Handle upload test set
  const handleUploadSet = async () => {
    // Check if questions are selected
    if (selectedQuestions.length === 0) {
      toast.error('Please select at least one question to create a test set')
      return
    }

    setUploading(true)
    try {
      const token = localStorage.getItem('codecircle_token')
      const response = await fetch('http://localhost:5000/api/admin/questions/upload-set', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          questionIds: selectedQuestions  // Send the selected question IDs
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to upload test set')
      }

      if (result.success) {
        toast.success(result.message || `Test set created with ${result.data.count} questions`)
        setSelectedQuestions([]) // Clear selection
        setShowBulkActions(false)
        fetchQuestions() // Refresh the list
        fetchStats() // Refresh stats
      }
    } catch (error) {
      console.error('Error uploading test set:', error)
      toast.error(error.message || 'Failed to upload test set')
    } finally {
      setUploading(false)
    }
  }

  // Handle select all questions
  const handleSelectAll = () => {
    if (selectedQuestions.length === questions.length) {
      setSelectedQuestions([])
    } else {
      setSelectedQuestions(questions.map(q => q.id))
    }
  }

  // Handle select single question
  const handleSelectQuestion = (questionId) => {
    setSelectedQuestions(prev => {
      if (prev.includes(questionId)) {
        return prev.filter(id => id !== questionId)
      } else {
        return [...prev, questionId]
      }
    })
  }

  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true)
    fetchQuestions()
    fetchStats()
  }

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
    setSelectedQuestions([]) // Clear selection when changing page
    setShowBulkActions(false)
  }

  // Handle category change
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value)
    setCurrentPage(1)
    setSelectedQuestions([])
    setShowBulkActions(false)
  }

  // Handle difficulty change
  const handleDifficultyChange = (e) => {
    setSelectedDifficulty(e.target.value)
    setCurrentPage(1)
    setSelectedQuestions([])
    setShowBulkActions(false)
  }

  // Fetch questions when filters or page changes
  useEffect(() => {
    fetchQuestions()
  }, [currentPage, selectedCategory, selectedDifficulty])

  // Fetch stats on component mount
  useEffect(() => {
    fetchStats()
    // Ensure categories are available even if API fails
    if (availableCategories.length === 0) {
      setAvailableCategories(DEFAULT_CATEGORIES)
    }
  }, [])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Set Questions
          </h1>
          <p className="text-gray-600 mt-2">
            Create and manage test questions for the scholarship exam
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
            onClick={() => {
              setEditingId(null)
              setNewQuestion({
                question: '',
                options: { a: '', b: '', c: '', d: '' },
                correctAnswer: 'a',
                category: '',
                difficulty: 'Easy',
                tags: []
              })
              setShowAddForm(!showAddForm)
            }}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Question</span>
          </button>
          <div className="relative">
            <input
              type="file"
              accept=".json,.csv,.xlsx"
              onChange={handleBulkUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={uploading}
            />
            <button
              disabled={uploading}
              className="btn-secondary flex items-center space-x-2"
            >
              {uploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Bulk Upload</span>
                </>
              )}
            </button>
          </div>
          <button
            onClick={() => setShowBulkActions(!showBulkActions)}
            className={`btn-secondary flex items-center space-x-2 ${
              showBulkActions ? 'bg-primary-50 text-primary-600' : ''
            }`}
          >
            <Copy className="w-4 h-4" />
            <span>Bulk Actions</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card bg-gradient-to-br from-primary-500 to-primary-600 text-white">
          <p className="text-white/80 text-sm">Total Questions</p>
          <p className="text-3xl font-bold mt-2">{stats.total}</p>
        </div>
        {stats.byDifficulty.map((stat, index) => (
          <div key={index} className="card">
            <p className="text-gray-600 text-sm">{stat._id}</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">{stat.count}</p>
          </div>
        ))}
      </div>

      {/* Bulk Actions Bar */}
      {showBulkActions && (
        <div className="card bg-primary-50 border border-primary-200 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedQuestions.length === questions.length && questions.length > 0}
                  onChange={handleSelectAll}
                  className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Select All ({questions.length})
                </span>
              </label>
              <span className="text-sm text-gray-600">
                {selectedQuestions.length} question(s) selected
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleUploadSet}
                disabled={uploading || selectedQuestions.length === 0}
                className="btn-primary flex items-center space-x-2"
              >
                {uploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating Test Set...</span>
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4" />
                    <span>Create Test Set</span>
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setShowBulkActions(false)
                  setSelectedQuestions([])
                }}
                className="p-2 hover:bg-primary-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Question Form */}
      {showAddForm && (
        <div className="card animate-fade-in">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              {editingId ? 'Edit Question' : 'Add New Question'}
            </h2>
            <button
              onClick={() => {
                setShowAddForm(false)
                setEditingId(null)
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Question Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question
              </label>
              <textarea
                value={newQuestion.question}
                onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                rows="3"
                className="input-field"
                placeholder="Enter your question here..."
              />
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['a', 'b', 'c', 'd'].map((option) => (
                <div key={option}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Option {option.toUpperCase()}
                  </label>
                  <input
                    type="text"
                    value={newQuestion.options[option]}
                    onChange={(e) => setNewQuestion({
                      ...newQuestion,
                      options: { ...newQuestion.options, [option]: e.target.value }
                    })}
                    className="input-field"
                    placeholder={`Enter option ${option.toUpperCase()}`}
                  />
                </div>
              ))}
            </div>

            {/* Correct Answer, Category, Difficulty */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Correct Answer
                </label>
                <select
                  value={newQuestion.correctAnswer}
                  onChange={(e) => setNewQuestion({ ...newQuestion, correctAnswer: e.target.value })}
                  className="input-field"
                >
                  <option value="a">Option A</option>
                  <option value="b">Option B</option>
                  <option value="c">Option C</option>
                  <option value="d">Option D</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={newQuestion.category}
                  onChange={(e) => setNewQuestion({ ...newQuestion, category: e.target.value })}
                  className="input-field"
                >
                  <option value="">Select Category</option>
                  {/* Use availableCategories, which now has fallback */}
                  {availableCategories.length > 0 ? (
                    availableCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))
                  ) : (
                    DEFAULT_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))
                  )}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty
                </label>
                <select
                  value={newQuestion.difficulty}
                  onChange={(e) => setNewQuestion({ ...newQuestion, difficulty: e.target.value })}
                  className="input-field"
                >
                  {difficulties.map(diff => (
                    <option key={diff} value={diff}>{diff}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={newQuestion.tags.join(', ')}
                onChange={(e) => setNewQuestion({
                  ...newQuestion,
                  tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                })}
                className="input-field"
                placeholder="e.g., javascript, basics, programming"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowAddForm(false)
                  setEditingId(null)
                }}
                className="btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={editingId ? handleUpdateQuestion : handleAddQuestion}
                disabled={loading}
                className="btn-primary"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    <span>{editingId ? 'Updating...' : 'Adding...'}</span>
                  </>
                ) : (
                  <span>{editingId ? 'Update Question' : 'Add Question'}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="input-field md:w-48"
          >
            <option value="all">All Categories</option>
            {availableCategories.length > 0 ? (
              availableCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))
            ) : (
              DEFAULT_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))
            )}
          </select>

          <select
            value={selectedDifficulty}
            onChange={handleDifficultyChange}
            className="input-field md:w-48"
          >
            <option value="all">All Difficulties</option>
            {difficulties.map(diff => (
              <option key={diff} value={diff}>{diff}</option>
            ))}
          </select>

          <div className="flex-1 text-right">
            <p className="text-sm text-gray-600">
              Total Questions: <span className="font-semibold">{pagination.total}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && !refreshing && (
        <div className="card p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-2 text-gray-600">Loading questions...</p>
        </div>
      )}

      {/* Questions List */}
      {!loading && (
        <div className="space-y-4">
          {questions.map((question, index) => (
            <div key={question.id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start">
                {/* Checkbox for bulk selection */}
                {showBulkActions && (
                  <div className="mr-4 pt-2">
                    <input
                      type="checkbox"
                      checked={selectedQuestions.includes(question.id)}
                      onChange={() => handleSelectQuestion(question.id)}
                      className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                    />
                  </div>
                )}
                
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-bold">
                      {(currentPage - 1) * pagination.limit + index + 1}
                    </span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      {question.category}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      question.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                      question.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {question.difficulty}
                    </span>
                    {question.tags?.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    {question.question}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                    {Object.entries(question.options).map(([key, value]) => (
                      <div key={key} className={`p-3 rounded-lg ${
                        question.correctAnswer === key 
                          ? 'bg-green-50 border border-green-200' 
                          : 'bg-gray-50 border border-gray-200'
                      }`}>
                        <div className="flex items-center">
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs mr-2 ${
                            question.correctAnswer === key
                              ? 'bg-green-600 text-white'
                              : 'bg-gray-400 text-white'
                          }`}>
                            {key.toUpperCase()}
                          </span>
                          <span className="text-gray-700">{value}</span>
                          {question.correctAnswer === key && (
                            <CheckCircle className="w-4 h-4 text-green-600 ml-2" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex items-center text-xs text-gray-500">
                    <span>Created: {new Date(question.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => handleEditQuestion(question)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit Question"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteQuestion(question.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Question"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {questions.length === 0 && (
            <div className="card text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Questions Found</h3>
              <p className="text-gray-600 mb-6">
                Get started by adding your first test question.
              </p>
              <button
                onClick={() => {
                  setEditingId(null)
                  setNewQuestion({
                    question: '',
                    options: { a: '', b: '', c: '', d: '' },
                    correctAnswer: 'a',
                    category: '',
                    difficulty: 'Easy',
                    tags: []
                  })
                  setShowAddForm(true)
                }}
                className="btn-primary inline-flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Question</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing page {currentPage} of {pagination.totalPages}
          </p>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 border border-primary-200 rounded-lg">
              {currentPage}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === pagination.totalPages}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminQuestions