import { useState, useEffect } from 'react';
import api from '../utils/api';

export default function Rooms() {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingRoom, setEditingRoom] = useState(null);
    const [knowledge, setKnowledge] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => { fetchRooms(); }, []);

    const fetchRooms = async () => {
        try {
            const { data } = await api.get('/admin/rooms/all');
            setRooms(data);
        } catch (err) { console.error('Error fetching rooms:', err); }
        finally { setLoading(false); }
    };

    const handleOpenKnowledge = (room) => {
        setEditingRoom(room);
        setKnowledge('');
    };

    const handleUpdateKnowledge = async () => {
        setSaving(true);
        try {
            await api.post(`/rooms/${editingRoom._id}/knowledge`, {
                knowledge_content: knowledge
            });
            setEditingRoom(null);
            alert('Knowledge base updated and embedded successfully! 📚');
        } catch (err) {
            alert('Error updating knowledge: ' + (err.response?.data?.message || err.message));
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteRoom = async (roomId) => {
        if (!window.confirm('Are you sure you want to delete this room? This cannot be undone.')) return;
        try {
            await api.delete(`/rooms/${roomId}`);
            setRooms(prev => prev.filter(r => r._id !== roomId));
            alert('Room deleted successfully.');
        } catch (err) {
            alert('Error deleting room: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleApproveRoom = async (roomId) => {
        try {
            // Reusing requests endpoint logic or directly updating room
            await api.put(`/rooms/${roomId}/approve`); // Need to check if this exists or use requests
            setRooms(prev => prev.map(r => r._id === roomId ? { ...r, is_approved: true } : r));
            alert('Room approved successfully!');
        } catch (err) {
            alert('Error approving room: ' + (err.response?.data?.message || err.message));
        }
    };

    if (loading) return <div className="p-8">Loading rooms...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '800' }}>Manage Rooms</h2>
                <p style={{ color: 'var(--text-dim)' }}>Manage all public and private communities across the platform.</p>
            </div>

            <div className="card">
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Name / Topic</th>
                                <th>Type</th>
                                <th>Status</th>
                                <th>Owner</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rooms.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-dim)' }}>
                                        No rooms found.
                                    </td>
                                </tr>
                            ) : (
                                rooms.map(room => (
                                    <tr key={room._id}>
                                        <td>
                                            <div style={{ fontWeight: '700', color: 'var(--text-main)' }}>{room.name}</div>
                                            <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>{room.topic}</div>
                                        </td>
                                        <td>
                                            <span className={`badge ${room.type === 'private' ? 'badge-warning' : 'badge-success'}`}>
                                                {room.type === 'private' ? '🔐 Private' : '🌍 Public'}
                                            </span>
                                        </td>
                                        <td>
                                            {room.is_approved ? (
                                                <span style={{ color: 'var(--success)', fontWeight: '700', fontSize: '13px' }}>✅ Approved</span>
                                            ) : (
                                                <span style={{ color: 'var(--warning)', fontWeight: '700', fontSize: '13px' }}>⏳ Pending</span>
                                            )}
                                        </td>
                                        <td>
                                            <div style={{ fontSize: '13px' }}>{room.created_by?.name || 'System'}</div>
                                            <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>ID: {room._id.slice(-6)}</div>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                {!room.is_approved && room.type === 'public' && (
                                                    <button className="btn btn-primary" style={{ padding: '6px 10px', fontSize: '12px' }} onClick={() => handleApproveRoom(room._id)}>
                                                        Approve
                                                    </button>
                                                )}
                                                <button className="btn btn-ghost" style={{ padding: '6px 10px', fontSize: '12px' }} onClick={() => handleOpenKnowledge(room)}>
                                                    Knowledge
                                                </button>
                                                <button className="btn btn-ghost" style={{ padding: '6px 10px', fontSize: '12px', color: 'var(--danger)' }} onClick={() => handleDeleteRoom(room._id)}>
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {editingRoom && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Update Knowledge: {editingRoom.name}</h3>
                        <p style={{ color: 'var(--text-dim)', fontSize: '13px', margin: '8px 0 20px' }}>
                            Updating this content will re-run the AI embedding process for this room.
                        </p>

                        <div className="form-group">
                            <label>Knowledge Content</label>
                            <textarea
                                className="input"
                                rows="10"
                                placeholder="Paste documentation or notes here..."
                                value={knowledge}
                                onChange={e => setKnowledge(e.target.value)}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
                            <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setEditingRoom(null)}>Cancel</button>
                            <button className="btn btn-primary" style={{ flex: 2 }} onClick={handleUpdateKnowledge} disabled={saving || !knowledge.trim()}>
                                {saving ? 'Syncing...' : 'Update & Embed'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

