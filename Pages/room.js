// =========================================
// ROOM PAGE
// Manages individual chat rooms and messaging
// =========================================

const RoomPage = {
    // Current room data
    currentRoom: null,
    // Current user
    currentUser: null,
    // Messages in current room
    messages: [],
    // Typing users
    typingUsers: new Set(),
    
    // Initialize room page
    init: function(user) {
        this.currentUser = user;
        this.render();
        this.attachEventListeners();
    },
    
    // Render room page
    render: function() {
        const roomView = document.getElementById('room-view');
        if (!roomView) return;
        
        roomView.innerHTML = `
            <header class="chat-header">
                <div class="header-left">
                    <span class="header-hash">#</span>
                    <h2 id="active-room-name">Loading...</h2>
                    <span class="room-badge public" id="room-type-badge">Public</span>
                </div>
                <div class="header-right">
                    <div class="room-actions">
                        <button class="icon-btn" id="room-info-btn" title="Room Info">ℹ️</button>
                        <button class="icon-btn" id="share-room-btn" title="Share Invite">🔗</button>
                        <button class="icon-btn" id="room-members-btn" title="Members">👥</button>
                        <button class="icon-btn exit-btn" id="exit-room-btn" title="Exit Room">🚪</button>
                    </div>
                    <div class="avatar-group" id="room-members-avatars">
                        <!-- Member avatars will be dynamically added -->
                    </div>
                </div>
            </header>

            <!-- Topic Warning Banner -->
            <div id="topic-warning" class="topic-warning hidden">
                ⚠️ This room is for discussing <span id="room-topic"></span> only. Please stay on topic!
            </div>

            <!-- Messages Container -->
            <div class="chat-feed" id="chat-messages">
                ${this.renderMessages()}
            </div>

            <!-- Message Input -->
            <footer class="chat-input-container">
                <div class="typing-indicator" id="typing-indicator"></div>
                <div class="input-pill">
                    <button class="btn-attach" id="attach-file-btn">📎</button>
                    <input type="text" id="user-input" placeholder="Type a message..." autocomplete="off">
                    <button class="btn-send" id="send-message-btn">Send</button>
                </div>
                <div id="blocked-warning" class="blocked-warning hidden">
                    🚫 Message blocked: Contains inappropriate content or is off-topic
                </div>
            </footer>
        `;
    },
    
    // Render messages
    renderMessages: function() {
        if (this.messages.length === 0) {
            return `
                <div class="welcome-message">
                    <div class="welcome-icon">👋</div>
                    <h3>Welcome to ${this.currentRoom?.name || 'the room'}!</h3>
                    <p>This is the beginning of the conversation.</p>
                </div>
            `;
        }
        
        return this.messages.map(msg => this.renderMessage(msg)).join('');
    },
    
    // Render single message
    renderMessage: function(msg) {
        const isSelf = msg.userId === this.currentUser?.id;
        
        return `
            <div class="msg-row ${isSelf ? 'self' : ''}" data-message-id="${msg.id}">
                ${!isSelf ? `<img src="${msg.avatar}" class="chat-avatar">` : ''}
                <div class="msg-content">
                    <div class="msg-info">
                        ${!isSelf ? `<strong>${msg.userName}</strong>` : ''}
                        ${msg.isMentor ? '<span class="mentor-tag">Mentor</span>' : ''}
                        <small>${this.formatTime(msg.timestamp)}</small>
                        ${msg.isEdited ? '<span class="edited-tag">(edited)</span>' : ''}
                    </div>
                    <div class="bubble ${isSelf ? 'bubble-sent' : 'bubble-received'}">
                        ${this.renderMessageContent(msg)}
                    </div>
                    ${msg.reactions?.length ? this.renderReactions(msg.reactions) : ''}
                </div>
            </div>
        `;
    },
    
    // Render message content (supports emojis, links, code)
    renderMessageContent: function(msg) {
        let content = msg.content;
        
        // Convert URLs to links
        content = content.replace(
            /(https?:\/\/[^\s]+)/g, 
            '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
        );
        
        // Convert code blocks
        if (content.includes('```')) {
            // Handle code blocks (simplified)
            content = content.replace(
                /```([\s\S]*?)```/g,
                '<pre><code>$1</code></pre>'
            );
        }
        
        // Handle attachments
        if (msg.attachments) {
            content += this.renderAttachments(msg.attachments);
        }
        
        return content;
    },
    
    // Render attachments
    renderAttachments: function(attachments) {
        return attachments.map(att => {
            if (att.type.startsWith('image/')) {
                return `<img src="${att.url}" class="message-image" alt="Attachment">`;
            } else {
                return `<a href="${att.url}" class="file-attachment">📎 ${att.name}</a>`;
            }
        }).join('');
    },
    
    // Render reactions
    renderReactions: function(reactions) {
        return `
            <div class="message-reactions">
                ${reactions.map(r => `
                    <span class="reaction" onclick="RoomPage.addReaction('${r.emoji}')">
                        ${r.emoji} ${r.count}
                    </span>
                `).join('')}
            </div>
        `;
    },
    
    // Format timestamp
    formatTime: function(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        
        if (date.toDateString() === now.toDateString()) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else {
            return date.toLocaleDateString([], { month: 'short', day: 'numeric' }) + 
                   ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
    },
    
    // Attach event listeners
    attachEventListeners: function() {
        // Send message on button click
        document.getElementById('send-message-btn')?.addEventListener('click', () => {
            this.sendMessage();
        });
        
        // Send message on Enter (but allow Shift+Enter for new line)
        document.getElementById('user-input')?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        // Typing indicator
        document.getElementById('user-input')?.addEventListener('input', () => {
            this.handleTyping();
        });
        
        // Room info button
        document.getElementById('room-info-btn')?.addEventListener('click', () => {
            this.showRoomInfo();
        });
        
        // Share room button
        document.getElementById('share-room-btn')?.addEventListener('click', () => {
            this.shareRoom();
        });
        
        // Members button
        document.getElementById('room-members-btn')?.addEventListener('click', () => {
            this.showMembers();
        });
        
        // Exit room button
        document.getElementById('exit-room-btn')?.addEventListener('click', () => {
            this.exitRoom();
        });
        
        // Attach file button
        document.getElementById('attach-file-btn')?.addEventListener('click', () => {
            this.attachFile();
        });
    },
    
    // Set current room
    setRoom: function(room) {
        this.currentRoom = room;
        this.loadMessages();
        this.updateRoomHeader();
        
        // Join room via WebSocket (simulated)
        this.simulateJoin();
    },
    
    // Update room header
    updateRoomHeader: function() {
        if (!this.currentRoom) return;
        
        document.getElementById('active-room-name').textContent = this.currentRoom.name;
        document.getElementById('room-topic').textContent = this.currentRoom.topic;
        
        const badge = document.getElementById('room-type-badge');
        badge.textContent = this.currentRoom.type === 'private' ? 'Private' : 'Public';
        badge.className = `room-badge ${this.currentRoom.type}`;
        
        // Show/hide share button for private rooms
        const shareBtn = document.getElementById('share-room-btn');
        if (shareBtn) {
            shareBtn.style.display = 
                this.currentRoom.type === 'private' && this.currentRoom.createdBy === this.currentUser?.id 
                ? 'inline-flex' : 'none';
        }
        
        // Update member avatars
        this.updateMemberAvatars();
    },
    
    // Update member avatars
    updateMemberAvatars: function() {
        const avatarGroup = document.getElementById('room-members-avatars');
        if (!avatarGroup) return;
        
        const members = this.currentRoom?.members || [];
        const maxDisplay = 3;
        
        let html = '';
        for (let i = 0; i < Math.min(members.length, maxDisplay); i++) {
            html += `<img src="${members[i].avatar}" alt="${members[i].name}" title="${members[i].name}">`;
        }
        
        if (members.length > maxDisplay) {
            html += `<div class="avatar-more">+${members.length - maxDisplay}</div>`;
        }
        
        avatarGroup.innerHTML = html;
    },
    
    // Load messages for current room
    loadMessages: function() {
        // Try to load from localStorage
        const savedMessages = localStorage.getItem(`messages-${this.currentRoom?.id}`);
        
        if (savedMessages) {
            this.messages = JSON.parse(savedMessages);
        } else {
            // Mock messages for demo
            this.messages = [
                {
                    id: 1,
                    userId: 2,
                    userName: 'Jordan',
                    avatar: 'https://i.pravatar.cc/100?u=jordan',
                    content: 'Hey everyone! Has anyone checked the new resources for the Design Strategy module?',
                    timestamp: new Date(Date.now() - 3600000).toISOString(),
                    isMentor: true
                },
                {
                    id: 2,
                    userId: this.currentUser?.id || 1,
                    userName: this.currentUser?.name || 'You',
                    avatar: this.currentUser?.avatar || 'https://i.pravatar.cc/100?u=user',
                    content: 'Just finished it! The section on Atomic Design was incredibly helpful.',
                    timestamp: new Date(Date.now() - 1800000).toISOString()
                },
                {
                    id: 3,
                    userId: 3,
                    userName: 'Alex',
                    avatar: 'https://i.pravatar.cc/100?u=alex',
                    content: 'Can someone share the link to the resources?',
                    timestamp: new Date(Date.now() - 900000).toISOString()
                }
            ];
        }
        
        this.renderMessages();
        this.scrollToBottom();
    },
    
    // Render messages in the feed
    renderMessages: function() {
        const chatFeed = document.getElementById('chat-messages');
        if (!chatFeed) return;
        
        chatFeed.innerHTML = this.messages.map(msg => this.renderMessage(msg)).join('');
    },
    
    // Send a message
    sendMessage: function() {
        if (!this.currentRoom) {
            NotificationsComponent.error('Please select a room first');
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
        
        // Create new message
        const newMessage = {
            id: Date.now(),
            userId: this.currentUser.id,
            userName: this.currentUser.name,
            avatar: this.currentUser.avatar || 'https://i.pravatar.cc/100?u=' + this.currentUser.id,
            content: message,
            timestamp: new Date().toISOString(),
            isMentor: this.currentUser.role === 'mentor'
        };
        
        // Add to messages
        this.messages.push(newMessage);
        
        // Save to localStorage
        this.saveMessages();
        
        // Render new message
        this.addMessageToFeed(newMessage);
        
        // Clear input
        input.value = '';
        
        // Simulate reply (for demo)
        if (this.messages.length % 3 === 0) {
            this.simulateReply();
        }
        
        // Simulate typing stopped
        this.stopTyping();
    },
    
    // Add message to feed
    addMessageToFeed: function(message) {
        const chatFeed = document.getElementById('chat-messages');
        const messageHtml = this.renderMessage(message);
        chatFeed.insertAdjacentHTML('beforeend', messageHtml);
        this.scrollToBottom();
    },
    
    // Check message for blocked content and topic relevance
    checkMessageContent: function(message) {
        const lowerMessage = message.toLowerCase();
        const lowerTopic = this.currentRoom?.topic.toLowerCase() || '';
        
        // Check for blocked keywords
        const blockedKeywords = window.ChatComponent?.blockedKeywords || [
            'spam', 'advertisement', 'buy now', 'discount', 'free money',
            'hate', 'violence', 'inappropriate', 'scam', 'fraud'
        ];
        
        for (let keyword of blockedKeywords) {
            if (lowerMessage.includes(keyword)) {
                return {
                    allowed: false,
                    reason: 'Contains inappropriate content'
                };
            }
        }
        
        // Check topic relevance
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
        warning.classList.remove('hidden');
        
        setTimeout(() => {
            warning.classList.add('hidden');
        }, 5000);
    },
    
    // Show blocked message warning
    showBlockedWarning: function(reason) {
        const warning = document.getElementById('blocked-warning');
        warning.textContent = `🚫 Message blocked: ${reason}`;
        warning.classList.remove('hidden');
        
        setTimeout(() => {
            warning.classList.add('hidden');
        }, 3000);
    },
    
    // Handle typing indicator
    handleTyping: function() {
        // Clear previous timeout
        if (this.typingTimeout) {
            clearTimeout(this.typingTimeout);
        }
        
        // Add current user to typing users
        this.typingUsers.add(this.currentUser.id);
        this.updateTypingIndicator();
        
        // Set timeout to remove typing indicator
        this.typingTimeout = setTimeout(() => {
            this.typingUsers.delete(this.currentUser.id);
            this.updateTypingIndicator();
        }, 2000);
    },
    
    // Update typing indicator
    updateTypingIndicator: function() {
        const indicator = document.getElementById('typing-indicator');
        if (!indicator) return;
        
        if (this.typingUsers.size > 0) {
            const count = this.typingUsers.size;
            indicator.textContent = count === 1 
                ? 'Someone is typing...' 
                : `${count} people are typing...`;
            indicator.classList.add('visible');
        } else {
            indicator.classList.remove('visible');
        }
    },
    
    // Stop typing
    stopTyping: function() {
        this.typingUsers.delete(this.currentUser.id);
        this.updateTypingIndicator();
    },
    
    // Simulate user joining
    simulateJoin: function() {
        setTimeout(() => {
            // Add system message
            const systemMsg = {
                id: 'system-' + Date.now(),
                system: true,
                content: `${this.currentUser.name} joined the room`,
                timestamp: new Date().toISOString()
            };
            
            this.messages.push(systemMsg);
            this.addMessageToFeed(systemMsg);
        }, 1000);
    },
    
    // Simulate reply from another user
    simulateReply: function() {
        setTimeout(() => {
            const replies = [
                "That's a great point!",
                "Thanks for sharing!",
                "I completely agree.",
                "Can you elaborate on that?",
                "Interesting perspective!"
            ];
            
            const randomReply = replies[Math.floor(Math.random() * replies.length)];
            const randomUser = {
                id: 4,
                name: 'Emma',
                avatar: 'https://i.pravatar.cc/100?u=emma'
            };
            
            const replyMsg = {
                id: Date.now(),
                userId: randomUser.id,
                userName: randomUser.name,
                avatar: randomUser.avatar,
                content: randomReply,
                timestamp: new Date().toISOString()
            };
            
            this.messages.push(replyMsg);
            this.addMessageToFeed(replyMsg);
        }, 3000);
    },
    
    // Save messages to localStorage
    saveMessages: function() {
        localStorage.setItem(`messages-${this.currentRoom?.id}`, JSON.stringify(this.messages));
    },
    
    // Scroll chat to bottom
    scrollToBottom: function() {
        const chatFeed = document.getElementById('chat-messages');
        chatFeed.scrollTop = chatFeed.scrollHeight;
    },
    
    // Show room information
    showRoomInfo: function() {
        if (!this.currentRoom) return;
        
        const info = `
📌 Room: ${this.currentRoom.name}
📚 Topic: ${this.currentRoom.topic}
🔒 Type: ${this.currentRoom.type}
👥 Members: ${this.currentRoom.members?.length || 1}
📝 Description: ${this.currentRoom.description || 'No description'}
📅 Created: ${new Date(this.currentRoom.createdAt || Date.now()).toLocaleDateString()}
        `;
        
        alert(info);
    },
    
    // Share room invite link
    shareRoom: function() {
        if (this.currentRoom?.type === 'private') {
            const link = this.currentRoom.inviteLink || 'https://wele.com/join/abc123';
            prompt('Share this invite link with your team:', link);
        }
    },
    
    // Show room members
    showMembers: function() {
        const members = this.currentRoom?.members || [
            { name: 'James Jason', role: 'user', status: 'online' },
            { name: 'Jordan', role: 'mentor', status: 'online' },
            { name: 'Alex', role: 'user', status: 'away' },
            { name: 'Emma', role: 'user', status: 'offline' }
        ];
        
        let memberList = 'Room Members:\n\n';
        members.forEach(m => {
            memberList += `${m.name} ${m.role === 'mentor' ? '👨‍🏫' : ''} - ${m.status}\n`;
        });
        
        alert(memberList);
    },
    
    // Attach file
    attachFile: function() {
        // Create file input
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*,.pdf,.doc,.docx,.txt';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                // In real app, upload file to server
                NotificationsComponent.info(`Uploading ${file.name}...`);
                
                // Simulate upload
                setTimeout(() => {
                    NotificationsComponent.success(`File uploaded: ${file.name}`);
                    
                    // Add message with attachment
                    const attachmentMsg = {
                        id: Date.now(),
                        userId: this.currentUser.id,
                        userName: this.currentUser.name,
                        avatar: this.currentUser.avatar,
                        content: `Shared a file: ${file.name}`,
                        attachments: [{
                            name: file.name,
                            type: file.type,
                            url: URL.createObjectURL(file)
                        }],
                        timestamp: new Date().toISOString()
                    };
                    
                    this.messages.push(attachmentMsg);
                    this.addMessageToFeed(attachmentMsg);
                    this.saveMessages();
                }, 2000);
            }
        };
        
        input.click();
    },
    
    // Add reaction to message
    addReaction: function(emoji) {
        NotificationsComponent.info(`Added reaction ${emoji}`);
    },
    
    // Exit room
    exitRoom: function() {
        if (confirm('Are you sure you want to exit this room?')) {
            // Remove user from room members
            if (this.currentRoom && this.currentRoom.members) {
                this.currentRoom.members = this.currentRoom.members.filter(
                    m => m.id !== this.currentUser.id
                );
            }
            
            // Navigate to dashboard
            if (window.App) {
                window.App.navigateToView('home');
            }
            
            NotificationsComponent.success(`Exited ${this.currentRoom?.name}`);
            this.currentRoom = null;
        }
    },
    
    // Show room page
    show: function(room) {
        if (room) {
            this.setRoom(room);
        }
        
        document.getElementById('auth-view').style.display = 'none';
        document.getElementById('home-view').style.display = 'none';
        document.getElementById('admin-view') && (document.getElementById('admin-view').style.display = 'none');
        document.getElementById('room-view').style.display = 'flex';
    },
    
    // Hide room page
    hide: function() {
        document.getElementById('room-view').style.display = 'none';
    }
};

// Export for use in other files
window.RoomPage = RoomPage;