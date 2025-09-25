import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Logo from '../assets/DriverLogo.png';
import CaptainDetails from '../components/CaptainDetails'
import RidePopUp from '../components/RidePopUp'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ConfirmRidePopUp from '../components/ConfirmRidePopUp'
import { useEffect, useContext } from 'react'
import { SocketContext } from '../context/SocketContext'
import { CaptainDataContext } from '../context/CapatainContext'
import axios from 'axios'
import CaptainMap from '../components/CaptainMap'

const CaptainHome = () => {

    const [ ridePopupPanel, setRidePopupPanel ] = useState(false)
    const [ confirmRidePopupPanel, setConfirmRidePopupPanel ] = useState(false)

    const ridePopupPanelRef = useRef(null)
    const confirmRidePopupPanelRef = useRef(null)
    const [ ride, setRide ] = useState(null)

    const { socket } = useContext(SocketContext)
    const { captain } = useContext(CaptainDataContext)

    useEffect(() => {
        if (captain?._id) {
            console.log('Captain joining socket with ID:', captain._id);
            socket.emit('join', {
                userId: captain._id,
                userType: 'captain'
            });
            
            const updateLocation = () => {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(position => {
                        console.log('Sending captain location:', {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        });
                        
                        socket.emit('update-location-captain', {
                            userId: captain._id,
                            location: {
                                lat: position.coords.latitude,
                                lng: position.coords.longitude
                            }
                        });
                    }, (error) => {
                        console.error('Geolocation error:', error);
                    });
                }
            };

            const locationInterval = setInterval(updateLocation, 10000);
            updateLocation();

            return () => {
                clearInterval(locationInterval);
            };
        }
    }, [captain]);
    
    useEffect(() => {
        const handleNewRide = (data) => {
            console.log('New ride received:', data);
            setRide(data);
            setRidePopupPanel(true);
        };
        
        socket.on('new-ride', handleNewRide);
        
        return () => {
            socket.off('new-ride', handleNewRide);
        };
    }, []);


    async function confirmRide() {

        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/confirm`, {

            rideId: ride._id,
            captainId: captain._id,


        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })

        setRidePopupPanel(false)
        setConfirmRidePopupPanel(true)

    }


    useGSAP(function () {
        if (ridePopupPanel) {
            gsap.to(ridePopupPanelRef.current, {
                opacity: 1,
                visibility: 'visible',
                transform: 'translateY(0)',
                duration: 0.3,
                ease: 'power2.out'
            })
        } else {
            gsap.to(ridePopupPanelRef.current, {
                opacity: 0,
                visibility: 'hidden',
                transform: 'translateY(100%)',
                duration: 0.3,
                ease: 'power2.in'
            })
        }
    }, [ ridePopupPanel ])

    useGSAP(function () {
        if (confirmRidePopupPanel) {
            gsap.to(confirmRidePopupPanelRef.current, {
                opacity: 1,
                visibility: 'visible',
                transform: 'translateY(0)',
                duration: 0.3,
                ease: 'power2.out'
            })
        } else {
            gsap.to(confirmRidePopupPanelRef.current, {
                opacity: 0,
                visibility: 'hidden',
                transform: 'translateY(100%)',
                duration: 0.3,
                ease: 'power2.in'
            })
        }
    }, [ confirmRidePopupPanel ])

    return (
        <div className='h-screen flex flex-col'>
            {/* Header */}
            <div className='fixed top-0 left-0 right-0 z-20 bg-white bg-opacity-95 backdrop-blur-sm border-b border-gray-200'>
                <div className='px-4 sm:px-6 py-4 flex items-center justify-between max-w-screen-xl mx-auto'>
                    <img className='w-24 sm:w-32' src={Logo} alt="Autogo captain logo" />
                    <Link to='/captain/logout' className='h-10 w-10 bg-red-500 hover:bg-red-600 text-white flex items-center justify-center rounded-full transition-colors duration-200 shadow-md'>
                        <i className="text-lg font-medium ri-logout-box-r-line"></i>
                    </Link>
                </div>
            </div>

            {/* Main Content */}
            <div className='flex-1 flex flex-col pt-20'>
                {/* Map Section */}
                <div className='flex-1 min-h-0'>
                    <CaptainMap />
                </div>

                {/* Details Section */}
                <div className='bg-white border-t border-gray-200 p-4 sm:p-6 shadow-lg'>
                    <CaptainDetails />
                </div>
            </div>

            {/* Ride Popup Panels */}
            <div ref={ridePopupPanelRef} className='fixed inset-0 z-30 bg-black bg-opacity-50 flex items-end sm:items-center justify-center opacity-0 invisible translate-y-full'>
                <RidePopUp
                    ride={ride}
                    setRidePopupPanel={setRidePopupPanel}
                    setConfirmRidePopupPanel={setConfirmRidePopupPanel}
                    confirmRide={confirmRide}
                />
            </div>
            <div ref={confirmRidePopupPanelRef} className='fixed inset-0 z-30 bg-black bg-opacity-50 flex items-end sm:items-center justify-center opacity-0 invisible translate-y-full'>
                <ConfirmRidePopUp
                    ride={ride}
                    setConfirmRidePopupPanel={setConfirmRidePopupPanel}
                    setRidePopupPanel={setRidePopupPanel}
                />
            </div>
        </div>
    )
}

export default CaptainHome