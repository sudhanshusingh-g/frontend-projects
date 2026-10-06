/**
 * Resizes an image file so that its dimensions do not exceed maxW x maxH (1080px x 1920px)
 * while maintaining aspect ratio, and returns a compressed JPEG base64 string.
 */
export async function processAndCompressImage(
  file: File,
  maxWidth = 1080,
  maxHeight = 1920,
  quality = 0.85
): Promise<{ base64: string; width: number; height: number; aspectRatio: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate scaling ratio to constrain within 1080px x 1920px
        if (width > maxWidth || height > maxHeight) {
          const widthRatio = maxWidth / width;
          const heightRatio = maxHeight / height;
          const ratio = Math.min(widthRatio, heightRatio);

          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get 2d context from canvas'));
          return;
        }

        // Draw smooth resized image
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Convert canvas to compressed JPEG base64 string
        const base64 = canvas.toDataURL('image/jpeg', quality);
        const aspectRatio = width / height;

        resolve({ base64, width, height, aspectRatio });
      };

      img.onerror = (err) => reject(err);
      img.src = e.target?.result as string;
    };

    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/**
 * Utility to calculate relative time string (e.g. "2h ago", "15m ago", "Just now")
 */
export function formatRelativeTime(timestamp: number, simulatedOffsetMs = 0): string {
  const now = Date.now() + simulatedOffsetMs;
  const diffMs = Math.max(0, now - timestamp);
  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}
