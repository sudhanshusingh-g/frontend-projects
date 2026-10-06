import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  X,
  Trash2,
  Heart,
  Send,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Share2,
} from 'lucide-react';
import type { UserStoryGroup } from '../types/story';
import { formatRelativeTime } from '../utils/image';

interface StoryViewerProps {
  isOpen: boolean;
  userGroups: UserStoryGroup[];
  initialUserIndex: number;
  initialStoryIndex?: number;
  onClose: () => void;
  onDeleteStory: (storyId: string) => void;
  onMarkViewed: (storyId: string) => void;
  simulatedTimeOffsetMs?: number;
}

const STORY_DURATION_MS = 5000; // 5 seconds per story slide

export const StoryViewer: React.FC<StoryViewerProps> = ({
  isOpen,
  userGroups,
  initialUserIndex,
  initialStoryIndex = 0,
  onClose,
  onDeleteStory,
  onMarkViewed,
  simulatedTimeOffsetMs = 0,
}) => {
  const [currentUserIdx, setCurrentUserIdx] = useState(initialUserIndex);
  const [currentStoryIdx, setCurrentStoryIdx] = useState(initialStoryIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [replySentMessage, setReplySentMessage] = useState<string | null>(null);

  // Swipe Gesture state
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const isHolding = useRef(false);

  // Sync state when props change
  useEffect(() => {
    if (isOpen) {
      setCurrentUserIdx(Math.min(initialUserIndex, Math.max(0, userGroups.length - 1)));
      setCurrentStoryIdx(0);
      setProgress(0);
      setIsPaused(false);
      setIsLiked(false);
    }
  }, [isOpen, initialUserIndex, userGroups.length]);

  const activeGroup = userGroups[currentUserIdx];
  const activeStory = activeGroup?.stories[currentStoryIdx];

  // Mark active story as viewed
  useEffect(() => {
    if (isOpen && activeStory && !activeStory.viewed) {
      onMarkViewed(activeStory.id);
    }
  }, [isOpen, activeStory?.id, onMarkViewed]);

  // Next Story navigation logic
  const handleNext = useCallback(() => {
    if (!activeGroup) return;

    if (currentStoryIdx < activeGroup.stories.length - 1) {
      // Next story within same user
      setCurrentStoryIdx((prev) => prev + 1);
      setProgress(0);
    } else if (currentUserIdx < userGroups.length - 1) {
      // Next user
      setCurrentUserIdx((prev) => prev + 1);
      setCurrentStoryIdx(0);
      setProgress(0);
    } else {
      // End of all stories -> close viewer
      onClose();
    }
  }, [activeGroup, currentStoryIdx, currentUserIdx, userGroups.length, onClose]);

  // Previous Story navigation logic
  const handlePrev = useCallback(() => {
    if (currentStoryIdx > 0) {
      // Prev story within same user
      setCurrentStoryIdx((prev) => prev - 1);
      setProgress(0);
    } else if (currentUserIdx > 0) {
      // Prev user -> jump to their last story
      const prevUserGroup = userGroups[currentUserIdx - 1];
      setCurrentUserIdx((prev) => prev - 1);
      setCurrentStoryIdx(prevUserGroup.stories.length - 1);
      setProgress(0);
    } else {
      // Restart current story progress
      setProgress(0);
    }
  }, [currentStoryIdx, currentUserIdx, userGroups]);

  // Timer interval for story progress bar auto-advancing
  useEffect(() => {
    if (!isOpen || isPaused || !activeStory) return;

    const intervalStepMs = 50;
    const increment = (intervalStepMs / STORY_DURATION_MS) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + increment;
      });
    }, intervalStepMs);

    return () => clearInterval(timer);
  }, [isOpen, isPaused, activeStory?.id, handleNext]);

  // Keyboard navigation shortcuts
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Escape') onClose();
      if (e.key === ' ' || e.key === 'p' || e.key === 'P') {
        setIsPaused((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleNext, handlePrev, onClose]);

  // Touch & Swipe Event Handlers
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    isHolding.current = true;
    setIsPaused(true);

    if ('touches' in e) {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
    } else {
      touchStartX.current = e.clientX;
      touchStartY.current = e.clientY;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent | React.MouseEvent) => {
    isHolding.current = false;
    setIsPaused(false);

    if (touchStartX.current === null || touchStartY.current === null) return;

    let endX = 0;
    let endY = 0;

    if ('changedTouches' in e) {
      endX = e.changedTouches[0].clientX;
      endY = e.changedTouches[0].clientY;
    } else {
      endX = e.clientX;
      endY = e.clientY;
    }

    const diffX = endX - touchStartX.current;
    const diffY = endY - touchStartY.current;

    touchStartX.current = null;
    touchStartY.current = null;

    // Minimum swipe threshold (50px)
    if (Math.abs(diffX) > 50 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX < 0) {
        // Swiped Left -> Next story group
        handleNext();
      } else {
        // Swiped Right -> Previous story group
        handlePrev();
      }
    } else if (Math.abs(diffY) > 100 && diffY > 0) {
      // Swiped Down -> Close viewer
      onClose();
    }
  };

  // Handle Send Reply
  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setReplySentMessage(`Sent to ${activeGroup.userName}`);
    setReplyText('');
    setTimeout(() => setReplySentMessage(null), 2500);
  };

  if (!isOpen || !activeGroup || !activeStory) return null;

  return (
    <div className="story-viewer-modal">
      <div className="viewer-backdrop" onClick={onClose} />

      <div className="viewer-stage">
        {/* Desktop Side Chevron Navigation Buttons */}
        <button
          type="button"
          className="nav-arrow nav-arrow-left"
          onClick={handlePrev}
          aria-label="Previous story"
        >
          <ChevronLeft size={28} />
        </button>

        <button
          type="button"
          className="nav-arrow nav-arrow-right"
          onClick={handleNext}
          aria-label="Next story"
        >
          <ChevronRight size={28} />
        </button>

        {/* Main Phone Viewport Frame */}
        <div
          className={`viewer-card ${isPaused ? 'paused-holding' : ''}`}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleTouchStart}
          onMouseUp={handleTouchEnd}
        >
          {/* Segmented Top Progress Bars */}
          <div className="viewer-progress-bars">
            {activeGroup.stories.map((s, idx) => {
              let fillPercent = 0;
              if (idx < currentStoryIdx) fillPercent = 100;
              else if (idx === currentStoryIdx) fillPercent = progress;

              return (
                <div key={s.id} className="progress-bar-track">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${fillPercent}%` }}
                  />
                </div>
              );
            })}
          </div>

          {/* Viewer Header Overlay */}
          <div className="viewer-header">
            <div className="user-info">
              <img
                src={activeGroup.userAvatar}
                alt={activeGroup.userName}
                className="viewer-avatar"
              />
              <div className="user-meta">
                <span className="user-name">{activeGroup.userName}</span>
                <span className="timestamp">
                  {formatRelativeTime(activeStory.timestamp, simulatedTimeOffsetMs)}
                </span>
              </div>
            </div>

            <div className="header-actions">
              <button
                type="button"
                className="icon-btn-pause"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPaused(!isPaused);
                }}
                title={isPaused ? 'Play' : 'Pause'}
              >
                {isPaused ? <Play size={18} /> : <Pause size={18} />}
              </button>

              {/* Delete button (for current user's stories) */}
              {activeGroup.isCurrentUser && (
                <button
                  type="button"
                  className="icon-btn-delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm('Delete this story?')) {
                      onDeleteStory(activeStory.id);
                    }
                  }}
                  title="Delete Story"
                >
                  <Trash2 size={18} />
                </button>
              )}

              <button
                type="button"
                className="icon-btn-close-viewer"
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                aria-label="Close story viewer"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Story Image Viewport */}
          <div className="story-media-container">
            <img
              src={activeStory.imageBase64}
              alt="Story post"
              className="story-media-img"
            />

            {/* Optional Caption Overlay */}
            {activeStory.caption && (
              <div
                className="story-caption-box"
                style={{ color: activeStory.captionColor || '#ffffff' }}
              >
                <p>{activeStory.caption}</p>
              </div>
            )}

            {/* Left / Right Tap Hit Targets */}
            <div
              className="tap-zone zone-left"
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
            />
            <div
              className="tap-zone zone-right"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
            />
          </div>

          {/* Viewer Footer Reply & Like Bar */}
          <div className="viewer-footer" onClick={(e) => e.stopPropagation()}>
            {replySentMessage ? (
              <div className="reply-toast-message">
                <span>✨ {replySentMessage}</span>
              </div>
            ) : (
              <form onSubmit={handleSendReply} className="reply-form">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`Reply to ${activeGroup.userName}...`}
                  className="reply-input"
                  onFocus={() => setIsPaused(true)}
                  onBlur={() => setIsPaused(false)}
                />
                {replyText.trim() && (
                  <button type="submit" className="reply-send-btn">
                    <Send size={16} />
                  </button>
                )}
              </form>
            )}

            <button
              type="button"
              className={`like-heart-btn ${isLiked ? 'liked' : ''}`}
              onClick={() => setIsLiked(!isLiked)}
              title="Like Story"
            >
              <Heart
                size={24}
                fill={isLiked ? '#ff0844' : 'transparent'}
                color={isLiked ? '#ff0844' : '#ffffff'}
              />
            </button>

            <button
              type="button"
              className="share-btn"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: 'Check out this Story', url: window.location.href });
                } else {
                  alert('Story link copied to clipboard!');
                }
              }}
              title="Share"
            >
              <Share2 size={22} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
