import { Student } from "@/types/student";

interface PDFStudentInfoPageProps {
  student: Partial<Student>;
  weekSchedule: string[];
  weeklyReps: Array<{ reps: string; rest: string }>;
}

export const PDFStudentInfoPage = ({ student, weekSchedule, weeklyReps }: PDFStudentInfoPageProps) => {
  return (
    <div className="min-h-[297mm] w-[210mm] bg-gray-100 p-8 text-gray-800">
      {/* Student Info Table */}
      <div className="mb-8">
        <div className="border-2 border-gray-400 bg-white">
          {/* Name row */}
          <div className="border-b-2 border-gray-400 p-2 text-center">
            <span className="text-xs text-gray-500">NOME: </span>
            <span className="font-bold text-lg">{student.name?.toUpperCase()}</span>
          </div>
          
          {/* Info grid */}
          <div className="grid grid-cols-5">
            <div className="border-r-2 border-gray-400 p-2 text-center">
              <span className="text-xs text-gray-500">IDADE: </span>
              <span className="font-semibold">{student.age || "-"}</span>
            </div>
            <div className="border-r-2 border-gray-400 p-2 text-center">
              <span className="text-xs text-gray-500">OBJETIVO: </span>
              <span className="font-semibold text-sm">{student.objective?.toUpperCase() || "-"}</span>
            </div>
            <div className="border-r-2 border-gray-400 p-2 text-center">
              <span className="text-xs text-gray-500">GÊNERO: </span>
              <span className="font-semibold">{student.gender || "-"}</span>
            </div>
            <div className="border-r-2 border-gray-400 p-2 text-center">
              <span className="text-xs text-gray-500">PESO: </span>
              <span className="font-semibold">{student.weight ? `${student.weight}kg` : "-"}</span>
            </div>
            <div className="p-2 text-center">
              <span className="text-xs text-gray-500">% GORD: </span>
              <span className="font-semibold">{student.bodyFat ? `${student.bodyFat}%` : "-"}</span>
            </div>
          </div>
          
          {/* Second row */}
          <div className="grid grid-cols-3 border-t-2 border-gray-400">
            <div className="border-r-2 border-gray-400 p-2 text-center">
              <span className="text-xs text-gray-500">% MASSA: </span>
              <span className="font-semibold">{student.muscleMass ? `${student.muscleMass}%` : "-"}</span>
            </div>
            <div className="border-r-2 border-gray-400 p-2 text-center">
              <span className="text-xs text-gray-500">IMC: </span>
              <span className="font-semibold">{student.bmi || "-"}</span>
            </div>
            <div className="p-2 text-center">
              <span className="text-xs text-gray-500">OBS: </span>
              <span className="font-semibold text-sm">{student.restrictions?.toUpperCase() || "SEM RESTRIÇÕES"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Schedule */}
      <div className="mb-8">
        <h2 className="text-2xl font-black text-center mb-6 tracking-wide">SEMANAS 1,2,3-4</h2>
        <div className="flex justify-center">
          <div className="inline-flex border-2 border-gray-400 bg-white">
            {weekSchedule.map((day, index) => (
              <div 
                key={index} 
                className={`text-center px-6 py-3 ${index < weekSchedule.length - 1 ? 'border-r-2 border-gray-400' : ''}`}
              >
                <p className="text-xs font-bold text-gray-600 mb-1">{index + 1}º DIA</p>
                <p className="font-bold text-sm">{day?.toUpperCase() || "-"}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weekly Repetitions */}
      <div>
        <h2 className="text-2xl font-black text-center mb-6 tracking-wide">REPETIÇÕES SEMANAIS 1,2,3-4</h2>
        <div className="flex justify-center">
          <div className="inline-flex border-2 border-gray-400 bg-white">
            {weeklyReps.map((week, index) => (
              <div 
                key={index} 
                className={`text-center px-8 py-3 ${index < weeklyReps.length - 1 ? 'border-r-2 border-gray-400' : ''}`}
              >
                <p className="text-xs font-bold text-gray-600 mb-1 underline">SEM. {index + 1}</p>
                <p className="font-bold">{week.reps || "-"} REPS</p>
                <p className="text-xs text-gray-600 underline">{week.rest || "-"} DESC.</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
