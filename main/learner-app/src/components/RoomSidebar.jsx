import { useState } from 'react';
import API from '../utils/api';
import DarkModeToggle from './DarkModeToggle';

const ROOM_EMOJIS = ['💻', '🐍', '🌐', '📱', '🔐', '🤖', '☁️', '📊', '🎮', '⚙️'];

export default function RoomSidebar({ rooms, activeRoom, onSelectRoom, user, onLogout, sidebarOpen, onCloseSidebar }) {
    const [showRequest, setShowRequest] = useState(false);
    const [showJoinPrivate, setShowJoinPrivate] = useState(false);
    const [reqForm, setReqForm] = useState({ topic_name: '', reason: '', type: 'public', password: '' });
    const [joinForm, setJoinForm] = useState({ room_id: '', password: '' });
    const [reqLoading, setReqLoading] = useState(false);
    const [reqSuccess, setReqSuccess] = useState(false);
    const [joinError, setJoinError] = useState('');

    const submitRequest = async e => {
        e.preventDefault();
        setReqLoading(true);
        try {
            await API.post('/api/requests', reqForm);
            setReqSuccess(true);
            setTimeout(() => {
                setShowRequest(false);
                setReqSuccess(false);
                setReqForm({ topic_name: '', reason: '', type: 'public', password: '' });
            }, 2000);
        } catch { /* silent */ } finally { setReqLoading(false); }
    };

    const handleJoinPrivate = async e => {
        e.preventDefault();
        setJoinError('');
        try {
            const { data } = await API.post('/api/rooms/join-private', joinForm);
            onSelectRoom(data.room);
            setShowJoinPrivate(false);
            setJoinForm({ room_id: '', password: '' });
            onCloseSidebar();
        } catch (err) {
            setJoinError(err.response?.data?.message || 'Failed to join private room');
        }
    };

    return (
        <>
            {/* Mobile overlay */}
            <div className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`} onClick={onCloseSidebar} />

            <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <div className="sidebar-logo">
                        <div className="logo-sm" style={{
                            background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
                            boxShadow: '0 4px 12px var(--primary-glow)',
                            borderRadius: '10px'
                        }}>W</div>
                        <span style={{ fontWeight: 800, background: 'linear-gradient(135deg, var(--primary), var(--primary-light))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>WeLe</span>
                    </div>
                    <DarkModeToggle />
                </div>


                <div className="sidebar-section-title">Learning Rooms</div>

                <div className="room-list">
                    {rooms.map((room, i) => (
                        <div key={room._id}
                            className={`room-item ${activeRoom?._id === room._id ? 'active' : ''}`}
                            onClick={() => { onSelectRoom(room); onCloseSidebar(); }}>
                            <div className="room-icon">
                                {ROOM_EMOJIS[i % ROOM_EMOJIS.length]}
                            </div>
                            <div style={{ flex: 1, overflow: 'hidden' }}>
                                <div className="room-name">{room.name} {room.type === 'private' && '🔒'}</div>
                                <div className="room-topic">{room.topic}</div>
                            </div>
                        </div>
                    ))}

                    {rooms.length === 0 && (
                        <div style={{ padding: '16px 12px', color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center' }}>
                            No public rooms yet. Join a private one or request a new topic! 🏫
                        </div>
                    )}
                </div>

                <div style={{ padding: '8px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <button className="btn btn-primary" style={{ width: '100%', fontSize: '0.82rem', padding: '10px' }}
                        onClick={() => setShowJoinPrivate(true)}>
                        🔑 Join Private Room
                    </button>
                    <button className="btn btn-ghost" style={{ width: '100%', fontSize: '0.82rem', padding: '10px' }}
                        onClick={() => setShowRequest(true)}>
                        + Request a Room
                    </button>
                </div>

                <div className="sidebar-bottom">
                    <div className="user-chip">
                        <div className="user-avatar">{user?.name?.[0]?.toUpperCase() || 'U'}</div>
                        <div className="user-info">
                            <div className="name">{user?.name}</div>
                            <div className="role">{user?.role} {user?.mentorStatus === 'approved' && '✅'}</div>
                        </div>
                    </div>
                    <button className="btn btn-ghost" style={{ width: '100%', fontSize: '0.82rem' }}
                        onClick={onLogout}>
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Request Room Modal */}
            {showRequest && (
                <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowRequest(false)}>
                    <div className="modal-card">
                        <div className="modal-header">
                            <h3>📬 Request a Room</h3>
                            <button className="modal-close" onClick={() => setShowRequest(false)}>✕</button>
                        </div>

                        {reqSuccess ? (
                            <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--success)', fontSize: '0.95rem' }}>
                                ✅ Request submitted! Admin will review it soon.
                            </div>
                        ) : (
                            <form onSubmit={submitRequest} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                <div className="form-group">
                                    <label>Community Type</label>
                                    <div className="auth-tabs" style={{ marginTop: 8, height: '36px', background: 'var(--bg-hover)' }}>
                                        <div
                                            className={`auth-tab ${reqForm.type === 'public' ? 'active' : ''}`}
                                            style={{ flex: 1, fontSize: '0.8rem' }}
                                            onClick={() => setReqForm(f => ({ ...f, type: 'public' }))}
                                        >
                                            🌍 Public
                                        </div>
                                        <div
                                            className={`auth-tab ${reqForm.type === 'private' ? 'active' : ''}`}
                                            style={{ flex: 1, fontSize: '0.8rem' }}
                                            onClick={() => setReqForm(f => ({ ...f, type: 'private' }))}
                                        >
                                            🔐 Private
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Topic Name *</label>
                                    <input className="input" placeholder="e.g. React Native Development"
                                        value={reqForm.topic_name} required
                                        onChange={e => setReqForm(f => ({ ...f, topic_name: e.target.value }))} />
                                </div>

                                {reqForm.type === 'private' && (
                                    <div className="form-group">
                                        <label>Private Password *</label>
                                        <input className="input" type="password" placeholder="Set a room password"
                                            value={reqForm.password} required={reqForm.type === 'private'}
                                            onChange={e => setReqForm(f => ({ ...f, password: e.target.value }))} />
                                    </div>
                                )}

                                <div className="form-group">
                                    <label>Reason / Description</label>
                                    <textarea className="input" rows={2} style={{ resize: 'vertical' }}
                                        placeholder="Briefly explain the goal of this room..."
                                        value={reqForm.reason}
                                        onChange={e => setReqForm(f => ({ ...f, reason: e.target.value }))} />
                                </div>

                                <button type="submit" className="btn btn-primary" disabled={reqLoading}>
                                    {reqLoading ? 'Submitting...' : 'Submit Request'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}

            {/* Join Private Room Modal */}
            {showJoinPrivate && (
                <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowJoinPrivate(false)}>
                    <div className="modal-card">
                        <div className="modal-header">
                            <h3>🔑 Join Private Team</h3>
                            <button className="modal-close" onClick={() => setShowJoinPrivate(false)}>✕</button>
                        </div>

                        {joinError && <div className="error-msg" style={{ marginBottom: 16 }}>{joinError}</div>}

                        <form onSubmit={handleJoinPrivate} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            <div className="form-group">
                                <label>Room ID *</label>
                                <input className="input" placeholder="Enter Room ID"
                                    value={joinForm.room_id} required
                                    onChange={e => setJoinForm(f => ({ ...f, room_id: e.target.value }))} />
                            </div>
                            <div className="form-group">
                                <label>Password *</label>
                                <input className="input" type="password" placeholder="Enter Password"
                                    value={joinForm.password} required
                                    onChange={e => setJoinForm(f => ({ ...f, password: e.target.value }))} />
                            </div>
                            <button type="submit" className="btn btn-primary">
                                Join Room →
                            </button>
                        </form>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 12, textAlign: 'center' }}>
                            Room IDs are provided by the room creator.
                        </p>
                    </div>
                </div>
            )}
        </>
    );
}
