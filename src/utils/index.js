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
