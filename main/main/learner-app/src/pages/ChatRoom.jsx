import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getSocket } from '../utils/socket';
import API from '../utils/api';
import RoomSidebar from '../components/RoomSidebar';
import ChatWindow from '../components/ChatWindow';
import MessageInput from '../components/MessageInput';
import ModerationPopup from '../components/ModerationPopup';
import PersonalBot from '../components/PersonalBot';
import RoomBot from '../components/RoomBot';

export default function ChatRoom() {
    const { user, token, logout } = useAuth();
    const [rooms, setRooms] = useState([]);
    const [activeRoom, setActiveRoom] = useState(null);
    const [messages, setMessages] = useState([]);
    const [popup, setPopup] = useState(null);      // { feedback, suggestion, reason, layer_triggered }
    const [mutedUntil, setMutedUntil] = useState(null);
    const [prefill, setPrefill] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [loadingMsgs, setLoadingMsgs] = useState(false);

    // ── Load rooms ─────────────────────────────────────────────────────────────
    useEffect(() => {
        API.get('/api/rooms').then(r => setRooms(r.data)).catch(console.error);
    }, []);

    // ── Socket setup ───────────────────────────────────────────────────────────
    useEffect(() => {
        const socket = getSocket(token);

        socket.on('new_message', msg => {
            setMessages(prev => [...prev, msg]);
        });

        socket.on('message_blocked', data => {
            setPopup(data);
        });

        socket.on('muted_warning', ({ until }) => {
            setMutedUntil(new Date(until));
        });

        return () => {
            socket.off('new_message');
            socket.off('message_blocked');
            socket.off('muted_warning');
        };
    }, [token]);

    // ── Join room ───────────────────────────────────────────────────────────────
    const selectRoom = useCallback(async (room) => {
        setActiveRoom(room);
        setMessages([]);
        setLoadingMsgs(true);

        const socket = getSocket(token);
        socket.emit('join_room', { room_id: room._id });

        try {
            const { data } = await API.get(`/api/rooms/${room._id}/messages`);
            setMessages(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoadingMsgs(false);
        }
    }, [token]);

    // ── Send message ────────────────────────────────────────────────────────────
    const sendMessage = useCallback((content) => {
        if (!activeRoom) return;
        const socket = getSocket(token);
        socket.emit('send_message', {
            content,
            room_id: activeRoom._id,
            token
        });
    }, [activeRoom, token]);

    const isMuted = mutedUntil && new Date() < mutedUntil;

    return (
        <div className="app-shell">
            <RoomSidebar
                rooms={rooms}
                activeRoom={activeRoom}
                onSelectRoom={selectRoom}
                user={user}
                onLogout={logout}
                sidebarOpen={sidebarOpen}
                onCloseSidebar={() => setSidebarOpen(false)}
            />

            <div className="main-content">

                {activeRoom ? (
                    <>
                        {/* Header */}
                        <div className="chat-header">
                            <div className="chat-header-left">
                                <button className="menu-toggle-btn" onClick={() => setSidebarOpen(true)} aria-label="Open sidebar">☰</button>
                                <div>
                                    <h2>{activeRoom.name}</h2>
                                    <div style={{ display: 'flex', gap: 6, marginTop: 2 }}>
                                        <span className="header-topic-badge">{activeRoom.topic}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="header-actions">
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>🤖 AI-Moderated</span>
                            </div>
                        </div>

                        {/* Room Knowledge Bot (collapsible) */}
                        <RoomBot roomId={activeRoom._id} roomTopic={activeRoom.topic} />

                        {/* Muted banner */}
                        {isMuted && (
                            <div className="muted-banner">
                                ⏳ You are muted until {mutedUntil.toLocaleTimeString()}. Please reflect on community guidelines.
                            </div>
                        )}

                        {/* Messages */}
                        {loadingMsgs
                            ? <div className="messages-area" style={{ alignItems: 'center', justifyContent: 'center' }}><span className="spinner" style={{ width: 32, height: 32 }} /></div>
                            : <ChatWindow messages={messages} user={user} />
                        }

                        {/* Message Input */}
                        <MessageInput
                            onSend={sendMessage}
                            disabled={isMuted}
                            prefill={prefill}
                            onPrefillUsed={() => setPrefill('')}
                        />
                    </>
                ) : (
                    /* Home / No Room Selected */
                    <>
                        <div className="chat-header">
                            <div className="chat-header-left">
                                <button className="menu-toggle-btn" onClick={() => setSidebarOpen(true)} aria-label="Open sidebar">☰</button>
                                <h2 style={{ fontSize: '1rem' }}>Welcome to WeLe 🎓</h2>
                            </div>
                        </div>
                        <div className="home-page">
                            <div className="home-icon">🎓</div>
                            <h1>Welcome, {user?.name?.split(' ')[0]}!</h1>
                            <p>Select a learning room from the sidebar to start chatting. Every message is AI-moderated to keep conversations on-topic and respectful. 🚀</p>
                            {rooms.length > 0 && (
                                <div className="home-rooms-grid">
                                    {rooms.slice(0, 6).map((room, i) => (
                                        <div key={room._id} className="home-room-card" onClick={() => selectRoom(room)}>
                                            <div className="room-emoji">{'💻🐍🌐📱🔐🤖☁️📊🎮⚙️'.split('')[i * 2] || '💡'}</div>
                                            <div className="room-card-name">{room.name}</div>
                                            <div className="room-card-topic">{room.topic}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>

            {/* Moderation Popup */}
            {popup && (
                <ModerationPopup
                    data={popup}
                    onClose={() => setPopup(null)}
                    onUsesuggestion={text => { setPrefill(text); setPopup(null); }}
                />
            )}

            {/* Personal Learning Bot (floating) */}
            <PersonalBot />
        </div>
    );
}
