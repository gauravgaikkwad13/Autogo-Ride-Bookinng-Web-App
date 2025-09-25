
import React, { useContext, useState, useEffect } from 'react'
import { CaptainDataContext } from '../context/CapatainContext'
import axios from 'axios'

const CaptainDetails = () => {

    const { captain } = useContext(CaptainDataContext)
    const [stats, setStats] = useState({
        totalEarnings: 0,
        hoursOnline: 0,
        totalTrips: 0
    })
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchCaptainStats = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/captains/stats`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                })

                if (response.status === 200) {
                    setStats(response.data.stats)
                }
            } catch (error) {
                console.error('Error fetching captain stats:', error)
                // Keep default stats if API fails
            } finally {
                setIsLoading(false)
            }
        }

        if (captain?._id) {
            fetchCaptainStats()
        }
    }, [captain])

    if (isLoading) {
        return (
            <div className="animate-pulse">
                <div className='flex items-center justify-between'>
                    <div className='flex items-center justify-start gap-3'>
                        <div className='h-10 w-10 rounded-full bg-gray-300'></div>
                        <div className='h-6 w-32 bg-gray-300 rounded'></div>
                    </div>
                    <div className='h-6 w-20 bg-gray-300 rounded'></div>
                </div>
                <div className='flex p-3 mt-8 bg-gray-100 rounded-xl justify-center gap-5 items-start'>
                    {[1, 2, 3].map((i) => (
                        <div key={i} className='text-center'>
                            <div className='h-8 w-8 bg-gray-300 rounded mx-auto mb-2'></div>
                            <div className='h-5 w-12 bg-gray-300 rounded mb-1'></div>
                            <div className='h-4 w-16 bg-gray-300 rounded'></div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div>
            <div className='flex items-center justify-between mb-6'>
                <div className='flex items-center justify-start gap-3'>
                    <img className='h-12 w-12 rounded-full object-cover border-2 border-gray-200' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdlMd7stpWUCmjpfRjUsQ72xSWikidbgaI1w&s" alt="" />
                    <div>
                        <h4 className='text-lg font-semibold capitalize'>{captain.fullname.firstname + " " + captain.fullname.lastname}</h4>
                        <p className='text-sm text-gray-500'>Captain</p>
                    </div>
                </div>
                <div className='text-right'>
                    <h4 className='text-2xl font-bold text-green-600'>₹{stats.totalEarnings.toFixed(2)}</h4>
                    <p className='text-sm text-gray-600 font-medium'>Total Earned</p>
                </div>
            </div>
            <div className='grid grid-cols-3 gap-4 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl border border-gray-100'>
                <div className='text-center'>
                    <div className='bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3'>
                        <i className="text-xl text-blue-600 ri-timer-2-line"></i>
                    </div>
                    <h5 className='text-lg font-bold text-gray-800'>{stats.hoursOnline.toFixed(1)}</h5>
                    <p className='text-xs text-gray-600 font-medium'>Hours Online</p>
                </div>
                <div className='text-center'>
                    <div className='bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3'>
                        <i className="text-xl text-green-600 ri-speed-up-line"></i>
                    </div>
                    <h5 className='text-lg font-bold text-gray-800'>{stats.totalTrips}</h5>
                    <p className='text-xs text-gray-600 font-medium'>Trips Completed</p>
                </div>
                <div className='text-center'>
                    <div className='bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3'>
                        <i className="text-xl text-purple-600 ri-star-line"></i>
                    </div>
                    <h5 className='text-lg font-bold text-gray-800'>
                        ₹{stats.totalTrips > 0 ? (stats.totalEarnings / stats.totalTrips).toFixed(0) : '0'}
                    </h5>
                    <p className='text-xs text-gray-600 font-medium'>Avg. per Trip</p>
                </div>
            </div>
        </div>
    )
}

export default CaptainDetails