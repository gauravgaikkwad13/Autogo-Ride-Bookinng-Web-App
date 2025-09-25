import React, { useState, useEffect } from 'react'
import { LoadScript, GoogleMap, Marker, DirectionsService, DirectionsRenderer } from '@react-google-maps/api'
import FallbackMap from './FallbackMap'

const containerStyle = {
    width: '100%',
    height: '100%',
};

const center = {
    lat: 18.5204, // Default to Pune coordinates
    lng: 73.8567
};

const libraries = ['places', 'directions'];

const LiveTracking = ({ pickup, destination, onError, onDistanceUpdate }) => {
    const [currentPosition, setCurrentPosition] = useState(center);
    const [useGoogleMaps, setUseGoogleMaps] = useState(false);
    const [mapError, setMapError] = useState(false);
    const [directionsResult, setDirectionsResult] = useState(null);
    const [directionsService, setDirectionsService] = useState(null);
    const [showDirections, setShowDirections] = useState(false);
    const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);

    useEffect(() => {
        try {
            // Check if Google Maps API key is available
            const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
            if (apiKey && apiKey !== 'your_google_maps_api_key_here') {
                setUseGoogleMaps(true);
            } else {
                console.log('Google Maps API key not available, using fallback map');
                setUseGoogleMaps(false);
            }

            // Get user location
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        setCurrentPosition({
                            lat: latitude,
                            lng: longitude
                        });
                    },
                    (error) => {
                        console.warn('Geolocation error:', error);
                        if (onError) onError(`Geolocation error: ${error.message}`);
                    }
                );

                const watchId = navigator.geolocation.watchPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        setCurrentPosition({
                            lat: latitude,
                            lng: longitude
                        });
                    },
                    (error) => {
                        console.warn('Watch position error:', error);
                    }
                );

                return () => navigator.geolocation.clearWatch(watchId);
            }
        } catch (error) {
            console.error('LiveTracking initialization error:', error);
            if (onError) onError(`Initialization error: ${error.message}`);
            setMapError(true);
        }
    }, [onError]);

    // Calculate directions when pickup and destination are provided
    const calculateDirections = () => {
        if (directionsService && pickup && destination && googleMapsLoaded && window.google?.maps) {
            directionsService.route(
                {
                    origin: pickup,
                    destination: destination,
                    travelMode: window.google.maps.TravelMode.DRIVING,
                },
                (result, status) => {
                    if (status === 'OK') {
                        console.log('Directions calculated successfully');
                        setDirectionsResult(result);
                        setShowDirections(true);
                        
                        // Extract distance and duration info and pass to parent
                        if (onDistanceUpdate && result.routes[0].legs[0]) {
                            const leg = result.routes[0].legs[0];
                            onDistanceUpdate({
                                distance: leg.distance,
                                duration: leg.duration,
                                distanceText: leg.distance.text,
                                durationText: leg.duration.text
                            });
                        }
                    } else {
                        console.error('Directions request failed:', status);
                    }
                }
            );
        }
    };

    // Initialize directions service when map loads
    const onMapLoad = (map) => {
        if (window.google?.maps) {
            console.log('Google Maps loaded successfully');
            setGoogleMapsLoaded(true);
            const service = new window.google.maps.DirectionsService();
            setDirectionsService(service);
        }
    };

    // Calculate directions when service is ready and we have locations
    useEffect(() => {
        if (directionsService && pickup && destination && useGoogleMaps && googleMapsLoaded) {
            calculateDirections();
        }
    }, [directionsService, pickup, destination, googleMapsLoaded]);

    // Handle fallback distance calculation (must be before conditional return)
    useEffect(() => {
        if ((!useGoogleMaps || mapError) && pickup && destination && onDistanceUpdate) {
            // Use the same mock calculation as the backend for fallback
            const hashString = (str) => {
                let hash = 0;
                for (let i = 0; i < str.length; i++) {
                    const char = str.charCodeAt(i);
                    hash = ((hash << 5) - hash) + char;
                    hash = hash & hash;
                }
                return Math.abs(hash);
            };
            
            const locationHash = hashString((pickup || '') + (destination || ''));
            const baseDistance = 1500 + (locationHash % 23500); // 1.5km to 25km in meters
            const distanceKm = baseDistance / 1000;
            const averageSpeed = 22;
            const estimatedDuration = (distanceKm / averageSpeed) * 60;
            const trafficMultiplier = 1.1 + ((locationHash % 30) / 100);
            const finalDuration = Math.round(estimatedDuration * trafficMultiplier);
            
            console.log('Fallback distance calculation:', `${distanceKm.toFixed(1)} km`);
            onDistanceUpdate({
                distance: { text: `${distanceKm.toFixed(1)} km`, value: Math.round(baseDistance) },
                duration: { text: `${finalDuration} mins`, value: finalDuration * 60 },
                distanceText: `${distanceKm.toFixed(1)} km`,
                durationText: `${finalDuration} mins`
            });
        }
    }, [pickup, destination, onDistanceUpdate, useGoogleMaps, mapError]);

    // If not using Google Maps or if there's an error, show fallback
    if (!useGoogleMaps || mapError) {
        return <FallbackMap />;
    }

    try {
        return (
            <div className="relative w-full h-full">
                {!googleMapsLoaded && (
                    <div className="absolute inset-0 bg-blue-50 flex items-center justify-center z-20">
                        <div className="text-center">
                            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                            <p className="text-blue-600 font-medium">Loading Google Maps...</p>
                        </div>
                    </div>
                )}
                <LoadScript
                    googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
                    libraries={libraries}
                    onLoad={() => {
                        console.log('Google Maps API loaded');
                        setGoogleMapsLoaded(true);
                    }}
                    onError={(error) => {
                        console.error('Google Maps failed to load, switching to fallback', error);
                        setMapError(true);
                        if (onError) onError(`Google Maps loading error: ${error?.message || 'Unknown error'}`);
                    }}
                >
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={currentPosition}
                    zoom={15}
                    onLoad={onMapLoad}
                    onError={() => {
                        console.error('Google Maps error, switching to fallback');
                        setMapError(true);
                    }}
                    options={{
                        zoomControl: true,
                        streetViewControl: true,
                        mapTypeControl: true,
                        fullscreenControl: true,
                        styles: [
                            {
                                featureType: "poi",
                                elementType: "labels",
                                stylers: [{ visibility: "off" }]
                            }
                        ]
                    }}
                >
                    {/* Current location marker */}
                    {googleMapsLoaded && (
                        <Marker 
                            position={currentPosition} 
                            icon={{
                                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(
                                    '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
                                    '<circle cx="12" cy="12" r="8" fill="#4285F4"/>' +
                                    '<circle cx="12" cy="12" r="3" fill="white"/>' +
                                    '</svg>'
                                ),
                                scaledSize: new window.google.maps.Size(24, 24),
                            }}
                            title="Your current location"
                        />
                    )}
                    
                    {/* Show directions if available */}
                    {showDirections && directionsResult && (
                        <DirectionsRenderer 
                            directions={directionsResult}
                            options={{
                                suppressMarkers: false,
                                polylineOptions: {
                                    strokeColor: '#4285F4',
                                    strokeWeight: 5,
                                    strokeOpacity: 0.8
                                }
                            }}
                        />
                    )}
                </GoogleMap>
            </LoadScript>
            
            {/* Navigation controls
            {useGoogleMaps && (
                <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3 z-10">
                    <div className="flex flex-col space-y-2">
                        <button
                            onClick={calculateDirections}
                            className="bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600 transition-colors"
                            disabled={!pickup || !destination}
                        >
                             Get Directions
                        </button>
                        
                        <button
                            onClick={() => {
                                setShowDirections(!showDirections);
                            }}
                            className="bg-green-500 text-white px-3 py-2 rounded text-sm hover:bg-green-600 transition-colors"
                            disabled={!directionsResult}
                        >
                            {showDirections ? ' Hide Route' : ' Show Route'}
                        </button>
                        
                        <button
                            onClick={() => {
                                if (pickup && destination) {
                                    const url = `https://www.google.com/maps/dir/${encodeURIComponent(pickup)}/${encodeURIComponent(destination)}`;
                                    window.open(url, '_blank');
                                }
                            }}
                            className="bg-orange-500 text-white px-3 py-2 rounded text-sm hover:bg-orange-600 transition-colors"
                            disabled={!pickup || !destination}
                        >
                            🚗 Open in Maps
                        </button>
                    </div>
                </div>
            )} */}
            
            {/* Trip info */}
            {pickup && destination && (
                <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 z-10 max-w-xs">
                    <h3 className="font-semibold text-sm mb-2">🚖 Trip Route</h3>
                    <div className="text-xs text-gray-600 space-y-1">
                        <div><strong>From:</strong> {pickup}</div>
                        <div><strong>To:</strong> {destination}</div>
                        {directionsResult && (
                            <div className="mt-2 pt-2 border-t">
                                <div><strong>Distance:</strong> {directionsResult.routes[0].legs[0].distance?.text}</div>
                                <div><strong>Duration:</strong> {directionsResult.routes[0].legs[0].duration?.text}</div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
        );
    } catch (error) {
        console.error('LiveTracking render error:', error);
        if (onError) onError(`Render error: ${error.message}`);
        return <FallbackMap />;
    }
}

export default LiveTracking
