// =========================================
// THEME MANAGER
// Handles theme switching, preferences, and dynamic styling
// =========================================

const ThemeManager = {
    // Current theme mode
    currentTheme: 'light',
    
    // Available themes
    themes: {
        light: {
            name: 'Light',
            icon: '☀️',
            colors: {
                primary: '#059669',
                primaryLight: '#10b981',
                primaryBg: '#ecfdf5',
                primaryBorder: '#a7f3d0',
                textDark: '#0f172a',
                textMedium: '#334155',
                textLight: '#64748b',
                textMuted: '#94a3b8',
                borderColor: '#e2e8f0',
                inputBg: '#f8fafc',
                inputBorder: '#cbd5e1',
                white: '#ffffff',
                shadow: 'rgba(0, 0, 0, 0.08)',
                shadowGreen: 'rgba(5, 150, 105, 0.15)',
                success: '#10b981',
                error: '#ef4444',
                warning: '#f59e0b',
                info: '#3b82f6'
            }
        },
        dark: {
            name: 'Dark',
            icon: '🌙',
            colors: {
                primary: '#059669',
                primaryLight: '#10b981',
                primaryBg: 'rgba(5, 150, 105, 0.15)',
                primaryBorder: '#065f46',
                textDark: '#f8fafc',
                textMedium: '#cbd5e1',
                textLight: '#94a3b8',
                textMuted: '#64748b',
                borderColor: '#334155',
                inputBg: '#1e293b',
                inputBorder: '#475569',
                white: '#1e293b',
                shadow: 'rgba(0, 0, 0, 0.3)',
                shadowGreen: 'rgba(5, 150, 105, 0.25)',
                success: '#10b981',
                error: '#ef4444',
                warning: '#f59e0b',
                info: '#3b82f6'
            }
        },
        highContrast: {
            name: 'High Contrast',
            icon: '🔆',
            colors: {
                primary: '#0066cc',
                primaryLight: '#3385ff',
                primaryBg: '#e6f0ff',
                primaryBorder: '#0066cc',
                textDark: '#000000',
                textMedium: '#1a1a1a',
                textLight: '#333333',
                textMuted: '#4d4d4d',
                borderColor: '#000000',
                inputBg: '#ffffff',
                inputBorder: '#000000',
                white: '#ffffff',
                shadow: 'rgba(0, 0, 0, 0.5)',
                shadowGreen: 'rgba(0, 102, 204, 0.3)',
                success: '#00802b',
                error: '#cc0000',
                warning: '#b35c00',
                info: '#0047b3'
            }
        },
        sepia: {
            name: 'Sepia',
            icon: '📜',
            colors: {
                primary: '#8b5a2b',
                primaryLight: '#a67c52',
                primaryBg: '#f4e6d9',
                primaryBorder: '#d4b08c',
                textDark: '#3b2b1a',
                textMedium: '#5c4b37',
                textLight: '#7c6b57',
                textMuted: '#9c8b77',
                borderColor: '#d4b08c',
                inputBg: '#fcf5eb',
                inputBorder: '#d4b08c',
                white: '#fcf5eb',
                shadow: 'rgba(0, 0, 0, 0.1)',
                shadowGreen: 'rgba(139, 90, 43, 0.15)',
                success: '#2d6a4f',
                error: '#b0413e',
                warning: '#b45f06',
                info: '#2c5282'
            }
        },
        nord: {
            name: 'Nord',
            icon: '❄️',
            colors: {
                primary: '#5e81ac',
                primaryLight: '#81a1c1',
                primaryBg: '#eceff4',
                primaryBorder: '#d8dee9',
                textDark: '#2e3440',
                textMedium: '#3b4252',
                textLight: '#434c5e',
                textMuted: '#4c566a',
                borderColor: '#d8dee9',
                inputBg: '#eceff4',
                inputBorder: '#d8dee9',
                white: '#eceff4',
                shadow: 'rgba(0, 0, 0, 0.1)',
                shadowGreen: 'rgba(94, 129, 172, 0.15)',
                success: '#a3be8c',
                error: '#bf616a',
                warning: '#ebcb8b',
                info: '#81a1c1'
            }
        }
    },
    
    // Theme change listeners
    listeners: [],
    
    // Initialize theme manager
    init: function() {
        this.loadSavedTheme();
        this.setupSystemThemeListener();
        this.injectThemeStyles();
    },
    
    // Load saved theme from storage
    loadSavedTheme: function() {
        const savedTheme = localStorage.getItem('wele-theme');
        const savedMode = localStorage.getItem('wele-theme-mode');
        
        if (savedMode === 'system') {
            this.applySystemTheme();
        } else if (savedTheme && this.themes[savedTheme]) {
            this.setTheme(savedTheme);
        } else {
            // Default to light theme
            this.setTheme('light');
        }
    },
    
    // Set theme
    setTheme: function(themeName) {
        if (!this.themes[themeName]) {
            console.error(`Theme "${themeName}" not found`);
            return false;
        }
        
        this.currentTheme = themeName;
        this.applyTheme(themeName);
        localStorage.setItem('wele-theme', themeName);
        localStorage.setItem('wele-theme-mode', 'custom');
        
        this.notifyListeners('themeChanged', themeName);
        return true;
    },
    
    // Apply theme colors to CSS variables
    applyTheme: function(themeName) {
        const theme = this.themes[themeName];
        const root = document.documentElement;
        
        Object.entries(theme.colors).forEach(([key, value]) => {
            // Convert camelCase to kebab-case for CSS variables
            const cssVar = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
            root.style.setProperty(cssVar, value);
        });
        
        // Set data-theme attribute for additional styling
        root.setAttribute('data-theme', themeName);
        
        // Update theme color meta tag for mobile browsers
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', theme.colors.primary);
        }
        
        // Dispatch event for other components
        window.dispatchEvent(new CustomEvent('themechange', { 
            detail: { theme: themeName, colors: theme.colors }
        }));
    },
    
    // Apply system theme preference
    applySystemTheme: function() {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const themeName = prefersDark ? 'dark' : 'light';
        
        this.applyTheme(themeName);
        localStorage.setItem('wele-theme-mode', 'system');
        
        this.notifyListeners('themeChanged', themeName);
    },
    
    // Toggle between light and dark
    toggleTheme: function() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        return this.setTheme(newTheme);
    },
    
    // Cycle through themes
    cycleTheme: function() {
        const themeNames = Object.keys(this.themes);
        const currentIndex = themeNames.indexOf(this.currentTheme);
        const nextIndex = (currentIndex + 1) % themeNames.length;
        
        return this.setTheme(themeNames[nextIndex]);
    },
    
    // Get current theme
    getCurrentTheme: function() {
        return {
            name: this.currentTheme,
            ...this.themes[this.currentTheme]
        };
    },
    
    // Get all available themes
    getAvailableThemes: function() {
        return Object.entries(this.themes).map(([key, value]) => ({
            id: key,
            name: value.name,
            icon: value.icon
        }));
    },
    
    // Setup listener for system theme changes
    setupSystemThemeListener: function() {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            const mode = localStorage.getItem('wele-theme-mode');
            if (mode === 'system') {
                this.applySystemTheme();
            }
        });
    },
    
    // Inject dynamic theme styles
    injectThemeStyles: function() {
        const style = document.createElement('style');
        style.id = 'theme-dynamic-styles';
        style.textContent = `
            /* Theme transition animations */
            body * {
                transition: background-color 0.3s ease,
                            border-color 0.3s ease,
                            color 0.3s ease,
                            box-shadow 0.3s ease;
            }
            
            /* Theme-specific adjustments */
            [data-theme="dark"] .room-card {
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
            }
            
            [data-theme="highContrast"] .btn-primary {
                border: 2px solid #000000;
            }
            
            [data-theme="highContrast"] .nav-item.active {
                outline: 2px solid var(--primary);
            }
            
            [data-theme="sepia"] .chat-bubble-received {
                background: #f4e6d9;
            }
            
            [data-theme="nord"] .mentor-tag {
                background: #5e81ac;
            }
        `;
        document.head.appendChild(style);
    },
    
    // Get CSS variable value
    getCssVariable: function(variable) {
        return getComputedStyle(document.documentElement)
            .getPropertyValue(`--${variable}`).trim();
    },
    
    // Get color with opacity
    getColorWithOpacity: function(color, opacity) {
        let rgb;
        
        // If it's a CSS variable, get its value
        if (color.startsWith('--')) {
            color = this.getCssVariable(color.substring(2));
        }
        
        // Parse color
        if (color.startsWith('#')) {
            rgb = this.hexToRgb(color);
        } else if (color.startsWith('rgb')) {
            const matches = color.match(/\d+/g);
            if (matches) {
                rgb = {
                    r: parseInt(matches[0]),
                    g: parseInt(matches[1]),
                    b: parseInt(matches[2])
                };
            }
        }
        
        if (rgb) {
            return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
        }
        
        return color;
    },
    
    // Convert hex to RGB
    hexToRgb: function(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    },
    
    // Generate theme CSS for export
    generateThemeCSS: function(themeName) {
        const theme = this.themes[themeName];
        if (!theme) return '';
        
        return `:root[data-theme="${themeName}"] {\n${
            Object.entries(theme.colors)
                .map(([key, value]) => `    --${key}: ${value};`)
                .join('\n')
        }\n}`;
    },
    
    // Export theme as CSS
    exportTheme: function(themeName) {
        const css = this.generateThemeCSS(themeName);
        const blob = new Blob([css], { type: 'text/css' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `theme-${themeName}.css`;
        a.click();
        
        URL.revokeObjectURL(url);
    },
    
    // Create theme preview
    createThemePreview: function(themeName) {
        const theme = this.themes[themeName];
        if (!theme) return '';
        
        return `
            <div class="theme-preview" style="
                background: ${theme.colors.white};
                border: 1px solid ${theme.colors.borderColor};
                border-radius: 8px;
                padding: 16px;
                width: 200px;
            ">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
                    <span style="font-size: 24px;">${theme.icon}</span>
                    <span style="color: ${theme.colors.textDark}; font-weight: bold;">${theme.name}</span>
                </div>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px; margin-bottom: 12px;">
                    <div style="background: ${theme.colors.primary}; height: 20px; border-radius: 4px;"></div>
                    <div style="background: ${theme.colors.primaryLight}; height: 20px; border-radius: 4px;"></div>
                    <div style="background: ${theme.colors.primaryBg}; height: 20px; border-radius: 4px;"></div>
                    <div style="background: ${theme.colors.textDark}; height: 20px; border-radius: 4px;"></div>
                    <div style="background: ${theme.colors.textMedium}; height: 20px; border-radius: 4px;"></div>
                    <div style="background: ${theme.colors.textLight}; height: 20px; border-radius: 4px;"></div>
                </div>
                <div style="display: flex; gap: 4px;">
                    <div style="background: ${theme.colors.success}; width: 30px; height: 20px; border-radius: 4px;"></div>
                    <div style="background: ${theme.colors.error}; width: 30px; height: 20px; border-radius: 4px;"></div>
                    <div style="background: ${theme.colors.warning}; width: 30px; height: 20px; border-radius: 4px;"></div>
                    <div style="background: ${theme.colors.info}; width: 30px; height: 20px; border-radius: 4px;"></div>
                </div>
            </div>
        `;
    },
    
    // Add theme change listener
    addListener: function(callback) {
        this.listeners.push(callback);
    },
    
    // Remove theme change listener
    removeListener: function(callback) {
        this.listeners = this.listeners.filter(cb => cb !== callback);
    },
    
    // Notify listeners of theme change
    notifyListeners: function(event, data) {
        this.listeners.forEach(callback => {
            try {
                callback(event, data);
            } catch (error) {
                console.error('Error in theme listener:', error);
            }
        });
    },
    
    // Get theme statistics
    getStats: function() {
        return {
            currentTheme: this.currentTheme,
            availableThemes: Object.keys(this.themes).length,
            customThemes: 0, // Could be extended for custom themes
            lastChanged: localStorage.getItem('wele-theme-last-changed') || null
        };
    },
    
    // Reset to default theme
    resetToDefault: function() {
        return this.setTheme('light');
    }
};

// Initialize theme manager
ThemeManager.init();

// Export for use in other files
window.ThemeManager = ThemeManager;