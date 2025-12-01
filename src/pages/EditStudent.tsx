import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export default function EditStudent() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    objective: "",
    weight: "",
    bodyFat: "",
    muscleMass: "",
    bmi: "",
    restrictions: "",
  });

  useEffect(() => {
    fetchStudent();
  }, [id]);

  const fetchStudent = async () => {
    try {
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      setFormData({
        name: data.name,
        age: data.age.toString(),
        gender: data.gender,
        objective: data.objective,
        weight: data.weight?.toString() || "",
        bodyFat: data.body_fat?.toString() || "",
        muscleMass: data.muscle_mass?.toString() || "",
        bmi: data.bmi?.toString() || "",
        restrictions: data.restrictions || "",
      });
    } catch (error) {
      console.error("Error fetching student:", error);
      toast.error("Erro ao carregar aluno");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { error } = await supabase
        .from("students")
        .update({
          name: formData.name,
          age: parseInt(formData.age),
          gender: formData.gender,
          objective: formData.objective,
          weight: formData.weight ? parseFloat(formData.weight) : null,
          body_fat: formData.bodyFat ? parseFloat(formData.bodyFat) : null,
          muscle_mass: formData.muscleMass ? parseFloat(formData.muscleMass) : null,
          bmi: formData.bmi ? parseFloat(formData.bmi) : null,
          restrictions: formData.restrictions || null,
        })
        .eq("id", id);

      if (error) throw error;

      toast.success("Aluno atualizado com sucesso!");
      navigate("/");
    } catch (error) {
      console.error("Error updating student:", error);
      toast.error("Erro ao atualizar aluno");
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
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-4xl font-black font-display">Editar Aluno</h1>
              <p className="text-muted-foreground">
                Atualize os dados do aluno
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <form onSubmit={handleSubmit}>
          <Card className="p-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-base font-semibold">
                  Nome Completo *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Digite o nome do aluno"
                  required
                  className="text-base"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age" className="text-base font-semibold">
                    Idade *
                  </Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) =>
                      setFormData({ ...formData, age: e.target.value })
                    }
                    placeholder="25"
                    required
                    className="text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender" className="text-base font-semibold">
                    Gênero *
                  </Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) =>
                      setFormData({ ...formData, gender: value })
                    }
                    required
                  >
                    <SelectTrigger className="text-base">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="M">Masculino</SelectItem>
                      <SelectItem value="F">Feminino</SelectItem>
                      <SelectItem value="Outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="objective" className="text-base font-semibold">
                    Objetivo *
                  </Label>
                  <Input
                    id="objective"
                    value={formData.objective}
                    onChange={(e) =>
                      setFormData({ ...formData, objective: e.target.value })
                    }
                    placeholder="Hipertrofia"
                    required
                    className="text-base"
                  />
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="text-lg font-bold mb-4">Medidas Corporais</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="weight" className="text-base font-semibold">
                      Peso (kg)
                    </Label>
                    <Input
                      id="weight"
                      type="number"
                      step="0.1"
                      value={formData.weight}
                      onChange={(e) =>
                        setFormData({ ...formData, weight: e.target.value })
                      }
                      placeholder="70.5"
                      className="text-base"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bodyFat" className="text-base font-semibold">
                      % Gordura
                    </Label>
                    <Input
                      id="bodyFat"
                      type="number"
                      step="0.1"
                      value={formData.bodyFat}
                      onChange={(e) =>
                        setFormData({ ...formData, bodyFat: e.target.value })
                      }
                      placeholder="20"
                      className="text-base"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="muscleMass" className="text-base font-semibold">
                      % Massa Muscular
                    </Label>
                    <Input
                      id="muscleMass"
                      type="number"
                      step="0.1"
                      value={formData.muscleMass}
                      onChange={(e) =>
                        setFormData({ ...formData, muscleMass: e.target.value })
                      }
                      placeholder="45"
                      className="text-base"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bmi" className="text-base font-semibold">
                      IMC
                    </Label>
                    <Input
                      id="bmi"
                      type="number"
                      step="0.1"
                      value={formData.bmi}
                      onChange={(e) =>
                        setFormData({ ...formData, bmi: e.target.value })
                      }
                      placeholder="22.5"
                      className="text-base"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="restrictions" className="text-base font-semibold">
                  Observações / Restrições
                </Label>
                <Textarea
                  id="restrictions"
                  value={formData.restrictions}
                  onChange={(e) =>
                    setFormData({ ...formData, restrictions: e.target.value })
                  }
                  placeholder="Sem restrições"
                  rows={4}
                  className="text-base"
                />
              </div>
            </div>
          </Card>

          <div className="mt-6 flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/")}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="flex-1 gap-2 font-bold"
              disabled={saving}
            >
              <Save className="w-4 h-4" />
              {saving ? "Salvando..." : "Atualizar Aluno"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
