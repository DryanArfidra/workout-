export const ISLAMIC_QUOTES = [
  "Sebaik-baik manusia adalah yang paling bermanfaat bagi orang lain.",
  "Barangsiapa yang tidak mensyukuri yang sedikit, maka ia tidak akan mampu mensyukuri sesuatu yang banyak.",
  "Allah tidak membebani seseorang melainkan sesuai dengan kesanggupannya.",
  "Sesungguhnya Allah lebih menyukai orang-orang yang berbuat baik.",
  "Janganlah kamu berduka cita, sesungguhnya Allah selalu bersama kita.",
  "Bersabarlah, karena kesabaran adalah suatu cahaya.",
  "Amal yang paling dicintai Allah adalah yang terus menerus meskipun sedikit.",
  "Ilmu tanpa amal seperti pohon tanpa buah.",
  "Kejujuran membawa kepada kebaikan, dan kebaikan membawa ke surga.",
  "Sesungguhnya setelah kesulitan ada kemudahan.",
];

export const WORKOUT_TRANSLATIONS: Record<string, string> = {
  pushup: 'Push Up',
  situp: 'Sit Up',
  squat: 'Squat',
  plank: 'Plank',
  jumping_jacks: 'Jumping Jacks',
};

export const TRANSACTION_CATEGORIES = {
  income: ['Gaji', 'Bonus', 'Hadiah', 'Lainnya'],
  expense: ['Makanan', 'Transportasi', 'Belanja', 'Hiburan', 'Kesehatan', 'Lainnya'],
};

export const AMALAN_TRANSLATIONS: Record<string, string> = {
  dzikirPagi: 'Dzikir Pagi',
  dzikirPetang: 'Dzikir Petang',
  tilawah: 'Tilawah Quran',
  sholatDhuha: 'Sholat Dhuha',
  sholatTahajud: 'Sholat Tahajud',
  sedekah: 'Sedekah',
};

export const getRandomQuote = (): string => {
  return ISLAMIC_QUOTES[Math.floor(Math.random() * ISLAMIC_QUOTES.length)];
};

export const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Selamat Pagi';
  if (hour < 15) return 'Selamat Siang';
  if (hour < 18) return 'Selamat Sore';
  return 'Selamat Malam';
};