/**
 * Format a date string to human-readable format
 * Examples:
 * - "Today at 2:30 PM"
 * - "Yesterday at 10:15 AM"
 * - "Dec 25 at 3:45 PM"
 * - "Jan 1, 2024 at 9:00 AM"
 */
export function formatPhotoDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();

  // Reset time to midnight for date comparison
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const photoDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );

  // Format time (e.g., "2:30 PM")
  const timeString = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  // Check if today
  if (photoDate.getTime() === today.getTime()) {
    return `Today at ${timeString}`;
  }

  // Check if yesterday
  if (photoDate.getTime() === yesterday.getTime()) {
    return `Yesterday at ${timeString}`;
  }

  // Check if this year
  if (date.getFullYear() === now.getFullYear()) {
    const monthDay = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    return `${monthDay} at ${timeString}`;
  }

  // Different year
  const fullDate = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return `${fullDate} at ${timeString}`;
}

/**
 * Helper: Get image dimensions
 */
export function getImageDimensions(
  file: File,
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.width, height: img.height });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };

    img.src = url;
  });
}
