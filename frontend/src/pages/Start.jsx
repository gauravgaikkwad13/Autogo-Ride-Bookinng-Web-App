
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Logo from '../assets/Logo.png';
import LogoDark from '../assets/LogoDark.png';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';

const Start = () => {
  const { theme } = useTheme();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-black overflow-hidden'>
      {/* Animated Background Elements */}
      <div className='absolute inset-0 overflow-hidden'>
        <div className='absolute top-1/4 left-1/4 w-96 h-96 bg-primary-400/20 dark:bg-primary-600/20 rounded-full blur-3xl animate-pulse-slow'></div>
        <div className='absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-400/20 dark:bg-blue-600/20 rounded-full blur-3xl animate-pulse-slow' style={{animationDelay: '2s'}}></div>
        <div className='absolute top-3/4 left-3/4 w-64 h-64 bg-purple-400/20 dark:bg-purple-600/20 rounded-full blur-3xl animate-pulse-slow' style={{animationDelay: '4s'}}></div>
      </div>

      {/* Main Content */}
      <div className='relative min-h-screen flex flex-col'>
        {/* Header */}
        <header className='relative z-20 px-6 py-6 lg:px-12 lg:py-8'>
          <div className='flex justify-between items-center max-w-7xl mx-auto'>
            <img 
              className='w-32 lg:w-36 transition-transform duration-300 hover:scale-105' 
              src={theme === 'dark' ? Logo : LogoDark}
              alt="AutoGo Logo" 
              style={{transform: `translateY(${scrollY * 0.3}px)`}}
            />
            <ThemeToggle />
          </div>
        </header>

        {/* Hero Section */}
        <main className='flex-1 flex items-center justify-center px-6 py-12'>
          <div className='max-w-4xl mx-auto text-center'>
            {/* Main Content Card */}
            <div className='bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-3xl shadow-2xl dark:shadow-dark-soft p-8 lg:p-12 transform transition-all duration-500 hover:scale-[1.01]'>
              {/* Badge */}
              <div className='inline-flex items-center gap-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-4 py-2 rounded-full text-sm font-semibold mb-6 animate-fade-in'>
                <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
                  <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z'/>
                </svg>
                Premium Ride Experience
              </div>

              {/* Heading */}
              <h1 className='text-4xl lg:text-6xl font-bold mb-6 animate-slide-up'>
                <span className='gradient-text'>Welcome to AutoGo</span>
              </h1>

              {/* Subheading */}
              <p className='text-xl lg:text-2xl text-gray-600 dark:text-gray-300 mb-8 animate-slide-up' style={{animationDelay: '0.1s'}}>
                Experience seamless transportation at your fingertips
              </p>

              {/* Features Grid */}
              <div className='grid grid-cols-3 gap-4 mb-10 animate-fade-in' style={{animationDelay: '0.2s'}}>
                <div className='text-center p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50'>
                  <div className='text-2xl lg:text-3xl font-bold text-primary-600 dark:text-primary-400'>5M+</div>
                  <div className='text-sm text-gray-600 dark:text-gray-400'>Happy Riders</div>
                </div>
                <div className='text-center p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50'>
                  <div className='text-2xl lg:text-3xl font-bold text-primary-600 dark:text-primary-400'>24/7</div>
                  <div className='text-sm text-gray-600 dark:text-gray-400'>Available</div>
                </div>
                <div className='text-center p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50'>
                  <div className='text-2xl lg:text-3xl font-bold text-primary-600 dark:text-primary-400'>4.9★</div>
                  <div className='text-sm text-gray-600 dark:text-gray-400'>Rating</div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className='space-y-4 animate-slide-up' style={{animationDelay: '0.3s'}}>
                <Link 
                  to='/login' 
                  className='group relative inline-flex items-center justify-center w-full max-w-md mx-auto bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-700 hover:to-blue-700 text-white py-4 px-8 text-lg font-semibold rounded-2xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl'
                >
                  <span className='relative z-10'>Get Started</span>
                  <svg className='w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 7l5 5m0 0l-5 5m5-5H6' />
                  </svg>
                </Link>

                <Link 
                  to='/captain-login' 
                  className='inline-flex items-center justify-center w-full max-w-md mx-auto bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 py-4 px-8 text-lg font-semibold rounded-2xl transition-all duration-300 transform hover:scale-[1.02] shadow-md'
                >
                  <svg className='w-5 h-5 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
                  </svg>
                  Drive with AutoGo
                </Link>
              </div>

              {/* Footer Text */}
              <div className='mt-8 text-sm text-gray-500 dark:text-gray-400 animate-fade-in' style={{animationDelay: '0.4s'}}>
                <p>By continuing, you agree to our 
                  <span className='text-primary-600 dark:text-primary-400 hover:underline cursor-pointer'> Terms of Service</span> & 
                  <span className='text-primary-600 dark:text-primary-400 hover:underline cursor-pointer'> Privacy Policy</span>
                </p>
              </div>
            </div>

            {/* Bottom Features */}
            <div className='mt-8 flex flex-wrap justify-center gap-6 text-sm text-gray-600 dark:text-gray-400 animate-fade-in' style={{animationDelay: '0.5s'}}>
              <div className='flex items-center gap-2'>
                <svg className='w-5 h-5 text-green-500' fill='currentColor' viewBox='0 0 20 20'>
                  <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
                </svg>
                Safe & Secure
              </div>
              <div className='flex items-center gap-2'>
                <svg className='w-5 h-5 text-blue-500' fill='currentColor' viewBox='0 0 20 20'>
                  <path d='M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z' />
                </svg>
                24/7 Support
              </div>
              <div className='flex items-center gap-2'>
                <svg className='w-5 h-5 text-purple-500' fill='currentColor' viewBox='0 0 20 20'>
                  <path fillRule='evenodd' d='M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z' clipRule='evenodd' />
                </svg>
                Fast Booking
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Start