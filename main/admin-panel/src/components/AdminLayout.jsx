import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DarkModeToggle from './DarkModeToggle';


export default function AdminLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="sidebar-header" style={{ height: 'var(--header-h)', borderBottom: '1px solid var(--border)' }}>
                    <div className="logo-icon">W</div>
                    <h2 style={{ fontSize: '18px', fontWeight: '800', background: 'linear-gradient(135deg, var(--primary), var(--primary-light))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>WeLe Admin</h2>
                </div>

                <nav className="sidebar-nav">
                    <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <span style={{ fontSize: '1.2rem' }}>📊</span> Dashboard
                    </NavLink>
                    <NavLink to="/rooms" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <span style={{ fontSize: '1.2rem' }}>🏫</span> Rooms
                    </NavLink>
                    <NavLink to="/mentors" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <span style={{ fontSize: '1.2rem' }}>🎓</span> Mentors
                    </NavLink>
                    <NavLink to="/requests" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <span style={{ fontSize: '1.2rem' }}>📬</span> Requests
                    </NavLink>

                    <NavLink to="/boundaries" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <span style={{ fontSize: '1.2rem' }}>🛡️</span> AI Boundaries
                    </NavLink>
                    <NavLink to="/logs" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <span style={{ fontSize: '1.2rem' }}>📜</span> Violation Logs
                    </NavLink>
                </nav>

                <div style={{ padding: '24px', borderTop: '1px solid var(--border)', background: 'rgba(0,0,0,0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, var(--primary), var(--primary-light))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', color: 'white', fontSize: '14px', boxShadow: '0 4px 10px var(--primary-glow)' }}>
                            {user?.name?.[0]?.toUpperCase()}
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                            <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
                            <div style={{ fontSize: '11px', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Administrator</div>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="btn btn-ghost" style={{ width: '100%', textAlign: 'center', justifyContent: 'center', color: 'var(--danger)', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase' }}>
                        Sign Out
                    </button>
                </div>
            </aside>

            <main className="admin-main">
                <header className="admin-header">
                    <h3 id="page-title" style={{ fontSize: '18px', fontWeight: '800' }}>Dashboard</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ fontSize: '13px', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            System Status: <span style={{ color: 'var(--success)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)', display: 'inline-block' }}></span> Healthy</span>
                        </div>
                        <DarkModeToggle />
                    </div>
                </header>


                <div className="page-content">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
