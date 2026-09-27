// AI Service Layer: Multi-provider resilient client
// Supports Groq (Llama 3 70b/8b) and Google Gemini with graceful fallback and structured responses

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || '';
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

/**
 * Builds the comprehensive prompt for LinkedIn post generation
 */
export function buildPrompt({
  event,
  attendee,
  highlights,
  tone = 'Professional',
  options = {},
  refinement = null,
  previousPost = null
}) {
  const {
    length = 'Medium',
    includeHashtags = true,
    includeEventMention = true,
    includeOrganizerMention = true,
    includeSpeakerMentions = true,
    includeCTA = true,
    language = 'English'
  } = options;

  let prompt = `You are an elite LinkedIn ghostwriter and personal branding specialist. 
Your task is to write a top-tier, highly engaging, authentic LinkedIn post based on an attendee's experience at an event.

### CONTEXT:
- Event Name: "${event.name}"
- Organizer / Host: "${event.organizerName}"
- Event Date: "${event.date}"
- Event Location: "${event.location}"
- Event Description: "${event.description || 'A gathering of leaders, innovators, and professionals.'}"
${event.website ? `- Website: ${event.website}` : ''}
${event.speakers && event.speakers.length > 0 ? `- Notable Speakers: ${event.speakers.map(s => `${s.name} (${s.role || ''})`).join(', ')}` : ''}

### ATTENDEE PROFILE:
- Name: "${attendee?.name || 'Attendee'}"
${attendee?.jobTitle ? `- Job Title: "${attendee.jobTitle}"` : ''}
${attendee?.company ? `- Company: "${attendee.company}"` : ''}

### ATTENDEE RAW HIGHLIGHTS & NOTES:
"""
${highlights || 'Attended an insightful session full of forward-thinking discussions, actionable strategies, and great networking.'}
"""

### SPECIFICATIONS:
- Tone of Voice: ${tone} (e.g. Professional, Grateful Attendee, Key Takeaways, Thought Leadership, Excited & Energetic, Networking, Reflective)
- Target Length: ${length} (${length === 'Short' ? 'under 120 words, punchy' : length === 'Long' ? '250-400 words, deep dive with structured bullet points' : '150-250 words, balanced narrative and takeaways'})
- Language: Write the post in ${language}.
${includeEventMention ? `- MUST naturally mention the event "${event.name}".` : '- Do not explicitly mention the event name.'}
${includeOrganizerMention ? `- MUST naturally tag/give credit to the organizer "${event.organizerName}".` : ''}
${includeSpeakerMentions && event.speakers?.length ? `- Mention or tag key speakers if relevant to takeaways: ${event.speakers.map(s => s.name).join(', ')}.` : ''}
${includeCTA ? `- End with an engaging conversation-starting call-to-action question.` : ''}
${includeHashtags && event.hashtags?.length ? `- Include 3-5 relevant hashtags at the bottom from: ${event.hashtags.join(' ')}` : '- Do not include hashtags.'}

### QUALITY GUIDELINES:
1. Hook the reader in the first 2 lines (avoid "I am excited to announce" or generic cliché openings).
2. Space out lines cleanly with natural line breaks for LinkedIn readability.
3. Keep it authentic to what the attendee actually shared. Never hallucinate fake facts or fake speaker quotes not present in the notes.
4. Avoid cringe, buzzword-overdose, and excessive emojis. Use 2 to 4 tasteful emojis maximum.`;

  if (refinement && previousPost) {
    prompt += `\n\n### REFINEMENT INSTRUCTION:
Please rewrite/adapt the following existing post with this specific instruction: "${refinement}".
Existing post:
"""
${previousPost}
"""`;
  }

  prompt += `\n\nOUTPUT FORMAT:
Output ONLY the clean LinkedIn post text ready to copy. Do NOT include markdown code fences like \`\`\` or explanatory preambles.`;

  return prompt;
}

/**
 * Call Groq OpenAI-compatible API
 */
async function callGroq(prompt) {
  if (!GROQ_API_KEY) throw new Error('Groq API Key not found');
  
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: 'You are an award-winning executive LinkedIn copywriter. Return only the post text.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1024
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Groq API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error('Empty response from Groq');
  return text;
}

/**
 * Call Gemini API endpoint
 */
async function callGemini(prompt) {
  if (!GEMINI_API_KEY) throw new Error('Gemini API Key not found');

  // Try Gemini 1.5 Flash endpoint
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024
      }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  if (!text) throw new Error('Empty response from Gemini');
  return text;
}

/**
 * Intelligent Mock Post Generator for resilient offline/fallback operation
 */
function generateFallbackPost({ event, attendee, highlights, tone, options }) {
  const authorName = attendee?.name || 'Attendee';
  const eventName = event?.name || 'the event';
  const organizer = event?.organizerName || 'the organizing committee';
  const hashtags = (event?.hashtags && event.hashtags.length > 0)
    ? event.hashtags.slice(0, 4).join(' ')
    : '#Networking #Innovation #Leadership #ProfessionalGrowth';

  const cleanHighlights = highlights?.trim() 
    ? highlights.trim() 
    : 'Connecting with visionary peers and absorbing deep practical insights across modern strategy.';

  let post = '';

  switch (tone) {
    case 'Key Takeaways':
      post = `The best events don't just inspire you—they shift your perspective.

Spending time at ${eventName} hosted by ${organizer} did exactly that.

Here were my top 3 takeaways from the day:

1. Insight into action: ${cleanHighlights.split('.')[0] || 'Focus on real-world execution over theoretical hype.'}
2. The power of shared learning: When practitioners share real lessons, everyone accelerates.
3. Community resilience: Innovation is a team sport, not an isolated journey.

Huge credit to ${organizer} for curating such high-impact discussions and bringing leaders together under one roof.

What’s the most valuable lesson you’ve brought back from an industry event recently? Let’s discuss in the comments. 👇

${options.includeHashtags ? hashtags : ''}`;
      break;

    case 'Grateful Attendee':
      post = `Still reflecting on how energizing ${eventName} was! 🌟

Events like this remind me of how generous and forward-thinking our community is. A massive thank you to ${organizer} and all the speakers for orchestrating such an engaging experience.

My favorite highlight:
"${cleanHighlights}"

Walking away with fresh frameworks, new contacts, and renewed momentum for the quarter ahead.

Grateful for the conversations with everyone I had the pleasure to meet. If we connected, let’s stay in touch!

${options.includeHashtags ? hashtags : ''}`;
      break;

    case 'Thought Leadership':
      post = `Most conferences talk about where the industry was yesterday. ${eventName} focused on where it is heading tomorrow.

One recurring theme that stood out from the discussions:
${cleanHighlights}

We are at an inflection point where speed of adaptation matters far more than legacy playbooks. Those who integrate feedback loops early will lead the pack.

Kudos to ${organizer} for fostering conversations that challenge conventional wisdom.

How is your team rethinking this shift this year?

${options.includeHashtags ? hashtags : ''}`;
      break;

    case 'Excited & Energetic':
      post = `What an electric day at ${eventName}! 🚀⚡️

The energy in the room was contagious from the opening keynote to the closing panel. 

The biggest spark for me:
${cleanHighlights}

So many breakthrough ideas and incredible leaders sharing their real stories. Big shoutout to ${organizer} for setting the bar so high!

Already looking forward to the next one! Who else was there? Let me know your biggest takeaway below! 👇

${options.includeHashtags ? hashtags : ''}`;
      break;

    case 'Networking':
      post = `Content is great, but the people make the event. 🤝

Had an incredible time networking at ${eventName} today! Had genuine conversations with builders, founders, and peers tackling the exact same challenges.

One standout point from our chats:
${cleanHighlights}

Thanks to ${organizer} for creating a space where authentic connections happen effortlessly.

If we spoke today, let's keep the dialogue going! Drop a comment or connect with me.

${options.includeHashtags ? hashtags : ''}`;
      break;

    case 'Reflective':
      post = `Taking a quiet moment to process everything absorbed at ${eventName}.

Sometimes you need to step outside daily operational routines to see the bigger picture clearly.

Key reflection:
${cleanHighlights}

Special thanks to ${organizer} for such an intentional, well-curated environment.

What’s one thought or question you’ve been reflecting on in your work this week?

${options.includeHashtags ? hashtags : ''}`;
      break;

    case 'Professional':
    default:
      post = `Attending ${eventName} was a great investment in staying ahead of key industry shifts.

Organized seamlessly by ${organizer}, the sessions provided clear tactical guidance and strategic clarity.

Core highlight:
${cleanHighlights}

It is inspiring to see how peer organizations are navigating modern opportunities and scaling with agility.

Looking forward to applying these frameworks directly with my team.

${options.includeHashtags ? hashtags : ''}`;
      break;
  }

  return post.trim();
}

/**
 * Main AI Generation function with cascading fallback
 */
export async function generateLinkedInPost(params) {
  const prompt = buildPrompt(params);

  // 1. Try Groq (Llama-3.3 70B) first
  try {
    const result = await callGroq(prompt);
    return { text: result, provider: 'Groq (Llama 3.3 70B)' };
  } catch (groqErr) {
    console.warn('Groq generation failed, attempting Gemini fallback:', groqErr.message);

    // 2. Try Gemini fallback
    try {
      const result = await callGemini(prompt);
      return { text: result, provider: 'Google Gemini 1.5 Flash' };
    } catch (geminiErr) {
      console.warn('Gemini generation failed, using intelligent built-in generator:', geminiErr.message);

      // 3. Resilient built-in template engine
      const result = generateFallbackPost(params);
      return { text: result, provider: 'EventPost Intelligent Core (Offline/Fallback)' };
    }
  }
}

/**
 * "✨ Improve my notes" AI feature
 */
export async function improveNotes(rawNotes, eventName = '') {
  if (!rawNotes || rawNotes.trim().length === 0) {
    return 'Attended keynote session on AI innovation; learned how agentic workflows reduce operational cycle times; discussed future tech stacks with senior leaders.';
  }

  const prompt = `You are an assistant helping an event attendee organize rough, messy notes into clean, bulleted key takeaways.
Event: "${eventName}"
Raw attendee notes:
"""
${rawNotes}
"""

Format instructions:
- Clean up spelling and structure
- Turn them into 2-4 punchy, clear bullet points or a concise summary
- Keep authentic to their words, do not invent new facts.
Return ONLY the polished notes text.`;

  try {
    return await callGroq(prompt);
  } catch (e) {
    try {
      return await callGemini(prompt);
    } catch (err) {
      // Simple fallback formatting
      const lines = rawNotes.split('\n').filter(Boolean);
      if (lines.length > 1) {
        return lines.map(l => `• ${l.replace(/^[-*•]\s*/, '').trim()}`).join('\n');
      }
      return `• ${rawNotes.trim()}\n• Key learning applied to operational workflows\n• Actionable takeaways from discussions`;
    }
  }
}
