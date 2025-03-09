


// import React, { useEffect, useState } from 'react';
// import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import io from 'socket.io-client';
// import L from 'leaflet';
// import axios from 'axios';

// import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
// import markerIcon from 'leaflet/dist/images/marker-icon.png';
// import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// // Vehicle icon with rotation
// const vehicleIcon = new L.Icon({
//     iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Red_Arrow_Up.svg/1024px-Red_Arrow_Up.svg.png',
//     iconSize: [35, 35],
//     iconAnchor: [17, 35],
//     popupAnchor: [0, -35]
// });

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

// const RecenterMap = ({ center }) => {
//     const map = useMap();
//     useEffect(() => {
//         map.setView(center, map.getZoom());
//     }, [center, map]);
//     return null;
// };

// const Maps7 = () => {
//     const [locations, setLocations] = useState({});
//     const [userLocation, setUserLocation] = useState([51.505, -0.09]);
//     const [userHeading, setUserHeading] = useState(0);
//     const [startPoint, setStartPoint] = useState(null);
//     const [endPoint, setEndPoint] = useState(null);
//     const [route, setRoute] = useState([]);
//     const [distance, setDistance] = useState(null);
//     const [duration, setDuration] = useState(null);
//     const [fromInput, setFromInput] = useState('');
//     const [toInput, setToInput] = useState('');
//     const [useLiveLocation, setUseLiveLocation] = useState(false);

//     useEffect(() => {
//         if (navigator.geolocation) {
//             navigator.geolocation.watchPosition((position) => {
//                 const { latitude, longitude, heading } = position.coords;
//                 setUserLocation([latitude, longitude]);
//                 setUserHeading(heading || 0);
//                 socket.emit('updateLocation', { lat: latitude, lng: longitude });
//             }, (error) => {
//                 console.error("Error getting location:", error);
//             });
//         }

//         socket.on('locationUpdate', (data) => {
//             setLocations(data);
//         });
//     }, []);

//     const handleFromLocation = async () => {
//         try {
//             const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${fromInput}`);
//             if (response.data.length > 0) {
//                 const location = response.data[0];
//                 setStartPoint({ lat: parseFloat(location.lat), lng: parseFloat(location.lon) });
//             }
//         } catch (error) {
//             console.error("Error fetching location:", error);
//         }
//     };

//     const handleToLocation = async () => {
//         try {
//             const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${toInput}`);
//             if (response.data.length > 0) {
//                 const location = response.data[0];
//                 setEndPoint({ lat: parseFloat(location.lat), lng: parseFloat(location.lon) });
//             }
//         } catch (error) {
//             console.error("Error fetching location:", error);
//         }
//     };

//     const fetchRoute = async () => {
//         if (endPoint) {
//             const start = useLiveLocation ? userLocation : startPoint;
//             if (start) {
//                 try {
//                     const response = await axios.get(`https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${endPoint.lng},${endPoint.lat}?overview=full&geometries=geojson`);
//                     const routeData = response.data.routes[0];
//                     setRoute(routeData.geometry.coordinates.map(coord => [coord[1], coord[0]]));
//                     setDistance((routeData.distance / 1000).toFixed(2));
//                     setDuration((routeData.duration / 60).toFixed(2));
//                 } catch (error) {
//                     console.error("Error fetching route:", error);
//                 }
//             }
//         }
//     };

//     return (
//         <div style={{ padding: '20px', textAlign: 'center', background: '#f8f9fa', borderRadius: '10px' }}>
//             <input 
//                 type="text" 
//                 value={fromInput} 
//                 onChange={(e) => setFromInput(e.target.value)}
//                 placeholder="From Location"
//                 disabled={useLiveLocation}
//                 style={{ padding: '12px', width: '300px', borderRadius: '8px', border: '1px solid #ccc', marginBottom: '10px', marginRight: '10px' }}
//             />
//             <button onClick={handleFromLocation} disabled={useLiveLocation} style={{ padding: '10px', borderRadius: '5px', background: '#007bff', color: 'white', cursor: 'pointer' }}>Set From</button>
//             <input 
//                 type="text" 
//                 value={toInput} 
//                 onChange={(e) => setToInput(e.target.value)}
//                 placeholder="To Location"
//                 style={{ padding: '12px', width: '300px', borderRadius: '8px', border: '1px solid #ccc', marginBottom: '10px', marginLeft: '10px' }}
//             />
//             <button onClick={handleToLocation} style={{ padding: '10px', borderRadius: '5px', background: '#007bff', color: 'white', cursor: 'pointer' }}>Set To</button>
//             <button onClick={fetchRoute} style={{ padding: '10px', borderRadius: '5px', background: '#28a745', color: 'white', cursor: 'pointer', marginLeft: '10px' }}>Show Route</button>
//             <button onClick={() => setUseLiveLocation(!useLiveLocation)} style={{ padding: '10px', borderRadius: '5px', background: '#17a2b8', color: 'white', cursor: 'pointer', marginLeft: '10px' }}>{useLiveLocation ? "Disable Live Location" : "Live Location"}</button>
//             <div style={{ marginBottom: '10px', fontWeight: 'bold', color: '#333' }}>
//                 {distance && <p>Distance: {distance} km</p>}
//                 {duration && <p>Estimated Time: {duration} mins</p>}
//             </div>
//             <MapContainer center={userLocation} zoom={13} style={{ height: '80vh', width: '100%', borderRadius: '10px' }}>
//                 <RecenterMap center={userLocation} />
//                 <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//                 <Marker position={userLocation} icon={vehicleIcon} rotationAngle={userHeading}><Popup>Your Live Location</Popup></Marker>                 {startPoint && <Marker position={startPoint}><Popup>Start Point</Popup></Marker>}
//                 {endPoint && <Marker position={endPoint}><Popup>End Point</Popup></Marker>}
//                 {route.length > 0 && <Polyline positions={route} color="blue" />}
//              </MapContainer>
//         </div>
//     );
// };

// export default Maps7;



// import React, { useEffect, useState } from 'react';
// import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
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

// const RecenterMap = ({ center }) => {
//     const map = useMap();
//     useEffect(() => {
//         map.setView(center, map.getZoom());
//     }, [center, map]);
//     return null;
// };

// const Maps7 = () => {
//     const [userLocation, setUserLocation] = useState([51.505, -0.09]);
//     const [startPoint, setStartPoint] = useState(null);
//     const [endPoint, setEndPoint] = useState(null);
//     const [route, setRoute] = useState([]);
//     const [distance, setDistance] = useState(null);
//     const [duration, setDuration] = useState(null);
//     const [fromInput, setFromInput] = useState('');
//     const [toInput, setToInput] = useState('');
//     const [useLiveLocation, setUseLiveLocation] = useState(false);

//     useEffect(() => {
//         if (navigator.geolocation) {
//             navigator.geolocation.watchPosition((position) => {
//                 const { latitude, longitude } = position.coords;
//                 setUserLocation([latitude, longitude]);
//                 socket.emit('updateLocation', { lat: latitude, lng: longitude });
//                 if (useLiveLocation) {
//                     setStartPoint({ lat: latitude, lng: longitude });
//                 }
//             }, (error) => {
//                 console.error("Error getting location:", error);
//             });
//         }
//     }, [useLiveLocation]);

//     const handleFromLocation = async () => {
//         try {
//             const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${fromInput}`);
//             if (response.data.length > 0) {
//                 const location = response.data[0];
//                 setStartPoint({ lat: parseFloat(location.lat), lng: parseFloat(location.lon) });
//             }
//         } catch (error) {
//             console.error("Error fetching location:", error);
//         }
//     };

//     const handleToLocation = async () => {
//         try {
//             const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${toInput}`);
//             if (response.data.length > 0) {
//                 const location = response.data[0];
//                 setEndPoint({ lat: parseFloat(location.lat), lng: parseFloat(location.lon) });
//             }
//         } catch (error) {
//             console.error("Error fetching location:", error);
//         }
//     };

//     const handleSearchChange = async (e) => {
//         setSearchInput(e.target.value);
//         if (e.target.value.length > 2) {
//             try {
//                 const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${e.target.value}`);
//                 setSuggestions(response.data);
//             } catch (error) {
//                 console.error("Error fetching suggestions:", error);
//             }
//         } else {
//             setSuggestions([]);
//         }
//     };

//     const fetchRoute = async () => {
//         const start = useLiveLocation ? { lat: userLocation[0], lng: userLocation[1] } : startPoint;     
//          if (start && endPoint) {
//             try {
//                 const response = await axios.get(`https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${endPoint.lng},${endPoint.lat}?overview=full&geometries=geojson`);
//                 const routeData = response.data.routes[0];
//                 setRoute(routeData.geometry.coordinates.map(coord => [coord[1], coord[0]]));
//                 setDistance((routeData.distance / 1000).toFixed(2));
//                 setDuration((routeData.duration / 60).toFixed(2));
//             } catch (error) {
//                 console.error("Error fetching route:", error);
//             }
//         }
//     };

//     return (
//         <div style={{ padding: '20px', textAlign: 'center', background: '#f8f9fa', borderRadius: '10px' }}>
//             <input type="text" placeholder="From" value={fromInput} onChange={(e) => setFromInput(e.target.value)} />
//             <button onClick={handleFromLocation}>Set From</button>
//             <br />
//             <input type="text" placeholder="To" value={toInput} onChange={(e) => setToInput(e.target.value)} />
//             <button onClick={handleToLocation}>Set To</button>
//             <br />
//             <label>
//                 <input type="checkbox" checked={useLiveLocation} onChange={() => setUseLiveLocation(!useLiveLocation)} /> Use Live Location
//             </label>
//             <br />
//             <button onClick={fetchRoute}>Get Route</button>
//             <p>Distance: {distance} km</p>
//             <p>Duration: {duration} min</p>
//             <MapContainer center={userLocation} zoom={13} style={{ height: '500px', width: '100%' }}>
//                 <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//                 {startPoint && <Marker position={[startPoint.lat, startPoint.lng]}><Popup>Start Point</Popup></Marker>}
//                 {endPoint && <Marker position={[endPoint.lat, endPoint.lng]}><Popup>End Point</Popup></Marker>}
//                 {route.length > 0 && <Polyline positions={route} color="blue" />}
//                 <RecenterMap center={userLocation} />
//             </MapContainer>
//         </div>
//     );
// };

// export default Maps7;








// import React, { useEffect, useState } from 'react';
// import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
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

// const RecenterMap = ({ center }) => {
//     const map = useMap();
//     useEffect(() => {
//         map.setView(center, map.getZoom());
//     }, [center, map]);
//     return null;
// };

// const Maps7 = () => {
//     const [userLocation, setUserLocation] = useState([51.505, -0.09]);
//     const [startPoint, setStartPoint] = useState(null);
//     const [endPoint, setEndPoint] = useState(null);
//     const [route, setRoute] = useState([]);
//     const [distance, setDistance] = useState(null);
//     const [duration, setDuration] = useState(null);
//     const [fromInput, setFromInput] = useState('');
//     const [toInput, setToInput] = useState('');
//     const [useLiveLocation, setUseLiveLocation] = useState(false);
//     const [fromSuggestions, setFromSuggestions] = useState([]);
//     const [toSuggestions, setToSuggestions] = useState([]);

//     useEffect(() => {
//         if (navigator.geolocation) {
//             navigator.geolocation.watchPosition((position) => {
//                 const { latitude, longitude } = position.coords;
//                 setUserLocation([latitude, longitude]);
//                 socket.emit('updateLocation', { lat: latitude, lng: longitude });
//                 if (useLiveLocation) {
//                     setStartPoint({ lat: latitude, lng: longitude });
//                 }
//             }, (error) => {
//                 console.error("Error getting location:", error);
//             });
//         }
//     }, [useLiveLocation]);

//     const fetchSuggestions = async (query, setSuggestions) => {
//         if (query.length > 2) {
//             try {
//                 const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`);
//                 setSuggestions(response.data);
//             } catch (error) {
//                 console.error("Error fetching suggestions:", error);
//             }
//         } else {
//             setSuggestions([]);
//         }
//     };

//     const fetchRoute = async () => {
//         const start = useLiveLocation ? { lat: userLocation[0], lng: userLocation[1] } : startPoint;
//         if (start && endPoint) {
//             try {
//                 const response = await axios.get(`https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${endPoint.lng},${endPoint.lat}?overview=full&geometries=geojson`);
//                 const routeData = response.data.routes[0];
//                 setRoute(routeData.geometry.coordinates.map(coord => [coord[1], coord[0]]));
//                 setDistance((routeData.distance / 1000).toFixed(2));
//                 setDuration((routeData.duration / 60).toFixed(2));
//             } catch (error) {
//                 console.error("Error fetching route:", error);
//             }
//         }
//     };

//     return (
//         <div style={{ padding: '20px', textAlign: 'center', background: '#f8f9fa', borderRadius: '10px' }}>
//             <input type="text" placeholder="From" value={fromInput} onChange={(e) => {
//                 setFromInput(e.target.value);
//                 fetchSuggestions(e.target.value, setFromSuggestions);
//             }} />
//             <ul>
//                 {fromSuggestions.map((suggestion, index) => (
//                     <li key={index} onClick={() => {
//                         setFromInput(suggestion.display_name);
//                         setStartPoint({ lat: parseFloat(suggestion.lat), lng: parseFloat(suggestion.lon) });
//                         setFromSuggestions([]);
//                     }}>{suggestion.display_name}</li>
//                 ))}
//             </ul>
//             <br />
//             <input type="text" placeholder="To" value={toInput} onChange={(e) => {
//                 setToInput(e.target.value);
//                 fetchSuggestions(e.target.value, setToSuggestions);
//             }} />
//             <ul>
//                 {toSuggestions.map((suggestion, index) => (
//                     <li key={index} onClick={() => {
//                         setToInput(suggestion.display_name);
//                         setEndPoint({ lat: parseFloat(suggestion.lat), lng: parseFloat(suggestion.lon) });
//                         setToSuggestions([]);
//                     }}>{suggestion.display_name}</li>
//                 ))}
//             </ul>
//             <br />
//             <label>
//                 <input type="checkbox" checked={useLiveLocation} onChange={() => setUseLiveLocation(!useLiveLocation)} /> Use Live Location
//             </label>
//             <br />
//             <button onClick={fetchRoute}>Get Route</button>
//             <p>Distance: {distance} km</p>
//             <p>Duration: {duration} min</p>
//             <MapContainer center={userLocation} zoom={13} style={{ height: '500px', width: '100%' }}>
//                 <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//                 {startPoint && <Marker position={[startPoint.lat, startPoint.lng]}><Popup>Start Point</Popup></Marker>}
//                 {endPoint && <Marker position={[endPoint.lat, endPoint.lng]}><Popup>End Point</Popup></Marker>}
//                 {route.length > 0 && <Polyline positions={route} color="blue" />}
//                 <RecenterMap center={userLocation} />
//             </MapContainer>
//         </div>
//     );
// };

// export default Maps7;












// import React, { useEffect, useState } from 'react';
// import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
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

// const RecenterMap = ({ center }) => {
//     const map = useMap();
//     useEffect(() => {
//         map.setView(center, map.getZoom());
//     }, [center, map]);
//     return null;
// };

// const speak = (text) => {
//     const synth = window.speechSynthesis;
//     const utterance = new SpeechSynthesisUtterance(text);
//     synth.speak(utterance);
// };

// const Maps7 = () => {
//     const [userLocation, setUserLocation] = useState([51.505, -0.09]);
//     const [startPoint, setStartPoint] = useState(null);
//     const [endPoint, setEndPoint] = useState(null);
//     const [route, setRoute] = useState([]);
//     const [distance, setDistance] = useState(null);
//     const [duration, setDuration] = useState(null);
//     const [fromInput, setFromInput] = useState('');
//     const [toInput, setToInput] = useState('');
//     const [useLiveLocation, setUseLiveLocation] = useState(false);
//     const [searchInput, setSearchInput] = useState('');
//     const [suggestions, setSuggestions] = useState([]);

//     useEffect(() => {
//         if (navigator.geolocation) {
//             navigator.geolocation.watchPosition((position) => {
//                 const { latitude, longitude } = position.coords;
//                 setUserLocation([latitude, longitude]);
//                 socket.emit('updateLocation', { lat: latitude, lng: longitude });
//                 if (useLiveLocation) {
//                     setStartPoint({ lat: latitude, lng: longitude });
//                 }
//             }, (error) => {
//                 console.error("Error getting location:", error);
//             });
//         }
//     }, [useLiveLocation]);

//     const fetchLocation = async (query, setPoint, setInput) => {
//         try {
//             const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`);
//             if (response.data.length > 0) {
//                 const location = response.data[0];
//                 setPoint({ lat: parseFloat(location.lat), lng: parseFloat(location.lon) });
//                 setInput(location.display_name);
//             }
//         } catch (error) {
//             console.error("Error fetching location:", error);
//         }
//     };

//     const fetchRoute = async () => {
//         const start = useLiveLocation ? { lat: userLocation[0], lng: userLocation[1] } : startPoint;
//         if (start && endPoint) {
//             try {
//                 const response = await axios.get(`https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${endPoint.lng},${endPoint.lat}?overview=full&geometries=geojson`);
//                 const routeData = response.data.routes[0];
//                 setRoute(routeData.geometry.coordinates.map(coord => [coord[1], coord[0]]));
//                 setDistance((routeData.distance / 1000).toFixed(2));
//                 const totalMinutes = routeData.duration / 60;
//                 const hours = Math.floor(totalMinutes / 60);
//                 const minutes = Math.floor(totalMinutes % 60);
//                 setDuration(`${hours}h ${minutes}m`);
//                 speak(`Your route is ${routeData.distance / 1000} kilometers and will take approximately ${hours} hours and ${minutes} minutes.`);
//             } catch (error) {
//                 console.error("Error fetching route:", error);
//             }
//         }
//     };

//     return (
//         <div style={{ padding: '20px', textAlign: 'center', background: '#f8f9fa', borderRadius: '10px' }}>
//             <input type="text" placeholder="From" value={fromInput} onChange={(e) => setFromInput(e.target.value)} />
//             <button onClick={() => fetchLocation(fromInput, setStartPoint, setFromInput)}>Set From</button>
//             <br />
//             <input type="text" placeholder="To" value={toInput} onChange={(e) => setToInput(e.target.value)} />
//             <button onClick={() => fetchLocation(toInput, setEndPoint, setToInput)}>Set To</button>
//             <br />
//             <label>
//                 <input type="checkbox" checked={useLiveLocation} onChange={() => setUseLiveLocation(!useLiveLocation)} /> Use Live Location
//             </label>
//             <br />
//             <input type="text" placeholder="Search Location" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
//             <ul>
//                 {suggestions.map((suggestion, index) => (
//                     <li key={index}>{suggestion.display_name}</li>
//                 ))}
//             </ul>
//             <br />
//             <button onClick={fetchRoute}>Get Route</button>
//             <p>Distance: {distance} km</p>
//             <p>Duration: {duration}</p>
//             <MapContainer center={userLocation} zoom={13} style={{ height: '500px', width: '100%', cursor: 'pointer' }}>
//                 <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//                 {startPoint && <Marker position={[startPoint.lat, startPoint.lng]}><Popup>Start Point</Popup></Marker>}
//                 {endPoint && <Marker position={[endPoint.lat, endPoint.lng]}><Popup>End Point</Popup></Marker>}
//                 {route.length > 0 && <Polyline positions={route} color="blue" />}
//                 <RecenterMap center={userLocation} />
//             </MapContainer>
//         </div>
//     );
// };

// export default Maps7;








// import React, { useEffect, useState } from 'react';
// import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
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

// const RecenterMap = ({ center }) => {
//     const map = useMap();
//     useEffect(() => {
//         map.setView(center, map.getZoom());
//     }, [center, map]);
//     return null;
// };

// const speak = (text) => {
//     const synth = window.speechSynthesis;
//     const utterance = new SpeechSynthesisUtterance(text);
//     synth.speak(utterance);
// };

// const Maps7 = () => {
//     const [userLocation, setUserLocation] = useState([51.505, -0.09]);
//     const [startPoint, setStartPoint] = useState(null);
//     const [endPoint, setEndPoint] = useState(null);
//     const [route, setRoute] = useState([]);
//     const [distance, setDistance] = useState(null);
//     const [duration, setDuration] = useState(null);
//     const [fromInput, setFromInput] = useState('');
//     const [toInput, setToInput] = useState('');
//     const [useLiveLocation, setUseLiveLocation] = useState(false);

//     useEffect(() => {
//         if (navigator.geolocation) {
//             navigator.geolocation.watchPosition((position) => {
//                 const { latitude, longitude } = position.coords;
//                 setUserLocation([latitude, longitude]);
//                 socket.emit('updateLocation', { lat: latitude, lng: longitude });
//                 if (useLiveLocation) {
//                     setStartPoint({ lat: latitude, lng: longitude });
//                 }
//             }, (error) => {
//                 console.error("Error getting location:", error);
//             });
//         }
//     }, [useLiveLocation]);

//     const fetchLocation = async (query, setPoint, setInput) => {
//         try {
//             const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`);
//             if (response.data.length > 0) {
//                 const location = response.data[0];
//                 setPoint({ lat: parseFloat(location.lat), lng: parseFloat(location.lon) });
//                 setInput(location.display_name);
//             }
//         } catch (error) {
//             console.error("Error fetching location:", error);
//         }
//     };

//     const fetchRoute = async () => {
//         const start = useLiveLocation ? { lat: userLocation[0], lng: userLocation[1] } : startPoint;
//         if (start && endPoint) {
//             try {
//                 const response = await axios.get(`https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${endPoint.lng},${endPoint.lat}?overview=full&geometries=geojson`);
//                 const routeData = response.data.routes[0];
//                 setRoute(routeData.geometry.coordinates.map(coord => [coord[1], coord[0]]));
//                 setDistance((routeData.distance / 1000).toFixed(2));
//                 const totalMinutes = routeData.duration / 60;
//                 const hours = Math.floor(totalMinutes / 60);
//                 const minutes = Math.floor(totalMinutes % 60);
//                 setDuration(`${hours}h ${minutes}m`);
//                 speak(`Your route is ${routeData.distance / 1000} kilometers and will take approximately ${hours} hours and ${minutes} minutes.`);
//             } catch (error) {
//                 console.error("Error fetching route:", error);
//             }
//         }
//     };

//     return (
//         <div style={{ padding: '20px', textAlign: 'center', background: '#f8f9fa', borderRadius: '10px' }}>
//             <input type="text" placeholder="From" value={fromInput} onChange={(e) => setFromInput(e.target.value)} />
//             <button onClick={() => fetchLocation(fromInput, setStartPoint, setFromInput)}>Set From</button>
//             <br />
//             <input type="text" placeholder="To" value={toInput} onChange={(e) => setToInput(e.target.value)} />
//             <button onClick={() => fetchLocation(toInput, setEndPoint, setToInput)}>Set To</button>
//             <br />
//             <label>
//                 <input type="checkbox" checked={useLiveLocation} onChange={() => setUseLiveLocation(!useLiveLocation)} /> Use Live Location
//             </label>
//             <br />
//             <button onClick={fetchRoute}>Get Route</button>
//             <p>Distance: {distance} km</p>
//             <p>Duration: {duration}</p>
//             <MapContainer center={userLocation} zoom={13} style={{ height: '500px', width: '100%', cursor: 'pointer' }}>
//                 <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//                 {startPoint && <Marker position={[startPoint.lat, startPoint.lng]}><Popup>Start</Popup></Marker>}
//                 {endPoint && <Marker position={[endPoint.lat, endPoint.lng]}><Popup>End</Popup></Marker>}
//                 {route.length > 0 && <Polyline positions={route} color="blue" />}
//                 <RecenterMap center={userLocation} />
//             </MapContainer>
//         </div>
//     );
// };

// export default Maps7;







// import React, { useEffect, useState } from 'react';
// import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
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

// const RecenterMap = ({ center }) => {
//     const map = useMap();
//     useEffect(() => {
//         map.setView(center, map.getZoom());
//     }, [center, map]);
//     return null;
// };

// const speak = (text) => {
//     const synth = window.speechSynthesis;
//     const utterance = new SpeechSynthesisUtterance(text);
//     synth.speak(utterance);
// };

// const Maps7 = () => {
//     const [userLocation, setUserLocation] = useState([51.505, -0.09]);
//     const [startPoint, setStartPoint] = useState(null);
//     const [endPoint, setEndPoint] = useState(null);
//     const [route, setRoute] = useState([]);
//     const [distance, setDistance] = useState(null);
//     const [duration, setDuration] = useState(null);
//     const [fromInput, setFromInput] = useState('');
//     const [toInput, setToInput] = useState('');
//     const [useLiveLocation, setUseLiveLocation] = useState(false);
//     const [fromSuggestions, setFromSuggestions] = useState([]);
//     const [toSuggestions, setToSuggestions] = useState([]);

//     useEffect(() => {
//         if (navigator.geolocation) {
//             navigator.geolocation.watchPosition((position) => {
//                 const { latitude, longitude } = position.coords;
//                 setUserLocation([latitude, longitude]);
//                 socket.emit('updateLocation', { lat: latitude, lng: longitude });
//                 if (useLiveLocation) {
//                     setStartPoint({ lat: latitude, lng: longitude });
//                 }
//             }, (error) => {
//                 console.error("Error getting location:", error);
//             });
//         }
//     }, [useLiveLocation]);

//     const fetchLocation = async (query, setPoint, setInput, setSuggestions) => {
//         try {
//             const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`);
//             setSuggestions(response.data);
//         } catch (error) {
//             console.error("Error fetching location:", error);
//         }
//     };

//     const selectLocation = (location, setPoint, setInput, setSuggestions) => {
//         setPoint({ lat: parseFloat(location.lat), lng: parseFloat(location.lon) });
//         setInput(location.display_name);
//         setSuggestions([]);
//     };

//     const fetchRoute = async () => {
//         const start = useLiveLocation ? { lat: userLocation[0], lng: userLocation[1] } : startPoint;
//         if (start && endPoint) {
//             try {
//                 const response = await axios.get(`https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${endPoint.lng},${endPoint.lat}?overview=full&geometries=geojson`);
//                 const routeData = response.data.routes[0];
//                 setRoute(routeData.geometry.coordinates.map(coord => [coord[1], coord[0]]));
//                 setDistance((routeData.distance / 1000).toFixed(2));
//                 const totalMinutes = routeData.duration / 60;
//                 const hours = Math.floor(totalMinutes / 60);
//                 const minutes = Math.floor(totalMinutes % 60);
//                 setDuration(`${hours}h ${minutes}m`);
//                 speak(`Your route is ${routeData.distance / 1000} kilometers and will take approximately ${hours} hours and ${minutes} minutes.`);
//             } catch (error) {
//                 console.error("Error fetching route:", error);
//             }
//         }
//     };

//     return (
//         <div style={{ padding: '20px', textAlign: 'center', background: '#f8f9fa', borderRadius: '10px' }}>
//             {/* <input type="text" placeholder="From" value={fromInput} onChange={(e) =>setFromInput(e.target.value); 
//                 fetchLocation(e.target.value, setStartPoint, setFromInput, setFromSuggestions)
//                 } /> */}
//                 <input
//     type="text"
//     placeholder="From"
//     value={fromInput}
//     onChange={(e) => {
//         setFromInput(e.target.value);
//         fetchLocation(e.target.value, setStartPoint, setFromInput, setFromSuggestions);
//     }}
// />
//             <ul>
//                 {fromSuggestions.map((suggestion, index) => (
//                     <li key={index} onClick={() => selectLocation(suggestion, setStartPoint, setFromInput, setFromSuggestions)}>
//                         {suggestion.display_name}
//                     </li>
//                 ))}
//             </ul>
//             <br />
//             {/* <input type="text" placeholder="To" value={toInput} onChange={(e) => fetchLocation(e.target.value, setEndPoint, setToInput, setToSuggestions)} /> */}
//             <input
//     type="text"
//     placeholder="To"
//     value={toInput}
//     onChange={(e) => {
//         setToInput(e.target.value);
//         fetchLocation(e.target.value, setEndPoint, setToInput, setToSuggestions);
//     }}
// />
//             <ul>
//                 {toSuggestions.map((suggestion, index) => (
//                     <li key={index} onClick={() => selectLocation(suggestion, setEndPoint, setToInput, setToSuggestions)}>
//                         {suggestion.display_name}
//                     </li>
//                 ))}
//             </ul>
//             <br />
//             <label>
//                 <input type="checkbox" checked={useLiveLocation} onChange={() => setUseLiveLocation(!useLiveLocation)} /> Use Live Location
//             </label>
//             <br />
//             <button onClick={fetchRoute}>Get Route</button>
//             <p>Distance: {distance} km</p>
//             <p>Duration: {duration}</p>
//             <MapContainer center={userLocation} zoom={13} style={{ height: '500px', width: '100%', cursor: 'pointer' }}>
//                 <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//                 {startPoint && <Marker position={[startPoint.lat, startPoint.lng]}><Popup>Start</Popup></Marker>}
//                 {endPoint && <Marker position={[endPoint.lat, endPoint.lng]}><Popup>End</Popup></Marker>}
//                 {route.length > 0 && <Polyline positions={route} color="blue" />}
//                 <RecenterMap center={userLocation} />
//             </MapContainer>
//         </div>
//     );
// };

// export default Maps7;


// it is beeter code



// import React, { useEffect, useState } from 'react';
// import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
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

// const RecenterMap = ({ center }) => {
//     const map = useMap();
//     useEffect(() => {
//         map.setView(center, map.getZoom());
//     }, [center, map]);
//     return null;
// };

// const speak = (text) => {
//     const synth = window.speechSynthesis;
//     const utterance = new SpeechSynthesisUtterance(text);
//     synth.speak(utterance);
// };

// const Maps7 = () => {
//     const [userLocation, setUserLocation] = useState([51.505, -0.09]);
//     const [startPoint, setStartPoint] = useState(null);
//     const [endPoint, setEndPoint] = useState(null);
//     const [route, setRoute] = useState([]);
//     const [distance, setDistance] = useState(null);
//     const [duration, setDuration] = useState(null);
//     const [fromInput, setFromInput] = useState('');
//     const [toInput, setToInput] = useState('');
//     const [useLiveLocation, setUseLiveLocation] = useState(false);
//     const [fromSuggestions, setFromSuggestions] = useState([]);
//     const [toSuggestions, setToSuggestions] = useState([]);

//     // 🚀 New States for Ride Tracking
//     const [isRiding, setIsRiding] = useState(false);
//     const [ridePath, setRidePath] = useState([]);

//     useEffect(() => {
//         if (navigator.geolocation) {
//             const watchId = navigator.geolocation.watchPosition(
//                 (position) => {
//                     const { latitude, longitude } = position.coords;
//                     setUserLocation([latitude, longitude]);
//                     socket.emit('updateLocation', { lat: latitude, lng: longitude });

//                     if (useLiveLocation) {

//                         setStartPoint({ lat: latitude, lng: longitude });
//                         speak(`You are at ${{lat: latitude, lng: longitude}}`);
//                     }

//                     if (isRiding) {
//                         setRidePath(prevPath => [...prevPath, [latitude, longitude]]);
//                     }
//                 },
//                 (error) => {
//                     console.error("Error getting location:", error);
//                 }
//             );

//             return () => navigator.geolocation.clearWatch(watchId);
//         }
//     }, [useLiveLocation, isRiding]);

//     const fetchLocation = async (query, setPoint, setInput, setSuggestions) => {
//         try {
//             setInput(query);  // Ensure input updates immediately
//             const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`);
//             setSuggestions(response.data);
//         } catch (error) {
//             console.error("Error fetching location:", error);
//         }
//     };

//     const selectLocation = (location, setPoint, setInput, setSuggestions) => {
//         setPoint({ lat: parseFloat(location.lat), lng: parseFloat(location.lon) });
//         setInput(location.display_name);
//         setSuggestions([]);
//     };

//     const fetchRoute = async () => {
//         const start = useLiveLocation ? { lat: userLocation[0], lng: userLocation[1] } : startPoint;
//         if (start && endPoint) {
//             try {
//                 const response = await axios.get(`https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${endPoint.lng},${endPoint.lat}?overview=full&geometries=geojson`);
//                 const routeData = response.data.routes[0];
//                 setRoute(routeData.geometry.coordinates.map(coord => [coord[1], coord[0]]));
//                 setDistance((routeData.distance / 1000).toFixed(2));
//                 const totalMinutes = routeData.duration / 60;
//                 const hours = Math.floor(totalMinutes / 60);
//                 const minutes = Math.floor(totalMinutes % 60);
//                 setDuration(`${hours}h ${minutes}m`);
//                 speak(`Your route is ${routeData.distance / 1000} kilometers and will take approximately ${hours} hours and ${minutes} minutes.`);
//             } catch (error) {
//                 console.error("Error fetching route:", error);
//             }
//         }
//     };

//     return (
//         <div style={{ padding: '20px', textAlign: 'center', background: '#f8f9fa', borderRadius: '10px' }}>
//             <input 
//                 type="text" 
//                 placeholder="From" 
//                 value={fromInput} 
//                 onChange={(e) => fetchLocation(e.target.value, setStartPoint, setFromInput, setFromSuggestions)} 
//             />
//             <ul>
//                 {fromSuggestions.map((suggestion, index) => (
//                     <li key={index} onClick={() => selectLocation(suggestion, setStartPoint, setFromInput, setFromSuggestions)}>
//                         {suggestion.display_name}
//                     </li>
//                 ))}
//             </ul>

//             <br />

//             <input 
//                 type="text" 
//                 placeholder="To" 
//                 value={toInput} 
//                 onChange={(e) => fetchLocation(e.target.value, setEndPoint, setToInput, setToSuggestions)} 
//             />
//             <ul>
//                 {toSuggestions.map((suggestion, index) => (
//                     <li key={index} onClick={() => selectLocation(suggestion, setEndPoint, setToInput, setToSuggestions)}>
//                         {suggestion.display_name}
//                     </li>
//                 ))}
//             </ul>

//             <br />

//             <label>
//                 <input type="checkbox" checked={useLiveLocation} onChange={() => setUseLiveLocation(!useLiveLocation)} /> Use Live Location
//             </label>

//             <br />
//             <button onClick={fetchRoute}>Get Route</button>

//             <br />

//             <button onClick={() => setIsRiding(true)} disabled={isRiding}>Start Ride</button>
//             <button onClick={() => setIsRiding(false)} disabled={!isRiding}>End Ride</button>

//             <p>Distance: {distance} km</p>
//             <p>Duration: {duration}</p>

//             <MapContainer center={userLocation} zoom={13} style={{ height: '500px', width: '100%', cursor: 'pointer' }}>
//                 <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//                 {startPoint && <Marker position={[startPoint.lat, startPoint.lng]}><Popup>Start</Popup></Marker>}
//                 {endPoint && <Marker position={[endPoint.lat, endPoint.lng]}><Popup>End</Popup></Marker>}
//                 {route.length > 0 && <Polyline positions={route} color="blue" />}
//                 {isRiding && ridePath.length > 1 && <Polyline positions={ridePath} color="yellow" />}
//                 <RecenterMap center={userLocation} />
//             </MapContainer>
//         </div>
//     );
// };

// export default Maps7;


// this end which it is worked







// this next code remember that



// import React, { useEffect, useState } from 'react';
// import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents, useMap } from 'react-leaflet';
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

// const RecenterMap = ({ center }) => {
//     const map = useMap();
//     useEffect(() => {
//         map.setView(center, map.getZoom());
//     }, [center, map]);
//     return null;
// };

// const MapClickHandler = ({ setStartPoint, setEndPoint, startPoint, endPoint }) => {
//     useMapEvents({
//         click(e) {
//             const { lat, lng } = e.latlng;
//             if (!startPoint) {
//                 setStartPoint({ lat, lng });
//             } else if (!endPoint) {
//                 setEndPoint({ lat, lng });
//             }
//         },
//     });
//     return null;
// };

// const speak = (text) => {
//     const synth = window.speechSynthesis;
//     const utterance = new SpeechSynthesisUtterance(text);
//     synth.speak(utterance);
// };

// const Maps7 = () => {
//     const [userLocation, setUserLocation] = useState([51.505, -0.09]);
//     const [startPoint, setStartPoint] = useState(null);
//     const [endPoint, setEndPoint] = useState(null);
//     const [route, setRoute] = useState([]);
//     const [distance, setDistance] = useState(null);
//     const [duration, setDuration] = useState(null);
//     const [useLiveLocation, setUseLiveLocation] = useState(false);
//     const [isRiding, setIsRiding] = useState(false);
//     const [ridePath, setRidePath] = useState([]);
//     const [currentLocationText, setCurrentLocationText] = useState('');

//     useEffect(() => {
//         if (navigator.geolocation) {
//             const watchId = navigator.geolocation.watchPosition(
//                 async (position) => {
//                     const { latitude, longitude } = position.coords;
//                     setUserLocation([latitude, longitude]);
//                     socket.emit('updateLocation', { lat: latitude, lng: longitude });

//                     if (useLiveLocation) {
//                         setStartPoint({ lat: latitude, lng: longitude });
//                     }

//                     if (isRiding) {
//                         setRidePath(prevPath => [...prevPath, [latitude, longitude]]);
//                     }
//                 },
//                 (error) => {
//                     console.error("Error getting location:", error);
//                 }
//             );

//             return () => navigator.geolocation.clearWatch(watchId);
//         }
//     }, [useLiveLocation, isRiding]);

//     const fetchRoute = async () => {
//         if (startPoint && endPoint) {
//             try {
//                 const response = await axios.get(`https://router.project-osrm.org/route/v1/driving/${startPoint.lng},${startPoint.lat};${endPoint.lng},${endPoint.lat}?overview=full&geometries=geojson`);
//                 const routeData = response.data.routes[0];
//                 setRoute(routeData.geometry.coordinates.map(coord => [coord[1], coord[0]]));
//                 setDistance((routeData.distance / 1000).toFixed(2));
//                 const totalMinutes = routeData.duration / 60;
//                 const hours = Math.floor(totalMinutes / 60);
//                 const minutes = Math.floor(totalMinutes % 60);
//                 setDuration(`${hours}h ${minutes}m`);
//                 speak(`Your route is ${routeData.distance / 1000} kilometers and will take approximately ${hours} hours and ${minutes} minutes.`);
//             } catch (error) {
//                 console.error("Error fetching route:", error);
//             }
//         }
//     };

//     const endRide = async () => {
//         setIsRiding(false);
//         setRidePath([]);

//         try {
//             const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${userLocation[0]}&lon=${userLocation[1]}`);
//             const locationName = response.data.display_name;
//             setCurrentLocationText(`You are at ${locationName}`);
//             speak(`You are at ${locationName}`);
//         } catch (error) {
//             console.error("Error fetching location name:", error);
//             setCurrentLocationText("Location not found");
//             speak("Location not found");
//         }
//     };

//     return (
//         <div style={{ padding: '20px', textAlign: 'center', background: '#f8f9fa', borderRadius: '10px' }}>
//             <label>
//                 <input type="checkbox" checked={useLiveLocation} onChange={() => setUseLiveLocation(!useLiveLocation)} /> Use Live Location
//             </label>

//             <br />
//             <button onClick={fetchRoute}>Get Route</button>

//             <br />

//             <button onClick={() => setIsRiding(true)} disabled={isRiding}>Start Ride</button>
//             <button onClick={endRide} disabled={!isRiding}>End Ride</button>

//             <p>Distance: {distance} km</p>
//             <p>Duration: {duration}</p>
//             <p><b>{currentLocationText}</b></p>

//             <MapContainer center={userLocation} zoom={13} style={{ height: '500px', width: '100%', cursor: 'pointer' }}>
//                 <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//                 <MapClickHandler setStartPoint={setStartPoint} setEndPoint={setEndPoint} startPoint={startPoint} endPoint={endPoint} />
//                 {startPoint && <Marker position={[startPoint.lat, startPoint.lng]}><Popup>Start</Popup></Marker>}
//                 {endPoint && <Marker position={[endPoint.lat, endPoint.lng]}><Popup>End</Popup></Marker>}
//                 {route.length > 0 && <Polyline positions={route} color="blue" />}
//                 {isRiding && ridePath.length > 1 && <Polyline positions={ridePath} color="red" />}
//                 <RecenterMap center={userLocation} />
//             </MapContainer>
//         </div>
//     );
// };

// export default Maps7;






// code is next need to check tommarow for it




// import React, { useEffect, useState } from 'react';
// import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents, useMap } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import io from 'socket.io-client';
// import L from 'leaflet';
// import axios from 'axios';

// import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
// import markerIcon from 'leaflet/dist/images/marker-icon.png';
// import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// // Fix Leaflet marker icons
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//     iconRetinaUrl: markerIcon2x,
//     iconUrl: markerIcon,
//     shadowUrl: markerShadow,
// });

// // Initialize socket connection
// const socket = io('https://map-functionality.onrender.com', {
//     transports: ['websocket'],
//     reconnection: true,
//     reconnectionAttempts: 5,
//     reconnectionDelay: 3000
// });

// // Component to recenter the map
// const RecenterMap = ({ center }) => {
//     const map = useMap();
//     useEffect(() => {
//         map.setView(center, map.getZoom());
//     }, [center, map]);
//     return null;
// };

// const Maps7 = () => {
//     const [userLocation, setUserLocation] = useState([51.505, -0.09]); // Default location
//     const [startPoint, setStartPoint] = useState(null);
//     const [endPoint, setEndPoint] = useState(null);
//     const [route, setRoute] = useState([]);
//     const [distance, setDistance] = useState(null);
//     const [duration, setDuration] = useState(null);
//     const [fromInput, setFromInput] = useState('');
//     const [toInput, setToInput] = useState('');
//     const [fromSuggestions, setFromSuggestions] = useState([]);
//     const [toSuggestions, setToSuggestions] = useState([]);

//     // Get user location
//     useEffect(() => {
//         if (navigator.geolocation) {
//             navigator.geolocation.watchPosition((position) => {
//                 const { latitude, longitude } = position.coords;
//                 setUserLocation([latitude, longitude]);
//                 socket.emit('updateLocation', { lat: latitude, lng: longitude });
//             });
//         }
//     }, []);

//     // Fetch location suggestions from OpenStreetMap
//     const fetchLocation = async (query, setSuggestions) => {
//         try {
//             const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`);
//             setSuggestions(response.data);
//         } catch (error) {
//             console.error("Error fetching location:", error);
//         }
//     };

//     // Select a location from suggestions
//     const selectLocation = (location, setPoint, setInput, setSuggestions) => {
//         const selectedPoint = { lat: parseFloat(location.lat), lng: parseFloat(location.lon) };
//         setPoint(selectedPoint);
//         setInput(location.display_name);
//         setSuggestions([]);
//     };

//     // Fetch route between start and end points
//     const fetchRoute = async () => {
//         if (startPoint && endPoint) {
//             try {
//                 const response = await axios.get(
//                     `https://router.project-osrm.org/route/v1/driving/${startPoint.lng},${startPoint.lat};${endPoint.lng},${endPoint.lat}?overview=full&geometries=geojson`
//                 );
//                 const routeData = response.data.routes[0];
//                 setRoute(routeData.geometry.coordinates.map(coord => [coord[1], coord[0]]));
//                 setDistance((routeData.distance / 1000).toFixed(2));
//                 setDuration(`${Math.floor(routeData.duration / 3600)}h ${Math.floor((routeData.duration % 3600) / 60)}m`);
//             } catch (error) {
//                 console.error("Error fetching route:", error);
//             }
//         }
//     };

//     // Handle map clicks for setting start and end points
//     const MapClickHandler = () => {
//         useMapEvents({
//             click(e) {
//                 if (!startPoint) {
//                     setStartPoint({ lat: e.latlng.lat, lng: e.latlng.lng });
//                 } else if (!endPoint) {
//                     setEndPoint({ lat: e.latlng.lat, lng: e.latlng.lng });
//                 }
//             },
//         });
//         return null;
//     };

//     return (
//         <div style={{ padding: '20px', textAlign: 'center', background: '#f8f9fa', borderRadius: '10px' }}>
//             {/* From Input */}
//             <input
//                 type="text"
//                 placeholder="From"
//                 value={fromInput}
//                 onChange={(e) => {
//                     setFromInput(e.target.value);
//                     fetchLocation(e.target.value, setFromSuggestions);
//                 }}
//             />
//             <ul>
//                 {fromSuggestions.map((suggestion, index) => (
//                     <li key={index} onClick={() => selectLocation(suggestion, setStartPoint, setFromInput, setFromSuggestions)}>
//                         {suggestion.display_name}
//                     </li>
//                 ))}
//             </ul>

//             {/* To Input */}
//             <input
//                 type="text"
//                 placeholder="To"
//                 value={toInput}
//                 onChange={(e) => {
//                     setToInput(e.target.value);
//                     fetchLocation(e.target.value, setToSuggestions);
//                 }}
//             />
//             <ul>
//                 {toSuggestions.map((suggestion, index) => (
//                     <li key={index} onClick={() => selectLocation(suggestion, setEndPoint, setToInput, setToSuggestions)}>
//                         {suggestion.display_name}
//                     </li>
//                 ))}
//             </ul>

//             <br />
//             {/* Set Start and End Buttons */}
//             <button onClick={() => setStartPoint({ lat: userLocation[0], lng: userLocation[1] })}>
//                 Set Start Point
//             </button>
//             <button onClick={() => setEndPoint({ lat: userLocation[0], lng: userLocation[1] })}>
//                 Set End Point
//             </button>

//             <br />
//             {/* Get Route Button */}
//             <button onClick={fetchRoute}>Get Route</button>

//             {/* Route Details */}
//             <p>Distance: {distance} km</p>
//             <p>Duration: {duration}</p>

//             {/* Map Component */}
//             <MapContainer center={userLocation} zoom={13} style={{ height: '500px', width: '100%' }}>
//                 <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

//                 {/* Start Point Marker */}
//                 {startPoint && <Marker position={[startPoint.lat, startPoint.lng]}><Popup>Start</Popup></Marker>}

//                 {/* End Point Marker */}
//                 {endPoint && <Marker position={[endPoint.lat, endPoint.lng]}><Popup>End</Popup></Marker>}

//                 {/* Route Polyline */}
//                 {route.length > 0 && <Polyline positions={route} color="red" />}

//                 <RecenterMap center={userLocation} />
//                 <MapClickHandler />
//             </MapContainer>
//         </div>
//     );
// };

// export default Maps7;







import { useEffect, useState, useCallback } from "react"
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import axios from "axios"
import { io } from "socket.io-client"

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
})

// Component to recenter the map
const RecenterMap = ({ center }) => {
  const map = useMap()
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, map.getZoom())
    }
  }, [center, map])
  return null
}

// Icons for the UI
const MapPinIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ marginRight: "8px" }}
  >
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
)

const NavigationIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ marginRight: "8px" }}
  >
    <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
  </svg>
)

const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ marginRight: "8px" }}
  >
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.3-4.3"></path>
  </svg>
)

const LocateFixedIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ marginRight: "4px" }}
  >
    <line x1="2" x2="5" y1="12" y2="12"></line>
    <line x1="19" x2="22" y1="12" y2="12"></line>
    <line x1="12" x2="12" y1="2" y2="5"></line>
    <line x1="12" x2="12" y1="19" y2="22"></line>
    <circle cx="12" cy="12" r="7"></circle>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
)

const Maps7 = () => {
  // State management
  const [userLocation, setUserLocation] = useState([51.505, -0.09])
  const [startPoint, setStartPoint] = useState(null)
  const [endPoint, setEndPoint] = useState(null)
  const [route, setRoute] = useState([])
  const [distance, setDistance] = useState(null)
  const [duration, setDuration] = useState(null)
  const [fromInput, setFromInput] = useState("")
  const [toInput, setToInput] = useState("")
  const [fromSuggestions, setFromSuggestions] = useState([])
  const [toSuggestions, setToSuggestions] = useState([])
  const [error, setError] = useState(null)
  const [socketConnected, setSocketConnected] = useState(false)
  const [loading, setLoading] = useState(false)

  // Initialize socket connection
  useEffect(() => {
    const socket = io("https://map-functionality.onrender.com", {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 3000,
    })

    socket.on("connect", () => {
      setSocketConnected(true)
      setError(null)
    })

    socket.on("disconnect", () => {
      setSocketConnected(false)
    })

    socket.on("connect_error", () => {
      setError("Failed to connect to location service")
    })

    // Get user location
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setUserLocation([latitude, longitude])
          if (socket.connected) {
            socket.emit("updateLocation", { lat: latitude, lng: longitude })
          }
        },
        (err) => {
          setError(`Geolocation error: ${err.message}`)
        },
        { enableHighAccuracy: true },
      )

      return () => {
        navigator.geolocation.clearWatch(watchId)
        socket.disconnect()
      }
    } else {
      setError("Geolocation is not supported by your browser")
    }
  }, [])

  // Fetch location suggestions from OpenStreetMap with debounce
  const fetchLocation = useCallback(async (query, setSuggestions) => {
    if (!query || query.length < 3) {
      setSuggestions([])
      return
    }

    try {
      setLoading(true)
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`,
        { headers: { "Accept-Language": "en-US,en;q=0.9" } },
      )
      setSuggestions(response.data)
      setError(null)
    } catch (error) {
      console.error("Error fetching location:", error)
      setError("Failed to fetch location suggestions")
    } finally {
      setLoading(false)
    }
  }, [])

  // Debounce function for location search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (fromInput.length >= 3) {
        fetchLocation(fromInput, setFromSuggestions)
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [fromInput, fetchLocation])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (toInput.length >= 3) {
        fetchLocation(toInput, setToSuggestions)
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [toInput, fetchLocation])

  // Select a location from suggestions
  const selectLocation = (location, setPoint, setInput, setSuggestions) => {
    const selectedPoint = { lat: Number.parseFloat(location.lat), lng: Number.parseFloat(location.lon) }
    setPoint(selectedPoint)
    setInput(location.display_name)
    setSuggestions([])
  }

  // Fetch route between start and end points
  const fetchRoute = async () => {
    if (!startPoint || !endPoint) {
      setError("Please set both start and end points")
      return
    }

    try {
      setLoading(true)
      const response = await axios.get(
        `https://router.project-osrm.org/route/v1/driving/${startPoint.lng},${startPoint.lat};${endPoint.lng},${endPoint.lat}?overview=full&geometries=geojson`,
      )

      if (response.data.code !== "Ok") {
        throw new Error("Route not found")
      }

      const routeData = response.data.routes[0]
      setRoute(routeData.geometry.coordinates.map((coord) => [coord[1], coord[0]]))
      setDistance((routeData.distance / 1000).toFixed(2))

      // Format duration
      const hours = Math.floor(routeData.duration / 3600)
      const minutes = Math.floor((routeData.duration % 3600) / 60)
      setDuration(`${hours}h ${minutes}m`)

      setError(null)
    } catch (error) {
      console.error("Error fetching route:", error)
      setError("Failed to calculate route. Please try different locations.")
    } finally {
      setLoading(false)
    }
  }

  // Handle map clicks for setting start and end points
  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        if (!startPoint) {
          setStartPoint({ lat: e.latlng.lat, lng: e.latlng.lng })
          // Try to get address for the clicked location
          fetchLocationName(e.latlng.lat, e.latlng.lng, setFromInput)
        } else if (!endPoint) {
          setEndPoint({ lat: e.latlng.lat, lng: e.latlng.lng })
          // Try to get address for the clicked location
          fetchLocationName(e.latlng.lat, e.latlng.lng, setToInput)
        }
      },
    })
    return null
  }

  // Reverse geocoding to get location name from coordinates
  const fetchLocationName = async (lat, lng, setInput) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
        { headers: { "Accept-Language": "en-US,en;q=0.9" } },
      )
      setInput(response.data.display_name)
    } catch (error) {
      console.error("Error fetching location name:", error)
      setInput(`${lat.toFixed(6)}, ${lng.toFixed(6)}`)
    }
  }

  // Reset route and points
  const resetRoute = () => {
    setStartPoint(null)
    setEndPoint(null)
    setRoute([])
    setDistance(null)
    setDuration(null)
    setFromInput("")
    setToInput("")
    setFromSuggestions([])
    setToSuggestions([])
  }

  // Styles
  const styles = {
    container: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "16px",
    },
    card: {
      backgroundColor: "white",
      borderRadius: "8px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
      marginBottom: "16px",
    },
    cardHeader: {
      padding: "16px",
      borderBottom: "1px solid #eee",
    },
    cardTitle: {
      fontSize: "18px",
      fontWeight: "bold",
      margin: 0,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    cardContent: {
      padding: "16px",
    },
    alert: {
      backgroundColor: "#fee2e2",
      color: "#b91c1c",
      padding: "12px",
      borderRadius: "4px",
      marginBottom: "16px",
    },
    inputContainer: {
      position: "relative",
      marginBottom: "16px",
    },
    inputWrapper: {
      display: "flex",
      alignItems: "center",
    },
    input: {
      width: "100%",
      padding: "8px 12px",
      border: "1px solid #d1d5db",
      borderRadius: "4px",
      fontSize: "14px",
    },
    suggestionCard: {
      position: "absolute",
      zIndex: 10,
      width: "100%",
      marginTop: "4px",
      maxHeight: "240px",
      overflow: "auto",
      backgroundColor: "white",
      borderRadius: "4px",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    },
    suggestionList: {
      margin: 0,
      padding: 0,
      listStyle: "none",
    },
    suggestionItem: {
      padding: "8px 12px",
      borderBottom: "1px solid #eee",
      cursor: "pointer",
      fontSize: "14px",
    },
    buttonContainer: {
      display: "flex",
      flexWrap: "wrap",
      gap: "8px",
      marginBottom: "16px",
    },
    button: {
      display: "inline-flex",
      alignItems: "center",
      padding: "6px 12px",
      backgroundColor: "#f3f4f6",
      border: "1px solid #d1d5db",
      borderRadius: "4px",
      fontSize: "14px",
      cursor: "pointer",
    },
    primaryButton: {
      backgroundColor: "#3b82f6",
      color: "white",
      border: "none",
    },
    secondaryButton: {
      backgroundColor: "#e5e7eb",
      color: "#1f2937",
      border: "none",
    },
    disabledButton: {
      opacity: 0.5,
      cursor: "not-allowed",
    },
    statsContainer: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "8px",
      marginTop: "8px",
    },
    statsCard: {
      backgroundColor: "white",
      borderRadius: "4px",
      padding: "12px",
      textAlign: "center",
      boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
    },
    statsLabel: {
      fontSize: "14px",
      color: "#6b7280",
      margin: "0 0 4px 0",
    },
    statsValue: {
      fontSize: "18px",
      fontWeight: "bold",
      margin: 0,
    },
    mapContainer: {
      height: "500px",
      width: "100%",
      borderRadius: "8px",
      overflow: "hidden",
      border: "1px solid #d1d5db",
    },
    footer: {
      marginTop: "16px",
      fontSize: "14px",
      color: "#6b7280",
    },
    connectedStatus: {
      display: "flex",
      alignItems: "center",
      fontSize: "12px",
      color: "#10b981",
    },
    disconnectedStatus: {
      display: "flex",
      alignItems: "center",
      fontSize: "12px",
      color: "#ef4444",
    },
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h2 style={styles.cardTitle}>
            <span>Interactive Map</span>
            {socketConnected ? (
              <span style={styles.connectedStatus}>
                <LocateFixedIcon /> Connected
              </span>
            ) : (
              <span style={styles.disconnectedStatus}>
                <LocateFixedIcon /> Disconnected
              </span>
            )}
          </h2>
        </div>
        <div style={styles.cardContent}>
          {error && <div style={styles.alert}>{error}</div>}

          {/* From Input */}
          <div style={styles.inputContainer}>
            <div style={styles.inputWrapper}>
              <MapPinIcon />
              <input
                type="text"
                placeholder="From"
                value={fromInput}
                onChange={(e) => setFromInput(e.target.value)}
                style={styles.input}
              />
            </div>
            {fromSuggestions.length > 0 && (
              <div style={styles.suggestionCard}>
                <ul style={styles.suggestionList}>
                  {fromSuggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      style={styles.suggestionItem}
                      onClick={() => selectLocation(suggestion, setStartPoint, setFromInput, setFromSuggestions)}
                      onMouseOver={(e) => (e.target.style.backgroundColor = "#f3f4f6")}
                      onMouseOut={(e) => (e.target.style.backgroundColor = "transparent")}
                    >
                      {suggestion.display_name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* To Input */}
          <div style={styles.inputContainer}>
            <div style={styles.inputWrapper}>
              <NavigationIcon />
              <input
                type="text"
                placeholder="To"
                value={toInput}
                onChange={(e) => setToInput(e.target.value)}
                style={styles.input}
              />
            </div>
            {toSuggestions.length > 0 && (
              <div style={styles.suggestionCard}>
                <ul style={styles.suggestionList}>
                  {toSuggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      style={styles.suggestionItem}
                      onClick={() => selectLocation(suggestion, setEndPoint, setToInput, setToSuggestions)}
                      onMouseOver={(e) => (e.target.style.backgroundColor = "#f3f4f6")}
                      onMouseOut={(e) => (e.target.style.backgroundColor = "transparent")}
                    >
                      {suggestion.display_name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div style={styles.buttonContainer}>
            <button
              style={{
                ...styles.button,
                ...(!userLocation[0] && styles.disabledButton),
              }}
              onClick={() => setStartPoint({ lat: userLocation[0], lng: userLocation[1] })}
              disabled={!userLocation[0]}
            >
              <MapPinIcon />
              Set Start to Current
            </button>

            <button
              style={{
                ...styles.button,
                ...(!userLocation[0] && styles.disabledButton),
              }}
              onClick={() => setEndPoint({ lat: userLocation[0], lng: userLocation[1] })}
              disabled={!userLocation[0]}
            >
              <NavigationIcon />
              Set End to Current
            </button>

            <button
              style={{
                ...styles.button,
                ...styles.primaryButton,
                ...((!startPoint || !endPoint || loading) && styles.disabledButton),
              }}
              onClick={fetchRoute}
              disabled={!startPoint || !endPoint || loading}
            >
              <SearchIcon />
              {loading ? "Calculating..." : "Get Route"}
            </button>

            <button
              style={{
                ...styles.button,
                ...styles.secondaryButton,
              }}
              onClick={resetRoute}
            >
              Reset
            </button>
          </div>

          {(distance || duration) && (
            <div style={styles.statsContainer}>
              <div style={styles.statsCard}>
                <p style={styles.statsLabel}>Distance</p>
                <p style={styles.statsValue}>{distance} km</p>
              </div>
              <div style={styles.statsCard}>
                <p style={styles.statsLabel}>Duration</p>
                <p style={styles.statsValue}>{duration}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Map Component */}
      <div style={styles.mapContainer}>
        {typeof window !== "undefined" && (
          <MapContainer
            center={userLocation}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
            attributionControl={false}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {/* User Location Marker */}
            <Marker position={userLocation}>
              <Popup>Your Location</Popup>
            </Marker>

            {/* Start Point Marker */}
            {startPoint && (
              <Marker
                position={[startPoint.lat, startPoint.lng]}
                icon={
                  new L.Icon({
                    iconUrl:
                      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
                    iconRetinaUrl:
                      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
                    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                    shadowSize: [41, 41],
                  })
                }
              >
                <Popup>Start Point</Popup>
              </Marker>
            )}

            {/* End Point Marker */}
            {endPoint && (
              <Marker
                position={[endPoint.lat, endPoint.lng]}
                icon={
                  new L.Icon({
                    iconUrl:
                      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
                    iconRetinaUrl:
                      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
                    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                    shadowSize: [41, 41],
                  })
                }
              >
                <Popup>End Point</Popup>
              </Marker>
            )}

            {/* Route Polyline */}
            {route.length > 0 && <Polyline positions={route} color="#3b82f6" weight={5} opacity={0.7} />}

            <RecenterMap center={userLocation} />
            <MapClickHandler />
          </MapContainer>
        )}
      </div>

      <div style={styles.footer}>
        <p>Click on the map to set start and end points, or use the search boxes above.</p>
      </div>
    </div>
  )
}

export default Maps7






// 




// import React, { useEffect, useState } from 'react';
// import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents, useMap } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import io from 'socket.io-client';
// import L from 'leaflet';
// import axios from 'axios';

// import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
// import markerIcon from 'leaflet/dist/images/marker-icon.png';
// import markerShadow from 'leaflet/dist/images/marker-shadow.png';

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

// const RecenterMap = ({ center }) => {
//     const map = useMap();
//     useEffect(() => {
//         map.setView(center, map.getZoom());
//     }, [center, map]);
//     return null;
// };

// const speak = (text) => {
//     const speech = new SpeechSynthesisUtterance(text);
//     speech.lang = 'en-US';
//     window.speechSynthesis.speak(speech);
// };

// const MapClickHandler = ({ setStartPoint }) => {
//     useMapEvents({
//         click(e) {
//             setStartPoint([e.latlng.lat, e.latlng.lng]);
//             speak(`Location set to latitude ${e.latlng.lat.toFixed(3)}, longitude ${e.latlng.lng.toFixed(3)}`);
//         },
//     });
//     return null;
// };

// const Maps7 = () => {
//     const [userLocation, setUserLocation] = useState([51.505, -0.09]);
//     const [startPoint, setStartPoint] = useState(null);
//     const [endPoint, setEndPoint] = useState(null);
//     const [route, setRoute] = useState([]);
//     const [distance, setDistance] = useState(null);
//     const [duration, setDuration] = useState(null);
    
//     useEffect(() => {
//         if (navigator.geolocation) {
//             navigator.geolocation.watchPosition((position) => {
//                 const { latitude, longitude } = position.coords;
//                 setUserLocation([latitude, longitude]);
//                 socket.emit('updateLocation', { lat: latitude, lng: longitude });
//                 speak(`Your current location is latitude ${latitude.toFixed(3)}, longitude ${longitude.toFixed(3)}`);
//             });
//         }
//     }, []);

//     return (
//         <div style={{ padding: '20px', textAlign: 'center', background: '#f8f9fa', borderRadius: '10px' }}>
//             <h3>Live Location Tracker with Voice Updates</h3>
//             <p>Your Current Location: {userLocation[0].toFixed(3)}, {userLocation[1].toFixed(3)}</p>
            
//             <MapContainer center={userLocation} zoom={13} style={{ height: '500px', width: '100%' }}>
//                 <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//                 <Marker position={userLocation}>
//                     <Popup>You are here</Popup>
//                 </Marker>
//                 {startPoint && <Marker position={startPoint}><Popup>Selected Location</Popup></Marker>}
//                 <RecenterMap center={userLocation} />
//                 <MapClickHandler setStartPoint={setStartPoint} />
//             </MapContainer>
//         </div>
//     );
// };

// export default Maps7;












// import React, { useEffect, useState } from 'react';
// import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
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

// const RecenterMap = ({ center }) => {
//     const map = useMap();
//     useEffect(() => {
//         map.setView(center, map.getZoom());
//     }, [center, map]);
//     return null;
// };

// const speak = (text) => {
//     const synth = window.speechSynthesis;
//     const utterance = new SpeechSynthesisUtterance(text);
//     synth.speak(utterance);
// };

// const Maps7 = () => {
//     const [userLocation, setUserLocation] = useState([51.505, -0.09]);
//     const [startPoint, setStartPoint] = useState(null);
//     const [endPoint, setEndPoint] = useState(null);
//     const [route, setRoute] = useState([]);
//     const [distance, setDistance] = useState(null);
//     const [duration, setDuration] = useState(null);
//     const [fromInput, setFromInput] = useState('');
//     const [toInput, setToInput] = useState('');
//     const [useLiveLocation, setUseLiveLocation] = useState(false);
//     const [fromSuggestions, setFromSuggestions] = useState([]);
//     const [toSuggestions, setToSuggestions] = useState([]);
//     const [isRiding, setIsRiding] = useState(false);
//     const [ridePath, setRidePath] = useState([]);
//     const [currentLocationText, setCurrentLocationText] = useState(''); // 📍 New state for location text

//     useEffect(() => {
//         if (navigator.geolocation) {
//             const watchId = navigator.geolocation.watchPosition(
//                 async (position) => {
//                     const { latitude, longitude } = position.coords;
//                     setUserLocation([latitude, longitude]);
//                     socket.emit('updateLocation', { lat: latitude, lng: longitude });

//                     if (useLiveLocation) {
//                         setStartPoint({ lat: latitude, lng: longitude });
//                     }

//                     if (isRiding) {
//                         setRidePath(prevPath => [...prevPath, [latitude, longitude]]);
//                     }
//                 },
//                 (error) => {
//                     console.error("Error getting location:", error);
//                 }
//             );

//             return () => navigator.geolocation.clearWatch(watchId);
//         }
//     }, [useLiveLocation, isRiding]);

//     const fetchLocation = async (query, setPoint, setInput, setSuggestions) => {
//         try {
//             setInput(query);
//             const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`);
//             setSuggestions(response.data);
//         } catch (error) {
//             console.error("Error fetching location:", error);
//         }
//     };

//     const selectLocation = (location, setPoint, setInput, setSuggestions) => {
//         setPoint({ lat: parseFloat(location.lat), lng: parseFloat(location.lon) });
//         setInput(location.display_name);
//         setSuggestions([]);
//     };

//     const fetchRoute = async () => {
//         const start = useLiveLocation ? { lat: userLocation[0], lng: userLocation[1] } : startPoint;
//         if (start && endPoint) {
//             try {
//                 const response = await axios.get(`https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${endPoint.lng},${endPoint.lat}?overview=full&geometries=geojson`);
//                 const routeData = response.data.routes[0];
//                 setRoute(routeData.geometry.coordinates.map(coord => [coord[1], coord[0]]));
//                 setDistance((routeData.distance / 1000).toFixed(2));
//                 const totalMinutes = routeData.duration / 60;
//                 const hours = Math.floor(totalMinutes / 60);
//                 const minutes = Math.floor(totalMinutes % 60);
//                 setDuration(`${hours}h ${minutes}m`);
//                 speak(`Your route is ${routeData.distance / 1000} kilometers and will take approximately ${hours} hours and ${minutes} minutes.`);
//             } catch (error) {
//                 console.error("Error fetching route:", error);
//             }
//         }
//     };

//     const endRide = async () => {
//         setIsRiding(false);
//         setRidePath([]); // Reset the ride path

//         try {
//             const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${userLocation[0]}&lon=${userLocation[1]}`);
//             const locationName = response.data.display_name;
//             setCurrentLocationText(`You are at ${locationName}`);
//             speak(`You are at ${locationName}`);
//         } catch (error) {
//             console.error("Error fetching location name:", error);
//             setCurrentLocationText("Location not found");
//             speak("Location not found");
//         }
//     };

//     return (
//         <div style={{ padding: '20px', textAlign: 'center', background: '#f8f9fa', borderRadius: '10px' }}>
//             <input 
//                 type="text" 
//                 placeholder="From" 
//                 value={fromInput} 
//                 onChange={(e) => fetchLocation(e.target.value, setStartPoint, setFromInput, setFromSuggestions)} 
//             />
//             <ul>
//                 {fromSuggestions.map((suggestion, index) => (
//                     <li key={index} onClick={() => selectLocation(suggestion, setStartPoint, setFromInput, setFromSuggestions)}>
//                         {suggestion.display_name}
//                     </li>
//                 ))}
//             </ul>

//             <br />

//             <input 
//                 type="text" 
//                 placeholder="To" 
//                 value={toInput} 
//                 onChange={(e) => fetchLocation(e.target.value, setEndPoint, setToInput, setToSuggestions)} 
//             />
//             <ul>
//                 {toSuggestions.map((suggestion, index) => (
//                     <li key={index} onClick={() => selectLocation(suggestion, setEndPoint, setToInput, setToSuggestions)}>
//                         {suggestion.display_name}
//                     </li>
//                 ))}
//             </ul>

//             <br />

//             <label>
//                 <input type="checkbox" checked={useLiveLocation} onChange={() => setUseLiveLocation(!useLiveLocation)} /> Use Live Location
//             </label>

//             <br />
//             <button onClick={fetchRoute}>Get Route</button>

//             <br />

//             <button onClick={() => setIsRiding(true)} disabled={isRiding}>Start Ride</button>
//             <button onClick={endRide} disabled={!isRiding}>End Ride</button>

//             <p>Distance: {distance} km</p>
//             <p>Duration: {duration}</p>
//             <p><b>{currentLocationText}</b></p> {/* 📍 Show current location when ride ends */}

//             <MapContainer center={userLocation} zoom={13} style={{ height: '500px', width: '100%', cursor: 'pointer' }}>
//                 <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//                 {startPoint && <Marker position={[startPoint.lat, startPoint.lng]}><Popup>Start</Popup></Marker>}
//                 {endPoint && <Marker position={[endPoint.lat, endPoint.lng]}><Popup>End</Popup></Marker>}
//                 {route.length > 0 && <Polyline positions={route} color="blue" />}
//                 {isRiding && ridePath.length > 1 && <Polyline positions={ridePath} color="red" />}
//                 <RecenterMap center={userLocation} />
//             </MapContainer>
//         </div>
//     );
// };

// export default Maps7;











