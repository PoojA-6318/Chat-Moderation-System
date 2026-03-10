// =========================================
// NOTIFICATIONS COMPONENT
// Manages toast notifications
// =========================================

const NotificationsComponent = {
    // Container for notifications
    container: null,
    // Maximum number of notifications to show at once
    maxNotifications: 5,
    // Duration in milliseconds
    defaultDuration: 3000,
    
    // Initialize notifications
    init: function() {
        this.createContainer();
        this.addStyles();
    },
    
    // Create container for notifications
    createContainer: function() {
        if (document.getElementById('notification-container')) return;
        
        this.container = document.createElement('div');
        this.container.id = 'notification-container';
        this.container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 10px;
            pointer-events: none;
        `;
        document.body.appendChild(this.container);
    },
    
    // Add styles for notifications
    addStyles: function() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes notificationSlideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes notificationSlideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
            
            .notification-item {
                min-width: 300px;
                max-width: 400px;
                padding: 16px 20px;
                border-radius: 12px;
                color: white;
                font-weight: 600;
                font-size: 14px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                display: flex;
                align-items: center;
                gap: 12px;
                pointer-events: auto;
                cursor: pointer;
                animation: notificationSlideIn 0.3s ease;
                border-left: 4px solid rgba(255, 255, 255, 0.5);
            }
            
            .notification-item.success {
                background: linear-gradient(135deg, #10b981, #059669);
            }
            
            .notification-item.error {
                background: linear-gradient(135deg, #ef4444, #dc2626);
            }
            
            .notification-item.warning {
                background: linear-gradient(135deg, #f59e0b, #d97706);
            }
            
            .notification-item.info {
                background: linear-gradient(135deg, #3b82f6, #2563eb);
            }
            
            .notification-icon {
                font-size: 20px;
            }
            
            .notification-message {
                flex: 1;
            }
            
            .notification-close {
                opacity: 0.7;
                transition: opacity 0.2s;
                font-size: 18px;
            }
            
            .notification-close:hover {
                opacity: 1;
            }
        `;
        document.head.appendChild(style);
    },
    
    // Show a notification
    show: function(message, type = 'info', duration = null) {
        const notification = this.createNotification(message, type);
        
        // Add to container
        this.container.appendChild(notification);
        
        // Limit number of notifications
        this.limitNotifications();
        
        // Auto remove after duration
        const timeoutDuration = duration || this.defaultDuration;
        const timeoutId = setTimeout(() => {
            this.remove(notification);
        }, timeoutDuration);
        
        // Store timeout ID to cancel if manually closed
        notification.dataset.timeoutId = timeoutId;
        
        // Click to close
        notification.addEventListener('click', () => {
            clearTimeout(timeoutId);
            this.remove(notification);
        });
        
        return notification;
    },
    
    // Create notification element
    createNotification: function(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification-item ${type}`;
        
        // Choose icon based on type
        let icon = 'ℹ️';
        switch(type) {
            case 'success':
                icon = '✅';
                break;
            case 'error':
                icon = '❌';
                break;
            case 'warning':
                icon = '⚠️';
                break;
            case 'info':
                icon = 'ℹ️';
                break;
        }
        
        notification.innerHTML = `
            <span class="notification-icon">${icon}</span>
            <span class="notification-message">${message}</span>
            <span class="notification-close">✕</span>
        `;
        
        return notification;
    },
    
    // Remove a specific notification
    remove: function(notification) {
        if (!notification.parentNode) return;
        
        notification.style.animation = 'notificationSlideOut 0.3s ease';
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    },
    
    // Limit number of notifications
    limitNotifications: function() {
        const notifications = this.container.children;
        while (notifications.length > this.maxNotifications) {
            const oldest = notifications[0];
            const timeoutId = oldest.dataset.timeoutId;
            if (timeoutId) clearTimeout(parseInt(timeoutId));
            this.remove(oldest);
        }
    },
    
    // Show success notification (shortcut)
    success: function(message, duration) {
        return this.show(message, 'success', duration);
    },
    
    // Show error notification (shortcut)
    error: function(message, duration) {
        return this.show(message, 'error', duration);
    },
    
    // Show warning notification (shortcut)
    warning: function(message, duration) {
        return this.show(message, 'warning', duration);
    },
    
    // Show info notification (shortcut)
    info: function(message, duration) {
        return this.show(message, 'info', duration);
    },
    
    // Clear all notifications
    clearAll: function() {
        Array.from(this.container.children).forEach(notification => {
            const timeoutId = notification.dataset.timeoutId;
            if (timeoutId) clearTimeout(parseInt(timeoutId));
            this.remove(notification);
        });
    }
};

// Export for use in other files
window.NotificationsComponent = NotificationsComponent;