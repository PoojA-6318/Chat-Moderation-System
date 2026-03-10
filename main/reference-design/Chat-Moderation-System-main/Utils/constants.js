// =========================================
// CONSTANTS
// Global constants used throughout the application
// =========================================

// User Roles
export const USER_ROLES = {
    USER: 'user',
    MENTOR: 'mentor',
    ADMIN: 'admin',
    PENDING_MENTOR: 'pending_mentor',
    GUEST: 'guest'
};

// Room Types
export const ROOM_TYPES = {
    PUBLIC: 'public',
    PRIVATE: 'private',
    MENTOR: 'mentor'
};

// Request Statuses
export const REQUEST_STATUS = {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',
    EXPIRED: 'expired'
};

// Notification Types
export const NOTIFICATION_TYPES = {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info'
};

// Message Types
export const MESSAGE_TYPES = {
    TEXT: 'text',
    IMAGE: 'image',
    FILE: 'file',
    SYSTEM: 'system',
    JOIN: 'join',
    LEAVE: 'leave'
};

// Theme Modes
export const THEME_MODES = {
    LIGHT: 'light',
    DARK: 'dark',
    SYSTEM: 'system'
};

// Storage Keys
export const STORAGE_KEYS = {
    THEME: 'wele-theme',
    AUTH_TOKEN: 'auth_token',
    CURRENT_USER: 'current_user',
    ROOMS: 'rooms',
    MESSAGES_PREFIX: 'messages-',
    KEYWORDS: 'blocked-keywords',
    KEYWORD_STATS: 'keyword-stats',
    MENTOR_REQUESTS: 'mentor-requests',
    ROOM_REQUESTS: 'room-requests',
    ROOM_INVITES: 'room-invites',
    USER_PREFERENCES: 'user-preferences',
    AUTH_LOGS: 'auth-logs'
};

// API Endpoints
export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        LOGOUT: '/auth/logout',
        VALIDATE: '/auth/validate',
        PROFILE: '/auth/profile',
        CHANGE_PASSWORD: '/auth/change-password',
        FORGOT_PASSWORD: '/auth/forgot-password',
        RESET_PASSWORD: '/auth/reset-password',
        MENTOR_APPLY: '/auth/mentor-apply'
    },
    ROOMS: {
        LIST: '/rooms',
        GET: (id) => `/rooms/${id}`,
        CREATE: '/rooms',
        UPDATE: (id) => `/rooms/${id}`,
        DELETE: (id) => `/rooms/${id}`,
        JOIN: (id) => `/rooms/${id}/join`,
        LEAVE: (id) => `/rooms/${id}/leave`,
        REQUESTS: '/rooms/requests',
        APPROVE_REQUEST: (id) => `/rooms/requests/${id}/approve`,
        REJECT_REQUEST: (id) => `/rooms/requests/${id}/reject`
    },
    MESSAGES: {
        LIST: (roomId) => `/messages/room/${roomId}`,
        SEND: '/messages',
        EDIT: (id) => `/messages/${id}`,
        DELETE: (id) => `/messages/${id}`,
        REACT: (id) => `/messages/${id}/react`,
        ATTACH: '/messages/attach'
    },
    KEYWORDS: {
        LIST: '/keywords',
        ADD: '/keywords',
        DELETE: (keyword) => `/keywords/${encodeURIComponent(keyword)}`,
        IMPORT: '/keywords/import',
        EXPORT: '/keywords/export',
        STATS: '/keywords/stats'
    }
};

// Default Room Topics
export const DEFAULT_ROOM_TOPICS = [
    'Web Development',
    'Mobile Development',
    'Data Science',
    'Machine Learning',
    'UI/UX Design',
    'DevOps',
    'Cloud Computing',
    'Cybersecurity',
    'Blockchain',
    'Game Development',
    'Artificial Intelligence',
    'Internet of Things',
    'AR/VR Development',
    'Database Design',
    'API Development'
];

// Default Blocked Keywords
export const DEFAULT_BLOCKED_KEYWORDS = [
    { word: 'spam', category: 'spam', severity: 'medium' },
    { word: 'advertisement', category: 'advertising', severity: 'medium' },
    { word: 'buy now', category: 'advertising', severity: 'high' },
    { word: 'discount', category: 'advertising', severity: 'low' },
    { word: 'free money', category: 'spam', severity: 'high' },
    { word: 'hate', category: 'profanity', severity: 'high' },
    { word: 'violence', category: 'profanity', severity: 'high' },
    { word: 'inappropriate', category: 'profanity', severity: 'medium' },
    { word: 'scam', category: 'spam', severity: 'high' },
    { word: 'fraud', category: 'spam', severity: 'high' },
    { word: 'porn', category: 'profanity', severity: 'high' },
    { word: 'sex', category: 'profanity', severity: 'high' },
    { word: 'drugs', category: 'profanity', severity: 'high' },
    { word: 'gambling', category: 'spam', severity: 'high' },
    { word: 'casino', category: 'spam', severity: 'high' }
];

// Pagination
export const PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100
};

// Time Constants (in milliseconds)
export const TIME = {
    SECOND: 1000,
    MINUTE: 60 * 1000,
    HOUR: 60 * 60 * 1000,
    DAY: 24 * 60 * 60 * 1000,
    WEEK: 7 * 24 * 60 * 60 * 1000,
    MONTH: 30 * 24 * 60 * 60 * 1000
};

// Message Limits
export const MESSAGE_LIMITS = {
    MAX_LENGTH: 500,
    MAX_ATTACHMENTS: 5,
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_FILE_TYPES: [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'application/pdf',
        'text/plain',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
};

// Room Limits
export const ROOM_LIMITS = {
    MAX_PUBLIC_ROOMS_PER_USER: 10,
    MAX_PRIVATE_ROOMS_PER_USER: 20,
    MAX_MEMBERS_PER_ROOM: 50,
    MAX_ROOM_NAME_LENGTH: 50,
    MAX_TOPIC_LENGTH: 100,
    MAX_DESCRIPTION_LENGTH: 500
};

// Animation Durations
export const ANIMATION = {
    FAST: 200,
    NORMAL: 300,
    SLOW: 500,
    TOAST: 3000
};

// HTTP Status Codes
export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    TOO_MANY_REQUESTS: 429,
    SERVER_ERROR: 500
};

// Error Messages
export const ERROR_MESSAGES = {
    NETWORK: 'Network error. Please check your connection.',
    UNAUTHORIZED: 'You are not authorized to perform this action.',
    FORBIDDEN: 'Access denied.',
    NOT_FOUND: 'Resource not found.',
    SERVER: 'Server error. Please try again later.',
    VALIDATION: 'Please check your input and try again.',
    TIMEOUT: 'Request timed out. Please try again.',
    OFFLINE: 'You are offline. Please check your internet connection.'
};

// Success Messages
export const SUCCESS_MESSAGES = {
    LOGIN: 'Login successful!',
    REGISTER: 'Registration successful!',
    LOGOUT: 'Logged out successfully',
    PROFILE_UPDATE: 'Profile updated successfully',
    PASSWORD_CHANGE: 'Password changed successfully',
    ROOM_CREATED: 'Room created successfully',
    ROOM_JOINED: 'Joined room successfully',
    ROOM_LEFT: 'Left room successfully',
    MESSAGE_SENT: 'Message sent successfully',
    REQUEST_SUBMITTED: 'Request submitted successfully'
};

// Regex Patterns
export const PATTERNS = {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PASSWORD: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
    USERNAME: /^[a-zA-Z0-9_]{3,20}$/,
    URL: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
    PHONE: /^\+?[\d\s-]{10,}$/,
    COLOR: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
    SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/
};

// Export all constants
export default {
    USER_ROLES,
    ROOM_TYPES,
    REQUEST_STATUS,
    NOTIFICATION_TYPES,
    MESSAGE_TYPES,
    THEME_MODES,
    STORAGE_KEYS,
    API_ENDPOINTS,
    DEFAULT_ROOM_TOPICS,
    DEFAULT_BLOCKED_KEYWORDS,
    PAGINATION,
    TIME,
    MESSAGE_LIMITS,
    ROOM_LIMITS,
    ANIMATION,
    HTTP_STATUS,
    ERROR_MESSAGES,
    SUCCESS_MESSAGES,
    PATTERNS
};