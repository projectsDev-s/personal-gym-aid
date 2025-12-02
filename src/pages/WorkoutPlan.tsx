import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pencil, History, Download } from "lucide-react";
import { WorkoutCard } from "@/components/WorkoutCard";
import { WorkoutDay } from "@/types/student";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function WorkoutPlan() {
  const { workoutId } = useParams();
  const navigate = useNavigate();
  const printRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [studentName, setStudentName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [weekSchedule, setWeekSchedule] = useState<string[]>([]);
  const [weeklyReps, setWeeklyReps] = useState<Array<{ reps: string; rest: string }>>([]);
  const [workouts, setWorkouts] = useState<WorkoutDay[]>([]);
  useEffect(() => {
    fetchWorkout();
  }, [workoutId]);

  const fetchWorkout = async () => {
    try {
      const { data: planData, error: planError } = await supabase
        .from("workout_plans")
        .select(`
          *,
          students (name, id)
        `)
        .eq("id", workoutId)
        .single();

      if (planError) throw planError;

      setStudentName(planData.students.name);
      setStudentId(planData.students.id);

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
    if (!printRef.current) return;
    
    setExporting(true);
    try {
      const element = printRef.current;
      
      // Capture the element as canvas
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if needed
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
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

        <div className="grid md:grid-cols-2 gap-6">
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
