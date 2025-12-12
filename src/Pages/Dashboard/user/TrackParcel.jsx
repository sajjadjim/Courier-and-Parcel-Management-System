import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FaBox, FaMapMarkerAlt, FaTruck } from 'react-icons/fa';

// --- 1. SETUP ICONS ---
const truckIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/2769/2769339.png',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
});

const startIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

const endIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

// --- 2. COORDINATE DATA ---
const districtCoords = {
    "Dhaka": [23.8103, 90.4125],
    "Chattogram": [22.3569, 91.8123],
    "Sylhet": [24.8949, 91.8662],
    "Khulna": [22.8456, 89.5672],
    "Rajshahi": [24.3745, 88.6087],
    "Barisal": [22.7010, 90.3535],
    "Rangpur": [25.7439, 89.2752],
    "Mymensingh": [24.7471, 90.4203],
    "Comilla": [23.4607, 91.1809],
    // Add defaults to prevent crashes if region name doesn't match
    "default": [23.8103, 90.4125] 
};

// --- 3. ANIMATION COMPONENT ---
const MovingMarker = ({ start, end, status }) => {
    const [position, setPosition] = useState(start);
    const progressRef = useRef(0);

    useEffect(() => {
        if (!start || !end) return; // Safety check

        if (status === 'delivered') {
            setPosition(end);
            return;
        }
        if (status === 'pending') {
            setPosition(start);
            return;
        }

        const interval = setInterval(() => {
            progressRef.current += 0.005; 
            if (progressRef.current >= 1) progressRef.current = 0;

            const lat = start[0] + (end[0] - start[0]) * progressRef.current;
            const lng = start[1] + (end[1] - start[1]) * progressRef.current;

            setPosition([lat, lng]);
        }, 50);

        return () => clearInterval(interval);
    }, [start, end, status]);

    return (
        <Marker position={position} icon={truckIcon} zIndexOffset={1000}>
            <Popup>
                <div className="text-center">
                    <p className="font-bold text-blue-600">Rider is on the way!</p>
                    <p className="text-xs">Live GPS Signal</p>
                </div>
            </Popup>
        </Marker>
    );
};

// --- 4. MAP FOCUS ---
const MapFocus = ({ start, end }) => {
    const map = useMap();
    useEffect(() => {
        if (start && end) {
            const bounds = L.latLngBounds([start, end]);
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [start, end, map]);
    return null;
};

// --- MAIN COMPONENT ---
const TrackParcel = ({ parcel }) => {
    
    // 🔥 CRITICAL FIX: If parcel is null/undefined, return nothing
    if (!parcel) return <div className="p-10 text-center">Loading Map Data...</div>;

    // Safe access to coordinates using Optional Chaining (?.) and Fallbacks
    const senderRegion = parcel.senderRegion || "Dhaka";
    const receiverRegion = parcel.receiverRegion || "Chattogram";

    const startPos = districtCoords[senderRegion] || districtCoords["default"];
    const endPos = districtCoords[receiverRegion] || districtCoords["default"];

    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
            {/* Header Info */}
            <div className="p-4 bg-slate-50 border-b border-gray-100 flex justify-between items-center">
                <div>
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                        Live Tracking
                    </h3>
                    {/* Safe access to trackingId */}
                    <p className="text-xs text-slate-500">
                        Tracking ID: <span className="font-mono font-bold">{parcel.trackingId || "N/A"}</span>
                    </p>
                </div>
                <div className="text-right">
                    <span className="badge badge-primary badge-outline text-xs uppercase">
                        {parcel.delivery_status?.replace(/_/g, " ") || "Pending"}
                    </span>
                </div>
            </div>

            {/* Map */}
            <div className="h-[400px] w-full relative z-0">
                <MapContainer center={startPos} zoom={7} className="h-full w-full">
                    <TileLayer
                        attribution='&copy; OpenStreetMap'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    
                    <MapFocus start={startPos} end={endPos} />

                    <Polyline 
                        positions={[startPos, endPos]} 
                        color="#3b82f6" 
                        dashArray="10, 10" 
                        weight={4} 
                        opacity={0.6} 
                    />

                    <Marker position={startPos} icon={startIcon}>
                        <Popup><strong>Sender:</strong> {senderRegion}</Popup>
                    </Marker>

                    <Marker position={endPos} icon={endIcon}>
                        <Popup><strong>Receiver:</strong> {receiverRegion}</Popup>
                    </Marker>

                    <MovingMarker 
                        start={startPos} 
                        end={endPos} 
                        status={parcel.delivery_status} 
                    />
                </MapContainer>
            </div>

            {/* Footer Route Info */}
            <div className="p-4 flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                    <FaBox className="text-green-600" />
                    <div>
                        <p className="text-xs text-gray-400 font-bold uppercase">From</p>
                        <p className="font-semibold text-slate-700">{senderRegion}</p>
                    </div>
                </div>
                <div className="flex-1 border-b-2 border-dotted border-gray-300 mx-4 relative">
                    <FaTruck className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-blue-500" />
                </div>
                <div className="flex items-center gap-2 text-right">
                    <div>
                        <p className="text-xs text-gray-400 font-bold uppercase">To</p>
                        <p className="font-semibold text-slate-700">{receiverRegion}</p>
                    </div>
                    <FaMapMarkerAlt className="text-red-600" />
                </div>
            </div>
        </div>
    );
};

export default TrackParcel;