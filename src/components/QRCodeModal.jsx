import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { X, Copy, Download, Check, ExternalLink } from 'lucide-react';
import { useApp } from '../context/AppContext';

import { buildAttendeeUrl } from '../utils/url';

export default function QRCodeModal({ event, isOpen, onClose }) {
  const canvasRef = useRef(null);
  const [copied, setCopied] = React.useState(false);
  const { addToast } = useApp();

  const attendeeUrl = buildAttendeeUrl(event.slug || event.id);

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, attendeeUrl, {
        width: 260,
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#ffffff'
        }
      }, (error) => {
        if (error) console.error('QR code generation error:', error);
      });
    }
  }, [isOpen, attendeeUrl]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(attendeeUrl);
    setCopied(true);
    addToast('Attendee link copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.download = `${event.slug || 'event'}-attendee-qr.png`;
      link.href = canvasRef.current.toDataURL();
      link.click();
      addToast('QR Code image downloaded!', 'info');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: 16
    }} onClick={onClose}>
      <div 
        className="glass-panel animate-fade-in"
        style={{
          width: '100%',
          maxWidth: 440,
          background: '#1e293b',
          border: '1px solid var(--border-strong)',
          borderRadius: 'var(--radius-lg)',
          padding: 28,
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            background: 'rgba(255, 255, 255, 0.08)',
            border: 'none',
            borderRadius: '50%',
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-muted)',
            cursor: 'pointer'
          }}
        >
          <X size={18} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: 6 }}>Attendee Access QR</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Print or project this on stage for attendees to instantly generate posts
          </p>
        </div>

        <div style={{
          background: '#ffffff',
          padding: 16,
          borderRadius: 14,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 20,
          boxShadow: '0 8px 24px rgba(0,0,0,0.35)'
        }}>
          <canvas ref={canvasRef} />
        </div>

        <div style={{
          background: 'rgba(15, 23, 42, 0.6)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '10px 12px',
          marginBottom: 20,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8
        }}>
          <span style={{
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {attendeeUrl}
          </span>
          <button
            onClick={handleCopy}
            className="btn btn-secondary"
            style={{ padding: '6px 10px', fontSize: '0.78rem' }}
          >
            {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <button
            onClick={handleDownload}
            className="btn btn-primary"
            style={{ width: '100%' }}
          >
            <Download size={16} />
            Download QR
          </button>
          <button
            onClick={handleCopy}
            className="btn btn-secondary"
            style={{ width: '100%' }}
          >
            <Copy size={16} />
            Copy Link
          </button>
        </div>
      </div>
    </div>
  );
}
