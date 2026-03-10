// =========================================
// DASHBOARD PAGE
// Manages home view, room listings, and quick actions
// =========================================

const DashboardPage = {
    // Current user
    currentUser: null,
    // Available rooms
    rooms: [],
    
    // Initialize dashboard
    init: function(user) {
        this.currentUser = user;
        this.loadRooms();
        this.render();
        this.attachEventListeners();
    },
    
    // Load rooms from storage or use defaults
    loadRooms: function() {
        // Try to load from localStorage
        const savedRooms = localStorage.getItem('rooms');
        
        if (savedRooms) {
            this.rooms = JSON.parse(savedRooms);
        } else {
            // Default rooms
            this.rooms = [
                {
                    id: 1,
                    name: 'Design Strategy',
                    topic: 'UI/UX Design Principles and Strategy',
                    type: 'public',
                    members: 15,
                    createdBy: 2,
                    description: 'Learn and discuss UI/UX design principles, user research, and design thinking.',
                    icon: '🎨'
                },
                {
                    id: 2,
                    name: 'Web Dev Hub',
                    topic: 'Modern Web Development',
                    type: 'public',
                    members: 23,
                    createdBy: 2,
                    description: 'Everything about modern web development - React, Vue, Node.js, and more.',
                    icon: '💻'
                },
                {
                    id: 3,
                    name: 'UX Research',
                    topic: 'User Research Methods',
                    type: 'public',
                    members: 8,
                    createdBy: 2,
                    description: 'Discuss user research methodologies, usability testing, and research tools.',
                    icon: '🔍'
                },
                {
                    id: 4,
                    name: 'Data Science',
                    topic: 'Data Science & Analytics',
                    type: 'public',
                    members: 12,
                    createdBy: 2,
                    description: 'Explore data science, machine learning, and statistical analysis.',
                    icon: '📊'
                }
            ];
        }
    },
    
    // Render dashboard
    render: function() {
        const homeView = document.getElementById('home-view');
        if (!homeView) return;
        
        const userName = this.currentUser?.name || 'Guest';
        const userRole = this.currentUser?.role || 'user';
        
        homeView.innerHTML = `
            <div class="hero-wrapper">
                <span class="hero-badge">Welcome back, <strong>${userName}</strong></span>
                <h1 class="hero-title">Grow your skills <span>together</span></h1>
                <p class="hero-subtitle">Join rooms based on your interests, learn from mentors, and collaborate with peers.</p>
            </div>

            <!-- Quick Actions -->
            <div class="quick-actions" id="quick-actions">
                <button class="action-btn" id="request-room-btn">
                    <span>🚀</span> Request New Room
                </button>
                
                <button class="action-btn" id="create-private-btn">
                    <span>🔒</span> Create Private Team
                </button>

                ${userRole === 'user' ? `
                    <button class="action-btn" id="apply-mentor-btn">
                        <span>👨‍🏫</span> Apply as Mentor
                    </button>
                ` : ''}

                ${userRole === 'mentor' ? `
                    <button class="action-btn mentor-action" id="manage-mentor-btn">
                        <span>👨‍🏫</span> Manage Mentor Room
                    </button>
                ` : ''}

                ${userRole === 'admin' ? `
                    <button class="action-btn admin-action" id="admin-panel-btn">
                        <span>⚙️</span> Admin Panel
                    </button>
                ` : ''}
            </div>

            <!-- Rooms Grid -->
            <div class="rooms-grid">
                <h2>🔥 Popular Public Rooms</h2>
                <div class="room-cards" id="public-rooms">
                    ${this.renderPublicRooms()}
                </div>

                <h2>📌 Your Rooms</h2>
                <div class="room-cards" id="your-rooms">
                    ${this.renderUserRooms()}
                </div>
                
                <h2>⭐ Recommended for You</h2>
                <div class="room-cards" id="recommended-rooms">
                    ${this.renderRecommendedRooms()}
                </div>
            </div>
        `;
    },
    
    // Render public rooms
    renderPublicRooms: function() {
        const publicRooms = this.rooms.filter(room => room.type === 'public');
        
        if (publicRooms.length === 0) {
            return '<p class="no-rooms">No public rooms available</p>';
        }
        
        return publicRooms.map(room => this.createRoomCard(room)).join('');
    },
    
    // Render user's rooms
    renderUserRooms: function() {
        const userRooms = this.rooms.filter(room => 
            room.createdBy === this.currentUser?.id || 
            room.members?.includes(this.currentUser?.id)
        );
        
        if (userRooms.length === 0) {
            return '<p class="no-rooms">You haven\'t joined any rooms yet</p>';
        }
        
        return userRooms.map(room => this.createRoomCard(room)).join('');
    },
    
    // Render recommended rooms
    renderRecommendedRooms: function() {
        // Simple recommendation - rooms with most members
        const recommended = [...this.rooms]
            .sort((a, b) => (b.members || 0) - (a.members || 0))
            .slice(0, 3);
        
        return recommended.map(room => this.createRoomCard(room)).join('');
    },
    
    // Create room card HTML
    createRoomCard: function(room) {
        return `
            <div class="room-card" data-room-id="${room.id}">
                <div class="room-card-header">
                    <span class="room-type ${room.type}">
                        ${room.type === 'public' ? '🌐 Public' : '🔒 Private'}
                    </span>
                    <span class="member-count">👥 ${room.members || 1}</span>
                </div>
                <h3>${room.icon || '#'} ${room.name}</h3>
                <div class="room-topic">${room.topic}</div>
                <div class="room-meta">
                    <span>${room.description || 'Join the discussion!'}</span>
                </div>
                <button class="join-btn" onclick="DashboardPage.joinRoom(${room.id})">Join Room</button>
            </div>
        `;
    },
    
    // Attach event listeners
    attachEventListeners: function() {
        // Request room button
        document.getElementById('request-room-btn')?.addEventListener('click', () => {
            if (window.ModalsComponent) {
                window.ModalsComponent.showRequestRoomModal();
            }
        });
        
        // Create private room button
        document.getElementById('create-private-btn')?.addEventListener('click', () => {
            if (window.ModalsComponent) {
                window.ModalsComponent.showCreatePrivateRoomModal();
            }
        });
        
        // Apply as mentor button
        document.getElementById('apply-mentor-btn')?.addEventListener('click', () => {
            if (window.ModalsComponent) {
                window.ModalsComponent.showMentorApplicationModal();
            }
        });
        
        // Admin panel button
        document.getElementById('admin-panel-btn')?.addEventListener('click', () => {
            if (window.ModalsComponent) {
                window.ModalsComponent.showAdminPanel();
            }
        });
        
        // Manage mentor button
        document.getElementById('manage-mentor-btn')?.addEventListener('click', () => {
            this.showMentorDashboard();
        });
    },
    
    // Join a room
    joinRoom: function(roomId) {
        const room = this.rooms.find(r => r.id === roomId);
        if (!room) return;
        
        // Increment member count
        room.members = (room.members || 1) + 1;
        this.saveRooms();
        
        // Navigate to room
        if (window.App) {
            window.App.navigateToRoom(room);
        }
        
        // Add to sidebar if not already there
        if (window.SidebarComponent) {
            window.SidebarComponent.addRoom(room, 'JOINED ROOMS');
        }
        
        NotificationsComponent.success(`Joined ${room.name}`);
    },
    
    // Show mentor dashboard
    showMentorDashboard: function() {
        const mentorRoom = this.rooms.find(r => r.createdBy === this.currentUser?.id);
        
        if (mentorRoom) {
            if (window.App) {
                window.App.navigateToRoom(mentorRoom);
            }
        } else {
            // Create mentor room if none exists
            const newRoom = {
                id: Date.now(),
                name: `${this.currentUser.name}'s Mentor Room`,
                topic: 'Mentoring Session',
                type: 'public',
                createdBy: this.currentUser.id,
                members: 1,
                description: 'Official mentor room',
                icon: '👨‍🏫'
            };
            
            this.rooms.push(newRoom);
            this.saveRooms();
            
            NotificationsComponent.success('Mentor room created!');
            
            if (window.App) {
                window.App.navigateToRoom(newRoom);
            }
        }
    },
    
    // Save rooms to localStorage
    saveRooms: function() {
        localStorage.setItem('rooms', JSON.stringify(this.rooms));
    },
    
    // Add a new room
    addRoom: function(room) {
        this.rooms.push(room);
        this.saveRooms();
        this.render(); // Re-render dashboard
    },
    
    // Update dashboard with new user
    updateUser: function(user) {
        this.currentUser = user;
        this.render();
        this.attachEventListeners();
    },
    
    // Show dashboard
    show: function() {
        document.getElementById('auth-view').style.display = 'none';
        document.getElementById('home-view').style.display = 'flex';
        document.getElementById('room-view').style.display = 'none';
        this.render();
        this.attachEventListeners();
    },
    
    // Hide dashboard
    hide: function() {
        document.getElementById('home-view').style.display = 'none';
    }
};

// Export for use in other files
window.DashboardPage = DashboardPage;