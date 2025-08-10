
'use client';

import Link from 'next/link';
import { useState } from 'react';
import AIChat from '../../components/AIChat';

export default function SupportPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);

  const supportCategories = [
    {
      id: 'booking',
      title: 'Booking & Rides',
      icon: 'ri-taxi-line',
      color: 'bg-orange-100 text-orange-600',
      faqs: [
        { q: 'How do I book a taxi?', a: 'Open the app, enter your pickup and destination, select your preferred booking type (Next Available for shared rides or Full Taxi for private), choose payment method, and confirm your ride. You\'ll see available drivers nearby with their ratings and estimated arrival times.' },
        { q: 'Can I cancel my booking?', a: 'Yes, you can cancel within 2 minutes of booking without charges. After that, cancellation fees may apply based on the driver\'s location and time invested. Use the cancel button in your active trip or contact support immediately.' },
        { q: 'What if my taxi is late?', a: 'You can track your taxi in real-time through the app. If significantly delayed, contact the driver directly or reach our support team. We monitor all trips and will help resolve any delays promptly.' },
        { q: 'How do I choose between shared and private rides?', a: 'Next Available (R12-15) means sharing with other passengers on fixed routes - cheaper and eco-friendly. Full Taxi (R180-250) gives you private use for custom routes and groups up to 15 people.' }
      ]
    },
    {
      id: 'payment',
      title: 'Payment & Wallet',
      icon: 'ri-wallet-line',
      color: 'bg-green-100 text-green-600',
      faqs: [
        { q: 'How do I add money to my wallet?', a: 'Go to Wallet > Top Up, select your payment method (bank card, bank transfer, or mobile money), enter the amount (minimum R10, maximum R2000), and confirm. Funds are available immediately for rides.' },
        { q: 'What payment methods are accepted?', a: 'We accept: Digital wallet (instant payment), Credit/debit cards (Visa, Mastercard, Amex), Bank transfers (FNB, Standard Bank, ABSA, Nedbank), Mobile money (Vodacom, MTN, Cell C), and Cash payments directly to drivers.' },
        { q: 'Can I get a refund?', a: 'Yes! Refunds are processed for cancelled trips, driver no-shows, or service issues. Contact support with your trip details. Refunds typically take 1-3 business days to reflect in your account.' },
        { q: 'Is my payment information secure?', a: 'Absolutely! All payments are encrypted with bank-level security. We don\'t store your full card details, and all transactions are processed through secure, PCI-compliant payment gateways.' }
      ]
    },
    {
      id: 'safety',
      title: 'Safety & Security',
      icon: 'ri-shield-check-line',
      color: 'bg-red-100 text-red-600',
      faqs: [
        { q: 'How do I report a safety concern?', a: 'Use the red emergency button in the app immediately, or call our 24/7 safety hotline. You can also report through the app after your trip. All safety reports are investigated immediately and taken seriously.' },
        { q: 'Are all drivers verified?', a: 'Yes! Every driver undergoes comprehensive background checks, PRDP verification, vehicle roadworthiness inspections, and document verification. We also monitor driver ratings and conduct regular re-verification.' },
        { q: 'Can I share my trip with family?', a: 'Yes! Use the "Share Trip" feature to send real-time location, driver details, and estimated arrival time to your emergency contacts. Your family can track your journey live for peace of mind.' },
        { q: 'What safety features does the app have?', a: 'Emergency button, trip sharing, driver ratings, real-time tracking, 24/7 support hotline, anonymous reporting, driver photo and vehicle details, and integration with local emergency services.' }
      ]
    },
    {
      id: 'account',
      title: 'Account & Profile',
      icon: 'ri-user-line',
      color: 'bg-blue-100 text-blue-600',
      faqs: [
        { q: 'How do I update my profile?', a: 'Go to Profile > Edit Profile to update your personal information, photo, contact details, and emergency contacts. Make sure to verify any phone number changes with the SMS code we send.' },
        { q: 'Can I change my phone number?', a: 'Yes! Update your phone number in Profile settings. You\'ll receive a verification code via SMS to confirm the change. This ensures your account security and enables proper communication.' },
        { q: 'How do I delete my account?', a: 'Contact our support team to request account deletion. We\'ll verify your identity and process the request within 48 hours. Note that this action cannot be undone and will remove all your trip history.' },
        { q: 'Why do I need to verify my account?', a: 'Verification ensures safety for all users, enables faster support, prevents fraudulent accounts, and allows you to access all app features including digital wallet and trip history.' }
      ]
    },
    {
      id: 'routes',
      title: 'Routes & Locations',
      icon: 'ri-map-pin-line',
      color: 'bg-purple-100 text-purple-600',
      faqs: [
        { q: 'What areas do you serve?', a: 'We operate in major South African cities: Johannesburg, Cape Town, Pretoria, and Durban, with expansion to other cities planned. Each city has comprehensive route coverage including townships and suburbs.' },
        { q: 'How do I find taxi ranks?', a: 'Use the "Ranks" tab to find nearby taxi ranks with Google Maps integration. You can see facilities available, routes served, and contact information for each rank.' },
        { q: 'Can I suggest new routes?', a: 'Yes! We welcome route suggestions from our community. Use the "Suggest a Rank" feature or contact support with details about areas that need taxi services.' },
        { q: 'How often do taxis run on each route?', a: 'Frequency varies by route demand: Major routes (every 5-10 minutes), Popular routes (every 8-12 minutes), Regional routes (every 10-15 minutes). Real-time availability is shown in the app.' }
      ]
    }
  ];

  const emergencyContacts = [
    { type: 'Police', number: '10111', icon: 'ri-police-car-line', color: 'bg-blue-500' },
    { type: 'Ambulance', number: '10177', icon: 'ri-ambulance-line', color: 'bg-red-500' },
    { type: 'Fire Dept', number: '10177', icon: 'ri-fire-line', color: 'bg-orange-500' },
    { type: 'App Support', number: '0800829422', icon: 'ri-customer-service-line', color: 'bg-green-500' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white shadow-sm z-50">
        <div className="px-4 py-3 flex items-center justify-between">
          <Link href="/commuter" className="flex items-center space-x-2">
            <i className="ri-arrow-left-line text-gray-600 text-xl"></i>
            <span className="font-semibold text-gray-900">Help & Support</span>
          </Link>
          <button 
            onClick={() => setShowChat(true)}
            className="px-3 py-1 bg-orange-100 text-orange-600 rounded-lg text-sm font-medium !rounded-button hover:bg-orange-200 transition-colors"
          >
            <i className="ri-robot-line mr-1"></i>
            AI Help
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="pt-16 pb-20 px-4">
        {/* Search */}
        <div className="bg-white rounded-2xl p-4 shadow-md mb-6">
          <div className="relative">
            <i className="ri-search-line absolute left-3 top-3 text-gray-400"></i>
            <input
              type="text"
              placeholder="Search for help..."
              className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border-none text-sm"
            />
          </div>
        </div>

        {/* Quick AI Chat */}
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-4 shadow-md mb-6 border border-orange-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                <i className="ri-robot-line text-white text-xl"></i>
              </div>
              <div>
                <h3 className="font-semibold text-orange-800">AI Assistant</h3>
                <p className="text-orange-700 text-sm">Get instant answers to your questions</p>
              </div>
            </div>
            <button
              onClick={() => setShowChat(true)}
              className="bg-orange-500 text-white px-4 py-2 rounded-lg font-medium !rounded-button hover:bg-orange-600 transition-colors"
            >
              Chat Now
            </button>
          </div>
        </div>

        {/* Emergency Contacts */}
        <div className="bg-red-50 rounded-2xl p-4 shadow-md mb-6 border border-red-200">
          <h3 className="font-semibold text-red-800 mb-3 flex items-center">
            <i className="ri-alarm-warning-line mr-2"></i>
            Emergency Contacts
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {emergencyContacts.map((contact, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-white rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className={`w-6 h-6 ${contact.color} rounded-full flex items-center justify-center`}>
                    <i className={`${contact.icon} text-white text-xs`}></i>
                  </div>
                  <span className="font-medium text-gray-900 text-sm">{contact.type}</span>
                </div>
                <Link href={`tel:${contact.number}`}>
                  <button className="px-2 py-1 bg-red-500 text-white rounded text-xs font-medium !rounded-button">
                    {contact.type === 'App Support' ? 'Call' : contact.number}
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Support Categories */}
        <div className="space-y-4">
          {supportCategories.map((category) => (
            <div key={category.id} className="bg-white rounded-2xl shadow-md overflow-hidden">
              <button
                onClick={() => setActiveCategory(activeCategory === category.id ? null : category.id)}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 ${category.color} rounded-full flex items-center justify-center`}>
                    <i className={`${category.icon} text-lg`}></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{category.title}</h3>
                    <p className="text-sm text-gray-600">{category.faqs.length} questions</p>
                  </div>
                </div>
                <i className={`ri-arrow-down-s-line text-gray-400 text-xl transition-transform ${
                  activeCategory === category.id ? 'rotate-180' : ''
                }`}></i>
              </button>

              {activeCategory === category.id && (
                <div className="px-4 pb-4 space-y-3 border-t border-gray-100">
                  {category.faqs.map((faq, index) => (
                    <div key={index} className="bg-gray-50 rounded-xl p-4">
                      <h4 className="font-medium text-gray-900 mb-2">{faq.q}</h4>
                      <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Options */}
        <div className="bg-white rounded-2xl p-4 shadow-md mt-6">
          <h3 className="font-semibold text-gray-900 mb-4">Still need help?</h3>
          <div className="space-y-3">
            <button 
              onClick={() => setShowChat(true)}
              className="w-full flex items-center justify-between p-3 bg-orange-50 hover:bg-orange-100 rounded-xl transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                  <i className="ri-robot-line text-white"></i>
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">AI Assistant</p>
                  <p className="text-sm text-gray-600">Get instant help from our AI bot</p>
                </div>
              </div>
              <i className="ri-arrow-right-line text-orange-600"></i>
            </button>

            <Link href="tel:0800829422" className="block">
              <div className="flex items-center justify-between p-3 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <i className="ri-phone-line text-white"></i>
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Call Support</p>
                    <p className="text-sm text-gray-600">0800 TAXI (24/7)</p>
                  </div>
                </div>
                <i className="ri-arrow-right-line text-blue-600"></i>
              </div>
            </Link>

            <Link href="mailto:support@sataxiconnect.co.za" className="block">
              <div className="flex items-center justify-between p-3 bg-green-50 hover:bg-green-100 rounded-xl transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <i className="ri-mail-line text-white"></i>
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Email Us</p>
                    <p className="text-sm text-gray-600">We'll respond within 24 hours</p>
                  </div>
                </div>
                <i className="ri-arrow-right-line text-green-600"></i>
              </div>
            </Link>
          </div>
        </div>

        {/* App Information */}
        <div className="bg-white rounded-2xl p-4 shadow-md mt-6">
          <h3 className="font-semibold text-gray-900 mb-3">App Information</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">App Version</span>
              <span className="font-medium text-gray-900">2.1.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Last Updated</span>
              <span className="font-medium text-gray-900" suppressHydrationWarning={true}>
                {new Date().toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Support ID</span>
              <span className="font-medium text-gray-900">#SA-2024-001</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Device</span>
              <span className="font-medium text-gray-900">Mobile App</span>
            </div>
          </div>
        </div>
      </main>

      {/* AI Chat Component */}
      <AIChat 
        isOpen={showChat} 
        onClose={() => setShowChat(false)}
        context="commuter-support"
      />

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
              <i className="ri-user-line text-gray-400 text-lg"></i>
            </div>
            <span className="text-xs text-gray-400 mt-1">Profile</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
