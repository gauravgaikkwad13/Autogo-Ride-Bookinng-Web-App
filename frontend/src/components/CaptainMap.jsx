import React, { useState, useEffect } from 'react'
import { LoadScript, GoogleMap, Marker } from '@react-google-maps/api'
import FallbackMap from './FallbackMap'

const containerStyle = {
    width: '100%',
    height: '100%',
};

const center = {
    lat: 18.5204, // Default to Pune coordinates
    lng: 73.8567
};

const libraries = ['places'];

const CaptainMap = () => {
    const [currentPosition, setCurrentPosition] = useState(center);
    const [useGoogleMaps, setUseGoogleMaps] = useState(false);
    const [mapError, setMapError] = useState(false);
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
            console.error('CaptainMap initialization error:', error);
            setMapError(true);
        }
    }, []);

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
                            <p className="text-blue-600 font-medium">Loading Map...</p>
                        </div>
                    </div>
                )}
                <LoadScript
                    googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
                    libraries={libraries}
                    onLoad={() => {
                        console.log('Google Maps API loaded for CaptainMap');
                        setGoogleMapsLoaded(true);
                    }}
                    onError={(error) => {
                        console.error('Google Maps failed to load, switching to fallback', error);
                        setMapError(true);
                    }}
                >
                    <GoogleMap
                        mapContainerStyle={containerStyle}
                        center={currentPosition}
                        zoom={15}
                        onLoad={() => setGoogleMapsLoaded(true)}
                        onError={() => {
                            console.error('Google Maps error, switching to fallback');
                            setMapError(true);
                        }}
                        options={{
                            zoomControl: true,
                            streetViewControl: false,
                            mapTypeControl: false,
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
                                        '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
                                        '<circle cx="12" cy="12" r="10" fill="#10B981" stroke="white" stroke-width="2"/>' +
                                        '<circle cx="12" cy="12" r="4" fill="white"/>' +
                                        '</svg>'
                                    ),
                                    scaledSize: new window.google.maps.Size(32, 32),
                                    anchor: new window.google.maps.Point(16, 16)
                                }}
                                title="Your current location"
                            />
                        )}
                    </GoogleMap>
                </LoadScript>

                {/* Status indicator */}
                <div className="absolute top-4 left-4 bg-white bg-opacity-90 backdrop-blur-sm rounded-lg p-3 shadow-lg z-10">
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium text-green-600">Live Tracking Active</span>
                    </div>
                </div>

                {/* Location coordinates */}
                <div className="absolute top-4 right-4 bg-white bg-opacity-90 backdrop-blur-sm rounded-lg p-3 shadow-lg z-10">
                    <div className="text-xs text-gray-600">
                        <div>Lat: {currentPosition.lat.toFixed(6)}</div>
                        <div>Lng: {currentPosition.lng.toFixed(6)}</div>
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        console.error('CaptainMap render error:', error);
        return <FallbackMap />;
    }
}

export default CaptainMap
