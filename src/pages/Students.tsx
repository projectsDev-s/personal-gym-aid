import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { StudentCard } from "@/components/StudentCard";
import { Student } from "@/types/student";
import { useNavigate } from "react-router-dom";

export default function Students() {
  const navigate = useNavigate();
  const [students] = useState<Student[]>([
    {
      id: "1",
      name: "Renata Oliveira",
      age: 31,
      gender: "F",
      objective: "Hipertrofia",
      weight: 65,
      bodyFat: 22,
      muscleMass: 45,
      bmi: 22.5,
      restrictions: "Sem restrições",
      createdAt: new Date(),
    },
  ]);

  const handleEdit = (student: Student) => {
    console.log("Edit student:", student);
    // TODO: Open edit dialog
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black font-display mb-2">
                Planilha de Treinos
              </h1>
              <p className="text-muted-foreground">
                Gerencie seus alunos e fichas de treino
              </p>
            </div>
            <Button
              size="lg"
              className="gap-2 font-bold"
              onClick={() => navigate("/students/new")}
            >
              <Plus className="w-5 h-5" />
              Novo Aluno
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {students.map((student) => (
            <StudentCard
              key={student.id}
              student={student}
              onEdit={handleEdit}
            />
          ))}
        </div>

        {students.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-flex w-20 h-20 rounded-full bg-muted items-center justify-center mb-4">
              <Plus className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-2">Nenhum aluno cadastrado</h3>
            <p className="text-muted-foreground mb-6">
              Comece adicionando seu primeiro aluno
            </p>
            <Button onClick={() => navigate("/students/new")}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Aluno
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
