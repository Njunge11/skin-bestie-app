/**
 * Get ordinal suffix for a day (1st, 2nd, 3rd, 4th, etc.)
 */
function getOrdinalSuffix(day: number): string {
  if (day > 3 && day < 21) return "th";
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

/**
 * Format a date to "Month Dayth, Year" format
 * Examples:
 * - "November 14th, 2025"
 * - "January 1st, 2024"
 * - "March 22nd, 2025"
 */
export function formatPhotoLabel(dateString: string): string {
  const date = new Date(dateString);
  const month = date.toLocaleDateString("en-US", { month: "long" });
  const day = date.getDate();
  const year = date.getFullYear();
  const suffix = getOrdinalSuffix(day);

  return `${month} ${day}${suffix}, ${year}`;
}

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
