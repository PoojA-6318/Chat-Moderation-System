// =========================================
// CHAT COMPONENT
// Manages chat interface, messages, and real-time updates
// =========================================

const ChatComponent = {
    // Current room data
    currentRoom: null,
    // Blocked keywords for filtering
    blockedKeywords: [
        'spam', 'advertisement', 'buy now', 'discount', 'free money',
        'hate', 'violence', 'inappropriate', 'scam', 'fraud',
        'porn', 'sex', 'drugs', 'gambling', 'casino'
    ],
    
    // Initialize chat
    init: function() {
        this.attachEventListeners();
        this.loadMockMessages();
    },
    
    // Attach chat-specific event listeners
    attachEventListeners: function() {
        // Enter key to send message
        const input = document.getElementById('user-input');
        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage();
                }
            });
        }
        
        // Attach button click
        const sendBtn = document.querySelector('.btn-send');
        if (sendBtn) {
            sendBtn.addEventListener('click', () => this.sendMessage());
        }
    },
    
    // Load mock messages for demo
    loadMockMessages: function() {
        const chatFeed = document.getElementById('chat-messages');
        if (!chatFeed) return;
        
        chatFeed.innerHTML = `
            <div class="msg-row">
                <img src="https://i.pravatar.cc/100?u=jordan" class="chat-avatar">
                <div class="msg-content">
                    <div class="msg-info">
                        <strong>Jordan</strong> 
                        <span class="mentor-tag">Mentor</span> 
                        <small>12:40 PM</small>
                    </div>
                    <div class="bubble bubble-received">
                        Hey everyone! Has anyone checked the new resources for the Design Strategy module?
                    </div>
                </div>
            </div>
            <div class="msg-row self">
                <div class="msg-content">
                    <div class="msg-info">
                        <small>12:42 PM</small>
                    </div>
                    <div class="bubble bubble-sent">
                        Just finished it! The section on Atomic Design was incredibly helpful.
                    </div>
                </div>
            </div>
        `;
    },
    
    // Set current room
    setRoom: function(room) {
        this.currentRoom = room;
        this.updateRoomHeader(room);
        this.loadRoomMessages(room.id);
    },
    
    // Update room header
    updateRoomHeader: function(room) {
        const roomNameEl = document.getElementById('active-room-name');
        const roomTopicEl = document.getElementById('room-topic');
        const roomBadge = document.getElementById('room-type-badge');
        const shareBtn = document.getElementById('share-room-btn');
        
        if (roomNameEl) roomNameEl.textContent = room.name;
        if (roomTopicEl) roomTopicEl.textContent = room.topic;
        
        if (roomBadge) {
            roomBadge.textContent = room.type === 'private' ? 'Private' : 'Public';
            roomBadge.className = `room-badge ${room.type}`;
        }
        
        // Show/hide share button for private rooms
        if (shareBtn) {
            const currentUser = window.App?.getCurrentUser();
            if (room.type === 'private' && room.createdBy === currentUser?.id) {
                shareBtn.style.display = 'inline-flex';
            } else {
                shareBtn.style.display = 'none';
            }
        }
        
        // Update members avatars
        this.updateMembersList(room.members || []);
    },
    
    // Update members list in header
    updateMembersList: function(members) {
        const avatarGroup = document.getElementById('room-members');
        if (!avatarGroup) return;
        
        // Mock members for demo
        avatarGroup.innerHTML = `
            <img src="https://i.pravatar.cc/100?u=1" alt="Member">
            <img src="https://i.pravatar.cc/100?u=2" alt="Member">
            <img src="https://i.pravatar.cc/100?u=3" alt="Member">
            <div class="avatar-more">+${members.length || 11}</div>
        `;
    },
    
    // Load room messages
    loadRoomMessages: function(roomId) {
        // In real app, fetch messages from API
        // For now, keep mock messages
        this.loadMockMessages();
    },
    
    // Send a message
    sendMessage: function() {
        if (!this.currentRoom) {
            NotificationsComponent.show('Please select a room first', 'error');
            return;
        }
        
        const input = document.getElementById('user-input');
        const message = input.value.trim();
        
        if (message === '') return;
        
        // Check message content
        const checkResult = this.checkMessageContent(message);
        
        if (!checkResult.allowed) {
            this.showBlockedWarning(checkResult.reason);
            return;
        }
        
        // Add message to chat
        this.addMessage(message, 'self');
        input.value = '';
        
        // Simulate reply after 2 seconds (for demo)
        if (Math.random() > 0.5) {
            setTimeout(() => {
                this.addMessage(
                    "Thanks for sharing! That's really helpful information.",
                    'received',
                    'Sarah',
                    'https://i.pravatar.cc/100?u=sarah'
                );
            }, 2000);
        }
    },
    
    // Add a message to the chat feed
    addMessage: function(text, type, sender = 'You', avatar = null) {
        const chatFeed = document.getElementById('chat-messages');
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        const messageRow = document.createElement('div');
        messageRow.className = `msg-row ${type === 'self' ? 'self' : ''}`;
        
        if (type === 'received') {
            messageRow.innerHTML = `
                <img src="${avatar}" class="chat-avatar">
                <div class="msg-content">
                    <div class="msg-info">
                        <strong>${sender}</strong>
                        ${sender === 'Sarah' ? '<span class="mentor-tag">Mentor</span>' : ''}
                        <small>${time}</small>
                    </div>
                    <div class="bubble bubble-received">${text}</div>
                </div>
            `;
        } else {
            messageRow.innerHTML = `
                <div class="msg-content">
                    <div class="msg-info">
                        <small>${time}</small>
                    </div>
                    <div class="bubble bubble-sent">${text}</div>
                </div>
            `;
        }
        
        chatFeed.appendChild(messageRow);
        chatFeed.scrollTop = chatFeed.scrollHeight;
    },
    
    // Check message for blocked content and topic relevance
    checkMessageContent: function(message) {
        const lowerMessage = message.toLowerCase();
        const lowerTopic = this.currentRoom?.topic.toLowerCase() || '';
        
        // Check for blocked keywords
        for (let keyword of this.blockedKeywords) {
            if (lowerMessage.includes(keyword)) {
                return {
                    allowed: false,
                    reason: 'Contains inappropriate content'
                };
            }
        }
        
        // Check topic relevance (simple version)
        if (lowerTopic) {
            const topicWords = lowerTopic.split(' ');
            let isRelevant = false;
            
            for (let word of topicWords) {
                if (word.length > 3 && lowerMessage.includes(word)) {
                    isRelevant = true;
                    break;
                }
            }
            
            if (!isRelevant && lowerMessage.length > 10) {
                this.showTopicWarning();
            }
        }
        
        return { allowed: true };
    },
    
    // Show topic warning
    showTopicWarning: function() {
        const warning = document.getElementById('topic-warning');
        if (warning) {
            warning.classList.remove('hidden');
            setTimeout(() => {
                warning.classList.add('hidden');
            }, 5000);
        }
    },
    
    // Show blocked message warning
    showBlockedWarning: function(reason) {
        const warning = document.getElementById('blocked-warning');
        if (warning) {
            warning.textContent = `🚫 Message blocked: ${reason}`;
            warning.classList.remove('hidden');
            
            setTimeout(() => {
                warning.classList.add('hidden');
            }, 3000);
        }
    },
    
    // Show room information
    showRoomInfo: function() {
        if (this.currentRoom) {
            alert(`
📌 Room: ${this.currentRoom.name}
📚 Topic: ${this.currentRoom.topic}
🔒 Type: ${this.currentRoom.type}
👥 Members: ${this.currentRoom.members || 1}
📝 Description: ${this.currentRoom.description || 'No description'}
            `);
        }
    },
    
    // Exit current room
    exitRoom: function() {
        if (confirm('Are you sure you want to exit this room?')) {
            if (window.App && window.App.navigateToView) {
                window.App.navigateToView('home');
            }
            NotificationsComponent.show(`Exited ${this.currentRoom?.name}`, 'info');
            this.currentRoom = null;
        }
    },
    
    // Add blocked keyword
    addBlockedKeyword: function(keyword) {
        if (!this.blockedKeywords.includes(keyword)) {
            this.blockedKeywords.push(keyword);
        }
    },
    
    // Remove blocked keyword
    removeBlockedKeyword: function(keyword) {
        this.blockedKeywords = this.blockedKeywords.filter(k => k !== keyword);
    }
};

// Export for use in other files
window.ChatComponent = ChatComponent;