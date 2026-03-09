// =========================================
// HELPERS
// Utility helper functions for common operations
// =========================================

const Helpers = {
    // =========================================
    // String Utilities
    // =========================================
    
    // Capitalize first letter
    capitalize: function(str) {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    },
    
    // Capitalize each word
    capitalizeWords: function(str) {
        if (!str) return '';
        return str.split(' ').map(word => this.capitalize(word)).join(' ');
    },
    
    // Truncate string with ellipsis
    truncate: function(str, length = 50, ellipsis = '...') {
        if (!str) return '';
        if (str.length <= length) return str;
        return str.substring(0, length - ellipsis.length) + ellipsis;
    },
    
    // Generate slug from string
    slugify: function(str) {
        return str
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    },
    
    // Strip HTML tags
    stripHtml: function(html) {
        return html.replace(/<[^>]*>/g, '');
    },
    
    // Escape HTML special characters
    escapeHtml: function(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    },
    
    // Generate random string
    randomString: function(length = 10) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    },
    
    // =========================================
    // Date & Time Utilities
    // =========================================
    
    // Format date
    formatDate: function(date, format = 'short') {
        const d = new Date(date);
        const now = new Date();
        const diff = now - d;
        
        // Today
        if (diff < 24 * 60 * 60 * 1000 && d.getDate() === now.getDate()) {
            return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        
        // This week
        if (diff < 7 * 24 * 60 * 60 * 1000) {
            return d.toLocaleDateString([], { weekday: 'short' }) + ' ' + 
                   d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        
        // This year
        if (d.getFullYear() === now.getFullYear()) {
            return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
        }
        
        // Default
        return d.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
    },
    
    // Format time ago
    timeAgo: function(date) {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        
        const intervals = [
            { label: 'year', seconds: 31536000 },
            { label: 'month', seconds: 2592000 },
            { label: 'week', seconds: 604800 },
            { label: 'day', seconds: 86400 },
            { label: 'hour', seconds: 3600 },
            { label: 'minute', seconds: 60 },
            { label: 'second', seconds: 1 }
        ];
        
        for (const interval of intervals) {
            const count = Math.floor(seconds / interval.seconds);
            if (count >= 1) {
                return count === 1 ? `1 ${interval.label} ago` : `${count} ${interval.label}s ago`;
            }
        }
        
        return 'just now';
    },
    
    // Get time difference in milliseconds
    timeDiff: function(date1, date2 = new Date()) {
        return Math.abs(new Date(date1) - new Date(date2));
    },
    
    // Check if date is today
    isToday: function(date) {
        const d = new Date(date);
        const today = new Date();
        return d.getDate() === today.getDate() &&
               d.getMonth() === today.getMonth() &&
               d.getFullYear() === today.getFullYear();
    },
    
    // =========================================
    // Number Utilities
    // =========================================
    
    // Format number with commas
    formatNumber: function(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
    
    // Format file size
    formatFileSize: function(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },
    
    // Clamp number between min and max
    clamp: function(num, min, max) {
        return Math.min(Math.max(num, min), max);
    },
    
    // Random number between min and max
    random: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    
    // =========================================
    // Array Utilities
    // =========================================
    
    // Chunk array into groups
    chunk: function(array, size) {
        const chunks = [];
        for (let i = 0; i < array.length; i += size) {
            chunks.push(array.slice(i, i + size));
        }
        return chunks;
    },
    
    // Remove duplicates from array
    unique: function(array) {
        return [...new Set(array)];
    },
    
    // Shuffle array
    shuffle: function(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    },
    
    // Group array by key
    groupBy: function(array, key) {
        return array.reduce((result, item) => {
            const group = item[key];
            if (!result[group]) {
                result[group] = [];
            }
            result[group].push(item);
            return result;
        }, {});
    },
    
    // Sort array by key
    sortBy: function(array, key, order = 'asc') {
        return [...array].sort((a, b) => {
            if (a[key] < b[key]) return order === 'asc' ? -1 : 1;
            if (a[key] > b[key]) return order === 'asc' ? 1 : -1;
            return 0;
        });
    },
    
    // =========================================
    // Object Utilities
    // =========================================
    
    // Deep clone object
    deepClone: function(obj) {
        return JSON.parse(JSON.stringify(obj));
    },
    
    // Check if object is empty
    isEmpty: function(obj) {
        return Object.keys(obj).length === 0;
    },
    
    // Pick specific keys from object
    pick: function(obj, keys) {
        return keys.reduce((result, key) => {
            if (obj.hasOwnProperty(key)) {
                result[key] = obj[key];
            }
            return result;
        }, {});
    },
    
    // Omit specific keys from object
    omit: function(obj, keys) {
        return Object.keys(obj)
            .filter(key => !keys.includes(key))
            .reduce((result, key) => {
                result[key] = obj[key];
                return result;
            }, {});
    },
    
    // Merge objects deeply
    deepMerge: function(target, source) {
        const output = { ...target };
        
        for (const key in source) {
            if (source[key] instanceof Object && key in target) {
                output[key] = this.deepMerge(target[key], source[key]);
            } else {
                output[key] = source[key];
            }
        }
        
        return output;
    },
    
    // =========================================
    // Color Utilities
    // =========================================
    
    // Convert hex to RGB
    hexToRgb: function(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    },
    
    // Convert RGB to hex
    rgbToHex: function(r, g, b) {
        return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    },
    
    // Lighten color
    lightenColor: function(color, percent) {
        const rgb = this.hexToRgb(color);
        if (!rgb) return color;
        
        const lighten = (c) => Math.min(255, Math.floor(c + (255 - c) * percent / 100));
        
        return this.rgbToHex(
            lighten(rgb.r),
            lighten(rgb.g),
            lighten(rgb.b)
        );
    },
    
    // Darken color
    darkenColor: function(color, percent) {
        const rgb = this.hexToRgb(color);
        if (!rgb) return color;
        
        const darken = (c) => Math.max(0, Math.floor(c * (1 - percent / 100)));
        
        return this.rgbToHex(
            darken(rgb.r),
            darken(rgb.g),
            darken(rgb.b)
        );
    },
    
    // =========================================
    // Storage Utilities
    // =========================================
    
    // Set item with expiry
    setWithExpiry: function(key, value, ttl) {
        const now = new Date();
        const item = {
            value: value,
            expiry: now.getTime() + ttl
        };
        localStorage.setItem(key, JSON.stringify(item));
    },
    
    // Get item with expiry
    getWithExpiry: function(key) {
        const itemStr = localStorage.getItem(key);
        if (!itemStr) return null;
        
        const item = JSON.parse(itemStr);
        const now = new Date();
        
        if (now.getTime() > item.expiry) {
            localStorage.removeItem(key);
            return null;
        }
        
        return item.value;
    },
    
    // Clear storage by prefix
    clearByPrefix: function(prefix) {
        const keys = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith(prefix)) {
                keys.push(key);
            }
        }
        keys.forEach(key => localStorage.removeItem(key));
    },
    
    // =========================================
    // DOM Utilities
    // =========================================
    
    // Add multiple event listeners
    addEventListeners: function(element, events, handler) {
        events.split(' ').forEach(event => {
            element.addEventListener(event, handler);
        });
    },
    
    // Debounce function
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Throttle function
    throttle: function(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    // Copy to clipboard
    copyToClipboard: async function(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            // Fallback
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            return true;
        }
    },
    
    // Download file
    downloadFile: function(content, fileName, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.click();
        URL.revokeObjectURL(url);
    },
    
    // =========================================
    // URL Utilities
    // =========================================
    
    // Get URL parameters
    getUrlParams: function() {
        const params = new URLSearchParams(window.location.search);
        const result = {};
        for (const [key, value] of params) {
            result[key] = value;
        }
        return result;
    },
    
    // Build URL with parameters
    buildUrl: function(base, params) {
        const url = new URL(base, window.location.origin);
        Object.keys(params).forEach(key => {
            url.searchParams.append(key, params[key]);
        });
        return url.toString();
    },
    
    // =========================================
    // Device Detection
    // =========================================
    
    // Check if mobile device
    isMobile: function() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },
    
    // Check if touch device
    isTouchDevice: function() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    },
    
    // Get browser info
    getBrowserInfo: function() {
        const ua = navigator.userAgent;
        let browser = 'Unknown';
        
        if (ua.includes('Chrome')) browser = 'Chrome';
        else if (ua.includes('Firefox')) browser = 'Firefox';
        else if (ua.includes('Safari')) browser = 'Safari';
        else if (ua.includes('Edge')) browser = 'Edge';
        else if (ua.includes('MSIE') || ua.includes('Trident')) browser = 'IE';
        
        return browser;
    }
};

// Export for use in other files
window.Helpers = Helpers;