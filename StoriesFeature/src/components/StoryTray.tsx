import React from 'react';
import { Plus } from 'lucide-react';
import type { UserStoryGroup } from '../types/story';

interface StoryTrayProps {
  groups: UserStoryGroup[];
  onOpenUploadModal: () => void;
  onSelectUserGroup: (userIndex: number) => void;
  currentUserAvatar?: string;
}

export const StoryTray: React.FC<StoryTrayProps> = ({
  groups,
  onOpenUploadModal,
  onSelectUserGroup,
  currentUserAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
}) => {
  // Find current user group if exists
  const currentUserGroup = groups.find((g) => g.isCurrentUser);
  const otherGroups = groups.filter((g) => !g.isCurrentUser);

  return (
    <section className="story-tray-container" aria-label="Stories">
      <div className="story-tray-scroll">
        {/* Your Story item with + upload button */}
        <div className="story-avatar-wrapper">
          <div
            className={`avatar-ring ${
              currentUserGroup
                ? currentUserGroup.hasUnviewed
                  ? 'ring-unviewed'
                  : 'ring-viewed'
                : 'ring-none'
            }`}
            onClick={() => {
              if (currentUserGroup && currentUserGroup.stories.length > 0) {
                const idx = groups.findIndex((g) => g.isCurrentUser);
                onSelectUserGroup(idx >= 0 ? idx : 0);
              } else {
                onOpenUploadModal();
              }
            }}
          >
            <img
              src={currentUserGroup?.userAvatar || currentUserAvatar}
              alt="Your Story"
              className="avatar-img"
            />
            {/* Plus upload badge */}
            <button
              type="button"
              className="upload-plus-badge"
              onClick={(e) => {
                e.stopPropagation();
                onOpenUploadModal();
              }}
              title="Add new story"
              aria-label="Add new story"
            >
              <Plus className="plus-icon" size={14} strokeWidth={3} />
            </button>
          </div>
          <span className="avatar-label">Your story</span>
        </div>

        {/* Other Users' Stories */}
        {otherGroups.map((group) => {
          const globalIndex = groups.findIndex((g) => g.userId === group.userId);

          return (
            <div
              key={group.userId}
              className="story-avatar-wrapper"
              onClick={() => onSelectUserGroup(globalIndex)}
            >
              <div
                className={`avatar-ring ${
                  group.hasUnviewed ? 'ring-unviewed' : 'ring-viewed'
                }`}
              >
                <img
                  src={group.userAvatar}
                  alt={group.userName}
                  className="avatar-img"
                />
              </div>
              <span className="avatar-label">{group.userName}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
};
