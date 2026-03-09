// =========================================
// MOCK-DATA.JS - Mock Data for Development
// WeLe Platform - Collaborative Learning
// =========================================

const MockData = {
    // =========================================
    // USERS
    // =========================================
    users: [
        {
            id: 1,
            name: 'James Jason',
            email: 'james.jason@example.com',
            username: 'jamesj',
            role: 'user',
            status: 'active',
            avatar: 'https://i.pravatar.cc/150?u=jamesj',
            bio: 'Frontend developer passionate about UI/UX design. Love learning new technologies and sharing knowledge.',
            joinedAt: '2024-01-15T10:30:00Z',
            lastActive: '2024-01-20T15:45:00Z',
            preferences: {
                theme: 'light',
                notifications: true,
                emailDigest: 'weekly'
            },
            stats: {
                roomsJoined: 5,
                messagesSent: 127,
                reactionsGiven: 34
            }
        },
        {
            id: 2,
            name: 'Sarah Johnson',
            email: 'sarah.johnson@example.com',
            username: 'sarahmentor',
            role: 'mentor',
            status: 'active',
            avatar: 'https://i.pravatar.cc/150?u=sarahmentor',
            bio: 'Senior UX Designer with 8 years experience. Mentoring junior designers and leading design thinking workshops.',
            joinedAt: '2023-11-10T09:15:00Z',
            lastActive: '2024-01-20T16:30:00Z',
            mentorInfo: {
                topic: 'UX Design & Research',
                expertise: ['User Research', 'Wireframing', 'Prototyping', 'Usability Testing'],
                approvedAt: '2023-11-15T14:20:00Z',
                rating: 4.8,
                mentees: 12
            },
            preferences: {
                theme: 'dark',
                notifications: true,
                emailDigest: 'daily'
            },
            stats: {
                roomsJoined: 3,
                messagesSent: 342,
                reactionsGiven: 89,
                roomsCreated: 1
            }
        },
        {
            id: 3,
            name: 'Michael Chen',
            email: 'michael.chen@example.com',
            username: 'mikechen',
            role: 'user',
            status: 'active',
            avatar: 'https://i.pravatar.cc/150?u=mikechen',
            bio: 'Full-stack developer exploring AI and machine learning. Always excited to collaborate on interesting projects.',
            joinedAt: '2024-01-05T11:20:00Z',
            lastActive: '2024-01-20T14:15:00Z',
            preferences: {
                theme: 'system',
                notifications: true,
                emailDigest: 'never'
            },
            stats: {
                roomsJoined: 3,
                messagesSent: 56,
                reactionsGiven: 23
            }
        },
        {
            id: 4,
            name: 'Emma Watson',
            email: 'emma.w@example.com',
            username: 'emmaw',
            role: 'mentor',
            status: 'active',
            avatar: 'https://i.pravatar.cc/150?u=emmaw',
            bio: 'Data Scientist specializing in NLP and deep learning. PhD in Computer Science. Love mentoring aspiring data scientists.',
            joinedAt: '2023-10-20T08:45:00Z',
            lastActive: '2024-01-20T17:00:00Z',
            mentorInfo: {
                topic: 'Data Science & Machine Learning',
                expertise: ['Python', 'TensorFlow', 'NLP', 'Computer Vision'],
                approvedAt: '2023-10-25T10:30:00Z',
                rating: 4.9,
                mentees: 18
            },
            preferences: {
                theme: 'light',
                notifications: true,
                emailDigest: 'daily'
            },
            stats: {
                roomsJoined: 4,
                messagesSent: 567,
                reactionsGiven: 156,
                roomsCreated: 2
            }
        },
        {
            id: 5,
            name: 'Admin User',
            email: 'admin@wele.com',
            username: 'admin',
            role: 'admin',
            status: 'active',
            avatar: 'https://i.pravatar.cc/150?u=admin',
            bio: 'Platform administrator. Here to help keep WeLe running smoothly.',
            joinedAt: '2023-09-01T00:00:00Z',
            lastActive: '2024-01-20T18:00:00Z',
            preferences: {
                theme: 'light',
                notifications: true,
                emailDigest: 'daily'
            },
            stats: {
                roomsJoined: 10,
                messagesSent: 234,
                reactionsGiven: 67,
                roomsCreated: 5
            }
        },
        {
            id: 6,
            name: 'Alex Rivera',
            email: 'alex.r@example.com',
            username: 'alexr',
            role: 'user',
            status: 'active',
            avatar: 'https://i.pravatar.cc/150?u=alexr',
            bio: 'Mobile developer (iOS/Android) exploring cross-platform solutions.',
            joinedAt: '2024-01-18T13:10:00Z',
            lastActive: '2024-01-20T12:30:00Z',
            preferences: {
                theme: 'dark',
                notifications: true,
                emailDigest: 'weekly'
            },
            stats: {
                roomsJoined: 2,
                messagesSent: 18,
                reactionsGiven: 7
            }
        },
        {
            id: 7,
            name: 'Priya Patel',
            email: 'priya.p@example.com',
            username: 'priyap',
            role: 'mentor',
            status: 'pending',
            avatar: 'https://i.pravatar.cc/150?u=priyap',
            bio: 'Cloud architect with AWS certification. Building scalable solutions.',
            joinedAt: '2024-01-19T09:30:00Z',
            lastActive: '2024-01-19T09:30:00Z',
            mentorInfo: {
                topic: 'Cloud Computing & DevOps',
                expertise: ['AWS', 'Kubernetes', 'Docker', 'CI/CD'],
                status: 'pending',
                appliedAt: '2024-01-19T09:30:00Z'
            },
            preferences: {
                theme: 'system',
                notifications: true,
                emailDigest: 'daily'
            },
            stats: {
                roomsJoined: 0,
                messagesSent: 0,
                reactionsGiven: 0
            }
        },
        {
            id: 8,
            name: 'David Kim',
            email: 'david.k@example.com',
            username: 'davidk',
            role: 'user',
            status: 'suspended',
            avatar: 'https://i.pravatar.cc/150?u=davidk',
            bio: '',
            joinedAt: '2024-01-10T15:20:00Z',
            lastActive: '2024-01-15T10:45:00Z',
            preferences: {
                theme: 'light',
                notifications: false,
                emailDigest: 'never'
            },
            stats: {
                roomsJoined: 1,
                messagesSent: 5,
                reactionsGiven: 2
            }
        }
    ],

    // =========================================
    // ROOMS
    // =========================================
    rooms: [
        {
            id: 1,
            name: 'Design Strategy',
            topic: 'UI/UX Design Principles and Strategy',
            type: 'public',
            description: 'Learn and discuss UI/UX design principles, user research, and design thinking. Perfect for designers of all levels.',
            icon: '🎨',
            tags: ['design', 'ui/ux', 'creative', 'research'],
            createdBy: 2, // Sarah Johnson (mentor)
            createdAt: '2023-11-16T10:00:00Z',
            members: 15,
            memberList: [1, 2, 3, 4, 6],
            isActive: true,
            settings: {
                allowFiles: true,
                maxMembers: 50,
                isPrivate: false
            },
            stats: {
                totalMessages: 234,
                weeklyActive: 8
            }
        },
        {
            id: 2,
            name: 'Web Dev Hub',
            topic: 'Modern Web Development',
            type: 'public',
            description: 'Everything about modern web development - React, Vue, Node.js, TypeScript, and more. Share resources and get help.',
            icon: '💻',
            tags: ['web', 'javascript', 'react', 'node', 'coding'],
            createdBy: 4, // Emma Watson (mentor)
            createdAt: '2023-10-26T14:30:00Z',
            members: 23,
            memberList: [1, 2, 3, 4, 5, 6],
            isActive: true,
            settings: {
                allowFiles: true,
                maxMembers: 100,
                isPrivate: false
            },
            stats: {
                totalMessages: 567,
                weeklyActive: 15
            }
        },
        {
            id: 3,
            name: 'UX Research',
            topic: 'User Research Methods',
            type: 'public',
            description: 'Discuss user research methodologies, usability testing, and research tools. Share case studies and best practices.',
            icon: '🔍',
            tags: ['research', 'ux', 'testing', 'user-interviews'],
            createdBy: 2, // Sarah Johnson (mentor)
            createdAt: '2023-11-20T09:15:00Z',
            members: 8,
            memberList: [2, 3, 4],
            isActive: true,
            settings: {
                allowFiles: true,
                maxMembers: 30,
                isPrivate: false
            },
            stats: {
                totalMessages: 89,
                weeklyActive: 5
            }
        },
        {
            id: 4,
            name: 'Data Science Central',
            topic: 'Data Science & Machine Learning',
            type: 'public',
            description: 'Explore data science, machine learning algorithms, and statistical analysis. Perfect for data enthusiasts.',
            icon: '📊',
            tags: ['data-science', 'machine-learning', 'python', 'analytics'],
            createdBy: 4, // Emma Watson (mentor)
            createdAt: '2023-11-05T16:45:00Z',
            members: 18,
            memberList: [1, 3, 4, 5],
            isActive: true,
            settings: {
                allowFiles: true,
                maxMembers: 75,
                isPrivate: false
            },
            stats: {
                totalMessages: 345,
                weeklyActive: 12
            }
        },
        {
            id: 5,
            name: 'React Masters',
            topic: 'Advanced React Patterns',
            type: 'private',
            description: 'Deep dive into advanced React concepts, hooks, performance optimization, and architecture patterns.',
            icon: '⚛️',
            tags: ['react', 'javascript', 'frontend', 'advanced'],
            createdBy: 5, // Admin
            createdAt: '2024-01-10T11:00:00Z',
            members: 5,
            memberList: [1, 3, 5],
            isActive: true,
            inviteLink: 'https://wele.com/join/react-masters-abc123',
            settings: {
                allowFiles: true,
                maxMembers: 20,
                isPrivate: true
            },
            stats: {
                totalMessages: 45,
                weeklyActive: 3
            }
        },
        {
            id: 6,
            name: 'Beginner\'s Corner',
            topic: 'Programming Fundamentals',
            type: 'public',
            description: 'A friendly place for beginners to ask questions and learn programming basics. No question is too simple!',
            icon: '🌱',
            tags: ['beginner', 'programming', 'learning', 'help'],
            createdBy: 5, // Admin
            createdAt: '2024-01-15T13:20:00Z',
            members: 12,
            memberList: [1, 3, 6],
            isActive: true,
            settings: {
                allowFiles: true,
                maxMembers: 100,
                isPrivate: false
            },
            stats: {
                totalMessages: 67,
                weeklyActive: 7
            }
        },
        {
            id: 7,
            name: 'DevOps Weekly',
            topic: 'DevOps Practices & Tools',
            type: 'mentor',
            description: 'Weekly discussions about CI/CD, containerization, cloud infrastructure, and automation.',
            icon: '🔄',
            tags: ['devops', 'aws', 'docker', 'kubernetes', 'ci/cd'],
            createdBy: 7, // Priya Patel (pending mentor)
            createdAt: '2024-01-19T10:00:00Z',
            members: 1,
            memberList: [7],
            isActive: true,
            status: 'pending',
            settings: {
                allowFiles: true,
                maxMembers: 50,
                isPrivate: false
            },
            stats: {
                totalMessages: 0,
                weeklyActive: 0
            }
        },
        {
            id: 8,
            name: 'Mobile Dev Talk',
            topic: 'iOS & Android Development',
            type: 'public',
            description: 'Discuss native and cross-platform mobile development. Share tips, libraries, and best practices.',
            icon: '📱',
            tags: ['mobile', 'ios', 'android', 'react-native', 'flutter'],
            createdBy: 5, // Admin
            createdAt: '2024-01-08T15:30:00Z',
            members: 9,
            memberList: [1, 6],
            isActive: true,
            settings: {
                allowFiles: true,
                maxMembers: 60,
                isPrivate: false
            },
            stats: {
                totalMessages: 34,
                weeklyActive: 4
            }
        }
    ],

    // =========================================
    // MESSAGES
    // =========================================
    messages: {
        // Room 1: Design Strategy
        1: [
            {
                id: 101,
                roomId: 1,
                userId: 2,
                userName: 'Sarah Johnson',
                userAvatar: 'https://i.pravatar.cc/150?u=sarahmentor',
                content: 'Welcome everyone to the Design Strategy room! I\'m excited to discuss UI/UX principles with you all.',
                timestamp: '2024-01-20T09:00:00Z',
                isMentor: true,
                reactions: [
                    { emoji: '👋', count: 3, users: [1, 3, 4] }
                ]
            },
            {
                id: 102,
                roomId: 1,
                userId: 1,
                userName: 'James Jason',
                userAvatar: 'https://i.pravatar.cc/150?u=jamesj',
                content: 'Hi Sarah! I\'ve been reading about atomic design. Would love to hear your thoughts on it.',
                timestamp: '2024-01-20T09:05:00Z',
                isMentor: false,
                reactions: [
                    { emoji: '👍', count: 2, users: [2, 3] }
                ]
            },
            {
                id: 103,
                roomId: 1,
                userId: 2,
                userName: 'Sarah Johnson',
                userAvatar: 'https://i.pravatar.cc/150?u=sarahmentor',
                content: 'Great question! Atomic design is fantastic for creating consistent, scalable design systems. The concept of atoms, molecules, and organisms really helps in organizing components.',
                timestamp: '2024-01-20T09:08:00Z',
                isMentor: true,
                attachments: [
                    {
                        type: 'link',
                        url: 'https://atomicdesign.bradfrost.com/',
                        title: 'Atomic Design by Brad Frost'
                    }
                ],
                reactions: [
                    { emoji: '❤️', count: 4, users: [1, 3, 4, 6] },
                    { emoji: '🔖', count: 2, users: [1, 3] }
                ]
            },
            {
                id: 104,
                roomId: 1,
                userId: 3,
                userName: 'Michael Chen',
                userAvatar: 'https://i.pravatar.cc/150?u=mikechen',
                content: 'Has anyone tried using Figma for creating design systems? Looking for recommendations.',
                timestamp: '2024-01-20T09:15:00Z',
                isMentor: false,
                reactions: []
            },
            {
                id: 105,
                roomId: 1,
                userId: 2,
                userName: 'Sarah Johnson',
                userAvatar: 'https://i.pravatar.cc/150?u=sarahmentor',
                content: 'Figma is excellent for design systems! Their component library and style features are top-notch. I can share some resources if you\'re interested.',
                timestamp: '2024-01-20T09:18:00Z',
                isMentor: true,
                reactions: [
                    { emoji: '🙌', count: 3, users: [1, 3, 4] }
                ]
            },
            {
                id: 106,
                roomId: 1,
                userId: 1,
                userName: 'James Jason',
                userAvatar: 'https://i.pravatar.cc/150?u=jamesj',
                content: 'Yes please! That would be really helpful.',
                timestamp: '2024-01-20T09:20:00Z',
                isMentor: false,
                reactions: []
            },
            {
                id: 107,
                roomId: 1,
                userId: 2,
                userName: 'Sarah Johnson',
                userAvatar: 'https://i.pravatar.cc/150?u=sarahmentor',
                content: 'Here\'s a great tutorial series on Figma for design systems:',
                timestamp: '2024-01-20T09:22:00Z',
                isMentor: true,
                attachments: [
                    {
                        type: 'link',
                        url: 'https://www.figma.com/resources/learn-design/',
                        title: 'Figma Learn Design'
                    }
                ],
                reactions: []
            }
        ],
        
        // Room 2: Web Dev Hub
        2: [
            {
                id: 201,
                roomId: 2,
                userId: 4,
                userName: 'Emma Watson',
                userAvatar: 'https://i.pravatar.cc/150?u=emmaw',
                content: 'Welcome to Web Dev Hub! Let\'s talk about the latest in web development. What\'s everyone working on?',
                timestamp: '2024-01-20T10:00:00Z',
                isMentor: true,
                reactions: [
                    { emoji: '👋', count: 5, users: [1, 2, 3, 5, 6] }
                ]
            },
            {
                id: 202,
                roomId: 2,
                userId: 1,
                userName: 'James Jason',
                userAvatar: 'https://i.pravatar.cc/150?u=jamesj',
                content: 'Just started learning React. Any tips for beginners?',
                timestamp: '2024-01-20T10:05:00Z',
                isMentor: false,
                reactions: [
                    { emoji: '👍', count: 2, users: [2, 4] }
                ]
            },
            {
                id: 203,
                roomId: 2,
                userId: 4,
                userName: 'Emma Watson',
                userAvatar: 'https://i.pravatar.cc/150?u=emmaw',
                content: 'Great choice! I\'d recommend starting with the official React tutorial, then building small projects. The key is understanding components, props, and state.',
                timestamp: '2024-01-20T10:08:00Z',
                isMentor: true,
                reactions: [
                    { emoji: '📝', count: 3, users: [1, 3, 6] }
                ]
            },
            {
                id: 204,
                roomId: 2,
                userId: 3,
                userName: 'Michael Chen',
                userAvatar: 'https://i.pravatar.cc/150?u=mikechen',
                content: 'I\'m exploring Next.js 14. The new app router is pretty powerful!',
                timestamp: '2024-01-20T10:15:00Z',
                isMentor: false,
                reactions: [
                    { emoji: '🔥', count: 2, users: [4, 5] }
                ]
            },
            {
                id: 205,
                roomId: 2,
                userId: 4,
                userName: 'Emma Watson',
                userAvatar: 'https://i.pravatar.cc/150?u=emmaw',
                content: 'Next.js is excellent! The server components and streaming SSR are game-changers. Has anyone tried the new Turbopack?',
                timestamp: '2024-01-20T10:18:00Z',
                isMentor: true,
                reactions: []
            },
            {
                id: 206,
                roomId: 2,
                userId: 5,
                userName: 'Admin User',
                userAvatar: 'https://i.pravatar.cc/150?u=admin',
                content: 'Just wanted to mention that we\'re planning a hackathon next month. Stay tuned for details!',
                timestamp: '2024-01-20T10:25:00Z',
                isMentor: false,
                reactions: [
                    { emoji: '🎉', count: 6, users: [1, 2, 3, 4, 6] }
                ]
            }
        ],
        
        // Room 3: UX Research
        3: [
            {
                id: 301,
                roomId: 3,
                userId: 2,
                userName: 'Sarah Johnson',
                userAvatar: 'https://i.pravatar.cc/150?u=sarahmentor',
                content: 'Welcome to UX Research! Let\'s discuss user research methods. What techniques have you found most effective?',
                timestamp: '2024-01-19T15:00:00Z',
                isMentor: true,
                reactions: [
                    { emoji: '👋', count: 2, users: [3, 4] }
                ]
            },
            {
                id: 302,
                roomId: 3,
                userId: 4,
                userName: 'Emma Watson',
                userAvatar: 'https://i.pravatar.cc/150?u=emmaw',
                content: 'I love contextual inquiry - observing users in their natural environment provides such rich insights.',
                timestamp: '2024-01-19T15:10:00Z',
                isMentor: true,
                reactions: [
                    { emoji: '👍', count: 3, users: [2, 3] }
                ]
            },
            {
                id: 303,
                roomId: 3,
                userId: 3,
                userName: 'Michael Chen',
                userAvatar: 'https://i.pravatar.cc/150?u=mikechen',
                content: 'I\'ve been using unmoderated usability testing tools. They\'re great for getting quick feedback.',
                timestamp: '2024-01-19T15:20:00Z',
                isMentor: false,
                reactions: []
            }
        ],
        
        // Room 4: Data Science Central
        4: [
            {
                id: 401,
                roomId: 4,
                userId: 4,
                userName: 'Emma Watson',
                userAvatar: 'https://i.pravatar.cc/150?u=emmaw',
                content: 'Welcome to Data Science Central! Let\'s explore the fascinating world of data together.',
                timestamp: '2024-01-19T16:00:00Z',
                isMentor: true,
                reactions: [
                    { emoji: '👋', count: 3, users: [1, 3, 5] }
                ]
            },
            {
                id: 402,
                roomId: 4,
                userId: 1,
                userName: 'James Jason',
                userAvatar: 'https://i.pravatar.cc/150?u=jamesj',
                content: 'Just started learning Python for data analysis. Any recommended libraries?',
                timestamp: '2024-01-19T16:10:00Z',
                isMentor: false,
                reactions: []
            },
            {
                id: 403,
                roomId: 4,
                userId: 4,
                userName: 'Emma Watson',
                userAvatar: 'https://i.pravatar.cc/150?u=emmaw',
                content: 'Start with pandas for data manipulation, matplotlib for visualization, and scikit-learn for ML. Here\'s a great resource:',
                timestamp: '2024-01-19T16:15:00Z',
                isMentor: true,
                attachments: [
                    {
                        type: 'link',
                        url: 'https://www.kaggle.com/learn',
                        title: 'Kaggle Learn - Free Data Science Courses'
                    }
                ],
                reactions: [
                    { emoji: '📚', count: 4, users: [1, 3, 5] }
                ]
            },
            {
                id: 404,
                roomId: 4,
                userId: 3,
                userName: 'Michael Chen',
                userAvatar: 'https://i.pravatar.cc/150?u=mikechen',
                content: 'Kaggle is amazing! Their competitions are great for learning.',
                timestamp: '2024-01-19T16:20:00Z',
                isMentor: false,
                reactions: []
            }
        ],
        
        // Room 5: React Masters (Private)
        5: [
            {
                id: 501,
                roomId: 5,
                userId: 5,
                userName: 'Admin User',
                userAvatar: 'https://i.pravatar.cc/150?u=admin',
                content: 'Welcome to React Masters! This is a private room for advanced React discussions.',
                timestamp: '2024-01-20T11:00:00Z',
                isMentor: false,
                reactions: []
            },
            {
                id: 502,
                roomId: 5,
                userId: 1,
                userName: 'James Jason',
                userAvatar: 'https://i.pravatar.cc/150?u=jamesj',
                content: 'I\'ve been working on optimizing a large React app. Any tips on reducing bundle size?',
                timestamp: '2024-01-20T11:05:00Z',
                isMentor: false,
                reactions: [
                    { emoji: '🤔', count: 1, users: [3] }
                ]
            },
            {
                id: 503,
                roomId: 5,
                userId: 3,
                userName: 'Michael Chen',
                userAvatar: 'https://i.pravatar.cc/150?u=mikechen',
                content: 'Code splitting with React.lazy() and Suspense works great. Also, analyze your bundle with tools like webpack-bundle-analyzer.',
                timestamp: '2024-01-20T11:10:00Z',
                isMentor: false,
                reactions: [
                    { emoji: '👍', count: 2, users: [1, 5] }
                ]
            }
        ]
    },

    // =========================================
    // MENTOR APPLICATIONS
    // =========================================
    mentorApplications: [
        {
            id: 1001,
            userId: 7,
            userName: 'Priya Patel',
            userEmail: 'priya.p@example.com',
            topic: 'Cloud Computing & DevOps',
            expertise: ['AWS', 'Kubernetes', 'Docker', 'CI/CD'],
            proof: 'AWS Certified Solutions Architect with 5 years experience implementing DevOps practices. Led cloud migration for Fortune 500 company. Regular speaker at tech conferences.',
            status: 'pending',
            submittedAt: '2024-01-19T09:30:00Z',
            reviewedAt: null,
            adminComments: null
        },
        {
            id: 1002,
            userId: 9,
            userName: 'Thomas Anderson',
            userEmail: 'tom.a@example.com',
            topic: 'Cybersecurity Fundamentals',
            expertise: ['Network Security', 'Ethical Hacking', 'Cryptography'],
            proof: 'CISSP certified with 10 years in information security. Currently security lead at fintech startup. Created popular cybersecurity blog.',
            status: 'approved',
            submittedAt: '2024-01-15T14:20:00Z',
            reviewedAt: '2024-01-16T10:30:00Z',
            adminComments: 'Excellent credentials. Approved to create cybersecurity room.'
        },
        {
            id: 1003,
            userId: 10,
            userName: 'Lisa Wong',
            userEmail: 'lisa.w@example.com',
            topic: 'Product Management',
            expertise: ['Product Strategy', 'Agile', 'User Stories', 'Roadmapping'],
            proof: 'Senior PM at tech company with 6 years experience. Launched 3 successful products. Certified Scrum Product Owner.',
            status: 'rejected',
            submittedAt: '2024-01-10T11:45:00Z',
            reviewedAt: '2024-01-12T15:20:00Z',
            adminComments: 'Please provide more specific examples of your product management experience and certifications.'
        },
        {
            id: 1004,
            userId: 11,
            userName: 'Robert Garcia',
            userEmail: 'robert.g@example.com',
            topic: 'Game Development with Unity',
            expertise: ['Unity 3D', 'C#', 'Game Design', '2D/3D Graphics'],
            proof: 'Indie game developer with 2 published games on Steam. 4 years experience teaching game dev at community college. Strong portfolio.',
            status: 'pending',
            submittedAt: '2024-01-18T16:15:00Z',
            reviewedAt: null,
            adminComments: null
        }
    ],

    // =========================================
    // ROOM REQUESTS
    // =========================================
    roomRequests: [
        {
            id: 2001,
            userId: 6,
            userName: 'Alex Rivera',
            title: 'React Native Workshop',
            topic: 'Cross-platform Mobile Development',
            reason: 'Need a dedicated space for React Native developers to share components, troubleshoot issues, and discuss best practices. There\'s growing interest in mobile development.',
            status: 'pending',
            submittedAt: '2024-01-18T13:30:00Z',
            reviewedAt: null,
            adminComments: null
        },
        {
            id: 2002,
            userId: 3,
            userName: 'Michael Chen',
            title: 'Algorithms & Data Structures',
            topic: 'Computer Science Fundamentals',
            reason: 'Would like a room for discussing algorithms, preparing for coding interviews, and solving problems together. Could be helpful for students and job seekers.',
            status: 'approved',
            submittedAt: '2024-01-14T10:15:00Z',
            reviewedAt: '2024-01-15T09:20:00Z',
            adminComments: 'Great idea! Approved. Please keep discussions focused on algorithms.'
        },
        {
            id: 2003,
            userId: 1,
            userName: 'James Jason',
            title: 'CSS Art & Animations',
            topic: 'Creative CSS Techniques',
            reason: 'Want to create a space for sharing CSS art, animations, and creative frontend techniques. Could inspire designers and developers.',
            status: 'rejected',
            submittedAt: '2024-01-12T15:45:00Z',
            reviewedAt: '2024-01-13T11:30:00Z',
            adminComments: 'Consider joining the existing Design Strategy room first. We can revisit this if there\'s enough interest.'
        },
        {
            id: 2004,
            userId: 4,
            userName: 'Emma Watson',
            title: 'Deep Learning Study Group',
            topic: 'Neural Networks & Deep Learning',
            reason: 'Advanced study group for deep learning practitioners. Would cover papers, implementations, and research discussions.',
            status: 'pending',
            submittedAt: '2024-01-19T17:00:00Z',
            reviewedAt: null,
            adminComments: null
        }
    ],

    // =========================================
    // BLOCKED KEYWORDS
    // =========================================
    blockedKeywords: [
        { id: 1, word: 'spam', category: 'spam', severity: 'medium', active: true, blockCount: 45 },
        { id: 2, word: 'advertisement', category: 'advertising', severity: 'medium', active: true, blockCount: 32 },
        { id: 3, word: 'buy now', category: 'advertising', severity: 'high', active: true, blockCount: 28 },
        { id: 4, word: 'discount', category: 'advertising', severity: 'low', active: true, blockCount: 56 },
        { id: 5, word: 'free money', category: 'spam', severity: 'high', active: true, blockCount: 12 },
        { id: 6, word: 'hate', category: 'profanity', severity: 'high', active: true, blockCount: 8 },
        { id: 7, word: 'violence', category: 'profanity', severity: 'high', active: true, blockCount: 5 },
        { id: 8, word: 'inappropriate', category: 'profanity', severity: 'medium', active: true, blockCount: 15 },
        { id: 9, word: 'scam', category: 'spam', severity: 'high', active: true, blockCount: 9 },
        { id: 10, word: 'fraud', category: 'spam', severity: 'high', active: true, blockCount: 6 },
        { id: 11, word: 'porn', category: 'profanity', severity: 'high', active: true, blockCount: 3 },
        { id: 12, word: 'sex', category: 'profanity', severity: 'high', active: true, blockCount: 4 },
        { id: 13, word: 'drugs', category: 'profanity', severity: 'high', active: true, blockCount: 2 },
        { id: 14, word: 'gambling', category: 'spam', severity: 'high', active: true, blockCount: 7 },
        { id: 15, word: 'casino', category: 'spam', severity: 'high', active: true, blockCount: 5 },
        { id: 16, word: 'bitcoin', category: 'spam', severity: 'medium', active: false, blockCount: 18 },
        { id: 17, word: 'crypto', category: 'spam', severity: 'low', active: false, blockCount: 22 }
    ],

    // =========================================
    // KEYWORD STATISTICS
    // =========================================
    keywordStats: {
        totalBlocks: 322,
        topBlocked: [
            { word: 'discount', count: 56 },
            { word: 'spam', count: 45 },
            { word: 'advertisement', count: 32 },
            { word: 'buy now', count: 28 },
            { word: 'crypto', count: 22 }
        ],
        byCategory: {
            spam: 79,
            advertising: 116,
            profanity: 37,
            other: 90
        },
        lastUpdated: '2024-01-20T18:00:00Z'
    },

    // =========================================
    // NOTIFICATIONS
    // =========================================
    notifications: [
        {
            id: 3001,
            userId: 1,
            type: 'room_invite',
            title: 'Invitation to React Masters',
            message: 'You have been invited to join the private room "React Masters"',
            read: false,
            createdAt: '2024-01-20T11:00:00Z',
            data: { roomId: 5, inviterId: 5 }
        },
        {
            id: 3002,
            userId: 1,
            type: 'mention',
            title: 'Sarah mentioned you',
            message: 'Sarah Johnson mentioned you in Design Strategy: "@James have you seen this?"',
            read: true,
            createdAt: '2024-01-19T15:30:00Z',
            data: { roomId: 1, messageId: 105 }
        },
        {
            id: 3003,
            userId: 3,
            type: 'room_approved',
            title: 'Room Request Approved',
            message: 'Your request for "Algorithms & Data Structures" room has been approved!',
            read: false,
            createdAt: '2024-01-15T09:20:00Z',
            data: { roomId: 9, requestId: 2002 }
        },
        {
            id: 3004,
            userId: 7,
            type: 'mentor_update',
            title: 'Mentor Application Received',
            message: 'Your mentor application for "Cloud Computing & DevOps" has been received and is under review.',
            read: true,
            createdAt: '2024-01-19T09:35:00Z',
            data: { applicationId: 1001 }
        },
        {
            id: 3005,
            userId: 10,
            type: 'mentor_rejected',
            title: 'Mentor Application Update',
            message: 'Your mentor application was not approved. Please see comments for details.',
            read: true,
            createdAt: '2024-01-12T15:25:00Z',
            data: { applicationId: 1003 }
        }
    ],

    // =========================================
    // SYSTEM STATISTICS
    // =========================================
    systemStats: {
        totalUsers: 156,
        activeUsers: 43,
        totalRooms: 12,
        activeRooms: 8,
        totalMessages: 1876,
        messagesToday: 89,
        mentorApplications: 4,
        roomRequests: 3,
        pendingReviews: 2,
        serverUptime: '15 days',
        lastBackup: '2024-01-20T03:00:00Z',
        storageUsed: '2.4 GB'
    },

    // =========================================
    // HELPER METHODS
    // =========================================
    
    // Get user by ID
    getUserById: function(userId) {
        return this.users.find(user => user.id === userId) || null;
    },
    
    // Get user by email
    getUserByEmail: function(email) {
        return this.users.find(user => user.email === email) || null;
    },
    
    // Get room by ID
    getRoomById: function(roomId) {
        return this.rooms.find(room => room.id === roomId) || null;
    },
    
    // Get messages for a room
    getMessagesForRoom: function(roomId) {
        return this.messages[roomId] || [];
    },
    
    // Get pending mentor applications
    getPendingMentorApplications: function() {
        return this.mentorApplications.filter(app => app.status === 'pending');
    },
    
    // Get pending room requests
    getPendingRoomRequests: function() {
        return this.roomRequests.filter(req => req.status === 'pending');
    },
    
    // Get active blocked keywords
    getActiveKeywords: function() {
        return this.blockedKeywords.filter(kw => kw.active).map(kw => kw.word);
    },
    
    // Get rooms by type
    getRoomsByType: function(type) {
        return this.rooms.filter(room => room.type === type);
    },
    
    // Get rooms for user
    getRoomsForUser: function(userId) {
        return this.rooms.filter(room => 
            room.memberList.includes(userId) || room.createdBy === userId
        );
    },
    
    // Get unread notifications for user
    getUnreadNotifications: function(userId) {
        return this.notifications.filter(n => n.userId === userId && !n.read);
    },
    
    // Get user statistics
    getUserStats: function(userId) {
        const user = this.getUserById(userId);
        if (!user) return null;
        
        const userMessages = Object.values(this.messages)
            .flat()
            .filter(m => m.userId === userId);
        
        const userRooms = this.getRoomsForUser(userId);
        
        return {
            ...user.stats,
            totalMessages: userMessages.length,
            roomsJoined: userRooms.length,
            recentActivity: userMessages.slice(-5)
        };
    },
    
    // Search rooms
    searchRooms: function(query) {
        const lowerQuery = query.toLowerCase();
        return this.rooms.filter(room => 
            room.name.toLowerCase().includes(lowerQuery) ||
            room.topic.toLowerCase().includes(lowerQuery) ||
            room.description.toLowerCase().includes(lowerQuery) ||
            room.tags.some(tag => tag.includes(lowerQuery))
        );
    },
    
    // Get popular rooms
    getPopularRooms: function(limit = 5) {
        return [...this.rooms]
            .sort((a, b) => b.members - a.members)
            .slice(0, limit);
    },
    
    // Get recent rooms
    getRecentRooms: function(limit = 5) {
        return [...this.rooms]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, limit);
    },
    
    // Get active mentors
    getActiveMentors: function() {
        return this.users.filter(user => 
            user.role === 'mentor' && user.status === 'active'
        );
    },
    
    // Get system health
    getSystemHealth: function() {
        return {
            status: 'healthy',
            stats: this.systemStats,
            issues: []
        };
    },
    
    // Reset to default data (for testing)
    resetToDefault: function() {
        // This would reload the default mock data
        console.log('Mock data reset to default');
        return true;
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MockData;
} else {
    window.MockData = MockData;
}