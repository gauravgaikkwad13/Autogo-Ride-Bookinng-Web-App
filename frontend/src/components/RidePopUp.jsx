import React from 'react'

const RidePopUp = (props) => {
    return (
        <div className='w-full max-w-md mx-auto bg-white rounded-t-3xl lg:rounded-3xl lg:max-w-lg xl:max-w-xl p-4 lg:p-6 max-h-[90vh] overflow-y-auto'>
            {/* Header with close button */}
            <div className='flex items-center justify-between mb-4 lg:mb-6'>
                <h3 className='text-xl lg:text-2xl xl:text-3xl font-bold text-gray-800'> New Ride Request!</h3>
                <button 
                    onClick={() => props.setRidePopupPanel(false)}
                    className='p-2 hover:bg-gray-100 rounded-full transition-colors'
                >
                    <i className="text-2xl lg:text-3xl text-gray-400 hover:text-gray-600 ri-close-line"></i>
                </button>
            </div>

            {/* Customer Info Card */}
            <div className='flex items-center justify-between p-4 lg:p-5 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-lg lg:rounded-xl shadow-lg mb-6'>
                <div className='flex items-center gap-3 lg:gap-4'>
                    <img 
                        className='h-12 lg:h-14 xl:h-16 w-12 lg:w-14 xl:w-16 rounded-full object-cover border-2 border-white' 
                        src="https://www.shutterstock.com/image-photo/profile-picture-smiling-successful-young-260nw-2040223583.jpg" 
                        alt="Customer" 
                    />
                    <div>
                        <h2 className='text-lg lg:text-xl xl:text-2xl font-bold text-gray-800'>
                            {props.ride?.user?.fullname?.firstname} {props.ride?.user?.fullname?.lastname}
                        </h2>
                        <p className='text-sm lg:text-base text-gray-700'>Customer</p>
                    </div>
                </div>
                <div className='text-right'>
                    <p className='text-xs lg:text-sm text-gray-700'>Distance</p>
                    <h5 className='text-lg lg:text-xl xl:text-2xl font-bold text-gray-800'>
                        {props.ride?.distance ? `${(props.ride.distance / 1000).toFixed(1)} KM` : 'N/A'}
                    </h5>
                </div>
            </div>

            {/* Trip Details */}
            <div className='space-y-4 lg:space-y-5 mb-6 lg:mb-8'>
                {/* Pickup Location */}
                <div className='flex items-start gap-4 lg:gap-5 p-4 lg:p-5 bg-gray-50 rounded-lg lg:rounded-xl'>
                    <div className='bg-green-500 p-2 lg:p-3 rounded-full'>
                        <i className="text-white text-lg lg:text-xl ri-map-pin-user-fill"></i>
                    </div>
                    <div className='flex-1'>
                        <p className='text-xs lg:text-sm text-gray-500 mb-1'>PICKUP</p>
                        <h3 className='text-lg lg:text-xl font-semibold text-gray-800'>Pickup Location</h3>
                        <p className='text-sm lg:text-base text-gray-600 mt-1'>{props.ride?.pickup}</p>
                    </div>
                </div>

                {/* Destination */}
                <div className='flex items-start gap-4 lg:gap-5 p-4 lg:p-5 bg-gray-50 rounded-lg lg:rounded-xl'>
                    <div className='bg-red-500 p-2 lg:p-3 rounded-full'>
                        <i className="text-white text-lg lg:text-xl ri-map-pin-2-fill"></i>
                    </div>
                    <div className='flex-1'>
                        <p className='text-xs lg:text-sm text-gray-500 mb-1'>DESTINATION</p>
                        <h3 className='text-lg lg:text-xl font-semibold text-gray-800'>Drop-off Location</h3>
                        <p className='text-sm lg:text-base text-gray-600 mt-1'>{props.ride?.destination}</p>
                    </div>
                </div>

                {/* Fare */}
                <div className='flex items-start gap-4 lg:gap-5 p-4 lg:p-5 bg-green-50 rounded-lg lg:rounded-xl'>
                    <div className='bg-green-600 p-2 lg:p-3 rounded-full'>
                        <i className="text-white text-lg lg:text-xl ri-currency-line"></i>
                    </div>
                    <div className='flex-1'>
                        <p className='text-xs lg:text-sm text-gray-500 mb-1'>FARE</p>
                        <h3 className='text-2xl lg:text-3xl font-bold text-green-600'>₹{props.ride?.fare}</h3>
                        <p className='text-sm lg:text-base text-gray-600 mt-1'>Cash Payment</p>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4'>
                <button 
                    onClick={() => {
                        props.setConfirmRidePopupPanel(true);
                        props.confirmRide();
                    }} 
                    className='bg-green-600 hover:bg-green-700 text-white font-bold py-3 lg:py-4 px-6 lg:px-8 text-lg lg:text-xl rounded-lg lg:rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg order-2 lg:order-1'
                >
                    ✅ Accept Ride
                </button>

                <button 
                    onClick={() => props.setRidePopupPanel(false)} 
                    className='bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-3 lg:py-4 px-6 lg:px-8 text-lg lg:text-xl rounded-lg lg:rounded-xl transition-all duration-200 transform hover:scale-105 order-1 lg:order-2'
                >
                    ❌ Decline
                </button>
            </div>
        </div>
    )
}

export default RidePopUp