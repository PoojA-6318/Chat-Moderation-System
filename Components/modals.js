// =========================================
// MODALS COMPONENT
// Manages all modal dialogs
// =========================================

const ModalsComponent = {
    // Currently open modal
    currentModal: null,
    
    // Initialize modals
    init: function() {
        this.attachEventListeners();
    },
    
    // Attach global modal event listeners
    attachEventListeners: function() {
        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeAll();
            }
        });
        
        // Close modal with Escape key
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.currentModal) {
                this.closeAll();
            }
        });
    },
    
    // Show request room modal
    showRequestRoomModal: function() {
        const modal = document.getElementById('request-room-modal');
        if (!modal) return;
        
        // Set form content
        const content = modal.querySelector('.modal-content');
        if (content) {
            content.innerHTML = `
                <div class="modal-header">
                    <h2>Request New Public Room</h2>
                    <button class="close-btn" onclick="ModalsComponent.closeAll()">×</button>
                </div>
                <form id="request-room-form">
                    <div class="form-group">
                        <label>Room Title</label>
                        <input type="text" id="request-room-title" placeholder="e.g., Machine Learning Basics" required>
                    </div>
                    <div class="form-group">
                        <label>Why is this room needed?</label>
                        <textarea id="request-room-reason" placeholder="Explain why this room would be valuable..." rows="4" required></textarea>
                    </div>
                    <div class="modal-actions">
                        <button type="button" class="btn-secondary" onclick="ModalsComponent.closeAll()">Cancel</button>
                        <button type="submit" class="btn-primary">Submit Request</button>
                    </div>
                </form>
            `;
        }
        
        // Attach form submit handler
        const form = document.getElementById('request-room-form');
        if (form) {
            form.onsubmit = (e) => {
                e.preventDefault();
                this.handleRequestRoomSubmit();
            };
        }
        
        this.openModal(modal);
    },
    
    // Handle request room form submit
    handleRequestRoomSubmit: function() {
        const title = document.getElementById('request-room-title')?.value;
        const reason = document.getElementById('request-room-reason')?.value;
        
        if (title && reason) {
            // In real app, send to API
            NotificationsComponent.show('Room request submitted! Admin will review it soon.', 'success');
            this.closeAll();
        }
    },
    
    // Show create private room modal
    showCreatePrivateRoomModal: function() {
        const modal = document.getElementById('private-room-modal');
        if (!modal) return;
        
        const content = modal.querySelector('.modal-content');
        if (content) {
            content.innerHTML = `
                <div class="modal-header">
                    <h2>Create Private Team</h2>
                    <button class="close-btn" onclick="ModalsComponent.closeAll()">×</button>
                </div>
                <form id="private-room-form">
                    <div class="form-group">
                        <label>Team/Room Name</label>
                        <input type="text" id="private-room-name" placeholder="e.g., Study Buddies" required>
                    </div>
                    <div class="form-group">
                        <label>Topic</label>
                        <input type="text" id="private-room-topic" placeholder="e.g., React.js Study Group" required>
                    </div>
                    <button type="submit" class="btn-primary">Create & Generate Link</button>
                </form>
                
                <div id="invite-link-container" class="invite-link hidden">
                    <h3>Share this link with your team:</h3>
                    <div class="link-box">
                        <input type="text" id="invite-link" readonly>
                        <button onclick="ModalsComponent.copyInviteLink()">Copy</button>
                    </div>
                </div>
            `;
        }
        
        // Attach form submit handler
        const form = document.getElementById('private-room-form');
        if (form) {
            form.onsubmit = (e) => {
                e.preventDefault();
                this.handleCreatePrivateRoom();
            };
        }
        
        this.openModal(modal);
    },
    
    // Handle create private room
    handleCreatePrivateRoom: function() {
        const roomName = document.getElementById('private-room-name')?.value;
        const roomTopic = document.getElementById('private-room-topic')?.value;
        
        if (roomName && roomTopic) {
            const inviteLink = this.generateInviteLink();
            
            // Show invite link
            const linkContainer = document.getElementById('invite-link-container');
            const linkInput = document.getElementById('invite-link');
            if (linkContainer && linkInput) {
                linkInput.value = inviteLink;
                linkContainer.classList.remove('hidden');
            }
            
            // Add room to sidebar
            const newRoom = {
                id: Date.now(),
                name: roomName,
                topic: roomTopic,
                type: 'private',
                createdBy: window.App?.getCurrentUser()?.id || 1,
                members: 1
            };
            
            if (window.SidebarComponent) {
                window.SidebarComponent.addRoom(newRoom, 'JOINED ROOMS');
            }
            
            NotificationsComponent.show('Private room created successfully!', 'success');
        }
    },
    
    // Generate random invite link
    generateInviteLink: function() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let link = 'https://wele.com/join/';
        for (let i = 0; i < 10; i++) {
            link += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return link;
    },
    
    // Copy invite link to clipboard
    copyInviteLink: function() {
        const linkInput = document.getElementById('invite-link');
        if (linkInput) {
            linkInput.select();
            document.execCommand('copy');
            NotificationsComponent.show('Invite link copied to clipboard!', 'success');
        }
    },
    
    // Show mentor application modal
    showMentorApplicationModal: function() {
        const modal = document.getElementById('mentor-application-modal');
        if (!modal) return;
        
        const content = modal.querySelector('.modal-content');
        if (content) {
            content.innerHTML = `
                <div class="modal-header">
                    <h2>Apply as Mentor</h2>
                    <button class="close-btn" onclick="ModalsComponent.closeAll()">×</button>
                </div>
                <form id="mentor-application-form">
                    <div class="form-group">
                        <label>Proposed Room Topic</label>
                        <input type="text" id="mentor-topic" placeholder="e.g., Advanced Machine Learning" required>
                    </div>
                    <div class="form-group">
                        <label>Proof of Expertise</label>
                        <textarea id="mentor-proof" placeholder="Share your qualifications, experience, portfolio links..." rows="4" required></textarea>
                        <small>Provide evidence of your expertise in this topic</small>
                    </div>
                    <div class="info-message">
                        ⏰ You will be notified within 24 hours about your mentor application.
                    </div>
                    <div class="modal-actions">
                        <button type="button" class="btn-secondary" onclick="ModalsComponent.closeAll()">Cancel</button>
                        <button type="submit" class="btn-primary">Submit Application</button>
                    </div>
                </form>
            `;
        }
        
        // Attach form submit handler
        const form = document.getElementById('mentor-application-form');
        if (form) {
            form.onsubmit = (e) => {
                e.preventDefault();
                this.handleMentorApplication();
            };
        }
        
        this.openModal(modal);
    },
    
    // Handle mentor application submit
    handleMentorApplication: function() {
        const topic = document.getElementById('mentor-topic')?.value;
        const proof = document.getElementById('mentor-proof')?.value;
        
        if (topic && proof) {
            // In real app, send to API
            NotificationsComponent.show('Mentor application submitted! You will be notified within 24 hours.', 'success');
            this.closeAll();
        }
    },
    
    // Show admin panel modal
    showAdminPanel: function() {
        const user = window.App?.getCurrentUser();
        if (user?.role !== 'admin') {
            NotificationsComponent.show('Access denied. Admin only.', 'error');
            return;
        }
        
        const modal = document.getElementById('admin-modal');
        if (!modal) return;
        
        const content = modal.querySelector('.modal-content');
        if (content) {
            content.innerHTML = `
                <div class="modal-header">
                    <h2>Admin Panel</h2>
                    <button class="close-btn" onclick="ModalsComponent.closeAll()">×</button>
                </div>
                
                <div class="admin-tabs">
                    <button class="admin-tab active" onclick="ModalsComponent.switchAdminTab('requests')">Mentor Requests</button>
                    <button class="admin-tab" onclick="ModalsComponent.switchAdminTab('room-requests')">Room Requests</button>
                    <button class="admin-tab" onclick="ModalsComponent.switchAdminTab('keywords')">Blocked Keywords</button>
                    <button class="admin-tab" onclick="ModalsComponent.switchAdminTab('create-room')">Create Room</button>
                </div>

                <div id="mentor-requests-tab" class="admin-tab-content active">
                    <h3>Pending Mentor Applications</h3>
                    <div class="requests-list" id="mentor-requests">
                        ${this.renderMockMentorRequests()}
                    </div>
                </div>

                <div id="room-requests-tab" class="admin-tab-content">
                    <h3>Room Creation Requests</h3>
                    <div class="requests-list" id="room-requests">
                        ${this.renderMockRoomRequests()}
                    </div>
                </div>

                <div id="keywords-tab" class="admin-tab-content">
                    <h3>Manage Blocked Keywords</h3>
                    <div class="add-keyword">
                        <input type="text" id="new-keyword" placeholder="Enter new keyword to block">
                        <button onclick="ModalsComponent.addKeyword()" class="btn-primary">Add</button>
                    </div>
                    <div class="keywords-list" id="keywords-list">
                        ${this.renderKeywordsList()}
                    </div>
                </div>

                <div id="create-room-tab" class="admin-tab-content">
                    <h3>Create New Public Room</h3>
                    <form id="admin-create-room-form">
                        <div class="form-group">
                            <label>Room Title</label>
                            <input type="text" id="new-room-title" placeholder="e.g., Advanced JavaScript" required>
                        </div>
                        <div class="form-group">
                            <label>Topic/Discussion Focus</label>
                            <input type="text" id="new-room-topic" placeholder="e.g., Modern JavaScript Features" required>
                        </div>
                        <div class="form-group">
                            <label>Description</label>
                            <textarea id="new-room-description" placeholder="Describe what this room is about..." rows="3"></textarea>
                        </div>
                        <button type="submit" class="btn-primary">Create Room</button>
                    </form>
                </div>
            `;
        }
        
        // Attach form submit handler
        const form = document.getElementById('admin-create-room-form');
        if (form) {
            form.onsubmit = (e) => {
                e.preventDefault();
                this.handleAdminCreateRoom();
            };
        }
        
        this.openModal(modal);
    },
    
    // Render mock mentor requests for demo
    renderMockMentorRequests: function() {
        return `
            <div class="request-card">
                <div class="request-header">
                    <span class="request-title">Sarah Johnson</span>
                    <span class="request-status">Pending</span>
                </div>
                <div class="request-detail"><strong>Topic:</strong> Advanced Machine Learning</div>
                <div class="request-detail"><strong>Proof:</strong> PhD in Computer Science, 5 years industry experience...</div>
                <div class="request-detail"><small>Submitted: 2 hours ago</small></div>
                <div class="request-actions">
                    <button class="btn-secondary" onclick="ModalsComponent.openReviewModal('mentor', 1)">Review</button>
                </div>
            </div>
            <div class="request-card">
                <div class="request-header">
                    <span class="request-title">Michael Chen</span>
                    <span class="request-status">Pending</span>
                </div>
                <div class="request-detail"><strong>Topic:</strong> UI/UX Design Principles</div>
                <div class="request-detail"><strong>Proof:</strong> Senior Designer at Google, 8 years experience...</div>
                <div class="request-detail"><small>Submitted: 5 hours ago</small></div>
                <div class="request-actions">
                    <button class="btn-secondary" onclick="ModalsComponent.openReviewModal('mentor', 2)">Review</button>
                </div>
            </div>
        `;
    },
    
    // Render mock room requests for demo
    renderMockRoomRequests: function() {
        return `
            <div class="request-card">
                <div class="request-header">
                    <span class="request-title">React Native Workshop</span>
                    <span class="request-status">Pending</span>
                </div>
                <div class="request-detail"><strong>Requested by:</strong> Alex Rivera</div>
                <div class="request-detail"><strong>Reason:</strong> Need a space to discuss React Native development and share resources...</div>
                <div class="request-detail"><small>Submitted: 1 day ago</small></div>
                <div class="request-actions">
                    <button class="btn-secondary" onclick="ModalsComponent.openReviewModal('room', 1)">Review</button>
                </div>
            </div>
        `;
    },
    
    // Render keywords list
    renderKeywordsList: function() {
        const keywords = window.ChatComponent?.blockedKeywords || [
            'spam', 'advertisement', 'buy now', 'discount', 'free money',
            'hate', 'violence', 'inappropriate', 'scam', 'fraud'
        ];
        
        return keywords.map(keyword => `
            <div class="keyword-item">
                <span class="keyword-text">${keyword}</span>
                <span class="delete-keyword" onclick="ModalsComponent.deleteKeyword('${keyword}')">🗑️</span>
            </div>
        `).join('');
    },
    
    // Switch admin tab
    switchAdminTab: function(tab) {
        document.querySelectorAll('.admin-tab').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.admin-tab-content').forEach(content => content.classList.remove('active'));
        
        if (tab === 'requests') {
            document.querySelectorAll('.admin-tab')[0].classList.add('active');
            document.getElementById('mentor-requests-tab').classList.add('active');
        } else if (tab === 'room-requests') {
            document.querySelectorAll('.admin-tab')[1].classList.add('active');
            document.getElementById('room-requests-tab').classList.add('active');
        } else if (tab === 'keywords') {
            document.querySelectorAll('.admin-tab')[2].classList.add('active');
            document.getElementById('keywords-tab').classList.add('active');
        } else {
            document.querySelectorAll('.admin-tab')[3].classList.add('active');
            document.getElementById('create-room-tab').classList.add('active');
        }
    },
    
    // Open review modal
    openReviewModal: function(type, id) {
        const modal = document.getElementById('review-modal');
        if (!modal) return;
        
        const content = modal.querySelector('.modal-content');
        if (content) {
            content.innerHTML = `
                <div class="modal-header">
                    <h2>${type === 'mentor' ? 'Review Mentor Application' : 'Review Room Request'}</h2>
                    <button class="close-btn" onclick="ModalsComponent.closeAll()">×</button>
                </div>
                <div class="application-details">
                    ${type === 'mentor' ? 
                        '<p><strong>Applicant:</strong> Sarah Johnson</p><p><strong>Topic:</strong> Advanced Machine Learning</p>' : 
                        '<p><strong>Requested by:</strong> Alex Rivera</p><p><strong>Room:</strong> React Native Workshop</p>'}
                </div>
                <form id="review-form">
                    <div class="form-group">
                        <label>Comments/Feedback</label>
                        <textarea id="review-comments" placeholder="Provide feedback..." rows="4" required></textarea>
                    </div>
                    <div class="modal-actions">
                        <button type="button" class="btn-secondary" onclick="ModalsComponent.closeAll()">Cancel</button>
                        <button type="button" class="btn-danger" onclick="ModalsComponent.submitReview('reject')">Reject</button>
                        <button type="button" class="btn-success" onclick="ModalsComponent.submitReview('approve')">Approve</button>
                    </div>
                </form>
            `;
        }
        
        this.openModal(modal);
    },
    
    // Submit review
    submitReview: function(action) {
        const comments = document.getElementById('review-comments')?.value;
        if (!comments) {
            NotificationsComponent.show('Please provide comments', 'error');
            return;
        }
        
        NotificationsComponent.show(`Application ${action === 'approve' ? 'approved' : 'rejected'}!`, 'success');
        this.closeAll();
    },
    
    // Add keyword
    addKeyword: function() {
        const input = document.getElementById('new-keyword');
        const keyword = input.value.trim().toLowerCase();
        
        if (keyword) {
            if (window.ChatComponent) {
                window.ChatComponent.addBlockedKeyword(keyword);
            }
            NotificationsComponent.show(`Keyword "${keyword}" added`, 'success');
            input.value = '';
            this.refreshKeywordsList();
        }
    },
    
    // Delete keyword
    deleteKeyword: function(keyword) {
        if (confirm(`Delete keyword "${keyword}"?`)) {
            if (window.ChatComponent) {
                window.ChatComponent.removeBlockedKeyword(keyword);
            }
            NotificationsComponent.show(`Keyword "${keyword}" deleted`, 'success');
            this.refreshKeywordsList();
        }
    },
    
    // Refresh keywords list in admin panel
    refreshKeywordsList: function() {
        const keywordsList = document.getElementById('keywords-list');
        if (keywordsList) {
            keywordsList.innerHTML = this.renderKeywordsList();
        }
    },
    
    // Handle admin create room
    handleAdminCreateRoom: function() {
        const title = document.getElementById('new-room-title')?.value;
        const topic = document.getElementById('new-room-topic')?.value;
        
        if (title && topic) {
            NotificationsComponent.show(`Public room "${title}" created!`, 'success');
            this.closeAll();
        }
    },
    
    // Open modal
    openModal: function(modal) {
        this.closeAll();
        modal.classList.remove('hidden');
        this.currentModal = modal;
        document.body.style.overflow = 'hidden';
    },
    
    // Close all modals
    closeAll: function() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.add('hidden');
        });
        this.currentModal = null;
        document.body.style.overflow = '';
    }
};

// Export for use in other files
window.ModalsComponent = ModalsComponent;