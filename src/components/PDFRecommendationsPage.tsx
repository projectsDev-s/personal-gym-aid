import logoSteven from "@/assets/logo-steven.png";

interface TrainingMethod {
  title: string;
  description: string;
}

interface PDFRecommendationsPageProps {
  recommendations: string;
  trainingMethods: string;
}

export const PDFRecommendationsPage = ({ recommendations, trainingMethods }: PDFRecommendationsPageProps) => {
  // Split recommendations by lines for better formatting
  const formatText = (text: string) => {
    if (!text) return [];
    return text.split('\n').filter(line => line.trim() !== '');
  };

  const recommendationsLines = formatText(recommendations);
  
  // Parse training methods from JSON
  let parsedMethods: TrainingMethod[] = [];
  if (trainingMethods) {
    try {
      const parsed = JSON.parse(trainingMethods);
      if (Array.isArray(parsed)) {
        parsedMethods = parsed.filter(m => m.title && m.title.trim() !== "");
      }
    } catch {
      // If not JSON, treat as old format (plain text)
      parsedMethods = [];
    }
  }

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
        {parsedMethods.length > 0 && (
          <div>
            <h2 className="text-3xl font-black text-center mb-6 tracking-wider text-gray-900 uppercase border-b-2 border-orange-500 pb-2">
              MÉTODOS DE TREINO
            </h2>
            <div className="space-y-4">
              {parsedMethods.map((method, index) => (
                <div key={index} className="space-y-2">
                  <h3 className="text-xl font-black text-gray-900 uppercase">
                    {method.title}:
                  </h3>
                  <p className="text-gray-900 text-base leading-relaxed ml-4">
                    {method.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

