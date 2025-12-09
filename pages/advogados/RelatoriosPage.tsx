import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  FileText, Download, Calendar, CheckCircle, Users, 
  Briefcase, Clock, TrendingUp, BarChart3 
} from "lucide-react";
import { toast } from "sonner";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";

// Registrar componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface AdvogadoStats {
  id: number;
  name: string;
  tarefasCumpridas: number;
  atendimentosRealizados: number;
  audienciasRealizadas: number;
  processosDistribuidos: number;
  prazosCumpridos: number;
  totalAtividades: number;
}

// Mock de dados semanais
const mockWeeklyStats: AdvogadoStats[] = [
  {
    id: 1,
    name: "Dr. Djair Rota",
    tarefasCumpridas: 12,
    atendimentosRealizados: 8,
    audienciasRealizadas: 3,
    processosDistribuidos: 5,
    prazosCumpridos: 10,
    totalAtividades: 38,
  },
  {
    id: 2,
    name: "Dra. Maria Silva",
    tarefasCumpridas: 15,
    atendimentosRealizados: 10,
    audienciasRealizadas: 4,
    processosDistribuidos: 7,
    prazosCumpridos: 12,
    totalAtividades: 48,
  },
  {
    id: 3,
    name: "Dr. João Santos",
    tarefasCumpridas: 8,
    atendimentosRealizados: 6,
    audienciasRealizadas: 2,
    processosDistribuidos: 3,
    prazosCumpridos: 7,
    totalAtividades: 26,
  },
];

export default function RelatoriosPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("week");
  const [selectedAdvogado, setSelectedAdvogado] = useState("all");
  const [stats, setStats] = useState<AdvogadoStats[]>(mockWeeklyStats);

  const filteredStats = selectedAdvogado === "all" 
    ? stats 
    : stats.filter((s) => s.id.toString() === selectedAdvogado);

  const totals = filteredStats.reduce(
    (acc, curr) => ({
      tarefasCumpridas: acc.tarefasCumpridas + curr.tarefasCumpridas,
      atendimentosRealizados: acc.atendimentosRealizados + curr.atendimentosRealizados,
      audienciasRealizadas: acc.audienciasRealizadas + curr.audienciasRealizadas,
      processosDistribuidos: acc.processosDistribuidos + curr.processosDistribuidos,
      prazosCumpridos: acc.prazosCumpridos + curr.prazosCumpridos,
      totalAtividades: acc.totalAtividades + curr.totalAtividades,
    }),
    {
      tarefasCumpridas: 0,
      atendimentosRealizados: 0,
      audienciasRealizadas: 0,
      processosDistribuidos: 0,
      prazosCumpridos: 0,
      totalAtividades: 0,
    }
  );

  const handleExportPDF = () => {
    toast.success("Relatório exportado para PDF!");
    console.log("Exportando relatório:", { selectedPeriod, selectedAdvogado, filteredStats });
  };

  const handleExportExcel = () => {
    toast.success("Relatório exportado para Excel!");
    console.log("Exportando relatório:", { selectedPeriod, selectedAdvogado, filteredStats });
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-serif text-slate-800 mb-2">Relatórios de Atividades</h1>
            <p className="text-slate-600">Acompanhe o desempenho da equipe</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleExportExcel}>
              <FileText className="h-4 w-4 mr-2" />
              Exportar Excel
            </Button>
            <Button onClick={handleExportPDF} className="bg-blue-600 hover:bg-blue-700">
              <Download className="h-4 w-4 mr-2" />
              Exportar PDF
            </Button>
          </div>
        </div>

        {/* Filtros */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Período</label>
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">Última Semana</SelectItem>
                    <SelectItem value="month">Último Mês</SelectItem>
                    <SelectItem value="quarter">Último Trimestre</SelectItem>
                    <SelectItem value="year">Último Ano</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Advogado</label>
                <Select value={selectedAdvogado} onValueChange={setSelectedAdvogado}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Advogados</SelectItem>
                    {mockWeeklyStats.map((adv) => (
                      <SelectItem key={adv.id} value={adv.id.toString()}>
                        {adv.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-full bg-green-100 text-green-600">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-1">{totals.tarefasCumpridas}</h3>
              <p className="text-sm font-medium text-slate-600">Tarefas Cumpridas</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                  <Users className="h-6 w-6" />
                </div>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-1">{totals.atendimentosRealizados}</h3>
              <p className="text-sm font-medium text-slate-600">Atendimentos Realizados</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                  <Calendar className="h-6 w-6" />
                </div>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-1">{totals.audienciasRealizadas}</h3>
              <p className="text-sm font-medium text-slate-600">Audiências Realizadas</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-full bg-orange-100 text-orange-600">
                  <Briefcase className="h-6 w-6" />
                </div>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-1">{totals.processosDistribuidos}</h3>
              <p className="text-sm font-medium text-slate-600">Processos Distribuídos</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-full bg-red-100 text-red-600">
                  <Clock className="h-6 w-6" />
                </div>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-1">{totals.prazosCumpridos}</h3>
              <p className="text-sm font-medium text-slate-600">Prazos Cumpridos</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-1">{totals.totalAtividades}</h3>
              <p className="text-sm font-medium text-slate-600">Total de Atividades</p>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos Interativos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Gráfico de Linha - Evolução Temporal */}
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-xl">Evolução de Atividades</CardTitle>
              <CardDescription>Últimas 4 semanas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <Line
                  data={{
                    labels: ["Semana 1", "Semana 2", "Semana 3", "Semana 4"],
                    datasets: [
                      {
                        label: "Tarefas Cumpridas",
                        data: [8, 10, 12, 15],
                        borderColor: "rgb(34, 197, 94)",
                        backgroundColor: "rgba(34, 197, 94, 0.1)",
                        tension: 0.4,
                      },
                      {
                        label: "Atendimentos",
                        data: [5, 7, 8, 10],
                        borderColor: "rgb(59, 130, 246)",
                        backgroundColor: "rgba(59, 130, 246, 0.1)",
                        tension: 0.4,
                      },
                      {
                        label: "Audiências",
                        data: [2, 3, 3, 4],
                        borderColor: "rgb(168, 85, 247)",
                        backgroundColor: "rgba(168, 85, 247, 0.1)",
                        tension: 0.4,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "top" as const,
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Gráfico de Barras - Comparação por Advogado */}
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-xl">Comparação por Advogado</CardTitle>
              <CardDescription>Total de atividades no período</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <Bar
                  data={{
                    labels: filteredStats.map((s) => s.name.split(" ")[1] || s.name),
                    datasets: [
                      {
                        label: "Tarefas",
                        data: filteredStats.map((s) => s.tarefasCumpridas),
                        backgroundColor: "rgba(34, 197, 94, 0.8)",
                      },
                      {
                        label: "Atendimentos",
                        data: filteredStats.map((s) => s.atendimentosRealizados),
                        backgroundColor: "rgba(59, 130, 246, 0.8)",
                      },
                      {
                        label: "Audiências",
                        data: filteredStats.map((s) => s.audienciasRealizadas),
                        backgroundColor: "rgba(168, 85, 247, 0.8)",
                      },
                      {
                        label: "Processos",
                        data: filteredStats.map((s) => s.processosDistribuidos),
                        backgroundColor: "rgba(249, 115, 22, 0.8)",
                      },
                      {
                        label: "Prazos",
                        data: filteredStats.map((s) => s.prazosCumpridos),
                        backgroundColor: "rgba(239, 68, 68, 0.8)",
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "top" as const,
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabela Detalhada */}
        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-xl">Detalhamento por Advogado</CardTitle>
            <CardDescription>Atividades desenvolvidas no período selecionado</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Advogado</th>
                    <th className="text-center py-3 px-4 font-semibold text-slate-700">Tarefas</th>
                    <th className="text-center py-3 px-4 font-semibold text-slate-700">Atendimentos</th>
                    <th className="text-center py-3 px-4 font-semibold text-slate-700">Audiências</th>
                    <th className="text-center py-3 px-4 font-semibold text-slate-700">Processos</th>
                    <th className="text-center py-3 px-4 font-semibold text-slate-700">Prazos</th>
                    <th className="text-center py-3 px-4 font-semibold text-slate-700">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStats.map((stat) => (
                    <tr key={stat.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4 font-medium text-slate-800">{stat.name}</td>
                      <td className="py-3 px-4 text-center text-slate-700">{stat.tarefasCumpridas}</td>
                      <td className="py-3 px-4 text-center text-slate-700">{stat.atendimentosRealizados}</td>
                      <td className="py-3 px-4 text-center text-slate-700">{stat.audienciasRealizadas}</td>
                      <td className="py-3 px-4 text-center text-slate-700">{stat.processosDistribuidos}</td>
                      <td className="py-3 px-4 text-center text-slate-700">{stat.prazosCumpridos}</td>
                      <td className="py-3 px-4 text-center font-bold text-slate-800">{stat.totalAtividades}</td>
                    </tr>
                  ))}
                  {filteredStats.length > 1 && (
                    <tr className="bg-slate-50 font-bold">
                      <td className="py-3 px-4 text-slate-900">TOTAL</td>
                      <td className="py-3 px-4 text-center text-slate-900">{totals.tarefasCumpridas}</td>
                      <td className="py-3 px-4 text-center text-slate-900">{totals.atendimentosRealizados}</td>
                      <td className="py-3 px-4 text-center text-slate-900">{totals.audienciasRealizadas}</td>
                      <td className="py-3 px-4 text-center text-slate-900">{totals.processosDistribuidos}</td>
                      <td className="py-3 px-4 text-center text-slate-900">{totals.prazosCumpridos}</td>
                      <td className="py-3 px-4 text-center text-slate-900">{totals.totalAtividades}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
