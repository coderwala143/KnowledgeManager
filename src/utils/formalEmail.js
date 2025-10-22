// utils/formatEmail.js
export const formatEmail = (name) => {
  if (!name) return null;

  // Trim and normalize
  const cleaned = name.trim().toLowerCase();

  // Replace multiple spaces or special chars with single dot
  const formatted = cleaned.replace(/\s+/g, '.').replace(/[^a-z.]/g, '');

  return `${formatted}@grazitti.com`;
};
