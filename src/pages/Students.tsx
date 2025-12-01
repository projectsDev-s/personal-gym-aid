import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { StudentCard } from "@/components/StudentCard";
import { Student } from "@/types/student";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function Students() {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const mappedStudents: Student[] = (data || []).map((s) => ({
        id: s.id,
        name: s.name,
        age: s.age,
        gender: s.gender as "M" | "F" | "Outro",
        objective: s.objective,
        weight: s.weight || undefined,
        bodyFat: s.body_fat || undefined,
        muscleMass: s.muscle_mass || undefined,
        bmi: s.bmi || undefined,
        restrictions: s.restrictions || undefined,
        createdAt: new Date(s.created_at),
      }));

      setStudents(mappedStudents);
    } catch (error) {
      console.error("Error fetching students:", error);
      toast.error("Erro ao carregar alunos");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (student: Student) => {
    navigate(`/students/edit/${student.id}`);
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
        {loading ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">Carregando alunos...</p>
          </div>
        ) : (
          <>
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
          </>
        )}
      </div>
    </div>
  );
}
