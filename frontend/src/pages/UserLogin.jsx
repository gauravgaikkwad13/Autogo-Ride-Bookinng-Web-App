import React, { useState, useContext } from 'react'
import Logo from '../assets/Logo.png';
import LogoDark from '../assets/LogoDark.png';
import { Link } from 'react-router-dom'
import { UserDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useTheme } from '../context/ThemeContext'
import ThemeToggle from '../components/ThemeToggle'

const UserLogin = () => {
  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ userData, setUserData ] = useState({})
  const [ isLoading, setIsLoading ] = useState(false)
  const [ showPassword, setShowPassword ] = useState(false)
  const [ rememberMe, setRememberMe ] = useState(false)

  const { user, setUser } = useContext(UserDataContext)
  const { theme } = useTheme()
  const navigate = useNavigate()



  const submitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const userData = {
      email: email,
      password: password
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/login`, userData)

      if (response.status === 200) {
        const data = response.data
        setUser(data.user)
        localStorage.setItem('token', data.token)
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', email)
        }
        navigate('/home')
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsLoading(false);
    }

    setEmail('')
    setPassword('')
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-black transition-colors duration-300'>
      {/* Background decoration */}
      <div className='absolute inset-0 overflow-hidden'>
        <div className='absolute -top-40 -right-40 w-80 h-80 bg-primary-400/20 dark:bg-primary-600/20 rounded-full blur-3xl'></div>
        <div className='absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400/20 dark:bg-blue-600/20 rounded-full blur-3xl'></div>
      </div>

      <div className='relative container mx-auto px-4 py-8 max-w-md lg:max-w-lg xl:max-w-xl'>
        {/* Theme Toggle */}
        <div className='absolute top-4 right-4'>
          <ThemeToggle />
        </div>

        <div className='flex flex-col justify-center min-h-screen'>
          <div className='bg-white dark:bg-gray-900 rounded-3xl shadow-2xl dark:shadow-dark-soft p-8 lg:p-10'>
            {/* Logo and Header */}
            <div className='text-center mb-8'>
              <Link to='/'>
                <img 
                  className='w-32 lg:w-36 mx-auto mb-6 transition-transform duration-300 hover:scale-105' 
                  src={theme === 'dark' ? Logo : LogoDark} 
                  alt="AutoGo Logo" 
                />
              </Link>
              <h1 className='text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2'>Welcome Back!</h1>
              <p className='text-gray-600 dark:text-gray-400 lg:text-lg'>Sign in to continue your journey</p>
            </div>

            <form onSubmit={submitHandler} className='space-y-5'>
              {/* Email Field */}
              <div className='space-y-2'>
                <label className='text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2'>
                  <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207' />
                  </svg>
                  Email Address
                </label>
                <input
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='input-field w-full'
                  type="email"
                  placeholder='Enter your email'
                  autoComplete='email'
                />
              </div>

              {/* Password Field */}
              <div className='space-y-2'>
                <label className='text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center justify-between'>
                  <span className='flex items-center gap-2'>
                    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' />
                    </svg>
                    Password
                  </span>
                  <Link to='/forgot-password' className='text-xs text-primary-600 dark:text-primary-400 hover:underline'>
                    Forgot?
                  </Link>
                </label>
                <div className='relative'>
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                    type={showPassword ? 'text' : 'password'}
                    className='input-field w-full pr-10'
                    placeholder='Enter your password'
                    autoComplete='current-password'
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  >
                    {showPassword ? (
                      <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21' />
                      </svg>
                    ) : (
                      <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className='flex items-center justify-between'>
                <label className='flex items-center gap-2 cursor-pointer'>
                  <input
                    type='checkbox'
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className='w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600'
                  />
                  <span className='text-sm text-gray-600 dark:text-gray-400'>Remember me</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className='btn btn-primary w-full flex items-center justify-center gap-2'
              >
                {isLoading ? (
                  <>
                    <div className='spinner w-5 h-5'></div>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M14 5l7 7m0 0l-7 7m7-7H3' />
                    </svg>
                  </>
                )}
              </button>
            </form>
            
            {/* Divider */}
            <div className='relative my-6'>
              <div className='absolute inset-0 flex items-center'>
                <div className='w-full border-t border-gray-300 dark:border-gray-700'></div>
              </div>
              <div className='relative flex justify-center text-sm'>
                <span className='px-2 bg-white dark:bg-gray-900 text-gray-500'>Or continue with</span>
              </div>
            </div>

            {/* Social Login Options */}
            <div className='grid grid-cols-2 gap-3'>
              <button className='flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors'>
                <svg className='w-5 h-5' viewBox='0 0 24 24'>
                  <path fill='#4285F4' d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'/>
                  <path fill='#34A853' d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'/>
                  <path fill='#FBBC05' d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'/>
                  <path fill='#EA4335' d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'/>
                </svg>
                <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>Google</span>
              </button>
              <button className='flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors'>
                <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
                  <path d='M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z'/>
                </svg>
                <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>Facebook</span>
              </button>
            </div>

            {/* Sign Up Link */}
            <p className='text-center mt-6 text-gray-600 dark:text-gray-400'>
              Don't have an account? 
              <Link to='/signup' className='text-primary-600 dark:text-primary-400 hover:underline font-medium ml-1'>
                Sign up for free
              </Link>
            </p>
          </div>

          {/* Captain Login Link */}
          <div className='mt-6'>
            <Link
              to='/captain-login'
              className='group flex items-center justify-center gap-2 w-full px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-2xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg'
            >
              <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
              </svg>
              <span>Sign in as Captain</span>
              <svg className='w-5 h-5 transition-transform duration-300 group-hover:translate-x-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 7l5 5m0 0l-5 5m5-5H6' />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserLogin