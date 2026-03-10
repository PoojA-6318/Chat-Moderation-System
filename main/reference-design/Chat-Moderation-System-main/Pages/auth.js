// =========================================
// AUTHENTICATION PAGE
// Manages login, signup, and mentor application
// =========================================

const AuthPage = {
    // Current active tab
    activeTab: 'login',
    
    // Initialize auth page
    init: function() {
        this.render();
        this.attachEventListeners();
        this.checkSavedTheme();
    },
    
    // Render auth page
    render: function() {
        const authView = document.getElementById('auth-view');
        if (!authView) return;
        
        authView.innerHTML = `
            <div class="auth-card">
                <div class="auth-header">
                    <div class="logo-s">W</div>
                    <h2>Welcome to WeLe</h2>
                    <p>Collaborative learning platform</p>
                </div>
                
                <div class="auth-tabs">
                    <button class="tab-btn ${this.activeTab === 'login' ? 'active' : ''}" data-tab="login">Login</button>
                    <button class="tab-btn ${this.activeTab === 'signup' ? 'active' : ''}" data-tab="signup">Sign Up</button>
                </div>

                <!-- Login Form -->
                <form id="login-form" class="auth-form ${this.activeTab === 'login' ? 'active' : ''}">
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" id="login-email" placeholder="Enter your email" required>
                    </div>
                    <div class="form-group">
                        <label>Password</label>
                        <input type="password" id="login-password" placeholder="Enter your password" required>
                    </div>
                    <div class="form-group">
                        <label class="checkbox-label">
                            <input type="checkbox" id="remember-me"> Remember me
                        </label>
                    </div>
                    <button type="submit" class="btn-primary">Login</button>
                    
                    <div style="margin-top: 20px; text-align: center;">
                        <a href="#" id="forgot-password" style="color: var(--primary); text-decoration: none; font-size: 14px;">Forgot Password?</a>
                    </div>
                </form>

                <!-- Sign Up Form -->
                <form id="signup-form" class="auth-form ${this.activeTab === 'signup' ? 'active' : ''}">
                    <div class="form-group">
                        <label>Full Name</label>
                        <input type="text" id="signup-name" placeholder="Enter your full name" required>
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" id="signup-email" placeholder="Enter your email" required>
                    </div>
                    <div class="form-group">
                        <label>Password</label>
                        <input type="password" id="signup-password" placeholder="Create a password" required>
                    </div>
                    <div class="form-group">
                        <label>Confirm Password</label>
                        <input type="password" id="signup-confirm-password" placeholder="Confirm your password" required>
                    </div>
                    
                    <!-- Mentor Application Toggle -->
                    <div class="mentor-toggle">
                        <label class="checkbox-label">
                            <input type="checkbox" id="apply-mentor"> Apply as Mentor
                        </label>
                    </div>

                    <!-- Mentor Application Fields -->
                    <div id="mentor-fields" class="mentor-fields hidden">
                        <div class="form-group">
                            <label>Proposed Room Topic</label>
                            <input type="text" id="mentor-topic" placeholder="e.g., Advanced Machine Learning">
                        </div>
                        <div class="form-group">
                            <label>Proof of Expertise</label>
                            <textarea id="mentor-proof" placeholder="Share your qualifications, experience, portfolio links..." rows="4"></textarea>
                            <small>Provide evidence of your expertise in this topic</small>
                        </div>
                        <div class="info-message">
                            ⏰ You will be notified within 24 hours about your mentor application.
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="checkbox-label">
                            <input type="checkbox" id="terms-agree" required> I agree to the <a href="#" style="color: var(--primary);">Terms of Service</a> and <a href="#" style="color: var(--primary);">Privacy Policy</a>
                        </label>
                    </div>

                    <button type="submit" class="btn-primary">Create Account</button>
                </form>
            </div>
        `;
    },
    
    // Attach event listeners
    attachEventListeners: function() {
        // Tab switching
        document.querySelectorAll('[data-tab]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.target.dataset.tab;
                this.switchTab(tab);
            });
        });
        
        // Login form submit
        document.getElementById('login-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });
        
        // Signup form submit
        document.getElementById('signup-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSignup();
        });
        
        // Mentor toggle
        document.getElementById('apply-mentor')?.addEventListener('change', (e) => {
            this.toggleMentorFields(e.target.checked);
        });
        
        // Forgot password
        document.getElementById('forgot-password')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.handleForgotPassword();
        });
    },
    
    // Switch between login and signup tabs
    switchTab: function(tab) {
        this.activeTab = tab;
        
        // Update tab buttons
        document.querySelectorAll('[data-tab]').forEach(btn => {
            if (btn.dataset.tab === tab) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        // Update forms
        document.getElementById('login-form').classList.toggle('active', tab === 'login');
        document.getElementById('signup-form').classList.toggle('active', tab === 'signup');
    },
    
    // Toggle mentor fields visibility
    toggleMentorFields: function(show) {
        const mentorFields = document.getElementById('mentor-fields');
        if (show) {
            mentorFields.classList.remove('hidden');
        } else {
            mentorFields.classList.add('hidden');
        }
    },
    
    // Handle login
    handleLogin: function() {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const rememberMe = document.getElementById('remember-me').checked;
        
        // Basic validation
        if (!email || !password) {
            NotificationsComponent.error('Please fill in all fields');
            return;
        }
        
        // Mock login - in real app, this would be an API call
        if (email === 'admin@wele.com' && password === 'admin123') {
            // Admin user
            const user = {
                id: 1,
                name: 'Admin User',
                email: email,
                role: 'admin',
                avatar: 'https://i.pravatar.cc/100?u=admin'
            };
            this.setUser(user);
            NotificationsComponent.success('Login successful! Welcome back, Admin.');
        } else if (email === 'mentor@wele.com' && password === 'mentor123') {
            // Mentor user
            const user = {
                id: 2,
                name: 'Sarah Mentor',
                email: email,
                role: 'mentor',
                avatar: 'https://i.pravatar.cc/100?u=sarah'
            };
            this.setUser(user);
            NotificationsComponent.success('Login successful! Welcome back, Mentor.');
        } else if (email && password) {
            // Regular user
            const user = {
                id: 3,
                name: email.split('@')[0],
                email: email,
                role: 'user',
                avatar: 'https://i.pravatar.cc/100?u=' + email
            };
            this.setUser(user);
            NotificationsComponent.success('Login successful! Welcome back.');
        } else {
            NotificationsComponent.error('Invalid email or password');
        }
        
        // Save session if remember me checked
        if (rememberMe) {
            localStorage.setItem('remembered-email', email);
        }
    },
    
    // Handle signup
    handleSignup: function() {
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('signup-confirm-password').value;
        const termsAgree = document.getElementById('terms-agree').checked;
        
        // Validation
        if (!name || !email || !password || !confirmPassword) {
            NotificationsComponent.error('Please fill in all fields');
            return;
        }
        
        if (password !== confirmPassword) {
            NotificationsComponent.error('Passwords do not match');
            return;
        }
        
        if (password.length < 6) {
            NotificationsComponent.error('Password must be at least 6 characters');
            return;
        }
        
        if (!termsAgree) {
            NotificationsComponent.error('You must agree to the Terms of Service');
            return;
        }
        
        const applyAsMentor = document.getElementById('apply-mentor').checked;
        
        if (applyAsMentor) {
            const mentorTopic = document.getElementById('mentor-topic').value;
            const mentorProof = document.getElementById('mentor-proof').value;
            
            if (!mentorTopic || !mentorProof) {
                NotificationsComponent.error('Please fill in mentor application fields');
                return;
            }
            
            // Create mentor request
            const request = {
                id: Date.now(),
                userName: name,
                userEmail: email,
                topic: mentorTopic,
                proof: mentorProof,
                status: 'pending',
                submittedAt: new Date().toISOString()
            };
            
            // Store in localStorage for demo
            const requests = JSON.parse(localStorage.getItem('mentor-requests') || '[]');
            requests.push(request);
            localStorage.setItem('mentor-requests', JSON.stringify(requests));
            
            NotificationsComponent.show('Mentor application submitted! You will be notified within 24 hours.', 'success');
        }
        
        // Create user
        const user = {
            id: Date.now(),
            name: name,
            email: email,
            role: 'user',
            avatar: 'https://i.pravatar.cc/100?u=' + email
        };
        
        this.setUser(user);
        NotificationsComponent.success('Account created successfully!');
    },
    
    // Handle forgot password
    handleForgotPassword: function() {
        const email = document.getElementById('login-email').value;
        
        if (!email) {
            NotificationsComponent.warning('Please enter your email address');
            return;
        }
        
        // Mock password reset
        NotificationsComponent.show(`Password reset link sent to ${email}`, 'info');
    },
    
    // Set user and redirect to dashboard
    setUser: function(user) {
        // Store in session
        sessionStorage.setItem('current-user', JSON.stringify(user));
        
        // Trigger app initialization with user
        if (window.App) {
            window.App.setCurrentUser(user);
            window.App.showDashboard();
        }
        
        // Update sidebar
        if (window.SidebarComponent) {
            window.SidebarComponent.updateUserInfo(user);
        }
    },
    
    // Check for saved theme
    checkSavedTheme: function() {
        const savedTheme = localStorage.getItem('wele-theme');
        if (savedTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            const themeToggle = document.getElementById('theme-toggle');
            if (themeToggle) themeToggle.checked = true;
        }
    },
    
    // Check for remembered email
    checkRememberedEmail: function() {
        const remembered = localStorage.getItem('remembered-email');
        if (remembered) {
            const emailInput = document.getElementById('login-email');
            if (emailInput) {
                emailInput.value = remembered;
                document.getElementById('remember-me').checked = true;
            }
        }
    },
    
    // Show auth page
    show: function() {
        document.getElementById('auth-view').style.display = 'flex';
        document.getElementById('home-view').style.display = 'none';
        document.getElementById('room-view').style.display = 'none';
        this.render();
        this.attachEventListeners();
        this.checkRememberedEmail();
    },
    
    // Hide auth page
    hide: function() {
        document.getElementById('auth-view').style.display = 'none';
    }
};

// Export for use in other files
window.AuthPage = AuthPage;