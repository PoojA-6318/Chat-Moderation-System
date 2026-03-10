import { useState, useEffect } from 'react';
import api from '../utils/api';

export default function Mentors() {
    const [mentors, setMentors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);

    useEffect(() => {
        fetchMentors();
    }, []);

    const fetchMentors = async () => {
        try {
            const { data } = await api.get('/admin/mentors/pending');
            setMentors(data);
        } catch (err) {
            console.error('Error fetching mentors:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (userId, status) => {
        setActionLoading(userId);
        try {
            await api.post('/admin/mentors/verify', { user_id: userId, status });
            setMentors(prev => prev.filter(m => m._id !== userId));
            alert(`Mentor application ${status} successfully!`);
        } catch (err) {
            alert('Error verifying mentor: ' + (err.response?.data?.message || err.message));
        } finally {
            setActionLoading(null);
        }
    };

    // Helper to get absolute URL for certificates
    const getFileUrl = (path) => {
        if (!path) return null;
        const baseUrl = 'http://localhost:5000'; // Adjust if your backend port is different
        return `${baseUrl}${path}`;
    };

    if (loading) return <div className="p-8">Loading applications...</div>;

    return (
        <div className="p-6">
            <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-main)' }}>Mentor Applications</h2>
                <p style={{ color: 'var(--text-dim)', marginTop: '4px' }}>Review and verify professional certificates for new mentors.</p>
            </div>

            <div className="card">
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Certificate</th>
                                <th>Applied At</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mentors.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-dim)' }}>
                                        No pending mentor applications. 🎉
                                    </td>
                                </tr>
                            ) : (
                                mentors.map(mentor => (
                                    <tr key={mentor._id}>
                                        <td style={{ fontWeight: '600' }}>{mentor.name}</td>
                                        <td>{mentor.email}</td>
                                        <td>
                                            {mentor.certificateUrl ? (
                                                <a
                                                    href={getFileUrl(mentor.certificateUrl)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="badge badge-success"
                                                    style={{ textDecoration: 'none', cursor: 'pointer', background: 'var(--primary-glow)', color: 'var(--primary)' }}
                                                >
                                                    📄 View Document
                                                </a>
                                            ) : (
                                                <span style={{ color: 'var(--danger)', fontSize: '12px' }}>Missing File</span>
                                            )}
                                        </td>
                                        <td style={{ color: 'var(--text-dim)' }}>
                                            {new Date(mentor.created_at).toLocaleDateString()}
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button
                                                    className="btn btn-primary"
                                                    style={{ padding: '6px 12px', fontSize: '12px' }}
                                                    disabled={actionLoading === mentor._id}
                                                    onClick={() => handleVerify(mentor._id, 'approved')}
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    className="btn btn-ghost"
                                                    style={{ padding: '6px 12px', fontSize: '12px', color: 'var(--danger)' }}
                                                    disabled={actionLoading === mentor._id}
                                                    onClick={() => handleVerify(mentor._id, 'rejected')}
                                                >
                                                    Reject
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
        </div>
    );
}
