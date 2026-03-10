// =========================================
// VALIDATORS
// Form validation and data checking utilities
// =========================================

const Validators = {
    // =========================================
    // User Input Validation
    // =========================================
    
    // Validate email
    email: function(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return {
            valid: regex.test(email),
            message: 'Please enter a valid email address'
        };
    },
    
    // Validate password
    password: function(password, options = {}) {
        const minLength = options.minLength || 6;
        const requireNumber = options.requireNumber !== false;
        const requireLetter = options.requireLetter !== false;
        const requireSpecial = options.requireSpecial || false;
        const requireUppercase = options.requireUppercase || false;
        const requireLowercase = options.requireLowercase || false;
        
        const errors = [];
        
        if (password.length < minLength) {
            errors.push(`at least ${minLength} characters`);
        }
        
        if (requireNumber && !/\d/.test(password)) {
            errors.push('at least one number');
        }
        
        if (requireLetter && !/[a-zA-Z]/.test(password)) {
            errors.push('at least one letter');
        }
        
        if (requireSpecial && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
            errors.push('at least one special character');
        }
        
        if (requireUppercase && !/[A-Z]/.test(password)) {
            errors.push('at least one uppercase letter');
        }
        
        if (requireLowercase && !/[a-z]/.test(password)) {
            errors.push('at least one lowercase letter');
        }
        
        return {
            valid: errors.length === 0,
            message: errors.length ? `Password must contain ${errors.join(', ')}` : 'Password is valid'
        };
    },
    
    // Validate username
    username: function(username) {
        const regex = /^[a-zA-Z0-9_]{3,20}$/;
        return {
            valid: regex.test(username),
            message: 'Username must be 3-20 characters and can only contain letters, numbers, and underscores'
        };
    },
    
    // Validate full name
    fullName: function(name) {
        const trimmed = name.trim();
        return {
            valid: trimmed.length >= 2 && trimmed.length <= 50 && /^[a-zA-Z\s'-]+$/.test(trimmed),
            message: 'Name must be between 2 and 50 characters and contain only letters, spaces, hyphens, and apostrophes'
        };
    },
    
    // Validate phone number
    phone: function(phone) {
        // Remove all non-digit characters
        const digits = phone.replace(/\D/g, '');
        const regex = /^[\+]?[(]?[0-9]{1,3}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,9}$/;
        
        return {
            valid: regex.test(phone) && digits.length >= 10 && digits.length <= 15,
            message: 'Please enter a valid phone number (10-15 digits)'
        };
    },
    
    // Validate age
    age: function(age, min = 13, max = 120) {
        const num = parseInt(age);
        return {
            valid: !isNaN(num) && num >= min && num <= max,
            message: `Age must be between ${min} and ${max}`
        };
    },
    
    // Validate URL
    url: function(url) {
        try {
            new URL(url);
            return {
                valid: true,
                message: 'URL is valid'
            };
        } catch {
            // Try with https:// prefix
            try {
                new URL('https://' + url);
                return {
                    valid: true,
                    message: 'URL is valid (https:// prefix added)'
                };
            } catch {
                return {
                    valid: false,
                    message: 'Please enter a valid URL'
                };
            }
        }
    },
    
    // Validate date of birth
    dateOfBirth: function(dob) {
        const date = new Date(dob);
        const now = new Date();
        const minDate = new Date(now.getFullYear() - 100, now.getMonth(), now.getDate());
        const maxDate = new Date(now.getFullYear() - 13, now.getMonth(), now.getDate());
        
        if (isNaN(date.getTime())) {
            return {
                valid: false,
                message: 'Please enter a valid date'
            };
        }
        
        if (date > maxDate) {
            return {
                valid: false,
                message: 'You must be at least 13 years old'
            };
        }
        
        if (date < minDate) {
            return {
                valid: false,
                message: 'Please enter a valid date of birth'
            };
        }
        
        return {
            valid: true,
            message: 'Date of birth is valid'
        };
    },
    
    // Validate postal code
    postalCode: function(code, country = 'US') {
        const patterns = {
            'US': /^\d{5}(-\d{4})?$/,
            'CA': /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/,
            'UK': /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i,
            'AU': /^\d{4}$/,
            'DE': /^\d{5}$/,
            'FR': /^\d{5}$/,
            'JP': /^\d{3}-\d{4}$/,
            'CN': /^\d{6}$/,
            'IN': /^\d{6}$/,
            'BR': /^\d{5}-\d{3}$/
        };
        
        const pattern = patterns[country] || patterns['US'];
        
        return {
            valid: pattern.test(code),
            message: `Please enter a valid postal code for ${country}`
        };
    },
    
    // =========================================
    // Room Validation
    // =========================================
    
    // Validate room name
    roomName: function(name) {
        const trimmed = name.trim();
        return {
            valid: trimmed.length >= 3 && trimmed.length <= 50 && /^[a-zA-Z0-9\s\-_&()]+$/.test(trimmed),
            message: 'Room name must be 3-50 characters and can only contain letters, numbers, spaces, and basic punctuation'
        };
    },
    
    // Validate room topic
    roomTopic: function(topic) {
        const trimmed = topic.trim();
        return {
            valid: trimmed.length >= 3 && trimmed.length <= 100,
            message: 'Topic must be between 3 and 100 characters'
        };
    },
    
    // Validate room description
    roomDescription: function(description) {
        const trimmed = description.trim();
        return {
            valid: trimmed.length <= 500,
            message: 'Description cannot exceed 500 characters'
        };
    },
    
    // Validate room tags
    roomTags: function(tags) {
        if (!Array.isArray(tags)) tags = tags.split(',').map(t => t.trim());
        
        const invalidTags = tags.filter(tag => 
            tag.length < 2 || tag.length > 20 || !/^[a-zA-Z0-9\-_]+$/.test(tag)
        );
        
        return {
            valid: invalidTags.length === 0 && tags.length <= 10,
            message: invalidTags.length ? 'Tags must be 2-20 characters and contain only letters, numbers, hyphens, and underscores' : 'Tags are valid'
        };
    },
    
    // =========================================
    // Message Validation
    // =========================================
    
    // Validate message content
    message: function(content) {
        const trimmed = content.trim();
        return {
            valid: trimmed.length > 0 && trimmed.length <= 500,
            message: trimmed.length === 0 ? 'Message cannot be empty' : 'Message cannot exceed 500 characters'
        };
    },
    
    // Validate file attachment
    fileAttachment: function(file) {
        const maxSize = 10 * 1024 * 1024; // 10MB
        const allowedTypes = [
            'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
            'application/pdf', 'text/plain', 'text/markdown',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-powerpoint',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'application/zip', 'application/x-zip-compressed'
        ];
        
        if (file.size > maxSize) {
            return {
                valid: false,
                message: `File size cannot exceed 10MB (current: ${(file.size / 1024 / 1024).toFixed(2)}MB)`
            };
        }
        
        if (!allowedTypes.includes(file.type)) {
            return {
                valid: false,
                message: `File type "${file.type}" is not allowed`
            };
        }
        
        return {
            valid: true,
            message: 'File is valid'
        };
    },
    
    // Validate multiple file attachments
    fileAttachments: function(files) {
        if (files.length > 5) {
            return {
                valid: false,
                message: 'Cannot attach more than 5 files'
            };
        }
        
        for (let file of files) {
            const result = this.fileAttachment(file);
            if (!result.valid) {
                return result;
            }
        }
        
        return {
            valid: true,
            message: 'All files are valid'
        };
    },
    
    // =========================================
    // Form Validation
    // =========================================
    
    // Validate login form
    loginForm: function(data) {
        const errors = {};
        
        // Validate email
        if (!data.email || data.email.trim() === '') {
            errors.email = 'Email is required';
        } else {
            const emailCheck = this.email(data.email);
            if (!emailCheck.valid) {
                errors.email = emailCheck.message;
            }
        }
        
        // Validate password
        if (!data.password || data.password.trim() === '') {
            errors.password = 'Password is required';
        }
        
        return {
            valid: Object.keys(errors).length === 0,
            errors
        };
    },
    
    // Validate registration form
    registerForm: function(data) {
        const errors = {};
        
        // Validate name
        if (!data.name || data.name.trim() === '') {
            errors.name = 'Full name is required';
        } else {
            const nameCheck = this.fullName(data.name);
            if (!nameCheck.valid) {
                errors.name = nameCheck.message;
            }
        }
        
        // Validate email
        if (!data.email || data.email.trim() === '') {
            errors.email = 'Email is required';
        } else {
            const emailCheck = this.email(data.email);
            if (!emailCheck.valid) {
                errors.email = emailCheck.message;
            }
        }
        
        // Validate password
        if (!data.password) {
            errors.password = 'Password is required';
        } else {
            const passwordCheck = this.password(data.password);
            if (!passwordCheck.valid) {
                errors.password = passwordCheck.message;
            }
        }
        
        // Validate password confirmation
        if (data.password !== data.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }
        
        // Validate terms agreement
        if (!data.termsAgree) {
            errors.terms = 'You must agree to the terms and conditions';
        }
        
        // Validate mentor fields if applying
        if (data.applyAsMentor) {
            if (!data.mentorTopic || data.mentorTopic.trim() === '') {
                errors.mentorTopic = 'Please enter your proposed room topic';
            } else if (data.mentorTopic.trim().length < 5) {
                errors.mentorTopic = 'Topic must be at least 5 characters';
            }
            
            if (!data.mentorProof || data.mentorProof.trim() === '') {
                errors.mentorProof = 'Please provide proof of expertise';
            } else if (data.mentorProof.trim().length < 20) {
                errors.mentorProof = 'Proof must be at least 20 characters';
            }
        }
        
        return {
            valid: Object.keys(errors).length === 0,
            errors
        };
    },
    
    // Validate room request form
    roomRequestForm: function(data) {
        const errors = {};
        
        // Validate title
        if (!data.title || data.title.trim() === '') {
            errors.title = 'Room title is required';
        } else {
            const nameCheck = this.roomName(data.title);
            if (!nameCheck.valid) {
                errors.title = nameCheck.message;
            }
        }
        
        // Validate reason
        if (!data.reason || data.reason.trim() === '') {
            errors.reason = 'Please explain why this room is needed';
        } else if (data.reason.trim().length < 10) {
            errors.reason = 'Please provide a detailed reason (at least 10 characters)';
        } else if (data.reason.trim().length > 500) {
            errors.reason = 'Reason cannot exceed 500 characters';
        }
        
        return {
            valid: Object.keys(errors).length === 0,
            errors
        };
    },
    
    // Validate private room form
    privateRoomForm: function(data) {
        const errors = {};
        
        // Validate room name
        if (!data.name || data.name.trim() === '') {
            errors.name = 'Room name is required';
        } else {
            const nameCheck = this.roomName(data.name);
            if (!nameCheck.valid) {
                errors.name = nameCheck.message;
            }
        }
        
        // Validate topic
        if (!data.topic || data.topic.trim() === '') {
            errors.topic = 'Topic is required';
        } else {
            const topicCheck = this.roomTopic(data.topic);
            if (!topicCheck.valid) {
                errors.topic = topicCheck.message;
            }
        }
        
        return {
            valid: Object.keys(errors).length === 0,
            errors
        };
    },
    
    // Validate mentor application form
    mentorApplicationForm: function(data) {
        const errors = {};
        
        // Validate topic
        if (!data.topic || data.topic.trim() === '') {
            errors.topic = 'Please enter your proposed room topic';
        } else if (data.topic.trim().length < 5) {
            errors.topic = 'Topic must be at least 5 characters';
        } else if (data.topic.trim().length > 100) {
            errors.topic = 'Topic cannot exceed 100 characters';
        }
        
        // Validate proof
        if (!data.proof || data.proof.trim() === '') {
            errors.proof = 'Please provide proof of expertise';
        } else if (data.proof.trim().length < 20) {
            errors.proof = 'Please provide detailed proof (at least 20 characters)';
        } else if (data.proof.trim().length > 2000) {
            errors.proof = 'Proof cannot exceed 2000 characters';
        }
        
        return {
            valid: Object.keys(errors).length === 0,
            errors
        };
    },
    
    // Validate profile update form
    profileForm: function(data) {
        const errors = {};
        
        // Validate name
        if (data.name !== undefined) {
            if (data.name.trim() === '') {
                errors.name = 'Name cannot be empty';
            } else {
                const nameCheck = this.fullName(data.name);
                if (!nameCheck.valid) {
                    errors.name = nameCheck.message;
                }
            }
        }
        
        // Validate email
        if (data.email !== undefined) {
            if (data.email.trim() === '') {
                errors.email = 'Email cannot be empty';
            } else {
                const emailCheck = this.email(data.email);
                if (!emailCheck.valid) {
                    errors.email = emailCheck.message;
                }
            }
        }
        
        // Validate phone
        if (data.phone !== undefined && data.phone.trim() !== '') {
            const phoneCheck = this.phone(data.phone);
            if (!phoneCheck.valid) {
                errors.phone = phoneCheck.message;
            }
        }
        
        // Validate bio
        if (data.bio !== undefined && data.bio.length > 500) {
            errors.bio = 'Bio cannot exceed 500 characters';
        }
        
        return {
            valid: Object.keys(errors).length === 0,
            errors
        };
    },
    
    // Validate password change form
    passwordChangeForm: function(data) {
        const errors = {};
        
        // Validate current password
        if (!data.currentPassword || data.currentPassword.trim() === '') {
            errors.currentPassword = 'Current password is required';
        }
        
        // Validate new password
        if (!data.newPassword) {
            errors.newPassword = 'New password is required';
        } else {
            const passwordCheck = this.password(data.newPassword);
            if (!passwordCheck.valid) {
                errors.newPassword = passwordCheck.message;
            }
        }
        
        // Validate confirm password
        if (data.newPassword !== data.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }
        
        // Check if new password is same as old
        if (data.currentPassword === data.newPassword) {
            errors.newPassword = 'New password must be different from current password';
        }
        
        return {
            valid: Object.keys(errors).length === 0,
            errors
        };
    },
    
    // =========================================
    // Data Validation
    // =========================================
    
    // Check if value is empty
    isEmpty: function(value) {
        if (value === null || value === undefined) return true;
        if (typeof value === 'string') return value.trim() === '';
        if (Array.isArray(value)) return value.length === 0;
        if (typeof value === 'object') return Object.keys(value).length === 0;
        return false;
    },
    
    // Check if value is number
    isNumber: function(value) {
        return !isNaN(parseFloat(value)) && isFinite(value);
    },
    
    // Check if value is integer
    isInteger: function(value) {
        return Number.isInteger(Number(value));
    },
    
    // Check if value is positive number
    isPositive: function(value) {
        const num = Number(value);
        return !isNaN(num) && num > 0;
    },
    
    // Check if value is negative number
    isNegative: function(value) {
        const num = Number(value);
        return !isNaN(num) && num < 0;
    },
    
    // Check if value is email
    isEmail: function(value) {
        return this.email(value).valid;
    },
    
    // Check if value is URL
    isUrl: function(value) {
        return this.url(value).valid;
    },
    
    // Check if value is valid date
    isDate: function(value) {
        const date = new Date(value);
        return date instanceof Date && !isNaN(date);
    },
    
    // Check if value is in range
    inRange: function(value, min, max) {
        const num = Number(value);
        return !isNaN(num) && num >= min && num <= max;
    },
    
    // Check if string matches pattern
    matchesPattern: function(value, pattern) {
        const regex = new RegExp(pattern);
        return regex.test(value);
    },
    
    // Check if value is boolean
    isBoolean: function(value) {
        return typeof value === 'boolean' || value === 'true' || value === 'false';
    },
    
    // Check if value is JSON
    isJSON: function(value) {
        try {
            JSON.parse(value);
            return true;
        } catch {
            return false;
        }
    },
    
    // Check if value contains only letters
    isAlpha: function(value) {
        return /^[a-zA-Z]+$/.test(value);
    },
    
    // Check if value contains only alphanumeric
    isAlphanumeric: function(value) {
        return /^[a-zA-Z0-9]+$/.test(value);
    },
    
    // Check if value is hexadecimal color
    isHexColor: function(value) {
        return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value);
    },
    
    // Check if value is valid IP address
    isIP: function(value) {
        const ipv4 = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        const ipv6 = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
        
        return {
            valid: ipv4.test(value) || ipv6.test(value),
            message: 'Please enter a valid IP address'
        };
    },
    
    // =========================================
    // Security Validation
    // =========================================
    
    // Check for XSS attempts
    containsXSS: function(value) {
        if (typeof value !== 'string') return false;
        
        const patterns = [
            /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
            /javascript:/gi,
            /on\w+\s*=/gi,
            /data:\s*text\/html/gi,
            /vbscript:/gi,
            /<iframe\b[^<]*<\/iframe>/gi,
            /<object\b[^<]*<\/object>/gi,
            /<embed\b[^<]*<\/embed>/gi,
            /<applet\b[^<]*<\/applet>/gi,
            /<meta\b[^<]*>/gi,
            /<link\b[^<]*>/gi,
            /<style\b[^<]*<\/style>/gi,
            /<img\b[^<]*src=["']?javascript:/gi,
            /<svg\b[^<]*onload=/gi
        ];
        
        return patterns.some(pattern => pattern.test(value));
    },
    
    // Check for SQL injection attempts
    containsSQLInjection: function(value) {
        if (typeof value !== 'string') return false;
        
        const patterns = [
            /'\s*OR\s*'1'='1/gi,
            /'\s*OR\s*1\s*=\s*1/gi,
            /'\s*;\s*DROP\s+TABLE/gi,
            /'\s*;\s*DELETE\s+FROM/gi,
            /'\s*;\s*UPDATE\s+.*\s+SET/gi,
            /UNION\s+ALL\s+SELECT/gi,
            /'\s*;\s*INSERT\s+INTO/gi,
            /'\s*;\s*EXEC\s+/gi,
            /'\s*;\s*EXECUTE\s+/gi,
            /'\s*;\s*CREATE\s+TABLE/gi,
            /'\s*;\s*ALTER\s+TABLE/gi,
            /'\s*;\s*TRUNCATE\s+TABLE/gi,
            /--\s*$/gm,
            /\/\*.*\*\//g
        ];
        
        return patterns.some(pattern => pattern.test(value));
    },
    
    // Sanitize input for safe display
    sanitize: function(value) {
        if (typeof value !== 'string') return value;
        
        // Remove potentially dangerous characters
        return value
            .replace(/[<>]/g, '') // Remove < and >
            .replace(/javascript:/gi, '') // Remove javascript:
            .replace(/on\w+=/gi, '') // Remove event handlers
            .replace(/data:\s*text\/html/gi, '') // Remove data URIs
            .trim();
    },
    
    // Escape HTML for safe display
    escapeHTML: function(value) {
        if (typeof value !== 'string') return value;
        
        const htmlEscapes = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
            '/': '&#47;'
        };
        
        return value.replace(/[&<>"'/]/g, char => htmlEscapes[char]);
    },
    
    // Validate file name for security
    validateFileName: function(fileName) {
        // Remove path traversal attempts
        const sanitized = fileName.replace(/[/\\]/g, '').replace(/\.\./g, '');
        
        // Check for valid characters
        const valid = /^[a-zA-Z0-9\s\-_().]+$/.test(sanitized);
        
        return {
            valid: valid,
            sanitized: sanitized,
            message: valid ? 'File name is valid' : 'File name contains invalid characters'
        };
    },
    
    // =========================================
    // Business Logic Validation
    // =========================================
    
    // Validate room capacity
    roomCapacity: function(current, max = 50) {
        return {
            valid: current <= max,
            message: `Room has reached maximum capacity (${max})`
        };
    },
    
    // Validate user permissions
    userPermission: function(user, requiredRole) {
        const roles = {
            'admin': 3,
            'mentor': 2,
            'user': 1,
            'guest': 0
        };
        
        const userLevel = roles[user?.role] || 0;
        const requiredLevel = roles[requiredRole] || 0;
        
        return {
            valid: userLevel >= requiredLevel,
            message: 'You do not have permission to perform this action'
        };
    },
    
    // Validate rate limiting
    rateLimit: function(actions, limit, timeWindow) {
        const now = Date.now();
        const recentActions = actions.filter(a => now - a.timestamp < timeWindow);
        
        return {
            valid: recentActions.length < limit,
            remaining: Math.max(0, limit - recentActions.length),
            resetTime: recentActions.length > 0 ? recentActions[0].timestamp + timeWindow : null
        };
    }
};

// Export for use in other files
window.Validators = Validators;