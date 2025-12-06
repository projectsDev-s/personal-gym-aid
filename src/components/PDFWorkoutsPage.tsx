import { WorkoutDay } from "@/types/student";
import logoSteven from "@/assets/logo-steven.png";

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
    <div className="h-[297mm] w-[210mm] bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 p-8 relative flex flex-col items-center justify-center">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl"></div>
      
      {/* Logo centered */}
      <div className="absolute top-1/2 left-1/2" style={{ transform: 'translate(-50%, -50%)', zIndex: 0, pointerEvents: 'none' }}>
        <img 
          src={logoSteven} 
          alt="Steven Cardoso Logo" 
          className="w-48 h-auto opacity-20"
        />
      </div>

      {/* Workout Cards - Centered vertically */}
      <div className="space-y-3 relative" style={{ zIndex: 10, width: '100%' }}>
        {workouts.map((workout, index) => {
          const [leftExercises, rightExercises] = splitExercises(workout.exercises);
          
          return (
            <div 
              key={workout.id} 
              className="bg-white rounded-lg shadow-sm overflow-hidden flex"
            >
              {/* Left Vertical Orange Strip */}
              <div className="bg-orange-500 w-14 flex flex-col items-center justify-start py-3 px-1.5">
                <div 
                  className="text-white font-black text-xs uppercase tracking-wider mb-3"
                  style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
                >
                  TREINO
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
  );
};
