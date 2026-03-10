// =========================================
// AUTH SERVICE
// Handles authentication, user management, and sessions
// =========================================

const AuthService = {
    // Current user data
    currentUser: null,
    
    // Auth state change listeners
    listeners: [],
    
    // Initialize auth service
    init: function() {
        this.checkSession();
        this.setupListeners();
    },
    
    // Check for existing session
    checkSession: function() {
        const token = ApiService.getToken();
        if (token) {
            // Try to get user from storage
            const savedUser = localStorage.getItem('current_user') || sessionStorage.getItem('current_user');
            if (savedUser) {
                this.currentUser = JSON.parse(savedUser);
                this.notifyListeners();
            } else {
                // Validate token with server
                this.validateToken(token);
            }
        }
    },
    
    // Validate token with server
    async validateToken(token) {
        try {
            const response = await ApiService.get('/auth/validate');
            if (response.success) {
                this.setUser(response.data.user, !!localStorage.getItem('auth_token'));
            } else {
                this.logout();
            }
        } catch (error) {
            this.logout();
        }
    },
    
    // Setup event listeners
    setupListeners: function() {
        // Listen for storage events (for multi-tab sync)
        window.addEventListener('storage', (e) => {
            if (e.key === 'auth_token' || e.key === 'current_user') {
                this.checkSession();
            }
        });
    },
    
    // Login user
    async login(email, password, remember = false) {
        try {
            const response = await ApiService.post('/auth/login', { email, password });
            
            if (response.success) {
                const { user, token } = response.data;
                
                // Store token
                ApiService.setToken(token, remember);
                
                // Store user
                this.setUser(user, remember);
                
                // Log the event
                this.logAuthEvent('login', user.id);
                
                NotificationsComponent.success(response.message || 'Login successful!');
                return { success: true, user };
            }
            
            return { success: false, error: 'Login failed' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },
    
    // Register new user
    async register(userData) {
        try {
            const response = await ApiService.post('/auth/register', userData);
            
            if (response.success) {
                const { user, token } = response.data;
                
                // Store token
                ApiService.setToken(token, userData.remember || false);
                
                // Store user
                this.setUser(user, userData.remember || false);
                
                // Log the event
                this.logAuthEvent('register', user.id);
                
                // If mentor application, store in pending
                if (userData.applyAsMentor) {
                    this.submitMentorApplication(userData);
                }
                
                NotificationsComponent.success(response.message || 'Registration successful!');
                return { success: true, user };
            }
            
            return { success: false, error: 'Registration failed' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },
    
    // Submit mentor application
    async submitMentorApplication(userData) {
        const application = {
            id: Date.now(),
            userId: this.currentUser?.id,
            userName: userData.name,
            userEmail: userData.email,
            topic: userData.mentorTopic,
            proof: userData.mentorProof,
            status: 'pending',
            submittedAt: new Date().toISOString()
        };
        
        // Store in localStorage
        const applications = JSON.parse(localStorage.getItem('mentor-applications') || '[]');
        applications.push(application);
        localStorage.setItem('mentor-applications', JSON.stringify(applications));
        
        // In real app, send to server
        try {
            await ApiService.post('/auth/mentor-apply', application);
        } catch (error) {
            console.error('Failed to submit mentor application:', error);
        }
    },
    
    // Logout user
    logout: function() {
        // Log the event
        if (this.currentUser) {
            this.logAuthEvent('logout', this.currentUser.id);
        }
        
        // Clear tokens
        ApiService.removeToken();
        
        // Clear user data
        localStorage.removeItem('current_user');
        sessionStorage.removeItem('current_user');
        
        this.currentUser = null;
        this.notifyListeners();
        
        NotificationsComponent.success('Logged out successfully');
    },
    
    // Set current user
    setUser: function(user, remember = false) {
        this.currentUser = user;
        
        // Store user data
        const userStr = JSON.stringify(user);
        if (remember) {
            localStorage.setItem('current_user', userStr);
        } else {
            sessionStorage.setItem('current_user', userStr);
        }
        
        this.notifyListeners();
    },
    
    // Get current user
    getCurrentUser: function() {
        return this.currentUser;
    },
    
    // Check if user is authenticated
    isAuthenticated: function() {
        return !!this.currentUser && !!ApiService.getToken();
    },
    
    // Check if user has role
    hasRole: function(role) {
        return this.currentUser?.role === role;
    },
    
    // Check if user is admin
    isAdmin: function() {
        return this.currentUser?.role === 'admin';
    },
    
    // Check if user is mentor
    isMentor: function() {
        return this.currentUser?.role === 'mentor';
    },
    
    // Update user profile
    async updateProfile(updates) {
        try {
            const response = await ApiService.put('/auth/profile', updates);
            
            if (response.success) {
                this.currentUser = { ...this.currentUser, ...response.data.user };
                this.setUser(this.currentUser, !!localStorage.getItem('current_user'));
                
                NotificationsComponent.success('Profile updated successfully');
                return { success: true, user: this.currentUser };
            }
            
            return { success: false, error: 'Update failed' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },
    
    // Change password
    async changePassword(currentPassword, newPassword) {
        try {
            const response = await ApiService.post('/auth/change-password', {
                currentPassword,
                newPassword
            });
            
            if (response.success) {
                NotificationsComponent.success('Password changed successfully');
                return { success: true };
            }
            
            return { success: false, error: 'Password change failed' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },
    
    // Request password reset
    async requestPasswordReset(email) {
        try {
            const response = await ApiService.post('/auth/forgot-password', { email });
            
            if (response.success) {
                NotificationsComponent.success('Password reset email sent');
                return { success: true };
            }
            
            return { success: false, error: 'Failed to send reset email' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },
    
    // Reset password with token
    async resetPassword(token, newPassword) {
        try {
            const response = await ApiService.post('/auth/reset-password', {
                token,
                newPassword
            });
            
            if (response.success) {
                NotificationsComponent.success('Password reset successful');
                return { success: true };
            }
            
            return { success: false, error: 'Password reset failed' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },
    
    // Log authentication event
    logAuthEvent: function(event, userId) {
        const log = {
            event,
            userId,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            ip: 'client-side' // In real app, this comes from server
        };
        
        // Store in localStorage for demo
        const logs = JSON.parse(localStorage.getItem('auth-logs') || '[]');
        logs.push(log);
        localStorage.setItem('auth-logs', JSON.stringify(logs));
        
        console.log('Auth event:', log);
    },
    
    // Get user permissions
    getPermissions: function() {
        const role = this.currentUser?.role || 'guest';
        
        const permissions = {
            guest: {
                canViewRooms: true,
                canJoinRooms: false,
                canCreateRooms: false,
                canSendMessages: false,
                canManageUsers: false,
                canManageKeywords: false
            },
            user: {
                canViewRooms: true,
                canJoinRooms: true,
                canCreatePrivateRooms: true,
                canRequestPublicRooms: true,
                canSendMessages: true,
                canManageUsers: false,
                canManageKeywords: false
            },
            mentor: {
                canViewRooms: true,
                canJoinRooms: true,
                canCreateRooms: true,
                canSendMessages: true,
                canManageUsers: false,
                canManageKeywords: false,
                canHaveMentorBadge: true
            },
            admin: {
                canViewRooms: true,
                canJoinRooms: true,
                canCreateRooms: true,
                canSendMessages: true,
                canManageUsers: true,
                canManageKeywords: true,
                canManageSystem: true
            }
        };
        
        return permissions[role] || permissions.guest;
    },
    
    // Add auth state listener
    addListener: function(callback) {
        this.listeners.push(callback);
    },
    
    // Remove auth state listener
    removeListener: function(callback) {
        this.listeners = this.listeners.filter(cb => cb !== callback);
    },
    
    // Notify all listeners of auth state change
    notifyListeners: function() {
        this.listeners.forEach(callback => {
            try {
                callback(this.currentUser);
            } catch (error) {
                console.error('Error in auth listener:', error);
            }
        });
    },
    
    // Get session info
    getSessionInfo: function() {
        return {
            isAuthenticated: this.isAuthenticated(),
            user: this.currentUser,
            token: ApiService.getToken(),
            permissions: this.getPermissions()
        };
    }
};

// Initialize auth service
AuthService.init();

// Export for use in other files
window.AuthService = AuthService;