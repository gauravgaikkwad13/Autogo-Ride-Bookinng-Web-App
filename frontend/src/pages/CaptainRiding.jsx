import React, { useRef, useState, useEffect } from 'react'
import Logo from '../assets/LogoDark.png';
import { Link, useLocation } from 'react-router-dom'
import FinishRide from '../components/FinishRide'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import LiveTracking from '../components/LiveTracking'
import axios from 'axios'

const CaptainRiding = () => {
    const [ finishRidePanel, setFinishRidePanel ] = useState(false)
    const finishRidePanelRef = useRef(null)
    const location = useLocation()
    const rideData = location.state?.ride
    
    // State for real-time distance
    const [distanceToDestination, setDistanceToDestination] = useState('Calculating...')
    const [captainLocation, setCaptainLocation] = useState(null)
    const [isCalculating, setIsCalculating] = useState(true)
    const [liveTrackingDistance, setLiveTrackingDistance] = useState(null)

    // Callback to receive distance updates from LiveTracking component
    const handleDistanceUpdate = (distanceData) => {
        console.log(' Received accurate distance update from LiveTracking:', distanceData);
        console.log(' Distance:', distanceData.distanceText);
        console.log(' Duration:', distanceData.durationText);
        setLiveTrackingDistance(distanceData);
        setDistanceToDestination(distanceData.distanceText + ' (route)');
        setIsCalculating(false);
    };

    // Initialize with fallback data while waiting for LiveTracking to provide accurate data
    useEffect(() => {
        console.log('CaptainRiding: useEffect triggered with rideData:', rideData);
        
        if (!rideData?.destination) {
            console.log('No ride data or destination found');
            setDistanceToDestination('No destination');
            setIsCalculating(false);
            return;
        }

        // Set initial state - LiveTracking will update with accurate data
        setDistanceToDestination('Loading route...');
        setIsCalculating(true);
        
        // Set a fallback timeout in case LiveTracking doesn't provide data
        const fallbackTimeout = setTimeout(() => {
            if (!liveTrackingDistance) {
                console.log('LiveTracking timeout, using fallback');
                if (rideData?.distance && rideData.distance > 0) {
                    const distanceKm = (rideData.distance / 1000).toFixed(1);
                    setDistanceToDestination(`${distanceKm} km (stored)`);
                } else {
                    setDistanceToDestination('Distance unavailable');
                }
                setIsCalculating(false);
            }
        }, 5000); // 5 second timeout
        
        return () => clearTimeout(fallbackTimeout);
    }, [rideData, liveTrackingDistance]);

    // Effect to handle when LiveTracking updates distance (for dynamic updates)
    useEffect(() => {
        if (liveTrackingDistance) {
            console.log('LiveTracking distance state updated:', liveTrackingDistance);
            setDistanceToDestination(liveTrackingDistance.distanceText + ' (route)');
            setIsCalculating(false);
        }
    }, [liveTrackingDistance]);

    useGSAP(function () {
        if (finishRidePanel) {
            gsap.to(finishRidePanelRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(finishRidePanelRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [ finishRidePanel ])


    return (
        <div className='h-screen relative flex flex-col justify-end'>

            <div className='fixed p-6 top-0 flex items-center justify-between w-screen'>
                <img className='w-16' src={Logo} alt="" />
                <Link to='/captain-home' className=' h-10 w-10 bg-white flex items-center justify-center rounded-full'>
                    <i className="text-lg font-medium ri-logout-box-r-line"></i>
                </Link>
            </div>

            <div className='h-1/5 p-6 flex items-center justify-between relative bg-yellow-400 pt-10'
                onClick={() => {
                    setFinishRidePanel(true)
                }}
            >
                <h5 className='p-1 text-center w-[90%] absolute top-0' onClick={() => {

                }}><i className="text-3xl text-gray-800 ri-arrow-up-wide-line"></i></h5>
                <div className='flex items-center gap-2'>
                    <h4 className='text-xl font-semibold'>{distanceToDestination}</h4>
                    {isCalculating && (
                        <div className='w-4 h-4 border-2 border-gray-800 border-t-transparent rounded-full animate-spin' title='Calculating distance...'></div>
                    )}
                    {!isCalculating && distanceToDestination.includes('route') && (
                        <div className='w-2 h-2 bg-green-500 rounded-full animate-pulse' title='Live route data from maps'></div>
                    )}
                    {!isCalculating && distanceToDestination.includes('stored') && (
                        <div className='w-2 h-2 bg-blue-500 rounded-full' title='Stored trip distance'></div>
                    )}
                </div>
                <button className=' bg-green-600 text-white font-semibold p-3 px-10 rounded-lg'>Complete Ride</button>
            </div>
            <div ref={finishRidePanelRef} className='fixed w-full z-[500] bottom-0 translate-y-full bg-white px-3 py-10 pt-12'>
                <FinishRide
                    ride={rideData}
                    setFinishRidePanel={setFinishRidePanel} />
            </div>

            <div className='h-screen fixed w-screen top-0 z-[-1]'>
                <LiveTracking 
                    pickup={rideData?.pickup} 
                    destination={rideData?.destination}
                    onDistanceUpdate={handleDistanceUpdate}
                />
            </div>

        </div>
    )
}

export default CaptainRiding