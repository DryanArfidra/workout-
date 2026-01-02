export interface Exercise {
  id: number;
  name: string;
  sets: number;
  reps: string;
  duration: string;
  tips: string;
  beginnerFriendly: boolean;
}

export interface WorkoutDay {
  id: number;
  day: string;
  title: string;
  duration: string;
  exercises: Exercise[];
  completed: boolean;
  isSunday: boolean;
  targetDuration: {
    min: number;
    max: number;
  };
}

export interface ProgressData {
  dayId: number;
  completed: boolean;
  completedExercises: number[];
}