import React, { useState, useRef } from 'react';
import { X, Upload, Sparkles, Image as ImageIcon, Type, Check } from 'lucide-react';
import { processAndCompressImage } from '../utils/image';
import type { Story } from '../types/story';

interface StoryUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStory: (newStory: Story) => void;
  currentUserAvatar?: string;
  currentUserName?: string;
}

export const StoryUploadModal: React.FC<StoryUploadModalProps> = ({
  isOpen,
  onClose,
  onAddStory,
  currentUserAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  currentUserName = 'You',
}) => {
  const [previewData, setPreviewData] = useState<{
    base64: string;
    width: number;
    height: number;
    aspectRatio: number;
  } | null>(null);
  const [caption, setCaption] = useState('');
  const [captionColor, setCaptionColor] = useState('#ffffff');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      // Process image using HTML5 Canvas: scale down to max 1080x1920 & convert to compressed base64 JPEG
      const processed = await processAndCompressImage(file, 1080, 1920, 0.85);
      setPreviewData(processed);
    } catch (err) {
      console.error('Error processing image:', err);
      alert('Failed to process image file. Please try another image.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!previewData) return;

    const now = Date.now();
    const newStory: Story = {
      id: 'story-' + Math.random().toString(36).substring(2, 11),
      userId: 'user-you',
      userName: currentUserName,
      userAvatar: currentUserAvatar,
      isCurrentUser: true,
      imageBase64: previewData.base64,
      caption: caption.trim() || undefined,
      captionColor,
      timestamp: now,
      expiresAt: now + 24 * 60 * 60 * 1000, // Expiration timestamp set to 24 hours from now
      viewed: false,
      aspectRatio: previewData.aspectRatio,
    };

    onAddStory(newStory);
    handleResetAndClose();
  };

  const handleResetAndClose = () => {
    setPreviewData(null);
    setCaption('');
    setCaptionColor('#ffffff');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleResetAndClose}>
      <div
        className="modal-card story-upload-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <Sparkles size={20} className="modal-icon-sparkle" />
            <h3>Create Story</h3>
          </div>
          <button
            type="button"
            className="icon-btn-close"
            onClick={handleResetAndClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Upload Body */}
        <form onSubmit={handleSubmit} className="modal-body">
          {!previewData ? (
            <div
              className="dropzone-area"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden-file-input"
                onChange={handleFileChange}
              />
              <div className="dropzone-content">
                <div className="dropzone-icon-circle">
                  <Upload size={32} />
                </div>
                <p className="dropzone-title">Click or drag image to upload</p>
                <span className="dropzone-sub">
                  Supports JPEG, PNG, WebP • Auto-constrained to max 1080×1920px
                </span>
              </div>
            </div>
          ) : (
            <div className="story-preview-container">
              {/* Preview Image with overlay caption */}
              <div className="preview-image-wrapper">
                <img
                  src={previewData.base64}
                  alt="Story preview"
                  className="preview-img"
                />
                {caption && (
                  <div
                    className="preview-caption-overlay"
                    style={{ color: captionColor }}
                  >
                    <span>{caption}</span>
                  </div>
                )}
                {/* 1080x1920 Dimension Constraint Badge */}
                <div className="dimension-badge">
                  <ImageIcon size={12} />
                  <span>
                    {previewData.width} × {previewData.height} px
                  </span>
                </div>
              </div>

              {/* Caption & Text Color controls */}
              <div className="upload-controls">
                <div className="input-group">
                  <label className="input-label">
                    <Type size={16} />
                    <span>Caption (optional)</span>
                  </label>
                  <input
                    type="text"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Add a caption to your story..."
                    maxLength={100}
                    className="text-input"
                  />
                </div>

                <div className="color-picker-row">
                  <span className="color-label">Text Color:</span>
                  {['#ffffff', '#00f2fe', '#f6d365', '#ff0844', '#a1c4fd'].map(
                    (color) => (
                      <button
                        type="button"
                        key={color}
                        className={`color-dot ${
                          captionColor === color ? 'active' : ''
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => setCaptionColor(color)}
                        aria-label={`Select text color ${color}`}
                      />
                    )
                  )}
                </div>

                <button
                  type="button"
                  className="change-photo-btn"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Change Photo
                </button>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="modal-footer">
            <button
              type="button"
              className="btn-secondary"
              onClick={handleResetAndClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!previewData || isProcessing}
              className="btn-primary"
            >
              <Check size={18} />
              <span>Share to Story</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
