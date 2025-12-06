import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Exercise {
  name: string;
  series: string;
  cadence: string;
  methods: string;
}

interface WorkoutDay {
  name: string;
  color: "orange" | "green" | "purple" | "red";
  exercises: Exercise[];
}

export default function NewWorkout() {
  const navigate = useNavigate();
  const { studentId } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [studentName, setStudentName] = useState("");
  
  const [weekSchedule, setWeekSchedule] = useState({
    day1: "",
    day2: "",
    day3: "",
    day4: "",
    day5: "",
  });

  const [weeklyReps, setWeeklyReps] = useState({
    week1: { reps: "", rest: "" },
    week2: { reps: "", rest: "" },
    week3: { reps: "", rest: "" },
    week4: { reps: "", rest: "" },
  });

  const [recommendations, setRecommendations] = useState("");
  const [trainingMethods, setTrainingMethods] = useState("");

  const [workoutDays, setWorkoutDays] = useState<WorkoutDay[]>([
    {
      name: "Treino A",
      color: "orange",
      exercises: [{ name: "", series: "", cadence: "", methods: "" }],
    },
  ]);

  useEffect(() => {
    fetchStudent();
  }, [studentId]);

  const fetchStudent = async () => {
    try {
      const { data, error } = await supabase
        .from("students")
        .select("name")
        .eq("id", studentId)
        .single();

      if (error) throw error;
      setStudentName(data.name);
    } catch (error) {
      console.error("Error fetching student:", error);
      toast.error("Erro ao carregar aluno");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const addWorkoutDay = () => {
    const colors: Array<"orange" | "green" | "purple" | "red"> = ["orange", "green", "purple", "red"];
    const nextColor = colors[workoutDays.length % colors.length];
    const nextLetter = String.fromCharCode(65 + workoutDays.length);
    
    setWorkoutDays([
      ...workoutDays,
      {
        name: `Treino ${nextLetter}`,
        color: nextColor,
        exercises: [{ name: "", series: "", cadence: "", methods: "" }],
      },
    ]);
  };

  const removeWorkoutDay = (index: number) => {
    setWorkoutDays(workoutDays.filter((_, i) => i !== index));
  };

  const addExercise = (dayIndex: number) => {
    const newWorkoutDays = [...workoutDays];
    newWorkoutDays[dayIndex].exercises.push({ name: "", series: "", cadence: "", methods: "" });
    setWorkoutDays(newWorkoutDays);
  };

  const removeExercise = (dayIndex: number, exerciseIndex: number) => {
    const newWorkoutDays = [...workoutDays];
    newWorkoutDays[dayIndex].exercises = newWorkoutDays[dayIndex].exercises.filter((_, i) => i !== exerciseIndex);
    setWorkoutDays(newWorkoutDays);
  };

  const updateExercise = (dayIndex: number, exerciseIndex: number, field: keyof Exercise, value: string) => {
    const newWorkoutDays = [...workoutDays];
    newWorkoutDays[dayIndex].exercises[exerciseIndex][field] = value;
    setWorkoutDays(newWorkoutDays);
  };

  const updateWorkoutDayName = (dayIndex: number, value: string) => {
    const newWorkoutDays = [...workoutDays];
    newWorkoutDays[dayIndex].name = value;
    setWorkoutDays(newWorkoutDays);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Insert workout plan
      const { data: planData, error: planError } = await supabase
        .from("workout_plans")
        .insert({
          student_id: studentId,
          week_day1: weekSchedule.day1,
          week_day2: weekSchedule.day2,
          week_day3: weekSchedule.day3,
          week_day4: weekSchedule.day4,
          week_day5: weekSchedule.day5,
          week1_reps: weeklyReps.week1.reps,
          week1_rest: weeklyReps.week1.rest,
          week2_reps: weeklyReps.week2.reps,
          week2_rest: weeklyReps.week2.rest,
          week3_reps: weeklyReps.week3.reps,
          week3_rest: weeklyReps.week3.rest,
          week4_reps: weeklyReps.week4.reps,
          week4_rest: weeklyReps.week4.rest,
          recommendations: recommendations || null,
          training_methods: trainingMethods || null,
        })
        .select()
        .single();

      if (planError) throw planError;

      // Insert workout days and exercises
      for (const day of workoutDays) {
        const { data: dayData, error: dayError } = await supabase
          .from("workout_days")
          .insert({
            workout_plan_id: planData.id,
            name: day.name,
            color: day.color,
          })
          .select()
          .single();

        if (dayError) throw dayError;

        // Insert exercises for this day
        const exercisesToInsert = day.exercises
          .filter((ex) => ex.name.trim() !== "")
          .map((ex, index) => ({
            workout_day_id: dayData.id,
            name: ex.name,
            series: ex.series,
            cadence: ex.cadence,
            methods: ex.methods || null,
            order_index: index,
          }));

        if (exercisesToInsert.length > 0) {
          const { error: exercisesError } = await supabase
            .from("exercises")
            .insert(exercisesToInsert);

          if (exercisesError) throw exercisesError;
        }
      }

      toast.success("Treino criado com sucesso!");
      navigate(`/workout/${planData.id}`);
    } catch (error) {
      console.error("Error saving workout:", error);
      toast.error("Erro ao criar treino");
    } finally {
      setSaving(false);
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
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-4xl font-black font-display">Novo Treino</h1>
              <p className="text-muted-foreground">
                Criar ficha de treino para {studentName}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Weekly Schedule */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Programação Semanal</h2>
            <div className="grid md:grid-cols-5 gap-4">
              {[1, 2, 3, 4, 5].map((day) => (
                <div key={day} className="space-y-2">
                  <Label className="font-semibold">Dia {day}</Label>
                  <Input
                    value={weekSchedule[`day${day}` as keyof typeof weekSchedule]}
                    onChange={(e) =>
                      setWeekSchedule({
                        ...weekSchedule,
                        [`day${day}`]: e.target.value,
                      })
                    }
                    placeholder={`Ex: Treino A`}
                  />
                </div>
              ))}
            </div>
          </Card>

          {/* Weekly Reps */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Repetições Semanais</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((week) => (
                <div key={week} className="space-y-2">
                  <Label className="font-semibold">Semana {week}</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Reps"
                      value={weeklyReps[`week${week}` as keyof typeof weeklyReps].reps}
                      onChange={(e) =>
                        setWeeklyReps({
                          ...weeklyReps,
                          [`week${week}`]: {
                            ...weeklyReps[`week${week}` as keyof typeof weeklyReps],
                            reps: e.target.value,
                          },
                        })
                      }
                    />
                    <Input
                      placeholder="Descanso"
                      value={weeklyReps[`week${week}` as keyof typeof weeklyReps].rest}
                      onChange={(e) =>
                        setWeeklyReps({
                          ...weeklyReps,
                          [`week${week}`]: {
                            ...weeklyReps[`week${week}` as keyof typeof weeklyReps],
                            rest: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Recommendations */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Recomendações</h2>
            <Textarea
              placeholder="Digite as recomendações de treino (ex: Mobilidade de tronco e ombros nos dias de treino de membros superiores e CARDIO...)"
              value={recommendations}
              onChange={(e) => setRecommendations(e.target.value)}
              className="min-h-[150px]"
            />
          </Card>

          {/* Training Methods */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Métodos de Treino</h2>
            <Textarea
              placeholder="Digite os métodos de treino (ex: BI-SET: Realizar dois exercícios consecutivos sem descanso...)"
              value={trainingMethods}
              onChange={(e) => setTrainingMethods(e.target.value)}
              className="min-h-[200px]"
            />
          </Card>

          {/* Workout Days */}
          {workoutDays.map((day, dayIndex) => (
            <Card key={dayIndex} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Input
                  value={day.name}
                  onChange={(e) => updateWorkoutDayName(dayIndex, e.target.value)}
                  className="text-xl font-bold max-w-xs"
                />
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addExercise(dayIndex)}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Exercício
                  </Button>
                  {workoutDays.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeWorkoutDay(dayIndex)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                {day.exercises.map((exercise, exerciseIndex) => (
                  <div key={exerciseIndex} className="grid md:grid-cols-5 gap-2 items-end">
                    <div className="md:col-span-2">
                      <Input
                        placeholder="Nome do exercício"
                        value={exercise.name}
                        onChange={(e) =>
                          updateExercise(dayIndex, exerciseIndex, "name", e.target.value)
                        }
                      />
                    </div>
                    <Input
                      placeholder="Séries"
                      value={exercise.series}
                      onChange={(e) =>
                        updateExercise(dayIndex, exerciseIndex, "series", e.target.value)
                      }
                    />
                    <Input
                      placeholder="Cadência"
                      value={exercise.cadence}
                      onChange={(e) =>
                        updateExercise(dayIndex, exerciseIndex, "cadence", e.target.value)
                      }
                    />
                    <div className="flex gap-2">
                      <Input
                        placeholder="Método"
                        value={exercise.methods}
                        onChange={(e) =>
                          updateExercise(dayIndex, exerciseIndex, "methods", e.target.value)
                        }
                      />
                      {day.exercises.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeExercise(dayIndex, exerciseIndex)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={addWorkoutDay}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Dia de Treino
          </Button>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/")}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 gap-2 font-bold" disabled={saving}>
              <Save className="w-4 h-4" />
              {saving ? "Salvando..." : "Salvar Treino"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
