export interface Story {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  isCurrentUser?: boolean;
  imageBase64: string;
  caption?: string;
  captionColor?: string;
  timestamp: number; // Epoch milliseconds when story was posted
  expiresAt: number; // Epoch milliseconds when story expires (24h after timestamp)
  viewed: boolean;
  aspectRatio?: number;
}

export interface UserStoryGroup {
  userId: string;
  userName: string;
  userAvatar: string;
  isCurrentUser: boolean;
  stories: Story[];
  hasUnviewed: boolean;
  latestTimestamp: number;
}

export interface StoryViewerState {
  isOpen: boolean;
  userIndex: number;
  storyIndex: number;
}
