import { WorkoutDay } from "@/types/student";

interface WorkoutCardProps {
  workout: WorkoutDay;
  label: string;
}

export const WorkoutCard = ({ workout, label }: WorkoutCardProps) => {
  // Split exercises into two columns
  const midPoint = Math.ceil(workout.exercises.length / 2);
  const leftExercises = workout.exercises.slice(0, midPoint);
  const rightExercises = workout.exercises.slice(midPoint);

  return (
    <div className="flex rounded-lg overflow-hidden border-2 border-border bg-card shadow-lg">
      {/* Left colored bar with label - Always Orange */}
      <div className="w-16 flex-shrink-0 flex flex-col items-center justify-center bg-vibrant-orange">
        <span className="text-white font-black text-xs tracking-wider writing-vertical">TREINO</span>
        <span className="text-white font-black text-3xl mt-1">{label}</span>
      </div>

      {/* Content area */}
      <div className="flex-1 p-4">
        {/* Header with workout name - Always Orange */}
        <div className="px-3 py-2 rounded-md mb-4 inline-block bg-vibrant-orange">
          <h3 className="text-white font-black text-sm uppercase tracking-wide">
            {workout.name}
          </h3>
        </div>

        {/* Two-column exercise list */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs">
          <div className="space-y-1">
            {leftExercises.map((exercise) => (
              <div key={exercise.id} className="flex items-start gap-2">
                <span className="text-muted-foreground">•</span>
                <div className="flex-1">
                  <span className="font-medium text-foreground">{exercise.name}:</span>
                  <span className="text-muted-foreground ml-1">{exercise.series}</span>
                  {exercise.methods && (
                    <span className="text-muted-foreground/70 italic block text-[10px]">{exercise.methods}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-1">
            {rightExercises.map((exercise) => (
              <div key={exercise.id} className="flex items-start gap-2">
                <span className="text-muted-foreground">•</span>
                <div className="flex-1">
                  <span className="font-medium text-foreground">{exercise.name}:</span>
                  <span className="text-muted-foreground ml-1">{exercise.series}</span>
                  {exercise.methods && (
                    <span className="text-muted-foreground/70 italic block text-[10px]">{exercise.methods}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
