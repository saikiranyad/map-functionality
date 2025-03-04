import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Popup, Marker, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import io from 'socket.io-client';

// const socket = io('http://localhost:5000');
const socket = io('https://map-functionality.onrender.com');

const Maps = () => {
    const [locations, setLocations] = useState({});
    const [userLocation, setUserLocation] = useState([51.505, -0.09]);

    useEffect(() => {
        navigator.geolocation.watchPosition((position) => {
            const { latitude, longitude } = position.coords;
            setUserLocation([latitude, longitude]);
            socket.emit('updateLocation', { lat: latitude, lng: longitude });
        });
        
        socket.on('locationUpdate', (data) => {
            setLocations(data);
        });
    }, []);

    return (
        <MapContainer center={userLocation} zoom={13} style={{ height: '100vh', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {Object.values(locations).map((loc, index) => (
                <CircleMarker key={index} position={[loc.lat, loc.lng]}>
                    <Popup>Live Location</Popup>
                </CircleMarker>
            ))}
        </MapContainer>
    );
};

export default Maps;
