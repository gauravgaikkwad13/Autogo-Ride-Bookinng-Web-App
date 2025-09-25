import React, { useRef, useState, useEffect } from 'react'
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import axios from 'axios';
import 'remixicon/fonts/remixicon.css'
import LocationSearchPanel from '../components/LocationSearchPanel';
import VehiclePanel from '../components/VehiclePanel';
import ConfirmRide from '../components/ConfirmRide';
import LookingForDriver from '../components/LookingForDriver';
import WaitingForDriver from '../components/WaitingForDriver';
import { SocketContext } from '../context/SocketContext';
import { useContext } from 'react';
import { UserDataContext } from '../context/UserContext';
import { useNavigate, Link } from 'react-router-dom';
import LiveTracking from '../components/LiveTracking';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';
import Logo from '../assets/Logo.png';
import LogoDark from '../assets/LogoDark.png';

// Error Boundary Component
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Home page error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md">
                        <h2 className="text-xl font-bold text-red-600 mb-4">⚠️ Page Error</h2>
                        <p className="text-gray-600 mb-4">Something went wrong with the user page.</p>
                        <button 
                            onClick={() => window.location.reload()}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            🔄 Reload Page
                        </button>
                        <details className="mt-4 text-xs text-gray-500">
                            <summary>Error Details</summary>
                            <pre className="mt-2 bg-gray-100 p-2 rounded text-xs overflow-auto">
                                {this.state.error?.toString()}
                            </pre>
                        </details>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

const HomeContent = () => {
    console.log('Home component rendering...');
    
    // Add error state for debugging
    const [componentError, setComponentError] = useState(null);
    
    const [ pickup, setPickup ] = useState('')
    const [ destination, setDestination ] = useState('')
    const [ panelOpen, setPanelOpen ] = useState(false)
    const vehiclePanelRef = useRef(null)
    const confirmRidePanelRef = useRef(null)
    const vehicleFoundRef = useRef(null)
    const waitingForDriverRef = useRef(null)
    const panelRef = useRef(null)
    const panelCloseRef = useRef(null)
    const pickupInputRef = useRef(null)
    const destinationInputRef = useRef(null)
    const [ vehiclePanel, setVehiclePanel ] = useState(false)
    const [ confirmRidePanel, setConfirmRidePanel ] = useState(false)
    const [ vehicleFound, setVehicleFound ] = useState(false)
    const [ waitingForDriver, setWaitingForDriver ] = useState(false)
    const [ pickupSuggestions, setPickupSuggestions ] = useState([])
    const [ destinationSuggestions, setDestinationSuggestions ] = useState([])
    const [ activeField, setActiveField ] = useState(null)
    const [ fare, setFare ] = useState({})
    const [ vehicleType, setVehicleType ] = useState(null)
    const [ ride, setRide ] = useState(null)
    const [ isKeyboardOpen, setIsKeyboardOpen ] = useState(false)
    const [ focusedInput, setFocusedInput ] = useState(null)

    const navigate = useNavigate()
    const { theme } = useTheme()

    const { socket } = useContext(SocketContext)
    const { user } = useContext(UserDataContext)

    useEffect(() => {
        socket.emit("join", { userType: "user", userId: user._id })
    }, [ user ])

    // Keyboard detection for mobile devices
    useEffect(() => {
        const handleResize = () => {
            const viewportHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
            const windowHeight = window.innerHeight;
            const keyboardThreshold = 150; // pixels

            if (windowHeight - viewportHeight > keyboardThreshold) {
                setIsKeyboardOpen(true);
            } else {
                setIsKeyboardOpen(false);
                setFocusedInput(null);
            }
        };

        const handleFocus = (e) => {
            if (e.target.tagName === 'INPUT') {
                setFocusedInput(e.target);
                setIsKeyboardOpen(true);
            }
        };

        const handleBlur = () => {
            // Delay to allow for focus to move to another input
            setTimeout(() => {
                if (!document.activeElement || document.activeElement.tagName !== 'INPUT') {
                    setFocusedInput(null);
                    setIsKeyboardOpen(false);
                }
            }, 100);
        };

        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', handleResize);
        } else {
            window.addEventListener('resize', handleResize);
        }

        document.addEventListener('focusin', handleFocus);
        document.addEventListener('focusout', handleBlur);

        return () => {
            if (window.visualViewport) {
                window.visualViewport.removeEventListener('resize', handleResize);
            } else {
                window.removeEventListener('resize', handleResize);
            }
            document.removeEventListener('focusin', handleFocus);
            document.removeEventListener('focusout', handleBlur);
        };
    }, [])

    // Scroll focused input into view when keyboard opens
    useEffect(() => {
        if (isKeyboardOpen && focusedInput) {
            const inputRef = focusedInput === 'pickup' ? pickupInputRef : destinationInputRef;
            if (inputRef.current) {
                setTimeout(() => {
                    inputRef.current.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'center',
                        inline: 'nearest' 
                    });
                }, 300);
            }
        }
    }, [isKeyboardOpen, focusedInput])

    // Close panel when clicking outside or pressing escape
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && panelOpen) {
                setPanelOpen(false);
                setActiveField(null);
                setFocusedInput(null);
            }
        };

        const handleClickOutside = (e) => {
            if (panelRef.current && !panelRef.current.contains(e.target) && 
                !pickupInputRef.current?.contains(e.target) && 
                !destinationInputRef.current?.contains(e.target)) {
                setPanelOpen(false);
                setActiveField(null);
                setFocusedInput(null);
            }
        };

        document.addEventListener('keydown', handleEscape);
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [panelOpen])

    // Socket event listeners
    useEffect(() => {
        socket.on('ride-confirmed', ride => {
            setVehicleFound(false)
            setWaitingForDriver(true)
            setRide(ride)
        })

        socket.on('ride-started', ride => {
            console.log("ride")
            setWaitingForDriver(false)
            navigate('/riding', { state: { ride } }) // Updated navigate to include ride data
        })

        return () => {
            socket.off('ride-confirmed')
            socket.off('ride-started')
        }
    }, [socket, navigate])


    const handlePickupChange = async (e) => {
        setPickup(e.target.value)
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, {
                params: { input: e.target.value },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }

            })
            setPickupSuggestions(response.data)
        } catch {
            // handle error
        }
    }

    const handleDestinationChange = async (e) => {
        setDestination(e.target.value)
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, {
                params: { input: e.target.value },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            setDestinationSuggestions(response.data)
        } catch {
            // handle error
        }
    }

    const submitHandler = (e) => {
        e.preventDefault()
    }

    useGSAP(function () {
        if (panelOpen) {
            gsap.to(panelRef.current, {
                height: '70%',
                padding: 24,
                // opacity:1
            })
            gsap.to(panelCloseRef.current, {
                opacity: 1
            })
        } else {
            gsap.to(panelRef.current, {
                height: '0%',
                padding: 0,
                // opacity:0
            })
            gsap.to(panelCloseRef.current, {
                opacity: 0
            })
        }
    }, [ panelOpen ])


    useGSAP(function () {
        if (vehiclePanel) {
            gsap.to(vehiclePanelRef.current, {
                opacity: 1,
                visibility: 'visible',
                transform: 'translateY(0)',
                duration: 0.3,
                ease: 'power2.out'
            })
        } else {
            gsap.to(vehiclePanelRef.current, {
                opacity: 0,
                visibility: 'hidden',
                transform: 'translateY(100%)',
                duration: 0.3,
                ease: 'power2.in'
            })
        }
    }, [ vehiclePanel ])

    useGSAP(function () {
        if (confirmRidePanel) {
            gsap.to(confirmRidePanelRef.current, {
                opacity: 1,
                visibility: 'visible',
                transform: 'translateY(0)',
                duration: 0.3,
                ease: 'power2.out'
            })
        } else {
            gsap.to(confirmRidePanelRef.current, {
                opacity: 0,
                visibility: 'hidden',
                transform: 'translateY(100%)',
                duration: 0.3,
                ease: 'power2.in'
            })
        }
    }, [ confirmRidePanel ])

    useGSAP(function () {
        if (vehicleFound) {
            gsap.to(vehicleFoundRef.current, {
                opacity: 1,
                visibility: 'visible',
                transform: 'translateY(0)',
                duration: 0.3,
                ease: 'power2.out'
            })
        } else {
            gsap.to(vehicleFoundRef.current, {
                opacity: 0,
                visibility: 'hidden',
                transform: 'translateY(100%)',
                duration: 0.3,
                ease: 'power2.in'
            })
        }
    }, [ vehicleFound ])

    useGSAP(function () {
        if (waitingForDriver) {
            gsap.to(waitingForDriverRef.current, {
                opacity: 1,
                visibility: 'visible',
                transform: 'translateY(0)',
                duration: 0.3,
                ease: 'power2.out'
            })
        } else {
            gsap.to(waitingForDriverRef.current, {
                opacity: 0,
                visibility: 'hidden',
                transform: 'translateY(100%)',
                duration: 0.3,
                ease: 'power2.in'
            })
        }
    }, [ waitingForDriver ])


    async function findTrip() {
        setVehiclePanel(true)
        setPanelOpen(false)

        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/get-fare`, {
            params: { pickup, destination },
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })


        setFare(response.data)


    }

    async function createRide() {
        console.log('Creating ride with:', { pickup, destination, vehicleType });
        console.log('Base URL:', import.meta.env.VITE_BASE_URL);
        
        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/create`, {
                pickup,
                destination,
                vehicleType
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            console.log('Ride created successfully:', response.data);
        } catch (error) {
            console.error('Error creating ride:', error);
            console.error('Error response:', error.response?.data);
        }
    }

    return (
        <div className='h-screen relative overflow-hidden bg-gray-50 dark:bg-gray-900'>
            {/* Modern Header */}
            <div className='absolute top-0 left-0 right-0 z-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800'>
                <div className='flex items-center justify-between px-4 py-3 lg:px-6 lg:py-4'>
                    <Link to='/' className='flex items-center'>
                        <img className='w-24 lg:w-28 transition-transform hover:scale-105' 
                             src={theme === 'dark' ? Logo : LogoDark} 
                             alt="AutoGo Logo" />
                    </Link>
                    <div className='flex items-center gap-3'>
                        <ThemeToggle />
                        <Link to='/user/logout' 
                              className='p-2.5 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/50 transition-all duration-200 group'>
                            <svg className='w-5 h-5 transition-transform group-hover:scale-110' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1' />
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Map Container */}
            <div className='h-screen w-screen pt-16'>
                <div className='w-full h-full relative'>
                    {componentError ? (
                        <div className='w-full h-full bg-red-50 dark:bg-red-900/10 flex items-center justify-center'>
                            <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md text-center'>
                                <div className='w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4'>
                                    <svg className='w-8 h-8 text-red-600 dark:text-red-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
                                    </svg>
                                </div>
                                <h3 className='text-xl font-bold text-gray-900 dark:text-white mb-2'>Map Loading Error</h3>
                                <p className='text-gray-600 dark:text-gray-400 mb-6'>{componentError}</p>
                                <button 
                                    onClick={() => {
                                        setComponentError(null);
                                        window.location.reload();
                                    }}
                                    className='btn btn-primary'
                                >
                                    <svg className='w-5 h-5 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' />
                                    </svg>
                                    Retry
                                </button>
                            </div>
                        </div>
                    ) : (
                        <LiveTracking 
                            pickup={pickup} 
                            destination={destination}
                            onError={(error) => {
                                console.error('LiveTracking error:', error);
                                setComponentError(error.toString());
                            }}
                        />
                    )}
                </div>
            </div>

            {/* Modern Bottom Panel */}
            <div className={`flex flex-col ${isKeyboardOpen ? 'justify-start' : 'justify-end'} h-screen absolute top-0 w-full pointer-events-none transition-all duration-300`}>
                <div className={`bg-white dark:bg-gray-900 rounded-t-3xl shadow-2xl dark:shadow-dark-soft p-6 relative pointer-events-auto transition-all duration-300 ${isKeyboardOpen ? 'mt-20' : ''}`}>
                    <div className='absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1 bg-gray-300 dark:bg-gray-700 rounded-full'></div>
                    
                    <button ref={panelCloseRef} 
                            onClick={() => setPanelOpen(false)} 
                            className='absolute opacity-0 right-6 top-6 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors'>
                        <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                        </svg>
                    </button>
                    
                    <h4 className='text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2'>
                        <span className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></span>
                        Book Your Ride
                    </h4>
                    
                    <form className='space-y-3' onSubmit={(e) => submitHandler(e)}>
                        <div className='relative'>
                            <div className='absolute left-3 top-1/2 -translate-y-1/2 z-10'>
                                <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
                            </div>
                            <input
                                ref={pickupInputRef}
                                onClick={() => {
                                    setPanelOpen(true)
                                    setActiveField('pickup')
                                    setFocusedInput('pickup')
                                }}
                                onFocus={() => {
                                    setPanelOpen(true)
                                    setActiveField('pickup')
                                    setFocusedInput('pickup')
                                }}
                                value={pickup}
                                onChange={handlePickupChange}
                                className='input-field w-full pl-10'
                                type="text"
                                placeholder='Enter pickup location'
                            />
                        </div>
                        
                        <div className='relative'>
                            <div className='absolute left-3 top-1/2 -translate-y-1/2 z-10'>
                                <div className='w-2 h-2 bg-red-500 rounded-full'></div>
                            </div>
                            <div className='absolute left-[15px] -top-3 w-0.5 h-3 bg-gray-300 dark:bg-gray-600'></div>
                            <input
                                ref={destinationInputRef}
                                onClick={() => {
                                    setPanelOpen(true)
                                    setActiveField('destination')
                                    setFocusedInput('destination')
                                }}
                                onFocus={() => {
                                    setPanelOpen(true)
                                    setActiveField('destination')
                                    setFocusedInput('destination')
                                }}
                                value={destination}
                                onChange={handleDestinationChange}
                                className='input-field w-full pl-10'
                                type="text"
                                placeholder='Where to?' 
                            />
                        </div>
                    </form>
                    
                    <button
                        onClick={findTrip}
                        className='btn btn-primary w-full mt-4 flex items-center justify-center gap-2'>
                        <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
                        </svg>
                        Find Available Rides
                    </button>
                </div>
                
                <div ref={panelRef} className={`bg-white dark:bg-gray-900 overflow-hidden pointer-events-auto z-30 transition-all duration-300 ${isKeyboardOpen ? 'flex-1 max-h-[calc(100vh-300px)]' : 'h-0'}`}>
                    <div className={`h-full ${isKeyboardOpen ? 'overflow-y-auto' : ''}`}>
                        <LocationSearchPanel
                            suggestions={activeField === 'pickup' ? pickupSuggestions : destinationSuggestions}
                            setPanelOpen={setPanelOpen}
                            setVehiclePanel={setVehiclePanel}
                            setPickup={setPickup}
                            setDestination={setDestination}
                            activeField={activeField}
                        />
                    </div>
                </div>
            </div>
            <div ref={vehiclePanelRef} className='fixed inset-0 z-10 bg-black bg-opacity-50 flex items-end lg:items-center justify-center opacity-0 invisible translate-y-full'>
                <VehiclePanel
                    selectVehicle={setVehicleType}
                    fare={fare} 
                    setConfirmRidePanel={setConfirmRidePanel} 
                    setVehiclePanel={setVehiclePanel} 
                />
            </div>
            <div ref={confirmRidePanelRef} className='fixed inset-0 z-10 bg-black bg-opacity-50 flex items-end lg:items-center justify-center opacity-0 invisible translate-y-full'>
                <ConfirmRide
                    createRide={createRide}
                    pickup={pickup}
                    destination={destination}
                    fare={fare}
                    vehicleType={vehicleType}
                    setConfirmRidePanel={setConfirmRidePanel} 
                    setVehicleFound={setVehicleFound} 
                />
            </div>
            <div ref={vehicleFoundRef} className='fixed inset-0 z-10 bg-black bg-opacity-50 flex items-end lg:items-center justify-center opacity-0 invisible translate-y-full'>
                <LookingForDriver
                    createRide={createRide}
                    pickup={pickup}
                    destination={destination}
                    fare={fare}
                    vehicleType={vehicleType}
                    setVehicleFound={setVehicleFound} 
                />
            </div>
            <div ref={waitingForDriverRef} className='fixed inset-0 z-10 bg-black bg-opacity-50 flex items-end lg:items-center justify-center opacity-0 invisible translate-y-full'>
                <WaitingForDriver
                    ride={ride}
                    setVehicleFound={setVehicleFound}
                    setWaitingForDriver={setWaitingForDriver}
                    waitingForDriver={waitingForDriver} 
                />
            </div>
        </div>
    )
}

const Home = () => {
    console.log('Home wrapper component mounting...');
    return (
        <ErrorBoundary>
            <HomeContent />
        </ErrorBoundary>
    );
};


export default Home;
