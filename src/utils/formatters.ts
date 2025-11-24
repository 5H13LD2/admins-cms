export const formatDate = (date: Date | any): string => {
  if (!date) return 'N/A';

  let dateObj: Date;

  // Handle Firestore Timestamp
  if (date._seconds) {
    dateObj = new Date(date._seconds * 1000);
  } else if (date.toDate && typeof date.toDate === 'function') {
    dateObj = date.toDate();
  } else if (date instanceof Date) {
    dateObj = date;
  } else {
    dateObj = new Date(date);
  }

  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (date: Date | any): string => {
  if (!date) return 'N/A';

  let dateObj: Date;

  if (date._seconds) {
    dateObj = new Date(date._seconds * 1000);
  } else if (date.toDate && typeof date.toDate === 'function') {
    dateObj = date.toDate();
  } else if (date instanceof Date) {
    dateObj = date;
  } else {
    dateObj = new Date(date);
  }

  return dateObj.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
};

export const formatPercentage = (value: number): string => {
  return `${Math.round(value)}%`;
};

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('en-US').format(value);
};
