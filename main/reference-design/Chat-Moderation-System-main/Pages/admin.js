// =========================================
// ADMIN PAGE
// Manages admin panel, requests, and system settings
// =========================================

const AdminPage = {
    // Current admin user
    currentUser: null,
    // Mentor applications
    mentorRequests: [],
    // Room creation requests
    roomRequests: [],
    // System statistics
    stats: {
        totalUsers: 0,
        totalRooms: 0,
        pendingMentors: 0,
        pendingRooms: 0,
        activeSessions: 0
    },
    
    // Initialize admin page
    init: function(user) {
        this.currentUser = user;
        this.loadData();
        this.render();
        this.attachEventListeners();
    },
    
    // Load data from localStorage
    loadData: function() {
        // Load mentor requests
        const savedMentorRequests = localStorage.getItem('mentor-requests');
        this.mentorRequests = savedMentorRequests ? JSON.parse(savedMentorRequests) : this.getMockMentorRequests();
        
        // Load room requests
        const savedRoomRequests = localStorage.getItem('room-requests');
        this.roomRequests = savedRoomRequests ? JSON.parse(savedRoomRequests) : this.getMockRoomRequests();
        
        // Load stats
        this.loadStats();
    },
    
    // Load system statistics
    loadStats: function() {
        const rooms = JSON.parse(localStorage.getItem('rooms') || '[]');
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        this.stats = {
            totalUsers: users.length || 156,
            totalRooms: rooms.length || 12,
            pendingMentors: this.mentorRequests.filter(r => r.status === 'pending').length,
            pendingRooms: this.roomRequests.filter(r => r.status === 'pending').length,
            activeSessions: 43
        };
    },
    
    // Get mock mentor requests for demo
    getMockMentorRequests: function() {
        return [
            {
                id: 1,
                userName: 'Sarah Johnson',
                userEmail: 'sarah.j@example.com',
                topic: 'Advanced Machine Learning',
                proof: 'PhD in Computer Science from Stanford, 5 years as ML Engineer at Google, published 3 papers in NeurIPS.',
                status: 'pending',
                submittedAt: '2024-01-15T10:30:00Z'
            },
            {
                id: 2,
                userName: 'Michael Chen',
                userEmail: 'michael.c@example.com',
                topic: 'UI/UX Design Principles',
                proof: 'Senior Product Designer at Apple (8 years), taught design at General Assembly, portfolio: michaelchen.design',
                status: 'pending',
                submittedAt: '2024-01-14T15:45:00Z'
            },
            {
                id: 3,
                userName: 'Elena Rodriguez',
                userEmail: 'elena.r@example.com',
                topic: 'Blockchain Development',
                proof: 'Lead Blockchain Developer at Ethereum Foundation, 6 years experience, created 3 popular DeFi protocols.',
                status: 'pending',
                submittedAt: '2024-01-13T09:15:00Z'
            }
        ];
    },
    
    // Get mock room requests for demo
    getMockRoomRequests: function() {
        return [
            {
                id: 1,
                userId: 101,
                userName: 'Alex Rivera',
                title: 'React Native Workshop',
                reason: 'Need a dedicated space for React Native developers to share components, troubleshoot issues, and discuss best practices.',
                status: 'pending',
                submittedAt: '2024-01-15T14:20:00Z'
            },
            {
                id: 2,
                userId: 102,
                userName: 'Priya Patel',
                title: 'Climate Change Discussion',
                reason: 'Room for discussing climate science, sustainability practices, and environmental activism.',
                status: 'pending',
                submittedAt: '2024-01-14T11:10:00Z'
            }
        ];
    },
    
    // Render admin page
    render: function() {
        const adminView = document.getElementById('admin-view');
        if (!adminView) {
            // Create admin view if it doesn't exist
            this.createAdminView();
        }
        
        this.updateContent();
    },
    
    // Create admin view container
    createAdminView: function() {
        const main = document.querySelector('.content-viewport');
        const adminView = document.createElement('section');
        adminView.id = 'admin-view';
        adminView.className = 'view-container admin-container';
        adminView.style.display = 'none';
        main.appendChild(adminView);
    },
    
    // Update admin content
    updateContent: function() {
        const adminView = document.getElementById('admin-view');
        if (!adminView) return;
        
        adminView.innerHTML = `
            <div class="admin-header">
                <h1>Admin Dashboard</h1>
                <div class="admin-date">${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>
            
            <!-- Stats Grid -->
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon">👥</div>
                    <div class="stat-details">
                        <span class="stat-value">${this.stats.totalUsers}</span>
                        <span class="stat-label">Total Users</span>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">📚</div>
                    <div class="stat-details">
                        <span class="stat-value">${this.stats.totalRooms}</span>
                        <span class="stat-label">Active Rooms</span>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">⏳</div>
                    <div class="stat-details">
                        <span class="stat-value">${this.stats.pendingMentors}</span>
                        <span class="stat-label">Pending Mentors</span>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">📋</div>
                    <div class="stat-details">
                        <span class="stat-value">${this.stats.pendingRooms}</span>
                        <span class="stat-label">Room Requests</span>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">🟢</div>
                    <div class="stat-details">
                        <span class="stat-value">${this.stats.activeSessions}</span>
                        <span class="stat-label">Active Now</span>
                    </div>
                </div>
            </div>
            
            <!-- Admin Tabs -->
            <div class="admin-tabs-container">
                <div class="admin-tabs">
                    <button class="admin-tab active" data-admin-tab="mentors">Mentor Applications</button>
                    <button class="admin-tab" data-admin-tab="rooms">Room Requests</button>
                    <button class="admin-tab" data-admin-tab="keywords">Blocked Keywords</button>
                    <button class="admin-tab" data-admin-tab="users">User Management</button>
                    <button class="admin-tab" data-admin-tab="settings">System Settings</button>
                </div>
                
                <div class="admin-tab-content active" id="mentors-tab">
                    ${this.renderMentorRequests()}
                </div>
                
                <div class="admin-tab-content" id="rooms-tab">
                    ${this.renderRoomRequests()}
                </div>
                
                <div class="admin-tab-content" id="keywords-tab">
                    ${this.renderKeywordsManager()}
                </div>
                
                <div class="admin-tab-content" id="users-tab">
                    ${this.renderUserManagement()}
                </div>
                
                <div class="admin-tab-content" id="settings-tab">
                    ${this.renderSystemSettings()}
                </div>
            </div>
        `;
    },
    
    // Render mentor requests
    renderMentorRequests: function() {
        const pending = this.mentorRequests.filter(r => r.status === 'pending');
        
        if (pending.length === 0) {
            return '<p class="no-requests">No pending mentor applications</p>';
        }
        
        return pending.map(request => `
            <div class="request-card" data-request-id="${request.id}" data-type="mentor">
                <div class="request-header">
                    <div>
                        <span class="request-title">${request.userName}</span>
                        <span class="request-email">${request.userEmail}</span>
                    </div>
                    <span class="request-status pending">Pending Review</span>
                </div>
                <div class="request-body">
                    <div class="request-section">
                        <label>Proposed Topic:</label>
                        <div class="request-topic">${request.topic}</div>
                    </div>
                    <div class="request-section">
                        <label>Proof of Expertise:</label>
                        <div class="request-proof">${request.proof}</div>
                    </div>
                    <div class="request-meta">
                        <span>Submitted: ${new Date(request.submittedAt).toLocaleString()}</span>
                    </div>
                </div>
                <div class="request-actions">
                    <button class="btn-secondary" onclick="AdminPage.viewApplication(${request.id}, 'mentor')">View Details</button>
                    <button class="btn-success" onclick="AdminPage.approveMentor(${request.id})">Approve</button>
                    <button class="btn-danger" onclick="AdminPage.rejectMentor(${request.id})">Reject</button>
                </div>
            </div>
        `).join('');
    },
    
    // Render room requests
    renderRoomRequests: function() {
        const pending = this.roomRequests.filter(r => r.status === 'pending');
        
        if (pending.length === 0) {
            return '<p class="no-requests">No pending room requests</p>';
        }
        
        return pending.map(request => `
            <div class="request-card" data-request-id="${request.id}" data-type="room">
                <div class="request-header">
                    <div>
                        <span class="request-title">${request.title}</span>
                        <span class="request-email">by ${request.userName}</span>
                    </div>
                    <span class="request-status pending">Pending Review</span>
                </div>
                <div class="request-body">
                    <div class="request-section">
                        <label>Reason for Request:</label>
                        <div class="request-reason">${request.reason}</div>
                    </div>
                    <div class="request-meta">
                        <span>Submitted: ${new Date(request.submittedAt).toLocaleString()}</span>
                    </div>
                </div>
                <div class="request-actions">
                    <button class="btn-secondary" onclick="AdminPage.viewApplication(${request.id}, 'room')">View Details</button>
                    <button class="btn-success" onclick="AdminPage.approveRoom(${request.id})">Approve</button>
                    <button class="btn-danger" onclick="AdminPage.rejectRoom(${request.id})">Reject</button>
                </div>
            </div>
        `).join('');
    },
    
    // Render keywords manager
    renderKeywordsManager: function() {
        const keywords = window.ChatComponent?.blockedKeywords || [
            'spam', 'advertisement', 'buy now', 'discount', 'free money',
            'hate', 'violence', 'inappropriate', 'scam', 'fraud',
            'porn', 'sex', 'drugs', 'gambling', 'casino'
        ];
        
        return `
            <div class="keywords-header">
                <h3>Manage Blocked Keywords</h3>
                <p>Add or remove words that should be blocked in chat messages.</p>
            </div>
            
            <div class="add-keyword-form">
                <input type="text" id="new-keyword" placeholder="Enter new keyword to block">
                <button class="btn-primary" onclick="AdminPage.addKeyword()">Add Keyword</button>
            </div>
            
            <div class="keywords-stats">
                <span>Total Blocked: ${keywords.length}</span>
                <button class="btn-secondary" onclick="AdminPage.exportKeywords()">Export List</button>
            </div>
            
            <div class="keywords-grid">
                ${keywords.map(keyword => `
                    <div class="keyword-chip">
                        <span class="keyword-text">${keyword}</span>
                        <span class="keyword-remove" onclick="AdminPage.removeKeyword('${keyword}')">✕</span>
                    </div>
                `).join('')}
            </div>
            
            <div class="keywords-import">
                <h4>Import Keywords</h4>
                <textarea id="import-keywords" placeholder="Enter keywords separated by commas"></textarea>
                <button class="btn-secondary" onclick="AdminPage.importKeywords()">Import</button>
            </div>
        `;
    },
    
    // Render user management
    renderUserManagement: function() {
        return `
            <div class="users-header">
                <h3>User Management</h3>
                <div class="user-search">
                    <input type="text" id="user-search" placeholder="Search users...">
                    <button class="btn-primary" onclick="AdminPage.searchUsers()">Search</button>
                </div>
            </div>
            
            <div class="users-table">
                <table>
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Joined</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.renderUserRows()}
                    </tbody>
                </table>
            </div>
        `;
    },
    
    // Render user rows
    renderUserRows: function() {
        const users = [
            { id: 1, name: 'James Jason', email: 'james@example.com', role: 'user', status: 'active', joined: '2024-01-01' },
            { id: 2, name: 'Sarah Mentor', email: 'sarah@example.com', role: 'mentor', status: 'active', joined: '2024-01-02' },
            { id: 3, name: 'Admin User', email: 'admin@wele.com', role: 'admin', status: 'active', joined: '2024-01-01' },
            { id: 4, name: 'John Learner', email: 'john@example.com', role: 'user', status: 'suspended', joined: '2024-01-03' }
        ];
        
        return users.map(user => `
            <tr>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td><span class="role-badge ${user.role}">${user.role}</span></td>
                <td><span class="status-badge ${user.status}">${user.status}</span></td>
                <td>${user.joined}</td>
                <td>
                    <button class="icon-btn" onclick="AdminPage.editUser(${user.id})">✏️</button>
                    <button class="icon-btn" onclick="AdminPage.suspendUser(${user.id})">⛔</button>
                    <button class="icon-btn" onclick="AdminPage.deleteUser(${user.id})">🗑️</button>
                </td>
            </tr>
        `).join('');
    },
    
    // Render system settings
    renderSystemSettings: function() {
        return `
            <div class="settings-section">
                <h3>General Settings</h3>
                
                <div class="setting-item">
                    <label>Platform Name</label>
                    <input type="text" value="WeLe" id="platform-name">
                </div>
                
                <div class="setting-item">
                    <label>Allow Public Registrations</label>
                    <label class="toggle-switch">
                        <input type="checkbox" checked id="allow-registrations">
                        <span class="toggle-slider"></span>
                    </label>
                </div>
                
                <div class="setting-item">
                    <label>Require Email Verification</label>
                    <label class="toggle-switch">
                        <input type="checkbox" checked id="email-verification">
                        <span class="toggle-slider"></span>
                    </label>
                </div>
            </div>
            
            <div class="settings-section">
                <h3>Message Settings</h3>
                
                <div class="setting-item">
                    <label>Max Message Length</label>
                    <input type="number" value="500" id="max-message-length">
                </div>
                
                <div class="setting-item">
                    <label>Enable Profanity Filter</label>
                    <label class="toggle-switch">
                        <input type="checkbox" checked id="profanity-filter">
                        <span class="toggle-slider"></span>
                    </label>
                </div>
            </div>
            
            <div class="settings-section">
                <h3>Room Settings</h3>
                
                <div class="setting-item">
                    <label>Max Members Per Room</label>
                    <input type="number" value="50" id="max-room-members">
                </div>
                
                <div class="setting-item">
                    <label>Allow Private Rooms</label>
                    <label class="toggle-switch">
                        <input type="checkbox" checked id="allow-private-rooms">
                        <span class="toggle-slider"></span>
                    </label>
                </div>
            </div>
            
            <div class="settings-actions">
                <button class="btn-primary" onclick="AdminPage.saveSettings()">Save Settings</button>
                <button class="btn-secondary" onclick="AdminPage.resetSettings()">Reset to Default</button>
            </div>
        `;
    },
    
    // Attach event listeners
    attachEventListeners: function() {
        // Tab switching
        document.querySelectorAll('[data-admin-tab]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.target.dataset.adminTab;
                this.switchTab(tab);
            });
        });
    },
    
    // Switch admin tab
    switchTab: function(tab) {
        // Update tab buttons
        document.querySelectorAll('[data-admin-tab]').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.adminTab === tab);
        });
        
        // Update tab content
        document.querySelectorAll('.admin-tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        document.getElementById(`${tab}-tab`).classList.add('active');
    },
    
    // View application details
    viewApplication: function(id, type) {
        const request = type === 'mentor' 
            ? this.mentorRequests.find(r => r.id === id)
            : this.roomRequests.find(r => r.id === id);
        
        if (!request) return;
        
        // Show detailed view in modal
        if (window.ModalsComponent) {
            const details = type === 'mentor' 
                ? `
                    <h3>Mentor Application</h3>
                    <p><strong>Name:</strong> ${request.userName}</p>
                    <p><strong>Email:</strong> ${request.userEmail}</p>
                    <p><strong>Topic:</strong> ${request.topic}</p>
                    <p><strong>Proof:</strong> ${request.proof}</p>
                    <p><strong>Submitted:</strong> ${new Date(request.submittedAt).toLocaleString()}</p>
                `
                : `
                    <h3>Room Request</h3>
                    <p><strong>Room:</strong> ${request.title}</p>
                    <p><strong>Requested by:</strong> ${request.userName}</p>
                    <p><strong>Reason:</strong> ${request.reason}</p>
                    <p><strong>Submitted:</strong> ${new Date(request.submittedAt).toLocaleString()}</p>
                `;
            
            // Show in modal
            alert(details.replace(/<[^>]*>/g, '\n')); // Simple alert for demo
        }
    },
    
    // Approve mentor
    approveMentor: function(id) {
        const request = this.mentorRequests.find(r => r.id === id);
        if (!request) return;
        
        request.status = 'approved';
        this.saveMentorRequests();
        
        // Create mentor room
        const newRoom = {
            id: Date.now(),
            name: request.topic,
            topic: request.topic,
            type: 'public',
            createdBy: request.id,
            members: 1,
            description: `Mentor room for ${request.topic}`,
            icon: '👨‍🏫'
        };
        
        // Add to rooms
        const rooms = JSON.parse(localStorage.getItem('rooms') || '[]');
        rooms.push(newRoom);
        localStorage.setItem('rooms', JSON.stringify(rooms));
        
        NotificationsComponent.success(`Mentor application approved! Room created.`);
        this.updateContent();
    },
    
    // Reject mentor
    rejectMentor: function(id) {
        const reason = prompt('Please provide a reason for rejection:');
        if (reason === null) return;
        
        const request = this.mentorRequests.find(r => r.id === id);
        if (request) {
            request.status = 'rejected';
            request.rejectionReason = reason;
            this.saveMentorRequests();
            
            NotificationsComponent.warning(`Mentor application rejected: ${reason}`);
            this.updateContent();
        }
    },
    
    // Approve room
    approveRoom: function(id) {
        const request = this.roomRequests.find(r => r.id === id);
        if (!request) return;
        
        request.status = 'approved';
        this.saveRoomRequests();
        
        // Create room
        const newRoom = {
            id: Date.now(),
            name: request.title,
            topic: request.title,
            type: 'public',
            createdBy: request.userId,
            members: 1,
            description: request.reason
        };
        
        const rooms = JSON.parse(localStorage.getItem('rooms') || '[]');
        rooms.push(newRoom);
        localStorage.setItem('rooms', JSON.stringify(rooms));
        
        NotificationsComponent.success(`Room request approved! Room created.`);
        this.updateContent();
    },
    
    // Reject room
    rejectRoom: function(id) {
        const reason = prompt('Please provide a reason for rejection:');
        if (reason === null) return;
        
        const request = this.roomRequests.find(r => r.id === id);
        if (request) {
            request.status = 'rejected';
            request.rejectionReason = reason;
            this.saveRoomRequests();
            
            NotificationsComponent.warning(`Room request rejected: ${reason}`);
            this.updateContent();
        }
    },
    
    // Add keyword
    addKeyword: function() {
        const input = document.getElementById('new-keyword');
        const keyword = input.value.trim().toLowerCase();
        
        if (!keyword) {
            NotificationsComponent.warning('Please enter a keyword');
            return;
        }
        
        if (window.ChatComponent) {
            window.ChatComponent.addBlockedKeyword(keyword);
            NotificationsComponent.success(`Keyword "${keyword}" added`);
            input.value = '';
            this.updateContent();
        }
    },
    
    // Remove keyword
    removeKeyword: function(keyword) {
        if (confirm(`Remove keyword "${keyword}"?`)) {
            if (window.ChatComponent) {
                window.ChatComponent.removeBlockedKeyword(keyword);
                NotificationsComponent.success(`Keyword "${keyword}" removed`);
                this.updateContent();
            }
        }
    },
    
    // Export keywords
    exportKeywords: function() {
        const keywords = window.ChatComponent?.blockedKeywords || [];
        const blob = new Blob([keywords.join('\n')], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'blocked-keywords.txt';
        a.click();
    },
    
    // Import keywords
    importKeywords: function() {
        const textarea = document.getElementById('import-keywords');
        const input = textarea.value;
        
        if (!input) return;
        
        const keywords = input.split(',').map(k => k.trim().toLowerCase());
        
        if (window.ChatComponent) {
            keywords.forEach(k => {
                if (k) window.ChatComponent.addBlockedKeyword(k);
            });
            NotificationsComponent.success(`Imported ${keywords.length} keywords`);
            textarea.value = '';
            this.updateContent();
        }
    },
    
    // User management functions
    searchUsers: function() {
        const query = document.getElementById('user-search').value;
        NotificationsComponent.info(`Searching for "${query}"...`);
    },
    
    editUser: function(id) {
        NotificationsComponent.info(`Edit user ${id} (demo)`);
    },
    
    suspendUser: function(id) {
        if (confirm(`Suspend user ${id}?`)) {
            NotificationsComponent.warning(`User ${id} suspended`);
        }
    },
    
    deleteUser: function(id) {
        if (confirm(`Are you sure you want to delete user ${id}? This action cannot be undone.`)) {
            NotificationsComponent.error(`User ${id} deleted`);
        }
    },
    
    // Settings functions
    saveSettings: function() {
        NotificationsComponent.success('Settings saved successfully');
    },
    
    resetSettings: function() {
        if (confirm('Reset all settings to default?')) {
            NotificationsComponent.info('Settings reset to default');
        }
    },
    
    // Save mentor requests
    saveMentorRequests: function() {
        localStorage.setItem('mentor-requests', JSON.stringify(this.mentorRequests));
    },
    
    // Save room requests
    saveRoomRequests: function() {
        localStorage.setItem('room-requests', JSON.stringify(this.roomRequests));
    },
    
    // Show admin page
    show: function() {
        document.getElementById('auth-view').style.display = 'none';
        document.getElementById('home-view').style.display = 'none';
        document.getElementById('room-view').style.display = 'none';
        document.getElementById('admin-view').style.display = 'flex';
        this.loadData();
        this.updateContent();
        this.attachEventListeners();
    },
    
    // Hide admin page
    hide: function() {
        const adminView = document.getElementById('admin-view');
        if (adminView) adminView.style.display = 'none';
    }
};

// Export for use in other files
window.AdminPage = AdminPage;