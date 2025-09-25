import React, { useState } from 'react'

const VehiclePanel = (props) => {
    const { fare } = props;
    const hasTripInfo = fare?.distance && fare?.duration;
    const hasSurge = fare?.surgePricing;
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    
    // Calculate estimated arrival time based on distance
    const getEstimatedTime = (vehicleType) => {
        if (!fare?.duration) return '2 mins';
        
        const baseTime = Math.round(fare.duration.value / 60); // Convert to minutes
        const vehicleMultiplier = {
            car: 1.0,
            auto: 1.1,
            moto: 0.9
        };
        
        const adjustedTime = Math.round(baseTime * vehicleMultiplier[vehicleType]);
        return adjustedTime <= 1 ? '1 min' : `${adjustedTime} mins`;
    };
    
    const vehicles = [
        {
            id: 'car',
            name: 'Cab',
            capacity: 4,
            time: getEstimatedTime('car'),
            description: 'Comfortable rides with AC',
            image: 'https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg',
            price: fare?.car,
            popular: true
        },
        {
            id: 'moto',
            name: 'Moto',
            capacity: 1,
            time: getEstimatedTime('moto'),
            description: 'Quick & affordable rides',
            image: 'https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_638,w_956/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png',
            price: fare?.moto,
            popular: false
        },
        {
            id: 'auto',
            name: 'Auto',
            capacity: 3,
            time: getEstimatedTime('auto'),
            description: 'Economical auto rides',
            image: 'https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png',
            price: fare?.auto,
            popular: false
        }
    ];
    
    return (
        <div className='bg-white dark:bg-gray-900 rounded-t-3xl lg:rounded-3xl w-full lg:max-w-2xl shadow-2xl dark:shadow-dark-soft animate-slide-up'>
            {/* Header */}
            <div className='relative p-6 pb-4 border-b border-gray-200 dark:border-gray-800'>
                <button 
                    className='absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1 bg-gray-300 dark:bg-gray-700 rounded-full lg:hidden'
                    onClick={() => props.setVehiclePanel(false)}
                />
                <button 
                    className='absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors'
                    onClick={() => props.setVehiclePanel(false)}
                >
                    <svg className='w-5 h-5 text-gray-500 dark:text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                    </svg>
                </button>
                
                <h3 className='text-2xl font-bold text-gray-900 dark:text-white'>Select Your Ride</h3>
                {hasTripInfo && (
                    <div className='flex items-center gap-4 mt-3'>
                        <div className='flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400'>
                            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' />
                            </svg>
                            <span>{fare.distance}</span>
                        </div>
                        <div className='flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400'>
                            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
                            </svg>
                            <span>{fare.duration}</span>
                        </div>
                        {hasSurge && (
                            <span className='px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-xs font-medium rounded-lg'>
                                ⚡ Surge Pricing
                            </span>
                        )}
                    </div>
                )}
            </div>
            
            {/* Vehicle Options */}
            <div className='p-6 space-y-3 max-h-[400px] overflow-y-auto'>
                {vehicles.map((vehicle) => (
                    <div 
                        key={vehicle.id}
                        onClick={() => {
                            setSelectedVehicle(vehicle.id);
                            props.selectVehicle(vehicle.id);
                            setTimeout(() => props.setConfirmRidePanel(true), 150);
                        }}
                        className={`relative flex items-center p-4 rounded-2xl cursor-pointer transition-all duration-200 ${
                            selectedVehicle === vehicle.id 
                                ? 'bg-primary-50 dark:bg-primary-900/20 border-2 border-primary-500' 
                                : 'bg-gray-50 dark:bg-gray-800 border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-700'
                        }`}
                    >
                        {vehicle.popular && (
                            <span className='absolute -top-2 right-4 px-2 py-0.5 bg-gradient-to-r from-primary-500 to-blue-500 text-white text-xs font-semibold rounded-full'>
                                Most Popular
                            </span>
                        )}
                        
                        <div className='w-20 h-14 flex items-center justify-center'>
                            <img className='w-full h-full object-contain' src={vehicle.image} alt={vehicle.name} />
                        </div>
                        
                        <div className='flex-1 ml-4'>
                            <div className='flex items-center gap-2'>
                                <h4 className='font-semibold text-gray-900 dark:text-white'>{vehicle.name}</h4>
                                <span className='flex items-center gap-1 px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded-lg text-xs'>
                                    <svg className='w-3 h-3' fill='currentColor' viewBox='0 0 20 20'>
                                        <path d='M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z'/>
                                    </svg>
                                    {vehicle.capacity}
                                </span>
                            </div>
                            <div className='flex items-center gap-3 mt-1'>
                                <span className='text-sm text-gray-600 dark:text-gray-400'>
                                    {vehicle.time} away
                                </span>
                                <span className='text-xs text-gray-500 dark:text-gray-500'>
                                    • {vehicle.description}
                                </span>
                            </div>
                        </div>
                        
                        <div className='text-right'>
                            <div className='text-xl font-bold text-gray-900 dark:text-white'>
                                ₹{vehicle.price}
                            </div>
                            {hasSurge && (
                                <p className='text-xs text-orange-600 dark:text-orange-400 mt-1'>
                                    Surge price
                                </p>
                            )}
                        </div>
                        
                        {selectedVehicle === vehicle.id && (
                            <div className='absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center'>
                                <svg className='w-4 h-4 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={3} d='M5 13l4 4L19 7' />
                                </svg>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            
            {/* Bottom Action */}
            <div className='p-6 pt-0'>
                <p className='text-xs text-center text-gray-500 dark:text-gray-400'>
                    Prices may vary based on traffic and demand
                </p>
            </div>
        </div>
    )
}

export default VehiclePanel