import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

    const handleSubmit = async e => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const { data } = await API.post('/api/auth/login', form);
            login(data.token, data.user);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-logo">
                    <div className="logo-mark">
                        WeLe <span className="v-badge">v1.0</span>
                    </div>
                </div>

                <div className="auth-tabs">
                    <div className="auth-tab active">Sign In</div>
                    <div className="auth-tab" onClick={() => navigate('/register')}>Create Account</div>
                </div>

                <div style={{ marginBottom: 32 }}>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>Welcome back</h1>
                    <p style={{ color: '#64748b', marginTop: 4 }}>Continue your learning journey</p>
                </div>

                {error && <div className="error-msg" style={{ marginBottom: 20 }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">
                            <span>📧</span> Email
                        </label>
                        <input id="email" name="email" type="email" className="input"
                            placeholder="john@example.com" value={form.email}
                            onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <label htmlFor="password">
                                <span>🔒</span> Password
                            </label>
                        </div>
                        <input id="password" name="password" type="password" className="input"
                            placeholder="••••••••" value={form.password}
                            onChange={handleChange} required />
                        <div style={{ textAlign: 'right', marginTop: 8 }}>
                            <Link to="#" style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
                                Forgot password?
                            </Link>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 12, padding: '14px', fontSize: '1rem' }} disabled={loading}>
                        {loading ? 'Signing In...' : 'Sign In →'}
                    </button>
                </form>

                <div className="auth-divider">or</div>

                <button className="google-btn" type="button">
                    <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" alt="G" style={{ width: 18 }} />
                    Continue with Google
                </button>

                <div className="auth-footer" style={{ marginTop: 32 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 16 }}>
                        <span style={{ fontSize: '1.2rem' }}>📚</span>
                        <span>Want to teach? <Link to="#" style={{ textDecoration: 'none' }}>Apply as verified teacher ↗</Link></span>
                    </div>
                    <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 16 }}>
                        Already applied? <Link to="#" style={{ textDecoration: 'none' }}>Check application status →</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
