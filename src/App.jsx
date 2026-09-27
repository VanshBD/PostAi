import React from 'react';
import { useApp } from './context/AppContext';
import TopNav from './components/TopNav';
import OrganizerDashboard from './components/OrganizerDashboard';
import AttendeeGenerator from './components/AttendeeGenerator';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export default function App() {
  const { role, toasts } = useApp();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Universal Top Navigation */}
      <TopNav />

      {/* Main Content View Switcher */}
      <main style={{ flex: 1 }}>
        {role === 'organizer' ? (
          <OrganizerDashboard />
        ) : (
          <AttendeeGenerator />
        )}
      </main>

      {/* Toast Notification Container */}
      <div className="toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className={`toast ${toast.type}`}>
            {toast.type === 'success' && <CheckCircle2 size={16} color="var(--accent-emerald)" />}
            {toast.type === 'error' && <AlertCircle size={16} color="var(--accent-rose)" />}
            {toast.type === 'info' && <Info size={16} color="var(--primary-light)" />}
            <span>{toast.message}</span>
          </div>
        ))}
      </div>

      {/* Subtle modern SaaS footer */}
      <footer style={{
        borderTop: '1px solid var(--border-subtle)',
        padding: '24px 20px',
        textAlign: 'center',
        fontSize: '0.8rem',
        color: 'var(--text-subtle)',
        marginTop: 40
      }}>
        EventPost AI • Turn your event experience into a polished LinkedIn post in seconds • Multi-provider AI powered
      </footer>
    </div>
  );
}
