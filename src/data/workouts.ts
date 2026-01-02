import type { WorkoutDay } from '../types';

export const workoutData: WorkoutDay[] = [
  {
    id: 1,
    day: 'Senin',
    title: 'Upper Body',
    duration: '10-15 menit',
    isSunday: false,
    targetDuration: { min: 10, max: 15 },
    completed: false,
    exercises: [
      {
        id: 1,
        name: 'Push Up',
        sets: 3,
        reps: '10 repetisi',
        duration: '2-3 menit',
        tips: 'Jaga tubuh lurus, turunkan dada hampir menyentuh lantai',
        beginnerFriendly: true
      },
      {
        id: 2,
        name: 'Knee Push Up',
        sets: 2,
        reps: '10 repetisi',
        duration: '2 menit',
        tips: 'Lutut menyentuh lantai, fokus pada bentuk yang benar',
        beginnerFriendly: true
      },
      {
        id: 3,
        name: 'Plank',
        sets: 3,
        reps: '30 detik',
        duration: '2-3 menit',
        tips: 'Kencangkan perut, jangan angkat pantat terlalu tinggi',
        beginnerFriendly: true
      }
    ]
  },
  {
    id: 2,
    day: 'Selasa',
    title: 'Lower Body',
    duration: '10-15 menit',
    isSunday: false,
    targetDuration: { min: 10, max: 15 },
    completed: false,
    exercises: [
      {
        id: 4,
        name: 'Squat',
        sets: 3,
        reps: '15 repetisi',
        duration: '3-4 menit',
        tips: 'Dada tegap, turun seperti mau duduk di kursi',
        beginnerFriendly: true
      },
      {
        id: 5,
        name: 'Reverse Lunge',
        sets: 2,
        reps: '10 per kaki',
        duration: '3 menit',
        tips: 'Langkah mundur, jaga lutut depan di atas pergelangan kaki',
        beginnerFriendly: true
      },
      {
        id: 6,
        name: 'Wall Sit',
        sets: 2,
        reps: '30 detik',
        duration: '2-3 menit',
        tips: 'Punggung rata di tembok, paha sejajar lantai',
        beginnerFriendly: true
      }
    ]
  },
  {
    id: 3,
    day: 'Rabu',
    title: 'Core & Light Cardio',
    duration: '10 menit',
    isSunday: false,
    targetDuration: { min: 10, max: 10 },
    completed: false,
    exercises: [
      {
        id: 7,
        name: 'Plank',
        sets: 3,
        reps: '30 detik',
        duration: '2-3 menit',
        tips: 'Variasi: Plank dengan sentuhan bahu',
        beginnerFriendly: true
      },
      {
        id: 8,
        name: 'Mountain Climber',
        sets: 3,
        reps: '20 repetisi',
        duration: '3 menit',
        tips: 'Jaga perut kencang, gerakan terkontrol',
        beginnerFriendly: true
      },
      {
        id: 9,
        name: 'Jumping Jack',
        sets: 2,
        reps: '30 repetisi',
        duration: '2-3 menit',
        tips: 'Mulai perlahan, fokus pada pernapasan',
        beginnerFriendly: true
      }
    ]
  },
  {
    id: 4,
    day: 'Kamis',
    title: 'Upper Body',
    duration: '10-15 menit',
    isSunday: false,
    targetDuration: { min: 10, max: 15 },
    completed: false,
    exercises: [
      {
        id: 10,
        name: 'Push Up',
        sets: 3,
        reps: '12 repetisi',
        duration: '3-4 menit',
        tips: 'Tingkatkan jumlah jika memungkinkan',
        beginnerFriendly: true
      },
      {
        id: 11,
        name: 'Pike Push Up',
        sets: 3,
        reps: '8 repetisi',
        duration: '3 menit',
        tips: 'Bentuk V terbalik, fokus pada bahu',
        beginnerFriendly: true
      },
      {
        id: 12,
        name: 'Negative Pull Up',
        sets: 3,
        reps: '3 repetisi',
        duration: '3-4 menit',
        tips: 'Naik dengan bantuan, turun perlahan 5 detik',
        beginnerFriendly: false
      }
    ]
  },
  {
    id: 5,
    day: 'Jumat',
    title: 'Full Body Ringan',
    duration: '10 menit',
    isSunday: false,
    targetDuration: { min: 10, max: 10 },
    completed: false,
    exercises: [
      {
        id: 13,
        name: 'Squat',
        sets: 2,
        reps: '15 repetisi',
        duration: '2-3 menit',
        tips: 'Perlahan dan terkontrol',
        beginnerFriendly: true
      },
      {
        id: 14,
        name: 'Push Up',
        sets: 2,
        reps: '10 repetisi',
        duration: '2-3 menit',
        tips: 'Variasi: Diamond push up jika kuat',
        beginnerFriendly: true
      },
      {
        id: 15,
        name: 'Plank',
        sets: 2,
        reps: '30 detik',
        duration: '2 menit',
        tips: 'Tahan bentuk sempurna',
        beginnerFriendly: true
      }
    ]
  },
  {
    id: 6,
    day: 'Sabtu',
    title: 'Cardio & Fat Burn',
    duration: '15-20 menit',
    isSunday: false,
    targetDuration: { min: 15, max: 20 },
    completed: false,
    exercises: [
      {
        id: 16,
        name: 'Jumping Jack',
        sets: 3,
        reps: '40 repetisi',
        duration: '4-5 menit',
        tips: 'Tingkatkan intensitas secara bertahap',
        beginnerFriendly: true
      },
      {
        id: 17,
        name: 'High Knees',
        sets: 3,
        reps: '30 detik',
        duration: '4-5 menit',
        tips: 'Angkat lutut setinggi pinggang',
        beginnerFriendly: true
      },
      {
        id: 18,
        name: 'Bodyweight Squat',
        sets: 3,
        reps: '20 repetisi',
        duration: '4-5 menit',
        tips: 'Fokus pada bentuk, bukan kecepatan',
        beginnerFriendly: true
      }
    ]
  },
  {
    id: 7,
    day: 'Minggu',
    title: 'FULL BODY EXTREME',
    duration: '30-40 menit',
    isSunday: true,
    targetDuration: { min: 30, max: 40 },
    completed: false,
    exercises: [
      {
        id: 19,
        name: 'Push Up',
        sets: 4,
        reps: '12-15 repetisi',
        duration: '5-6 menit',
        tips: 'Istirahat 60 detik antar set',
        beginnerFriendly: false
      },
      {
        id: 20,
        name: 'Pull Up / Negative',
        sets: 4,
        reps: '3-5 repetisi',
        duration: '6-8 menit',
        tips: 'Gunakan resistance band jika perlu',
        beginnerFriendly: false
      },
      {
        id: 21,
        name: 'Squat',
        sets: 4,
        reps: '20 repetisi',
        duration: '5-6 menit',
        tips: 'Tambahkan jump squat untuk intensitas',
        beginnerFriendly: true
      },
      {
        id: 22,
        name: 'Lunge',
        sets: 3,
        reps: '12 per kaki',
        duration: '5-6 menit',
        tips: 'Lakukan dengan beban tubuh atau dumbbell',
        beginnerFriendly: true
      },
      {
        id: 23,
        name: 'Plank',
        sets: 3,
        reps: '45 detik',
        duration: '3-4 menit',
        tips: 'Variasi side plank untuk tantangan',
        beginnerFriendly: true
      },
      {
        id: 24,
        name: 'Jumping Jack',
        sets: 3,
        reps: '50 repetisi',
        duration: '4-5 menit',
        tips: 'Tingkatkan kecepatan bertahap',
        beginnerFriendly: true
      },
      {
        id: 25,
        name: 'Wall Sit',
        sets: 1,
        reps: '60 detik',
        duration: '1-2 menit',
        tips: 'Tahan sampai failure, istirahat 30 detik ulangi',
        beginnerFriendly: false
      }
    ]
  }
];

export const motivationalQuotes = [
  "The only bad workout is the one that didn't happen.",
  "Don't wish for a good body, work for it.",
  "Your body can stand almost anything. It's your mind you have to convince.",
  "Progress takes time. Be patient and consistent.",
  "Small daily improvements are the key to staggering long-term results."
];