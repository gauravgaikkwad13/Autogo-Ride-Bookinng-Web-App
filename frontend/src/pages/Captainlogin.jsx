import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Logo from '../assets/DriverLogo.png';
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { CaptainDataContext } from '../context/CapatainContext'

const Captainlogin = () => {

  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')

  const { captain, setCaptain } = React.useContext(CaptainDataContext)
  const navigate = useNavigate()



  const submitHandler = async (e) => {
    e.preventDefault();
    const captain = {
      email: email,
      password
    }

    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/login`, captain)

    if (response.status === 200) {
      const data = response.data

      setCaptain(data.captain)
      localStorage.setItem('token', data.token)
      navigate('/captain-home')

    }

    setEmail('')
    setPassword('')
  }
  return (
    <div className='min-h-screen bg-white'>
      <div className='container mx-auto px-4 py-8 max-w-md lg:max-w-lg xl:max-w-xl'>
        <div className='flex flex-col justify-between min-h-[calc(100vh-4rem)]'>
          <div>
            <div className='text-center mb-8 lg:mb-12'>
              <img 
                className='w-32 lg:w-40 mx-auto mb-4 lg:mb-4' 
                src={Logo} 
                alt="Autogo captain" 
              />
              <h1 className='text-2xl lg:text-3xl font-bold text-gray-800 mb-2'>Captain Login</h1>
              <p className='text-gray-600 lg:text-lg'>Sign in to your captain account</p>
            </div>

            <form onSubmit={(e) => {
              submitHandler(e)
            }} className='space-y-6'>
              <div>
                <h3 className='text-lg lg:text-xl font-medium mb-3 text-gray-700'>Email Address</h3>
                <input
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                  }}
                  className='bg-[#f8f9fa] rounded-lg px-4 py-3 lg:py-4 border border-gray-200 w-full text-lg lg:text-xl placeholder:text-base lg:placeholder:text-lg focus:outline-none focus:border-blue-500 focus:bg-white transition-all'
                  type="email"
                  placeholder='captain@example.com'
                />
              </div>

              <div>
                <h3 className='text-lg lg:text-xl font-medium mb-3 text-gray-700'>Password</h3>
                <input
                  className='bg-[#f8f9fa] rounded-lg px-4 py-3 lg:py-4 border border-gray-200 w-full text-lg lg:text-xl placeholder:text-base lg:placeholder:text-lg focus:outline-none focus:border-blue-500 focus:bg-white transition-all'
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                  }}
                  required 
                  type="password"
                  placeholder='Enter your password'
                />
              </div>

              <button
                type="submit"
                className='bg-[#111] hover:bg-gray-800 text-white font-semibold rounded-lg px-6 py-3 lg:py-4 w-full text-lg lg:text-xl transition-colors duration-200 transform hover:scale-[1.02]'
              >Sign In as Captain</button>

            </form>
            
            <p className='text-center mt-6 text-gray-600 lg:text-lg'>
              Join our fleet? 
              <Link to='/captain-signup' className='text-blue-600 hover:text-blue-700 font-medium ml-1 transition-colors'>
                Register as a Captain
              </Link>
            </p>
          </div>
          
          <div className='mt-8 lg:mt-12'>
            <Link
              to='/login'
              className='bg-[#d5622d] hover:bg-orange-600 flex items-center justify-center text-white font-semibold rounded-lg px-6 py-3 lg:py-4 w-full text-lg lg:text-xl transition-colors duration-200 transform hover:scale-[1.02]'
            >Sign in as User</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Captainlogin