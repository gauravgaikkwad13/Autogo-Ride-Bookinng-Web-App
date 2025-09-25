import React from 'react'

const WaitingForDriver = (props) => {
  return (
    <div className='w-full max-w-md mx-auto bg-white rounded-t-3xl lg:rounded-3xl lg:max-w-lg xl:max-w-xl p-4 lg:p-6 max-h-[90vh] overflow-y-auto'>
      {/* Header */}
      <div className='flex items-center justify-between mb-4 lg:mb-6'>
        <h3 className='text-xl lg:text-2xl xl:text-3xl font-bold text-gray-800'>🚗 Driver is on the way!</h3>
        <button 
          onClick={() => props.waitingForDriver(false)}
          className='p-2 hover:bg-gray-100 rounded-full transition-colors'
        >
          <i className="text-2xl lg:text-3xl text-gray-400 hover:text-gray-600 ri-close-line"></i>
        </button>
      </div>

      {/* Driver Info Card */}
      <div className='flex items-center justify-between p-4 lg:p-5 bg-gradient-to-r from-green-400 to-green-500 rounded-lg lg:rounded-xl shadow-lg mb-6'>
        <div className='flex items-center gap-3 lg:gap-4'>
          <img 
            className='h-12 lg:h-14 xl:h-16 w-12 lg:w-14 xl:w-16 rounded-lg object-cover border-2 border-white' 
            src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg" 
            alt="Vehicle" 
          />
          <div>
            <h2 className='text-lg lg:text-xl xl:text-2xl font-bold text-white capitalize'>
              {props.ride?.captain?.fullname?.firstname}
            </h2>
            <h4 className='text-base lg:text-lg xl:text-xl font-semibold text-green-100'>
              {props.ride?.captain?.vehicle?.plate}
            </h4>
            <p className='text-sm lg:text-base text-green-100'>Maruti Suzuki Alto</p>
          </div>
        </div>
        
        {/* OTP Display */}
        <div className='text-right bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-3 lg:p-4'>
          <p className='text-xs lg:text-sm text-green-100 mb-1'>Your OTP</p>
          <h1 className='text-2xl lg:text-3xl xl:text-4xl font-bold text-white font-mono tracking-wider'>
            {props.ride?.otp}
          </h1>
          <p className='text-xs lg:text-sm text-green-100 mt-1'>Share with driver</p>
        </div>
      </div>

      {/* Trip Details */}
      <div className='space-y-4 lg:space-y-5'>
        <div className='bg-blue-50 p-4 lg:p-5 rounded-lg lg:rounded-xl border border-blue-100'>
          <p className='text-sm lg:text-base text-blue-600 font-medium mb-3'>📍 Trip Details</p>
          
          {/* Pickup */}
          <div className='flex items-start gap-4 lg:gap-5 mb-4'>
            <div className='bg-green-500 p-2 lg:p-3 rounded-full mt-1'>
              <i className="text-white text-sm lg:text-base ri-map-pin-user-fill"></i>
            </div>
            <div className='flex-1'>
              <p className='text-xs lg:text-sm text-gray-500 mb-1'>PICKUP</p>
              <h3 className='text-base lg:text-lg font-semibold text-gray-800'>Pickup Location</h3>
              <p className='text-sm lg:text-base text-gray-600'>{props.ride?.pickup}</p>
            </div>
          </div>
          
          {/* Destination */}
          <div className='flex items-start gap-4 lg:gap-5 mb-4'>
            <div className='bg-red-500 p-2 lg:p-3 rounded-full mt-1'>
              <i className="text-white text-sm lg:text-base ri-map-pin-2-fill"></i>
            </div>
            <div className='flex-1'>
              <p className='text-xs lg:text-sm text-gray-500 mb-1'>DESTINATION</p>
              <h3 className='text-base lg:text-lg font-semibold text-gray-800'>Drop-off Location</h3>
              <p className='text-sm lg:text-base text-gray-600'>{props.ride?.destination}</p>
            </div>
          </div>
          
          {/* Fare */}
          <div className='flex items-start gap-4 lg:gap-5'>
            <div className='bg-green-600 p-2 lg:p-3 rounded-full mt-1'>
              <i className="text-white text-sm lg:text-base ri-currency-line"></i>
            </div>
            <div className='flex-1'>
              <p className='text-xs lg:text-sm text-gray-500 mb-1'>TOTAL FARE</p>
              <h3 className='text-xl lg:text-2xl font-bold text-green-600'>₹{props.ride?.fare}</h3>
              <p className='text-sm lg:text-base text-gray-600'>Cash Payment</p>
            </div>
          </div>
        </div>
        
        {/* Instructions */}
        <div className='bg-amber-50 border border-amber-200 rounded-lg lg:rounded-xl p-4 lg:p-5'>
          <div className='flex items-start gap-3'>
            <div className='bg-amber-500 p-2 rounded-full'>
              <i className="text-white text-sm ri-information-line"></i>
            </div>
            <div>
              <h4 className='font-semibold text-amber-800 mb-2'>Instructions:</h4>
              <ul className='text-sm lg:text-base text-amber-700 space-y-1'>
                <li>• Wait for your driver to arrive</li>
                <li>• Share the OTP: <span className='font-mono font-bold'>{props.ride?.otp}</span></li>
                <li>• Driver will confirm the OTP to start your trip</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WaitingForDriver