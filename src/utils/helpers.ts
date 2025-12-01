export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const capitalizeFirst = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Formats a base64 string to a valid data URL for images
 * Handles cases where the base64 string may or may not have the data URL prefix
 */
export const formatBase64Image = (base64String: string | undefined): string | undefined => {
  if (!base64String) return undefined;

  // If it already has the data URL prefix, return as-is
  if (base64String.startsWith('data:image/')) {
    return base64String;
  }

  // If it's a regular URL (http/https), return as-is
  if (base64String.startsWith('http://') || base64String.startsWith('https://')) {
    return base64String;
  }

  // Otherwise, assume it's a raw base64 string and add the prefix
  // Default to jpeg, but you can make this more sophisticated if needed
  return `data:image/jpeg;base64,${base64String}`;
};
