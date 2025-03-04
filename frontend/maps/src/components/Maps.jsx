// import React, { useEffect, useState } from 'react';
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import io from 'socket.io-client';
// import L from 'leaflet';

// import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
// import markerIcon from 'leaflet/dist/images/marker-icon.png';
// import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// // Fix missing Leaflet marker icons
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//     iconRetinaUrl: markerIcon2x,
//     iconUrl: markerIcon,
//     shadowUrl: markerShadow,
// });

// const socket = io('https://map-functionality.onrender.com', {
//     transports: ['websocket'], // Use WebSocket transport only
//     reconnection: true,
//     reconnectionAttempts: 5,
//     reconnectionDelay: 3000
// });

// const Maps = () => {
//     const [locations, setLocations] = useState({});
//     const [userLocation, setUserLocation] = useState([51.505, -0.09]);

//     useEffect(() => {
//         if (navigator.geolocation) {
//             navigator.geolocation.watchPosition((position) => {
//                 const { latitude, longitude } = position.coords;
//                 setUserLocation([latitude, longitude]);
//                 socket.emit('updateLocation', { lat: latitude, lng: longitude });
//             }, (error) => {
//                 console.error("Error getting location:", error);
//             });
//         }
        
//         socket.on('locationUpdate', (data) => {
//             setLocations(data);
//         });
//     }, []);

//     return (
//         <MapContainer center={userLocation} zoom={13} style={{ height: '100vh', width: '100%' }}>
//             <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//             {Object.values(locations).map((loc, index) => (
//                 <Marker key={index} position={[loc.lat, loc.lng]}>
//                     <Popup>Live Location</Popup>
//                 </Marker>
//             ))}
//         </MapContainer>
//     );
// };

// export default Maps;



import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import io from 'socket.io-client';
import L from 'leaflet';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix missing Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

const socket = io('https://map-functionality.onrender.com', {
    transports: ['websocket'], // Use WebSocket transport only
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 3000
});

const MapComponent = () => {
    const [locations, setLocations] = useState({});
    const [userLocation, setUserLocation] = useState([51.505, -0.09]);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.watchPosition((position) => {
                const { latitude, longitude } = position.coords;
                setUserLocation([latitude, longitude]);
                socket.emit('updateLocation', { lat: latitude, lng: longitude });
            }, (error) => {
                console.error("Error getting location:", error);
            });
        }
        
        socket.on('locationUpdate', (data) => {
            setLocations(data);
        });
    }, []);

    return (
        <MapContainer center={userLocation} zoom={13} style={{ height: '100vh', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {Object.values(locations).map((loc, index) => (
                <Marker key={index} position={[loc.lat, loc.lng]}>
                    <Popup>
                        <b>Live Location</b><br />
                        {loc.locationName || "Fetching location..."}
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default MapComponent;
