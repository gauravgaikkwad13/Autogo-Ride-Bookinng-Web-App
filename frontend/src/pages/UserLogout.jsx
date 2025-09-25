import React, { useEffect, useContext, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { UserDataContext } from '../context/UserContext'

export const UserLogout = () => {
    const token = localStorage.getItem('token')
    const navigate = useNavigate()
    const { setUser } = useContext(UserDataContext)
    const [isLoggingOut, setIsLoggingOut] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const handleLogout = async () => {
            if (!token) {
                navigate('/login')
                return
            }

            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/users/logout`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

                if (response.status === 200) {
                    // Clear user context
                    setUser({
                        email: '',
                        fullName: {
                            firstName: '',
                            lastName: ''
                        }
                    })
                    
                    // Clear token from localStorage
                    localStorage.removeItem('token')
                    
                    // Navigate to login
                    navigate('/login')
                }
            } catch (error) {
                console.error('Logout error:', error)
                setError('Failed to logout properly')
                
                // Force logout anyway by clearing local storage
                localStorage.removeItem('token')
                setUser({
                    email: '',
                    fullName: {
                        firstName: '',
                        lastName: ''
                    }
                })
                navigate('/login')
            } finally {
                setIsLoggingOut(false)
            }
        }

        handleLogout()
    }, [token, navigate, setUser])

    if (isLoggingOut) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black"></div>
                    <p className="mt-4 text-lg">Logging out...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <p className="text-red-500 text-lg">{error}</p>
                    <p className="mt-2">Redirecting to login...</p>
                </div>
            </div>
        )
    }

    return null
}

export default UserLogout
