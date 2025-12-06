import logoSteven from "@/assets/logo-steven.png";

interface PDFRecommendationsPageProps {
  recommendations: string;
  trainingMethods: string;
}

export const PDFRecommendationsPage = ({ recommendations, trainingMethods }: PDFRecommendationsPageProps) => {
  // Split recommendations and methods by lines for better formatting
  const formatText = (text: string) => {
    if (!text) return [];
    return text.split('\n').filter(line => line.trim() !== '');
  };

  const recommendationsLines = formatText(recommendations);
  const methodsLines = formatText(trainingMethods);

  return (
    <div className="h-[297mm] w-[210mm] bg-white p-8 relative flex flex-col">
      {/* Logo */}
      <div className="flex justify-center mb-6">
        <img 
          src={logoSteven} 
          alt="Steven Cardoso Logo" 
          className="w-40 h-auto opacity-90"
        />
      </div>

      <div className="flex-1 space-y-8">
        {/* Recommendations Section */}
        {recommendations && (
          <div>
            <h2 className="text-3xl font-black text-center mb-6 tracking-wider text-gray-900 uppercase border-b-2 border-orange-500 pb-2">
              RECOMENDAÇÕES
            </h2>
            <div className="space-y-3">
              {recommendationsLines.map((line, index) => (
                <p key={index} className="text-gray-900 text-base leading-relaxed">
                  {line}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Training Methods Section */}
        {trainingMethods && (
          <div>
            <h2 className="text-3xl font-black text-center mb-6 tracking-wider text-gray-900 uppercase border-b-2 border-orange-500 pb-2">
              MÉTODOS DE TREINO
            </h2>
            <div className="space-y-3">
              {methodsLines.map((line, index) => (
                <p key={index} className="text-gray-900 text-base leading-relaxed">
                  {line}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

