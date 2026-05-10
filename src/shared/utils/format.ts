export const formattedDate = (date: Date) =>
  date.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

export const formattedTime = (date: Date) =>
  date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });
