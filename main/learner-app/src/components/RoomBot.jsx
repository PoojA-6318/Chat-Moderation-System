import { useState, useRef, useEffect } from 'react';
import API from '../utils/api';

export default function RoomBot({ roomId, roomTopic }) {
    const [open, setOpen] = useState(false);
    const [msgs, setMsgs] = useState([
        { role: 'ai', text: `📚 Hi! I'm the **${roomTopic}** room assistant. Ask me anything about this topic and I'll answer from our knowledge base!` }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef(null);

    useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs]);

    const send = async () => {
        const text = input.trim();
        if (!text || loading) return;
        setInput('');
        setMsgs(m => [...m, { role: 'user', text }]);
        setLoading(true);
        try {
            const aiUrl = import.meta.env.VITE_AI_SERVICE_URL || 'http://localhost:8000';
            const { data } = await API.post(`${aiUrl}/chatbot`, {
                message: text, room_id: roomId, mode: 'room', room_topic: roomTopic
            });
            setMsgs(m => [...m, { role: 'ai', text: data.response }]);
        } catch {
            setMsgs(m => [...m, { role: 'ai', text: "🤖 I can't reach the knowledge base right now. Try asking in the chat!" }]);
        } finally { setLoading(false); }
    };

    const handleKey = e => { if (e.key === 'Enter') send(); };

    return (
        <>
            <div className="room-bot-toggle" onClick={() => setOpen(o => !o)}>
                <span>📚 Room Knowledge Bot — {roomTopic}</span>
                <span>{open ? '▲' : '▼'}</span>
            </div>

            {open && (
                <div className="room-bot-panel">
                    <div className="bot-messages" style={{ maxHeight: 220 }}>
                        {msgs.map((m, i) => (
                            <div key={i} className={`bot-msg ${m.role}`}>{m.text}</div>
                        ))}
                        {loading && <div className="bot-msg ai">🤔 Searching knowledge base...</div>}
                        <div ref={bottomRef} />
                    </div>
                    <div className="bot-input-row">
                        <input className="bot-input" placeholder={`Ask about ${roomTopic}...`}
                            value={input} onChange={e => setInput(e.target.value)}
                            onKeyDown={handleKey} disabled={loading} />
                        <button className="bot-send" onClick={send} disabled={!input.trim() || loading}>➤</button>
                    </div>
                </div>
            )}
        </>
    );
}
