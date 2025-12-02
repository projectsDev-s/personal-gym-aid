import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Plus, Calendar, Eye } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface WorkoutPlanSummary {
  id: string;
  created_at: string;
  workout_days: Array<{
    name: string;
    color: string;
  }>;
}

export default function WorkoutHistory() {
  const navigate = useNavigate();
  const { studentId } = useParams();
  const [loading, setLoading] = useState(true);
  const [studentName, setStudentName] = useState("");
  const [workouts, setWorkouts] = useState<WorkoutPlanSummary[]>([]);

  useEffect(() => {
    fetchData();
  }, [studentId]);

  const fetchData = async () => {
    try {
      // Fetch student
      const { data: studentData, error: studentError } = await supabase
        .from("students")
        .select("name")
        .eq("id", studentId)
        .single();

      if (studentError) throw studentError;
      setStudentName(studentData.name);

      // Fetch workout plans
      const { data: workoutsData, error: workoutsError } = await supabase
        .from("workout_plans")
        .select(`
          id,
          created_at,
          workout_days (
            name,
            color
          )
        `)
        .eq("student_id", studentId)
        .order("created_at", { ascending: false });

      if (workoutsError) throw workoutsError;
      setWorkouts(workoutsData);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Erro ao carregar histórico");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const colorClasses = {
    orange: "bg-vibrant-orange",
    green: "bg-vibrant-green",
    purple: "bg-vibrant-purple",
    red: "bg-vibrant-red",
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
                <h1 className="text-4xl font-black font-display">Histórico de Treinos</h1>
                <p className="text-muted-foreground">{studentName}</p>
              </div>
            </div>
            <Button
              className="gap-2 font-bold"
              onClick={() => navigate(`/students/${studentId}/workout/new`)}
            >
              <Plus className="w-4 h-4" />
              Novo Treino
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {workouts.length === 0 ? (
          <Card className="p-12 text-center">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Nenhum treino encontrado</h2>
            <p className="text-muted-foreground mb-6">
              Este aluno ainda não possui treinos cadastrados.
            </p>
            <Button onClick={() => navigate(`/students/${studentId}/workout/new`)}>
              <Plus className="w-4 h-4 mr-2" />
              Criar Primeiro Treino
            </Button>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workouts.map((workout) => (
              <Card
                key={workout.id}
                className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => navigate(`/workout/${workout.id}`)}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Criado em</p>
                      <p className="font-bold">
                        {format(new Date(workout.created_at), "dd 'de' MMMM 'de' yyyy", {
                          locale: ptBR,
                        })}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/workout/${workout.id}`);
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      {workout.workout_days.length}{" "}
                      {workout.workout_days.length === 1 ? "treino" : "treinos"}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {workout.workout_days.slice(0, 4).map((day, index) => (
                        <div
                          key={index}
                          className={`px-3 py-1 rounded-lg text-white text-xs font-bold ${
                            colorClasses[day.color as keyof typeof colorClasses] || "bg-gray-500"
                          }`}
                        >
                          {day.name}
                        </div>
                      ))}
                      {workout.workout_days.length > 4 && (
                        <div className="px-3 py-1 rounded-lg bg-muted text-xs font-bold">
                          +{workout.workout_days.length - 4}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
