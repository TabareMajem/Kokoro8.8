import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, 
  Mail, 
  Lock, 
  Palette, 
  Globe,
  Calendar,
  Users,
  Save,
  AlertCircle
} from 'lucide-react';
import { useTeacherSettings } from '../../../hooks/useTeacherSettings';

export default function TeacherSettings() {
  const [activeTab, setActiveTab] = useState('notifications');
  const { getSettings, updateSettings, isLoading, error } = useTeacherSettings();

  const [formData, setFormData] = useState({
    notifications: {
      email: true,
      inApp: true,
      parentUpdates: true,
      studentProgress: true
    },
    email: {
      signature: '',
      replyTo: '',
      copyToSelf: false
    },
    calendar: {
      defaultView: 'week',
      weekStartsOn: 1,
      workingHours: {
        start: '09:00',
        end: '17:00'
      }
    },
    display: {
      theme: 'system',
      colorScheme: 'purple',
      language: 'en'
    },
    privacy: {
      showEmail: false,
      showProfile: true,
      allowMessages: true
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateSettings(formData);
    } catch (err) {
      console.error('Failed to update settings:', err);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm">
      {/* Settings Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-4 p-4">
          {[
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'email', label: 'Email', icon: Mail },
            { id: 'calendar', label: 'Calendar', icon: Calendar },
            { id: 'display', label: 'Display', icon: Palette },
            { id: 'privacy', label: 'Privacy', icon: Lock }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="ml-2">{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Settings Content */}
      <form onSubmit={handleSubmit} className="p-6">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-2"
          >
            <AlertCircle className="w-5 h-5" />
            {error}
          </motion.div>
        )}

        {/* Notification Settings */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Notification Preferences</h3>
            <div className="space-y-4">
              {[
                { id: 'email', label: 'Email notifications' },
                { id: 'inApp', label: 'In-app notifications' },
                { id: 'parentUpdates', label: 'Parent communication updates' },
                { id: 'studentProgress', label: 'Student progress alerts' }
              ].map((setting) => (
                <label key={setting.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.notifications[setting.id as keyof typeof formData.notifications]}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      notifications: {
                        ...prev.notifications,
                        [setting.id]: e.target.checked
                      }
                    }))}
                    className="rounded border-gray-300 text-purple-600 
                      focus:ring-purple-200"
                  />
                  <span className="text-gray-700">{setting.label}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Email Settings */}
        {activeTab === 'email' && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Email Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Signature
                </label>
                <textarea
                  value={formData.email.signature}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    email: { ...prev.email, signature: e.target.value }
                  }))}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg
                    focus:ring-2 focus:ring-purple-200 focus:border-purple-400
                    resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reply-To Email
                </label>
                <input
                  type="email"
                  value={formData.email.replyTo}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    email: { ...prev.email, replyTo: e.target.value }
                  }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg
                    focus:ring-2 focus:ring-purple-200 focus:border-purple-400"
                />
              </div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.email.copyToSelf}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    email: { ...prev.email, copyToSelf: e.target.checked }
                  }))}
                  className="rounded border-gray-300 text-purple-600 
                    focus:ring-purple-200"
                />
                <span className="text-gray-700">Send copy to myself</span>
              </label>
            </div>
          </div>
        )}

        {/* Calendar Settings */}
        {activeTab === 'calendar' && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Calendar Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Default View
                </label>
                <select
                  value={formData.calendar.defaultView}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    calendar: { ...prev.calendar, defaultView: e.target.value }
                  }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg
                    focus:ring-2 focus:ring-purple-200 focus:border-purple-400"
                >
                  <option value="week">Week</option>
                  <option value="month">Month</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Week Starts On
                </label>
                <select
                  value={formData.calendar.weekStartsOn}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    calendar: { ...prev.calendar, weekStartsOn: Number(e.target.value) }
                  }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg
                    focus:ring-2 focus:ring-purple-200 focus:border-purple-400"
                >
                  <option value={0}>Sunday</option>
                  <option value={1}>Monday</option>
                  <option value={6}>Saturday</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Display Settings */}
        {activeTab === 'display' && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Display Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Theme
                </label>
                <select
                  value={formData.display.theme}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    display: { ...prev.display, theme: e.target.value }
                  }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg
                    focus:ring-2 focus:ring-purple-200 focus:border-purple-400"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Language
                </label>
                <select
                  value={formData.display.language}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    display: { ...prev.display, language: e.target.value }
                  }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg
                    focus:ring-2 focus:ring-purple-200 focus:border-purple-400"
                >
                  <option value="en">English</option>
                  <option value="ja">Japanese</option>
                  <option value="es">Spanish</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Privacy Settings */}
        {activeTab === 'privacy' && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Privacy Settings</h3>
            <div className="space-y-4">
              {[
                { id: 'showEmail', label: 'Show email to parents' },
                { id: 'showProfile', label: 'Show profile to other teachers' },
                { id: 'allowMessages', label: 'Allow direct messages' }
              ].map((setting) => (
                <label key={setting.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.privacy[setting.id as keyof typeof formData.privacy]}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      privacy: {
                        ...prev.privacy,
                        [setting.id]: e.target.checked
                      }
                    }))}
                    className="rounded border-gray-300 text-purple-600 
                      focus:ring-purple-200"
                  />
                  <span className="text-gray-700">{setting.label}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="mt-6">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-purple-600 text-white rounded-lg
              hover:bg-purple-700 transition-colors disabled:opacity-50
              disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent 
                  rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}