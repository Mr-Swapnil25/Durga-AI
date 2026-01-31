import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, ZoomControl, useMap } from 'react-leaflet';
import L from 'leaflet';
import { io } from 'socket.io-client';
import { Radio } from 'lucide-react';
// CSS is loaded in index.html, importing here causes loader errors in some environments
// import 'leaflet/dist/leaflet.css';
import { ViewState, DangerZone } from '../types';

// Fix for Leaflet icons in React
const fixLeafletIcons = () => {
  try {
    // @ts-ignore
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
  } catch (e) {
    console.warn("Failed to fix Leaflet icons", e);
  }
};

fixLeafletIcons();

const darkTileLayer = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";

// Custom Icons
const createNeonIcon = (color: string) => L.divIcon({
  className: 'custom-div-icon',
  html: `<div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%; box-shadow: 0 0 10px ${color}, 0 0 20px ${color}; border: 2px solid white;"></div>`,
  iconSize: [12, 12],
  iconAnchor: [6, 6]
});

// Pulse Icon for Guardians
const guardianPulseIcon = L.divIcon({
  className: 'guardian-pulse',
  html: `
    <div class="relative w-8 h-8 flex items-center justify-center -translate-x-1/2 -translate-y-1/2">
      <div class="absolute w-full h-full bg-guardian-purple rounded-full opacity-75 animate-ping"></div>
      <div class="relative w-3 h-3 bg-white rounded-full shadow-[0_0_15px_#6B5EAE] border border-guardian-purple"></div>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 16], // Center the icon (32/2)
});

const userIcon = createNeonIcon('#00F0FF'); // Cyan
const dangerIcon = createNeonIcon('#E63946'); // Red
const safeIcon = createNeonIcon('#00FF9D'); // Greenish/Cyan mix for Safe Haven

// Component to handle auto-fitting bounds
const MapBoundsController = ({ points }: { points: L.LatLngExpression[] }) => {
  const map = useMap();

  useEffect(() => {
    if (points.length > 0) {
      const bounds = L.latLngBounds(points);
      // Pad the bounds so markers aren't on the very edge
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15, animate: true });
    }
  }, [points, map]);

  return null;
};

const CommunityMap: React.FC = () => {
  const center: [number, number] = [51.505, -0.09]; // London default
  const [simulating, setSimulating] = useState(false);
  
  const dangerZones: DangerZone[] = [
    { id: '1', coords: { lat: 51.508, lng: -0.11 }, radius: 300, riskLevel: 'high' },
    { id: '2', coords: { lat: 51.502, lng: -0.07 }, radius: 200, riskLevel: 'moderate' },
  ];

  const safeHavens = [
    { id: 's1', coords: [51.505, -0.09] as [number, number], name: '24/7 Pharmacy' },
    { id: 's2', coords: [51.509, -0.08] as [number, number], name: 'Metro Station' },
  ];

  // Hypothetical Active Guardians
  const activeGuardians = [
    { id: 'g1', coords: [51.504, -0.095] as [number, number], name: 'Guardian Alpha', status: 'active' },
    { id: 'g2', coords: [51.506, -0.085] as [number, number], name: 'Guardian Beta', status: 'active' },
    { id: 'g3', coords: [51.503, -0.092] as [number, number], name: 'Guardian Gamma', status: 'active' },
    { id: 'g4', coords: [51.507, -0.098] as [number, number], name: 'Guardian Delta', status: 'active' },
  ];

  // Collect all points to fit bounds
  const allPoints: L.LatLngExpression[] = [
    center,
    ...dangerZones.map(d => [d.coords.lat, d.coords.lng] as L.LatLngExpression),
    ...safeHavens.map(s => s.coords as L.LatLngExpression),
    ...activeGuardians.map(g => g.coords as L.LatLngExpression)
  ];

  const handleSimulateSignal = () => {
    setSimulating(true);
    
    try {
      // Connect to the Flask backend (assuming default local port)
      const socket = io('http://localhost:5000');
      
      const mockPayload = {
        user_id: 'SIM_USER_X99',
        location: { lat: center[0], lng: center[1] }
      };

      console.log("Simulating SOS Broadcast...", mockPayload);
      socket.emit('trigger_sos', mockPayload);

      // Reset state after 2 seconds to simulate network delay
      setTimeout(() => {
        setSimulating(false);
        socket.disconnect();
      }, 2000);

    } catch (error) {
      console.error("Socket connection failed", error);
      setSimulating(false);
    }
  };

  return (
    <div className="w-full h-full relative">
      {/* HUD Overlay - Top Left */}
      <div className="absolute top-4 left-4 z-[400] glass-panel px-4 py-2 rounded-lg border-l-4 border-cyber-cyan backdrop-blur-md">
        <h3 className="text-cyber-cyan font-orbitron text-sm flex items-center gap-2">
          <span className="w-2 h-2 bg-cyber-cyan rounded-full animate-pulse"></span>
          COMMUNITY WATCH
        </h3>
        <p className="text-[10px] text-gray-400 font-mono mt-1">
          <span className="text-white font-bold">{activeGuardians.length} GUARDIANS</span> ACTIVE NEARBY
        </p>
      </div>

      {/* SOS Simulation Button - Top Right */}
      <button 
        onClick={handleSimulateSignal}
        disabled={simulating}
        className={`absolute top-4 right-4 z-[400] flex items-center gap-2 px-4 py-2 rounded-lg border backdrop-blur-md transition-all duration-300 ${
          simulating 
            ? 'bg-durga-red text-white border-durga-red shadow-[0_0_20px_#E63946]' 
            : 'bg-black/60 text-durga-red border-durga-red/50 hover:bg-durga-red/20'
        }`}
      >
        <Radio size={16} className={simulating ? 'animate-ping' : ''} />
        <span className="font-orbitron text-xs font-bold tracking-wider">
          {simulating ? 'BROADCASTING...' : 'SIMULATE SIGNAL'}
        </span>
      </button>

      <MapContainer 
        center={center} 
        zoom={14} 
        style={{ height: '100%', width: '100%', background: '#050505' }}
        zoomControl={false}
      >
        {/* Bounds Controller */}
        <MapBoundsController points={allPoints} />

        <ZoomControl position="bottomright" />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url={darkTileLayer}
        />

        {/* User Location */}
        <Marker position={center} icon={userIcon}>
          <Popup className="glass-popup font-space text-black">YOU ARE HERE</Popup>
        </Marker>

        {/* Pulse Effect for User Radar */}
        <Circle 
          center={center}
          pathOptions={{ color: '#00F0FF', fillColor: '#00F0FF', fillOpacity: 0.05, weight: 1 }}
          radius={400}
        />
        <Circle 
          center={center}
          pathOptions={{ color: 'transparent', fillColor: '#00F0FF', fillOpacity: 0.1, weight: 0 }}
          radius={100}
        />

        {/* Danger Zones */}
        {dangerZones.map(zone => (
          <Circle
            key={zone.id}
            center={[zone.coords.lat, zone.coords.lng]}
            radius={zone.radius}
            pathOptions={{ color: '#E63946', fillColor: '#E63946', fillOpacity: 0.15, weight: 1, dashArray: '5, 10' }}
          >
             <Marker position={[zone.coords.lat, zone.coords.lng]} icon={dangerIcon}>
               <Popup className="font-space text-red-600 font-bold">HIGH RISK ZONE</Popup>
             </Marker>
          </Circle>
        ))}

        {/* Safe Havens */}
        {safeHavens.map(haven => (
          <Marker key={haven.id} position={haven.coords} icon={safeIcon}>
             <Popup className="font-space text-teal-600 font-bold">{haven.name}</Popup>
          </Marker>
        ))}

        {/* Active Guardians with Pulse Effect */}
        {activeGuardians.map(guardian => (
          <Marker key={guardian.id} position={guardian.coords} icon={guardianPulseIcon}>
            <Popup className="font-space">
              <div className="text-xs">
                <strong className="text-guardian-purple">{guardian.name}</strong><br/>
                <span className="text-green-600">● Active</span>
              </div>
            </Popup>
          </Marker>
        ))}

      </MapContainer>
    </div>
  );
};

export default CommunityMap;