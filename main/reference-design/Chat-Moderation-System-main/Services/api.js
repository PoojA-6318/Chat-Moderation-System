// =========================================
// API SERVICE
// Handles all API calls and HTTP requests
// =========================================

const ApiService = {
    // Base URL for API
    baseURL: 'https://api.wele.com/v1',
    
    // Mock mode (for development)
    mockMode: true,
    
    // Request timeout in milliseconds
    timeout: 10000,
    
    // Default headers
    defaultHeaders: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    
    // Initialize API service
    init: function() {
        // Check if we're in development mode
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            this.mockMode = true;
            console.log('API Service running in mock mode');
        }
        
        // Add auth token to default headers if available
        const token = this.getToken();
        if (token) {
            this.defaultHeaders['Authorization'] = `Bearer ${token}`;
        }
    },
    
    // Get auth token from storage
    getToken: function() {
        return localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
    },
    
    // Set auth token
    setToken: function(token, remember = false) {
        if (remember) {
            localStorage.setItem('auth_token', token);
        } else {
            sessionStorage.setItem('auth_token', token);
        }
        this.defaultHeaders['Authorization'] = `Bearer ${token}`;
    },
    
    // Remove auth token
    removeToken: function() {
        localStorage.removeItem('auth_token');
        sessionStorage.removeItem('auth_token');
        delete this.defaultHeaders['Authorization'];
    },
    
    // Make HTTP request
    async request(endpoint, options = {}) {
        const url = this.mockMode ? `/mock${endpoint}` : `${this.baseURL}${endpoint}`;
        
        const config = {
            ...options,
            headers: {
                ...this.defaultHeaders,
                ...options.headers
            }
        };
        
        // Add timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);
        
        try {
            if (this.mockMode) {
                // Simulate network delay
                await this.sleep(500);
                return this.handleMockRequest(endpoint, options);
            }
            
            const response = await fetch(url, {
                ...config,
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            clearTimeout(timeoutId);
            this.handleError(error);
            throw error;
        }
    },
    
    // Sleep function for mock mode
    sleep: function(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },
    
    // Handle mock requests
    handleMockRequest: function(endpoint, options) {
        // Parse endpoint and method
        const method = options.method || 'GET';
        
        // Mock responses based on endpoint
        if (endpoint.startsWith('/auth/login') && method === 'POST') {
            return this.mockLogin(options.body);
        }
        
        if (endpoint.startsWith('/auth/register') && method === 'POST') {
            return this.mockRegister(options.body);
        }
        
        if (endpoint.startsWith('/rooms')) {
            return this.mockRooms(endpoint, method, options);
        }
        
        if (endpoint.startsWith('/messages')) {
            return this.mockMessages(endpoint, method, options);
        }
        
        if (endpoint.startsWith('/keywords')) {
            return this.mockKeywords(endpoint, method, options);
        }
        
        // Default mock response
        return {
            success: true,
            data: {},
            message: 'Mock response'
        };
    },
    
    // Mock login
    mockLogin: function(body) {
        const { email, password } = JSON.parse(body || '{}');
        
        // Mock user database
        const users = {
            'admin@wele.com': {
                id: 1,
                name: 'Admin User',
                email: 'admin@wele.com',
                role: 'admin',
                avatar: 'https://i.pravatar.cc/100?u=admin'
            },
            'mentor@wele.com': {
                id: 2,
                name: 'Sarah Mentor',
                email: 'mentor@wele.com',
                role: 'mentor',
                avatar: 'https://i.pravatar.cc/100?u=sarah'
            },
            'user@wele.com': {
                id: 3,
                name: 'James Jason',
                email: 'user@wele.com',
                role: 'user',
                avatar: 'https://i.pravatar.cc/100?u=james'
            }
        };
        
        const user = users[email];
        
        if (user && password === 'password123') {
            return {
                success: true,
                data: {
                    user,
                    token: 'mock_jwt_token_' + Date.now(),
                    expiresIn: 86400
                },
                message: 'Login successful'
            };
        }
        
        throw new Error('Invalid email or password');
    },
    
    // Mock register
    mockRegister: function(body) {
        const { name, email, password, applyAsMentor } = JSON.parse(body || '{}');
        
        return {
            success: true,
            data: {
                user: {
                    id: Date.now(),
                    name,
                    email,
                    role: applyAsMentor ? 'pending_mentor' : 'user',
                    avatar: `https://i.pravatar.cc/100?u=${email}`,
                    createdAt: new Date().toISOString()
                },
                token: 'mock_jwt_token_' + Date.now(),
                expiresIn: 86400
            },
            message: applyAsMentor ? 'Registration successful! Mentor application pending.' : 'Registration successful!'
        };
    },
    
    // Mock rooms endpoints
    mockRooms: function(endpoint, method, options) {
        const rooms = JSON.parse(localStorage.getItem('rooms') || '[]');
        
        // GET /rooms - list all rooms
        if (method === 'GET' && endpoint === '/rooms') {
            return {
                success: true,
                data: rooms,
                message: 'Rooms retrieved successfully'
            };
        }
        
        // GET /rooms/:id - get single room
        const match = endpoint.match(/\/rooms\/(\d+)/);
        if (method === 'GET' && match) {
            const id = parseInt(match[1]);
            const room = rooms.find(r => r.id === id);
            
            if (room) {
                return {
                    success: true,
                    data: room,
                    message: 'Room retrieved successfully'
                };
            }
            throw new Error('Room not found');
        }
        
        // POST /rooms - create room
        if (method === 'POST' && endpoint === '/rooms') {
            const roomData = JSON.parse(options.body || '{}');
            const newRoom = {
                id: Date.now(),
                ...roomData,
                createdAt: new Date().toISOString(),
                members: 1
            };
            
            rooms.push(newRoom);
            localStorage.setItem('rooms', JSON.stringify(rooms));
            
            return {
                success: true,
                data: newRoom,
                message: 'Room created successfully'
            };
        }
        
        // PUT /rooms/:id - update room
        if (method === 'PUT' && match) {
            const id = parseInt(match[1]);
            const updateData = JSON.parse(options.body || '{}');
            const index = rooms.findIndex(r => r.id === id);
            
            if (index !== -1) {
                rooms[index] = { ...rooms[index], ...updateData };
                localStorage.setItem('rooms', JSON.stringify(rooms));
                
                return {
                    success: true,
                    data: rooms[index],
                    message: 'Room updated successfully'
                };
            }
            throw new Error('Room not found');
        }
        
        // DELETE /rooms/:id - delete room
        if (method === 'DELETE' && match) {
            const id = parseInt(match[1]);
            const index = rooms.findIndex(r => r.id === id);
            
            if (index !== -1) {
                rooms.splice(index, 1);
                localStorage.setItem('rooms', JSON.stringify(rooms));
                
                return {
                    success: true,
                    message: 'Room deleted successfully'
                };
            }
            throw new Error('Room not found');
        }
        
        throw new Error('Endpoint not found');
    },
    
    // Mock messages endpoints
    mockMessages: function(endpoint, method, options) {
        const match = endpoint.match(/\/messages\/room\/(\d+)/);
        
        if (method === 'GET' && match) {
            const roomId = parseInt(match[1]);
            const messages = JSON.parse(localStorage.getItem(`messages-${roomId}`) || '[]');
            
            return {
                success: true,
                data: messages,
                message: 'Messages retrieved successfully'
            };
        }
        
        if (method === 'POST' && endpoint === '/messages') {
            const messageData = JSON.parse(options.body || '{}');
            
            // Store message
            const roomMessages = JSON.parse(localStorage.getItem(`messages-${messageData.roomId}`) || '[]');
            const newMessage = {
                id: Date.now(),
                ...messageData,
                timestamp: new Date().toISOString()
            };
            
            roomMessages.push(newMessage);
            localStorage.setItem(`messages-${messageData.roomId}`, JSON.stringify(roomMessages));
            
            return {
                success: true,
                data: newMessage,
                message: 'Message sent successfully'
            };
        }
        
        throw new Error('Endpoint not found');
    },
    
    // Mock keywords endpoints
    mockKeywords: function(endpoint, method, options) {
        const keywords = JSON.parse(localStorage.getItem('blocked-keywords') || '[]');
        
        if (method === 'GET') {
            return {
                success: true,
                data: keywords,
                message: 'Keywords retrieved successfully'
            };
        }
        
        if (method === 'POST') {
            const { keyword } = JSON.parse(options.body || '{}');
            
            if (!keywords.includes(keyword)) {
                keywords.push(keyword);
                localStorage.setItem('blocked-keywords', JSON.stringify(keywords));
            }
            
            return {
                success: true,
                data: keywords,
                message: 'Keyword added successfully'
            };
        }
        
        const match = endpoint.match(/\/keywords\/(.+)/);
        if (method === 'DELETE' && match) {
            const keyword = decodeURIComponent(match[1]);
            const index = keywords.indexOf(keyword);
            
            if (index !== -1) {
                keywords.splice(index, 1);
                localStorage.setItem('blocked-keywords', JSON.stringify(keywords));
            }
            
            return {
                success: true,
                data: keywords,
                message: 'Keyword deleted successfully'
            };
        }
        
        throw new Error('Endpoint not found');
    },
    
    // Handle errors
    handleError: function(error) {
        if (error.name === 'AbortError') {
            console.error('Request timeout');
            NotificationsComponent?.error('Request timeout. Please try again.');
        } else {
            console.error('API Error:', error);
            NotificationsComponent?.error(error.message || 'An error occurred');
        }
    },
    
    // HTTP methods
    async get(endpoint, params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const url = queryString ? `${endpoint}?${queryString}` : endpoint;
        return this.request(url, { method: 'GET' });
    },
    
    async post(endpoint, data = {}) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },
    
    async put(endpoint, data = {}) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },
    
    async delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    },
    
    async upload(endpoint, file, onProgress) {
        const formData = new FormData();
        formData.append('file', file);
        
        const xhr = new XMLHttpRequest();
        
        return new Promise((resolve, reject) => {
            xhr.open('POST', this.mockMode ? `/mock${endpoint}` : `${this.baseURL}${endpoint}`);
            
            if (this.getToken()) {
                xhr.setRequestHeader('Authorization', `Bearer ${this.getToken()}`);
            }
            
            xhr.upload.onprogress = (e) => {
                if (e.lengthComputable && onProgress) {
                    const percent = (e.loaded / e.total) * 100;
                    onProgress(percent);
                }
            };
            
            xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve(JSON.parse(xhr.responseText));
                } else {
                    reject(new Error(`Upload failed: ${xhr.status}`));
                }
            };
            
            xhr.onerror = () => reject(new Error('Upload failed'));
            xhr.send(formData);
        });
    }
};

// Initialize API service
ApiService.init();

// Export for use in other files
window.ApiService = ApiService;