import { useEffect, useRef } from 'react';

export default function ChatWindow({ messages, user }) {
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    if (!messages.length) {
        return (
            <div className="messages-area" style={{ alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <div style={{ fontSize: '2.5rem' }}>💬</div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No messages yet. Be the first to say something!</p>
            </div>
        );
    }

    const formatTime = iso => new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const formatDate = iso => {
        const d = new Date(iso);
        const today = new Date();
        if (d.toDateString() === today.toDateString()) return 'Today';
        const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
        if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
        return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
    };

    // Group messages to show date dividers
    let lastDate = null;

    return (
        <div className="messages-area">
            {messages.map((msg, i) => {
                const msgDate = formatDate(msg.created_at);
                const showDate = msgDate !== lastDate;
                lastDate = msgDate;
                const isOwn = msg.user_id === user?.id;

                return (
                    <div key={msg._id || i}>
                        {showDate && (
                            <div className="date-divider">
                                <span>{msgDate}</span>
                            </div>
                        )}
                        <div className={`msg-row ${isOwn ? 'own' : ''}`}>
                            {!isOwn && (
                                <div className="msg-avatar">
                                    {msg.username?.[0]?.toUpperCase() || '?'}
                                </div>
                            )}
                            <div className="msg-bubble-wrap">
                                {!isOwn && (
                                    <div className="msg-sender-name">{msg.username}</div>
                                )}
                                <div className="msg-bubble">
                                    {msg.content}
                                    {msg.topic_tag && (
                                        <span className="topic-tag-pill">{msg.topic_tag}</span>
                                    )}
                                </div>
                                <div className="msg-meta">{formatTime(msg.created_at)}</div>
                            </div>
                        </div>
                    </div>
                );
            })}
            <div ref={bottomRef} />
        </div>
    );
}
