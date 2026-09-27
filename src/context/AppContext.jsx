import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_EVENTS } from '../data/initialData';

const AppContext = createContext();

export function AppProvider({ children }) {
  // 1. Role: 'organizer' | 'attendee'
  const [role, setRole] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('role') || 'organizer';
  });

  // 2. Events list
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('eventpost_events');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_EVENTS;
  });

  // 3. Active event selection
  const [activeEventId, setActiveEventId] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('event');
    if (slug) {
      const match = INITIAL_EVENTS.find(e => e.slug === slug || e.id === slug);
      if (match) return match.id;
    }
    return INITIAL_EVENTS[0].id;
  });

  // 4. Attendee personal state
  const [attendeeProfile, setAttendeeProfile] = useState(() => {
    const saved = localStorage.getItem('eventpost_attendee_profile');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      name: 'Alex Patel',
      jobTitle: 'Senior Product Engineer',
      company: 'TechFlow Systems',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      linkedinUrl: 'https://linkedin.com/in/alex-patel'
    };
  });

  // 5. Toast notification system
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info', duration = 3500) => {
    const id = Date.now() + Math.random().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  };

  // Sync events to local storage
  useEffect(() => {
    localStorage.setItem('eventpost_events', JSON.stringify(events));
  }, [events]);

  // Sync attendee profile
  useEffect(() => {
    localStorage.setItem('eventpost_attendee_profile', JSON.stringify(attendeeProfile));
  }, [attendeeProfile]);

  // Sync URL query params with active role and event
  useEffect(() => {
    const activeEvt = events.find(e => e.id === activeEventId);
    const slug = activeEvt?.slug || activeEventId;
    const url = new URL(window.location);
    url.searchParams.set('role', role);
    if (slug) url.searchParams.set('event', slug);
    window.history.replaceState({}, '', url);
  }, [role, activeEventId, events]);

  // Actions
  const addEvent = (newEvent) => {
    const slug = newEvent.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const created = {
      ...newEvent,
      id: 'evt-' + Date.now(),
      slug: slug || 'event-' + Date.now(),
      createdAt: new Date().toISOString(),
      metrics: {
        attendees: 1,
        postsGenerated: 0,
        postsCopied: 0,
        linkedinOpens: 0,
        photosUploaded: 0,
        regenerations: 0
      }
    };
    setEvents(prev => [created, ...prev]);
    setActiveEventId(created.id);
    addToast(`Event "${created.name}" created successfully!`, 'success');
    return created;
  };

  const updateEventMetrics = (eventId, key, incrementBy = 1) => {
    setEvents(prev => prev.map(evt => {
      if (evt.id === eventId) {
        return {
          ...evt,
          metrics: {
            ...evt.metrics,
            [key]: (evt.metrics[key] || 0) + incrementBy
          }
        };
      }
      return evt;
    }));
  };

  const activeEvent = events.find(e => e.id === activeEventId) || events[0];

  return (
    <AppContext.Provider value={{
      role,
      setRole,
      events,
      activeEventId,
      setActiveEventId,
      activeEvent,
      addEvent,
      updateEventMetrics,
      attendeeProfile,
      setAttendeeProfile,
      toasts,
      addToast
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
