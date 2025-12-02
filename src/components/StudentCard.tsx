import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Edit, History, Plus } from "lucide-react";
import { Student } from "@/types/student";
import { useNavigate } from "react-router-dom";

interface StudentCardProps {
  student: Student;
  onEdit: (student: Student) => void;
}

export const StudentCard = ({ student, onEdit }: StudentCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-300 border-2 hover:border-primary">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-vibrant-orange to-vibrant-purple flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-display">{student.name}</h3>
            <p className="text-sm text-muted-foreground">
              {student.age} anos • {student.gender === "M" ? "Masculino" : student.gender === "F" ? "Feminino" : "Outro"}
            </p>
            <p className="text-sm font-semibold text-vibrant-orange mt-1">
              {student.objective}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={() => onEdit(student)}>
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="default"
            size="icon"
            onClick={() => navigate(`/students/${student.id}/workouts`)}
          >
            <History className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      {(student.weight || student.bmi) && (
        <div className="mt-4 pt-4 border-t grid grid-cols-2 md:grid-cols-4 gap-4">
          {student.weight && (
            <div>
              <p className="text-xs text-muted-foreground">Peso</p>
              <p className="font-semibold">{student.weight} kg</p>
            </div>
          )}
          {student.bodyFat && (
            <div>
              <p className="text-xs text-muted-foreground">% Gordura</p>
              <p className="font-semibold">{student.bodyFat}%</p>
            </div>
          )}
          {student.muscleMass && (
            <div>
              <p className="text-xs text-muted-foreground">% Massa</p>
              <p className="font-semibold">{student.muscleMass}%</p>
            </div>
          )}
          {student.bmi && (
            <div>
              <p className="text-xs text-muted-foreground">IMC</p>
              <p className="font-semibold">{student.bmi}</p>
            </div>
          )}
        </div>
      )}

      <div className="mt-4 pt-4 border-t">
        <Button 
          size="sm" 
          className="w-full gap-2"
          onClick={() => navigate(`/students/${student.id}/workout/new`)}
        >
          <Plus className="w-4 h-4" />
          Criar Novo Treino
        </Button>
      </div>
    </Card>
  );
};
