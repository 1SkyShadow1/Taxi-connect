// OpenRouteService routing (free tier requires API key). Fallback to simple haversine if key missing or request fails.
export interface RouteResult {
  distanceKm: number;
  durationMin: number;
  coordinates: [number, number][]; // [lat, lng]
  provider: 'openrouteservice' | 'haversine';
}

const EARTH_RADIUS_KM = 6371;
function haversine(lat1:number, lon1:number, lat2:number, lon2:number){
  const dLat = (lat2-lat1)*Math.PI/180;
  const dLon = (lon2-lon1)*Math.PI/180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
  return 2*EARTH_RADIUS_KM*Math.asin(Math.sqrt(a));
}

// OpenRouteService routing moved server-side via /api/directions to keep key secret.
export async function getRoute(lat1:number, lon1:number, lat2:number, lon2:number): Promise<RouteResult>{
  try {
    const res = await fetch('/api/directions', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ from:[lat1, lon1], to:[lat2, lon2] }) });
    if (res.ok){
      const json = await res.json();
      return json as RouteResult;
    }
  } catch(e){ /* fallback */ }
  // Fallback straight-line
  const dist = haversine(lat1, lon1, lat2, lon2);
  const avgSpeed = 32;
  const durationMin = Math.max(5, Math.round(dist/avgSpeed*60));
  return { distanceKm: dist, durationMin, coordinates: [[lat1, lon1],[lat2, lon2]], provider: 'haversine' };
}
