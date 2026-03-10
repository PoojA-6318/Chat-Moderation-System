import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedToken = localStorage.getItem('wele_token');
        const savedUser = localStorage.getItem('wele_user');
        if (savedToken && savedUser) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = (tokenVal, userVal) => {
        setToken(tokenVal);
        setUser(userVal);
        localStorage.setItem('wele_token', tokenVal);
        localStorage.setItem('wele_user', JSON.stringify(userVal));
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('wele_token');
        localStorage.removeItem('wele_user');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
