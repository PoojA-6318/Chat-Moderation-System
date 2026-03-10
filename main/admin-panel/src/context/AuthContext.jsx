import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedToken = localStorage.getItem('wele_admin_token');
        const savedUser = localStorage.getItem('wele_admin_user');
        if (savedToken && savedUser) {
            const parsedUser = JSON.parse(savedUser);
            if (parsedUser.role === 'admin') {
                setToken(savedToken);
                setUser(parsedUser);
            } else {
                localStorage.removeItem('wele_admin_token');
                localStorage.removeItem('wele_admin_user');
            }
        }
        setLoading(false);
    }, []);

    const login = (tokenVal, userVal) => {
        if (userVal.role !== 'admin') {
            throw new Error('Access denied. Admin role required.');
        }
        setToken(tokenVal);
        setUser(userVal);
        localStorage.setItem('wele_admin_token', tokenVal);
        localStorage.setItem('wele_admin_user', JSON.stringify(userVal));
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('wele_admin_token');
        localStorage.removeItem('wele_admin_user');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
