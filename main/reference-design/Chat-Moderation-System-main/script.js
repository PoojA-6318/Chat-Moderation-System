// =========================================
// STATE MANAGEMENT
// =========================================
let currentUser = null;
let currentRoom = null;
let blockedKeywords = [
    'spam', 'advertisement', 'buy now', 'discount', 'free money',
    'hate', 'violence', 'inappropriate', 'scam', 'fraud',
    'porn', 'sex', 'drugs', 'gambling', 'casino'
];

let rooms = [];
let mentorRequests = [];
let roomRequests = [];

// Check authentication on load
function checkAuth() {
    const savedUser = localStorage.getItem('wele-current-user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        return true;
    }
    return false;
}

// Redirect to auth if not logged in
/*if (!checkAuth()) {
    window.location.href = 'auth/login.html';
}*/

// Initialize mock rooms
rooms = [
    {
        id: 1,
        name: 'Design Strategy',
        topic: 'UI/UX Design Principles and Strategy',
        type: 'public',
        members: 15,
        createdBy: 2,
        description: 'Learn and discuss UI/UX design principles, user research, and design thinking.'
    },
    {
        id: 2,
        name: 'Web Dev Hub',
        topic: 'Modern Web Development',
        type: 'public',
        members: 23,
        createdBy: 2,
        description: 'Everything about modern web development - React, Vue, Node.js, and more.'
    },
    {
        id: 3,
        name: 'UX Research',
        topic: 'User Research Methods',
        type: 'public',
        members: 8,
        createdBy: 2,
        description: 'Discuss user research methodologies, usability testing, and research tools.'
    }
];

// Load saved rooms from localStorage
const savedRooms = localStorage.getItem('wele-rooms');
if (savedRooms) {
    rooms = JSON.parse(savedRooms);
}

// Load saved mentor requests
const savedMentorRequests = localStorage.getItem('wele-mentor-requests');
if (savedMentorRequests) {
    mentorRequests = JSON.parse(savedMentorRequests);
}

// Load saved room requests
const savedRoomRequests = localStorage.getItem('wele-room-requests');
if (savedRoomRequests) {
    roomRequests = JSON.parse(savedRoomRequests);
}

// =========================================
// VIEW NAVIGATION
// =========================================
function showView(viewName, element) {
    // Update active state
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    element.classList.add('active');

    const homeView = document.getElementById('home-view');
    const roomView = document.getElementById('room-view');
    
    if (viewName === 'home') {
        homeView.style.display = 'flex';
        roomView.style.display = 'none';
        currentRoom = null;
    } else {
        homeView.style.display = 'none';
        roomView.style.display = 'flex';
        
        // Find room
        const room = rooms.find(r => r.name === viewName);
        if (room) {
            currentRoom = room;
            document.getElementById('active-room-name').textContent = viewName;
            document.getElementById('room-topic').textContent = room.topic;
            
            // Update room type badge
            const badge = document.getElementById('room-type-badge');
            badge.textContent = room.type === 'private' ? 'Private' : 'Public';
            badge.className = `room-badge ${room.type}`;
            
            // Show/hide share button
            const shareBtn = document.getElementById('share-room-btn');
            if (room.type === 'private' && room.createdBy === currentUser?.id) {
                shareBtn.style.display = 'inline-flex';
            } else {
                shareBtn.style.display = 'none';
            }
        }
    }
}

function handleSignOut() {
    if (confirm('Are you sure you want to sign out?')) {
        // Clear user data
        localStorage.removeItem('wele-current-user');
        
        // Show notification
        showNotification('Signed out successfully', 'success');
        
        // Redirect to login page
        setTimeout(() => {
            window.location.href = 'auth/login.html';
        }, 1500);
    }
}

// =========================================
// ROOM MANAGEMENT
// =========================================
function displayRooms() {
    const publicRoomsDiv = document.getElementById('public-rooms');
    const yourRoomsDiv = document.getElementById('your-rooms');
    
    if (!publicRoomsDiv || !yourRoomsDiv) return;
    
    publicRoomsDiv.innerHTML = '';
    yourRoomsDiv.innerHTML = '';
    
    // Filter out pending rooms for regular users
    const visibleRooms = rooms.filter(room => {
        if (room.status === 'pending' && currentUser?.role !== 'admin') {
            return false;
        }
        return true;
    });
    
    visibleRooms.forEach(room => {
        const roomCard = createRoomCard(room);
        
        if (room.type === 'public' && room.status !== 'pending') {
            publicRoomsDiv.appendChild(roomCard);
        }
        
        // Show in "Your Rooms" if created by current user
        if (room.createdBy === currentUser?.id) {
            yourRoomsDiv.appendChild(roomCard.cloneNode(true));
        }
    });
    
    // If no rooms, show appropriate message
    if (publicRoomsDiv.children.length === 0) {
        publicRoomsDiv.innerHTML = '<p class="no-rooms">No public rooms available</p>';
    }
    
    if (yourRoomsDiv.children.length === 0) {
        yourRoomsDiv.innerHTML = '<p class="no-rooms">You haven\'t joined any rooms yet</p>';
    }
}

function createRoomCard(room) {
    const card = document.createElement('div');
    card.className = 'room-card';
    card.innerHTML = `
        <div class="room-card-header">
            <span class="room-type ${room.type}">${room.type === 'public' ? '🌐 Public' : '🔒 Private'}</span>
            <span class="member-count">👥 ${room.members || 1}</span>
        </div>
        <h3>${room.name}</h3>
        <div class="room-topic">${room.topic}</div>
        <div class="room-meta">
            <span>${room.description || 'Join the discussion!'}</span>
        </div>
        <button class="join-btn" onclick="joinRoom(${room.id})">Join Room</button>
    `;
    return card;
}

function joinRoom(roomId) {
    const room = rooms.find(r => r.id === roomId);
    if (room) {
        // Find sidebar item
        const sidebarItems = document.querySelectorAll('.nav-item.room');
        for (let item of sidebarItems) {
            if (item.textContent.includes(room.name)) {
                showView(room.name, item);
                break;
            }
        }
        showNotification(`Joined ${room.name}`, 'success');
    }
}

function exitRoom() {
    if (confirm('Are you sure you want to exit this room?')) {
        const dashboardItem = document.querySelector('.nav-item[onclick="showView(\'home\', this)"]');
        if (dashboardItem) {
            showView('home', dashboardItem);
        }
        showNotification(`Exited ${currentRoom?.name}`, 'info');
    }
}

function showRoomInfo() {
    if (currentRoom) {
        alert(`
📌 Room: ${currentRoom.name}
📚 Topic: ${currentRoom.topic}
🔒 Type: ${currentRoom.type}
👥 Members: ${currentRoom.members || 1}
📝 Description: ${currentRoom.description || 'No description'}
        `);
    }
}

// =========================================
// MESSAGING
// =========================================
function sendMessage() {
    if (!currentRoom) {
        showNotification('Please select a room first', 'error');
        return;
    }
    
    const input = document.getElementById('user-input');
    const message = input.value.trim();
    
    if (message === '') return;
    
    // Check message content
    const checkResult = checkMessageContent(message, currentRoom.topic);
    
    if (!checkResult.allowed) {
        const warning = document.getElementById('blocked-warning');
        warning.textContent = `🚫 Message blocked: ${checkResult.reason}`;
        warning.classList.remove('hidden');
        
        setTimeout(() => {
            warning.classList.add('hidden');
        }, 3000);
        
        return;
    }
    
    // Add message to chat
    const chatFeed = document.getElementById('chat-messages');
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const messageRow = document.createElement('div');
    messageRow.className = 'msg-row self';
    messageRow.innerHTML = `
        <div class="msg-content">
            <div class="msg-info">
                <small>${time}</small>
            </div>
            <div class="bubble bubble-sent">${escapeHtml(message)}</div>
        </div>
    `;
    
    chatFeed.appendChild(messageRow);
    input.value = '';
    chatFeed.scrollTop = chatFeed.scrollHeight;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function checkMessageContent(message, roomTopic) {
    const lowerMessage = message.toLowerCase();
    const lowerTopic = roomTopic.toLowerCase();
    
    // Check for blocked keywords
    for (let keyword of blockedKeywords) {
        if (lowerMessage.includes(keyword)) {
            return {
                allowed: false,
                reason: 'Contains inappropriate content'
            };
        }
    }
    
    // Check topic relevance (simple version)
    const topicWords = lowerTopic.split(' ');
    let isRelevant = false;
    
    for (let word of topicWords) {
        if (word.length > 3 && lowerMessage.includes(word)) {
            isRelevant = true;
            break;
        }
    }
    
    if (!isRelevant && lowerMessage.length > 10) {
        const warning = document.getElementById('topic-warning');
        warning.classList.remove('hidden');
        
        setTimeout(() => {
            warning.classList.add('hidden');
        }, 5000);
    }
    
    return { allowed: true };
}

// =========================================
// PRIVATE ROOMS & INVITES
// =========================================
function showCreatePrivateRoomModal() {
    document.getElementById('private-room-modal').classList.remove('hidden');
}

document.getElementById('private-room-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const roomName = document.getElementById('private-room-name').value;
    const roomTopic = document.getElementById('private-room-topic').value;
    
    const newRoom = {
        id: Date.now(),
        name: roomName,
        topic: roomTopic,
        type: 'private',
        createdBy: currentUser.id,
        members: 1,
        description: 'Private team room',
        inviteLink: generateInviteLink()
    };
    
    rooms.push(newRoom);
    saveRooms();
    
    document.getElementById('invite-link').value = newRoom.inviteLink;
    document.getElementById('invite-link-container').classList.remove('hidden');
    
    addRoomToSidebar(newRoom);
    showNotification('Private room created successfully!', 'success');
});

function generateInviteLink() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let link = 'https://wele.com/join/';
    for (let i = 0; i < 10; i++) {
        link += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return link;
}

function copyInviteLink() {
    const linkInput = document.getElementById('invite-link');
    linkInput.select();
    document.execCommand('copy');
    showNotification('Invite link copied to clipboard!', 'success');
}

function shareRoom() {
    if (currentRoom && currentRoom.type === 'private') {
        document.getElementById('invite-link').value = currentRoom.inviteLink;
        document.getElementById('invite-link-container').classList.remove('hidden');
    }
}

// =========================================
// ROOM REQUESTS
// =========================================
function showRequestRoomModal() {
    document.getElementById('request-room-modal').classList.remove('hidden');
}

document.getElementById('request-room-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const title = document.getElementById('request-room-title').value;
    const reason = document.getElementById('request-room-reason').value;
    
    const request = {
        id: Date.now(),
        userId: currentUser.id,
        userName: currentUser.name,
        title: title,
        reason: reason,
        status: 'pending',
        submittedAt: new Date().toISOString()
    };
    
    roomRequests.push(request);
    saveRoomRequests();
    
    closeModal('request-room-modal');
    showNotification('Room request submitted! Admin will review it soon.', 'success');
});

// =========================================
// MENTOR APPLICATION
// =========================================
function showMentorApplicationModal() {
    document.getElementById('mentor-application-modal').classList.remove('hidden');
}

document.getElementById('mentor-application-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const topic = document.getElementById('mentor-topic').value;
    const proof = document.getElementById('mentor-proof').value;
    
    const request = {
        id: Date.now(),
        userId: currentUser.id,
        userName: currentUser.name,
        userEmail: currentUser.email,
        topic: topic,
        proof: proof,
        status: 'pending',
        submittedAt: new Date().toISOString()
    };
    
    mentorRequests.push(request);
    saveMentorRequests();
    
    closeModal('mentor-application-modal');
    showNotification('Mentor application submitted! You will be notified within 24 hours.', 'success');
    
    // Update user role to pending_teacher
    currentUser.role = 'pending_teacher';
    localStorage.setItem('wele-current-user', JSON.stringify(currentUser));
    
    // Update UI
    updateSidebarForRole();
});

// =========================================
// ADMIN FUNCTIONS
// =========================================
function showAdminPanel() {
    if (currentUser?.role !== 'admin') {
        showNotification('Access denied. Admin only.', 'error');
        return;
    }
    
    document.getElementById('admin-modal').classList.remove('hidden');
    loadAdminData();
}

function loadAdminData() {
    // Load mentor requests
    const mentorRequestsDiv = document.getElementById('mentor-requests');
    if (mentorRequestsDiv) {
        mentorRequestsDiv.innerHTML = '';
        
        mentorRequests.forEach(request => {
            if (request.status === 'pending') {
                const card = createRequestCard(request, 'mentor');
                mentorRequestsDiv.appendChild(card);
            }
        });
    }
    
    // Load room requests
    const roomRequestsDiv = document.getElementById('room-requests');
    if (roomRequestsDiv) {
        roomRequestsDiv.innerHTML = '';
        
        roomRequests.forEach(request => {
            if (request.status === 'pending') {
                const card = createRequestCard(request, 'room');
                roomRequestsDiv.appendChild(card);
            }
        });
    }
    
    // Load keywords
    loadKeywords();
}

function createRequestCard(request, type) {
    const card = document.createElement('div');
    card.className = 'request-card';
    
    if (type === 'mentor') {
        card.innerHTML = `
            <div class="request-header">
                <span class="request-title">${escapeHtml(request.userName)}</span>
                <span class="request-status">Pending</span>
            </div>
            <div class="request-detail"><strong>Topic:</strong> ${escapeHtml(request.topic)}</div>
            <div class="request-detail"><strong>Proof:</strong> ${escapeHtml(request.proof.substring(0, 100))}${request.proof.length > 100 ? '...' : ''}</div>
            <div class="request-detail"><small>Submitted: ${new Date(request.submittedAt).toLocaleString()}</small></div>
            <div class="request-actions">
                <button class="btn-secondary" onclick="openReviewModal('mentor', ${request.id})">Review</button>
            </div>
        `;
    } else {
        card.innerHTML = `
            <div class="request-header">
                <span class="request-title">${escapeHtml(request.title)}</span>
                <span class="request-status">Pending</span>
            </div>
            <div class="request-detail"><strong>Requested by:</strong> ${escapeHtml(request.userName)}</div>
            <div class="request-detail"><strong>Reason:</strong> ${escapeHtml(request.reason)}</div>
            <div class="request-detail"><small>Submitted: ${new Date(request.submittedAt).toLocaleString()}</small></div>
            <div class="request-actions">
                <button class="btn-secondary" onclick="openReviewModal('room', ${request.id})">Review</button>
            </div>
        `;
    }
    
    return card;
}

function openReviewModal(type, requestId) {
    document.getElementById('review-modal').classList.remove('hidden');
    document.getElementById('review-title').textContent = 
        type === 'mentor' ? 'Review Mentor Application' : 'Review Room Request';
    
    // Store current review context
    window.currentReview = { type, requestId };
}

function submitReview(action) {
    const comments = document.getElementById('review-comments').value;
    if (!comments) {
        showNotification('Please provide comments', 'error');
        return;
    }
    
    const { type, requestId } = window.currentReview;
    
    if (type === 'mentor') {
        const request = mentorRequests.find(r => r.id === requestId);
        if (request) {
            request.status = action === 'approve' ? 'approved' : 'rejected';
            request.adminComments = comments;
            saveMentorRequests();
            
            if (action === 'approve') {
                // Create mentor room
                const newRoom = {
                    id: Date.now(),
                    name: request.topic,
                    topic: request.topic,
                    type: 'public',
                    createdBy: request.userId,
                    members: 1,
                    description: `Mentor room for ${request.topic}`,
                    status: 'active'
                };
                
                rooms.push(newRoom);
                saveRooms();
                addRoomToSidebar(newRoom);
                
                // Update user role in users list
                updateUserRole(request.userId, 'mentor');
                
                showNotification(`Mentor application approved! Room "${request.topic}" created.`, 'success');
            } else {
                showNotification(`Mentor application rejected: ${comments}`, 'info');
            }
        }
    } else {
        const request = roomRequests.find(r => r.id === requestId);
        if (request) {
            request.status = action === 'approve' ? 'approved' : 'rejected';
            request.adminComments = comments;
            saveRoomRequests();
            
            if (action === 'approve') {
                // Create new public room
                const newRoom = {
                    id: Date.now(),
                    name: request.title,
                    topic: request.title,
                    type: 'public',
                    createdBy: request.userId,
                    members: 1,
                    description: request.reason,
                    status: 'active'
                };
                
                rooms.push(newRoom);
                saveRooms();
                addRoomToSidebar(newRoom);
                
                showNotification(`Room "${request.title}" created!`, 'success');
            } else {
                showNotification(`Room request rejected: ${comments}`, 'info');
            }
        }
    }
    
    closeModal('review-modal');
    loadAdminData();
}

// Update user role in users list
function updateUserRole(userId, newRole) {
    const users = JSON.parse(localStorage.getItem('wele-users') || '[]');
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex !== -1) {
        users[userIndex].role = newRole;
        localStorage.setItem('wele-users', JSON.stringify(users));
    }
}

function switchAdminTab(tab) {
    document.querySelectorAll('.admin-tab').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.admin-tab-content').forEach(content => content.classList.remove('active'));
    
    if (tab === 'requests') {
        document.querySelectorAll('.admin-tab')[0]?.classList.add('active');
        document.getElementById('mentor-requests-tab')?.classList.add('active');
    } else if (tab === 'room-requests') {
        document.querySelectorAll('.admin-tab')[1]?.classList.add('active');
        document.getElementById('room-requests-tab')?.classList.add('active');
    } else if (tab === 'keywords') {
        document.querySelectorAll('.admin-tab')[2]?.classList.add('active');
        document.getElementById('keywords-tab')?.classList.add('active');
    } else {
        document.querySelectorAll('.admin-tab')[3]?.classList.add('active');
        document.getElementById('create-room-tab')?.classList.add('active');
    }
}

// =========================================
// KEYWORD MANAGEMENT
// =========================================
function loadKeywords() {
    const keywordsList = document.getElementById('keywords-list');
    if (!keywordsList) return;
    
    keywordsList.innerHTML = '';
    
    blockedKeywords.forEach(keyword => {
        const item = document.createElement('div');
        item.className = 'keyword-item';
        item.innerHTML = `
            <span class="keyword-text">${escapeHtml(keyword)}</span>
            <span class="delete-keyword" onclick="deleteKeyword('${keyword}')">🗑️</span>
        `;
        keywordsList.appendChild(item);
    });
}

function addKeyword() {
    const input = document.getElementById('new-keyword');
    const keyword = input.value.trim().toLowerCase();
    
    if (keyword) {
        if (!blockedKeywords.includes(keyword)) {
            blockedKeywords.push(keyword);
            showNotification(`Keyword "${keyword}" added`, 'success');
            input.value = '';
            loadKeywords();
        } else {
            showNotification('Keyword already exists', 'warning');
        }
    }
}

function deleteKeyword(keyword) {
    if (confirm(`Delete keyword "${keyword}"?`)) {
        blockedKeywords = blockedKeywords.filter(k => k !== keyword);
        showNotification(`Keyword "${keyword}" deleted`, 'success');
        loadKeywords();
    }
}

// Admin create room
document.getElementById('admin-create-room-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const title = document.getElementById('new-room-title').value;
    const topic = document.getElementById('new-room-topic').value;
    const description = document.getElementById('new-room-description').value;
    
    const newRoom = {
        id: Date.now(),
        name: title,
        topic: topic,
        description: description,
        type: 'public',
        createdBy: currentUser.id,
        members: 1,
        status: 'active'
    };
    
    rooms.push(newRoom);
    saveRooms();
    addRoomToSidebar(newRoom);
    
    closeModal('admin-modal');
    showNotification(`Public room "${title}" created!`, 'success');
});

// =========================================
// UTILITY FUNCTIONS
// =========================================
function closeModal(modalId) {
    document.getElementById(modalId)?.classList.add('hidden');
}

function showNotification(message, type = 'info') {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
    `;
    
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.padding = '12px 24px';
    notification.style.borderRadius = '8px';
    notification.style.backgroundColor = type === 'success' ? '#10b981' : 
                                        type === 'error' ? '#ef4444' : 
                                        type === 'warning' ? '#f59e0b' : '#3b82f6';
    notification.style.color = 'white';
    notification.style.fontWeight = '600';
    notification.style.zIndex = '2000';
    notification.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    notification.style.display = 'flex';
    notification.style.alignItems = 'center';
    notification.style.gap = '12px';
    notification.style.animation = 'slideIn 0.3s ease';
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

function addRoomToSidebar(room) {
    const navMenu = document.querySelector('.nav-menu');
    const joinedRoomsLabel = Array.from(navMenu.children).find(el => 
        el.classList.contains('nav-label') && el.textContent === 'JOINED ROOMS'
    );
    
    if (joinedRoomsLabel) {
        const roomItem = document.createElement('li');
        roomItem.className = 'nav-item room';
        roomItem.setAttribute('onclick', `showView('${room.name}', this)`);
        roomItem.innerHTML = `<span class="hash">#</span> ${escapeHtml(room.name)}`;
        
        joinedRoomsLabel.insertAdjacentElement('afterend', roomItem);
    }
}

function updateSidebarForRole() {
    const mentorAction = document.getElementById('mentor-action');
    const adminAction = document.getElementById('admin-action');
    const quickActions = document.querySelector('.quick-actions');
    
    if (!currentUser) return;
    
    // Remove any existing teacher apply button
    const existingApplyBtn = document.querySelector('.action-btn.teacher-apply');
    if (existingApplyBtn) existingApplyBtn.remove();
    
    const existingPendingBtn = document.querySelector('.action-btn.teacher-pending');
    if (existingPendingBtn) existingPendingBtn.remove();
    
    if (currentUser.role === 'mentor') {
        if (mentorAction) mentorAction.classList.remove('hidden');
        if (adminAction) adminAction.classList.add('hidden');
    } else if (currentUser.role === 'admin') {
        if (mentorAction) mentorAction.classList.add('hidden');
        if (adminAction) adminAction.classList.remove('hidden');
    } else if (currentUser.role === 'pending_teacher') {
        // Show pending status instead of apply button
        if (mentorAction) mentorAction.classList.add('hidden');
        if (adminAction) adminAction.classList.add('hidden');
        
        // Add pending indicator to dashboard
        if (quickActions) {
            const pendingBtn = document.createElement('button');
            pendingBtn.className = 'action-btn teacher-pending';
            pendingBtn.innerHTML = '<span>⏳</span> Application Pending';
            pendingBtn.disabled = true;
            pendingBtn.title = 'Your teacher application is under review';
            quickActions.appendChild(pendingBtn);
        }
    } else {
        // Regular user - show apply button
        if (mentorAction) mentorAction.classList.add('hidden');
        if (adminAction) adminAction.classList.add('hidden');
        
        // Check if user has already applied
        const application = mentorRequests.find(app => app.userId === currentUser.id);
        if (!application && quickActions) {
            const applyBtn = document.createElement('button');
            applyBtn.className = 'action-btn teacher-apply';
            applyBtn.innerHTML = '<span>👨‍🏫</span> Apply as Teacher';
            applyBtn.onclick = showMentorApplicationModal;
            quickActions.appendChild(applyBtn);
        }
    }
}

// Save functions
function saveRooms() {
    localStorage.setItem('wele-rooms', JSON.stringify(rooms));
}

function saveMentorRequests() {
    localStorage.setItem('wele-mentor-requests', JSON.stringify(mentorRequests));
}

function saveRoomRequests() {
    localStorage.setItem('wele-room-requests', JSON.stringify(roomRequests));
}

// =========================================
// THEME TOGGLE
// =========================================
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
    // Load saved theme
    const savedTheme = localStorage.getItem('wele-theme');
    if (savedTheme === 'dark') {
        themeToggle.checked = true;
        document.documentElement.setAttribute('data-theme', 'dark');
    }
    
    themeToggle.addEventListener('change', function() {
        if (this.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('wele-theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('wele-theme', 'light');
        }
    });
}

// =========================================
// INITIALIZATION
// =========================================
document.addEventListener('DOMContentLoaded', function() {
    // Check auth again (in case DOM loads after redirect check)
    if (!checkAuth()) {
        window.location.href = 'auth/login.html';
        return;
    }
    
    // Update user info in UI
    updateUserInfo(currentUser);
    
    // Display rooms
    displayRooms();
    
    // Update UI based on user role
    updateSidebarForRole();
    
    // Show pending notification if applicable
    if (currentUser.role === 'pending_teacher') {
        showPendingTeacherNotification();
    }
    
    // Enter key for messages
    const input = document.getElementById('user-input');
    if (input) {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
    
    // Add animation styles if not already present
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
            
            .notification {
                font-family: 'Plus Jakarta Sans', sans-serif;
            }
        `;
        document.head.appendChild(style);
    }
});

// Update user info in UI
function updateUserInfo(user) {
    // Update sidebar user info
    const userNameElements = document.querySelectorAll('.user-name');
    userNameElements.forEach(el => {
        if (el) el.textContent = user.name;
    });
    
    const userRoleElements = document.querySelectorAll('.user-role');
    userRoleElements.forEach(el => {
        if (el) {
            if (user.role === 'pending_teacher') {
                el.textContent = 'Pending Teacher';
            } else if (user.role === 'mentor') {
                el.textContent = 'Mentor';
            } else if (user.role === 'admin') {
                el.textContent = 'Admin';
            } else {
                el.textContent = 'Learner';
            }
        }
    });
    
    // Update hero badge
    const heroBadge = document.querySelector('.hero-badge strong');
    if (heroBadge) {
        heroBadge.textContent = user.name;
    }
}

// Show pending teacher notification
function showPendingTeacherNotification() {
    // Check if notification already exists
    if (document.querySelector('.pending-teacher-notification')) return;
    
    const notification = document.createElement('div');
    notification.className = 'pending-teacher-notification';
    notification.innerHTML = `
        <i class="fas fa-clock"></i>
        <div>
            <strong>Teacher application pending</strong>
            <p>Your application is under review. <a href="auth/status.html">Check status</a></p>
        </div>
        <button onclick="this.parentElement.remove()">×</button>
    `;
    document.body.appendChild(notification);
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 10000);
}

// Get current user (for other modules)
function getCurrentUser() {
    return currentUser;
}

// Make functions globally available
window.showView = showView;
window.handleSignOut = handleSignOut;
window.joinRoom = joinRoom;
window.exitRoom = exitRoom;
window.showRoomInfo = showRoomInfo;
window.sendMessage = sendMessage;
window.showCreatePrivateRoomModal = showCreatePrivateRoomModal;
window.copyInviteLink = copyInviteLink;
window.shareRoom = shareRoom;
window.showRequestRoomModal = showRequestRoomModal;
window.showMentorApplicationModal = showMentorApplicationModal;
window.showAdminPanel = showAdminPanel;
window.switchAdminTab = switchAdminTab;
window.openReviewModal = openReviewModal;
window.submitReview = submitReview;
window.addKeyword = addKeyword;
window.deleteKeyword = deleteKeyword;
window.closeModal = closeModal;
window.getCurrentUser = getCurrentUser;