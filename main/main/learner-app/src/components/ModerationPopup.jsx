import { useState } from 'react';

export default function ModerationPopup({ data, onClose, onUsesuggestion }) {
    const { feedback, suggestion, reason, layer_triggered } = data;

    const layerLabels = {
        '1-pii': '🔒 Personal Info',
        '2-keyword': '🚫 Content Policy',
        '3-toxicity': '⚠️ Toxicity Detected',
        '4-topic': '🎯 Off-Topic',
        '5-llm': '🤖 AI Review',
    };

    return (
        <div className="popup-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="popup-card" role="dialog" aria-modal="true">
                <div className="popup-header">
                    <div className="popup-icon" style={{ fontSize: '2.5rem' }}>🛡️</div>
                    <div className="popup-header-text">
                        <h3 style={{ color: 'var(--primary-light)', fontWeight: 800 }}>Gentle Reminder</h3>
                        <p style={{ fontSize: '0.9rem' }}>{feedback || "We're here to help you learn in a safe environment."}</p>
                    </div>
                </div>

                <div className="popup-body">
                    {layer_triggered && (
                        <div>
                            <span className="popup-violation-badge" style={{ background: 'var(--primary-bg)', color: 'var(--primary-light)', borderColor: 'var(--primary-border)' }}>
                                {layerLabels[layer_triggered] || layer_triggered}
                            </span>
                        </div>
                    )}

                    {suggestion && (
                        <div className="popup-suggestion" style={{ borderLeft: '4px solid var(--primary)', background: 'var(--bg-hover)' }}>
                            <div className="popup-suggestion-label" style={{ color: 'var(--primary-light)', fontWeight: 700 }}>
                                ✨ We suggest this safer version:
                            </div>
                            <div className="popup-suggestion-text" style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>"{suggestion}"</div>
                        </div>
                    )}

                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginTop: 10 }}>
                        WeLe communities thrive on respect and constructive dialogue.
                        Your growth is our priority! 🎓
                    </p>
                </div>

                <div className="popup-footer">
                    {suggestion ? (
                        <button className="btn btn-primary" style={{ flex: 2 }} onClick={() => { onUsesuggestion(suggestion); onClose(); }}>
                            ✨ Use Suggestion
                        </button>
                    ) : null}
                    <button className="btn btn-ghost" style={{ flex: 1 }} onClick={onClose}>
                        Edit Message
                    </button>
                </div>
            </div>
        </div>
    );
}
