import React from 'react';
import { 
  ThumbsUp, MessageSquare, Repeat2, Send, CheckCircle2, 
  Sparkles, ShieldCheck, Globe, MoreHorizontal 
} from 'lucide-react';

export default function LinkedInPreview({
  postText,
  attendee,
  event,
  primaryPhoto,
  activeVersion,
  totalVersions,
  provider
}) {
  const profileName = attendee?.name || 'Alex Patel';
  const profileRole = attendee?.jobTitle 
    ? `${attendee.jobTitle} at ${attendee.company || 'Tech'}`
    : 'Technology Professional & Event Attendee';

  // Compute quality indicators
  const hasEventMention = postText ? postText.toLowerCase().includes(event.name.toLowerCase().slice(0, 8)) : false;
  const hasHashtags = postText ? /#\w+/.test(postText) : false;
  const wordCount = postText ? postText.trim().split(/\s+/).length : 0;
  const isGoodLength = wordCount >= 60 && wordCount <= 350;
  const hasTakeaways = postText ? (postText.includes('1.') || postText.includes('•') || postText.includes('takeaway') || postText.includes('insight') || postText.includes('learned')) : false;

  const qualityScore = [hasEventMention, hasHashtags, isGoodLength, hasTakeaways].filter(Boolean).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* LinkedIn Post Mock Card */}
      <div style={{
        background: '#ffffff',
        color: '#000000',
        borderRadius: 12,
        boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
        overflow: 'hidden',
        border: '1px solid rgba(0,0,0,0.1)'
      }}>
        {/* Card Header Top Banner Label */}
        <div style={{
          background: '#f3f2ef',
          padding: '8px 16px',
          borderBottom: '1px solid #e0dfdc',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0a66c2', letterSpacing: '0.04em' }}>
            LINKEDIN LIVE PREVIEW
          </span>
          {totalVersions > 0 && (
            <span style={{ fontSize: '0.72rem', background: '#0a66c2', color: '#fff', padding: '2px 8px', borderRadius: 10, fontWeight: 600 }}>
              Version {activeVersion + 1} of {totalVersions}
            </span>
          )}
        </div>

        {/* LinkedIn User Profile Row */}
        <div style={{ padding: '14px 16px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <img
            src={attendee?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"}
            alt="Profile Avatar"
            style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover' }}
          />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'rgba(0,0,0,0.9)' }}>
                {profileName} <span style={{ color: '#00000099', fontSize: '0.78rem', fontWeight: 400 }}>• 1st</span>
              </div>
              <MoreHorizontal size={18} color="#00000099" style={{ cursor: 'pointer' }} />
            </div>
            <div style={{ fontSize: '0.78rem', color: 'rgba(0,0,0,0.6)', lineHeight: 1.2 }}>
              {profileRole}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
              Just now • <Globe size={11} />
            </div>
          </div>
        </div>

        {/* Post Content */}
        <div style={{
          padding: '0 16px 12px 16px',
          fontSize: '0.92rem',
          color: 'rgba(0,0,0,0.9)',
          whiteSpace: 'pre-line',
          lineHeight: 1.5,
          fontFamily: '-apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>
          {postText || (
            <div style={{ color: '#00000066', fontStyle: 'italic', padding: '24px 0', textAlign: 'center' }}>
              Your generated post content will appear here in real time...
            </div>
          )}
        </div>

        {/* Attached Photo Preview */}
        {primaryPhoto && (
          <div style={{ width: '100%', maxHeight: 380, overflow: 'hidden', background: '#000' }}>
            <img
              src={primaryPhoto}
              alt="Uploaded event preview"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>
        )}

        {/* Social Reactions Mock Row */}
        <div style={{
          padding: '8px 16px',
          borderTop: '1px solid #ebebeb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.75rem',
          color: 'rgba(0,0,0,0.6)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 18,
              height: 18,
              background: '#0a66c2',
              borderRadius: '50%',
              color: 'white',
              fontSize: '10px'
            }}>
              👍
            </div>
            <span>You and 42 others</span>
          </div>
          <div>8 comments • 2 reposts</div>
        </div>

        {/* Interaction Buttons Row */}
        <div style={{
          borderTop: '1px solid #ebebeb',
          padding: '6px 8px',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          textAlign: 'center'
        }}>
          <button style={{
            background: 'transparent',
            border: 'none',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            color: 'rgba(0,0,0,0.65)',
            fontWeight: 600,
            fontSize: '0.8rem',
            cursor: 'pointer'
          }}>
            <ThumbsUp size={16} /> Like
          </button>
          <button style={{
            background: 'transparent',
            border: 'none',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            color: 'rgba(0,0,0,0.65)',
            fontWeight: 600,
            fontSize: '0.8rem',
            cursor: 'pointer'
          }}>
            <MessageSquare size={16} /> Comment
          </button>
          <button style={{
            background: 'transparent',
            border: 'none',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            color: 'rgba(0,0,0,0.65)',
            fontWeight: 600,
            fontSize: '0.8rem',
            cursor: 'pointer'
          }}>
            <Repeat2 size={16} /> Repost
          </button>
          <button style={{
            background: 'transparent',
            border: 'none',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            color: 'rgba(0,0,0,0.65)',
            fontWeight: 600,
            fontSize: '0.8rem',
            cursor: 'pointer'
          }}>
            <Send size={16} /> Send
          </button>
        </div>
      </div>

      {/* Post Quality Checklist Panel */}
      <div className="glass-panel" style={{ padding: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h4 style={{ fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: 6, color: '#fff' }}>
            <ShieldCheck size={16} color="var(--primary-light)" />
            Post Quality Score
          </h4>
          <span style={{
            fontSize: '0.75rem',
            padding: '2px 8px',
            borderRadius: 12,
            fontWeight: 700,
            background: qualityScore >= 3 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
            color: qualityScore >= 3 ? 'var(--accent-emerald)' : 'var(--accent-amber)'
          }}>
            {qualityScore >= 3 ? 'LinkedIn-Ready ★★★' : 'Drafting'}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: '0.78rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: hasEventMention ? 'var(--accent-emerald)' : 'var(--text-muted)' }}>
            <CheckCircle2 size={13} color={hasEventMention ? '#10b981' : '#64748b'} />
            Event naturally credited
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: hasHashtags ? 'var(--accent-emerald)' : 'var(--text-muted)' }}>
            <CheckCircle2 size={13} color={hasHashtags ? '#10b981' : '#64748b'} />
            Clean hashtags attached
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: isGoodLength ? 'var(--accent-emerald)' : 'var(--text-muted)' }}>
            <CheckCircle2 size={13} color={isGoodLength ? '#10b981' : '#64748b'} />
            Optimal length ({wordCount} words)
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: hasTakeaways ? 'var(--accent-emerald)' : 'var(--text-muted)' }}>
            <CheckCircle2 size={13} color={hasTakeaways ? '#10b981' : '#64748b'} />
            Actionable takeaways
          </div>
        </div>

        {provider && (
          <div style={{
            marginTop: 12,
            paddingTop: 8,
            borderTop: '1px solid var(--border-subtle)',
            fontSize: '0.72rem',
            color: 'var(--text-subtle)',
            display: 'flex',
            justifyContent: 'space-between'
          }}>
            <span>Generated via: {provider}</span>
            <span style={{ color: 'var(--primary-light)' }}>Live context sync</span>
          </div>
        )}
      </div>
    </div>
  );
}
