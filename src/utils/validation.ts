export const validateUsername = (username: string): string => {
  if (!username || username.trim().length < 3) {
    return 'Username minimal 3 karakter';
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return 'Username hanya boleh mengandung huruf, angka, dan underscore';
  }
  return '';
};

export const validatePassword = (password: string): string => {
  if (!password || password.length < 6) {
    return 'Password minimal 6 karakter';
  }
  return '';
};

export const validateEmail = (email: string): string => {
  if (!email) return '';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Email tidak valid';
  }
  return '';
};

export const validateAmount = (amount: string): string => {
  if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
    return 'Jumlah harus lebih dari 0';
  }
  return '';
};

export const validateBio = (bio: string): string => {
  if (bio && bio.length > 200) {
    return 'Bio maksimal 200 karakter';
  }
  return '';
};