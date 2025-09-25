import React from 'react'

const LookingForDriver = (props) => {
    return (
        <div className='w-full max-w-md mx-auto bg-white rounded-t-3xl lg:rounded-3xl lg:max-w-lg xl:max-w-xl p-4 lg:p-6 max-h-[90vh] overflow-y-auto'>
            {/* Header */}
            <div className='flex items-center justify-between mb-4 lg:mb-6'>
                <h3 className='text-xl lg:text-2xl xl:text-3xl font-bold text-gray-800'>🔍 Looking for Driver...</h3>
                <button 
                    onClick={() => props.setVehicleFound(false)}
                    className='p-2 hover:bg-gray-100 rounded-full transition-colors'
                >
                    <i className="text-2xl lg:text-3xl text-gray-400 hover:text-gray-600 ri-close-line"></i>
                </button>
            </div>

            {/* Loading Animation */}
            <div className='flex flex-col items-center mb-6 lg:mb-8'>
                <div className='relative'>
                    <img 
                        className='h-16 lg:h-20 xl:h-24 animate-pulse' 
                        src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg" 
                        alt="Searching for driver" 
                    />
                    <div className='absolute -top-2 -right-2 bg-blue-500 rounded-full p-2 animate-bounce'>
                        <i className="text-white text-sm ri-search-line"></i>
                    </div>
                </div>
                <div className='mt-4 text-center'>
                    <p className='text-base lg:text-lg font-semibold text-gray-800 mb-1'>Finding you a driver</p>
                    <p className='text-sm lg:text-base text-gray-600'>Please wait while we match you with a nearby driver</p>
                    
                    {/* Loading dots */}
                    <div className='flex justify-center mt-3 space-x-1'>
                        <div className='w-2 h-2 bg-blue-500 rounded-full animate-bounce'></div>
                        <div className='w-2 h-2 bg-blue-500 rounded-full animate-bounce' style={{animationDelay: '0.1s'}}></div>
                        <div className='w-2 h-2 bg-blue-500 rounded-full animate-bounce' style={{animationDelay: '0.2s'}}></div>
                    </div>
                </div>
            </div>

            {/* Trip Summary */}
            <div className='bg-gray-50 rounded-lg lg:rounded-xl p-4 lg:p-5 space-y-4'>
                <h4 className='text-base lg:text-lg font-semibold text-gray-800 mb-3'>📍 Your Trip</h4>
                
                {/* Pickup */}
                <div className='flex items-start gap-4 lg:gap-5 p-3 lg:p-4 bg-white rounded-lg'>
                    <div className='bg-green-500 p-2 lg:p-3 rounded-full mt-1'>
                        <i className="text-white text-sm lg:text-base ri-map-pin-user-fill"></i>
                    </div>
                    <div className='flex-1'>
                        <p className='text-xs lg:text-sm text-gray-500 mb-1'>PICKUP</p>
                        <h3 className='text-base lg:text-lg font-semibold text-gray-800'>Pickup Location</h3>
                        <p className='text-sm lg:text-base text-gray-600'>{props.pickup}</p>
                    </div>
                </div>
                
                {/* Destination */}
                <div className='flex items-start gap-4 lg:gap-5 p-3 lg:p-4 bg-white rounded-lg'>
                    <div className='bg-red-500 p-2 lg:p-3 rounded-full mt-1'>
                        <i className="text-white text-sm lg:text-base ri-map-pin-2-fill"></i>
                    </div>
                    <div className='flex-1'>
                        <p className='text-xs lg:text-sm text-gray-500 mb-1'>DESTINATION</p>
                        <h3 className='text-base lg:text-lg font-semibold text-gray-800'>Drop-off Location</h3>
                        <p className='text-sm lg:text-base text-gray-600'>{props.destination}</p>
                    </div>
                </div>
                
                {/* Fare */}
                <div className='flex items-start gap-4 lg:gap-5 p-3 lg:p-4 bg-green-50 rounded-lg border border-green-100'>
                    <div className='bg-green-600 p-2 lg:p-3 rounded-full mt-1'>
                        <i className="text-white text-sm lg:text-base ri-currency-line"></i>
                    </div>
                    <div className='flex-1'>
                        <p className='text-xs lg:text-sm text-gray-500 mb-1'>ESTIMATED FARE</p>
                        <h3 className='text-xl lg:text-2xl font-bold text-green-600'>
                            ₹{props.fare?.[props.vehicleType] || '0'}
                        </h3>
                        <p className='text-sm lg:text-base text-gray-600'>Cash Payment</p>
                    </div>
                </div>
            </div>
            
            {/* Status Message */}
            <div className='mt-4 lg:mt-6 text-center'>
                <div className='bg-blue-50 border border-blue-200 rounded-lg lg:rounded-xl p-4 lg:p-5'>
                    <div className='flex items-center justify-center gap-3 mb-2'>
                        <div className='bg-blue-500 p-2 rounded-full'>
                            <i className="text-white text-sm ri-time-line"></i>
                        </div>
                        <p className='text-sm lg:text-base font-semibold text-blue-800'>Average wait time: 2-5 minutes</p>
                    </div>
                    <p className='text-xs lg:text-sm text-blue-600'>We’re connecting you with the nearest available driver</p>
                </div>
            </div>
        </div>
    )
}

export default LookingForDriver