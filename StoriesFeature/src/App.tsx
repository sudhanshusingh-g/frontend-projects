import { useState, useEffect, useMemo, useCallback } from 'react';
import { Camera, Sparkles } from 'lucide-react';
import type { Story, UserStoryGroup, StoryViewerState } from './types/story';
import {
  getStoriesFromStorage,
  saveStoriesToStorage,
  groupStoriesByUser,
  getInitialSeedStories,
} from './utils/storage';
import { StoryTray } from './components/StoryTray';
import { StoryUploadModal } from './components/StoryUploadModal';
import { StoryViewer } from './components/StoryViewer';
import { DemoControls } from './components/DemoControls';
import './App.css';

export function App() {
  const [simulatedTimeOffsetMs, setSimulatedTimeOffsetMs] = useState(0);
  const [stories, setStories] = useState<Story[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [viewerState, setViewerState] = useState<StoryViewerState>({
    isOpen: false,
    userIndex: 0,
    storyIndex: 0,
  });

  // Load stories from local storage & apply 24-hour expiration filter
  const refreshStoriesFromStorage = useCallback(() => {
    const loaded = getStoriesFromStorage(simulatedTimeOffsetMs);
    setStories(loaded);
  }, [simulatedTimeOffsetMs]);

  // Initial load
  useEffect(() => {
    refreshStoriesFromStorage();
  }, [refreshStoriesFromStorage]);

  // Periodic check (every 10 seconds) to clean up expired stories automatically
  useEffect(() => {
    const interval = setInterval(() => {
      refreshStoriesFromStorage();
    }, 10000);
    return () => clearInterval(interval);
  }, [refreshStoriesFromStorage]);

  // Group stories by user
  const userGroups: UserStoryGroup[] = useMemo(() => {
    return groupStoriesByUser(stories, 'user-you');
  }, [stories]);

  // Calculate local storage size usage in KB
  const storageUsageKb = useMemo(() => {
    try {
      const raw = localStorage.getItem('stories_app_data_v1') || '';
      return (raw.length * 2) / 1024; // 2 bytes per char in UTF-16
    } catch {
      return 0;
    }
  }, [stories]);

  // Add new uploaded story
  const handleAddStory = (newStory: Story) => {
    const updated = [newStory, ...stories];
    setStories(updated);
    saveStoriesToStorage(updated);
  };

  // Delete a story
  const handleDeleteStory = (storyId: string) => {
    const updated = stories.filter((s) => s.id !== storyId);
    setStories(updated);
    saveStoriesToStorage(updated);

    // If deleting last story of user, update viewer or close
    const remainingGroups = groupStoriesByUser(updated, 'user-you');
    if (remainingGroups.length === 0) {
      setViewerState({ isOpen: false, userIndex: 0, storyIndex: 0 });
    } else if (viewerState.userIndex >= remainingGroups.length) {
      setViewerState((prev) => ({
        ...prev,
        userIndex: Math.max(0, remainingGroups.length - 1),
      }));
    }
  };

  // Mark story as viewed
  const handleMarkViewed = (storyId: string) => {
    setStories((prev) => {
      const updated = prev.map((s) =>
        s.id === storyId ? { ...s, viewed: true } : s
      );
      saveStoriesToStorage(updated);
      return updated;
    });
  };

  // Dev Control: Fast Forward +24 Hours
  const handleFastForward24h = () => {
    const nextOffset = simulatedTimeOffsetMs + 24 * 60 * 60 * 1000;
    setSimulatedTimeOffsetMs(nextOffset);

    // Apply expiration check with new time offset
    const remaining = getStoriesFromStorage(nextOffset);
    setStories(remaining);
  };

  // Dev Control: Reset Sample Seed Data
  const handleResetSeedData = () => {
    setSimulatedTimeOffsetMs(0);
    const seed = getInitialSeedStories();
    setStories(seed);
    saveStoriesToStorage(seed);
  };

  // Dev Control: Clear Storage
  const handleClearStorage = () => {
    setSimulatedTimeOffsetMs(0);
    setStories([]);
    localStorage.removeItem('stories_app_data_v1');
  };

  return (
    <div className="app-container">
      {/* Top Brand Header */}
      <header className="app-header">
        <div className="logo-brand">
          <div className="logo-icon-gradient">
            <Camera size={22} />
          </div>
          <span className="logo-text">Stories</span>
        </div>

        <div className="header-actions-right">
          <button
            type="button"
            className="btn-upload-nav"
            onClick={() => setIsUploadModalOpen(true)}
          >
            <Sparkles size={16} />
            <span>Add Story</span>
          </button>
        </div>
      </header>

      {/* Main Feed Container */}
      <main className="feed-frame">
        {/* Story Tray Component (Top horizontal scroll avatar list with + button) */}
        <StoryTray
          groups={userGroups}
          onOpenUploadModal={() => setIsUploadModalOpen(true)}
          onSelectUserGroup={(idx) =>
            setViewerState({ isOpen: true, userIndex: idx, storyIndex: 0 })
          }
        />

        {/* Mock Feed Content */}
        <div className="feed-content">
          <div className="feed-card-item">
            <div className="feed-item-header">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
                alt="Elena"
                className="feed-item-avatar"
              />
              <div>
                <div className="feed-item-user">Elena Rostova</div>
                <div className="feed-item-time">Santorini, Greece</div>
              </div>
            </div>
            <img
              src="https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&auto=format&fit=crop&q=80"
              alt="Greece Sunset Feed"
              className="feed-item-image"
            />
            <p className="feed-item-text">
              ✨ Tap on the avatar ring above to experience full-screen story playback with touch swipe gestures, interactive progress bars, and 24-hour expiration!
            </p>
          </div>

          <div className="feed-card-item">
            <div className="feed-item-header">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
                alt="Marcus"
                className="feed-item-avatar"
              />
              <div>
                <div className="feed-item-user">Marcus Vance</div>
                <div className="feed-item-time">Tokyo, Japan</div>
              </div>
            </div>
            <img
              src="https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&auto=format&fit=crop&q=80"
              alt="Tokyo feed"
              className="feed-item-image"
            />
            <p className="feed-item-text">
              📸 Click <strong>Add Story</strong> to upload any photo from your device. It will be resized automatically on Canvas (max 1080x1920), converted to Base64, and saved to client LocalStorage.
            </p>
          </div>
        </div>
      </main>

      {/* Dev Simulation & Time Machine Controls */}
      <DemoControls
        onFastForward24h={handleFastForward24h}
        onResetSeedData={handleResetSeedData}
        onClearStorage={handleClearStorage}
        storageUsageKb={storageUsageKb}
        simulatedTimeOffsetHours={Math.round(simulatedTimeOffsetMs / (1000 * 60 * 60))}
        activeStoryCount={stories.length}
      />

      {/* Upload Modal Dialog */}
      <StoryUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onAddStory={handleAddStory}
      />

      {/* Fullscreen / Frame Story Viewer Modal */}
      <StoryViewer
        isOpen={viewerState.isOpen}
        userGroups={userGroups}
        initialUserIndex={viewerState.userIndex}
        initialStoryIndex={viewerState.storyIndex}
        onClose={() =>
          setViewerState({ isOpen: false, userIndex: 0, storyIndex: 0 })
        }
        onDeleteStory={handleDeleteStory}
        onMarkViewed={handleMarkViewed}
        simulatedTimeOffsetMs={simulatedTimeOffsetMs}
      />
    </div>
  );
}

export default App;
