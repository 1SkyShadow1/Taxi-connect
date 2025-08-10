'use client';

import Link from 'next/link';
import { useState } from 'react';

// Define the settings type based on the state shape
interface Settings {
  tripRequests: boolean;
  paymentUpdates: boolean;
  promotions: boolean;
  emergencyAlerts: boolean;
  systemUpdates: boolean;
  ratingsReviews: boolean;
  weeklyReports: boolean;
  pushNotifications: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  quietHours: boolean;
  quietStart: string;
  quietEnd: string;
}

export default function NotificationsPage() {
  const [settings, setSettings] = useState<Settings>({
    tripRequests: true,
    paymentUpdates: true,
    promotions: false,
    emergencyAlerts: true,
    systemUpdates: true,
    ratingsReviews: true,
    weeklyReports: true,
    pushNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
    soundEnabled: true,
    vibrationEnabled: true,
    quietHours: false,
    quietStart: '22:00',
    quietEnd: '06:00'
  });

  const toggleSetting = (key: keyof Settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key] as boolean
    }));
  };

  const handleTimeChange = (key: keyof Settings, value: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white shadow-sm z-50">
        <div className="px-4 py-3 flex items-center justify-between">
          <Link href="/driver/profile" className="flex items-center space-x-2">
            <i className="ri-arrow-left-line text-gray-600 text-xl"></i>
            <span className="font-semibold text-gray-900">Notifications</span>
          </Link>
          <button className="text-blue-600 text-sm font-medium">Reset</button>
        </div>
      </header>

      {/* Content */}
      <main className="pt-16 pb-20 px-4">
        {/* Trip Notifications */}
        <div className="bg-white rounded-2xl shadow-md mb-6">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Trip Notifications</h3>
          </div>
          
          <div className="divide-y divide-gray-100">
            <div className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium text-gray-900">Trip Requests</p>
                <p className="text-sm text-gray-600">Get notified when passengers request rides</p>
              </div>
              <button
                onClick={() => toggleSetting('tripRequests')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.tripRequests ? 'bg-orange-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.tripRequests ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium text-gray-900">Payment Updates</p>
                <p className="text-sm text-gray-600">Earnings and payout notifications</p>
              </div>
              <button
                onClick={() => toggleSetting('paymentUpdates')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.paymentUpdates ? 'bg-orange-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.paymentUpdates ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium text-gray-900">Ratings & Reviews</p>
                <p className="text-sm text-gray-600">When passengers rate your service</p>
              </div>
              <button
                onClick={() => toggleSetting('ratingsReviews')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.ratingsReviews ? 'bg-orange-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.ratingsReviews ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* System Notifications */}
        <div className="bg-white rounded-2xl shadow-md mb-6">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">System Notifications</h3>
          </div>
          
          <div className="divide-y divide-gray-100">
            <div className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium text-gray-900">Emergency Alerts</p>
                <p className="text-sm text-gray-600">Critical safety and emergency updates</p>
              </div>
              <button
                onClick={() => toggleSetting('emergencyAlerts')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.emergencyAlerts ? 'bg-orange-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.emergencyAlerts ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium text-gray-900">System Updates</p>
                <p className="text-sm text-gray-600">App updates and maintenance notices</p>
              </div>
              <button
                onClick={() => toggleSetting('systemUpdates')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.systemUpdates ? 'bg-orange-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.systemUpdates ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium text-gray-900">Weekly Reports</p>
                <p className="text-sm text-gray-600">Performance and earnings summaries</p>
              </div>
              <button
                onClick={() => toggleSetting('weeklyReports')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.weeklyReports ? 'bg-orange-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.weeklyReports ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium text-gray-900">Promotions</p>
                <p className="text-sm text-gray-600">Special offers and bonus opportunities</p>
              </div>
              <button
                onClick={() => toggleSetting('promotions')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.promotions ? 'bg-orange-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.promotions ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Delivery Methods */}
        <div className="bg-white rounded-2xl shadow-md mb-6">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Delivery Methods</h3>
          </div>
          
          <div className="divide-y divide-gray-100">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <i className="ri-notification-3-line text-blue-600"></i>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Push Notifications</p>
                  <p className="text-sm text-gray-600">Real-time alerts on your phone</p>
                </div>
              </div>
              <button
                onClick={() => toggleSetting('pushNotifications')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.pushNotifications ? 'bg-orange-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.pushNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <i className="ri-mail-line text-green-600"></i>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Email Notifications</p>
                  <p className="text-sm text-gray-600">Weekly summaries and updates</p>
                </div>
              </div>
              <button
                onClick={() => toggleSetting('emailNotifications')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.emailNotifications ? 'bg-orange-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <i className="ri-message-3-line text-purple-600"></i>
                </div>
                <div>
                  <p className="font-medium text-gray-900">SMS Notifications</p>
                  <p className="text-sm text-gray-600">Text messages for critical updates</p>
                </div>
              </div>
              <button
                onClick={() => toggleSetting('smsNotifications')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.smsNotifications ? 'bg-orange-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.smsNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Sound & Vibration */}
        <div className="bg-white rounded-2xl shadow-md mb-6">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Sound & Vibration</h3>
          </div>
          
          <div className="divide-y divide-gray-100">
            <div className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium text-gray-900">Sound</p>
                <p className="text-sm text-gray-600">Play notification sounds</p>
              </div>
              <button
                onClick={() => toggleSetting('soundEnabled')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.soundEnabled ? 'bg-orange-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.soundEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium text-gray-900">Vibration</p>
                <p className="text-sm text-gray-600">Vibrate for notifications</p>
              </div>
              <button
                onClick={() => toggleSetting('vibrationEnabled')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.vibrationEnabled ? 'bg-orange-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.vibrationEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Quiet Hours */}
        <div className="bg-white rounded-2xl shadow-md">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">Quiet Hours</h3>
                <p className="text-sm text-gray-600">Reduce notifications during these hours</p>
              </div>
              <button
                onClick={() => toggleSetting('quietHours')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.quietHours ? 'bg-orange-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.quietHours ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
          
          {settings.quietHours && (
            <div className="p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                  <input
                    type="time"
                    value={settings.quietStart}
                    onChange={(e) => handleTimeChange('quietStart', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 rounded-lg border-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                  <input
                    type="time"
                    value={settings.quietEnd}
                    onChange={(e) => handleTimeChange('quietEnd', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 rounded-lg border-none"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Emergency alerts will still be delivered during quiet hours
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 w-full bg-white border-t border-gray-200">
        <div className="grid grid-cols-4 px-0">
          <Link href="/driver" className="flex flex-col items-center py-2 px-1">
            <div className="w-6 h-6 flex items-center justify-center">
              <i className="ri-dashboard-line text-gray-400 text-lg"></i>
            </div>
            <span className="text-xs text-gray-400 mt-1">Dashboard</span>
          </Link>
          <Link href="/driver/earnings" className="flex flex-col items-center py-2 px-1">
            <div className="w-6 h-6 flex items-center justify-center">
              <i className="ri-money-dollar-circle-line text-gray-400 text-lg"></i>
            </div>
            <span className="text-xs text-gray-400 mt-1">Earnings</span>
          </Link>
          <Link href="/driver/trips" className="flex flex-col items-center py-2 px-1">
            <div className="w-6 h-6 flex items-center justify-center">
              <i className="ri-route-line text-gray-400 text-lg"></i>
            </div>
            <span className="text-xs text-gray-400 mt-1">Trips</span>
          </Link>
          <Link href="/driver/profile" className="flex flex-col items-center py-2 px-1">
            <div className="w-6 h-6 flex items-center justify-center">
              <i className="ri-user-line text-blue-500 text-lg"></i>
            </div>
            <span className="text-xs text-blue-500 font-medium mt-1">Profile</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}