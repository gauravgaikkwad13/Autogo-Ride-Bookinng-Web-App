import { createContext, useState, useContext } from 'react';

export const CaptainDataContext = createContext();

const defaultCaptain = null;

const CaptainContext = ({ children }) => {
    const [ captain, setCaptain ] = useState(defaultCaptain);
    const [ isLoading, setIsLoading ] = useState(true);
    const [ error, setError ] = useState(null);

    const updateCaptain = (captainData) => {
        setCaptain(captainData);
    };

    const logout = () => {
        setCaptain(defaultCaptain);
        localStorage.removeItem('token');
    };

    const value = {
        captain,
        setCaptain,
        isLoading,
        setIsLoading,
        error,
        setError,
        updateCaptain,
        logout
    };

    return (
        <CaptainDataContext.Provider value={value}>
            {children}
        </CaptainDataContext.Provider>
    );
};

export default CaptainContext;