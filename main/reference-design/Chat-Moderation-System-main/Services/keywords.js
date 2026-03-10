// =========================================
// KEYWORDS SERVICE
// Manages blocked keywords and content filtering
// =========================================

const KeywordsService = {
    // Blocked keywords list
    keywords: [],
    
    // Keyword categories
    categories: {
        profanity: [],
        spam: [],
        advertising: [],
        custom: []
    },
    
    // Keyword usage statistics
    stats: {
        totalBlocks: 0,
        topBlocked: [],
        lastUpdated: null
    },
    
    // Listeners
    listeners: [],
    
    // Initialize keywords service
    init: function() {
        this.loadKeywords();
        this.loadStats();
    },
    
    // Load keywords from storage
    loadKeywords: function() {
        const savedKeywords = localStorage.getItem('blocked-keywords');
        
        if (savedKeywords) {
            this.keywords = JSON.parse(savedKeywords);
        } else {
            // Default blocked keywords
            this.keywords = [
                { word: 'spam', category: 'spam', severity: 'medium', active: true },
                { word: 'advertisement', category: 'advertising', severity: 'medium', active: true },
                { word: 'buy now', category: 'advertising', severity: 'high', active: true },
                { word: 'discount', category: 'advertising', severity: 'low', active: true },
                { word: 'free money', category: 'spam', severity: 'high', active: true },
                { word: 'hate', category: 'profanity', severity: 'high', active: true },
                { word: 'violence', category: 'profanity', severity: 'high', active: true },
                { word: 'inappropriate', category: 'profanity', severity: 'medium', active: true },
                { word: 'scam', category: 'spam', severity: 'high', active: true },
                { word: 'fraud', category: 'spam', severity: 'high', active: true },
                { word: 'porn', category: 'profanity', severity: 'high', active: true },
                { word: 'sex', category: 'profanity', severity: 'high', active: true },
                { word: 'drugs', category: 'profanity', severity: 'high', active: true },
                { word: 'gambling', category: 'spam', severity: 'high', active: true },
                { word: 'casino', category: 'spam', severity: 'high', active: true }
            ];
            
            this.saveKeywords();
        }
        
        // Organize by category
        this.organizeByCategory();
    },
    
    // Load statistics
    loadStats: function() {
        const savedStats = localStorage.getItem('keyword-stats');
        if (savedStats) {
            this.stats = JSON.parse(savedStats);
        }
    },
    
    // Organize keywords by category
    organizeByCategory: function() {
        // Reset categories
        this.categories = {
            profanity: [],
            spam: [],
            advertising: [],
            custom: []
        };
        
        // Populate categories
        this.keywords.forEach(kw => {
            if (kw.category && this.categories[kw.category]) {
                this.categories[kw.category].push(kw);
            } else {
                this.categories.custom.push(kw);
            }
        });
    },
    
    // Get all keywords
    getKeywords: function(activeOnly = true) {
        if (activeOnly) {
            return this.keywords.filter(kw => kw.active !== false).map(kw => kw.word);
        }
        return this.keywords.map(kw => kw.word);
    },
    
    // Get keywords with details
    getKeywordDetails: function() {
        return this.keywords;
    },
    
    // Get keywords by category
    getKeywordsByCategory: function(category) {
        return this.categories[category] || [];
    },
    
    // Add keyword
    addKeyword: function(word, category = 'custom', severity = 'medium') {
        // Check if already exists
        const existing = this.keywords.find(k => 
            k.word.toLowerCase() === word.toLowerCase()
        );
        
        if (existing) {
            if (!existing.active) {
                // Reactivate if disabled
                existing.active = true;
                this.saveKeywords();
                this.notifyListeners('keywordReactivated', existing);
                return { success: true, keyword: existing, message: 'Keyword reactivated' };
            }
            return { success: false, error: 'Keyword already exists' };
        }
        
        const newKeyword = {
            id: Date.now(),
            word: word.toLowerCase(),
            category,
            severity,
            active: true,
            addedAt: new Date().toISOString(),
            blockCount: 0
        };
        
        this.keywords.push(newKeyword);
        this.organizeByCategory();
        this.saveKeywords();
        this.notifyListeners('keywordAdded', newKeyword);
        
        return { success: true, keyword: newKeyword };
    },
    
    // Add multiple keywords
    addKeywords: function(words, category = 'custom') {
        const results = {
            added: [],
            skipped: []
        };
        
        words.forEach(word => {
            const result = this.addKeyword(word.trim(), category);
            if (result.success) {
                results.added.push(word);
            } else {
                results.skipped.push(word);
            }
        });
        
        return results;
    },
    
    // Remove keyword
    removeKeyword: function(word) {
        const index = this.keywords.findIndex(k => 
            k.word.toLowerCase() === word.toLowerCase()
        );
        
        if (index === -1) {
            return { success: false, error: 'Keyword not found' };
        }
        
        const removed = this.keywords[index];
        this.keywords.splice(index, 1);
        this.organizeByCategory();
        this.saveKeywords();
        this.notifyListeners('keywordRemoved', removed);
        
        return { success: true };
    },
    
    // Toggle keyword active status
    toggleKeyword: function(word) {
        const keyword = this.keywords.find(k => 
            k.word.toLowerCase() === word.toLowerCase()
        );
        
        if (!keyword) {
            return { success: false, error: 'Keyword not found' };
        }
        
        keyword.active = !keyword.active;
        this.saveKeywords();
        this.notifyListeners('keywordToggled', keyword);
        
        return { success: true, active: keyword.active };
    },
    
    // Update keyword
    updateKeyword: function(word, updates) {
        const keyword = this.keywords.find(k => 
            k.word.toLowerCase() === word.toLowerCase()
        );
        
        if (!keyword) {
            return { success: false, error: 'Keyword not found' };
        }
        
        Object.assign(keyword, updates);
        this.organizeByCategory();
        this.saveKeywords();
        this.notifyListeners('keywordUpdated', keyword);
        
        return { success: true, keyword };
    },
    
    // Check if message contains blocked keywords
    checkMessage: function(message) {
        const lowerMessage = message.toLowerCase();
        const blocked = [];
        
        this.keywords.forEach(keyword => {
            if (keyword.active && lowerMessage.includes(keyword.word)) {
                blocked.push(keyword);
                
                // Increment block count
                keyword.blockCount = (keyword.blockCount || 0) + 1;
                this.stats.totalBlocks++;
            }
        });
        
        if (blocked.length > 0) {
            // Update top blocked
            this.updateTopBlocked();
            this.saveStats();
        }
        
        return {
            blocked: blocked.length > 0,
            keywords: blocked,
            message: blocked.length > 0 ? 'Message contains blocked content' : 'Message is clean'
        };
    },
    
    // Update top blocked keywords stats
    updateTopBlocked: function() {
        this.stats.topBlocked = [...this.keywords]
            .sort((a, b) => (b.blockCount || 0) - (a.blockCount || 0))
            .slice(0, 10)
            .map(k => ({ word: k.word, count: k.blockCount || 0 }));
        
        this.stats.lastUpdated = new Date().toISOString();
    },
    
    // Import keywords from text
    importKeywords: function(text, category = 'custom') {
        const lines = text.split('\n');
        const words = [];
        
        lines.forEach(line => {
            // Split by commas, spaces, or newlines
            const parts = line.split(/[,\s]+/);
            parts.forEach(part => {
                const trimmed = part.trim().toLowerCase();
                if (trimmed && trimmed.length > 0) {
                    words.push(trimmed);
                }
            });
        });
        
        return this.addKeywords(words, category);
    },
    
    // Export keywords to text
    exportKeywords: function(format = 'txt') {
        if (format === 'csv') {
            // Export as CSV
            const headers = ['word', 'category', 'severity', 'active', 'blockCount'];
            const rows = this.keywords.map(k => [
                k.word,
                k.category,
                k.severity,
                k.active,
                k.blockCount || 0
            ]);
            
            const csv = [headers, ...rows]
                .map(row => row.join(','))
                .join('\n');
            
            return csv;
        } else {
            // Export as plain text (one per line)
            return this.keywords.map(k => k.word).join('\n');
        }
    },
    
    // Get keyword statistics
    getStats: function() {
        const activeCount = this.keywords.filter(k => k.active).length;
        const inactiveCount = this.keywords.length - activeCount;
        
        return {
            total: this.keywords.length,
            active: activeCount,
            inactive: inactiveCount,
            byCategory: {
                profanity: this.categories.profanity.length,
                spam: this.categories.spam.length,
                advertising: this.categories.advertising.length,
                custom: this.categories.custom.length
            },
            totalBlocks: this.stats.totalBlocks,
            topBlocked: this.stats.topBlocked,
            lastUpdated: this.stats.lastUpdated
        };
    },
    
    // Clear all keywords
    clearAll: function() {
        if (confirm('Are you sure you want to clear all keywords?')) {
            this.keywords = [];
            this.categories = {
                profanity: [],
                spam: [],
                advertising: [],
                custom: []
            };
            this.stats.totalBlocks = 0;
            this.stats.topBlocked = [];
            this.saveKeywords();
            this.saveStats();
            this.notifyListeners('keywordsCleared');
            return true;
        }
        return false;
    },
    
    // Reset to default keywords
    resetToDefault: function() {
        if (confirm('Reset to default keywords?')) {
            localStorage.removeItem('blocked-keywords');
            this.loadKeywords();
            this.notifyListeners('keywordsReset');
            return true;
        }
        return false;
    },
    
    // Save keywords to storage
    saveKeywords: function() {
        localStorage.setItem('blocked-keywords', JSON.stringify(this.keywords));
    },
    
    // Save stats to storage
    saveStats: function() {
        localStorage.setItem('keyword-stats', JSON.stringify(this.stats));
    },
    
    // Add listener
    addListener: function(callback) {
        this.listeners.push(callback);
    },
    
    // Remove listener
    removeListener: function(callback) {
        this.listeners = this.listeners.filter(cb => cb !== callback);
    },
    
    // Notify listeners
    notifyListeners: function(event, data) {
        this.listeners.forEach(callback => {
            try {
                callback(event, data);
            } catch (error) {
                console.error('Error in keyword listener:', error);
            }
        });
    },
    
    // Search keywords
    searchKeywords: function(query) {
        const lowerQuery = query.toLowerCase();
        return this.keywords.filter(k => 
            k.word.includes(lowerQuery) ||
            k.category.includes(lowerQuery)
        );
    },
    
    // Get suggested keywords (common patterns)
    getSuggestions: function() {
        return [
            { word: 'spam', category: 'spam' },
            { word: 'advertisement', category: 'advertising' },
            { word: 'promo', category: 'advertising' },
            { word: 'discount', category: 'advertising' },
            { word: 'free', category: 'advertising' },
            { word: 'hate', category: 'profanity' },
            { word: 'offensive', category: 'profanity' },
            { word: 'scam', category: 'spam' },
            { word: 'clickbait', category: 'spam' }
        ];
    }
};

// Initialize keywords service
KeywordsService.init();

// Export for use in other files
window.KeywordsService = KeywordsService;