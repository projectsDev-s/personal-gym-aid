import { Card } from "@/components/ui/card";
import { WorkoutDay } from "@/types/student";
import { cn } from "@/lib/utils";

interface WorkoutCardProps {
  workout: WorkoutDay;
  label: string;
}

const colorClasses = {
  orange: "bg-vibrant-orange text-vibrant-orange-foreground",
  green: "bg-vibrant-green text-vibrant-green-foreground",
  purple: "bg-vibrant-purple text-vibrant-purple-foreground",
  red: "bg-vibrant-red text-vibrant-red-foreground",
};

export const WorkoutCard = ({ workout, label }: WorkoutCardProps) => {
  return (
    <Card className="overflow-hidden border-2 hover:shadow-xl transition-all duration-300">
      <div className={cn("p-4", colorClasses[workout.color])}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <span className="text-2xl font-black font-display">{label}</span>
            </div>
            <h3 className="text-xl font-black font-display uppercase">
              {workout.name}
            </h3>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="space-y-3">
          {workout.exercises.map((exercise) => (
            <div
              key={exercise.id}
              className="border-l-4 border-primary/20 pl-4 py-2 hover:border-primary/60 transition-colors"
            >
              <div className="flex justify-between items-start gap-4">
                <p className="font-semibold text-sm flex-1">{exercise.name}</p>
                <div className="flex gap-3 text-xs text-muted-foreground">
                  <span className="font-medium">
                    {exercise.series}
                  </span>
                  <span className="font-medium">
                    {exercise.cadence}
                  </span>
                </div>
              </div>
              {exercise.methods && (
                <p className="text-xs text-muted-foreground mt-1 italic">
                  {exercise.methods}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
