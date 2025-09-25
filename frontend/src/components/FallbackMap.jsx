import React, { useState, useEffect } from 'react';

const FallbackMap = () => {
    const [currentPosition, setCurrentPosition] = useState({
        lat: 18.5204,  // Default to Pune coordinates
        lng: 73.8567
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Get user's current location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setCurrentPosition({
                        lat: latitude,
                        lng: longitude
                    });
                    setIsLoading(false);
                    console.log('Location updated:', latitude, longitude);
                },
                (error) => {
                    console.error('Geolocation error:', error);
                    setError(error.message);
                    setIsLoading(false);
                }
            );

            // Watch position for real-time updates
            const watchId = navigator.geolocation.watchPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setCurrentPosition({
                        lat: latitude,
                        lng: longitude
                    });
                },
                (error) => console.error('Watch position error:', error)
            );

            return () => navigator.geolocation.clearWatch(watchId);
        } else {
            setError('Geolocation is not supported by this browser.');
            setIsLoading(false);
        }
    }, []);

    return (
        <div className="relative w-full h-full bg-gradient-to-br from-blue-400 to-green-400 overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-20">
                <div className="w-full h-full" 
                     style={{
                         backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.2) 1px, transparent 1px),
                                         radial-gradient(circle at 75% 75%, rgba(255,255,255,0.2) 1px, transparent 1px)`,
                         backgroundSize: '50px 50px'
                     }}>
                </div>
            </div>

            {/* Status indicator */}
            <div className="absolute top-4 left-4 bg-white bg-opacity-90 backdrop-blur-sm rounded-lg p-3 shadow-lg z-10">
                <div className="flex items-center space-x-2">
                    {isLoading ? (
                        <>
                            <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                            <span className="text-sm font-medium text-gray-700">Getting location...</span>
                        </>
                    ) : error ? (
                        <>
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            <span className="text-sm font-medium text-red-600">Location unavailable</span>
                        </>
                    ) : (
                        <>
                            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-sm font-medium text-green-600">Live tracking active</span>
                        </>
                    )}
                </div>
            </div>

            {/* Location info */}
            <div className="absolute top-4 right-4 bg-white bg-opacity-90 backdrop-blur-sm rounded-lg p-3 shadow-lg z-10">
                <div className="text-xs text-gray-600">
                    <div>Lat: {currentPosition.lat.toFixed(6)}</div>
                    <div>Lng: {currentPosition.lng.toFixed(6)}</div>
                </div>
            </div>

            {/* Center marker representing current location */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                    {/* Pulsing circle animation */}
                    <div className="absolute -inset-4 bg-blue-500 rounded-full animate-ping opacity-75"></div>
                    <div className="absolute -inset-2 bg-blue-400 rounded-full animate-pulse opacity-50"></div>
                    
                    {/* Main location marker */}
                    <div className="relative w-8 h-8 bg-blue-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                    
                    {/* Location pin */}
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                        <div className="w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-blue-600"></div>
                    </div>
                </div>
            </div>

            {/* Bottom info panel */}
            <div className="absolute bottom-4 left-4 right-4 bg-white bg-opacity-90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
                <div className="text-center">
                    <h3 className="font-semibold text-gray-800 mb-2">🚗 Live Location Tracking</h3>
                    <p className="text-sm text-gray-600 mb-2">
                        Your location is being tracked in real-time for this ride.
                    </p>
                    <div className="flex justify-center space-x-4 text-xs text-gray-500">
                        <span>📍 GPS Active</span>
                        <span>🔄 Auto Update</span>
                        <span>🛡️ Secure</span>
                    </div>
                </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-20 left-10 w-2 h-2 bg-white rounded-full opacity-60 animate-bounce" style={{animationDelay: '0s'}}></div>
            <div className="absolute top-32 right-16 w-1 h-1 bg-white rounded-full opacity-40 animate-bounce" style={{animationDelay: '0.5s'}}></div>
            <div className="absolute bottom-40 left-20 w-1 h-1 bg-white rounded-full opacity-50 animate-bounce" style={{animationDelay: '1s'}}></div>
            <div className="absolute bottom-56 right-12 w-2 h-2 bg-white rounded-full opacity-30 animate-bounce" style={{animationDelay: '1.5s'}}></div>

            {error && (
                <div className="absolute bottom-20 left-4 right-4 bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-red-600 text-sm text-center">
                        {error}
                    </p>
                </div>
            )}
        </div>
    );
};

export default FallbackMap;