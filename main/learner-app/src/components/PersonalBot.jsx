import { useState, useRef, useEffect } from 'react';
import API from '../utils/api';

export default function PersonalBot() {
    const [open, setOpen] = useState(false);
    const [msgs, setMsgs] = useState([
        { role: 'ai', text: "👋 Hey! I'm your personal learning guide. Tell me what topic you want to explore and I'll point you to the right room!" }
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
                message: text, mode: 'personal'
            });
            setMsgs(m => [...m, { role: 'ai', text: data.response }]);
        } catch {
            setMsgs(m => [...m, { role: 'ai', text: "🤖 I'm having trouble connecting. Please try again!" }]);
        } finally { setLoading(false); }
    };

    const handleKey = e => { if (e.key === 'Enter') send(); };

    return (
        <>
            <button className="personal-bot-fab" onClick={() => setOpen(o => !o)} title="Personal Learning Guide">
                {open ? '✕' : '🤖'}
            </button>

            {open && (
                <div className="personal-bot-panel">
                    <div className="bot-panel-header">
                        <div className="bot-panel-title">
                            <div className="bot-status-dot" />
                            Personal Guide
                        </div>
                        <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1rem' }}>✕</button>
                    </div>

                    <div className="bot-messages">
                        {msgs.map((m, i) => (
                            <div key={i} className={`bot-msg ${m.role}`}>{m.text}</div>
                        ))}
                        {loading && <div className="bot-msg ai">🤔 Thinking...</div>}
                        <div ref={bottomRef} />
                    </div>

                    <div className="bot-input-row">
                        <input className="bot-input" placeholder="What do you want to learn?"
                            value={input} onChange={e => setInput(e.target.value)}
                            onKeyDown={handleKey} disabled={loading} />
                        <button className="bot-send" onClick={send} disabled={!input.trim() || loading}>➤</button>
                    </div>
                </div>
            )}
        </>
    );
}
