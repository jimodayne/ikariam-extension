export function parseFloatUtils(text) {
  return parseFloat(text.replace(/,/g, '').trim()) || 0;
}

export function formatNumberToDisplay(value) {
  // For example 245000 becomes 245K
  const absValue = Math.abs(value);
  if (absValue >= 1e6) {
    return `${(Math.sign(value) * Math.round(absValue / 1e5)) / 10}M`;
  }
  if (absValue >= 1e3) {
    return `${(Math.sign(value) * Math.round(absValue / 1e2)) / 10}K`;
  }
  return value.toString();
}

export function logMessage(...args) {
  console.log(`[Ikariam Extension]`, ...args);
}

export function formatHoursToDisplay(hours) {
  if (hours === Infinity) return '∞';

  if (hours < 1) return 'less than 1 hour';

  if (hours < 24) {
    return `${Math.floor(hours)} hour${Math.floor(hours) !== 1 ? 's' : ''}`;
  }

  const days = Math.floor(hours / 24);
  const remainingHours = Math.floor(hours % 24);

  if (days === 1 && remainingHours === 0) {
    return '1 day';
  }

  if (days > 30) {
    const months = Math.floor(days / 30);
    const remainingDays = days % 30;
    if (remainingDays === 0) {
      return `${months} month${months > 1 ? 's' : ''}`;
    }
    return `${months} month${months > 1 ? 's' : ''} ${remainingDays} day${remainingDays > 1 ? 's' : ''}`;
  }

  if (remainingHours === 0) {
    return `${days} day${days > 1 ? 's' : ''}`;
  }

  return `${days} day${days > 1 ? 's' : ''} ${remainingHours} hour${remainingHours > 1 ? 's' : ''}`;
}
