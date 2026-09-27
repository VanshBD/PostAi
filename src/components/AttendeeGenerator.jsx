import React, { useState } from 'react';
import { 
  Sparkles, Wand2, Copy, Check, ExternalLink, RefreshCw, 
  ChevronDown, ChevronUp, Sliders, User, MessageSquare, ArrowRight, Heart
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { TONES, POST_LENGTHS, LANGUAGES } from '../data/initialData';
import { generateLinkedInPost, improveNotes } from '../services/aiService';
import PhotoDropzone from './PhotoDropzone';
import LinkedInPreview from './LinkedInPreview';

export default function AttendeeGenerator() {
  const { activeEvent, attendeeProfile, setAttendeeProfile, updateEventMetrics, addToast } = useApp();

  // Photo state
  const [photos, setPhotos] = useState([]);
  const [primaryIndex, setPrimaryIndex] = useState(0);

  // Content input
  const [highlights, setHighlights] = useState('');
  const [tone, setTone] = useState('Professional');
  
  // Advanced options
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [options, setOptions] = useState({
    length: 'Medium',
    includeHashtags: true,
    includeEventMention: true,
    includeOrganizerMention: true,
    includeSpeakerMentions: true,
    includeCTA: true,
    language: 'English'
  });

  // Attendee profile toggle
  const [showProfileEdit, setShowProfileEdit] = useState(false);

  // Post generation & versions
  const [versions, setVersions] = useState([]);
  const [activeVersionIndex, setActiveVersionIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isImprovingNotes, setIsImprovingNotes] = useState(false);
  const [providerInfo, setProviderInfo] = useState('');
  const [generationStep, setGenerationStep] = useState('');

  // Post feedback
  const [copied, setCopied] = useState(false);

  const activePostText = versions[activeVersionIndex]?.text || '';

  // Trigger AI generation
  const handleGenerate = async (isRegeneration = false, refinementInstruction = null) => {
    setIsGenerating(true);
    const steps = [
      'Analyzing your event context & takeaways...',
      'Crafting authentic LinkedIn hook & narrative...',
      'Synthesizing actionable points & hashtags...',
      'Applying professional polish...'
    ];

    let stepIdx = 0;
    setGenerationStep(steps[0]);
    const stepInterval = setInterval(() => {
      stepIdx = (stepIdx + 1) % steps.length;
      setGenerationStep(steps[stepIdx]);
    }, 600);

    try {
      const response = await generateLinkedInPost({
        event: activeEvent,
        attendee: attendeeProfile,
        highlights,
        tone,
        options,
        refinement: refinementInstruction,
        previousPost: isRegeneration ? activePostText : null
      });

      clearInterval(stepInterval);
      setIsGenerating(false);

      if (response && response.text) {
        const newVersion = {
          text: response.text,
          tone,
          timestamp: new Date().toLocaleTimeString(),
          provider: response.provider
        };

        setVersions(prev => [newVersion, ...prev]);
        setActiveVersionIndex(0);
        setProviderInfo(response.provider);

        // Update metrics
        updateEventMetrics(activeEvent.id, isRegeneration ? 'regenerations' : 'postsGenerated', 1);

        if (!isRegeneration) {
          confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
          addToast('Your LinkedIn post is ready!', 'success');
        } else {
          addToast('Generated new version!', 'info');
        }
      }
    } catch (err) {
      clearInterval(stepInterval);
      setIsGenerating(false);
      console.error(err);
      addToast('Error generating post. Please try again.', 'error');
    }
  };

  // Improve rough notes
  const handleImproveNotes = async () => {
    if (!highlights.trim()) {
      addToast('Type or paste some notes first!', 'info');
      return;
    }
    setIsImprovingNotes(true);
    try {
      const improved = await improveNotes(highlights, activeEvent.name);
      setHighlights(improved);
      addToast('Notes organized by AI!', 'success');
    } catch (e) {
      addToast('Could not organize notes right now', 'error');
    } finally {
      setIsImprovingNotes(false);
    }
  };

  // Copy to clipboard
  const handleCopy = () => {
    if (!activePostText) return;
    navigator.clipboard.writeText(activePostText);
    setCopied(true);
    updateEventMetrics(activeEvent.id, 'postsCopied', 1);
    addToast('Post text copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  // Open real LinkedIn share composer
  const handleOpenLinkedIn = () => {
    if (!activePostText) return;
    navigator.clipboard.writeText(activePostText);
    updateEventMetrics(activeEvent.id, 'linkedinOpens', 1);
    addToast('Copied! Opening LinkedIn share composer...', 'info');
    
    // LinkedIn share URL with text prepopulated
    const shareUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(activePostText)}`;
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  // Quick Refinements
  const handleRefine = (instruction) => {
    handleGenerate(true, instruction);
  };

  const primaryPhotoUrl = photos[primaryIndex]?.url || null;

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '24px 20px' }}>
      {/* Event Header Banner */}
      <div className="glass-panel" style={{
        position: 'relative',
        overflow: 'hidden',
        marginBottom: 28,
        border: '1px solid var(--border-strong)'
      }}>
        {/* Cover backdrop image with gradient overlay */}
        <div style={{
          height: 180,
          backgroundImage: `linear-gradient(to bottom, rgba(15, 23, 42, 0.4), rgba(15, 23, 42, 0.95)), url(${activeEvent.coverImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }} />

        <div style={{
          padding: '0 28px 24px 28px',
          marginTop: -50,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: 16
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <span style={{
                background: 'rgba(56, 189, 248, 0.2)',
                color: '#38bdf8',
                border: '1px solid rgba(56, 189, 248, 0.4)',
                padding: '3px 10px',
                borderRadius: 20,
                fontSize: '0.75rem',
                fontWeight: 700
              }}>
                Attendee Post Studio
              </span>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                {activeEvent.date} • {activeEvent.location}
              </span>
            </div>

            <h1 style={{ fontSize: '1.9rem', marginBottom: 4 }}>{activeEvent.name}</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Hosted by <strong style={{ color: '#fff' }}>{activeEvent.organizerName}</strong>
            </p>

            {/* Clickable Hashtags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
              {activeEvent.hashtags?.map(tag => (
                <span
                  key={tag}
                  style={{
                    fontSize: '0.78rem',
                    color: '#38bdf8',
                    background: 'rgba(15, 23, 42, 0.8)',
                    padding: '3px 8px',
                    borderRadius: 6,
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Attendee Profile Badge / Edit */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: 12
          }}>
            <img
              src={attendeeProfile.avatar}
              alt="Attendee Avatar"
              style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }}
            />
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{attendeeProfile.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {attendeeProfile.jobTitle || 'Attendee'}
              </div>
            </div>
            <button
              onClick={() => setShowProfileEdit(!showProfileEdit)}
              className="btn btn-secondary"
              style={{ padding: '5px 8px', fontSize: '0.75rem' }}
            >
              <User size={13} />
              {showProfileEdit ? 'Hide' : 'Edit Profile'}
            </button>
          </div>
        </div>

        {/* Expandable Attendee Profile Edit */}
        {showProfileEdit && (
          <div className="animate-fade-in" style={{
            padding: '16px 28px',
            background: 'rgba(15, 23, 42, 0.95)',
            borderTop: '1px solid var(--border-subtle)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 12
          }}>
            <div>
              <label className="form-label">Your Name</label>
              <input
                type="text"
                className="form-input"
                value={attendeeProfile.name}
                onChange={e => setAttendeeProfile({ ...attendeeProfile, name: e.target.value })}
              />
            </div>
            <div>
              <label className="form-label">Job Title</label>
              <input
                type="text"
                className="form-input"
                value={attendeeProfile.jobTitle}
                onChange={e => setAttendeeProfile({ ...attendeeProfile, jobTitle: e.target.value })}
              />
            </div>
            <div>
              <label className="form-label">Company / Organization</label>
              <input
                type="text"
                className="form-input"
                value={attendeeProfile.company}
                onChange={e => setAttendeeProfile({ ...attendeeProfile, company: e.target.value })}
              />
            </div>
          </div>
        )}
      </div>

      {/* Main Studio Grid: Left Inputs vs Right LinkedIn Preview */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: 32,
        alignItems: 'start'
      }}>
        {/* LEFT WORKSPACE: Input Builder */}
        <div className="glass-panel" style={{ padding: 28 }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Wand2 size={20} color="var(--primary-light)" />
            Share Your Experience
          </h2>

          {/* 1. Photos */}
          <PhotoDropzone
            photos={photos}
            setPhotos={setPhotos}
            primaryIndex={primaryIndex}
            setPrimaryIndex={setPrimaryIndex}
          />

          {/* 2. Highlights / Takeaways */}
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <label className="form-label" style={{ margin: 0 }}>
                What did you take away from this event?
              </label>
              <button
                type="button"
                onClick={handleImproveNotes}
                disabled={isImprovingNotes || !highlights.trim()}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: isImprovingNotes ? 'var(--text-subtle)' : 'var(--primary-light)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: highlights.trim() ? 'pointer' : 'default',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                }}
              >
                <Sparkles size={13} />
                {isImprovingNotes ? 'Structuring...' : '✨ Improve my notes'}
              </button>
            </div>
            <textarea
              className="form-textarea"
              placeholder="Share your favorite session, key insight, speaker quote, interesting conversation, or what you learned..."
              value={highlights}
              onChange={e => setHighlights(e.target.value)}
              rows={4}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-subtle)' }}>
              <span>Rough notes are completely fine—AI handles the polish</span>
              <span>{highlights.length} chars</span>
            </div>
          </div>

          {/* 3. Tone Selector */}
          <div style={{ marginBottom: 22 }}>
            <label className="form-label" style={{ marginBottom: 8 }}>
              Select Post Tone
            </label>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: 8
            }}>
              {TONES.map(t => {
                const isSelected = tone === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTone(t.id)}
                    style={{
                      background: isSelected ? 'rgba(10, 102, 194, 0.25)' : 'rgba(15, 23, 42, 0.6)',
                      border: isSelected ? '1.5px solid #38bdf8' : '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      padding: '10px 8px',
                      color: isSelected ? '#fff' : 'var(--text-muted)',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ fontWeight: 600, fontSize: '0.82rem' }}>{t.label}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Advanced Options Accordion */}
          <div style={{ marginBottom: 24 }}>
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              style={{
                width: '100%',
                background: 'rgba(15, 23, 42, 0.4)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 14px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: 600
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Sliders size={15} /> Advanced Customization
              </span>
              {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {showAdvanced && (
              <div className="animate-fade-in" style={{
                padding: 16,
                background: 'rgba(15, 23, 42, 0.7)',
                borderRadius: '0 0 var(--radius-md) var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                borderTop: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: 12
              }}>
                {/* Length */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label className="form-label">Post Length</label>
                    <select
                      className="form-select"
                      value={options.length}
                      onChange={e => setOptions({ ...options, length: e.target.value })}
                    >
                      {POST_LENGTHS.map(l => (
                        <option key={l.id} value={l.id} style={{ background: '#1e293b' }}>{l.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="form-label">Language</label>
                    <select
                      className="form-select"
                      value={options.language}
                      onChange={e => setOptions({ ...options, language: e.target.value })}
                    >
                      {LANGUAGES.map(lang => (
                        <option key={lang.id} value={lang.id} style={{ background: '#1e293b' }}>{lang.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Toggles */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 4 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={options.includeHashtags}
                      onChange={e => setOptions({ ...options, includeHashtags: e.target.checked })}
                    />
                    Include Hashtags
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={options.includeEventMention}
                      onChange={e => setOptions({ ...options, includeEventMention: e.target.checked })}
                    />
                    Mention Event
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={options.includeOrganizerMention}
                      onChange={e => setOptions({ ...options, includeOrganizerMention: e.target.checked })}
                    />
                    Mention Organizer
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={options.includeCTA}
                      onChange={e => setOptions({ ...options, includeCTA: e.target.checked })}
                    />
                    End with Discussion CTA
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Primary CTA: Generate */}
          <button
            type="button"
            onClick={() => handleGenerate(false)}
            disabled={isGenerating}
            className="btn btn-magic"
            style={{ width: '100%', padding: '14px', fontSize: '1rem', letterSpacing: '0.01em' }}
          >
            {isGenerating ? (
              <>
                <RefreshCw size={18} className="animate-spin" />
                {generationStep || 'Crafting your post...'}
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Generate LinkedIn Post
              </>
            )}
          </button>
        </div>

        {/* RIGHT WORKSPACE: Live Preview & Action Hub */}
        <div>
          {/* Post versions tab switcher if multiple */}
          {versions.length > 1 && (
            <div style={{
              display: 'flex',
              gap: 8,
              marginBottom: 12,
              overflowX: 'auto',
              paddingBottom: 4
            }}>
              {versions.map((ver, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveVersionIndex(idx)}
                  className="btn btn-secondary"
                  style={{
                    padding: '4px 10px',
                    fontSize: '0.78rem',
                    background: activeVersionIndex === idx ? 'var(--primary)' : 'rgba(255,255,255,0.06)',
                    borderColor: activeVersionIndex === idx ? '#38bdf8' : 'var(--border-subtle)'
                  }}
                >
                  Version {versions.length - idx} ({ver.tone})
                </button>
              ))}
            </div>
          )}

          {/* Realistic LinkedIn Mock View */}
          <LinkedInPreview
            postText={activePostText}
            attendee={attendeeProfile}
            event={activeEvent}
            primaryPhoto={primaryPhotoUrl}
            activeVersion={activeVersionIndex}
            totalVersions={versions.length}
            provider={providerInfo}
          />

          {/* Post Action Buttons */}
          {activePostText && (
            <div style={{ marginTop: 20 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10 }}>
                <button
                  onClick={handleCopy}
                  className="btn btn-primary"
                  style={{ padding: '12px 14px' }}
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  {copied ? 'Copied to Clipboard!' : 'Copy Text'}
                </button>

                <button
                  onClick={() => handleGenerate(true)}
                  disabled={isGenerating}
                  className="btn btn-secondary"
                  style={{ padding: '12px 14px' }}
                >
                  <RefreshCw size={16} />
                  Regenerate
                </button>

                <button
                  onClick={handleOpenLinkedIn}
                  className="btn btn-magic"
                  style={{ padding: '12px 14px' }}
                  title="Copies text and opens LinkedIn post composer"
                >
                  <ExternalLink size={16} />
                  Open LinkedIn
                </button>
              </div>

              {/* AI Quick Refinement Chips */}
              <div style={{ marginTop: 18, padding: 14, background: 'rgba(15, 23, 42, 0.6)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Sparkles size={14} color="var(--primary-light)" /> Quick AI Refinements:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {[
                    'Make More Personal',
                    'Make More Professional',
                    'Shorten',
                    'Add Stronger Hook',
                    'Add Storytelling',
                    'Add Engaging CTA'
                  ].map(label => (
                    <button
                      key={label}
                      type="button"
                      disabled={isGenerating}
                      onClick={() => handleRefine(label)}
                      style={{
                        background: 'rgba(255, 255, 255, 0.06)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 20,
                        padding: '5px 12px',
                        color: 'var(--text-main)',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseOver={e => e.currentTarget.style.borderColor = '#38bdf8'}
                      onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
