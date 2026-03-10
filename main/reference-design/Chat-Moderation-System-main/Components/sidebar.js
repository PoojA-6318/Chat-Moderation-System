// =========================================
// SIDEBAR COMPONENT
// Manages sidebar rendering, navigation, and user info
// =========================================

const SidebarComponent = {
    // Current active view
    activeView: 'home',
    
    // Initialize sidebar
    init: function() {
        this.render();
        this.attachEventListeners();
        this.updateUserInfo();
    },
    
    // Render sidebar HTML
    render: function() {
        const sidebar = document.getElementById('sidebar');
        if (!sidebar) return;
        
        sidebar.innerHTML = `
            <div class="sidebar-top">
                <div class="logo-container">
                    <div class="logo-s">W</div>
                    <span class="brand-name">WeLe</span>
                </div>

                <ul class="nav-menu" id="nav-menu">
                    <li class="nav-item active" data-view="home">
                        <span class="nav-icon">📊</span> Dashboard
                    </li>
                    
                    <li class="nav-label">JOINED ROOMS</li>
                    <!-- Joined rooms will be dynamically added here -->
                    
                    <li class="nav-label">PENDING REQUESTS</li>
                    <!-- Pending requests will be dynamically added here -->
                    
                    <li class="nav-label">MENTOR ROOMS</li>
                    <!-- Mentor rooms will be dynamically added here -->
                </ul>
            </div>

            <div class="sidebar-bottom">
                <div class="theme-switch-container">
                    <span class="theme-label">Dark Mode</span>
                    <label class="theme-switch">
                        <input type="checkbox" id="theme-toggle">
                        <span class="slider"></span>
                    </label>
                </div>

                <div class="user-anchor" id="user-anchor">
                    <!-- User info will be dynamically loaded -->
                </div>
            </div>
        `;
    },
    
    // Attach event listeners
    attachEventListeners: function() {
        // Navigation clicks
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const view = item.dataset.view;
                if (view) {
                    this.setActiveView(view, item);
                    if (window.App && window.App.navigateToView) {
                        window.App.navigateToView(view);
                    }
                }
            });
        });
        
        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('change', function() {
                if (this.checked) {
                    document.documentElement.setAttribute('data-theme', 'dark');
                    localStorage.setItem('wele-theme', 'dark');
                } else {
                    document.documentElement.setAttribute('data-theme', 'light');
                    localStorage.setItem('wele-theme', 'light');
                }
            });
            
            // Load saved theme
            const savedTheme = localStorage.getItem('wele-theme');
            if (savedTheme === 'dark') {
                themeToggle.checked = true;
                document.documentElement.setAttribute('data-theme', 'dark');
            }
        }
    },
    
    // Set active view in sidebar
    setActiveView: function(view, element) {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        element.classList.add('active');
        this.activeView = view;
    },
    
    // Update user information in sidebar
    updateUserInfo: function(user) {
        const userAnchor = document.getElementById('user-anchor');
        if (!userAnchor) return;
        
        const currentUser = user || window.App?.getCurrentUser() || {
            name: 'James Jason',
            role: 'Learner',
            avatar: 'https://i.pravatar.cc/100?u=alex'
        };
        
        userAnchor.innerHTML = `
            <img src="${currentUser.avatar}" alt="${currentUser.name}">
            <div class="user-meta">
                <span class="user-name">${currentUser.name}</span>
                <span class="user-role">${currentUser.role}</span>
                <span class="sign-out-text" id="sign-out-btn">Sign Out</span>
            </div>
        `;
        
        // Attach sign out handler
        document.getElementById('sign-out-btn')?.addEventListener('click', () => {
            if (window.App && window.App.handleSignOut) {
                window.App.handleSignOut();
            }
        });
    },
    
    // Add a room to sidebar
    addRoom: function(room, category = 'JOINED ROOMS') {
        const navMenu = document.getElementById('nav-menu');
        const labels = navMenu.querySelectorAll('.nav-label');
        
        let targetLabel = null;
        for (let label of labels) {
            if (label.textContent === category) {
                targetLabel = label;
                break;
            }
        }
        
        if (targetLabel) {
            const roomItem = document.createElement('li');
            roomItem.className = `nav-item room ${room.type || ''}`;
            roomItem.dataset.view = room.name;
            roomItem.innerHTML = `
                <span class="hash">#</span> ${room.name}
                ${room.badge ? `<span class="${room.badgeClass || 'mentor-badge'}">${room.badge}</span>` : ''}
            `;
            
            roomItem.addEventListener('click', () => {
                this.setActiveView(room.name, roomItem);
                if (window.App && window.App.navigateToView) {
                    window.App.navigateToView(room.name);
                }
            });
            
            targetLabel.insertAdjacentElement('afterend', roomItem);
        }
    },
    
    // Add pending request to sidebar
    addPendingRequest: function(request) {
        const navMenu = document.getElementById('nav-menu');
        const pendingLabel = Array.from(navMenu.querySelectorAll('.nav-label')).find(
            label => label.textContent === 'PENDING REQUESTS'
        );
        
        if (pendingLabel) {
            const pendingItem = document.createElement('li');
            pendingItem.className = 'nav-item pending';
            pendingItem.innerHTML = `
                <span class="hash">#</span> ${request.name}
                <span class="wait-icon">⏳</span>
            `;
            
            pendingItem.addEventListener('click', () => {
                NotificationsComponent.show('This room request is pending approval.', 'info');
            });
            
            pendingLabel.insertAdjacentElement('afterend', pendingItem);
        }
    },
    
    // Clear all rooms from a category
    clearCategory: function(category) {
        const navMenu = document.getElementById('nav-menu');
        const labels = navMenu.querySelectorAll('.nav-label');
        
        for (let label of labels) {
            if (label.textContent === category) {
                let next = label.nextElementSibling;
                while (next && !next.classList.contains('nav-label')) {
                    const toRemove = next;
                    next = next.nextElementSibling;
                    toRemove.remove();
                }
                break;
            }
        }
    },
    
    // Refresh sidebar with new data
    refresh: function(rooms, pendingRequests) {
        // Clear existing dynamic items
        this.clearCategory('JOINED ROOMS');
        this.clearCategory('PENDING REQUESTS');
        this.clearCategory('MENTOR ROOMS');
        
        // Add rooms
        rooms.forEach(room => {
            if (room.status === 'pending') {
                this.addPendingRequest(room);
            } else if (room.type === 'mentor') {
                this.addRoom(room, 'MENTOR ROOMS');
            } else {
                this.addRoom(room, 'JOINED ROOMS');
            }
        });
        
        // Add pending requests
        pendingRequests?.forEach(request => {
            this.addPendingRequest(request);
        });
    }
};

// Export for use in other files
window.SidebarComponent = SidebarComponent;