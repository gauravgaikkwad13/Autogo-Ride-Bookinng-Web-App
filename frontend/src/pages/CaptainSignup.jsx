import React, { useState } from 'react'
import Logo from '../assets/DriverLogo.png';
import { Link } from 'react-router-dom'
import { CaptainDataContext } from '../context/CapatainContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const CaptainSignup = () => {

  const navigate = useNavigate()

  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ firstName, setFirstName ] = useState('')
  const [ lastName, setLastName ] = useState('')

  const [ vehicleColor, setVehicleColor ] = useState('')
  const [ vehiclePlate, setVehiclePlate ] = useState('')
  const [ vehicleCapacity, setVehicleCapacity ] = useState('')
  const [ vehicleType, setVehicleType ] = useState('')


  const { captain, setCaptain } = React.useContext(CaptainDataContext)


  const submitHandler = async (e) => {
    e.preventDefault()
    const captainData = {
      fullname: {
        firstname: firstName,
        lastname: lastName
      },
      email: email,
      password: password,
      vehicle: {
        color: vehicleColor,
        plate: vehiclePlate,
        capacity: vehicleCapacity,
        vehicleType: vehicleType
      }
    }

    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/register`, captainData)

    if (response.status === 201) {
      const data = response.data
      setCaptain(data.captain)
      localStorage.setItem('token', data.token)
      navigate('/captain-home')
    }

    setEmail('')
    setFirstName('')
    setLastName('')
    setPassword('')
    setVehicleColor('')
    setVehiclePlate('')
    setVehicleCapacity('')
    setVehicleType('')

  }
  return (
    <div className='min-h-screen bg-white'>
      <div className='container mx-auto px-4 py-8 max-w-md lg:max-w-2xl xl:max-w-3xl'>
        <div className='flex flex-col justify-between min-h-[calc(100vh-4rem)]'>
          <div>
            <div className='text-center mb-8 lg:mb-12'>
              <img 
                className='w-32 lg:w-40 mx-auto mb-4 lg:mb-4' 
                src={Logo} 
                alt="Autogo captain" 
              />
              <h1 className='text-2xl lg:text-3xl font-bold text-gray-800 mb-2'>Join as Captain</h1>
              <p className='text-gray-600 lg:text-lg'>Register your vehicle and start earning</p>
            </div>

            <form onSubmit={(e) => {
              submitHandler(e)
            }} className='space-y-6'>

              {/* Personal Information */}
              <div className='bg-gray-50 p-4 lg:p-6 rounded-lg'>
                <h3 className='text-lg lg:text-xl font-semibold mb-4 text-gray-800'>Personal Information</h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                  <div>
                    <label className='block text-sm lg:text-base font-medium mb-2 text-gray-700'>First Name</label>
                    <input
                      required
                      className='bg-white rounded-lg px-4 py-3 lg:py-4 border border-gray-200 w-full text-lg lg:text-xl placeholder:text-base lg:placeholder:text-lg focus:outline-none focus:border-blue-500 transition-all'
                      type="text"
                      placeholder='First name'
                      value={firstName}
                      onChange={(e) => {
                        setFirstName(e.target.value)
                      }}
                    />
                  </div>
                  <div>
                    <label className='block text-sm lg:text-base font-medium mb-2 text-gray-700'>Last Name</label>
                    <input
                      required
                      className='bg-white rounded-lg px-4 py-3 lg:py-4 border border-gray-200 w-full text-lg lg:text-xl placeholder:text-base lg:placeholder:text-lg focus:outline-none focus:border-blue-500 transition-all'
                      type="text"
                      placeholder='Last name'
                      value={lastName}
                      onChange={(e) => {
                        setLastName(e.target.value)
                      }}
                    />
                  </div>
                </div>
                
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm lg:text-base font-medium mb-2 text-gray-700'>Email Address</label>
                    <input
                      required
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                      }}
                      className='bg-white rounded-lg px-4 py-3 lg:py-4 border border-gray-200 w-full text-lg lg:text-xl placeholder:text-base lg:placeholder:text-lg focus:outline-none focus:border-blue-500 transition-all'
                      type="email"
                      placeholder='captain@example.com'
                    />
                  </div>
                  <div>
                    <label className='block text-sm lg:text-base font-medium mb-2 text-gray-700'>Password</label>
                    <input
                      className='bg-white rounded-lg px-4 py-3 lg:py-4 border border-gray-200 w-full text-lg lg:text-xl placeholder:text-base lg:placeholder:text-lg focus:outline-none focus:border-blue-500 transition-all'
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value)
                      }}
                      required 
                      type="password"
                      placeholder='Create password'
                    />
                  </div>
                </div>
              </div>

              {/* Vehicle Information */}
              <div className='bg-blue-50 p-4 lg:p-6 rounded-lg'>
                <h3 className='text-lg lg:text-xl font-semibold mb-4 text-gray-800'>Vehicle Information</h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                  <div>
                    <label className='block text-sm lg:text-base font-medium mb-2 text-gray-700'>Vehicle Color</label>
                    <input
                      required
                      className='bg-white rounded-lg px-4 py-3 lg:py-4 border border-gray-200 w-full text-lg lg:text-xl placeholder:text-base lg:placeholder:text-lg focus:outline-none focus:border-blue-500 transition-all'
                      type="text"
                      placeholder='e.g., Red, Blue, White'
                      value={vehicleColor}
                      onChange={(e) => {
                        setVehicleColor(e.target.value)
                      }}
                    />
                  </div>
                  <div>
                    <label className='block text-sm lg:text-base font-medium mb-2 text-gray-700'>License Plate</label>
                    <input
                      required
                      className='bg-white rounded-lg px-4 py-3 lg:py-4 border border-gray-200 w-full text-lg lg:text-xl placeholder:text-base lg:placeholder:text-lg focus:outline-none focus:border-blue-500 transition-all'
                      type="text"
                      placeholder='ABC-1234'
                      value={vehiclePlate}
                      onChange={(e) => {
                        setVehiclePlate(e.target.value)
                      }}
                    />
                  </div>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm lg:text-base font-medium mb-2 text-gray-700'>Passenger Capacity</label>
                    <input
                      required
                      className='bg-white rounded-lg px-4 py-3 lg:py-4 border border-gray-200 w-full text-lg lg:text-xl placeholder:text-base lg:placeholder:text-lg focus:outline-none focus:border-blue-500 transition-all'
                      type="number"
                      placeholder='4'
                      min="1"
                      max="8"
                      value={vehicleCapacity}
                      onChange={(e) => {
                        setVehicleCapacity(e.target.value)
                      }}
                    />
                  </div>
                  <div>
                    <label className='block text-sm lg:text-base font-medium mb-2 text-gray-700'>Vehicle Type</label>
                    <select
                      required
                      className='bg-white rounded-lg px-4 py-3 lg:py-4 border border-gray-200 w-full text-lg lg:text-xl focus:outline-none focus:border-blue-500 transition-all'
                      value={vehicleType}
                      onChange={(e) => {
                        setVehicleType(e.target.value)
                      }}
                    >
                      <option value="" disabled>Select Vehicle Type</option>
                      <option value="car">🚗 Car</option>
                      <option value="auto">🛺 Auto Rickshaw</option>
                      <option value="moto">🏍️ Motorcycle</option>
                    </select>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className='bg-[#111] hover:bg-gray-800 text-white font-semibold rounded-lg px-6 py-4 lg:py-5 w-full text-lg lg:text-xl transition-colors duration-200 transform hover:scale-[1.02]'
              >Create Captain Account</button>

            </form>
            
            <p className='text-center mt-6 text-gray-600 lg:text-lg'>
              Already have an account? 
              <Link to='/captain-login' className='text-blue-600 hover:text-blue-700 font-medium ml-1 transition-colors'>
                Login here
              </Link>
            </p>
          </div>
          
          <div className='mt-8 lg:mt-12'>
            <p className='text-xs lg:text-sm leading-relaxed text-gray-500 text-center'>
              This site is protected by reCAPTCHA and the{' '}
              <span className='underline cursor-pointer hover:text-gray-700'>Google Privacy Policy</span>
              {' '}and{' '}
              <span className='underline cursor-pointer hover:text-gray-700'>Terms of Service</span>
              {' '}apply.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CaptainSignup