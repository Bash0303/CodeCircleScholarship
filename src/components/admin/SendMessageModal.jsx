import { useState } from 'react'
import { Mail, Phone, X, Send } from 'lucide-react'
import toast from 'react-hot-toast'

const SendMessageModal = ({ candidate, onClose, onSend, resultMessage = false }) => {
  const [message, setMessage] = useState(
    resultMessage 
      ? `Congratulations! Your Test/Exam Score is out. Kindly Visit CodeCircle Tech hub Office to check your result. \n\nOffice Address: K.M 5, Dalex Royal College, Sango, Ilorin, Kwara State\nContact: +2349063836085\n\nBest of luck!`
      : ''
  )
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!message.trim()) {
      toast.error('Please enter a message')
      return
    }

    setLoading(true)
    
    setTimeout(() => {
      onSend(candidate, message)
      setLoading(false)
      onClose()
    }, 1500)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-2xl w-full animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900">
            {resultMessage ? 'Send Result Notification' : 'Send Message'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="mb-6">
          <div className="flex items-center p-4 bg-blue-50 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 font-bold">
                {candidate.name.charAt(0)}
              </span>
            </div>
            <div className="ml-3">
              <p className="font-medium text-gray-900">{candidate.name}</p>
              <p className="text-sm text-gray-600">{candidate.email}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows="8"
              className="input-field"
              placeholder="Type your message here..."
              required
            />
          </div>

          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
            <Mail className="w-5 h-5 text-gray-500" />
            <span className="text-sm text-gray-600">
              Message will be sent to {candidate.email}
            </span>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-outline py-3"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-primary py-3 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SendMessageModal