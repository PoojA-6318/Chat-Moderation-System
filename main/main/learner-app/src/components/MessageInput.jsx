import { useState, useRef, useEffect } from 'react';

export default function MessageInput({ onSend, disabled, prefill, onPrefillUsed }) {
    const [text, setText] = useState('');
    const textareaRef = useRef(null);

    // When user clicks "Use Suggestion" in popup, prefill textarea
    useEffect(() => {
        if (prefill) { setText(prefill); onPrefillUsed(); textareaRef.current?.focus(); }
    }, [prefill]);

    const send = () => {
        const trimmed = text.trim();
        if (!trimmed || disabled) return;
        onSend(trimmed);
        setText('');
    };

    const handleKey = e => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
    };

    // Auto-resize textarea
    const handleInput = e => {
        setText(e.target.value);
        e.target.style.height = 'auto';
        e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
    };

    return (
        <div className="message-input-area">
            <div className="msg-input-row">
                <div className="msg-input-wrap">
                    <textarea
                        ref={textareaRef}
                        className="msg-textarea"
                        placeholder={disabled ? "You're muted — wait for mute to expire..." : "Message this room... (Enter to send, Shift+Enter for new line)"}
                        value={text}
                        onChange={handleInput}
                        onKeyDown={handleKey}
                        disabled={disabled}
                        rows={1}
                    />
                </div>
                <button className="send-btn" onClick={send} disabled={!text.trim() || disabled} title="Send message">
                    ➤
                </button>
            </div>
            <div className="typing-hint">Press Enter to send · Shift+Enter for new line · AI validates every message 🤖</div>
        </div>
    );
}
