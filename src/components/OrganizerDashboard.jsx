import React, { useState } from 'react';
import { 
  Users, Share2, QrCode, Sparkles, Plus, Copy, Check, 
  ExternalLink, BarChart3, TrendingUp, Calendar, MapPin, Eye, MousePointerClick
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { buildAttendeeUrl } from '../utils/url';
import QRCodeModal from './QRCodeModal';
import CreateEventModal from './CreateEventModal';

export default function OrganizerDashboard() {
  const { events, activeEvent, setActiveEventId, addEvent, setRole, addToast } = useApp();
  const [showQR, setShowQR] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Compute aggregated dashboard stats
  const totalEvents = events.length;
  const totalAttendees = events.reduce((acc, e) => acc + (e.metrics?.attendees || 0), 0);
  const totalGenerated = events.reduce((acc, e) => acc + (e.metrics?.postsGenerated || 0), 0);
  const totalCopied = events.reduce((acc, e) => acc + (e.metrics?.postsCopied || 0), 0);
  const totalLinkedInOpens = events.reduce((acc, e) => acc + (e.metrics?.linkedinOpens || 0), 0);
  const totalPhotos = events.reduce((acc, e) => acc + (e.metrics?.photosUploaded || 0), 0);

  const activeAttendeeUrl = buildAttendeeUrl(activeEvent.slug || activeEvent.id);

  const handleCopyLink = (eventSlug) => {
    const url = buildAttendeeUrl(eventSlug);
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    addToast('Attendee link copied to clipboard!', 'success');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleOpenAttendee = (eventId) => {
    setActiveEventId(eventId);
    setRole('attendee');
  };

  return (
    <div className="dashboard-container" style={{ maxWidth: 1400, margin: '0 auto', padding: '32px 24px' }}>
      {/* Top Banner and Quick Actions */}
      <div className="dashboard-header" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 16,
        marginBottom: 32
      }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', marginBottom: 4 }}>Organizer Dashboard</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Empower your attendees to generate viral LinkedIn content and track event virality in real time.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={() => setShowQR(true)}
            className="btn btn-secondary"
            title="Show QR Code for attendees"
          >
            <QrCode size={16} />
            Attendee QR
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary"
          >
            <Plus size={16} />
            Create Event
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 16,
        marginBottom: 32
      }}>
        <div className="glass-panel" style={{ padding: '20px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: 8 }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Total Events</span>
            <Calendar size={18} color="var(--primary-light)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{totalEvents}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--accent-emerald)', fontSize: '0.78rem', marginTop: 4 }}>
            <TrendingUp size={13} /> Active campaigns
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: 8 }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Total Attendees</span>
            <Users size={18} color="#8b5cf6" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{totalAttendees}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--accent-emerald)', fontSize: '0.78rem', marginTop: 4 }}>
            <TrendingUp size={13} /> Across all summits
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: 8 }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Posts Generated</span>
            <Sparkles size={18} color="#38bdf8" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{totalGenerated}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--accent-emerald)', fontSize: '0.78rem', marginTop: 4 }}>
            <TrendingUp size={13} /> AI drafts created
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: 8 }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Posts Copied</span>
            <Copy size={18} color="#10b981" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{totalCopied}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--accent-emerald)', fontSize: '0.78rem', marginTop: 4 }}>
            {totalGenerated > 0 ? `${Math.round((totalCopied / totalGenerated) * 100)}% conversion` : 'Ready'}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: 8 }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>LinkedIn Launches</span>
            <ExternalLink size={18} color="#0a66c2" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{totalLinkedInOpens}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--accent-emerald)', fontSize: '0.78rem', marginTop: 4 }}>
            Direct publisher opens
          </div>
        </div>
      </div>

      {/* Active Event Spotlight & Share Banner */}
      <div className="glass-panel dashboard-spotlight" style={{
        padding: 24,
        marginBottom: 36,
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.95))',
        border: '1px solid rgba(56, 189, 248, 0.25)'
      }}>
        <div className="dashboard-spotlight-top" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <img 
              src={activeEvent.coverImage} 
              alt={activeEvent.name}
              style={{ width: 80, height: 60, borderRadius: 8, objectFit: 'cover' }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  fontSize: '0.72rem',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  color: 'var(--accent-emerald)',
                  background: 'rgba(16, 185, 129, 0.15)',
                  padding: '2px 8px',
                  borderRadius: 4
                }}>
                  Active Selected Event
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{activeEvent.date}</span>
              </div>
              <h2 style={{ fontSize: '1.3rem', marginTop: 2 }}>{activeEvent.name}</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {activeEvent.organizerName} • {activeEvent.location}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button
              onClick={() => handleCopyLink(activeEvent.slug || activeEvent.id)}
              className="btn btn-secondary"
            >
              {copiedLink ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
              {copiedLink ? 'Copied URL!' : 'Copy Attendee Link'}
            </button>
            <button
              onClick={() => setShowQR(true)}
              className="btn btn-secondary"
            >
              <QrCode size={16} /> QR Screen
            </button>
            <button
              onClick={() => handleOpenAttendee(activeEvent.id)}
              className="btn btn-primary"
            >
              <Sparkles size={16} /> Test Attendee Flow
            </button>
          </div>
        </div>

        {/* Funnel conversion bar */}
        <div style={{
          marginTop: 20,
          paddingTop: 16,
          borderTop: '1px solid var(--border-subtle)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: 12
        }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Event Visits</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{activeEvent.metrics?.attendees || 0}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Photos Uploaded</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{activeEvent.metrics?.photosUploaded || 0}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Posts Generated</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{activeEvent.metrics?.postsGenerated || 0}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Posts Copied</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{activeEvent.metrics?.postsCopied || 0}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>LinkedIn Published</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{activeEvent.metrics?.linkedinOpens || 0}</div>
          </div>
        </div>
      </div>

      {/* Events List */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ fontSize: '1.25rem' }}>All Events ({events.length})</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
          {events.map((evt) => {
            const isSelected = evt.id === activeEvent.id;
            return (
              <div 
                key={evt.id}
                className="glass-panel"
                style={{
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  border: isSelected ? '2px solid #38bdf8' : '1px solid var(--border-subtle)',
                  boxShadow: isSelected ? '0 0 20px rgba(56, 189, 248, 0.2)' : 'none'
                }}
              >
                <div style={{ height: 140, position: 'relative', overflow: 'hidden' }}>
                  <img
                    src={evt.coverImage}
                    alt={evt.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    background: 'rgba(15, 23, 42, 0.85)',
                    padding: '3px 8px',
                    borderRadius: 4,
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: '#fff'
                  }}>
                    {evt.status || 'Active'}
                  </div>
                </div>

                <div style={{ padding: 20, flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontSize: '1.15rem', marginBottom: 4 }}>{evt.name}</h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 12 }}>
                    By {evt.organizerName}
                  </p>

                  <div style={{ display: 'flex', gap: 12, fontSize: '0.78rem', color: 'var(--text-subtle)', marginBottom: 16 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Calendar size={13} /> {evt.date}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      <MapPin size={13} /> {evt.location}
                    </span>
                  </div>

                  {/* Metrics Row */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 8,
                    background: 'rgba(15, 23, 42, 0.5)',
                    padding: '10px 12px',
                    borderRadius: 8,
                    marginBottom: 16,
                    textAlign: 'center'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Attendees</div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{evt.metrics?.attendees || 0}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Generated</div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{evt.metrics?.postsGenerated || 0}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Copied</div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--accent-emerald)' }}>
                        {evt.metrics?.postsCopied || 0}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ marginTop: 'auto', display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => handleOpenAttendee(evt.id)}
                      className="btn btn-primary"
                      style={{ flex: 1, fontSize: '0.82rem', padding: '8px 12px' }}
                    >
                      <Sparkles size={14} /> Attendee View
                    </button>
                    <button
                      onClick={() => handleCopyLink(evt.slug || evt.id)}
                      className="btn btn-secondary"
                      style={{ padding: '8px 12px' }}
                      title="Copy Attendee Link"
                    >
                      <Copy size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* QR Code Modal */}
      <QRCodeModal
        event={activeEvent}
        isOpen={showQR}
        onClose={() => setShowQR(false)}
      />

      {/* Create Event Wizard */}
      <CreateEventModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreated={(newEvent) => {
          addEvent(newEvent);
        }}
      />
    </div>
  );
}
