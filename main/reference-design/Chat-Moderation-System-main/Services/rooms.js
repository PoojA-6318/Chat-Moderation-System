// =========================================
// ROOMS SERVICE
// Manages room operations, requests, and real-time updates
// =========================================

const RoomsService = {
    // Cache of rooms
    rooms: [],
    
    // Current room
    currentRoom: null,
    
    // Room requests
    requests: [],
    
    // WebSocket connection (mock)
    ws: null,
    
    // Room update listeners
    listeners: [],
    
    // Initialize rooms service
    init: function() {
        this.loadRooms();
        this.loadRequests();
        this.setupWebSocket();
    },
    
    // Load rooms from storage
    loadRooms: function() {
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
                    createdAt: '2024-01-01T10:00:00Z',
                    description: 'Learn and discuss UI/UX design principles, user research, and design thinking.',
                    icon: '🎨',
                    tags: ['design', 'ui/ux', 'creative'],
                    isActive: true
                },
                {
                    id: 2,
                    name: 'Web Dev Hub',
                    topic: 'Modern Web Development',
                    type: 'public',
                    members: 23,
                    createdBy: 2,
                    createdAt: '2024-01-01T11:30:00Z',
                    description: 'Everything about modern web development - React, Vue, Node.js, and more.',
                    icon: '💻',
                    tags: ['web', 'javascript', 'coding'],
                    isActive: true
                },
                {
                    id: 3,
                    name: 'UX Research',
                    topic: 'User Research Methods',
                    type: 'public',
                    members: 8,
                    createdBy: 2,
                    createdAt: '2024-01-02T09:15:00Z',
                    description: 'Discuss user research methodologies, usability testing, and research tools.',
                    icon: '🔍',
                    tags: ['research', 'ux', 'testing'],
                    isActive: true
                }
            ];
            this.saveRooms();
        }
    },
    
    // Load room requests from storage
    loadRequests: function() {
        const savedRequests = localStorage.getItem('room-requests');
        
        if (savedRequests) {
            this.requests = JSON.parse(savedRequests);
        } else {
            this.requests = [];
        }
    },
    
    // Setup WebSocket connection (mock)
    setupWebSocket: function() {
        // In real app, this would be a real WebSocket connection
        console.log('WebSocket connection established (mock)');
        
        // Simulate real-time updates
        setInterval(() => {
            if (this.currentRoom) {
                // Randomly update member count for demo
                const randomRoom = this.rooms[Math.floor(Math.random() * this.rooms.length)];
                if (randomRoom) {
                    randomRoom.members = (randomRoom.members || 10) + Math.floor(Math.random() * 3) - 1;
                    this.notifyListeners('memberUpdate', { roomId: randomRoom.id, members: randomRoom.members });
                }
            }
        }, 30000);
    },
    
    // Get all rooms
    getAllRooms: function() {
        return this.rooms;
    },
    
    // Get public rooms
    getPublicRooms: function() {
        return this.rooms.filter(room => room.type === 'public' && room.isActive !== false);
    },
    
    // Get private rooms for user
    getPrivateRooms: function(userId) {
        return this.rooms.filter(room => 
            room.type === 'private' && 
            (room.createdBy === userId || room.members?.includes(userId))
        );
    },
    
    // Get room by ID
    getRoom: function(roomId) {
        return this.rooms.find(r => r.id === roomId);
    },
    
    // Get room by name
    getRoomByName: function(roomName) {
        return this.rooms.find(r => r.name === roomName);
    },
    
    // Create new room
    async createRoom(roomData) {
        try {
            const newRoom = {
                id: Date.now(),
                ...roomData,
                createdAt: new Date().toISOString(),
                members: 1,
                isActive: true
            };
            
            // Add to local array
            this.rooms.push(newRoom);
            this.saveRooms();
            
            // Send to server
            if (!ApiService.mockMode) {
                await ApiService.post('/rooms', newRoom);
            }
            
            NotificationsComponent.success(`Room "${roomData.name}" created successfully`);
            this.notifyListeners('roomCreated', newRoom);
            
            return { success: true, room: newRoom };
        } catch (error) {
            NotificationsComponent.error('Failed to create room');
            return { success: false, error: error.message };
        }
    },
    
    // Join room
    async joinRoom(roomId, userId) {
        const room = this.getRoom(roomId);
        if (!room) return { success: false, error: 'Room not found' };
        
        try {
            // Update member count
            room.members = (room.members || 1) + 1;
            
            // Add user to members list
            if (!room.memberList) room.memberList = [];
            if (!room.memberList.includes(userId)) {
                room.memberList.push(userId);
            }
            
            this.saveRooms();
            
            // Send to server
            if (!ApiService.mockMode) {
                await ApiService.post(`/rooms/${roomId}/join`, { userId });
            }
            
            this.notifyListeners('roomJoined', { roomId, userId });
            
            return { success: true, room };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },
    
    // Leave room
    async leaveRoom(roomId, userId) {
        const room = this.getRoom(roomId);
        if (!room) return { success: false, error: 'Room not found' };
        
        try {
            // Update member count
            room.members = Math.max(0, (room.members || 1) - 1);
            
            // Remove user from members list
            if (room.memberList) {
                room.memberList = room.memberList.filter(id => id !== userId);
            }
            
            this.saveRooms();
            
            // Send to server
            if (!ApiService.mockMode) {
                await ApiService.post(`/rooms/${roomId}/leave`, { userId });
            }
            
            this.notifyListeners('roomLeft', { roomId, userId });
            
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },
    
    // Update room
    async updateRoom(roomId, updates) {
        const room = this.getRoom(roomId);
        if (!room) return { success: false, error: 'Room not found' };
        
        try {
            Object.assign(room, updates);
            this.saveRooms();
            
            if (!ApiService.mockMode) {
                await ApiService.put(`/rooms/${roomId}`, updates);
            }
            
            this.notifyListeners('roomUpdated', room);
            
            return { success: true, room };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },
    
    // Delete room
    async deleteRoom(roomId) {
        const index = this.rooms.findIndex(r => r.id === roomId);
        if (index === -1) return { success: false, error: 'Room not found' };
        
        try {
            this.rooms.splice(index, 1);
            this.saveRooms();
            
            if (!ApiService.mockMode) {
                await ApiService.delete(`/rooms/${roomId}`);
            }
            
            this.notifyListeners('roomDeleted', roomId);
            
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },
    
    // Request new public room
    async requestRoom(requestData) {
        try {
            const newRequest = {
                id: Date.now(),
                ...requestData,
                status: 'pending',
                submittedAt: new Date().toISOString()
            };
            
            this.requests.push(newRequest);
            this.saveRequests();
            
            if (!ApiService.mockMode) {
                await ApiService.post('/rooms/requests', newRequest);
            }
            
            NotificationsComponent.success('Room request submitted for review');
            this.notifyListeners('requestCreated', newRequest);
            
            return { success: true, request: newRequest };
        } catch (error) {
            NotificationsComponent.error('Failed to submit request');
            return { success: false, error: error.message };
        }
    },
    
    // Get pending requests
    getPendingRequests: function() {
        return this.requests.filter(r => r.status === 'pending');
    },
    
    // Approve room request
    async approveRequest(requestId, adminComments) {
        const request = this.requests.find(r => r.id === requestId);
        if (!request) return { success: false, error: 'Request not found' };
        
        try {
            request.status = 'approved';
            request.approvedAt = new Date().toISOString();
            request.adminComments = adminComments;
            this.saveRequests();
            
            // Create the room
            const roomResult = await this.createRoom({
                name: request.title,
                topic: request.title,
                description: request.reason,
                type: 'public',
                createdBy: request.userId,
                requestedBy: request.userId
            });
            
            if (roomResult.success) {
                NotificationsComponent.success('Room request approved and created');
                this.notifyListeners('requestApproved', { request, room: roomResult.room });
            }
            
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },
    
    // Reject room request
    async rejectRequest(requestId, adminComments) {
        const request = this.requests.find(r => r.id === requestId);
        if (!request) return { success: false, error: 'Request not found' };
        
        try {
            request.status = 'rejected';
            request.rejectedAt = new Date().toISOString();
            request.adminComments = adminComments;
            this.saveRequests();
            
            if (!ApiService.mockMode) {
                await ApiService.post(`/rooms/requests/${requestId}/reject`, { adminComments });
            }
            
            NotificationsComponent.info('Room request rejected');
            this.notifyListeners('requestRejected', request);
            
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },
    
    // Generate invite link for private room
    generateInviteLink: function(roomId) {
        const room = this.getRoom(roomId);
        if (!room || room.type !== 'private') return null;
        
        const token = btoa(`${roomId}:${Date.now()}:${Math.random()}`).replace(/=/g, '');
        const link = `https://wele.com/join/${token}`;
        
        // Store token
        const invites = JSON.parse(localStorage.getItem('room-invites') || '{}');
        invites[token] = { roomId, expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000 }; // 7 days
        localStorage.setItem('room-invites', JSON.stringify(invites));
        
        return link;
    },
    
    // Join via invite link
    joinViaInvite: function(token) {
        const invites = JSON.parse(localStorage.getItem('room-invites') || '{}');
        const invite = invites[token];
        
        if (!invite) {
            return { success: false, error: 'Invalid invite link' };
        }
        
        if (invite.expiresAt < Date.now()) {
            return { success: false, error: 'Invite link has expired' };
        }
        
        const room = this.getRoom(invite.roomId);
        if (!room) {
            return { success: false, error: 'Room not found' };
        }
        
        return { success: true, room };
    },
    
    // Get room members
    getRoomMembers: function(roomId) {
        const room = this.getRoom(roomId);
        if (!room) return [];
        
        // In real app, fetch from server
        // For demo, return mock data
        return [
            { id: 1, name: 'James Jason', role: 'user', status: 'online' },
            { id: 2, name: 'Jordan', role: 'mentor', status: 'online' },
            { id: 3, name: 'Alex', role: 'user', status: 'away' },
            { id: 4, name: 'Emma', role: 'user', status: 'offline' }
        ];
    },
    
    // Search rooms
    searchRooms: function(query) {
        const lowerQuery = query.toLowerCase();
        return this.rooms.filter(room => 
            room.name.toLowerCase().includes(lowerQuery) ||
            room.topic.toLowerCase().includes(lowerQuery) ||
            room.description?.toLowerCase().includes(lowerQuery) ||
            room.tags?.some(tag => tag.includes(lowerQuery))
        );
    },
    
    // Get popular rooms
    getPopularRooms: function(limit = 5) {
        return [...this.rooms]
            .sort((a, b) => (b.members || 0) - (a.members || 0))
            .slice(0, limit);
    },
    
    // Get recent rooms
    getRecentRooms: function(limit = 5) {
        return [...this.rooms]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, limit);
    },
    
    // Save rooms to storage
    saveRooms: function() {
        localStorage.setItem('rooms', JSON.stringify(this.rooms));
    },
    
    // Save requests to storage
    saveRequests: function() {
        localStorage.setItem('room-requests', JSON.stringify(this.requests));
    },
    
    // Add listener for room updates
    addListener: function(callback) {
        this.listeners.push(callback);
    },
    
    // Remove listener
    removeListener: function(callback) {
        this.listeners = this.listeners.filter(cb => cb !== callback);
    },
    
    // Notify listeners
    notifyListeners: function(event, data) {
        this.listeners.forEach(callback => {
            try {
                callback(event, data);
            } catch (error) {
                console.error('Error in room listener:', error);
            }
        });
    },
    
    // Set current room
    setCurrentRoom: function(room) {
        this.currentRoom = room;
        this.notifyListeners('currentRoomChanged', room);
    },
    
    // Get current room
    getCurrentRoom: function() {
        return this.currentRoom;
    }
};

// Initialize rooms service
RoomsService.init();

// Export for use in other files
window.RoomsService = RoomsService;