import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { 
  Settings as SettingsIcon, Shield, Bell, Mail, 
  Clock, Users, Calendar, Save, Key, Lock,
  Globe, Smartphone, Eye, EyeOff, RefreshCw,
  History, RotateCcw, MailCheck, PhoneCall
} from 'lucide-react'
import toast from 'react-hot-toast'

const AdminSettings = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('general')
  const [showPassword, setShowPassword] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [settingsHistory, setSettingsHistory] = useState([])

  const [settings, setSettings] = useState({
    general: {
      siteName: '',
      adminEmail: '',
      contactPhone: '',
      contactEmail: '',
      officeAddress: '',
      logo: null
    },
    test: {
      duration: 10,
      passingScore: 80,
      questionsPerTest: 20,
      dailySlots: 40,
      maxCandidatesPerDay: 100,
      testStartTime: '07:00',
      testEndTime: '23:59',
      shuffleQuestions: true,
      showResultsImmediately: false,
      allowRetake: false,
      retakeWaitDays: 30
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      passwordExpiry: 90,
      requireStrongPassword: true,
      allowMultipleSessions: false,
      recaptchaEnabled: false
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: true,
      testScheduled: true,
      testCompleted: true,
      resultPublished: true,
      dailyReport: true,
      adminAlerts: true
    },
    system: {
      maintenanceMode: false,
      maintenanceMessage: '',
      debugMode: false,
      backupEnabled: true,
      backupFrequency: 'daily',
      dataRetentionDays: 365
    },
    appearance: {
      primaryColor: '#3b82f6',
      secondaryColor: '#f59e0b',
      fontFamily: 'Inter',
      borderRadius: '0.5rem'
    }
  })

  const [metadata, setMetadata] = useState({
    updatedAt: null,
    updatedBy: null
  })

  // Fetch settings from API
  const fetchSettings = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('codecircle_token')
      const response = await fetch('http://localhost:5000/api/admin/settings', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch settings')
      }

      if (result.success) {
        setSettings(result.settings)
        if (result.settings.metadata) {
          setMetadata(result.settings.metadata)
        }
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
      toast.error(error.message || 'Failed to load settings')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // Fetch settings history
  const fetchSettingsHistory = async () => {
    try {
      const token = localStorage.getItem('codecircle_token')
      const response = await fetch('http://localhost:5000/api/admin/settings/history', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch history')
      }

      if (result.success) {
        setSettingsHistory(result.history || [])
      }
    } catch (error) {
      console.error('Error fetching history:', error)
    }
  }

  // Save all settings
  const handleSaveSettings = async () => {
    setSaving(true)
    try {
      const token = localStorage.getItem('codecircle_token')
      const response = await fetch('http://localhost:5000/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to save settings')
      }

      if (result.success) {
        setSettings(result.settings)
        if (result.settings.metadata) {
          setMetadata(result.settings.metadata)
        }
        toast.success(result.message || 'Settings saved successfully!')
        fetchSettingsHistory() // Refresh history
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      toast.error(error.message || 'Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  // Save specific section
  const saveSection = async (section) => {
    setSaving(true)
    try {
      const token = localStorage.getItem('codecircle_token')
      const response = await fetch(`http://localhost:5000/api/admin/settings/${section}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings[section])
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || `Failed to save ${section} settings`)
      }

      if (result.success) {
        setSettings(prev => ({
          ...prev,
          [section]: result.section
        }))
        toast.success(result.message || `${section} settings saved successfully!`)
        fetchSettingsHistory() // Refresh history
      }
    } catch (error) {
      console.error(`Error saving ${section} settings:`, error)
      toast.error(error.message || `Failed to save ${section} settings`)
    } finally {
      setSaving(false)
    }
  }

  // Reset settings to default
  const handleResetSettings = async () => {
    if (!window.confirm('Are you sure you want to reset all settings to default? This action cannot be undone.')) {
      return
    }

    setSaving(true)
    try {
      const token = localStorage.getItem('codecircle_token')
      const response = await fetch('http://localhost:5000/api/admin/settings/reset', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to reset settings')
      }

      if (result.success) {
        setSettings(result.settings)
        if (result.settings.metadata) {
          setMetadata(result.settings.metadata)
        }
        toast.success(result.message || 'Settings reset to default successfully!')
        fetchSettingsHistory() // Refresh history
      }
    } catch (error) {
      console.error('Error resetting settings:', error)
      toast.error(error.message || 'Failed to reset settings')
    } finally {
      setSaving(false)
    }
  }

  // Test email configuration
  const handleTestEmail = async () => {
    try {
      const token = localStorage.getItem('codecircle_token')
      const response = await fetch('http://localhost:5000/api/admin/settings/test-email', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to send test email')
      }

      if (result.success) {
        toast.success(result.message || 'Test email sent successfully!')
      }
    } catch (error) {
      console.error('Error sending test email:', error)
      toast.error(error.message || 'Failed to send test email')
    }
  }

  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true)
    fetchSettings()
    fetchSettingsHistory()
  }

  const handleChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleString()
  }

  // Load settings on mount
  useEffect(() => {
    fetchSettings()
    fetchSettingsHistory()
  }, [])

  const tabs = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'test', label: 'Test Settings', icon: Clock },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'system', label: 'System', icon: Globe },
    { id: 'appearance', label: 'Appearance', icon: Eye }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Settings
          </h1>
          <p className="text-gray-600 mt-2">
            Configure your scholarship portal settings
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
            onClick={() => setShowHistory(!showHistory)}
            className="btn-secondary flex items-center space-x-2"
          >
            <History className="w-4 h-4" />
            <span>{showHistory ? 'Hide History' : 'View History'}</span>
          </button>
          <button
            onClick={handleResetSettings}
            className="btn-secondary text-red-600 hover:bg-red-50 flex items-center space-x-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Last Updated Info */}
      {metadata?.updatedAt && (
        <div className="card bg-primary-50 border border-primary-200">
          <p className="text-sm text-primary-800">
            Last updated: {formatDate(metadata.updatedAt)}
            {metadata.updatedBy && ` by Admin ID: ${metadata.updatedBy}`}
          </p>
        </div>
      )}

      {/* Settings History */}
      {showHistory && (
        <div className="card animate-fade-in">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Settings History</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {settingsHistory.length > 0 ? (
              settingsHistory.map((entry, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <History className="w-4 h-4 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900">{entry.action}</p>
                      <span className="text-xs text-gray-500">{formatDate(entry.timestamp)}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{entry.details}</p>
                    <div className="flex items-center mt-2 text-xs text-gray-500">
                      <span className="mr-3">Admin: {entry.adminEmail}</span>
                      <span>IP: {entry.ip}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-4">No history available</p>
            )}
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="card p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-2 text-gray-600">Loading settings...</p>
        </div>
      )}

      {!loading && (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Tabs */}
          <div className="lg:w-64">
            <div className="card sticky top-24">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200
                      ${activeTab === tab.id 
                        ? 'bg-primary-50 text-primary-600' 
                        : 'text-gray-700 hover:bg-gray-100'
                      }`}
                  >
                    <tab.icon className={`w-5 h-5 mr-3 ${
                      activeTab === tab.id ? 'text-primary-600' : 'text-gray-500'
                    }`} />
                    <span className={`font-medium ${
                      activeTab === tab.id ? 'text-primary-600' : 'text-gray-700'
                    }`}>
                      {tab.label}
                    </span>
                  </button>
                ))}
              </nav>

              <div className="mt-8 pt-6 border-t border-gray-200 space-y-3">
                <button
                  onClick={() => saveSection(activeTab)}
                  disabled={saving}
                  className="w-full btn-primary flex items-center justify-center space-x-2 py-3"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Section</span>
                    </>
                  )}
                </button>
                
                <button
                  onClick={handleSaveSettings}
                  disabled={saving}
                  className="w-full btn-secondary flex items-center justify-center space-x-2 py-3"
                >
                  <Save className="w-4 h-4" />
                  <span>Save All Changes</span>
                </button>
              </div>
            </div>
          </div>

          {/* Settings Content */}
          <div className="flex-1">
            <div className="card">
              {/* General Settings */}
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">General Settings</h2>
                    <p className="text-sm text-gray-600 mb-6">
                      Configure your scholarship portal basic information
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Site Name
                      </label>
                      <input
                        type="text"
                        value={settings.general.siteName}
                        onChange={(e) => handleChange('general', 'siteName', e.target.value)}
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Admin Email
                      </label>
                      <input
                        type="email"
                        value={settings.general.adminEmail}
                        onChange={(e) => handleChange('general', 'adminEmail', e.target.value)}
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Phone
                      </label>
                      <input
                        type="text"
                        value={settings.general.contactPhone}
                        onChange={(e) => handleChange('general', 'contactPhone', e.target.value)}
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Email
                      </label>
                      <input
                        type="email"
                        value={settings.general.contactEmail}
                        onChange={(e) => handleChange('general', 'contactEmail', e.target.value)}
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Office Address
                      </label>
                      <textarea
                        value={settings.general.officeAddress}
                        onChange={(e) => handleChange('general', 'officeAddress', e.target.value)}
                        rows="3"
                        className="input-field"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Test Settings */}
              {activeTab === 'test' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Test Settings</h2>
                    <p className="text-sm text-gray-600 mb-6">
                      Configure test duration, passing score and scheduling
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Test Duration (minutes)
                      </label>
                      <input
                        type="number"
                        value={settings.test.duration}
                        onChange={(e) => handleChange('test', 'duration', parseInt(e.target.value))}
                        className="input-field"
                        min="5"
                        max="60"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Passing Score (%)
                      </label>
                      <input
                        type="number"
                        value={settings.test.passingScore}
                        onChange={(e) => handleChange('test', 'passingScore', parseInt(e.target.value))}
                        className="input-field"
                        min="50"
                        max="100"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Questions Per Test
                      </label>
                      <input
                        type="number"
                        value={settings.test.questionsPerTest}
                        onChange={(e) => handleChange('test', 'questionsPerTest', parseInt(e.target.value))}
                        className="input-field"
                        min="10"
                        max="50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Daily Test Slots
                      </label>
                      <input
                        type="number"
                        value={settings.test.dailySlots}
                        onChange={(e) => handleChange('test', 'dailySlots', parseInt(e.target.value))}
                        className="input-field"
                        min="10"
                        max="100"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Max Candidates Per Day
                      </label>
                      <input
                        type="number"
                        value={settings.test.maxCandidatesPerDay}
                        onChange={(e) => handleChange('test', 'maxCandidatesPerDay', parseInt(e.target.value))}
                        className="input-field"
                        min="20"
                        max="500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Test Start Time
                      </label>
                      <input
                        type="time"
                        value={settings.test.testStartTime}
                        onChange={(e) => handleChange('test', 'testStartTime', e.target.value)}
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Test End Time
                      </label>
                      <input
                        type="time"
                        value={settings.test.testEndTime}
                        onChange={(e) => handleChange('test', 'testEndTime', e.target.value)}
                        className="input-field"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl col-span-2">
                      <div>
                        <label className="font-medium text-gray-900">Shuffle Questions</label>
                        <p className="text-sm text-gray-600 mt-1">
                          Randomize question order for each candidate
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.test.shuffleQuestions}
                          onChange={(e) => handleChange('test', 'shuffleQuestions', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl col-span-2">
                      <div>
                        <label className="font-medium text-gray-900">Allow Retake</label>
                        <p className="text-sm text-gray-600 mt-1">
                          Allow candidates to retake the test
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.test.allowRetake}
                          onChange={(e) => handleChange('test', 'allowRetake', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>

                    {settings.test.allowRetake && (
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Retake Wait Days
                        </label>
                        <input
                          type="number"
                          value={settings.test.retakeWaitDays}
                          onChange={(e) => handleChange('test', 'retakeWaitDays', parseInt(e.target.value))}
                          className="input-field"
                          min="1"
                          max="90"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Security Settings */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h2>
                    <p className="text-sm text-gray-600 mb-6">
                      Configure security and access control settings
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <label className="font-medium text-gray-900">Two-Factor Authentication</label>
                        <p className="text-sm text-gray-600 mt-1">
                          Require 2FA for admin accounts
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.security.twoFactorAuth}
                          onChange={(e) => handleChange('security', 'twoFactorAuth', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Session Timeout (minutes)
                      </label>
                      <input
                        type="number"
                        value={settings.security.sessionTimeout}
                        onChange={(e) => handleChange('security', 'sessionTimeout', parseInt(e.target.value))}
                        className="input-field"
                        min="15"
                        max="120"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Max Login Attempts
                      </label>
                      <input
                        type="number"
                        value={settings.security.maxLoginAttempts}
                        onChange={(e) => handleChange('security', 'maxLoginAttempts', parseInt(e.target.value))}
                        className="input-field"
                        min="3"
                        max="10"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Password Expiry (days)
                      </label>
                      <input
                        type="number"
                        value={settings.security.passwordExpiry}
                        onChange={(e) => handleChange('security', 'passwordExpiry', parseInt(e.target.value))}
                        className="input-field"
                        min="30"
                        max="365"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <label className="font-medium text-gray-900">Require Strong Password</label>
                        <p className="text-sm text-gray-600 mt-1">
                          Enforce strong password requirements
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.security.requireStrongPassword}
                          onChange={(e) => handleChange('security', 'requireStrongPassword', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Notification Settings */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Notification Settings</h2>
                    <p className="text-sm text-gray-600 mb-6">
                      Configure email and SMS notifications
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <label className="font-medium text-gray-900">Email Notifications</label>
                        <p className="text-sm text-gray-600 mt-1">
                          Send notifications via email
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.notifications.emailNotifications}
                          onChange={(e) => handleChange('notifications', 'emailNotifications', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <label className="font-medium text-gray-900">SMS Notifications</label>
                        <p className="text-sm text-gray-600 mt-1">
                          Send notifications via SMS
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.notifications.smsNotifications}
                          onChange={(e) => handleChange('notifications', 'smsNotifications', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>

                    {settings.notifications.emailNotifications && (
                      <div className="pt-4">
                        <button
                          onClick={handleTestEmail}
                          className="btn-secondary flex items-center space-x-2"
                        >
                          <MailCheck className="w-4 h-4" />
                          <span>Test Email Configuration</span>
                        </button>
                      </div>
                    )}

                    <div className="pt-4 border-t border-gray-200">
                      <h3 className="font-medium text-gray-900 mb-4">Notification Triggers</h3>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-700">Test Scheduled</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.notifications.testScheduled}
                              onChange={(e) => handleChange('notifications', 'testScheduled', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-gray-700">Test Completed</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.notifications.testCompleted}
                              onChange={(e) => handleChange('notifications', 'testCompleted', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-gray-700">Result Published</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.notifications.resultPublished}
                              onChange={(e) => handleChange('notifications', 'resultPublished', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-gray-700">Daily Report</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.notifications.dailyReport}
                              onChange={(e) => handleChange('notifications', 'dailyReport', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-gray-700">Admin Alerts</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.notifications.adminAlerts}
                              onChange={(e) => handleChange('notifications', 'adminAlerts', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* System Settings */}
              {activeTab === 'system' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">System Settings</h2>
                    <p className="text-sm text-gray-600 mb-6">
                      Configure system-wide settings and maintenance options
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <label className="font-medium text-gray-900">Maintenance Mode</label>
                        <p className="text-sm text-gray-600 mt-1">
                          Put the site in maintenance mode
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.system.maintenanceMode}
                          onChange={(e) => handleChange('system', 'maintenanceMode', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>

                    {settings.system.maintenanceMode && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Maintenance Message
                        </label>
                        <textarea
                          value={settings.system.maintenanceMessage}
                          onChange={(e) => handleChange('system', 'maintenanceMessage', e.target.value)}
                          rows="3"
                          className="input-field"
                          placeholder="Enter maintenance message..."
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <label className="font-medium text-gray-900">Debug Mode</label>
                        <p className="text-sm text-gray-600 mt-1">
                          Enable debug mode for troubleshooting
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.system.debugMode}
                          onChange={(e) => handleChange('system', 'debugMode', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <label className="font-medium text-gray-900">Backup Enabled</label>
                        <p className="text-sm text-gray-600 mt-1">
                          Enable automatic system backups
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.system.backupEnabled}
                          onChange={(e) => handleChange('system', 'backupEnabled', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>

                    {settings.system.backupEnabled && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Backup Frequency
                          </label>
                          <select
                            value={settings.system.backupFrequency}
                            onChange={(e) => handleChange('system', 'backupFrequency', e.target.value)}
                            className="input-field"
                          >
                            <option value="hourly">Hourly</option>
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Data Retention (days)
                          </label>
                          <input
                            type="number"
                            value={settings.system.dataRetentionDays}
                            onChange={(e) => handleChange('system', 'dataRetentionDays', parseInt(e.target.value))}
                            className="input-field"
                            min="30"
                            max="730"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Appearance Settings */}
              {activeTab === 'appearance' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Appearance Settings</h2>
                    <p className="text-sm text-gray-600 mb-6">
                      Customize the look and feel of your portal
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Primary Color
                      </label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={settings.appearance.primaryColor}
                          onChange={(e) => handleChange('appearance', 'primaryColor', e.target.value)}
                          className="w-12 h-10 rounded-lg border border-gray-300 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={settings.appearance.primaryColor}
                          onChange={(e) => handleChange('appearance', 'primaryColor', e.target.value)}
                          className="input-field flex-1"
                          placeholder="#3b82f6"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Secondary Color
                      </label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={settings.appearance.secondaryColor}
                          onChange={(e) => handleChange('appearance', 'secondaryColor', e.target.value)}
                          className="w-12 h-10 rounded-lg border border-gray-300 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={settings.appearance.secondaryColor}
                          onChange={(e) => handleChange('appearance', 'secondaryColor', e.target.value)}
                          className="input-field flex-1"
                          placeholder="#f59e0b"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Font Family
                      </label>
                      <select
                        value={settings.appearance.fontFamily}
                        onChange={(e) => handleChange('appearance', 'fontFamily', e.target.value)}
                        className="input-field"
                      >
                        <option value="Inter">Inter</option>
                        <option value="Poppins">Poppins</option>
                        <option value="Roboto">Roboto</option>
                        <option value="Open Sans">Open Sans</option>
                        <option value="Montserrat">Montserrat</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Border Radius
                      </label>
                      <select
                        value={settings.appearance.borderRadius}
                        onChange={(e) => handleChange('appearance', 'borderRadius', e.target.value)}
                        className="input-field"
                      >
                        <option value="0.25rem">Small (4px)</option>
                        <option value="0.5rem">Medium (8px)</option>
                        <option value="0.75rem">Large (12px)</option>
                        <option value="1rem">Extra Large (16px)</option>
                      </select>
                    </div>
                  </div>

                  {/* Preview */}
                  <div className="mt-6 p-6 bg-gray-50 rounded-xl">
                    <h3 className="font-medium text-gray-900 mb-4">Preview</h3>
                    <div className="space-y-3">
                      <button
                        className="px-4 py-2 text-white rounded-lg transition-all"
                        style={{ 
                          backgroundColor: settings.appearance.primaryColor,
                          borderRadius: settings.appearance.borderRadius
                        }}
                      >
                        Primary Button
                      </button>
                      <button
                        className="px-4 py-2 text-white rounded-lg ml-3 transition-all"
                        style={{ 
                          backgroundColor: settings.appearance.secondaryColor,
                          borderRadius: settings.appearance.borderRadius
                        }}
                      >
                        Secondary Button
                      </button>
                      <p style={{ fontFamily: settings.appearance.fontFamily }} className="mt-4">
                        This is a preview of the selected font family.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminSettings