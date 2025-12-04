import { WorkoutDay } from "@/types/student";

interface PDFWorkoutsPageProps {
  workouts: WorkoutDay[];
}

const colorMap = {
  orange: "#f97316",
  green: "#22c55e",
  purple: "#a855f7",
  red: "#ef4444",
};

const workoutLabels = ["A", "B", "C", "D", "E", "F"];

export const PDFWorkoutsPage = ({ workouts }: PDFWorkoutsPageProps) => {
  return (
    <div className="min-h-[297mm] w-[210mm] bg-gray-100 p-8">
      {/* Title */}
      <h1 className="text-3xl font-black text-center mb-8 tracking-wider text-gray-800">
        TREINOS
      </h1>

      {/* Workout Cards */}
      <div className="space-y-6">
        {workouts.map((workout, index) => (
          <div key={workout.id} className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-300">
            {/* Header */}
            <div 
              className="px-4 py-3 flex items-center gap-4"
              style={{ backgroundColor: colorMap[workout.color] }}
            >
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-sm">TREINO</span>
                <span className="text-white font-black text-2xl">{workoutLabels[index]}</span>
              </div>
              <span className="text-white font-bold text-sm uppercase">
                {workout.name}
              </span>
            </div>

            {/* Exercise Table */}
            <table className="w-full text-sm">
              <thead className="bg-gray-200">
                <tr>
                  <th className="text-left px-4 py-2 font-bold text-gray-700 border-b border-gray-300">EXERCÍCIO</th>
                  <th className="text-center px-4 py-2 font-bold text-gray-700 border-b border-gray-300 w-24">SÉRIES</th>
                  <th className="text-center px-4 py-2 font-bold text-gray-700 border-b border-gray-300 w-28">CADÊNCIA</th>
                  <th className="text-left px-4 py-2 font-bold text-gray-700 border-b border-gray-300">MÉTODO</th>
                </tr>
              </thead>
              <tbody>
                {workout.exercises.map((exercise, exIndex) => (
                  <tr 
                    key={exercise.id} 
                    className={exIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                  >
                    <td className="px-4 py-2 font-medium text-gray-800 border-b border-gray-200">
                      {exercise.name}
                    </td>
                    <td className="px-4 py-2 text-center text-gray-700 border-b border-gray-200">
                      {exercise.series}
                    </td>
                    <td className="px-4 py-2 text-center text-gray-700 border-b border-gray-200">
                      {exercise.cadence}
                    </td>
                    <td className="px-4 py-2 text-gray-600 text-xs italic border-b border-gray-200">
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
