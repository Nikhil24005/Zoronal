export function formatDate(value, locale = 'en-US') {
  const date = value instanceof Date ? value : new Date(value);

  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}
