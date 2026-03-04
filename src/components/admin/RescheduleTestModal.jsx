import { useState } from 'react';
import { Calendar, Clock, X, Send, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const RescheduleTestModal = ({ candidate, onClose, onReschedule }) => {
  const [testDate, setTestDate] = useState('');
  const [testTime, setTestTime] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!testDate) {
      toast.error('Please select a test date');
      return;
    }

    if (!testTime) {
      toast.error('Please select a test time');
      return;
    }

    if (!reason.trim()) {
      toast.error('Please provide a reason for rescheduling');
      return;
    }

    setLoading(true);
    onReschedule(candidate, testDate, testTime, reason);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      
      <div className="bg-white rounded-2xl p-6 max-w-md w-full animate-fade-in max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900">Reschedule Test</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Warning Notice */}
        <div className="mb-6">
          <div className="flex items-start p-4 bg-yellow-50 rounded-xl border border-yellow-200">
            <AlertCircle className="w-5 h-5 text-yellow-600 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-800">
                Rescheduling Notice
              </p>
              <p className="text-xs text-yellow-700 mt-1">
                This will cancel the current schedule and notify the candidate via email with the new date and time.
              </p>
            </div>
          </div>
        </div>

        {/* Candidate Info */}
        <div className="mb-6">
          <div className="flex items-center p-4 bg-blue-50 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 font-bold">
                {candidate.name?.charAt(0) || '?'}
              </span>
            </div>
            <div className="ml-3">
              <p className="font-medium text-gray-900">{candidate.name}</p>
              <p className="text-sm text-gray-600">{candidate.course}</p>
              <p className="text-xs text-gray-500 mt-1">{candidate.email}</p>
            </div>
          </div>
        </div>

        {/* Current Schedule */}
        {candidate.testDate && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-500 mb-1">Current Schedule:</p>
            <p className="text-sm font-medium text-gray-700">
              📅 {new Date(candidate.testDate).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
            <p className="text-sm text-gray-700 mt-1">
              ⏰ {candidate.testTime}
            </p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Test Date <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="date"
                value={testDate}
                onChange={(e) => setTestDate(e.target.value)}
                min={today}
                className="input-field pl-10"
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Select a future date
            </p>
          </div>

          {/* Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Test Time <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <select
                value={testTime}
                onChange={(e) => setTestTime(e.target.value)}
                className="input-field pl-10"
                required
              >
                <option value="">Select a time slot</option>
                <option value="07:00 AM">07:00 AM (Morning)</option>
                <option value="08:00 AM">08:00 AM</option>
                <option value="09:00 AM">09:00 AM</option>
                <option value="10:00 AM">10:00 AM</option>
                <option value="11:00 AM">11:00 AM</option>
                <option value="12:00 PM">12:00 PM (Noon)</option>
                <option value="01:00 PM">01:00 PM</option>
                <option value="02:00 PM">02:00 PM</option>
                <option value="03:00 PM">03:00 PM</option>
                <option value="04:00 PM">04:00 PM</option>
                <option value="05:00 PM">05:00 PM</option>
                <option value="06:00 PM">06:00 PM</option>
              </select>
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for Rescheduling <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows="3"
              className="input-field"
              placeholder="e.g., Technical issues, candidate request, schedule conflict, etc."
              required
            />
          </div>

          {/* Email Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start">
              <Send className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-blue-800">
                  Email Notification
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  An email will be sent to <strong>{candidate.email}</strong> with:
                </p>
                <ul className="text-xs text-blue-700 mt-2 list-disc list-inside">
                  <li>New test date: <strong>{testDate || 'Not selected'}</strong></li>
                  <li>New test time: <strong>{testTime || 'Not selected'}</strong></li>
                  <li>Reason: <strong>{reason || 'Not provided'}</strong></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-outline py-3"
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading || !testDate || !testTime || !reason.trim()}
              className="flex-1 btn-primary bg-yellow-600 hover:bg-yellow-700 py-3 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Rescheduling...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Reschedule Test</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default RescheduleTestModal;
