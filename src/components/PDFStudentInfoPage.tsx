import logoSteven from "@/assets/logo-steven.png";

interface PDFStudentInfoPageProps {
  weekSchedule: string[];
  weeklyReps: Array<{ reps: string; rest: string }>;
}

export const PDFStudentInfoPage = ({ weekSchedule, weeklyReps }: PDFStudentInfoPageProps) => {
  return (
    <div className="h-[297mm] w-[210mm] bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 p-8 relative flex flex-col justify-center">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl"></div>
      
      {/* Logo */}
      <div className="flex justify-center mb-6 relative z-10">
        <img 
          src={logoSteven} 
          alt="Steven Cardoso Logo" 
          className="w-40 h-auto opacity-90"
        />
      </div>

      {/* Content Container - Centered */}
      <div className="flex-1 flex flex-col justify-center relative z-10">
        {/* Cronograma Semanal */}
        <div className="mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="h-1 w-20 bg-orange-500 rounded-full mr-4"></div>
            <h2 className="text-3xl font-black text-center tracking-wider text-white uppercase">
              CRONOGRAMA SEMANAL
            </h2>
            <div className="h-1 w-20 bg-orange-500 rounded-full ml-4"></div>
          </div>
          
          <div className="grid grid-cols-5 gap-3">
            {weekSchedule.map((day, index) => (
              <div 
                key={index} 
                className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-2xl overflow-hidden border-2 border-orange-500/20"
              >
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2 text-center">
                  <p className="text-xs font-black text-white uppercase tracking-wider">{index + 1}º DIA</p>
                </div>
                <div className="p-4 text-center min-h-[70px] flex items-center justify-center">
                  <p className="font-black text-slate-800 text-sm leading-tight">{day?.toUpperCase() || "-"}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Repetições Semanais */}
        <div>
          <div className="flex items-center justify-center mb-4">
            <div className="h-1 w-20 bg-orange-500 rounded-full mr-4"></div>
            <h2 className="text-3xl font-black text-center tracking-wider text-white uppercase">
              REPETIÇÕES SEMANAIS
            </h2>
            <div className="h-1 w-20 bg-orange-500 rounded-full ml-4"></div>
          </div>
          
          <div className="grid grid-cols-4 gap-3">
            {weeklyReps.map((week, index) => (
              <div 
                key={index} 
                className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-2xl overflow-hidden border-2 border-orange-500/20"
              >
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2 text-center">
                  <p className="text-xs font-black text-white uppercase tracking-wider">SEMANA {index + 1}</p>
                </div>
                <div className="p-5 text-center">
                  <div className="mb-2">
                    <p className="text-xs font-bold text-gray-500 uppercase mb-1">REPS</p>
                    <p className="font-black text-slate-800 text-lg">{week.reps || "-"}</p>
                  </div>
                  <div className="pt-2 border-t border-gray-200">
                    <p className="text-xs font-bold text-gray-500 uppercase mb-1">DESC.</p>
                    <p className="font-black text-slate-800 text-base">{week.rest || "-"}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
