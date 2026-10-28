/**
 * Input validation helpers
 */
export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
};

export const isValidPhone = (phone) => {
  if (!phone || typeof phone !== 'string') return false;
  // Allow digits, spaces, plus, hyphens, parentheses (min 7 digits)
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 15;
};

export const isValidPassword = (password) => {
  return typeof password === 'string' && password.length >= 6;
};

export const sanitizeText = (text) => {
  return typeof text === 'string' ? text.trim() : '';
};
