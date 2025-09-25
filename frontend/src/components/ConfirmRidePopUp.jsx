import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const ConfirmRidePopUp = (props) => {
    const [ otp, setOtp ] = useState('')
    const navigate = useNavigate()

    const submitHander = async (e) => {
        e.preventDefault()

        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/start-ride`, {
            params: {
                rideId: props.ride._id,
                otp: otp
            },
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })

        if (response.status === 200) {
            props.setConfirmRidePopupPanel(false)
            props.setRidePopupPanel(false)
            navigate('/captain-riding', { state: { ride: props.ride } })
        }


    }
    return (
        <div className='w-full max-w-md mx-auto bg-white rounded-t-3xl lg:rounded-3xl lg:max-w-lg xl:max-w-xl p-4 lg:p-6 max-h-[90vh] overflow-y-auto'>
            {/* Header */}
            <div className='flex items-center justify-between mb-4 lg:mb-6'>
                <h3 className='text-xl lg:text-2xl xl:text-3xl font-bold text-gray-800'>🔐 Enter OTP to Start</h3>
                <button 
                    onClick={() => {
                        props.setConfirmRidePopupPanel(false);
                        props.setRidePopupPanel(false);
                    }}
                    className='p-2 hover:bg-gray-100 rounded-full transition-colors'
                >
                    <i className="text-2xl lg:text-3xl text-gray-400 hover:text-gray-600 ri-close-line"></i>
                </button>
            </div>

            {/* Customer Info Card */}
            <div className='flex items-center justify-between p-4 lg:p-5 bg-gradient-to-r from-blue-400 to-blue-500 rounded-lg lg:rounded-xl shadow-lg mb-6'>
                <div className='flex items-center gap-3 lg:gap-4'>
                    <img 
                        className='h-12 lg:h-14 xl:h-16 w-12 lg:w-14 xl:w-16 rounded-full object-cover border-2 border-white' 
                        src="https://i.pinimg.com/236x/af/26/28/af26280b0ca305be47df0b799ed1b12b.jpg" 
                        alt="Customer" 
                    />
                    <div>
                        <h2 className='text-lg lg:text-xl xl:text-2xl font-bold text-white capitalize'>
                            {props.ride?.user?.fullname?.firstname}
                        </h2>
                        <p className='text-sm lg:text-base text-blue-100'>Customer</p>
                    </div>
                </div>
                <div className='text-right'>
                    <p className='text-xs lg:text-sm text-blue-100'>Distance</p>
                    <h5 className='text-lg lg:text-xl xl:text-2xl font-bold text-white'>
                        {props.ride?.distance ? `${(props.ride.distance / 1000).toFixed(1)} KM` : 'N/A'}
                    </h5>
                </div>
            </div>

            {/* Trip Summary */}
            <div className='space-y-3 lg:space-y-4 mb-6 lg:mb-8'>
                {/* Pickup */}
                <div className='flex items-center gap-4 lg:gap-5 p-3 lg:p-4 bg-gray-50 rounded-lg'>
                    <div className='bg-green-500 p-2 rounded-full'>
                        <i className="text-white text-base lg:text-lg ri-map-pin-user-fill"></i>
                    </div>
                    <div className='flex-1'>
                        <p className='text-xs lg:text-sm text-gray-500'>FROM</p>
                        <p className='text-sm lg:text-base text-gray-800 font-medium'>{props.ride?.pickup}</p>
                    </div>
                </div>

                {/* Destination */}
                <div className='flex items-center gap-4 lg:gap-5 p-3 lg:p-4 bg-gray-50 rounded-lg'>
                    <div className='bg-red-500 p-2 rounded-full'>
                        <i className="text-white text-base lg:text-lg ri-map-pin-2-fill"></i>
                    </div>
                    <div className='flex-1'>
                        <p className='text-xs lg:text-sm text-gray-500'>TO</p>
                        <p className='text-sm lg:text-base text-gray-800 font-medium'>{props.ride?.destination}</p>
                    </div>
                </div>

                {/* Fare */}
                <div className='flex items-center gap-4 lg:gap-5 p-3 lg:p-4 bg-green-50 rounded-lg'>
                    <div className='bg-green-600 p-2 rounded-full'>
                        <i className="text-white text-base lg:text-lg ri-currency-line"></i>
                    </div>
                    <div className='flex-1'>
                        <p className='text-xs lg:text-sm text-gray-500'>FARE</p>
                        <p className='text-lg lg:text-xl font-bold text-green-600'>₹{props.ride?.fare}</p>
                    </div>
                </div>
            </div>

            {/* OTP Form */}
            <form onSubmit={submitHander} className='space-y-4 lg:space-y-6'>
                <div>
                    <label className='block text-sm lg:text-base font-medium text-gray-700 mb-2 lg:mb-3'>
                        Customer will share a 6-digit OTP with you:
                    </label>
                    <input 
                        value={otp} 
                        onChange={(e) => setOtp(e.target.value)} 
                        type="text" 
                        maxLength="6"
                        className='bg-gray-100 border-2 border-gray-200 focus:border-blue-500 focus:bg-white px-4 lg:px-6 py-3 lg:py-4 font-mono text-xl lg:text-2xl text-center rounded-lg lg:rounded-xl w-full transition-all tracking-widest'
                        placeholder='000000' 
                        required
                    />
                    <p className='text-xs lg:text-sm text-gray-500 mt-2 text-center'>Ask customer for their ride OTP</p>
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4'>
                    <button 
                        type="submit"
                        className='bg-green-600 hover:bg-green-700 text-white font-bold py-3 lg:py-4 px-6 lg:px-8 text-lg lg:text-xl rounded-lg lg:rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg order-2 lg:order-1'
                    >
                        🚗 Start Trip
                    </button>
                    
                    <button 
                        type="button"
                        onClick={() => {
                            props.setConfirmRidePopupPanel(false);
                            props.setRidePopupPanel(false);
                        }} 
                        className='bg-red-500 hover:bg-red-600 text-white font-bold py-3 lg:py-4 px-6 lg:px-8 text-lg lg:text-xl rounded-lg lg:rounded-xl transition-all duration-200 transform hover:scale-105 order-1 lg:order-2'
                    >
                        ❌ Cancel
                    </button>
                </div>
            </form>
        </div>
    )
}

export default ConfirmRidePopUp