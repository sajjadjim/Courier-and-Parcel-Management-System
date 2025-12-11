import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useRef } from 'react';

// Center of Bangladesh
const defaultPosition = [23.8103, 90.4125]; 

// Custom Marker Icon
const customIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png', // Professional Map Pin
    iconSize: [35, 35],
    iconAnchor: [17, 35],
    popupAnchor: [0, -30]
});

// Component to handle map movement
function MapController({ activeDistrict }) {
    const map = useMap();

    useEffect(() => {
        if (activeDistrict) {
            map.flyTo(
                [activeDistrict.latitude, activeDistrict.longitude], 
                10, 
                { duration: 1.5 }
            );
        }
    }, [activeDistrict, map]);

    return null;
}

const BangladeshMap = ({ serviceCenters, activeDistrict }) => {
    const mapRef = useRef(null);

    return (
        <div className="h-full w-full z-0">
            <MapContainer 
                center={defaultPosition} 
                zoom={7} 
                scrollWheelZoom={true} 
                className="h-full w-full"
                ref={mapRef}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" // Professional lighter map theme
                />

                <MapController activeDistrict={activeDistrict} />

                {serviceCenters.map((center, index) => {
                    // Check if this marker is the active one
                    const isActive = activeDistrict?.district === center.district;

                    return (
                        <Marker
                            key={index}
                            position={[center.latitude, center.longitude]}
                            icon={customIcon}
                            eventHandlers={{
                                click: () => {
                                    // Optional: You could trigger parent state update here if needed
                                },
                            }}
                        >
                            <Popup className="custom-popup">
                                <div className="p-1 min-w-[150px]">
                                    <h3 className="font-bold text-slate-800 text-base mb-1">{center.district}</h3>
                                    <p className="text-xs text-gray-500 mb-2">Service Hub Active</p>
                                    <div className="border-t pt-2 mt-1">
                                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                                            {center.covered_area.length} Areas
                                        </span>
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>
        </div>
    );
};

export default BangladeshMap;