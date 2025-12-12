import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useRef } from 'react';

// Default Center (Bangladesh)
const defaultPosition = [23.6850, 90.3563]; 
const defaultZoom = 7;

// --- ICONS ---
// 1. Main District Icon (Red/Large)
const districtIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    shadowSize: [41, 41]
});

// 2. Covered Area Icon (Blue/Small)
const areaIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    iconSize: [18, 30], // Smaller
    iconAnchor: [9, 30],
    popupAnchor: [1, -24],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    shadowSize: [30, 30]
});

// Helper: Map Movement Logic
function MapController({ activeDistrict }) {
    const map = useMap();

    useEffect(() => {
        if (activeDistrict && activeDistrict.latitude && activeDistrict.longitude) {
            // Zoom in closer (11) to see the spread of sub-areas
            map.flyTo(
                [activeDistrict.latitude, activeDistrict.longitude], 
                11, 
                { duration: 1.5 }
            );
        } else {
            // Zoom out if nothing selected
            map.flyTo(defaultPosition, defaultZoom, { duration: 1.5 });
        }
    }, [activeDistrict, map]);

    return null;
}

const BangladeshMap = ({ serviceCenters, activeDistrict }) => {
    const mapRef = useRef(null);

    return (
        <div className="h-full w-full z-0 relative">
            <MapContainer 
                center={defaultPosition} 
                zoom={defaultZoom} 
                scrollWheelZoom={true} 
                className="h-full w-full"
                ref={mapRef}
                zoomControl={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />

                <MapController activeDistrict={activeDistrict} />

                {serviceCenters.map((center, centerIndex) => {
                    if (!center.latitude || !center.longitude) return null;

                    const isActive = activeDistrict?.district === center.district;

                    return (
                        <div key={centerIndex}>
                            {/* 1. MAIN DISTRICT MARKER */}
                            <Marker
                                position={[center.latitude, center.longitude]}
                                icon={districtIcon}
                                zIndexOffset={1000} // Always on top
                            >
                                <Popup>
                                    <div className="text-center">
                                        <h3 className="font-bold text-red-600 text-sm">{center.district} (Hub)</h3>
                                        <p className="text-xs text-slate-500">Main Distribution Center</p>
                                    </div>
                                </Popup>
                            </Marker>

                            {/* 2. SUB-AREA MARKERS (Calculated Positions) */}
                            {center.covered_area.map((areaName, areaIndex) => {
                                // MATHEMATICALLY GENERATE POSITIONS
                                // We arrange them in a circle around the district
                                const totalPoints = center.covered_area.length;
                                const radius = 0.06; // Spread distance (~6-7km)
                                const angle = (areaIndex / totalPoints) * (2 * Math.PI); // Angle in radians
                                
                                const areaLat = center.latitude + (radius * Math.cos(angle));
                                const areaLng = center.longitude + (radius * Math.sin(angle));

                                return (
                                    <Marker
                                        key={`${center.district}-${areaName}`}
                                        position={[areaLat, areaLng]}
                                        icon={areaIcon}
                                        opacity={isActive ? 1 : 0.6} // Fade others if specific district selected
                                    >
                                        <Popup>
                                            <div className="text-center">
                                                <h4 className="font-bold text-blue-600 text-xs">{areaName}</h4>
                                                <p className="text-[10px] text-slate-400">Coverage Zone</p>
                                            </div>
                                        </Popup>
                                    </Marker>
                                );
                            })}
                        </div>
                    );
                })}
            </MapContainer>
            
            {/* Legend */}
            <div className="absolute bottom-4 left-4 z-[400] bg-white/90 backdrop-blur p-3 rounded-xl shadow-lg border border-white/50 text-xs">
                <div className="flex items-center gap-2 mb-1">
                    <img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png" className="h-4" alt="Hub"/>
                    <span className="font-bold text-slate-700">Main Hubs</span>
                </div>
                <div className="flex items-center gap-2">
                    <img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png" className="h-4" alt="Area"/>
                    <span className="font-bold text-slate-500">Coverage Areas</span>
                </div>
            </div>
        </div>
    );
};

export default BangladeshMap;