export interface Student {
  id: string;
  name: string;
  age: number;
  gender: "M" | "F" | "Outro";
  objective: string;
  weight?: number;
  bodyFat?: number;
  muscleMass?: number;
  bmi?: number;
  restrictions?: string;
  createdAt: Date;
}

export interface Exercise {
  id: string;
  name: string;
  series: string;
  cadence: string;
  methods?: string;
}

export interface WorkoutDay {
  id: string;
  name: string;
  exercises: Exercise[];
  color: "orange" | "green" | "purple" | "red";
}

export interface WorkoutPlan {
  id: string;
  studentId: string;
  studentName: string;
  weekSchedule: {
    day1: string;
    day2: string;
    day3: string;
    day4: string;
    day5: string;
  };
  weeklyReps: {
    week1: { reps: string; rest: string };
    week2: { reps: string; rest: string };
    week3: { reps: string; rest: string };
    week4: { reps: string; rest: string };
  };
  workoutDays: WorkoutDay[];
  createdAt: Date;
}
