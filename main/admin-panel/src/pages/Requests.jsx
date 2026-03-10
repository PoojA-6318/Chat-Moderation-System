import { useState, useEffect } from 'react';
import api from '../utils/api';

export default function Requests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedReq, setSelectedReq] = useState(null);
    const [roomData, setRoomData] = useState({
        name: '',
        topic: '',
        description: '',
        knowledge_content: ''
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const { data } = await api.get('/requests');
            setRequests(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenApprove = (req) => {
        setSelectedReq(req);
        setRoomData({
            name: req.topic_name,
            topic: req.topic_name,
            description: req.reason,
            knowledge_content: ''
        });
    };

    const handleApprove = async () => {
        setSubmitting(true);
        try {
            // Updated: The backend now creates the room automatically when status is 'approved'
            // and we pass the room_data along with it.
            await api.put(`/requests/${selectedReq._id}`, {
                status: 'approved',
                admin_comment: 'Room approved and created by admin.',
                room_data: {
                    name: roomData.name,
                    topic: roomData.topic,
                    description: roomData.description,
                    knowledge_content: roomData.knowledge_content,
                    type: selectedReq.type,
                    password: selectedReq.password
                }
            });

            setSelectedReq(null);
            fetchRequests();
            alert('Room approved and created successfully! 🚀');
        } catch (err) {
            alert('Error approving request: ' + (err.response?.data?.message || err.message));
        } finally {
            setSubmitting(false);
        }
    };


    return (
        <div>
            <h2 style={{ marginBottom: '24px' }}>Room Requests</h2>

            <div className="card">
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Learner</th>
                                <th>Topic Requested</th>
                                <th>Reason</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map(req => (
                                <tr key={req._id}>
                                    <td>{req.username}</td>
                                    <td style={{ fontWeight: '600' }}>{req.topic_name}</td>
                                    <td style={{ color: 'var(--text-dim)', fontSize: '13px' }}>{req.reason}</td>
                                    <td>
                                        <span className={`badge badge-${req.status}`}>
                                            {req.status}
                                        </span>
                                    </td>
                                    <td>
                                        {req.status === 'pending' && (
                                            <button className="btn btn-primary" onClick={() => handleOpenApprove(req)}>
                                                Approve & Create
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {!loading && requests.length === 0 && (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-dim)' }}>
                                        No pending requests at the moment.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedReq && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3 style={{ marginBottom: '24px' }}>Approve Room Request</h3>

                        <div className="form-group">
                            <label>Room Name</label>
                            <input
                                className="input"
                                value={roomData.name}
                                onChange={e => setRoomData({ ...roomData, name: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label>Topic Tag</label>
                            <input
                                className="input"
                                value={roomData.topic}
                                onChange={e => setRoomData({ ...roomData, topic: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                className="input"
                                rows="3"
                                value={roomData.description}
                                onChange={e => setRoomData({ ...roomData, description: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label>📚 Knowledge Base Content (text for RAG)</label>
                            <textarea
                                className="input"
                                rows="10"
                                placeholder="Paste the documentation or notes here. The Room Bot will use this to answer questions..."
                                value={roomData.knowledge_content}
                                onChange={e => setRoomData({ ...roomData, knowledge_content: e.target.value })}
                            />
                            <p style={{ fontSize: '12px', color: 'var(--text-dim)', marginTop: '8px' }}>
                                This text will be chunked and embedded into the AI Service.
                            </p>
                        </div>

                        <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
                            <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setSelectedReq(null)}>Cancel</button>
                            <button className="btn btn-primary" style={{ flex: 2 }} onClick={handleApprove} disabled={submitting}>
                                {submitting ? 'Creating Room...' : 'Approve & Embed Knowledge'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
