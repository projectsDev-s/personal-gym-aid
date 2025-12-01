import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Printer } from "lucide-react";
import { WorkoutCard } from "@/components/WorkoutCard";
import { WorkoutDay } from "@/types/student";

export default function WorkoutPlan() {
  const { studentId } = useParams();
  const navigate = useNavigate();

  const [workouts] = useState<WorkoutDay[]>([
    {
      id: "1",
      name: "Peito e Tríceps",
      color: "orange",
      exercises: [
        {
          id: "1",
          name: "Supino Reto: 4x de 8-12",
          series: "4x",
          cadence: "8-12",
          methods: "",
        },
        {
          id: "2",
          name: "Supino Inclinado com Halteres: 3x de 10-12",
          series: "3x",
          cadence: "10-12",
          methods: "",
        },
        {
          id: "3",
          name: "Crucifixo com Halteres: 3x de 12",
          series: "3x",
          cadence: "12",
          methods: "",
        },
        {
          id: "4",
          name: "Crossover: 3x de 15",
          series: "3x",
          cadence: "15",
          methods: "",
        },
        {
          id: "5",
          name: "Tríceps Testa: 3x de 10-12",
          series: "3x",
          cadence: "10-12",
          methods: "",
        },
        {
          id: "6",
          name: "Tríceps Pulley: 3x de 12",
          series: "3x",
          cadence: "12",
          methods: "",
        },
        {
          id: "7",
          name: "Mergulho no Banco: 3 séries até a falha",
          series: "3x",
          cadence: "falha",
          methods: "",
        },
      ],
    },
    {
      id: "2",
      name: "Costas e Bíceps",
      color: "green",
      exercises: [
        {
          id: "1",
          name: "Puxada Frontal: 4x de 8-12",
          series: "4x",
          cadence: "8-12",
          methods: "",
        },
        {
          id: "2",
          name: "Remada Curvada: 3x de 10-12",
          series: "3x",
          cadence: "10-12",
          methods: "",
        },
        {
          id: "3",
          name: "Remada Baixa: 3x de 12",
          series: "3x",
          cadence: "12",
          methods: "",
        },
        {
          id: "4",
          name: "Levantamento Terra: 3x de 8-10",
          series: "3x",
          cadence: "8-10",
          methods: "",
        },
        {
          id: "5",
          name: "Rosca Direta: 3x de 10-12",
          series: "3x",
          cadence: "10-12",
          methods: "",
        },
        {
          id: "6",
          name: "Rosca Martelo: 3x de 12",
          series: "3x",
          cadence: "12",
          methods: "",
        },
        {
          id: "7",
          name: "Rosca Concentrada: 3x de 15",
          series: "3x",
          cadence: "15",
          methods: "",
        },
      ],
    },
    {
      id: "3",
      name: "Pernas e Abdômen",
      color: "purple",
      exercises: [
        {
          id: "1",
          name: "Agachamento Livre: 4x de 8-12",
          series: "4x",
          cadence: "8-12",
          methods: "",
        },
        {
          id: "2",
          name: "Leg Press: 3x de 10-12",
          series: "3x",
          cadence: "10-12",
          methods: "",
        },
        {
          id: "3",
          name: "Extensão de Pernas: 3x de 12",
          series: "3x",
          cadence: "12",
          methods: "",
        },
        {
          id: "4",
          name: "Flexão de Pernas: 3x de 12",
          series: "3x",
          cadence: "12",
          methods: "",
        },
        {
          id: "5",
          name: "Panturrilha em Pé: 4x de 15-20",
          series: "4x",
          cadence: "15-20",
          methods: "",
        },
        {
          id: "6",
          name: "Abdominal Supra no Solo: 3x de 20",
          series: "3x",
          cadence: "20",
          methods: "",
        },
        {
          id: "7",
          name: "Abdominal Infra: 3x de 20",
          series: "3x",
          cadence: "20",
          methods: "",
        },
        {
          id: "8",
          name: "Prancha: 3 séries de 1 minuto",
          series: "3x",
          cadence: "1min",
          methods: "",
        },
      ],
    },
    {
      id: "4",
      name: "Ombros e Trapézio",
      color: "red",
      exercises: [
        {
          id: "1",
          name: "Desenvolvimento com Halteres: 4x de 8-12",
          series: "4x",
          cadence: "8-12",
          methods: "",
        },
        {
          id: "2",
          name: "Elevação Lateral: 3x de 12",
          series: "3x",
          cadence: "12",
          methods: "",
        },
        {
          id: "3",
          name: "Elevação Frontal: 3x de 12",
          series: "3x",
          cadence: "12",
          methods: "",
        },
        {
          id: "4",
          name: "Crucifixo Invertido: 3x de 15",
          series: "3x",
          cadence: "15",
          methods: "",
        },
        {
          id: "5",
          name: "Encolhimento com Barra: 4x de 10-12",
          series: "4x",
          cadence: "10-12",
          methods: "",
        },
        {
          id: "6",
          name: "Face Pull: 3x de 15",
          series: "3x",
          cadence: "15",
          methods: "",
        },
      ],
    },
  ]);

  const workoutLabels = ["A", "B", "C", "D", "E", "F"];

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/")}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-4xl font-black font-display">
                  Ficha de Treino
                </h1>
                <p className="text-muted-foreground">Renata Oliveira</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2">
                <Printer className="w-4 h-4" />
                Imprimir
              </Button>
              <Button className="gap-2 font-bold">
                <Plus className="w-4 h-4" />
                Novo Treino
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 p-6 bg-muted/50 rounded-xl">
          <h2 className="text-xl font-bold mb-4">Cronograma Semanal</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center p-4 bg-background rounded-lg border-2">
              <p className="text-sm text-muted-foreground mb-1">1º Dia</p>
              <p className="font-bold">MMII-1</p>
            </div>
            <div className="text-center p-4 bg-background rounded-lg border-2">
              <p className="text-sm text-muted-foreground mb-1">2º Dia</p>
              <p className="font-bold">Dorsal, Bíceps</p>
            </div>
            <div className="text-center p-4 bg-background rounded-lg border-2">
              <p className="text-sm text-muted-foreground mb-1">3º Dia</p>
              <p className="font-bold">MMII-2</p>
            </div>
            <div className="text-center p-4 bg-background rounded-lg border-2">
              <p className="text-sm text-muted-foreground mb-1">4º Dia</p>
              <p className="font-bold">Peitoral</p>
            </div>
            <div className="text-center p-4 bg-background rounded-lg border-2">
              <p className="text-sm text-muted-foreground mb-1">5º Dia</p>
              <p className="font-bold">MMII-1</p>
            </div>
          </div>
        </div>

        <div className="mb-8 p-6 bg-muted/50 rounded-xl">
          <h2 className="text-xl font-bold mb-4">Repetições Semanais</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-background rounded-lg border-2">
              <p className="text-sm text-muted-foreground mb-2">Semana 1</p>
              <p className="font-bold">6-8 REPS</p>
              <p className="text-sm text-muted-foreground">01:00 desc.</p>
            </div>
            <div className="p-4 bg-background rounded-lg border-2">
              <p className="text-sm text-muted-foreground mb-2">Semana 2</p>
              <p className="font-bold">6-8 REPS</p>
              <p className="text-sm text-muted-foreground">01:00 desc.</p>
            </div>
            <div className="p-4 bg-background rounded-lg border-2">
              <p className="text-sm text-muted-foreground mb-2">Semana 3</p>
              <p className="font-bold">6-8 REPS</p>
              <p className="text-sm text-muted-foreground">01:00 desc.</p>
            </div>
            <div className="p-4 bg-background rounded-lg border-2">
              <p className="text-sm text-muted-foreground mb-2">Semana 4</p>
              <p className="font-bold">4-6 REPS</p>
              <p className="text-sm text-muted-foreground">02:00 desc.</p>
            </div>
          </div>
        </div>

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
