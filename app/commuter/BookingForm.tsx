'use client';

import { useState, useEffect, useRef } from 'react';
import { routes, Route } from './taxiData';
import { supabase } from '@/lib/supabase';
import dynamic from 'next/dynamic';
import L from 'leaflet';
import { getRoute } from '@/lib/routing';

const MapContainer = dynamic(()=> import('react-leaflet').then(m=>m.MapContainer), { ssr:false });
const TileLayer = dynamic(()=> import('react-leaflet').then(m=>m.TileLayer), { ssr:false });
const Marker = dynamic(()=> import('react-leaflet').then(m=>m.Marker), { ssr:false });
const Polyline = dynamic(()=> import('react-leaflet').then(m=>m.Polyline), { ssr:false });

// Define the driver type based on usage in this file
interface Driver {
  id: string;
  name: string;
  vehicle: string;
  plate: string;
  rating: number;
  trips: number;
  distance: string;
  eta: string;
  photo: string;
}

export default function BookingForm() {
  const [bookingData, setBookingData] = useState({
    from: '',
    to: '',
    passengers: 1,
    bookingType: 'shared' as 'shared' | 'private',
    paymentMethod: 'wallet' as 'wallet' | 'cash' | 'card',
    scheduledTime: 'now' as 'now' | 'later',
    departureTime: '',
    departureDate: ''
  });
  // NEW geo / route related state
  const [fromSuggestions, setFromSuggestions] = useState<any[]>([]);
  const [toSuggestions, setToSuggestions] = useState<any[]>([]);
  const [fromLocation, setFromLocation] = useState<{lat:number;lon:number;label:string}|null>(null);
  const [toLocation, setToLocation] = useState<{lat:number;lon:number;label:string}|null>(null);
  const [distanceKm, setDistanceKm] = useState<number>(0);
  const [durationMin, setDurationMin] = useState<number>(0);
  const [fare, setFare] = useState(0);
  const [fareBreakdown, setFareBreakdown] = useState<string>('');
  const [availableDrivers, setAvailableDrivers] = useState<Driver[]>([]);
  const [showDrivers, setShowDrivers] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [routeCoords, setRouteCoords] = useState<[number, number][]>([]);
  const [routeProvider, setRouteProvider] = useState<'openrouteservice' | 'haversine' | null>(null);
  const [routeLoading, setRouteLoading] = useState(false);

  // Debounce refs
  const fromTimer = useRef<NodeJS.Timeout | null>(null);
  const toTimer = useRef<NodeJS.Timeout | null>(null);

  // Geocode (OpenStreetMap Nominatim)
  async function fetchSuggestions(q: string) {
    if (!q || q.length < 3) return [];
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=5`;
    const res = await fetch(url, { headers: { 'Accept-Language': 'en', 'User-Agent': 'sa-taxi-connect/1.0' }});
    if (!res.ok) return [];
    return res.json();
  }

  useEffect(()=>{
    if (fromTimer.current) clearTimeout(fromTimer.current);
    fromTimer.current = setTimeout(async()=>{
      const list = await fetchSuggestions(bookingData.from);
      setFromSuggestions(list);
    }, 350);
    return ()=>{ if (fromTimer.current) clearTimeout(fromTimer.current); };
  }, [bookingData.from]);

  useEffect(()=>{
    if (toTimer.current) clearTimeout(toTimer.current);
    toTimer.current = setTimeout(async()=>{
      const list = await fetchSuggestions(bookingData.to);
      setToSuggestions(list);
    }, 350);
    return ()=>{ if (toTimer.current) clearTimeout(toTimer.current); };
  }, [bookingData.to]);

  function selectFrom(s: any){
    setFromLocation({ lat: parseFloat(s.lat), lon: parseFloat(s.lon), label: s.display_name });
    setBookingData(b=>({...b, from: s.display_name}));
    setFromSuggestions([]);
  }
  function selectTo(s: any){
    setToLocation({ lat: parseFloat(s.lat), lon: parseFloat(s.lon), label: s.display_name });
    setBookingData(b=>({...b, to: s.display_name}));
    setToSuggestions([]);
  }

  // Distance / duration / fare calculation when geo points & options change (now via routing service)
  useEffect(()=>{
    let cancelled = false;
    async function compute(){
      if (fromLocation && toLocation){
        setRouteLoading(true);
        const res = await getRoute(fromLocation.lat, fromLocation.lon, toLocation.lat, toLocation.lon);
        if (cancelled) return;
        setDistanceKm(res.distanceKm);
        setDurationMin(res.durationMin);
        setRouteCoords(res.coordinates);
        setRouteProvider(res.provider);
        // Fare model (distance based)
        const baseFlag = 10; // base
        const perKm = 3.5; // shared rate
        let calc = baseFlag + res.distanceKm * perKm;
        let breakdown = `Base R${baseFlag.toFixed(2)} + ${res.distanceKm.toFixed(1)} km x R${perKm.toFixed(2)} = R${(baseFlag + res.distanceKm*perKm).toFixed(2)}`;
        if (bookingData.bookingType === 'private') { calc *= 1.8; breakdown += ` \nPrivate multiplier x1.8`; }
        if (bookingData.scheduledTime === 'later') { calc += 5; breakdown += ` \nScheduling fee R5`; }
        if (bookingData.bookingType === 'shared') { breakdown += ` \nShared (${bookingData.passengers} pax) - per person shown`; }
        const finalFare = bookingData.bookingType === 'shared' ? calc / Math.max(1, bookingData.passengers) : calc;
        setFare(Math.round(finalFare));
        setFareBreakdown(breakdown + `\nRoute via ${res.provider}`);
        setRouteLoading(false);
      } else {
        setDistanceKm(0); setDurationMin(0); setFare(0); setFareBreakdown(''); setRouteCoords([]); setRouteProvider(null);
      }
    }
    compute();
    return ()=> { cancelled = true; };
  }, [fromLocation, toLocation, bookingData.bookingType, bookingData.scheduledTime, bookingData.passengers]);

  const handleInputChange = (field: keyof typeof bookingData, value: any) => {
    setBookingData(prev => ({ ...prev, [field]: value }));
    setFormErrors(prev => ({ ...prev, [field]: '' }));
    if (field === 'from') setFromLocation(null);
    if (field === 'to') setToLocation(null);
  };

  const handleQuickRoute = async (route: Route) => {
    setBookingData(prev => ({ ...prev, from: route.from, to: route.to }));
    // Geocode both quickly
    try {
      const [fs, ts] = await Promise.all([fetchSuggestions(route.from), fetchSuggestions(route.to)]);
      if (fs?.[0]) selectFrom(fs[0]);
      if (ts?.[0]) selectTo(ts[0]);
    } catch {}
  };

  // Fetch nearby drivers when showDrivers triggered
  async function loadDrivers() {
    if (!fromLocation) return;
    try {
      const base = (process.env.NEXT_PUBLIC_SUPABASE_URL||'').replace('.supabase.co', '.functions.supabase.co/locations');
      const res = await fetch(base, { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ action: 'find_nearby_drivers', pickup_lat: fromLocation.lat, pickup_lng: fromLocation.lon, radius: 5 }) });
      const json = await res.json();
      const list = (json.drivers||[]).map((d:any,i:number)=>({ id: d.id, name: d.name, vehicle: d.vehicle, plate: d.plate, rating: d.rating, trips: Math.floor(Math.random()*500)+50, distance: `${d.distance.toFixed(1)} km`, eta: `${d.eta} min`, photo: String(i) }));
      setAvailableDrivers(list);
    } catch(e){ setAvailableDrivers([]); }
  }

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!bookingData.from.trim()) errors.from = 'Pickup location is required.';
    if (!bookingData.to.trim()) errors.to = 'Destination is required.';
    if (!bookingData.passengers || bookingData.passengers < 1) errors.passengers = 'At least 1 passenger required.';
    if (!bookingData.paymentMethod) errors.paymentMethod = 'Select a payment method.';
    if (bookingData.scheduledTime === 'later') {
      if (!bookingData.departureDate) errors.departureDate = 'Select a date.';
      if (!bookingData.departureTime) errors.departureTime = 'Select a time.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFindDrivers = () => {
    if (!validateForm()) return;
    setShowDrivers(true);
    loadDrivers();
  };

  const handleSelectDriver = (driver: Driver) => {
    setSelectedDriver(driver);
    setShowDrivers(false);
    setShowConfirmation(true);
  };

  const handleNavigateToDriver = (driver: Driver) => {
    // Simulate driver location coordinates
    const driverLocation = {
      lat: -26.2041 + (Math.random() - 0.5) * 0.01,
      lng: 28.0473 + (Math.random() - 0.5) * 0.01
    };

    const destination = `${driverLocation.lat},${driverLocation.lng}`;
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=walking`;
    window.open(googleMapsUrl, '_blank');
  };

  const handleTrackDriver = (driver: Driver) => {
    // Open real-time tracking in Google Maps
    const trackingUrl = `https://www.google.com/maps/search/taxi/@-26.2041,28.0473,16z`;
    window.open(trackingUrl, '_blank');
  };

  const handleConfirmBooking = async () => {
    if (!validateForm()) return;
    setIsBooking(true);
    setTimeout(() => {
      setIsBooking(false);
      setShowConfirmation(false);
      setShowSuccess(true);
      setBookingData({
        from: '',
        to: '',
        passengers: 1,
        bookingType: 'shared',
        paymentMethod: 'wallet',
        scheduledTime: 'now',
        departureTime: '',
        departureDate: ''
      });
      setSelectedDriver(null);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 2000);
  };

  const startIcon = L.icon({ iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png', iconSize:[25,41], iconAnchor:[12,41], popupAnchor:[1,-34], shadowUrl:'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'});
  const endIcon = L.divIcon({ className:'', html:'<div style="background:#dc2626;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:12px;font-weight:600;">D</div>', iconSize:[28,28], iconAnchor:[14,28] });

  return (
    <div className="px-4 space-y-6">
      {/* Success Message */}
      {showSuccess && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg z-50 animate-fade-in">
          Booking confirmed! Your driver is on the way.
        </div>
      )}
      {/* Location Inputs with suggestions */}
      <div className="bg-white rounded-2xl p-4 shadow-md">
        <div className="space-y-4">
          <div className="relative">
            <div className="absolute left-3 top-3 w-3 h-3 bg-green-500 rounded-full" />
            <input
              type="text"
              placeholder="Pickup location"
              value={bookingData.from}
              onChange={e=>handleInputChange('from', e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border-none text-sm focus:ring-2 focus:ring-orange-500"
            />
            {fromSuggestions.length>0 && (
              <div className="absolute z-20 mt-1 left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg max-h-56 overflow-auto text-sm">
                {fromSuggestions.map((s:any)=> (
                  <button key={s.place_id} onClick={()=>selectFrom(s)} className="block w-full text-left px-3 py-2 hover:bg-orange-50">
                    {s.display_name}
                  </button>
                ))}
              </div>) }
            {formErrors.from && <p className="text-xs text-red-500 mt-1">{formErrors.from}</p>}
          </div>
          <div className="relative">
            <div className="absolute left-3 top-3 w-3 h-3 bg-red-500 rounded-full" />
            <input
              type="text"
              placeholder="Destination"
              value={bookingData.to}
              onChange={e=>handleInputChange('to', e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border-none text-sm focus:ring-2 focus:ring-orange-500"
            />
            {toSuggestions.length>0 && (
              <div className="absolute z-20 mt-1 left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg max-h-56 overflow-auto text-sm">
                {toSuggestions.map((s:any)=> (
                  <button key={s.place_id} onClick={()=>selectTo(s)} className="block w-full text-left px-3 py-2 hover:bg-orange-50">
                    {s.display_name}
                  </button>
                ))}
              </div>) }
            {formErrors.to && <p className="text-xs text-red-500 mt-1">{formErrors.to}</p>}
          </div>
        </div>
      </div>

      {/* Quick Routes */}
      <div className="bg-white rounded-2xl p-4 shadow-md">
        <h3 className="font-semibold text-gray-900 mb-3">Popular Routes</h3>
        <div className="grid grid-cols-2 gap-2">
          {routes.map((route, index) => (
            <button
              key={index}
              onClick={() => handleQuickRoute(route)}
              className="p-3 bg-gray-50 rounded-xl text-left hover:bg-gray-100 transition-colors"
            >
              <p className="text-sm font-medium text-gray-900">{route.from}</p>
              <p className="text-xs text-gray-600">to {route.to}</p>
              <p className="text-xs text-green-600 font-medium">R{route.fare}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Booking Options */}
      <div className="bg-white rounded-2xl p-4 shadow-md">
        <div className="space-y-4">
          {/* Booking Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Booking Type</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleInputChange('bookingType', 'shared')}
                className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                  bookingData.bookingType === 'shared'
                    ? 'border-orange-500 bg-orange-50 text-orange-700'
                    : 'border-gray-200 bg-white text-gray-700'
                }`}
              >
                Shared Taxi
              </button>
              <button
                onClick={() => handleInputChange('bookingType', 'private')}
                className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                  bookingData.bookingType === 'private'
                    ? 'border-orange-500 bg-orange-50 text-orange-700'
                    : 'border-gray-200 bg-white text-gray-700'
                }`}
              >
                Private Trip
              </button>
            </div>
          </div>

          {/* Passengers */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Passengers ({bookingData.passengers})
            </label>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => handleInputChange('passengers', Math.max(1, bookingData.passengers - 1))}
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
              >
                <i className="ri-subtract-line text-gray-600"></i>
              </button>
              <div className="flex-1 bg-gray-50 rounded-xl p-3 text-center">
                {bookingData.passengers} {bookingData.passengers === 1 ? 'person' : 'people'}
              </div>
              <button
                onClick={() => handleInputChange('passengers', Math.min(16, bookingData.passengers + 1))}
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
              >
                <i className="ri-add-line text-gray-600"></i>
              </button>
            </div>
            {formErrors.passengers && <p className="text-xs text-red-500 mt-1">{formErrors.passengers}</p>}
          </div>

          {/* Schedule */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">When</label>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <button
                onClick={() => handleInputChange('scheduledTime', 'now')}
                className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                  bookingData.scheduledTime === 'now'
                    ? 'border-orange-500 bg-orange-50 text-orange-700'
                    : 'border-gray-200 bg-white text-gray-700'
                }`}
              >
                Leave Now
              </button>
              <button
                onClick={() => handleInputChange('scheduledTime', 'later')}
                className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                  bookingData.scheduledTime === 'later'
                    ? 'border-orange-500 bg-orange-50 text-orange-700'
                    : 'border-gray-200 bg-white text-gray-700'
                }`}
              >
                Schedule
              </button>
            </div>

            {bookingData.scheduledTime === 'later' && (
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={bookingData.departureDate}
                  onChange={(e) => handleInputChange('departureDate', e.target.value)}
                  className={`px-3 py-2 bg-gray-50 rounded-xl border-none text-sm focus:ring-2 focus:ring-orange-500 ${formErrors.departureDate ? 'border border-red-500' : ''}`}
                />
                {formErrors.departureDate && <p className="text-xs text-red-500 mt-1">{formErrors.departureDate}</p>}
                <input
                  type="time"
                  value={bookingData.departureTime}
                  onChange={(e) => handleInputChange('departureTime', e.target.value)}
                  className={`px-3 py-2 bg-gray-50 rounded-xl border-none text-sm focus:ring-2 focus:ring-orange-500 ${formErrors.departureTime ? 'border border-red-500' : ''}`}
                />
                {formErrors.departureTime && <p className="text-xs text-red-500 mt-1">{formErrors.departureTime}</p>}
              </div>
            )}
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
            <div className="space-y-2">
              {[
                { id: 'wallet', name: 'Wallet', icon: 'ri-wallet-line', balance: 'R245.50' },
                { id: 'cash', name: 'Cash', icon: 'ri-money-dollar-circle-line', balance: 'Pay driver' },
                { id: 'card', name: 'Card', icon: 'ri-bank-card-line', balance: '**** 4567' }
              ].map((method) => (
                <button
                  key={method.id}
                  onClick={() => handleInputChange('paymentMethod', method.id)}
                  className={`w-full p-3 rounded-xl border-2 text-left transition-all ${
                    bookingData.paymentMethod === method.id
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <i className={`${method.icon} text-gray-600`}></i>
                      <span className="font-medium text-gray-900">{method.name}</span>
                    </div>
                    <span className="text-sm text-gray-600">{method.balance}</span>
                  </div>
                </button>
              ))}
            </div>
            {formErrors.paymentMethod && <p className="text-xs text-red-500 mt-1">{formErrors.paymentMethod}</p>}
          </div>
        </div>
      </div>

      {/* Dynamic Metrics Card */}
      {fare > 0 && fromLocation && toLocation && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Estimated Fare {bookingData.bookingType==='shared' && '(per person)'}</p>
                <p className="text-2xl font-bold">R{fare}</p>
                <p className="text-green-100 text-xs flex flex-col">
                  <span>{distanceKm.toFixed(1)} km • {durationMin} min • {bookingData.bookingType === 'private' ? 'Private' : 'Shared'}</span>
                  <span className="mt-1 whitespace-pre-line opacity-80">{fareBreakdown}</span>
                </p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <i className="ri-road-map-line text-white text-xl" />
              </div>
            </div>
          </div>
          <div className="h-56 w-full rounded-2xl overflow-hidden bg-gray-100 relative">
            {routeLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/60 text-sm font-medium text-gray-700 z-10">
                Calculating route...
              </div>
            )}
            <MapContainer center={{ lat: (fromLocation.lat+toLocation.lat)/2, lng: (fromLocation.lon+toLocation.lon)/2 }} zoom={13} className="h-full w-full">
              <TileLayer attribution='&copy; OSM contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={{ lat: fromLocation.lat, lng: fromLocation.lon }} icon={startIcon} />
              <Marker position={{ lat: toLocation.lat, lng: toLocation.lon }} icon={endIcon} />
              {routeCoords.length >= 2 && (
                <Polyline positions={routeCoords.map(c=> [c[0], c[1]])} pathOptions={{ color: routeProvider==='openrouteservice' ? '#10b981' : '#f59e0b', weight:4, opacity:0.9 }} />
              )}
            </MapContainer>
            <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-[10px] font-medium text-gray-700">
              {routeProvider==='openrouteservice' ? 'Powered by ORS' : 'Approximate'}
            </div>
          </div>
        </div>
      )}

      {/* Find Drivers Button */}
      <button
        onClick={handleFindDrivers}
        disabled={!bookingData.from || !bookingData.to || isBooking}
        className="w-full bg-orange-500 text-white py-4 rounded-xl font-semibold text-lg !rounded-button hover:bg-orange-600 transition-colors disabled:opacity-50"
      >
        Find Available Drivers
      </button>

      {/* Available Drivers Modal */}
      {showDrivers && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
          <div className="bg-white w-full rounded-t-3xl p-6 max-h-4/5 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Available Drivers</h3>
              <button
                onClick={() => setShowDrivers(false)}
                className="w-8 h-8 flex items-center justify-center"
              >
                <i className="ri-close-line text-gray-400 text-xl"></i>
              </button>
            </div>

            {/* Live Map View */}
            <div className="mb-6 bg-gray-50 rounded-2xl overflow-hidden">
              <div className="h-48 relative">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3578.8407096922574!2d28.043631215434864!3d-26.20485958341892!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1e950c68f0406a51%3A0x238ac9d9b1d34041!2sJohannesburg!5e0!3m2!1sen!2sza!4v1635789456789!5m2!1sen!2sza"
                  width="100%"
                  height="192"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                ></iframe>

                {/* Map Controls */}
                <div className="absolute top-2 right-2 bg-white rounded-lg shadow-md p-1">
                  <button
                    onClick={() => {
                      const mapsUrl = "https://www.google.com/maps/search/taxi+drivers+near+me/@-26.2041,28.0473,15z";
                      window.open(mapsUrl, '_blank');
                    }}
                    className="w-6 h-6 flex items-center justify-center text-gray-600 text-sm hover:bg-gray-100 rounded"
                  >
                    <i className="ri-fullscreen-line"></i>
                  </button>
                </div>
              </div>
              <div className="p-3 bg-white border-t text-center">
                <p className="text-sm text-gray-600">
                  <i className="ri-map-pin-line text-orange-500 mr-1"></i>
                  Showing {availableDrivers.length} drivers in your area
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {availableDrivers.map((driver) => (
                <div key={driver.id} className="border border-gray-200 rounded-2xl p-4">
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center overflow-hidden">
                      <img
                        src={`https://readdy.ai/api/search-image?query=Professional%20African%20taxi%20driver%20portrait%2C%20friendly%20expression%2C%20uniform%20shirt%2C%20confident%20smile%2C%20high%20quality%20headshot%2C%20isolated%20on%20white%20background%2C%20realistic%20photography%2C%20professional%20pose%2C%20natural%20lighting&width=48&height=48&seq=${driver.photo}&orientation=squarish`}
                        alt={driver.name}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-gray-900">{driver.name}</h4>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-orange-600 font-medium">{driver.eta}</span>
                          <button
                            onClick={() => handleNavigateToDriver(driver)}
                            className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors"
                          >
                            <i className="ri-navigation-line text-xs"></i>
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{driver.vehicle} • {driver.plate}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <div className="flex items-center">
                          <i className="ri-star-fill text-yellow-400 text-sm mr-1"></i>
                          <span className="text-sm text-gray-600">{driver.rating}</span>
                        </div>
                        <span className="text-sm text-gray-600">{driver.trips} trips</span>
                        <span className="text-sm text-gray-600">{driver.distance} away</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleSelectDriver(driver)}
                      className="flex-1 bg-orange-500 text-white py-3 rounded-xl font-medium !rounded-button hover:bg-orange-600 transition-colors"
                    >
                      Select Driver • R{fare}
                    </button>
                    <button
                      onClick={() => handleTrackDriver(driver)}
                      className="px-4 py-3 bg-blue-100 text-blue-700 rounded-xl !rounded-button hover:bg-blue-200 transition-colors"
                    >
                      <i className="ri-map-pin-line"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Navigation */}
            <div className="mt-6 p-4 bg-blue-50 rounded-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <i className="ri-navigation-line text-white"></i>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Find Closest Driver</p>
                    <p className="text-sm text-gray-600">Auto-navigate to nearest available taxi</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    const mapsUrl = "https://www.google.com/maps/search/taxi+near+me/@-26.2041,28.0473,15z";
                    window.open(mapsUrl, '_blank');
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium !rounded-button hover:bg-blue-600 transition-colors"
                >
                  Navigate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Booking Confirmation Modal */}
      {showConfirmation && selectedDriver && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-taxi-line text-orange-600 text-2xl"></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Booking</h3>
              <p className="text-gray-600">Review your trip details</p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center overflow-hidden">
                    <img
                      src={`https://readdy.ai/api/search-image?query=Professional%20African%20taxi%20driver%20portrait%2C%20friendly%20expression%2C%20uniform%20shirt%2C%20confident%20smile%2C%20high%20quality%20headshot%2C%20isolated%20on%20white%20background%2C%20realistic%20photography%2C%20professional%20pose%2C%20natural%20lighting&width=40&height=40&seq=${selectedDriver.photo}&orientation=squarish`}
                      alt={selectedDriver.name}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{selectedDriver.name}</p>
                    <p className="text-sm text-gray-600">{selectedDriver.vehicle}</p>
                    <div className="flex items-center">
                      <i className="ri-star-fill text-yellow-400 text-sm mr-1"></i>
                      <span className="text-sm text-gray-600">{selectedDriver.rating}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">From</span>
                  <span className="font-medium text-gray-900">{bookingData.from}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">To</span>
                  <span className="font-medium text-gray-900">{bookingData.to}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Passengers</span>
                  <span className="font-medium text-gray-900">{bookingData.passengers}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Type</span>
                  <span className="font-medium text-gray-900">
                    {bookingData.bookingType === 'shared' ? 'Shared' : 'Private'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Payment</span>
                  <span className="font-medium text-gray-900">{bookingData.paymentMethod}</span>
                </div>
                <div className="border-t pt-3 flex items-center justify-between">
                  <span className="font-semibold text-gray-900">Total Fare</span>
                  <span className="text-xl font-bold text-green-600">R{fare}</span>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowConfirmation(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium !rounded-button"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmBooking}
                disabled={isBooking}
                className="flex-1 py-3 bg-orange-500 text-white rounded-xl font-medium !rounded-button hover:bg-orange-600 transition-colors disabled:opacity-50"
              >
                {isBooking ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Booking...
                  </div>
                ) : (
                  'Confirm Booking'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      {isBooking && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center">
            <div className="loader mb-3"></div>
            <p className="text-orange-600 font-semibold">Processing your booking...</p>
          </div>
        </div>
      )}
    </div>
  );
}
