import { NextRequest, NextResponse } from 'next/server';

interface BodyShape { from: [number, number]; to: [number, number]; }

const EARTH_RADIUS_KM = 6371;
function haversine(lat1:number, lon1:number, lat2:number, lon2:number){
  const dLat = (lat2-lat1)*Math.PI/180;
  const dLon = (lon2-lon1)*Math.PI/180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
  return 2*EARTH_RADIUS_KM*Math.asin(Math.sqrt(a));
}

// Directly embedding provided key (should be moved to env variable ORS_API_KEY)
const ORS_KEY = process.env.ORS_API_KEY || 'eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjQ0MWQ5MDQ2MzE0OTQ1OGY4ODJiZjliNGJjZWJiMDI2IiwiaCI6Im11cm11cjY0In0=';

export async function POST(req: NextRequest){
  try {
    const body = (await req.json()) as BodyShape;
    const { from, to } = body;
    if (!from || !to || from.length!==2 || to.length!==2) {
      return NextResponse.json({ error: 'Invalid coordinates' }, { status: 400 });
    }

    if (!ORS_KEY) {
      const dist = haversine(from[0], from[1], to[0], to[1]);
      const avgSpeed = 32; // km/h
      const durationMin = Math.max(5, Math.round(dist/avgSpeed*60));
      return NextResponse.json({ distanceKm: dist, durationMin, coordinates: [[from[0], from[1]],[to[0], to[1]]], provider: 'haversine' });
    }

    const orsRes = await fetch('https://api.openrouteservice.org/v2/directions/driving-car', {
      method: 'POST',
      headers: { 'Authorization': ORS_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ coordinates: [ [from[1], from[0]], [to[1], to[0]] ] })
    });

    if (orsRes.ok) {
      const json = await orsRes.json();
      const feature = json?.features?.[0];
      const summary = feature?.properties?.summary;
      const geom = feature?.geometry;
      let coords: [number, number][] = [];
      if (geom?.type === 'LineString') coords = geom.coordinates.map((c: [number, number]) => [c[1], c[0]]);
      else if (geom?.type === 'MultiLineString') coords = geom.coordinates.flat().map((c: [number, number]) => [c[1], c[0]]);
      if (summary) {
        return NextResponse.json({
          distanceKm: summary.distance / 1000,
          durationMin: Math.round(summary.duration / 60),
          coordinates: coords.length ? coords : [[from[0], from[1]],[to[0], to[1]]],
          provider: 'openrouteservice'
        });
      }
    }
    const dist = haversine(from[0], from[1], to[0], to[1]);
    const avgSpeed = 32;
    const durationMin = Math.max(5, Math.round(dist/avgSpeed*60));
    return NextResponse.json({ distanceKm: dist, durationMin, coordinates: [[from[0], from[1]],[to[0], to[1]]], provider: 'haversine' });
  } catch (e:any) {
    return NextResponse.json({ error: 'Routing error', message: e?.message }, { status: 500 });
  }
}
