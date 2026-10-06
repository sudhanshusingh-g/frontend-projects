import type { Story, UserStoryGroup } from '../types/story';

const STORAGE_KEY = 'stories_app_data_v1';
const EXPIRATION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

// Generator for colorful placeholder SVG data URIs for sample stories
function createSampleStoryDataUri(title: string, subtitle: string, bgGradient: string, iconEmoji: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        ${bgGradient}
      </linearGradient>
      <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="10" stdDeviation="15" flood-opacity="0.3"/>
      </filter>
    </defs>
    <rect width="1080" height="1920" fill="url(#bg)"/>
    <g transform="translate(540, 850)" text-anchor="middle" filter="url(#shadow)">
      <text font-family="system-ui, -apple-system, sans-serif" font-size="160" y="-80">${iconEmoji}</text>
      <text font-family="system-ui, -apple-system, sans-serif" font-size="72" font-weight="800" fill="#ffffff" y="60" letter-spacing="-1">${title}</text>
      <text font-family="system-ui, -apple-system, sans-serif" font-size="38" font-weight="500" fill="rgba(255,255,255,0.85)" y="140">${subtitle}</text>
    </g>
    <path d="M 0 1600 Q 540 1520 1080 1600 L 1080 1920 L 0 1920 Z" fill="rgba(0,0,0,0.25)"/>
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

// Sample initial stories to present a rich, immediate wow-factor
export function getInitialSeedStories(): Story[] {
  const now = Date.now();
  const h = (hours: number) => hours * 60 * 60 * 1000;

  return [
    {
      id: 'sample-1',
      userId: 'user-elena',
      userName: 'Elena Rostova',
      userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      imageBase64: createSampleStoryDataUri('Sunset in Santorini 🌅', 'Golden hour reflections on the Aegean', '<stop offset="0%" stop-color="#ff7e5f"/><stop offset="100%" stop-color="#feb47b"/>', '🏝️'),
      caption: 'Golden hour in Greece ✨',
      captionColor: '#ffffff',
      timestamp: now - h(2),
      expiresAt: (now - h(2)) + EXPIRATION_DURATION_MS,
      viewed: false,
    },
    {
      id: 'sample-2',
      userId: 'user-elena',
      userName: 'Elena Rostova',
      userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      imageBase64: createSampleStoryDataUri('Morning Espresso ☕', 'Fueling up for design sprint week', '<stop offset="0%" stop-color="#3a1c71"/><stop offset="50%" stop-color="#d76d77"/><stop offset="100%" stop-color="#ffaf7b"/>', '☕'),
      caption: 'Coffee first, everything else second.',
      captionColor: '#ffffff',
      timestamp: now - h(1.5),
      expiresAt: (now - h(1.5)) + EXPIRATION_DURATION_MS,
      viewed: false,
    },
    {
      id: 'sample-3',
      userId: 'user-marcus',
      userName: 'Marcus Vance',
      userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      imageBase64: createSampleStoryDataUri('Cyberpunk Vibes 🌃', 'Tokyo night wanderings with camera', '<stop offset="0%" stop-color="#0f2027"/><stop offset="50%" stop-color="#203a43"/><stop offset="100%" stop-color="#2c5364"/>', '📸'),
      caption: 'Neo-Tokyo midnight aesthetics 🏮',
      captionColor: '#00f2fe',
      timestamp: now - h(5),
      expiresAt: (now - h(5)) + EXPIRATION_DURATION_MS,
      viewed: false,
    },
    {
      id: 'sample-4',
      userId: 'user-sara',
      userName: 'Sara Chen',
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      imageBase64: createSampleStoryDataUri('Mountain Peak 🏔️', 'Conquered the summit at sunrise!', '<stop offset="0%" stop-color="#11998e"/><stop offset="100%" stop-color="#38ef7d"/>', '🧗‍♀️'),
      caption: 'Top of the world! Worth the 4am hike.',
      captionColor: '#ffffff',
      timestamp: now - h(8),
      expiresAt: (now - h(8)) + EXPIRATION_DURATION_MS,
      viewed: false,
    },
    {
      id: 'sample-5',
      userId: 'user-devon',
      userName: 'Devon Knight',
      userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      imageBase64: createSampleStoryDataUri('Design System v2 🎨', 'Shipping new components today', '<stop offset="0%" stop-color="#8a2387"/><stop offset="50%" stop-color="#e94057"/><stop offset="100%" stop-color="#f27121"/>', '🚀'),
      caption: 'Dark mode tokens are live! 💻',
      captionColor: '#ffffff',
      timestamp: now - h(14),
      expiresAt: (now - h(14)) + EXPIRATION_DURATION_MS,
      viewed: false,
    },
  ];
}

/**
 * Retrieves unexpired stories from LocalStorage.
 * Removes any story whose expiration time (`expiresAt`) is before current time (plus simulated offset).
 */
export function getStoriesFromStorage(simulatedTimeOffsetMs = 0): Story[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const now = Date.now() + simulatedTimeOffsetMs;

    if (!raw) {
      const initial = getInitialSeedStories();
      saveStoriesToStorage(initial);
      return initial;
    }

    const parsed: Story[] = JSON.parse(raw);
    
    // 24-HOUR EXPIRATION FILTER: Filter out stories where expiresAt <= now
    const validStories = parsed.filter((s) => s.expiresAt > now);

    // If expiration removed any stories, sync updated list back to localStorage
    if (validStories.length !== parsed.length) {
      saveStoriesToStorage(validStories);
    }

    return validStories;
  } catch (err) {
    console.error('Error reading stories from storage:', err);
    return getInitialSeedStories();
  }
}

/**
 * Saves story array to LocalStorage.
 */
export function saveStoriesToStorage(stories: Story[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stories));
  } catch (err) {
    console.error('Error saving stories to LocalStorage:', err);
  }
}

/**
 * Groups stories by user for tray display and viewer sequence.
 * Places Current User story first, followed by unviewed users, then viewed users.
 */
export function groupStoriesByUser(stories: Story[], currentUserId = 'user-you'): UserStoryGroup[] {
  const map = new Map<string, Story[]>();

  stories.forEach((s) => {
    const existing = map.get(s.userId) || [];
    existing.push(s);
    map.set(s.userId, existing);
  });

  const groups: UserStoryGroup[] = [];

  map.forEach((userStories, userId) => {
    // Sort user's stories by timestamp ascending (oldest first in playback)
    userStories.sort((a, b) => a.timestamp - b.timestamp);

    const firstStory = userStories[0];
    const hasUnviewed = userStories.some((s) => !s.viewed);
    const latestTimestamp = Math.max(...userStories.map((s) => s.timestamp));

    groups.push({
      userId,
      userName: firstStory.userName,
      userAvatar: firstStory.userAvatar,
      isCurrentUser: firstStory.isCurrentUser || userId === currentUserId,
      stories: userStories,
      hasUnviewed,
      latestTimestamp,
    });
  });

  // Sort groups: Current User first, then unviewed stories (newest first), then viewed stories
  return groups.sort((a, b) => {
    if (a.isCurrentUser) return -1;
    if (b.isCurrentUser) return 1;
    if (a.hasUnviewed && !b.hasUnviewed) return -1;
    if (!a.hasUnviewed && b.hasUnviewed) return 1;
    return b.latestTimestamp - a.latestTimestamp;
  });
}
