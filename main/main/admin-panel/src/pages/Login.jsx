import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const { data } = await api.post('/auth/login', { email, password });
            login(data.token, data.user);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-main)' }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '40px' }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{ width: '48px', height: '48px', background: 'var(--accent)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyCenter: 'center', margin: '0 auto 16px', fontWeight: 'bold', fontSize: '20px', color: 'white' }}>W</div>
                    <h2 style={{ fontSize: '24px', fontWeight: '700' }}>Admin Login</h2>
                    <p style={{ color: 'var(--text-dim)', fontSize: '14px', marginTop: '8px' }}>Manage the WeLe learner community</p>
                </div>

                {error && (
                    <div style={{ background: 'rgba(218, 54, 51, 0.1)', border: '1px solid var(--danger)', color: '#f85149', padding: '12px', borderRadius: '8px', fontSize: '13px', marginBottom: '20px' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Admin Email</label>
                        <input
                            type="email"
                            className="input"
                            placeholder="vrtkaarthik6@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            className="input"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px', height: '44px' }} disabled={loading}>
                        {loading ? 'Authenticating...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
}
