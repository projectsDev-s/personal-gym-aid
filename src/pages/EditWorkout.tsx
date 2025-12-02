import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Exercise {
  id?: string;
  name: string;
  series: string;
  cadence: string;
  methods: string;
  order_index: number;
}

interface WorkoutDay {
  id?: string;
  name: string;
  color: "orange" | "green" | "purple" | "red";
  exercises: Exercise[];
}

export default function EditWorkout() {
  const navigate = useNavigate();
  const { workoutId } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [studentName, setStudentName] = useState("");
  const [studentId, setStudentId] = useState("");
  
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

  const [workoutDays, setWorkoutDays] = useState<WorkoutDay[]>([]);

  useEffect(() => {
    fetchWorkout();
  }, [workoutId]);

  const fetchWorkout = async () => {
    try {
      // Fetch workout plan
      const { data: planData, error: planError } = await supabase
        .from("workout_plans")
        .select(`
          *,
          students (name)
        `)
        .eq("id", workoutId)
        .single();

      if (planError) throw planError;

      setStudentId(planData.student_id);
      setStudentName(planData.students.name);
      
      setWeekSchedule({
        day1: planData.week_day1 || "",
        day2: planData.week_day2 || "",
        day3: planData.week_day3 || "",
        day4: planData.week_day4 || "",
        day5: planData.week_day5 || "",
      });

      setWeeklyReps({
        week1: { reps: planData.week1_reps || "", rest: planData.week1_rest || "" },
        week2: { reps: planData.week2_reps || "", rest: planData.week2_rest || "" },
        week3: { reps: planData.week3_reps || "", rest: planData.week3_rest || "" },
        week4: { reps: planData.week4_reps || "", rest: planData.week4_rest || "" },
      });

      // Fetch workout days and exercises
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
            order_index: ex.order_index,
          })),
      }));

      setWorkoutDays(formattedDays);
    } catch (error) {
      console.error("Error fetching workout:", error);
      toast.error("Erro ao carregar treino");
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
        exercises: [{ name: "", series: "", cadence: "", methods: "", order_index: 0 }],
      },
    ]);
  };

  const removeWorkoutDay = (index: number) => {
    setWorkoutDays(workoutDays.filter((_, i) => i !== index));
  };

  const addExercise = (dayIndex: number) => {
    const newWorkoutDays = [...workoutDays];
    newWorkoutDays[dayIndex].exercises.push({ 
      name: "", 
      series: "", 
      cadence: "", 
      methods: "",
      order_index: newWorkoutDays[dayIndex].exercises.length 
    });
    setWorkoutDays(newWorkoutDays);
  };

  const removeExercise = (dayIndex: number, exerciseIndex: number) => {
    const newWorkoutDays = [...workoutDays];
    newWorkoutDays[dayIndex].exercises = newWorkoutDays[dayIndex].exercises.filter((_, i) => i !== exerciseIndex);
    setWorkoutDays(newWorkoutDays);
  };

  const updateExercise = (
    dayIndex: number, 
    exerciseIndex: number, 
    field: keyof Exercise, 
    value: string | number
  ) => {
    const newWorkoutDays = [...workoutDays];
    if (field === 'order_index' && typeof value === 'number') {
      newWorkoutDays[dayIndex].exercises[exerciseIndex][field] = value;
    } else if (field !== 'order_index' && typeof value === 'string') {
      newWorkoutDays[dayIndex].exercises[exerciseIndex][field] = value as any;
    }
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
      // Update workout plan
      const { error: planError } = await supabase
        .from("workout_plans")
        .update({
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
        })
        .eq("id", workoutId);

      if (planError) throw planError;

      // Delete existing workout days and exercises
      const { error: deleteError } = await supabase
        .from("workout_days")
        .delete()
        .eq("workout_plan_id", workoutId);

      if (deleteError) throw deleteError;

      // Insert new workout days and exercises
      for (const day of workoutDays) {
        const { data: dayData, error: dayError } = await supabase
          .from("workout_days")
          .insert({
            workout_plan_id: workoutId,
            name: day.name,
            color: day.color,
          })
          .select()
          .single();

        if (dayError) throw dayError;

        const exercisesToInsert = day.exercises
          .filter((ex) => ex.name.trim() !== "")
          .map((ex, index) => ({
            workout_day_id: dayData.id,
            name: ex.name,
            series: ex.series,
            cadence: ex.cadence,
            methods: (ex.methods || null) as string | null,
            order_index: index,
          }));

        if (exercisesToInsert.length > 0) {
          const { error: exercisesError } = await supabase
            .from("exercises")
            .insert(exercisesToInsert);

          if (exercisesError) throw exercisesError;
        }
      }

      toast.success("Treino atualizado com sucesso!");
      navigate(`/workout/${workoutId}`);
    } catch (error) {
      console.error("Error updating workout:", error);
      toast.error("Erro ao atualizar treino");
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
            <Button variant="ghost" size="icon" onClick={() => navigate(`/workout/${workoutId}`)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-4xl font-black font-display">Editar Treino</h1>
              <p className="text-muted-foreground">
                Editando ficha de treino para {studentName}
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
              onClick={() => navigate(`/workout/${workoutId}`)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 gap-2 font-bold" disabled={saving}>
              <Save className="w-4 h-4" />
              {saving ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
