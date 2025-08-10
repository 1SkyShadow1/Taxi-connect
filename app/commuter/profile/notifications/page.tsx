'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

// Define the settings type based on the state shape
interface Settings {
  tripAlerts: boolean;
  paymentNotifications: boolean;
  promotionalOffers: boolean;
  safetyAlerts: boolean;
  driverUpdates: boolean;
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

export default function NotificationsSettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    tripAlerts: true,
    paymentNotifications: true,
    promotionalOffers: false,
    safetyAlerts: true,
    driverUpdates: true,
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = '/auth/commuter'; return; }
      if (user.user_metadata?.user_type && user.user_metadata.user_type !== 'commuter') { window.location.href = '/'; return; }
      const { data } = await supabase.from('notification_preferences').select('*').eq('user_id', user.id).single();
      if (data) {
        setSettings(s => ({ ...s, tripAlerts: data.trip_alerts, paymentNotifications: data.payment_notifications, promotionalOffers: data.promotional_offers, safetyAlerts: data.safety_alerts, driverUpdates: data.driver_updates, weeklyReports: data.weekly_reports, pushNotifications: data.push_notifications, emailNotifications: data.email_notifications, smsNotifications: data.sms_notifications, soundEnabled: data.sound_enabled, vibrationEnabled: data.vibration_enabled, quietHours: data.quiet_hours, quietStart: data.quiet_start || '22:00', quietEnd: data.quiet_end || '06:00' }));
      } else {
        // create default row
        await supabase.from('notification_preferences').insert({ user_id: user.id });
      }
      setLoading(false);
    })();
  }, []);

  // Debounced save
  useEffect(() => {
    if (loading) return;
    const t = setTimeout(async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      await supabase.from('notification_preferences').update({
        trip_alerts: settings.tripAlerts,
        payment_notifications: settings.paymentNotifications,
        promotional_offers: settings.promotionalOffers,
        safety_alerts: settings.safetyAlerts,
        driver_updates: settings.driverUpdates,
        weekly_reports: settings.weeklyReports,
        push_notifications: settings.pushNotifications,
        email_notifications: settings.emailNotifications,
        sms_notifications: settings.smsNotifications,
        sound_enabled: settings.soundEnabled,
        vibration_enabled: settings.vibrationEnabled,
        quiet_hours: settings.quietHours,
        quiet_start: settings.quietStart,
        quiet_end: settings.quietEnd
      }).eq('user_id', user.id);
    }, 600);
    return () => clearTimeout(t);
  }, [settings, loading]);

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

  if (loading) return <div className='pt-32 text-center text-gray-500'>Loading preferences...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white shadow-sm z-50">
        <div className="px-4 py-3 flex items-center justify-between">
          <Link href="/commuter/profile" className="flex items-center space-x-2">
            <i className="ri-arrow-left-line text-gray-600 text-xl"></i>
            <span className="font-semibold text-gray-900">Notifications</span>
          </Link>
          <button className="text-blue-600 text-sm font-medium">Reset All</button>
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
                <p className="font-medium text-gray-900">Trip Alerts</p>
                <p className="text-sm text-gray-600">Driver arrival, trip updates, and completion</p>
              </div>
              <button
                onClick={() => toggleSetting('tripAlerts')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.tripAlerts ? 'bg-orange-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.tripAlerts ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium text-gray-900">Payment Notifications</p>
                <p className="text-sm text-gray-600">Payment confirmations and receipts</p>
              </div>
              <button
                onClick={() => toggleSetting('paymentNotifications')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.paymentNotifications ? 'bg-orange-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.paymentNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium text-gray-900">Driver Updates</p>
                <p className="text-sm text-gray-600">Driver location and estimated arrival time</p>
              </div>
              <button
                onClick={() => toggleSetting('driverUpdates')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.driverUpdates ? 'bg-orange-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.driverUpdates ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Safety Notifications */}
        <div className="bg-white rounded-2xl shadow-md mb-6">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Safety & Security</h3>
          </div>
          
          <div className="divide-y divide-gray-100">
            <div className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium text-gray-900">Safety Alerts</p>
                <p className="text-sm text-gray-600">Emergency notifications and safety updates</p>
              </div>
              <button
                onClick={() => toggleSetting('safetyAlerts')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.safetyAlerts ? 'bg-orange-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.safetyAlerts ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Marketing Notifications */}
        <div className="bg-white rounded-2xl shadow-md mb-6">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Marketing & Updates</h3>
          </div>
          
          <div className="divide-y divide-gray-100">
            <div className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium text-gray-900">Promotional Offers</p>
                <p className="text-sm text-gray-600">Discounts, special deals, and promotions</p>
              </div>
              <button
                onClick={() => toggleSetting('promotionalOffers')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.promotionalOffers ? 'bg-orange-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.promotionalOffers ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium text-gray-900">Weekly Reports</p>
                <p className="text-sm text-gray-600">Your travel summary and insights</p>
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
          </div>
        </div>

        {/* Delivery Preferences */}
        <div className="bg-white rounded-2xl shadow-md mb-6">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">How to Receive Notifications</h3>
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
                  <p className="text-sm text-gray-600">Weekly summaries and important updates</p>
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
                  <p className="text-sm text-gray-600">Critical updates via text message</p>
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
                <p className="text-sm text-gray-600">Play sounds for notifications</p>
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
                <p className="text-sm text-gray-600">Vibrate phone for notifications</p>
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
                Emergency and safety alerts will still be delivered during quiet hours
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 w-full bg-white border-t border-gray-200">
        <div className="grid grid-cols-4 px-0">
          <Link href="/commuter" className="flex flex-col items-center py-2 px-1">
            <div className="w-6 h-6 flex items-center justify-center">
              <i className="ri-home-line text-gray-400 text-lg"></i>
            </div>
            <span className="text-xs text-gray-400 mt-1">Home</span>
          </Link>
          <Link href="/commuter/trips" className="flex flex-col items-center py-2 px-1">
            <div className="w-6 h-6 flex items-center justify-center">
              <i className="ri-route-line text-gray-400 text-lg"></i>
            </div>
            <span className="text-xs text-gray-400 mt-1">My Trips</span>
          </Link>
          <Link href="/commuter/wallet" className="flex flex-col items-center py-2 px-1">
            <div className="w-6 h-6 flex items-center justify-center">
              <i className="ri-wallet-line text-gray-400 text-lg"></i>
            </div>
            <span className="text-xs text-gray-400 mt-1">Wallet</span>
          </Link>
          <Link href="/commuter/profile" className="flex flex-col items-center py-2 px-1">
            <div className="w-6 h-6 flex items-center justify-center">
              <i className="ri-user-line text-orange-500 text-lg"></i>
            </div>
            <span className="text-xs text-orange-500 font-medium mt-1">Profile</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}