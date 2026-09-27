import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGODB_URI || 'mongodb+srv://obscurlabs_db_user:A9RlRloTggcNvvKx@cluster0.8rfhttn.mongodb.net/postai?retryWrites=true&w=majority&appName=Cluster0';

// Define Schemas
const EventSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  slug: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  organizerName: { type: String, required: true },
  date: { type: String, required: true },
  location: { type: String, required: true },
  description: String,
  coverImage: String,
  logo: String,
  hashtags: [String],
  website: String,
  linkedinPage: String,
  twitter: String,
  speakers: [{
    name: String,
    role: String
  }],
  branding: {
    primaryColor: String,
    accentColor: String
  },
  status: { type: String, default: 'Active' },
  metrics: {
    attendees: { type: Number, default: 0 },
    postsGenerated: { type: Number, default: 0 },
    postsCopied: { type: Number, default: 0 },
    linkedinOpens: { type: Number, default: 0 },
    photosUploaded: { type: Number, default: 0 },
    regenerations: { type: Number, default: 0 }
  }
}, { timestamps: true });

const GenerationSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  eventId: String,
  attendeeName: String,
  attendeeJobTitle: String,
  attendeeCompany: String,
  tone: String,
  highlights: String,
  generatedText: String,
  photoCount: Number,
  provider: String,
  createdAt: { type: Date, default: Date.now }
});

const Event = mongoose.model('Event', EventSchema);
const Generation = mongoose.model('Generation', GenerationSchema);

const DUMMY_EVENTS = [
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
      primaryColor: '#0a66c2',
      accentColor: '#6366f1'
    },
    status: 'Active',
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
    metrics: {
      attendees: 189,
      postsGenerated: 124,
      postsCopied: 98,
      linkedinOpens: 85,
      photosUploaded: 240,
      regenerations: 29
    }
  },
  {
    id: 'evt-saas-growth-summit',
    slug: 'global-saas-growth-summit-2026',
    name: 'Global SaaS Growth Summit 2026',
    organizerName: 'SaaS Founders Collective',
    date: '2026-12-08',
    location: 'Jio World Convention Centre, Mumbai',
    description: 'Scaling B2B SaaS from $1M to $50M ARR: GTM strategy, product-led growth, and AI integration.',
    coverImage: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80',
    logo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&w=200&q=80',
    hashtags: ['#SaaSGrowth', '#B2BSaaS', '#ProductLed', '#VentureCapital', '#MumbaiTech'],
    website: 'https://saasgrowth2026.example.com',
    linkedinPage: 'https://linkedin.com/company/saas-founders-collective',
    twitter: 'https://x.com/saas_growth',
    speakers: [
      { name: 'Neha Varma', role: 'General Partner, Elevate Ventures' },
      { name: 'David Zhao', role: 'Chief Growth Officer, MetricScale' }
    ],
    branding: {
      primaryColor: '#059669',
      accentColor: '#10b981'
    },
    status: 'Active',
    metrics: {
      attendees: 260,
      postsGenerated: 195,
      postsCopied: 160,
      linkedinOpens: 120,
      photosUploaded: 310,
      regenerations: 42
    }
  }
];

const DUMMY_GENERATIONS = [
  {
    id: 'gen-001',
    eventId: 'evt-ai-summit-2026',
    attendeeName: 'Alex Patel',
    attendeeJobTitle: 'Senior Product Engineer',
    attendeeCompany: 'TechFlow Systems',
    tone: 'Thought Leadership',
    highlights: 'Learned about autonomous multi-agent orchestration loops reducing cycle times by 40%.',
    generatedText: `Most conferences talk about where technology was yesterday. AI Innovation Summit 2026 focused on where it is heading tomorrow.\n\nKey learning:\nAutonomous multi-agent orchestration loops reducing cycle times by 40%.\n\nKudos to Tech Community India for curating such high-impact discussions!\n\n#AIInnovation #AgenticAI #TechSummit2026`,
    photoCount: 2,
    provider: 'Groq (Llama 3.3 70B)'
  },
  {
    id: 'gen-002',
    eventId: 'evt-dev-confluence',
    attendeeName: 'Maya Sen',
    attendeeJobTitle: 'DevOps Architect',
    attendeeCompany: 'CloudSphere',
    tone: 'Key Takeaways',
    highlights: 'Kubernetes multi-cluster orchestration patterns and automated canary rollouts.',
    generatedText: `Spending time at Cloud Innovators Con 2026 hosted by DevOps & Cloud Circle was truly perspective-shifting.\n\nTop takeaways:\n1. Multi-cluster resilience\n2. Automated canary rollouts reduce release risk\n\n#CloudComputing #DevOps2026 #Kubernetes`,
    photoCount: 1,
    provider: 'Google Gemini 1.5 Flash'
  }
];

async function seed() {
  console.log('Connecting to MongoDB Atlas...');
  try {
    await mongoose.connect(uri);
    console.log(' Connected to MongoDB Atlas successfully!');

    // Clear existing dummy data to avoid duplicate key errors
    await Event.deleteMany({ id: { $in: DUMMY_EVENTS.map(e => e.id) } });
    await Generation.deleteMany({ id: { $in: DUMMY_GENERATIONS.map(g => g.id) } });

    console.log('Inserting dummy events...');
    const insertedEvents = await Event.insertMany(DUMMY_EVENTS);
    console.log(` Successfully inserted ${insertedEvents.length} events into MongoDB!`);

    console.log('Inserting dummy attendee generations...');
    const insertedGenerations = await Generation.insertMany(DUMMY_GENERATIONS);
    console.log(` Successfully inserted ${insertedGenerations.length} generation records into MongoDB!`);

    console.log('\n--- MongoDB Atlas Collections Summary ---');
    console.log(`Events: ${await Event.countDocuments()}`);
    console.log(`Generations: ${await Generation.countDocuments()}`);
    console.log('-----------------------------------------');

    await mongoose.disconnect();
    console.log('Database connection closed.');
    process.exit(0);
  } catch (err) {
    console.error(' MongoDB Atlas Seed Error:', err.message);
    process.exit(1);
  }
}

seed();
