import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, CheckCircle2, Circle, Calendar } from "lucide-react";

export default function TarefasPage() {
  const [tasks] = useState([
    { id: 1, title: "Revisar contrato Social - Empresa ABC", done: false, priority: "alta", dueDate: "2024-12-10" },
    { id: 2, title: "Ligar para Cliente João Silva", done: false, priority: "média", dueDate: "2024-12-08" },
    { id: 3, title: "Enviar petição inicial - Processo 0001234", done: true, priority: "alta", dueDate: "2024-12-05" },
    { id: 4, title: "Preparar audiência de amanhã", done: false, priority: "alta", dueDate: "2024-12-07" },
    { id: 5, title: "Atualizar cadastro de clientes", done: false, priority: "baixa", dueDate: "2024-12-15" },
  ]);

  const pendingTasks = tasks.filter(t => !t.done);
  const completedTasks = tasks.filter(t => t.done);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "alta": return "text-red-600 bg-red-100";
      case "média": return "text-yellow-600 bg-yellow-100";
      case "baixa": return "text-green-600 bg-green-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-serif text-slate-800 mb-2">Tarefas</h1>
              <p className="text-slate-600">{pendingTasks.length} pendentes • {completedTasks.length} concluídas</p>
            </div>
            <Button className="bg-slate-800 hover:bg-slate-900">
              <Plus className="h-4 w-4 mr-2" />
              Nova Tarefa
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pending Tasks */}
          <div>
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Circle className="h-5 w-5 text-orange-600" />
              Pendentes ({pendingTasks.length})
            </h2>
            <div className="space-y-3">
              {pendingTasks.map((task) => (
                <Card key={task.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3">
                    <Checkbox className="mt-1" />
                    <div className="flex-1">
                      <h3 className="font-medium text-slate-800">{task.title}</h3>
                      <div className="flex items-center gap-3 mt-2">
                        <span className={`text-xs px-2 py-1 rounded-full font-semibold ${getPriorityColor(task.priority)}`}>
                          {task.priority.toUpperCase()}
                        </span>
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(task.dueDate).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Completed Tasks */}
          <div>
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              Concluídas ({completedTasks.length})
            </h2>
            <div className="space-y-3">
              {completedTasks.map((task) => (
                <Card key={task.id} className="p-4 bg-slate-50 opacity-75">
                  <div className="flex items-start gap-3">
                    <Checkbox checked className="mt-1" />
                    <div className="flex-1">
                      <h3 className="font-medium text-slate-600 line-through">{task.title}</h3>
                      <div className="flex items-center gap-3 mt-2">
                        <span className={`text-xs px-2 py-1 rounded-full font-semibold ${getPriorityColor(task.priority)}`}>
                          {task.priority.toUpperCase()}
                        </span>
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(task.dueDate).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
