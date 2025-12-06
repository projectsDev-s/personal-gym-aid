import { WorkoutDay } from "@/types/student";
import logo from "@/assets/logo";

interface PDFWorkoutsPageProps {
  workouts: WorkoutDay[];
}

const workoutLabels = ["A", "B", "C", "D", "E", "F"];

export const PDFWorkoutsPage = ({ workouts }: PDFWorkoutsPageProps) => {
  // Divide exercises into two columns
  const splitExercises = (exercises: typeof workouts[0]['exercises']) => {
    const mid = Math.ceil(exercises.length / 2);
    return [exercises.slice(0, mid), exercises.slice(mid)];
  };

  return (
    <div className="min-h-[297mm] bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 p-12 relative flex flex-col text-white">
      {/* Logo and Title at top */}
      <div className="flex flex-col items-center mb-8">
        <img 
          src={logo} 
          alt="Logo" 
          className="w-40 h-auto opacity-90 mb-8"
        />
        <h1 className="text-3xl font-black text-center mb-6 tracking-wider text-white uppercase border-b-2 border-orange-500 pb-2 w-full">
          TREINOS
        </h1>
      </div>

      {/* Workout Cards - Centered vertically in remaining space */}
      <div className="flex-1 flex flex-col justify-center min-h-0">
        <div className="space-y-3 w-full">
        {workouts.map((workout, index) => {
          const [leftExercises, rightExercises] = splitExercises(workout.exercises);
          
          return (
            <div 
              key={workout.id} 
              className="bg-white rounded-lg shadow-sm overflow-hidden flex"
            >
              {/* Left Vertical Orange Strip */}
              <div className="bg-orange-500 w-14 flex flex-col items-center justify-center py-3 px-1.5">
                <div className="flex flex-col items-center mb-3">
                  {"TREINO".split("").map((letter, i) => (
                    <span key={i} className="text-white font-black text-xs uppercase tracking-wider">
                      {letter}
                    </span>
                  ))}
                </div>
                <div className="text-white font-black text-4xl">
                  {workoutLabels[index]}
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1 flex flex-col">
                {/* Orange Header */}
                <div className="bg-orange-500 px-4 py-2.5">
                  <h3 className="text-white font-black text-base uppercase">
                    {workout.name}
                  </h3>
                </div>

                {/* Exercises in Two Columns */}
                <div className="bg-white px-4 py-3 flex gap-5">
                  {/* Left Column */}
                  <div className="flex-1 space-y-2.5">
                    {leftExercises.map((exercise) => (
                      <div key={exercise.id} className="space-y-0.5">
                        <div className="flex items-start gap-2">
                          <span className="text-orange-500 font-bold text-sm mt-0.5">•</span>
                          <span className="text-gray-900 font-medium text-sm flex-1 leading-tight">
                            {exercise.name}: {exercise.series}
                          </span>
                        </div>
                        {exercise.methods && (
                          <p className="text-gray-500 text-xs italic ml-5 leading-tight">
                            {exercise.methods}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Right Column */}
                  <div className="flex-1 space-y-2.5">
                    {rightExercises.map((exercise) => (
                      <div key={exercise.id} className="space-y-0.5">
                        <div className="flex items-start gap-2">
                          <span className="text-orange-500 font-bold text-sm mt-0.5">•</span>
                          <span className="text-gray-900 font-medium text-sm flex-1 leading-tight">
                            {exercise.name}: {exercise.series}
                          </span>
                        </div>
                        {exercise.methods && (
                          <p className="text-gray-500 text-xs italic ml-5 leading-tight">
                            {exercise.methods}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        </div>
      </div>
    </div>
  );
};
