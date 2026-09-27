import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Calendar, UserCheck, Layers, ExternalLink } from 'lucide-react';

export default function TopNav() {
  const { role, setRole, events, activeEventId, setActiveEventId, activeEvent } = useApp();

  return (
    <header className="topnav-header" style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      background: 'rgba(15, 23, 42, 0.85)',
      borderBottom: '1px solid var(--border-subtle)',
      padding: '12px 24px'
    }}>
      <div className="topnav-container" style={{
        maxWidth: 1400,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16
      }}>
        {/* Logo and Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            background: 'linear-gradient(135deg, #0a66c2, #38bdf8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            boxShadow: '0 4px 12px rgba(10, 102, 194, 0.4)'
          }}>
            <Sparkles size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.25rem',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                background: 'linear-gradient(to right, #ffffff, #94a3b8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                EventPost<span style={{ color: '#38bdf8', WebkitTextFillColor: '#38bdf8' }}>AI</span>
              </span>
              <span style={{
                fontSize: '0.68rem',
                background: 'rgba(56, 189, 248, 0.15)',
                color: '#38bdf8',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                padding: '2px 6px',
                borderRadius: '4px',
                fontWeight: 700,
                textTransform: 'uppercase'
              }}>
                SaaS Beta
              </span>
            </div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0 }}>
              Turn event highlights into viral LinkedIn posts
            </p>
          </div>
        </div>

        {/* Event Quick Switcher (when organizer or attendee) */}
        <div className="topnav-actions" style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <div className="topnav-event-select" style={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(30, 41, 59, 0.6)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            padding: '4px 10px'
          }}>
            <Calendar size={15} color="var(--primary-light)" style={{ marginRight: 8 }} />
            <select
              aria-label="Active Event"
              value={activeEventId}
              onChange={(e) => setActiveEventId(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-main)',
                fontSize: '0.85rem',
                fontWeight: 500,
                outline: 'none',
                cursor: 'pointer',
                maxWidth: 240
              }}
            >
              {events.map(evt => (
                <option key={evt.id} value={evt.id} style={{ background: '#1e293b', color: '#fff' }}>
                  {evt.name}
                </option>
              ))}
            </select>
          </div>

          {/* Role Switcher Pill */}
          <div className="role-switcher-wrap" style={{
            display: 'inline-flex',
            background: 'rgba(15, 23, 42, 0.9)',
            padding: '3px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-strong)'
          }}>
            <button
              onClick={() => setRole('organizer')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 14px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: role === 'organizer' ? 'var(--primary)' : 'transparent',
                color: role === 'organizer' ? '#fff' : 'var(--text-muted)',
                fontWeight: 600,
                fontSize: '0.82rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Layers size={14} />
              Organizer
            </button>
            <button
              onClick={() => setRole('attendee')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 14px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: role === 'attendee' ? 'linear-gradient(135deg, #8b5cf6, #3b82f6)' : 'transparent',
                color: role === 'attendee' ? '#fff' : 'var(--text-muted)',
                fontWeight: 600,
                fontSize: '0.82rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <UserCheck size={14} />
              Attendee View
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
