import logo from "@/assets/logo";

interface PDFCoverPageProps {
  studentName: string;
}

export const PDFCoverPage = ({ studentName }: PDFCoverPageProps) => {
  return (
    <div className="min-h-[297mm] bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 flex flex-col items-center justify-between p-12 text-white">
      {/* Logo at top */}
      <div className="flex-1 flex items-center justify-center">
        <img 
          src={logo} 
          alt="Logo" 
          className="w-80 h-auto"
        />
      </div>

      {/* Credentials in center */}
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="w-24 h-1 bg-vibrant-orange rounded-full mb-8" />
        <div className="flex flex-col items-center justify-center space-y-4 flex-1">
          <p className="text-lg font-medium tracking-wide">Graduado em Educação Física</p>
          <p className="text-lg font-medium tracking-wide">Especialista em Hipertrofia dos Glúteos</p>
          <p className="text-lg font-medium tracking-wide">Avaliação Física e Funcional</p>
          <p className="text-lg font-medium tracking-wide">Pós Graduado em Nutrição Esportiva e Fisiologia do Exercício</p>
        </div>
        <div className="w-24 h-1 bg-vibrant-orange rounded-full mt-8" />
      </div>

      {/* Student name at bottom */}
      <div className="flex-1 flex flex-col items-center justify-end pb-8">
        <p className="text-sm text-zinc-400 uppercase tracking-widest mb-2">Ficha de Treino</p>
        <p className="text-3xl font-black font-display uppercase tracking-wide text-vibrant-orange">
          {studentName}
        </p>
      </div>
    </div>
  );
};
