import { useState, useEffect } from 'react';
import api from '../utils/api';

export default function Boundaries() {
    const [boundaries, setBoundaries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchBoundaries(); }, []);

    const fetchBoundaries = async () => {
        try {
            const { data } = await api.get('/boundaries');
            setBoundaries(data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const toggleBoundary = async (id, currentStatus) => {
        try {
            await api.put(`/boundaries/${id}/toggle`);
            fetchBoundaries();
        } catch (err) { alert('Error toggling boundary'); }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2>AI Moderation Boundaries</h2>
                <button className="btn btn-primary">Add New Rule</button>
            </div>

            <div className="card">
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Category</th>
                                <th>Focus</th>
                                <th>Status</th>
                                <th>Keywords/Patterns</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {boundaries.map(b => (
                                <tr key={b._id}>
                                    <td style={{ fontWeight: '700', textTransform: 'uppercase', fontSize: '13px' }}>{b.category}</td>
                                    <td style={{ color: 'var(--text-dim)', fontSize: '13px', maxWidth: '200px' }}>{b.feedback_msg}</td>
                                    <td>
                                        <span className={`badge ${b.is_enabled ? 'badge-success' : 'badge-danger'}`}>
                                            {b.is_enabled ? 'Active' : 'Disabled'}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                            {b.keywords.slice(0, 5).map((k, i) => (
                                                <span key={i} style={{ padding: '2px 6px', background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: '4px', fontSize: '11px' }}>{k}</span>
                                            ))}
                                            {b.keywords.length > 5 && <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>+{b.keywords.length - 5} more</span>}
                                            {b.patterns.length > 0 && <span style={{ fontSize: '11px', color: 'var(--accent)' }}>{b.patterns.length} Regex</span>}
                                        </div>
                                    </td>
                                    <td>
                                        <button className="btn btn-ghost" style={{ color: b.is_enabled ? 'var(--danger)' : 'var(--success)' }} onClick={() => toggleBoundary(b._id, b.is_enabled)}>
                                            {b.is_enabled ? 'Disable' : 'Enable'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="card" style={{ background: 'var(--accent-dim)', borderColor: 'var(--accent)' }}>
                <h4 style={{ color: 'var(--accent)', marginBottom: '8px' }}>💡 Pro Tip</h4>
                <p style={{ fontSize: '14px', color: 'var(--text-dim)' }}>
                    Changes to boundaries are synced to the Redis cache instantly. If you add a new keyword, it will be blocked in the chat within milliseconds across all active rooms.
                </p>
            </div>
        </div>
    );
}
