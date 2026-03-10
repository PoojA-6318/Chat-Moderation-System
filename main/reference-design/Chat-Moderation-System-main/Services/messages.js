// =========================================
// MESSAGES SERVICE
// Manages chat messages, attachments, and real-time updates
// =========================================

const MessagesService = {
    // Message cache by room
    messages: {},
    
    // WebSocket connection for real-time messages
    ws: null,
    
    // Message listeners
    listeners: [],
    
    // Typing users by room
    typingUsers: {},
    
    // Initialize messages service
    init: function() {
        this.loadMessages();
        this.setupWebSocket();
    },
    
    // Load messages from storage
    loadMessages: function() {
        const savedMessages = localStorage.getItem('room-messages');
        if (savedMessages) {
            this.messages = JSON.parse(savedMessages);
        }
    },
    
    // Setup WebSocket for real-time messages
    setupWebSocket: function() {
        // In real app, this would connect to a real WebSocket server
        console.log('Messages WebSocket connected (mock)');
        
        // Simulate receiving messages
        setInterval(() => {
            // Random chance to simulate a new message
            if (Math.random() > 0.7) {
                const rooms = Object.keys(this.messages);
                if (rooms.length > 0) {
                    const randomRoomId = rooms[Math.floor(Math.random() * rooms.length)];
                    this.simulateIncomingMessage(parseInt(randomRoomId));
                }
            }
        }, 45000);
    },
    
    // Simulate incoming message from another user
    simulateIncomingMessage: function(roomId) {
        const users = [
            { id: 4, name: 'Emma', avatar: 'https://i.pravatar.cc/100?u=emma' },
            { id: 5, name: 'Michael', avatar: 'https://i.pravatar.cc/100?u=michael' },
            { id: 6, name: 'Sophia', avatar: 'https://i.pravatar.cc/100?u=sophia' }
        ];
        
        const randomUser = users[Math.floor(Math.random() * users.length)];
        const messages = [
            "That's a great point!",
            "Has anyone tried the new feature?",
            "I found an interesting resource about this topic.",
            "What do you all think about this approach?",
            "Thanks for sharing that information!"
        ];
        
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        
        const message = {
            id: Date.now(),
            roomId: roomId,
            userId: randomUser.id,
            userName: randomUser.name,
            avatar: randomUser.avatar,
            content: randomMessage,
            timestamp: new Date().toISOString()
        };
        
        this.addMessage(message);
    },
    
    // Get messages for a room
    getMessages: function(roomId, limit = 50) {
        if (!this.messages[roomId]) {
            // Try to load from localStorage
            const saved = localStorage.getItem(`messages-${roomId}`);
            if (saved) {
                this.messages[roomId] = JSON.parse(saved);
            } else {
                // Generate mock messages for demo
                this.messages[roomId] = this.generateMockMessages(roomId);
            }
        }
        
        // Return most recent messages first
        return [...this.messages[roomId]]
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, limit)
            .reverse(); // Reverse to show oldest first in chat
    },
    
    // Generate mock messages for a room
    generateMockMessages: function(roomId) {
        const mockMessages = [];
        const now = Date.now();
        
        // Create some sample messages based on room ID
        if (roomId === 1) { // Design Strategy
            mockMessages.push(
                {
                    id: 1001,
                    roomId: 1,
                    userId: 2,
                    userName: 'Jordan',
                    avatar: 'https://i.pravatar.cc/100?u=jordan',
                    content: 'Welcome to the Design Strategy room! Let\'s discuss UI/UX principles.',
                    timestamp: new Date(now - 7200000).toISOString(),
                    isMentor: true
                },
                {
                    id: 1002,
                    roomId: 1,
                    userId: 3,
                    userName: 'Alex',
                    avatar: 'https://i.pravatar.cc/100?u=alex',
                    content: 'Has anyone read the new article about atomic design?',
                    timestamp: new Date(now - 3600000).toISOString()
                },
                {
                    id: 1003,
                    roomId: 1,
                    userId: 2,
                    userName: 'Jordan',
                    avatar: 'https://i.pravatar.cc/100?u=jordan',
                    content: 'Yes! The concept of atoms, molecules, and organisms is really powerful.',
                    timestamp: new Date(now - 3500000).toISOString(),
                    isMentor: true
                }
            );
        } else if (roomId === 2) { // Web Dev Hub
            mockMessages.push(
                {
                    id: 2001,
                    roomId: 2,
                    userId: 2,
                    userName: 'Jordan',
                    avatar: 'https://i.pravatar.cc/100?u=jordan',
                    content: 'Welcome to Web Dev Hub! Discuss all things web development here.',
                    timestamp: new Date(now - 86400000).toISOString(),
                    isMentor: true
                },
                {
                    id: 2002,
                    roomId: 2,
                    userId: 7,
                    userName: 'Chris',
                    avatar: 'https://i.pravatar.cc/100?u=chris',
                    content: 'What\'s everyone working on this week?',
                    timestamp: new Date(now - 43200000).toISOString()
                }
            );
        }
        
        // Save to localStorage
        localStorage.setItem(`messages-${roomId}`, JSON.stringify(mockMessages));
        
        return mockMessages;
    },
    
    // Send a message
    async sendMessage(roomId, content, userId, userData = {}) {
        if (!content.trim()) return { success: false, error: 'Message cannot be empty' };
        
        // Check for blocked content
        const blockedCheck = this.checkBlockedContent(content);
        if (!blockedCheck.allowed) {
            return { success: false, error: blockedCheck.reason, blocked: true };
        }
        
        const message = {
            id: Date.now(),
            roomId,
            userId,
            userName: userData.name || 'User',
            avatar: userData.avatar || `https://i.pravatar.cc/100?u=${userId}`,
            content: content.trim(),
            timestamp: new Date().toISOString(),
            isMentor: userData.isMentor || false
        };
        
        try {
            // Add to local storage
            this.addMessage(message);
            
            // Send to server if not in mock mode
            if (!ApiService.mockMode) {
                await ApiService.post('/messages', message);
            }
            
            // Notify listeners
            this.notifyListeners('newMessage', message);
            
            return { success: true, message };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },
    
    // Add message to cache
    addMessage: function(message) {
        if (!this.messages[message.roomId]) {
            this.messages[message.roomId] = [];
        }
        
        this.messages[message.roomId].push(message);
        this.saveMessages(message.roomId);
    },
    
    // Save messages for a room
    saveMessages: function(roomId) {
        if (this.messages[roomId]) {
            localStorage.setItem(`messages-${roomId}`, JSON.stringify(this.messages[roomId]));
        }
    },
    
    // Check message for blocked content
    checkBlockedContent: function(content) {
        const lowerContent = content.toLowerCase();
        
        // Get blocked keywords from KeywordsService
        const blockedKeywords = window.KeywordsService?.getKeywords() || [];
        
        for (let keyword of blockedKeywords) {
            if (lowerContent.includes(keyword.toLowerCase())) {
                return {
                    allowed: false,
                    reason: 'Message contains blocked content'
                };
            }
        }
        
        return { allowed: true };
    },
    
    // Edit a message
    async editMessage(messageId, roomId, newContent) {
        const message = this.messages[roomId]?.find(m => m.id === messageId);
        if (!message) return { success: false, error: 'Message not found' };
        
        const oldContent = message.content;
        message.content = newContent;
        message.isEdited = true;
        message.editedAt = new Date().toISOString();
        
        this.saveMessages(roomId);
        
        // Send to server
        if (!ApiService.mockMode) {
            await ApiService.put(`/messages/${messageId}`, { content: newContent });
        }
        
        this.notifyListeners('messageEdited', { messageId, roomId, newContent, oldContent });
        
        return { success: true };
    },
    
    // Delete a message
    async deleteMessage(messageId, roomId) {
        if (!this.messages[roomId]) return { success: false, error: 'Room not found' };
        
        const index = this.messages[roomId].findIndex(m => m.id === messageId);
        if (index === -1) return { success: false, error: 'Message not found' };
        
        const deletedMessage = this.messages[roomId][index];
        this.messages[roomId].splice(index, 1);
        this.saveMessages(roomId);
        
        // Send to server
        if (!ApiService.mockMode) {
            await ApiService.delete(`/messages/${messageId}`);
        }
        
        this.notifyListeners('messageDeleted', { messageId, roomId });
        
        return { success: true };
    },
    
    // React to a message
    async addReaction(messageId, roomId, userId, emoji) {
        const message = this.messages[roomId]?.find(m => m.id === messageId);
        if (!message) return { success: false, error: 'Message not found' };
        
        if (!message.reactions) {
            message.reactions = [];
        }
        
        // Check if user already reacted with this emoji
        const existingReaction = message.reactions.find(r => 
            r.emoji === emoji && r.users?.includes(userId)
        );
        
        if (existingReaction) {
            // Remove reaction
            existingReaction.count--;
            existingReaction.users = existingReaction.users.filter(id => id !== userId);
            if (existingReaction.count <= 0) {
                message.reactions = message.reactions.filter(r => r.emoji !== emoji);
            }
        } else {
            // Add reaction
            const reaction = message.reactions.find(r => r.emoji === emoji);
            if (reaction) {
                reaction.count++;
                reaction.users.push(userId);
            } else {
                message.reactions.push({
                    emoji,
                    count: 1,
                    users: [userId]
                });
            }
        }
        
        this.saveMessages(roomId);
        this.notifyListeners('messageReacted', { messageId, roomId, emoji });
        
        return { success: true };
    },
    
    // User typing indicator
    userTyping(roomId, userId, userName) {
        if (!this.typingUsers[roomId]) {
            this.typingUsers[roomId] = new Map();
        }
        
        // Add user to typing set
        this.typingUsers[roomId].set(userId, {
            name: userName,
            timestamp: Date.now()
        });
        
        // Notify listeners
        this.notifyListeners('typingUpdate', {
            roomId,
            typingUsers: Array.from(this.typingUsers[roomId].entries()).map(([id, data]) => ({
                id,
                name: data.name
            }))
        });
        
        // Clear after 3 seconds
        setTimeout(() => {
            if (this.typingUsers[roomId]?.has(userId)) {
                this.typingUsers[roomId].delete(userId);
                this.notifyListeners('typingUpdate', {
                    roomId,
                    typingUsers: Array.from(this.typingUsers[roomId]?.entries() || []).map(([id, data]) => ({
                        id,
                        name: data.name
                    }))
                });
            }
        }, 3000);
    },
    
    // Get typing users in a room
    getTypingUsers: function(roomId) {
        if (!this.typingUsers[roomId]) return [];
        
        const now = Date.now();
        // Clean up old typing indicators
        for (let [userId, data] of this.typingUsers[roomId].entries()) {
            if (now - data.timestamp > 3000) {
                this.typingUsers[roomId].delete(userId);
            }
        }
        
        return Array.from(this.typingUsers[roomId].entries()).map(([id, data]) => ({
            id,
            name: data.name
        }));
    },
    
    // Upload file attachment
    async uploadAttachment(file, onProgress) {
        try {
            const response = await ApiService.upload('/messages/attach', file, onProgress);
            
            if (response.success) {
                return {
                    success: true,
                    attachment: {
                        url: response.data.url,
                        name: file.name,
                        type: file.type,
                        size: file.size
                    }
                };
            }
            
            return { success: false, error: 'Upload failed' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },
    
    // Search messages in a room
    searchMessages: function(roomId, query) {
        const messages = this.messages[roomId] || [];
        const lowerQuery = query.toLowerCase();
        
        return messages.filter(msg => 
            msg.content.toLowerCase().includes(lowerQuery)
        ).map(msg => ({
            ...msg,
            highlight: this.highlightText(msg.content, query)
        }));
    },
    
    // Highlight search term in text
    highlightText: function(text, query) {
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    },
    
    // Add message listener
    addListener: function(callback) {
        this.listeners.push(callback);
    },
    
    // Remove message listener
    removeListener: function(callback) {
        this.listeners = this.listeners.filter(cb => cb !== callback);
    },
    
    // Notify listeners
    notifyListeners: function(event, data) {
        this.listeners.forEach(callback => {
            try {
                callback(event, data);
            } catch (error) {
                console.error('Error in message listener:', error);
            }
        });
    },
    
    // Clear all messages for a room
    clearMessages: function(roomId) {
        if (this.messages[roomId]) {
            this.messages[roomId] = [];
            localStorage.removeItem(`messages-${roomId}`);
            this.notifyListeners('messagesCleared', roomId);
        }
    }
};

// Initialize messages service
MessagesService.init();

// Export for use in other files
window.MessagesService = MessagesService;