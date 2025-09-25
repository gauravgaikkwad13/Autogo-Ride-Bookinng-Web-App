import React, { createContext, useState } from 'react'

export const UserDataContext = createContext()

const defaultUser = {
    email: '',
    fullname: {
        firstname: '',
        lastname: ''
    }
}

const UserContext = ({ children }) => {
    const [ user, setUser ] = useState(defaultUser)
    const [ isLoading, setIsLoading ] = useState(true)
    const [ error, setError ] = useState(null)

    const logout = () => {
        setUser(defaultUser)
        localStorage.removeItem('token')
    }

    const value = {
        user,
        setUser,
        logout,
        isLoading,
        setIsLoading,
        error,
        setError
    }

    return (
        <div>
            <UserDataContext.Provider value={value}>
                {children}
            </UserDataContext.Provider>
        </div>
    )
}

export default UserContext