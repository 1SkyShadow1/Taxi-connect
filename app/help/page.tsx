'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const helpCategories = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: 'ri-play-circle-line',
      color: 'bg-blue-100 text-blue-600',
      faqs: [
        { q: 'How do I create an account?', a: 'Download the app, select your user type (Commuter or Driver), and follow the registration process with your phone number and basic information.' },
        { q: 'Is the app free to use?', a: 'Yes, downloading and using SA Taxi Connect is completely free. You only pay for the taxi rides you book.' },
        { q: 'What areas does the app cover?', a: 'We currently operate in major South African cities including Johannesburg, Cape Town, Pretoria, and Durban with expansion planned.' }
      ]
    },
    {
      id: 'booking',
      title: 'Booking Rides',
      icon: 'ri-taxi-line',
      color: 'bg-orange-100 text-orange-600',
      faqs: [
        { q: 'How do I book a taxi?', a: 'Enter your pickup location and destination, choose between \"Next Available\" or \"Full Taxi\" booking, select payment method, and confirm your ride.' },
        { q: "What's the difference between booking types?", a: '"Next Available" means you share the taxi with other passengers on the same route. "Full Taxi" gives you private use of the entire vehicle.' },
        { q: 'Can I cancel my booking?', a: 'Yes, you can cancel within 2 minutes of booking without charges. After that, cancellation fees may apply depending on the driver\'s location.' }
      ]
    },
    {
      id: 'payments',
      title: 'Payments & Wallet',
      icon: 'ri-wallet-line',
      color: 'bg-green-100 text-green-600',
      faqs: [
        { q: 'What payment methods are accepted?', a: 'We accept bank cards, mobile money (EFT, PayFast), digital wallet top-ups, and cash payments directly to drivers.' },
        { q: 'How do I add money to my wallet?', a: 'Go to Wallet section, tap \"Top Up\", choose your payment method, enter the amount, and confirm the transaction.' },
        { q: 'Is my payment information secure?', a: 'Yes, all payments are processed through secure, encrypted channels. We don\'t store your full card details on our servers.' }
      ]
    },
    {
      id: 'safety',
      title: 'Safety & Security',
      icon: 'ri-shield-check-line',
      color: 'bg-red-100 text-red-600',
      faqs: [
        { q: 'How do I report a safety concern?', a: 'Use the emergency button in the app, or contact our 24/7 safety hotline. All reports are taken seriously and investigated immediately.' },
        { q: 'Are all drivers verified?', a: 'Yes, every driver undergoes thorough background checks, PRDP verification, vehicle inspections, and document verification before joining our platform.' },
        { q: 'Can I share my trip details?', a: 'Yes, use the \"Share Trip\" feature to send real-time location and trip details to your emergency contacts or family members.' }
      ]
    },
    {
      id: 'technical',
      title: 'Technical Support',
      icon: 'ri-settings-line',
      color: 'bg-purple-100 text-purple-600',
      faqs: [
        { q: 'The app is not working properly', a: 'Try closing and reopening the app, check your internet connection, or restart your phone. If issues persist, contact our support team.' },
        { q: 'I can\'t see nearby taxis', a: 'Ensure location services are enabled for the app, check your internet connection, and make sure you\'re in a covered service area.' },
        { q: 'How do I update the app?', a: 'Visit Google Play Store or Apple App Store, search for \"SA Taxi Connect\", and tap \"Update\" if available.' }
      ]
    }
  ];

  const quickActions = [
    { title: 'Report an Issue', icon: 'ri-error-warning-line', color: 'bg-red-500', link: '/help/report' },
    { title: 'Contact Support', icon: 'ri-customer-service-line', color: 'bg-blue-500', link: 'tel:0800829422' },
    { title: 'Safety Center', icon: 'ri-shield-check-line', color: 'bg-green-500', link: '/help/safety' },
    { title: 'Live Chat', icon: 'ri-chat-3-line', color: 'bg-orange-500', link: '/help/chat' }
  ];

  const filteredCategories = helpCategories.filter(category =>
    category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.faqs.some(faq => 
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white shadow-sm z-50">
        <div className="px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <i className="ri-arrow-left-line text-gray-600 text-xl"></i>
            <span className="font-semibold text-gray-900">Help Center</span>
          </Link>
          <Link href="/help/contact" className="w-8 h-8 flex items-center justify-center">
            <i className="ri-customer-service-line text-gray-600 text-xl"></i>
          </Link>
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border-none text-sm"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {quickActions.map((action, index) => (
            <Link key={index} href={action.link} className="block">
              <div className="bg-white rounded-2xl p-4 shadow-md text-center hover:shadow-lg transition-shadow">
                <div className={`w-12 h-12 ${action.color} rounded-full flex items-center justify-center mx-auto mb-2`}>
                  <i className={`${action.icon} text-white text-xl`}></i>
                </div>
                <h3 className="font-medium text-gray-900 text-sm">{action.title}</h3>
              </div>
            </Link>
          ))}
        </div>

        {/* Emergency Contact */}
        <div className="bg-red-50 rounded-2xl p-4 shadow-md mb-6 border border-red-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
              <i className="ri-alarm-warning-line text-white text-xl"></i>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-red-800">Emergency?</h3>
              <p className="text-red-700 text-sm">For immediate assistance or safety concerns</p>
            </div>
            <Link href="tel:10111">
              <button className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium text-sm !rounded-button">
                Call Now
              </button>
            </Link>
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Frequently Asked Questions</h2>
          
          {filteredCategories.map((category) => (
            <div key={category.id} className="bg-white rounded-2xl shadow-md overflow-hidden">
              <button
                onClick={() => setActiveCategory(activeCategory === category.id ? null : category.id)}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 ${category.color} rounded-full flex items-center justify-center`}>
                    <i className={`${category.icon} text-lg`}></i>
                  </div>
                  <h3 className="font-semibold text-gray-900">{category.title}</h3>
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
                    <p className="font-medium text-gray-900">Email Support</p>
                    <p className="text-sm text-gray-600">We'll respond within 24 hours</p>
                  </div>
                </div>
                <i className="ri-arrow-right-line text-green-600"></i>
              </div>
            </Link>

            <Link href="/help/chat" className="block">
              <div className="flex items-center justify-between p-3 bg-orange-50 hover:bg-orange-100 rounded-xl transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                    <i className="ri-chat-3-line text-white"></i>
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Live Chat</p>
                    <p className="text-sm text-gray-600">Get instant help from our team</p>
                  </div>
                </div>
                <i className="ri-arrow-right-line text-orange-600"></i>
              </div>
            </Link>
          </div>
        </div>

        {/* App Info */}
        <div className="bg-white rounded-2xl p-4 shadow-md mt-6">
          <h3 className="font-semibold text-gray-900 mb-3">App Information</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>App Version</span>
              <span className="font-medium">2.1.0</span>
            </div>
            <div className="flex justify-between">
              <span>Last Updated</span>
              <span className="font-medium">Jan 15, 2024</span>
            </div>
            <div className="flex justify-between">
              <span>Support ID</span>
              <span className="font-medium">#SA-2024-001</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}