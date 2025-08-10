'use client';

import { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

interface Rank {
  id: string;
  name: string;
  address: string;
  distance?: string; // computed
  routes: string[];
  facilities: string[];
  status: string;
  taxis: number;
  coordinates: { lat: number; lng: number };
}

const EARTH_RADIUS_KM = 6371;
function haversine(a: {lat:number; lng:number}, b: {lat:number; lng:number}) {
  const dLat = (b.lat - a.lat) * Math.PI / 180;
  const dLng = (b.lng - a.lng) * Math.PI / 180;
  const lat1 = a.lat * Math.PI / 180;
  const lat2 = b.lat * Math.PI / 180;
  const h = Math.sin(dLat/2)**2 + Math.cos(lat1)*Math.cos(lat2)*Math.sin(dLng/2)**2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
}

const baseRanks: Rank[] = [
  { id: '1', name: 'Park Station Taxi Rank', address: 'Wolmarans Street, Johannesburg CBD', routes: ['Soweto','Alexandra','Randburg'], facilities: ['Shelter','Security','Toilets'], status: 'Active', taxis: 12, coordinates: { lat: -26.2041, lng: 28.0473 } },
  { id: '2', name: 'Bree Street Taxi Rank', address: 'Bree Street, Johannesburg CBD', routes: ['Germiston','Benoni','Springs'], facilities: ['Shelter','Food Court'], status: 'Active', taxis: 8, coordinates: { lat: -26.2045, lng: 28.0456 } },
  { id: '3', name: 'Noord Street Taxi Rank', address: 'Noord Street, Johannesburg CBD', routes: ['Pretoria','Midrand','Centurion'], facilities: ['Shelter','Security','ATM'], status: 'Busy', taxis: 15, coordinates: { lat: -26.2028, lng: 28.0441 } },
];

const MapContainer = dynamic(() => import('react-leaflet').then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(m => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(m => m.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(m => m.Popup), { ssr: false });
const Polyline = dynamic(() => import('react-leaflet').then(m => m.Polyline), { ssr: false });

export default function RankFinder() {
  const [showMap, setShowMap] = useState(false);
  const [userPos, setUserPos] = useState<{lat:number; lng:number} | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(true);

  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setGeoError('Geolocation not supported');
      setLoadingLocation(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => {
        setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLoadingLocation(false);
      },
      err => {
        setGeoError(err.message || 'Location permission denied');
        setLoadingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  const ranks = useMemo(() => {
    if (!userPos) return baseRanks;
    return [...baseRanks].map(r => {
      const distKm = haversine(userPos, r.coordinates);
      return { ...r, distance: distKm < 1 ? `${Math.round(distKm*1000)} m` : `${distKm.toFixed(1)} km` };
    }).sort((a,b) => {
      const da = a.distance ? parseFloat(a.distance) : Infinity;
      const db = b.distance ? parseFloat(b.distance) : Infinity;
      return da - db;
    });
  }, [userPos]);

  const userIcon = useMemo(()=> L.icon({ iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png', iconSize:[25,41], iconAnchor:[12,41], popupAnchor:[1,-34], shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'}), []);
  const rankIcon = useMemo(()=> L.divIcon({ className:'bg-orange-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold', html:'<div style="background:#f97316;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;">R</div>', iconSize:[28,28], iconAnchor:[14,14] }), []);

  const handleNavigateToRank = (rank: Rank) => {
    const destination = `${rank.coordinates.lat},${rank.coordinates.lng}`;
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=walking`;
    window.open(googleMapsUrl, '_blank');
  };

  return (
    <div className="px-4 space-y-4">
      <div className="bg-white rounded-3xl p-5 shadow-soft border border-orange-100 flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <i className="ri-map-pin-2-fill text-primary-500"></i>
            Nearby Taxi Ranks
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            {loadingLocation ? 'Locating you...' : geoError ? geoError : userPos ? 'Location acquired' : 'Using default area'}
          </p>
        </div>
        <button
          onClick={() => setShowMap(s => !s)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${showMap ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          {showMap ? 'List View' : 'Map View'}
        </button>
      </div>

      {showMap && (
        <div className="bg-white rounded-3xl overflow-hidden shadow-soft border border-gray-100">
          <div className="h-80 relative">
            <MapContainer center={userPos || { lat: -26.2041, lng: 28.0473 }} zoom={14} className="h-80 w-full z-0">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {userPos && (
                <Marker position={userPos} icon={userIcon}>
                  <Popup>You are here</Popup>
                </Marker>
              )}
              {ranks.map(r => (
                <Marker key={r.id} position={{ lat: r.coordinates.lat, lng: r.coordinates.lng }} icon={rankIcon}>
                  <Popup>
                    <div className="text-xs font-semibold">{r.name}</div>
                    <div className="text-[10px] text-gray-600">{r.distance || ''}</div>
                  </Popup>
                </Marker>
              ))}
              {userPos && ranks.slice(0,3).map(r => (
                <Polyline key={r.id} positions={[userPos, { lat: r.coordinates.lat, lng: r.coordinates.lng }]} pathOptions={{ color:'#f97316', weight:2, opacity:0.5 }} />
              ))}
            </MapContainer>
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-xl shadow-elevated p-2 flex gap-2">
              <button
                onClick={() => setShowMap(false)}
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700"
              >
                <i className="ri-list-unordered"></i>
              </button>
            </div>
          </div>
          <div className="p-3 bg-gray-50 border-t text-xs text-gray-600 flex items-center justify-between">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-green-500 rounded-full"></span>Active</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-yellow-500 rounded-full"></span>Busy</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-primary-500 rounded-full"></span>You</span>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {ranks.map(rank => (
          <div key={rank.id} className="bg-white rounded-3xl p-5 shadow-soft border border-gray-100">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 pr-3">
                <h4 className="font-semibold text-gray-900 leading-tight">{rank.name}</h4>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{rank.address}</p>
              </div>
              <div className="text-right">
                <span className="text-sm font-semibold text-primary-600">{rank.distance || '—'}</span>
                <div className={`mt-1 px-2 py-0.5 rounded-full text-[10px] font-medium tracking-wide ${rank.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{rank.status}</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {rank.routes.slice(0,4).map(r => (
                <span key={r} className="px-2 py-0.5 rounded-full bg-primary-50 text-primary-700 text-[10px] font-medium">{r}</span>
              ))}
            </div>
            <div className="flex items-center justify-between text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1"><i className="ri-taxi-line text-primary-500"></i>{rank.taxis} taxis</span>
                <span className="hidden sm:inline">•</span>
                <span className="flex items-center gap-1"><i className="ri-tools-line text-secondary-500"></i>{rank.facilities.length} facilities</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleNavigateToRank(rank)} className="px-3 py-1.5 rounded-lg bg-primary-500 hover:bg-primary-600 text-white text-xs font-semibold shadow-sm">Go</button>
                <button className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium">Info</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl p-5 shadow-soft border border-dashed border-primary-200 text-center">
        <p className="text-sm text-gray-600 mb-3">Don't see your local rank?</p>
        <button className="px-5 py-2 rounded-full bg-secondary-500 hover:bg-secondary-600 text-white text-sm font-semibold shadow-sm">Suggest a Rank</button>
      </div>
    </div>
  );
}
