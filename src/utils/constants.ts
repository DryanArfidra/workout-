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
  'chest-triceps': 'Dada & Trisep',
  'core': 'Perut (Core)',
  'legs-glutes': 'Kaki & Bokong',
  'shoulders-back': 'Bahu & Punggung',
  'full-body-light': 'Full Body Ringan',
  'core-stretching': 'Core + Stretching',
  'full-workout': 'FULL OLAHRAGA'
};

export const WORKOUT_DETAILS: Record<string, {
  day: string;
  duration: number;
  exercises: string[];
  workTime: number;
  restTime: number;
  rounds: number;
  focus?: string;
}> = {
  'chest-triceps': {
    day: 'Senin',
    duration: 10,
    exercises: ['Push-up biasa', 'Push-up lutut', 'Diamond push-up', 'Plank shoulder tap'],
    workTime: 40,
    restTime: 20,
    rounds: 2
  },
  'core': {
    day: 'Selasa',
    duration: 10,
    exercises: ['Sit-up', 'Leg raise', 'Russian twist', 'Plank'],
    workTime: 40,
    restTime: 20,
    rounds: 2
  },
  'legs-glutes': {
    day: 'Rabu',
    duration: 10,
    exercises: ['Squat', 'Lunges kanan & kiri', 'Wall sit', 'Calf raise'],
    workTime: 40,
    restTime: 20,
    rounds: 2
  },
  'shoulders-back': {
    day: 'Kamis',
    duration: 10,
    exercises: ['Arm circle', 'Push-up lebar', 'Superman hold', 'Plank raise'],
    workTime: 40,
    restTime: 20,
    rounds: 2
  },
  'full-body-light': {
    day: 'Jumat',
    duration: 10,
    exercises: ['Jumping jack', 'Squat', 'Push-up ringan', 'Plank'],
    workTime: 40,
    restTime: 20,
    rounds: 2,
    focus: 'Tidak terlalu berat (aktif recovery)'
  },
  'core-stretching': {
    day: 'Sabtu',
    duration: 10,
    exercises: ['Plank', 'Mountain climber pelan', 'Stretch paha, punggung, bahu'],
    workTime: 30,
    restTime: 30,
    rounds: 2,
    focus: 'Fokus pemulihan'
  },
  'full-workout': {
    day: 'Minggu',
    duration: 40,
    exercises: [
      'Pemanasan (5 menit) - Jumping jack ringan, Arm & leg swing',
      'Workout utama (20–25 menit) - Push-up, Squat, Lunges, Sit-up, Mountain climber, Plank',
      'Pendinginan (5–10 menit) - Stretch seluruh badan'
    ],
    workTime: 40,
    restTime: 20,
    rounds: 4,
    focus: 'FULL OLAHRAGA'
  }
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