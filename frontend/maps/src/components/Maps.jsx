import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

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
                <Marker key={index} position={[loc.lat, loc.lng]}>
                    <Popup>Live Location</Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default Maps;
