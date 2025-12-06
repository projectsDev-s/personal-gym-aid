import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pencil, History, Download, Eye, EyeOff, X } from "lucide-react";
import { WorkoutCard } from "@/components/WorkoutCard";
import { PDFCoverPage } from "@/components/PDFCoverPage";
import { PDFStudentInfoPage } from "@/components/PDFStudentInfoPage";
import { PDFWorkoutsPage } from "@/components/PDFWorkoutsPage";
import { PDFRecommendationsPage } from "@/components/PDFRecommendationsPage";
import { WorkoutDay, Student } from "@/types/student";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function WorkoutPlan() {
  const { workoutId } = useParams();
  const navigate = useNavigate();
  const printRef = useRef<HTMLDivElement>(null);
  const coverRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const workoutsRef = useRef<HTMLDivElement>(null);
  const recommendationsRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [showPDFPreview, setShowPDFPreview] = useState(false);
  const [studentName, setStudentName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [studentData, setStudentData] = useState<Partial<Student>>({});
  const [weekSchedule, setWeekSchedule] = useState<string[]>([]);
  const [weeklyReps, setWeeklyReps] = useState<Array<{ reps: string; rest: string }>>([]);
  const [workouts, setWorkouts] = useState<WorkoutDay[]>([]);
  const [recommendations, setRecommendations] = useState("");
  const [trainingMethods, setTrainingMethods] = useState<string>("");
  useEffect(() => {
    fetchWorkout();
  }, [workoutId]);

  const fetchWorkout = async () => {
    try {
      const { data: planData, error: planError } = await supabase
        .from("workout_plans")
        .select(`
          *,
          students (*)
        `)
        .eq("id", workoutId)
        .single();

      if (planError) throw planError;

      setStudentName(planData.students.name);
      setStudentId(planData.students.id);
      setStudentData({
        name: planData.students.name,
        age: planData.students.age,
        gender: planData.students.gender as "M" | "F" | "Outro",
        objective: planData.students.objective,
        weight: planData.students.weight,
        bodyFat: planData.students.body_fat,
        muscleMass: planData.students.muscle_mass,
        bmi: planData.students.bmi,
        restrictions: planData.students.restrictions,
      });

      setWeekSchedule([
        planData.week_day1 || "",
        planData.week_day2 || "",
        planData.week_day3 || "",
        planData.week_day4 || "",
        planData.week_day5 || "",
      ]);

      setWeeklyReps([
        { reps: planData.week1_reps || "", rest: planData.week1_rest || "" },
        { reps: planData.week2_reps || "", rest: planData.week2_rest || "" },
        { reps: planData.week3_reps || "", rest: planData.week3_rest || "" },
        { reps: planData.week4_reps || "", rest: planData.week4_rest || "" },
      ]);

      setRecommendations((planData as any).recommendations || "");
      setTrainingMethods((planData as any).training_methods || "");

      const { data: daysData, error: daysError } = await supabase
        .from("workout_days")
        .select(`
          *,
          exercises (*)
        `)
        .eq("workout_plan_id", workoutId)
        .order("created_at");

      if (daysError) throw daysError;

      const formattedDays = daysData.map((day) => ({
        id: day.id,
        name: day.name,
        color: day.color as "orange" | "green" | "purple" | "red",
        exercises: day.exercises
          .sort((a, b) => a.order_index - b.order_index)
          .map((ex) => ({
            id: ex.id,
            name: ex.name,
            series: ex.series,
            cadence: ex.cadence,
            methods: ex.methods || "",
          })),
      }));

      setWorkouts(formattedDays);
    } catch (error) {
      console.error("Error fetching workout:", error);
      toast.error("Erro ao carregar treino");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const workoutLabels = ["A", "B", "C", "D", "E", "F"];

  const handleExportPDF = async () => {
    if (!coverRef.current || !infoRef.current || !workoutsRef.current) return;
    
    const hasRecommendations = recommendations || trainingMethods;
    
    setExporting(true);
    try {
      // Small delay to ensure all elements are rendered
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210;
      const pageHeight = 297;

      // Capture cover page
      const coverCanvas = await html2canvas(coverRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#18181b",
        allowTaint: true,
      });
      const coverImgData = coverCanvas.toDataURL("image/png");
      pdf.addImage(coverImgData, "PNG", 0, 0, imgWidth, pageHeight);

      // Capture student info page
      pdf.addPage();
      const infoCanvas = await html2canvas(infoRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#18181b",
        allowTaint: true,
      });
      const infoImgData = infoCanvas.toDataURL("image/png");
      pdf.addImage(infoImgData, "PNG", 0, 0, imgWidth, pageHeight);

      // Capture workouts page
      pdf.addPage();
      const workoutsCanvas = await html2canvas(workoutsRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#18181b",
        allowTaint: true,
      });
      const workoutsImgData = workoutsCanvas.toDataURL("image/png");
      const workoutsImgHeight = (workoutsCanvas.height * imgWidth) / workoutsCanvas.width;
      
      // Handle multiple pages for workouts if needed
      let heightLeft = workoutsImgHeight;
      let position = 0;
      
      pdf.addImage(workoutsImgData, "PNG", 0, position, imgWidth, workoutsImgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - workoutsImgHeight;
        pdf.addPage();
        pdf.addImage(workoutsImgData, "PNG", 0, position, imgWidth, workoutsImgHeight);
        heightLeft -= pageHeight;
      }

      // Capture recommendations page if exists
      if (hasRecommendations && recommendationsRef.current) {
        pdf.addPage();
        const recommendationsCanvas = await html2canvas(recommendationsRef.current, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: "#ffffff",
          allowTaint: true,
        });
        const recommendationsImgData = recommendationsCanvas.toDataURL("image/png");
        pdf.addImage(recommendationsImgData, "PNG", 0, 0, imgWidth, pageHeight);
      }

      pdf.save(`treino-${studentName.replace(/\s+/g, "-").toLowerCase()}.pdf`);
      toast.success("PDF exportado com sucesso!");
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast.error("Erro ao exportar PDF");
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-4xl font-black font-display">Ficha de Treino</h1>
                <p className="text-muted-foreground">{studentName}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => navigate(`/students/${studentId}/workouts`)}
              >
                <History className="w-4 h-4" />
                Histórico
              </Button>
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => setShowPDFPreview(!showPDFPreview)}
              >
                {showPDFPreview ? (
                  <>
                    <EyeOff className="w-4 h-4" />
                    Ocultar PDF
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" />
                    Visualizar PDF
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                className="gap-2"
                onClick={handleExportPDF}
                disabled={exporting}
              >
                <Download className="w-4 h-4" />
                {exporting ? "Exportando..." : "Exportar PDF"}
              </Button>
              <Button
                className="gap-2 font-bold"
                onClick={() => navigate(`/workout/${workoutId}/edit`)}
              >
                <Pencil className="w-4 h-4" />
                Editar
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* PDF Preview Modal */}
      {showPDFPreview && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-4xl">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white"
              onClick={() => setShowPDFPreview(false)}
            >
              <X className="w-5 h-5" />
            </Button>
            <div className="bg-white rounded-lg shadow-2xl p-4 space-y-4 max-h-[90vh] overflow-y-auto">
              {/* Cover Page - Preview only (no ref) */}
              <div className="border-2 border-gray-300 rounded-lg overflow-hidden shadow-lg">
                <PDFCoverPage studentName={studentName} />
              </div>
              
              {/* Info Page - Preview only (no ref) */}
              <div className="border-2 border-gray-300 rounded-lg overflow-hidden shadow-lg">
                <PDFStudentInfoPage 
                  weekSchedule={weekSchedule} 
                  weeklyReps={weeklyReps} 
                />
              </div>
              
              {/* Workouts Page - Preview only (no ref) */}
              <div className="border-2 border-gray-300 rounded-lg overflow-hidden shadow-lg">
                <PDFWorkoutsPage workouts={workouts} />
              </div>
              
              {/* Recommendations Page - Preview only (no ref) */}
              {(recommendations || trainingMethods) && (
                <div className="border-2 border-gray-300 rounded-lg overflow-hidden shadow-lg">
                  <PDFRecommendationsPage 
                    recommendations={recommendations}
                    trainingMethods={trainingMethods}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Hidden PDF pages for export (needed for html2canvas) - Keep in viewport but invisible */}
      <div style={{ position: 'fixed', top: 0, left: 0, opacity: 0, pointerEvents: 'none', zIndex: -1 }}>
        <div ref={coverRef} style={{ width: '210mm', height: '297mm' }}>
          <PDFCoverPage studentName={studentName} />
        </div>
        <div ref={infoRef} data-pdf-info style={{ width: '210mm', height: '297mm' }}>
          <PDFStudentInfoPage 
            weekSchedule={weekSchedule} 
            weeklyReps={weeklyReps} 
          />
        </div>
        <div ref={workoutsRef} data-pdf-workouts style={{ width: '210mm', minHeight: '297mm' }}>
          <PDFWorkoutsPage workouts={workouts} />
        </div>
        {(recommendations || trainingMethods) && (
          <div ref={recommendationsRef} style={{ width: '210mm', height: '297mm' }}>
            <PDFRecommendationsPage 
              recommendations={recommendations}
              trainingMethods={trainingMethods}
            />
          </div>
        )}
      </div>

      <div className="container mx-auto px-4 py-8" ref={printRef}>
        {weekSchedule.some((day) => day) && (
          <div className="mb-8 p-6 bg-muted/50 rounded-xl">
            <h2 className="text-xl font-bold mb-4">Cronograma Semanal</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {weekSchedule.map((day, index) => (
                <div key={index} className="text-center p-4 bg-background rounded-lg border-2">
                  <p className="text-sm text-muted-foreground mb-1">{index + 1}º Dia</p>
                  <p className="font-bold">{day || "-"}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {weeklyReps.some((week) => week.reps || week.rest) && (
          <div className="mb-8 p-6 bg-muted/50 rounded-xl">
            <h2 className="text-xl font-bold mb-4">Repetições Semanais</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {weeklyReps.map((week, index) => (
                <div key={index} className="p-4 bg-background rounded-lg border-2">
                  <p className="text-sm text-muted-foreground mb-2">Semana {index + 1}</p>
                  <p className="font-bold">{week.reps || "-"}</p>
                  <p className="text-sm text-muted-foreground">{week.rest || "-"}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-1 gap-4">
          {workouts.map((workout, index) => (
            <WorkoutCard
              key={workout.id}
              workout={workout}
              label={workoutLabels[index]}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
