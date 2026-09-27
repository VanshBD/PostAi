import React, { useState } from 'react';
import { 
  Building, Calendar, MapPin, Globe, 
  Hash, Users, Palette, Check, ArrowRight, ArrowLeft, Sparkles, Image as ImageIcon
} from 'lucide-react';
import confetti from 'canvas-confetti';

const PRESET_COVERS = [
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80'
];

export default function CreateEventModal({ isOpen, onClose, onCreated }) {
  const [step, setStep] = useState(1);
  const [hashtagInput, setHashtagInput] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    organizerName: '',
    date: new Date().toISOString().split('T')[0],
    location: '',
    description: '',
    coverImage: PRESET_COVERS[0],
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
    website: '',
    linkedinPage: '',
    twitter: '',
    hashtags: ['#AI', '#TechSummit', '#Innovation', '#Networking'],
    speakers: [{ name: '', role: '' }],
    branding: {
      primaryColor: '#0a66c2',
      accentColor: '#38bdf8'
    }
  });

  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const validateStep = (currentStep) => {
    const errs = {};
    if (currentStep === 1) {
      if (!formData.name.trim()) errs.name = 'Event name is required';
      if (!formData.organizerName.trim()) errs.organizerName = 'Organizer name is required';
      if (!formData.location.trim()) errs.location = 'Location or virtual venue is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handlePrev = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleAddHashtag = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const tag = hashtagInput.trim();
      if (tag) {
        const formatted = tag.startsWith('#') ? tag : `#${tag}`;
        if (!formData.hashtags.includes(formatted)) {
          setFormData(prev => ({
            ...prev,
            hashtags: [...prev.hashtags, formatted]
          }));
        }
        setHashtagInput('');
      }
    }
  };

  const handleRemoveHashtag = (tag) => {
    setFormData(prev => ({
      ...prev,
      hashtags: prev.hashtags.filter(t => t !== tag)
    }));
  };

  const handleAddSpeaker = () => {
    setFormData(prev => ({
      ...prev,
      speakers: [...prev.speakers, { name: '', role: '' }]
    }));
  };

  const handleSpeakerChange = (idx, field, val) => {
    setFormData(prev => {
      const updated = [...prev.speakers];
      updated[idx] = { ...updated[idx], [field]: val };
      return { ...prev, speakers: updated };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateStep(1)) {
      setStep(1);
      return;
    }
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
    onCreated(formData);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0,0,0,0.8)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: 16
    }}>
      <div 
        className="glass-panel animate-fade-in"
        style={{
          width: '100%',
          maxWidth: 720,
          background: '#1e293b',
          border: '1px solid var(--border-strong)',
          borderRadius: 'var(--radius-lg)',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '20px 28px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Sparkles size={20} color="var(--primary-light)" />
              Create New Event
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Configure your event identity and attendee LinkedIn generation context
            </p>
          </div>
          <div style={{
            fontSize: '0.8rem',
            color: 'var(--primary-light)',
            background: 'rgba(56, 189, 248, 0.1)',
            padding: '4px 10px',
            borderRadius: '20px',
            fontWeight: 600
          }}>
            Step {step} of 4
          </div>
        </div>

        {/* Step Progress Bar */}
        <div style={{ height: 3, background: 'rgba(255,255,255,0.08)', width: '100%' }}>
          <div style={{
            height: '100%',
            background: 'linear-gradient(90deg, #0a66c2, #38bdf8)',
            width: `${(step / 4) * 100}%`,
            transition: 'width 0.3s ease'
          }} />
        </div>

        {/* Body content */}
        <div style={{ padding: '24px 28px', overflowY: 'auto', flex: 1 }}>
          {step === 1 && (
            <div className="animate-fade-in">
              <h3 style={{ fontSize: '1.05rem', marginBottom: 16, color: '#38bdf8' }}>1. Basic Event Information</h3>
              <div className="form-group">
                <label className="form-label">Event Name *</label>
                <input
                  type="text"
                  placeholder="e.g. NextGen AI Summit 2026"
                  className="form-input"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
                {errors.name && <span style={{ color: 'var(--accent-rose)', fontSize: '0.78rem' }}>{errors.name}</span>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Organizer / Community Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Founders & Builders Guild"
                    className="form-input"
                    value={formData.organizerName}
                    onChange={e => setFormData({ ...formData, organizerName: e.target.value })}
                  />
                  {errors.organizerName && <span style={{ color: 'var(--accent-rose)', fontSize: '0.78rem' }}>{errors.organizerName}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Event Date *</label>
                  <input
                    type="date"
                    className="form-input"
                    value={formData.date}
                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Location / Venue *</label>
                <input
                  type="text"
                  placeholder="e.g. Palace Convention Hall, Mumbai / Online"
                  className="form-input"
                  value={formData.location}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                />
                {errors.location && <span style={{ color: 'var(--accent-rose)', fontSize: '0.78rem' }}>{errors.location}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Event Description & Themes</label>
                <textarea
                  placeholder="Briefly describe what this event is about (helps the AI generate accurate, high-context LinkedIn posts)..."
                  className="form-textarea"
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in">
              <h3 style={{ fontSize: '1.05rem', marginBottom: 16, color: '#38bdf8' }}>2. Event Visuals & Cover</h3>
              
              <div className="form-group">
                <label className="form-label">Select Cover Image Template</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginTop: 8 }}>
                  {PRESET_COVERS.map((cov, idx) => (
                    <div 
                      key={idx}
                      onClick={() => setFormData({ ...formData, coverImage: cov })}
                      style={{
                        position: 'relative',
                        borderRadius: 10,
                        overflow: 'hidden',
                        cursor: 'pointer',
                        border: formData.coverImage === cov ? '2px solid #38bdf8' : '1px solid rgba(255,255,255,0.1)',
                        boxShadow: formData.coverImage === cov ? '0 0 14px rgba(56,189,248,0.4)' : 'none',
                        height: 90
                      }}
                    >
                      <img src={cov} alt="cover preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      {formData.coverImage === cov && (
                        <div style={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          background: '#0a66c2',
                          borderRadius: '50%',
                          width: 22,
                          height: 22,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Check size={14} color="#fff" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-group" style={{ marginTop: 16 }}>
                <label className="form-label">Or Custom Image URL</label>
                <input
                  type="text"
                  placeholder="https://..."
                  className="form-input"
                  value={formData.coverImage}
                  onChange={e => setFormData({ ...formData, coverImage: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Theme Accent Color</label>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  {['#0a66c2', '#6366f1', '#10b981', '#f59e0b', '#ec4899'].map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setFormData({ ...formData, branding: { ...formData.branding, primaryColor: c } })}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        background: c,
                        border: formData.branding.primaryColor === c ? '3px solid #fff' : '2px solid transparent',
                        cursor: 'pointer',
                        transform: formData.branding.primaryColor === c ? 'scale(1.15)' : 'scale(1)'
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fade-in">
              <h3 style={{ fontSize: '1.05rem', marginBottom: 16, color: '#38bdf8' }}>3. Social Links & Hashtags</h3>
              
              <div className="form-group">
                <label className="form-label">Event Hashtags (press Enter or comma)</label>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 8,
                  padding: 8,
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  minHeight: 46
                }}>
                  {formData.hashtags.map(tag => (
                    <span 
                      key={tag} 
                      style={{
                        background: 'rgba(56, 189, 248, 0.15)',
                        color: '#38bdf8',
                        padding: '4px 10px',
                        borderRadius: 6,
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6
                      }}
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveHashtag(tag)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#94a3b8',
                          cursor: 'pointer',
                          fontWeight: 700,
                          fontSize: '0.9rem'
                        }}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    placeholder="Type hashtag & press Enter..."
                    value={hashtagInput}
                    onChange={e => setHashtagInput(e.target.value)}
                    onKeyDown={handleAddHashtag}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#fff',
                      outline: 'none',
                      fontSize: '0.85rem',
                      flex: 1,
                      minWidth: 160
                    }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Event Website</label>
                <input
                  type="url"
                  placeholder="https://example.com"
                  className="form-input"
                  value={formData.website}
                  onChange={e => setFormData({ ...formData, website: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">LinkedIn Organization Page</label>
                  <input
                    type="url"
                    placeholder="https://linkedin.com/company/..."
                    className="form-input"
                    value={formData.linkedinPage}
                    onChange={e => setFormData({ ...formData, linkedinPage: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">X / Twitter Handle</label>
                  <input
                    type="text"
                    placeholder="@community"
                    className="form-input"
                    value={formData.twitter}
                    onChange={e => setFormData({ ...formData, twitter: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="animate-fade-in">
              <h3 style={{ fontSize: '1.05rem', marginBottom: 16, color: '#38bdf8' }}>4. Notable Speakers & Final Review</h3>
              
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <label className="form-label" style={{ margin: 0 }}>Speakers to Tag / Credit</label>
                  <button
                    type="button"
                    onClick={handleAddSpeaker}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--primary-light)',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    + Add Speaker
                  </button>
                </div>

                {formData.speakers.map((spk, idx) => (
                  <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 8 }}>
                    <input
                      type="text"
                      placeholder="Speaker Name"
                      className="form-input"
                      value={spk.name}
                      onChange={e => handleSpeakerChange(idx, 'name', e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Role / Title"
                      className="form-input"
                      value={spk.role}
                      onChange={e => handleSpeakerChange(idx, 'role', e.target.value)}
                    />
                  </div>
                ))}
              </div>

              {/* Summary card */}
              <div style={{
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: 16
              }}>
                <h4 style={{ fontSize: '0.92rem', marginBottom: 6, color: '#fff' }}>Event Summary:</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <strong>{formData.name || 'Untitled Event'}</strong> by {formData.organizerName || 'Organizer'}
                </p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', marginTop: 4 }}>
                  Date: {formData.date} • {formData.location || 'Location TBD'}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                  {formData.hashtags.map(h => (
                    <span key={h} style={{ fontSize: '0.75rem', color: '#38bdf8' }}>{h}</span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div style={{
          padding: '16px 28px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(15, 23, 42, 0.9)'
        }}>
          {step > 1 ? (
            <button type="button" onClick={handlePrev} className="btn btn-secondary">
              <ArrowLeft size={16} /> Back
            </button>
          ) : (
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
          )}

          {step < 4 ? (
            <button type="button" onClick={handleNext} className="btn btn-primary">
              Next Step <ArrowRight size={16} />
            </button>
          ) : (
            <button type="button" onClick={handleSubmit} className="btn btn-magic">
              <Sparkles size={16} /> Create Event
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
