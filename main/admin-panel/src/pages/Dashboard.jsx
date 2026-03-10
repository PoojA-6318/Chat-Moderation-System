import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../utils/api';

export default function Dashboard() {
    const [stats, setStats] = useState({
        totalRooms: 0,
        totalUsers: 0,
        pendingRequests: 0,
        totalViolations: 0,
        violationData: []
    });

    useEffect(() => {
        // Mock data for now, would be fetched from /api/admin/stats
        setStats({
            totalRooms: 8,
            totalUsers: 154,
            pendingRequests: 3,
            totalViolations: 42,
            violationData: [
                { name: 'Mon', count: 4 },
                { name: 'Tue', count: 7 },
                { name: 'Wed', count: 5 },
                { name: 'Thu', count: 12 },
                { name: 'Fri', count: 8 },
                { name: 'Sat', count: 3 },
                { name: 'Sun', count: 3 },
            ]
        });
    }, []);

    return (
        <div>
            <div className="stats-grid">
                <div className="card stat-card">
                    <h4>Total Rooms</h4>
                    <div className="value">{stats.totalRooms}</div>
                    <div className="trend trend-up">↑ 2 new this week</div>
                </div>
                <div className="card stat-card">
                    <h4>Total Users</h4>
                    <div className="value">{stats.totalUsers}</div>
                    <div className="trend trend-up">↑ 12% from last month</div>
                </div>
                <div className="card stat-card">
                    <h4>Pending Requests</h4>
                    <div className="value" style={{ color: 'var(--warning)' }}>{stats.pendingRequests}</div>
                    <div className="trend">Requires your attention</div>
                </div>
                <div className="card stat-card">
                    <h4>AI Interventions</h4>
                    <div className="value">{stats.totalViolations}</div>
                    <div className="trend trend-down">↓ 5% safer today</div>
                </div>
            </div>

            <div className="card">
                <h3 style={{ marginBottom: '24px', fontSize: '18px' }}>Weekly Moderation Activity</h3>
                <div style={{ height: '300px', width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stats.violationData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                            <XAxis dataKey="name" stroke="var(--text-dim)" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="var(--text-dim)" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip
                                contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-main)' }}
                                itemStyle={{ color: 'var(--primary-light)' }}
                                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                            />
                            <Bar dataKey="count" fill="var(--primary)" radius={[6, 6, 0, 0]} barSize={42} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
