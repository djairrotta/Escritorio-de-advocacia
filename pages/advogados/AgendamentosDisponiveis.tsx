import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, Plus, Trash2, CheckCircle, XCircle, Edit } from "lucide-react";
import { toast } from "sonner";
import FormModal from "@/components/FormModal";
import { mockUsers } from "@/data/mockData";

interface TimeSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  advogadoId: string;
  advogadoName: string;
  status: "disponivel" | "solicitado" | "confirmado";
  clienteName?: string;
  clienteEmail?: string;
}

export default function AgendamentosDisponiveis() {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<TimeSlot | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
  const [formData, setFormData] = useState({
    date: "",
    startTime: "",
    endTime: "",
    advogadoId: "",
  });

  const currentUserRole = localStorage.getItem("advogado_role") || "Advogado";
  const currentUserEmail = localStorage.getItem("advogado_email") || "";
  
  // Debug
  console.log("[Agendamentos] Role:", currentUserRole);
  console.log("[Agendamentos] Email:", currentUserEmail);
  
  // Master sempre tem acesso, independente do role
  const canManage = currentUserEmail === "admin@djairrotta.com.br" || currentUserRole === "Master" || currentUserRole === "Moderador";

  // Carregar horários do localStorage
  useEffect(() => {
    const saved = localStorage.getItem("available_time_slots");
    if (saved) {
      setTimeSlots(JSON.parse(saved));
    }
  }, []);

  // Salvar no localStorage sempre que mudar
  const saveTimeSlots = (slots: TimeSlot[]) => {
    setTimeSlots(slots);
    localStorage.setItem("available_time_slots", JSON.stringify(slots));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!canManage) {
      toast.error("Você não tem permissão para gerenciar agendamentos");
      return;
    }

    const advogado = mockUsers.find((u) => u.id === parseInt(formData.advogadoId));
    if (!advogado) {
      toast.error("Advogado não encontrado");
      return;
    }

    if (editingSlot) {
      // Editar horário existente
      const updated = timeSlots.map((slot) =>
        slot.id === editingSlot.id
          ? {
              ...slot,
              date: formData.date,
              startTime: formData.startTime,
              endTime: formData.endTime,
              advogadoId: formData.advogadoId,
              advogadoName: advogado.name,
            }
          : slot
      );
      saveTimeSlots(updated);
      toast.success("Horário atualizado com sucesso!");
      setEditingSlot(null);
    } else {
      // Criar novo horário
      const newSlot: TimeSlot = {
        id: Date.now().toString(),
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        advogadoId: formData.advogadoId,
        advogadoName: advogado.name,
        status: "disponivel",
      };

      const updated = [...timeSlots, newSlot];
      saveTimeSlots(updated);
      toast.success("Horário disponibilizado com sucesso!");
    }

    setModalOpen(false);
    setFormData({ date: "", startTime: "", endTime: "", advogadoId: "" });
  };

  const handleEdit = (slot: TimeSlot) => {
    if (!canManage) {
      toast.error("Você não tem permissão para editar agendamentos");
      return;
    }

    setEditingSlot(slot);
    setFormData({
      date: slot.date,
      startTime: slot.startTime,
      endTime: slot.endTime,
      advogadoId: slot.advogadoId,
    });
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (!canManage) {
      toast.error("Você não tem permissão para excluir agendamentos");
      return;
    }

    if (confirm("Tem certeza que deseja excluir este horário?")) {
      const updated = timeSlots.filter((slot) => slot.id !== id);
      saveTimeSlots(updated);
      toast.success("Horário excluído");
    }
  };

  const handleApprove = (id: string) => {
    if (!canManage) {
      toast.error("Você não tem permissão para aprovar agendamentos");
      return;
    }

    const updated = timeSlots.map((slot) =>
      slot.id === id ? { ...slot, status: "confirmado" as const } : slot
    );
    saveTimeSlots(updated);
    toast.success("Agendamento confirmado!");
  };

  const handleReject = (id: string) => {
    if (!canManage) {
      toast.error("Você não tem permissão para rejeitar agendamentos");
      return;
    }

    const updated = timeSlots.map((slot) =>
      slot.id === id ? { ...slot, status: "disponivel" as const, clienteName: undefined, clienteEmail: undefined } : slot
    );
    saveTimeSlots(updated);
    toast.success("Solicitação rejeitada");
  };

  // Filtrar por mês selecionado
  const filteredSlots = timeSlots.filter((slot) => slot.date.startsWith(selectedMonth));

  // Agrupar por status
  const disponiveisSlots = filteredSlots.filter((s) => s.status === "disponivel");
  const solicitadosSlots = filteredSlots.filter((s) => s.status === "solicitado");
  const confirmadosSlots = filteredSlots.filter((s) => s.status === "confirmado");

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-serif text-slate-800 mb-2">Agendamentos Disponíveis</h1>
            <p className="text-slate-600">Gerencie horários disponíveis para consultas</p>
          </div>
          {canManage && (
            <Button
              onClick={() => setModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Horário
            </Button>
          )}
        </div>

        {/* Filtro de Mês */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Label htmlFor="month">Filtrar por Mês:</Label>
              <Input
                id="month"
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-48"
              />
              <div className="ml-auto flex gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-slate-600">Disponível ({disponiveisSlots.length})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span className="text-slate-600">Solicitado ({solicitadosSlots.length})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-slate-600">Confirmado ({confirmadosSlots.length})</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Solicitações Pendentes */}
        {solicitadosSlots.length > 0 && (
          <Card className="mb-8 border-yellow-300">
            <CardHeader>
              <CardTitle className="text-xl font-serif text-yellow-700">Solicitações Pendentes</CardTitle>
              <CardDescription>Aguardando aprovação</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {solicitadosSlots.map((slot) => (
                  <div
                    key={slot.id}
                    className="flex items-center justify-between p-4 border border-yellow-200 rounded-lg bg-yellow-50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                        <Calendar className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-800">
                            {new Date(slot.date + "T00:00:00").toLocaleDateString("pt-BR")}
                          </span>
                          <span className="text-slate-600">•</span>
                          <span className="text-slate-600">
                            {slot.startTime} - {slot.endTime}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 mt-1">
                          Advogado: {slot.advogadoName}
                        </p>
                        <p className="text-sm text-yellow-700 font-medium mt-1">
                          Cliente: {slot.clienteName} ({slot.clienteEmail})
                        </p>
                      </div>
                    </div>
                    {canManage && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleApprove(slot.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Aprovar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReject(slot.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Rejeitar
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Horários Disponíveis */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl font-serif">Horários Disponíveis</CardTitle>
            <CardDescription>Horários liberados para agendamento</CardDescription>
          </CardHeader>
          <CardContent>
            {disponiveisSlots.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum horário disponível neste mês</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {disponiveisSlots.map((slot) => (
                  <div
                    key={slot.id}
                    className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-full bg-green-100 text-green-600">
                        <Clock className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-800">
                            {new Date(slot.date + "T00:00:00").toLocaleDateString("pt-BR")}
                          </span>
                          <span className="text-slate-600">•</span>
                          <span className="text-slate-600">
                            {slot.startTime} - {slot.endTime}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 mt-1">
                          Advogado: {slot.advogadoName}
                        </p>
                      </div>
                    </div>
                    {canManage && (
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(slot)}
                          className="text-blue-600 hover:text-blue-700"
                          title="Editar horário"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(slot.id)}
                          className="text-red-600 hover:text-red-700"
                          title="Excluir horário"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Agendamentos Confirmados */}
        {confirmadosSlots.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-serif text-blue-700">Agendamentos Confirmados</CardTitle>
              <CardDescription>Consultas agendadas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {confirmadosSlots.map((slot) => (
                  <div
                    key={slot.id}
                    className="flex items-center justify-between p-4 border border-blue-200 rounded-lg bg-blue-50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                        <CheckCircle className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-800">
                            {new Date(slot.date + "T00:00:00").toLocaleDateString("pt-BR")}
                          </span>
                          <span className="text-slate-600">•</span>
                          <span className="text-slate-600">
                            {slot.startTime} - {slot.endTime}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 mt-1">
                          Advogado: {slot.advogadoName}
                        </p>
                        <p className="text-sm text-blue-700 font-medium mt-1">
                          Cliente: {slot.clienteName} ({slot.clienteEmail})
                        </p>
                      </div>
                    </div>
                    {canManage && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(slot.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Modal de Adicionar Horário */}
      <FormModal
        open={modalOpen}
        onOpenChange={(open) => {
          setModalOpen(open);
          if (!open) {
            setEditingSlot(null);
            setFormData({ date: "", startTime: "", endTime: "", advogadoId: "" });
          }
        }}
        title={editingSlot ? "Editar Horário" : "Adicionar Horário Disponível"}
        description={editingSlot ? "Atualize as informações do horário" : "Libere um horário para consultas"}
      >
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Label htmlFor="date">Data *</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startTime">Horário Início *</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="endTime">Horário Fim *</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="advogado">Advogado *</Label>
            <Select
              value={formData.advogadoId}
              onValueChange={(value) => setFormData({ ...formData, advogadoId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um advogado" />
              </SelectTrigger>
              <SelectContent>
                {mockUsers.map((user) => (
                  <SelectItem key={user.id} value={user.id.toString()}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setModalOpen(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
              {editingSlot ? "Salvar Alterações" : "Adicionar"}
            </Button>
          </div>
        </form>
      </FormModal>
    </DashboardLayout>
  );
}
