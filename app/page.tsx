'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  const [userType, setUserType] = useState<'commuter' | 'driver' | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-orange-50 to-yellow-50 text-gray-900">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/90 backdrop-blur-sm shadow-sm z-50">
        <div className="max-w-5xl mx-auto px-5 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center space-x-2">
              <img src="/Logo.png" alt="SA Taxi Connect Logo" className="h-9 w-9 rounded-xl object-contain shadow-sm" />
              <span className="font-pacifico text-2xl bg-gradient-to-r from-primary-600 to-orange-500 bg-clip-text text-transparent">SA Taxi Connect</span>
            </Link>
          </div>
          <nav className="hidden sm:flex items-center gap-6 text-sm font-medium">
            <a href="#features" className="hover:text-primary-600 transition-colors">Features</a>
            <a href="#tech" className="hover:text-primary-600 transition-colors">Technology</a>
            <a href="#reviews" className="hover:text-primary-600 transition-colors">Reviews</a>
            <a href="#sponsors" className="hover:text-primary-600 transition-colors">Partners</a>
            <a href="#get" className="hover:text-primary-600 transition-colors">Get Started</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/auth/commuter" className="hidden sm:inline-block px-4 py-2 rounded-full text-sm font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 transition">Login</Link>
            <Link href="/auth/driver" className="hidden sm:inline-block px-4 py-2 rounded-full text-sm font-semibold bg-primary-500 hover:bg-primary-600 text-white transition">Driver Join</Link>
            <button className="sm:hidden w-9 h-9 flex items-center justify-center"><i className="ri-menu-line text-xl text-gray-600"/></button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-28 pb-20 px-5">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6">
              Safer, Smarter <span className="text-primary-600">Minibus Taxi</span> Travel Across South Africa
            </h1>
            <p className="text-lg text-gray-600 mb-8">Real-time ranks, verified drivers, digital payments & intelligent route insights – all in one progressive web app you can install.</p>
            <div className="flex flex-wrap gap-3">
              <Link href="/auth/commuter" className="px-6 py-3 rounded-full bg-primary-500 hover:bg-primary-600 text-white font-semibold shadow-soft">Get Started</Link>
              <Link href="#features" className="px-6 py-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold">Explore Features</Link>
            </div>
            <div className="mt-8 flex items-center gap-6 text-sm">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full border-2 border-white bg-orange-200"></div>
                <div className="w-8 h-8 rounded-full border-2 border-white bg-blue-200"></div>
                <div className="w-8 h-8 rounded-full border-2 border-white bg-green-200"></div>
              </div>
              <p className="text-gray-600"><span className="font-semibold text-gray-900">5,000+</span> early users onboard</p>
            </div>
          </div>
          <div className="relative">
            <div className="w-full aspect-[4/3] rounded-3xl bg-white shadow-elevated border border-orange-100 p-6 flex flex-col justify-between">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 rounded-xl bg-primary-50">
                  <i className="ri-shield-check-line text-primary-600 text-2xl"/>
                  <p className="mt-1 text-xs font-medium">Verified</p>
                </div>
                <div className="p-3 rounded-xl bg-secondary-50">
                  <i className="ri-timer-flash-line text-secondary-600 text-2xl"/>
                  <p className="mt-1 text-xs font-medium">Realtime</p>
                </div>
                <div className="p-3 rounded-xl bg-accent-50">
                  <i className="ri-route-line text-accent-600 text-2xl"/>
                  <p className="mt-1 text-xs font-medium">Routes</p>
                </div>
              </div>
              <div className="rounded-2xl bg-gradient-to-r from-primary-600 to-orange-500 text-white p-5 text-sm font-medium shadow-soft">
                “This platform is transforming township mobility with data-driven transparency.”
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* User Type Quick Select */}
      <section id="get" className="px-5 pb-16">
        <h2 className="text-center text-2xl font-bold mb-8">Choose Your Experience</h2>
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
          <Link href="/auth/commuter" className="block group">
            <div className="bg-white rounded-3xl p-6 shadow-soft border border-primary-100 group-hover:shadow-elevated transition">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-primary-500 flex items-center justify-center text-white text-2xl shadow-sm"><i className="ri-user-line"/></div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-1">I'm a Commuter</h3>
                  <p className="text-gray-600 text-sm">Find nearest ranks, compare fares & track trips.</p>
                </div>
                <i className="ri-arrow-right-up-line text-primary-500 text-xl"/>
              </div>
            </div>
          </Link>
          <Link href="/auth/driver" className="block group">
            <div className="bg-white rounded-3xl p-6 shadow-soft border border-secondary-100 group-hover:shadow-elevated transition">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-secondary-500 flex items-center justify-center text-white text-2xl shadow-sm"><i className="ri-steering-2-line"/></div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-1">I'm a Driver/Owner</h3>
                  <p className="text-gray-600 text-sm">Manage routes, verify docs & receive digital payments.</p>
                </div>
                <i className="ri-arrow-right-up-line text-secondary-500 text-xl"/>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="px-5 py-16 bg-white/70 backdrop-blur-sm border-t border-b border-gray-100">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-center text-2xl font-bold mb-10">Platform Highlights</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[{icon:'ri-shield-check-line',title:'Verified Drivers',desc:'KYC & document backed driver trust.'},{icon:'ri-map-pin-2-line',title:'Live Rank Proximity',desc:'Location-aware nearest rank suggestions.'},{icon:'ri-exchange-dollar-line',title:'Transparent Fare Benchmarks',desc:'City & distance aware guidance.'},{icon:'ri-wallet-3-line',title:'Digital Wallet',desc:'Top-ups & trip settlements.'},{icon:'ri-notification-line',title:'Smart Notifications',desc:'Trip updates & safety alerts.'},{icon:'ri-ai-generate',title:'AI Assistant',desc:'Route, fare & safety Q&A.'}].map(f=> (
              <div key={f.title} className="p-5 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 shadow-soft">
                <div className="w-11 h-11 rounded-xl bg-primary-100 flex items-center justify-center mb-4 text-primary-600"><i className={`${f.icon} text-xl`}/></div>
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies */}
      <section id="tech" className="px-5 py-16">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-2xl font-bold mb-4">Modern, Performant Stack</h2>
            <p className="text-gray-600 mb-5">Built with Next.js App Router, Supabase (Auth, Realtime, Edge Functions), Tailwind CSS, Zod validation & a progressive web app layer for offline-first resilience.</p>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2"><i className="ri-checkbox-circle-line text-primary-500"></i> Supabase Realtime channels for location & trip events</li>
              <li className="flex items-start gap-2"><i className="ri-checkbox-circle-line text-primary-500"></i> Secure RLS-protected Postgres data</li>
              <li className="flex items-start gap-2"><i className="ri-checkbox-circle-line text-primary-500"></i> Zod schemas ensuring input integrity</li>
              <li className="flex items-start gap-2"><i className="ri-checkbox-circle-line text-primary-500"></i> PWA install with offline rank caching</li>
            </ul>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center text-sm font-medium">
            {['Next.js','Supabase','Tailwind','TypeScript','Zod','PWA'].map(t => (
              <div key={t} className="p-4 rounded-2xl bg-white border border-gray-100 shadow-soft hover:shadow-elevated transition">
                <span className="bg-gradient-to-r from-primary-600 to-orange-500 bg-clip-text text-transparent">{t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" className="px-5 py-16 bg-white/70 backdrop-blur-sm border-t border-b border-gray-100">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-center text-2xl font-bold mb-10">What Early Users Say</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[{name:'Ayanda',role:'Commuter',text:'I now plan my morning taxi with confidence – no wandering rank to rank.'},{name:'Jay',role:'Driver',text:'Digital notifications reduced missed passengers and idle time.'},{name:'Naledi',role:'Commuter',text:'Love the safety focus and verified driver badges.'}].map(r => (
              <div key={r.name} className="p-5 rounded-2xl bg-white border border-gray-100 shadow-soft">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-10 h-10 rounded-full bg-primary-100" />
                  <div>
                    <p className="font-semibold text-sm">{r.name}</p>
                    <p className="text-xs text-gray-500">{r.role}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">“{r.text}”</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sponsors */}
      <section id="sponsors" className="px-5 py-14">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-center text-2xl font-bold mb-10">Partners & Supporters</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 items-center">
            {['TransportCo','UrbanFlow','RouteData','SafeRide'].map(p => (
              <div key={p} className="h-16 rounded-2xl bg-white shadow-soft border border-gray-100 flex items-center justify-center text-sm font-semibold text-gray-500">{p}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-5 py-10 bg-gray-900 text-gray-300">
        <div className="max-w-5xl mx-auto grid md:grid-cols-4 gap-10 text-sm">
          <div className="col-span-2">
            <div className="flex items-center space-x-2 mb-3">
              <img src="/Logo.png" alt="SA Taxi Connect Logo" className="h-8 w-8 rounded-lg object-contain" />
              <p className="font-pacifico text-xl text-white">SA Taxi Connect</p>
            </div>
            <p className="text-gray-400 mb-4">Empowering commuters & drivers through transparent, location-aware mobility.</p>
            <p className="text-xs text-gray-500">© {new Date().getFullYear()} SA Taxi Connect. All rights reserved.</p>
          </div>
          <div>
            <p className="font-semibold text-white mb-3">Product</p>
            <ul className="space-y-1">
              <li><a href="#features" className="hover:text-white">Features</a></li>
              <li><a href="#tech" className="hover:text-white">Technology</a></li>
              <li><a href="#reviews" className="hover:text-white">Reviews</a></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-white mb-3">Get Started</p>
            <ul className="space-y-1">
              <li><Link href="/auth/commuter" className="hover:text-white">Commuter</Link></li>
              <li><Link href="/auth/driver" className="hover:text-white">Driver</Link></li>
              <li><a href="#get" className="hover:text-white">Install PWA</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}