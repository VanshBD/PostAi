// Initial seeded demo events
export const INITIAL_EVENTS = [
  {
    id: 'evt-ai-summit-2026',
    slug: 'ai-innovation-summit-2026',
    name: 'AI Innovation Summit 2026',
    organizerName: 'Tech Community India',
    date: '2026-10-15',
    location: 'Bengaluru Tech Convention Center & Virtual',
    description: 'The premier annual gathering of founders, AI architects, engineers, and researchers exploring next-generation agentic systems and generative models.',
    coverImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
    hashtags: ['#AIInnovation', '#AgenticAI', '#TechSummit2026', '#GenAI', '#BengaluruTech'],
    website: 'https://aisummit2026.example.com',
    linkedinPage: 'https://linkedin.com/company/techcommunity-india',
    twitter: 'https://x.com/tech_summit',
    speakers: [
      { name: 'Dr. Priya Sharma', role: 'VP of AI Research, NextGen Lab' },
      { name: 'Marcus Vance', role: 'Chief Architect, Agentic Systems' },
      { name: 'Arjun Mehta', role: 'Founder, CloudScale' }
    ],
    branding: {
      primaryColor: '#0a66c2', // LinkedIn blue
      accentColor: '#6366f1'
    },
    status: 'Active',
    createdAt: '2026-09-01T10:00:00Z',
    metrics: {
      attendees: 342,
      postsGenerated: 218,
      postsCopied: 184,
      linkedinOpens: 142,
      photosUploaded: 412,
      regenerations: 56
    }
  },
  {
    id: 'evt-dev-confluence',
    slug: 'cloud-innovators-con-2026',
    name: 'Cloud Innovators Con 2026',
    organizerName: 'DevOps & Cloud Circle',
    date: '2026-11-04',
    location: 'Hyatt Regency, Ahmedabad',
    description: 'Hands-on workshops, architectural blueprints, and keynote panels on Kubernetes, distributed cloud, and platform engineering.',
    coverImage: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
    logo: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=200&q=80',
    hashtags: ['#CloudComputing', '#DevOps2026', '#PlatformEng', '#Kubernetes'],
    website: 'https://cloudcon2026.example.com',
    linkedinPage: 'https://linkedin.com/company/devops-circle',
    twitter: 'https://x.com/cloudcon',
    speakers: [
      { name: 'Sarah Lin', role: 'Staff SRE, GlobalInfra' },
      { name: 'Rohan Joshi', role: 'Head of Cloud, ScaleNative' }
    ],
    branding: {
      primaryColor: '#2563eb',
      accentColor: '#3b82f6'
    },
    status: 'Active',
    createdAt: '2026-09-12T14:30:00Z',
    metrics: {
      attendees: 189,
      postsGenerated: 124,
      postsCopied: 98,
      linkedinOpens: 85,
      photosUploaded: 240,
      regenerations: 29
    }
  }
];

export const TONES = [
  { id: 'Professional', label: 'Professional', icon: 'Briefcase', desc: 'Tactical, well-structured, industry leadership focus' },
  { id: 'Key Takeaways', label: 'Key Takeaways', icon: 'ListOrdered', desc: 'Clean numbered bullet points and actionable lessons' },
  { id: 'Grateful Attendee', label: 'Grateful Attendee', icon: 'HeartHandshake', desc: 'Warm gratitude to organizers and fellow attendees' },
  { id: 'Thought Leadership', label: 'Thought Leadership', icon: 'Sparkles', desc: 'Big-picture industry outlook and provocative insights' },
  { id: 'Excited & Energetic', label: 'Excited & Energetic', icon: 'Zap', desc: 'High enthusiasm, fast-paced momentum, inspirational' },
  { id: 'Networking', label: 'Networking', icon: 'Users', desc: 'Focus on relationships, connections, and discussions' },
  { id: 'Reflective', label: 'Reflective', icon: 'Compass', desc: 'Thoughtful, authentic contemplation and personal growth' }
];

export const POST_LENGTHS = [
  { id: 'Short', label: 'Short (~100-120 words)' },
  { id: 'Medium', label: 'Medium (~180-220 words)' },
  { id: 'Long', label: 'Long (~300 words)' }
];

export const LANGUAGES = [
  { id: 'English', label: 'English' },
  { id: 'Hindi', label: 'Hindi (हिन्दी)' },
  { id: 'Gujarati', label: 'Gujarati (ગુજરાતી)' }
];
