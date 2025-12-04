import { Student } from "@/types/student";

interface PDFStudentInfoPageProps {
  student: Partial<Student>;
  weekSchedule: string[];
  weeklyReps: Array<{ reps: string; rest: string }>;
}

export const PDFStudentInfoPage = ({ student, weekSchedule, weeklyReps }: PDFStudentInfoPageProps) => {
  return (
    <div className="min-h-[297mm] w-[210mm] bg-slate-700 p-8">
      {/* Student Info Cards */}
      <div className="mb-10">
        {/* Name Card */}
        <div className="bg-white rounded-lg shadow-lg mb-4 overflow-hidden">
          <div className="p-4 text-center border-b border-gray-200">
            <span className="text-xs text-gray-500 uppercase tracking-wide">NOME: </span>
            <span className="font-black text-xl text-slate-800">{student.name?.toUpperCase()}</span>
          </div>
          
          {/* Info grid row 1 */}
          <div className="grid grid-cols-5 divide-x divide-gray-200">
            <div className="p-3 text-center">
              <p className="text-xs text-gray-500 uppercase mb-1">IDADE</p>
              <p className="font-bold text-slate-800">{student.age || "-"}</p>
            </div>
            <div className="p-3 text-center">
              <p className="text-xs text-gray-500 uppercase mb-1">OBJETIVO</p>
              <p className="font-bold text-slate-800 text-sm">{student.objective?.toUpperCase() || "-"}</p>
            </div>
            <div className="p-3 text-center">
              <p className="text-xs text-gray-500 uppercase mb-1">GÊNERO</p>
              <p className="font-bold text-slate-800">{student.gender || "-"}</p>
            </div>
            <div className="p-3 text-center">
              <p className="text-xs text-gray-500 uppercase mb-1">PESO</p>
              <p className="font-bold text-slate-800">{student.weight ? `${student.weight}kg` : "-"}</p>
            </div>
            <div className="p-3 text-center">
              <p className="text-xs text-gray-500 uppercase mb-1">% GORD</p>
              <p className="font-bold text-slate-800">{student.bodyFat ? `${student.bodyFat}%` : "-"}</p>
            </div>
          </div>
          
          {/* Info grid row 2 */}
          <div className="grid grid-cols-3 divide-x divide-gray-200 border-t border-gray-200">
            <div className="p-3 text-center">
              <p className="text-xs text-gray-500 uppercase mb-1">% MASSA</p>
              <p className="font-bold text-slate-800">{student.muscleMass ? `${student.muscleMass}%` : "-"}</p>
            </div>
            <div className="p-3 text-center">
              <p className="text-xs text-gray-500 uppercase mb-1">IMC</p>
              <p className="font-bold text-slate-800">{student.bmi || "-"}</p>
            </div>
            <div className="p-3 text-center">
              <p className="text-xs text-gray-500 uppercase mb-1">OBS</p>
              <p className="font-bold text-slate-800 text-sm">{student.restrictions?.toUpperCase() || "SEM RESTRIÇÕES"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Schedule */}
      <div className="mb-10">
        <h2 className="text-2xl font-black text-center mb-6 tracking-wide text-white">SEMANAS 1,2,3-4</h2>
        <div className="grid grid-cols-5 gap-3">
          {weekSchedule.map((day, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-3 text-center">
                <p className="text-xs font-bold text-gray-500 uppercase mb-2">{index + 1}º DIA</p>
                <p className="font-bold text-slate-800 text-sm">{day?.toUpperCase() || "-"}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Repetitions */}
      <div>
        <h2 className="text-2xl font-black text-center mb-6 tracking-wide text-white">REPETIÇÕES SEMANAIS 1,2,3-4</h2>
        <div className="grid grid-cols-4 gap-3">
          {weeklyReps.map((week, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-4 text-center">
                <p className="text-xs font-bold text-gray-500 uppercase underline mb-2">SEM. {index + 1}</p>
                <p className="font-bold text-slate-800">{week.reps || "-"} REPS</p>
                <p className="text-xs text-gray-500 underline mt-1">{week.rest || "-"} DESC.</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
