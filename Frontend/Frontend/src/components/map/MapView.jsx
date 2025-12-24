import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// TripAdvisor-style price bubble marker
const createPriceMarker = (price, isHovered = false) => {
    const bgColor = isHovered ? '#1a73e8' : '#000000';
    const textColor = '#ffffff';
    const fontSize = isHovered ? '15' : '14';
    const padding = isHovered ? '8' : '6';
    const borderRadius = isHovered ? '8' : '6';

    return new L.DivIcon({
        className: 'custom-price-marker',
        html: `
            <div style="
                background-color: ${bgColor};
                color: ${textColor};
                padding: ${padding}px 12px;
                border-radius: ${borderRadius}px;
                font-weight: bold;
                font-size: ${fontSize}px;
                white-space: nowrap;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                border: 2px solid white;
                cursor: pointer;
                transition: all 0.2s ease;
            ">
                ₹${price}
            </div>
        `,
        iconSize: [60, 32],
        iconAnchor: [30, 16],
        popupAnchor: [0, -16]
    });
};

// Component to update map bounds when properties change
function MapBoundsUpdater({ properties }) {
    const map = useMap();

    useEffect(() => {
        if (properties && properties.length > 0) {
            const validProperties = properties.filter(p => p.latitude && p.longitude);
            if (validProperties.length > 0) {
                const bounds = validProperties.map(p => [p.latitude, p.longitude]);
                map.fitBounds(bounds, { padding: [50, 50] });
            }
        }
    }, [properties, map]);

    return null;
}

export default function MapView({ properties, onMarkerClick }) {
    const navigate = useNavigate();
    const [center, setCenter] = useState([12.9716, 77.5946]); // Bangalore center as default
    const [zoom, setZoom] = useState(12);
    const [hoveredMarker, setHoveredMarker] = useState(null);

    useEffect(() => {
        // Set initial center based on first property with coordinates
        const firstProperty = properties?.find(p => p.latitude && p.longitude);
        if (firstProperty) {
            setCenter([firstProperty.latitude, firstProperty.longitude]);
            setZoom(13);
        }
    }, [properties]);

    const handleMarkerClick = (property) => {
        if (onMarkerClick) {
            onMarkerClick(property);
        } else {
            navigate(`/property/${property.id}`);
        }
    };

    const validProperties = properties?.filter(p => p.latitude && p.longitude) || [];

    return (
        <div className="h-full w-full rounded-lg overflow-hidden">
            <MapContainer
                center={center}
                zoom={zoom}
                className="h-full w-full"
                scrollWheelZoom={true}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapBoundsUpdater properties={validProperties} />

                {validProperties.map((property) => (
                    <Marker
                        key={property.id}
                        position={[property.latitude, property.longitude]}
                        icon={createPriceMarker(property.price, hoveredMarker === property.id)}
                        eventHandlers={{
                            click: () => handleMarkerClick(property),
                            mouseover: () => setHoveredMarker(property.id),
                            mouseout: () => setHoveredMarker(null)
                        }}
                    >
                        <Popup>
                            <div className="p-0 min-w-[250px] -m-3">
                                {property.images && property.images[0] && (
                                    <img
                                        src={property.images[0]}
                                        alt={property.title}
                                        className="w-full h-40 object-cover rounded-t-lg mb-3"
                                    />
                                )}
                                <div className="px-3 pb-3">
                                    <h3 className="font-bold text-neutral-900 mb-1 text-base">
                                        {property.title}
                                    </h3>
                                    <p className="text-sm text-neutral-600 mb-2 flex items-center gap-1">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                            <circle cx="12" cy="10" r="3"></circle>
                                        </svg>
                                        {property.location}
                                    </p>

                                    {property.rating && (
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="bg-green-700 text-white px-2 py-0.5 rounded text-sm font-bold">
                                                {property.rating}
                                            </div>
                                            <div className="flex gap-0.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill={i < Math.floor(property.rating) ? "#16a34a" : "#d1d5db"}>
                                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                                    </svg>
                                                ))}
                                            </div>
                                            <span className="text-xs text-neutral-500">({property.reviews})</span>
                                        </div>
                                    )}

                                    <div className="flex items-baseline justify-between pt-2 border-t border-neutral-200">
                                        <div>
                                            <span className="text-xs text-neutral-600">from</span>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-xl font-bold text-neutral-900">
                                                    ₹{property.price}
                                                </span>
                                                <span className="text-xs text-neutral-500">/ night</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleMarkerClick(property)}
                                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded transition-colors"
                                        >
                                            View
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
