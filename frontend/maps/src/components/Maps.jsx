// // import React, { useEffect, useState } from 'react';
// // import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// // import 'leaflet/dist/leaflet.css';
// // import io from 'socket.io-client';
// // import L from 'leaflet';

// // import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
// // import markerIcon from 'leaflet/dist/images/marker-icon.png';
// // import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// // // Fix missing Leaflet marker icons
// // delete L.Icon.Default.prototype._getIconUrl;
// // L.Icon.Default.mergeOptions({
// //     iconRetinaUrl: markerIcon2x,
// //     iconUrl: markerIcon,
// //     shadowUrl: markerShadow,
// // });

// // const socket = io('https://map-functionality.onrender.com', {
// //     transports: ['websocket'], // Use WebSocket transport only
// //     reconnection: true,
// //     reconnectionAttempts: 5,
// //     reconnectionDelay: 3000
// // });

// // const Maps = () => {
// //     const [locations, setLocations] = useState({});
// //     const [userLocation, setUserLocation] = useState([51.505, -0.09]);

// //     useEffect(() => {
// //         if (navigator.geolocation) {
// //             navigator.geolocation.watchPosition((position) => {
// //                 const { latitude, longitude } = position.coords;
// //                 setUserLocation([latitude, longitude]);
// //                 socket.emit('updateLocation', { lat: latitude, lng: longitude });
// //             }, (error) => {
// //                 console.error("Error getting location:", error);
// //             });
// //         }
        
// //         socket.on('locationUpdate', (data) => {
// //             setLocations(data);
// //         });
// //     }, []);

// //     return (
// //         <MapContainer center={userLocation} zoom={13} style={{ height: '100vh', width: '100%' }}>
// //             <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
// //             {Object.values(locations).map((loc, index) => (
// //                 <Marker key={index} position={[loc.lat, loc.lng]}>
// //                     <Popup>Live Location</Popup>
// //                 </Marker>
// //             ))}
// //         </MapContainer>
// //     );
// // };

// // export default Maps;



// // import React, { useEffect, useState } from 'react';
// // import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// // import 'leaflet/dist/leaflet.css';
// // import io from 'socket.io-client';
// // import L from 'leaflet';

// // import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
// // import markerIcon from 'leaflet/dist/images/marker-icon.png';
// // import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// // // Fix missing Leaflet marker icons
// // delete L.Icon.Default.prototype._getIconUrl;
// // L.Icon.Default.mergeOptions({
// //     iconRetinaUrl: markerIcon2x,
// //     iconUrl: markerIcon,
// //     shadowUrl: markerShadow,
// // });

// // const socket = io('https://map-functionality.onrender.com', {
// //     transports: ['websocket'], // Use WebSocket transport only
// //     reconnection: true,
// //     reconnectionAttempts: 5,
// //     reconnectionDelay: 3000
// // });

// // const MapComponent = () => {
// //     const [locations, setLocations] = useState({});
// //     const [userLocation, setUserLocation] = useState([51.505, -0.09]);

// //     useEffect(() => {
// //         if (navigator.geolocation) {
// //             navigator.geolocation.watchPosition((position) => {
// //                 const { latitude, longitude } = position.coords;
// //                 setUserLocation([latitude, longitude]);
// //                 socket.emit('updateLocation', { lat: latitude, lng: longitude });
// //             }, (error) => {
// //                 console.error("Error getting location:", error);
// //             });
// //         }
        
// //         socket.on('locationUpdate', (data) => {
// //             setLocations(data);
// //         });
// //     }, []);

// //     return (
// //         <MapContainer center={userLocation} zoom={13} style={{ height: '100vh', width: '100%' }}>
// //             <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
// //             {Object.values(locations).map((loc, index) => (
// //                 <Marker key={index} position={[loc.lat, loc.lng]}>
// //                     <Popup>
// //                         <b>Live Location</b><br />
// //                         {loc.locationName || "Fetching location..."}
// //                     </Popup>
// //                 </Marker>
// //             ))}
// //         </MapContainer>
// //     );
// // };

// // export default MapComponent;







// import React, { useEffect, useState } from 'react';
// import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Polyline } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import io from 'socket.io-client';
// import L from 'leaflet';
// import axios from 'axios';

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
//     transports: ['websocket'],
//     reconnection: true,
//     reconnectionAttempts: 5,
//     reconnectionDelay: 3000
// });

// const MapComponent = () => {
//     const [locations, setLocations] = useState({});
//     const [userLocation, setUserLocation] = useState([51.505, -0.09]);
//     const [startPoint, setStartPoint] = useState(null);
//     const [endPoint, setEndPoint] = useState(null);
//     const [route, setRoute] = useState([]);

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

//     const handleMapClick = (e) => {
//         if (!startPoint) {
//             setStartPoint(e.latlng);
//         } else if (!endPoint) {
//             setEndPoint(e.latlng);
//             fetchRoute(startPoint, e.latlng);
//         } else {
//             setStartPoint(e.latlng);
//             setEndPoint(null);
//             setRoute([]);
//         }
//     };

//     const fetchRoute = async (start, end) => {
//         try {
//             const response = await axios.get(`https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`);
//             const coordinates = response.data.routes[0].geometry.coordinates;
//             setRoute(coordinates.map(coord => [coord[1], coord[0]]));
//         } catch (error) {
//             console.error("Error fetching route:", error);
//         }
//     };

//     return (
//         <MapContainer center={userLocation} zoom={13} style={{ height: '100vh', width: '100%' }} onClick={handleMapClick}>
//             <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//             {Object.values(locations).map((loc, index) => (
//                 <Marker key={index} position={[loc.lat, loc.lng]}>
//                     <Popup>
//                         <b>Live Location</b><br />
//                         {loc.locationName || "Fetching location..."}
//                     </Popup>
//                 </Marker>
//             ))}
//             {startPoint && <Marker position={startPoint}><Popup>Start Point</Popup></Marker>}
//             {endPoint && <Marker position={endPoint}><Popup>End Point</Popup></Marker>}
//             {route.length > 0 && <Polyline positions={route} color="blue" />}
//         </MapContainer>
//     );
// };

// export default MapComponent;



import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import io from 'socket.io-client';
import L from 'leaflet';
import axios from 'axios';

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
    transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 3000
});

const Maps = () => {
    const [locations, setLocations] = useState({});
    const [userLocation, setUserLocation] = useState([51.505, -0.09]);
    const [startPoint, setStartPoint] = useState(null);
    const [endPoint, setEndPoint] = useState(null);
    const [route, setRoute] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    
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

    const handleMapClick = (e) => {
        if (!startPoint) {
            setStartPoint(e.latlng);
        } else if (!endPoint) {
            setEndPoint(e.latlng);
            fetchRoute(startPoint, e.latlng);
        } else {
            setStartPoint(e.latlng);
            setEndPoint(null);
            setRoute([]);
        }
    };

    const fetchRoute = async (start, end) => {
        try {
            const response = await axios.get(`https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`);
            const coordinates = response.data.routes[0].geometry.coordinates;
            setRoute(coordinates.map(coord => [coord[1], coord[0]]));
        } catch (error) {
            console.error("Error fetching route:", error);
        }
    };

    const handleSearch = async () => {
        try {
            const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${searchInput}`);
            if (response.data.length > 0) {
                const { lat, lon } = response.data[0];
                if (!startPoint) {
                    setStartPoint({ lat: parseFloat(lat), lng: parseFloat(lon) });
                } else if (!endPoint) {
                    setEndPoint({ lat: parseFloat(lat), lng: parseFloat(lon) });
                    fetchRoute(startPoint, { lat: parseFloat(lat), lng: parseFloat(lon) });
                } else {
                    setStartPoint({ lat: parseFloat(lat), lng: parseFloat(lon) });
                    setEndPoint(null);
                    setRoute([]);
                }
            }
        } catch (error) {
            console.error("Error fetching location:", error);
        }
    };

    return (
        <div>
            <input 
                type="text" 
                value={searchInput} 
                onChange={(e) => setSearchInput(e.target.value)} 
                placeholder="Enter a location"
            />
            <button onClick={handleSearch}>Find Location</button>
            <MapContainer center={userLocation} zoom={13} style={{ height: '90vh', width: '100%' }} onClick={handleMapClick}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {Object.values(locations).map((loc, index) => (
                    <Marker key={index} position={[loc.lat, loc.lng]}>
                        <Popup>
                            <b>Live Location</b><br />
                            {loc.locationName || "Fetching location..."}
                        </Popup>
                    </Marker>
                ))}
                {startPoint && <Marker position={startPoint}><Popup>Start Point</Popup></Marker>}
                {endPoint && <Marker position={endPoint}><Popup>End Point</Popup></Marker>}
                {route.length > 0 && <Polyline positions={route} color="blue" />}
            </MapContainer>
        </div>
    );
};

export default Maps;