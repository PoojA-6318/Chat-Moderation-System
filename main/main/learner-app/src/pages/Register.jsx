import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';

export default function Register() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '', role: 'learner' });
    const [certificate, setCertificate] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    const handleFileChange = e => setCertificate(e.target.files[0]);

    const handleSubmit = async e => {
        e.preventDefault();
        setError('');
        if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
        if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return; }
        if (form.role === 'mentor' && !certificate) { setError('Please upload your teaching certificate.'); return; }

        setLoading(true);
        const formData = new FormData();
        formData.append('firstName', form.firstName);
        formData.append('lastName', form.lastName);
        formData.append('email', form.email);
        formData.append('password', form.password);
        formData.append('role', form.role);
        if (certificate) formData.append('certificate', certificate);

        try {
            const { data } = await API.post('/api/auth/register', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            login(data.token, data.user);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed.');
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
                    <div className="auth-tab" onClick={() => navigate('/login')}>Sign In</div>
                    <div className="auth-tab active">Create Account</div>
                </div>

                <div style={{ marginBottom: 32 }}>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>Create account</h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>Join focused learning communities</p>
                </div>

                {error && <div className="error-msg" style={{ marginBottom: 20 }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group" style={{ marginBottom: 20 }}>
                        <label>🎯 Join as</label>
                        <div className="auth-tabs" style={{ marginTop: 8, height: '40px' }}>
                            <div
                                className={`auth-tab ${form.role === 'learner' ? 'active' : ''}`}
                                style={{ flex: 1, fontSize: '0.9rem' }}
                                onClick={() => setForm(f => ({ ...f, role: 'learner' }))}
                            >
                                Learner
                            </div>
                            <div
                                className={`auth-tab ${form.role === 'mentor' ? 'active' : ''}`}
                                style={{ flex: 1, fontSize: '0.9rem' }}
                                onClick={() => setForm(f => ({ ...f, role: 'mentor' }))}
                            >
                                Mentor
                            </div>
                        </div>
                    </div>

                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="firstName">👤 First name</label>
                            <input id="firstName" name="firstName" type="text" className="input"
                                placeholder="John" value={form.firstName}
                                onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="lastName">👤 Last name</label>
                            <input id="lastName" name="lastName" type="text" className="input"
                                placeholder="Doe" value={form.lastName}
                                onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">📧 Email</label>
                        <input id="email" name="email" type="email" className="input"
                            placeholder="john@example.com" value={form.email}
                            onChange={handleChange} required />
                    </div>

                    <div className="form-grid">
                        <div className="form-group" style={{ position: 'relative' }}>
                            <label htmlFor="password">🔒 Password</label>
                            <input id="password" name="password" type="password" className="input"
                                placeholder="••••••••" value={form.password}
                                onChange={handleChange} required minLength={6} />
                        </div>
                        <div className="form-group" style={{ position: 'relative' }}>
                            <label htmlFor="confirmPassword">🔒 Confirm</label>
                            <input id="confirmPassword" name="confirmPassword" type="password" className="input"
                                placeholder="••••••••" value={form.confirmPassword}
                                onChange={handleChange} required minLength={6} />
                        </div>
                    </div>

                    {form.role === 'mentor' && (
                        <div className="form-group" style={{ marginBottom: 20 }}>
                            <label htmlFor="certificate">📜 Teaching Certificate (PDF/Image)</label>
                            <input id="certificate" type="file" className="input"
                                style={{ paddingTop: 8 }}
                                onChange={handleFileChange} required accept=".pdf,image/*" />
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
                                * Application will be reviewed by admin within 24 hours.
                            </p>
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 24 }}>
                        <input type="checkbox" required style={{ marginTop: 4, width: 16, height: 16, accentColor: 'var(--primary)' }} />
                        <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                            I agree to the <Link to="#" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Terms</Link> and <Link to="#" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Privacy Policy</Link>
                        </label>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px', fontSize: '1rem' }} disabled={loading}>
                        {loading ? 'Processing...' : form.role === 'mentor' ? 'Application Submission →' : 'Create account →'}
                    </button>
                </form>

                <div className="auth-footer">
                    <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16, color: 'var(--text-secondary)' }}>
                        Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Sign In here →</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
