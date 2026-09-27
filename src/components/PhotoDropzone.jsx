import React, { useRef } from 'react';
import { UploadCloud, Image as ImageIcon, X, Star } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function PhotoDropzone({
  photos,
  setPhotos,
  primaryIndex,
  setPrimaryIndex
}) {
  const fileInputRef = useRef(null);
  const { addToast } = useApp();

  const handleFiles = (fileList) => {
    const validFiles = Array.from(fileList).filter(file => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        addToast(`File ${file.name} is not a valid image`, 'error');
      }
      return isImage;
    });

    if (validFiles.length === 0) return;

    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotos(prev => {
          const newArray = [...prev, {
            id: 'photo-' + Date.now() + Math.random().toString(),
            url: e.target.result,
            name: file.name
          }];
          return newArray;
        });
      };
      reader.readAsDataURL(file);
    });

    addToast(`Added ${validFiles.length} photo(s)`, 'success');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleRemove = (index, e) => {
    e.stopPropagation();
    setPhotos(prev => prev.filter((_, i) => i !== index));
    if (primaryIndex === index) {
      setPrimaryIndex(0);
    } else if (primaryIndex > index) {
      setPrimaryIndex(primaryIndex - 1);
    }
  };

  const handleSetPrimary = (index, e) => {
    e.stopPropagation();
    setPrimaryIndex(index);
    addToast('Set as primary cover photo', 'info');
  };

  // Add demo quick photos helper
  const addDemoPhoto = (url) => {
    setPhotos(prev => [...prev, {
      id: 'photo-demo-' + Date.now(),
      url,
      name: 'event-photo.jpg'
    }]);
    addToast('Demo photo added', 'info');
  };

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <label className="form-label" style={{ margin: 0 }}>
          Event Photos ({photos.length})
        </label>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          {photos.length > 0 ? 'Click star to set primary preview' : 'PNG, JPG, WEBP supported'}
        </span>
      </div>

      {/* Drag & Drop Area */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: '2px dashed var(--border-strong)',
          borderRadius: 'var(--radius-md)',
          padding: '24px 16px',
          textAlign: 'center',
          cursor: 'pointer',
          background: 'rgba(15, 23, 42, 0.4)',
          transition: 'all 0.2s ease'
        }}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => handleFiles(e.target.files)}
          multiple
          accept="image/*"
          style={{ display: 'none' }}
        />
        <UploadCloud size={32} color="var(--primary-light)" style={{ margin: '0 auto 8px' }} />
        <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>
          Drop your event photos here <span style={{ color: 'var(--primary-light)' }}>or browse</span>
        </div>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 4 }}>
          Upload high-res stage, selfie, or audience snaps to attach to your post
        </p>

        {photos.length === 0 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 12 }} onClick={(e) => e.stopPropagation()}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>Quick demo photos:</span>
            <button
              type="button"
              onClick={() => addDemoPhoto('https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80')}
              style={{ fontSize: '0.72rem', background: 'rgba(255,255,255,0.08)', border: 'none', color: '#38bdf8', padding: '2px 8px', borderRadius: 4, cursor: 'pointer' }}
            >
              + Keynote Hall
            </button>
            <button
              type="button"
              onClick={() => addDemoPhoto('https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=600&q=80')}
              style={{ fontSize: '0.72rem', background: 'rgba(255,255,255,0.08)', border: 'none', color: '#38bdf8', padding: '2px 8px', borderRadius: 4, cursor: 'pointer' }}
            >
              + Panel Stage
            </button>
          </div>
        )}
      </div>

      {/* Gallery of Uploaded Photos */}
      {photos.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
          gap: 10,
          marginTop: 14
        }}>
          {photos.map((photo, idx) => {
            const isPrimary = idx === primaryIndex;
            return (
              <div
                key={photo.id || idx}
                style={{
                  position: 'relative',
                  height: 75,
                  borderRadius: 8,
                  overflow: 'hidden',
                  border: isPrimary ? '2px solid #38bdf8' : '1px solid var(--border-subtle)',
                  boxShadow: isPrimary ? '0 0 10px rgba(56, 189, 248, 0.4)' : 'none'
                }}
              >
                <img
                  src={photo.url}
                  alt={photo.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                
                {/* Delete button */}
                <button
                  type="button"
                  onClick={(e) => handleRemove(idx, e)}
                  title="Remove image"
                  style={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    background: 'rgba(0,0,0,0.7)',
                    border: 'none',
                    borderRadius: '50%',
                    width: 20,
                    height: 20,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    cursor: 'pointer'
                  }}
                >
                  <X size={12} />
                </button>

                {/* Primary selection badge */}
                <button
                  type="button"
                  onClick={(e) => handleSetPrimary(idx, e)}
                  title={isPrimary ? 'Primary post photo' : 'Set as primary photo'}
                  style={{
                    position: 'absolute',
                    bottom: 4,
                    left: 4,
                    background: isPrimary ? '#0a66c2' : 'rgba(0,0,0,0.6)',
                    border: 'none',
                    borderRadius: 4,
                    padding: '2px 4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3,
                    color: isPrimary ? '#fff' : '#cbd5e1',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  <Star size={10} fill={isPrimary ? '#fff' : 'transparent'} />
                  {isPrimary ? 'Primary' : ''}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
