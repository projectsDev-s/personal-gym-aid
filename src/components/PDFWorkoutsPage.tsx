import { WorkoutDay } from "@/types/student";

interface PDFWorkoutsPageProps {
  workouts: WorkoutDay[];
}

const workoutLabels = ["A", "B", "C", "D", "E", "F"];

export const PDFWorkoutsPage = ({ workouts }: PDFWorkoutsPageProps) => {
  return (
    <div className="min-h-[297mm] w-[210mm] bg-slate-700 p-8">
      {/* Title */}
      <h1 className="text-3xl font-black text-center mb-8 tracking-wider text-white">
        TREINOS
      </h1>

      {/* Workout Cards */}
      <div className="space-y-6">
        {workouts.map((workout, index) => (
          <div key={workout.id} className="bg-white rounded-lg overflow-hidden shadow-lg">
            {/* Header - Always Orange */}
            <div className="bg-orange-500 px-4 py-3 flex items-center gap-3">
              <span className="text-white font-bold text-sm">TREINO</span>
              <span className="text-white font-black text-2xl">{workoutLabels[index]}</span>
              <span className="text-white font-bold text-sm uppercase ml-2">
                {workout.name}
              </span>
            </div>

            {/* Exercise Table */}
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left px-4 py-2 font-bold text-gray-700 w-[45%]">EXERCÍCIO</th>
                  <th className="text-center px-4 py-2 font-bold text-gray-700 w-[15%]">SÉRIES</th>
                  <th className="text-center px-4 py-2 font-bold text-gray-700 w-[15%]">CADÊNCIA</th>
                  <th className="text-center px-4 py-2 font-bold text-gray-700 w-[25%]">MÉTODO</th>
                </tr>
              </thead>
              <tbody>
                {workout.exercises.map((exercise, exIndex) => (
                  <tr 
                    key={exercise.id} 
                    className={exIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                  >
                    <td className="px-4 py-2 font-medium text-gray-800 border-b border-gray-100">
                      {exercise.name}
                    </td>
                    <td className="px-4 py-2 text-center text-gray-700 border-b border-gray-100">
                      {exercise.series}
                    </td>
                    <td className="px-4 py-2 text-center text-gray-700 border-b border-gray-100">
                      {exercise.cadence}
                    </td>
                    <td className="px-4 py-2 text-center text-gray-600 text-xs italic border-b border-gray-100">
                      {exercise.methods || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
};
