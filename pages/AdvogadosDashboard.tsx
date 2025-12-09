import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, Calendar, Users, FileText, Clock, TrendingUp, AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { mockLegalCases, mockHearings, mockActivities, mockClients } from "@/data/mockData";

export default function AdvogadosDashboard() {
  const userName = localStorage.getItem("advogado_name") || "Advogado";
  const userRole = localStorage.getItem("advogado_role") || "Advogado";

  // Estatísticas baseadas nos dados mockados
  const stats = [
    { 
      title: "Processos Ativos", 
      value: mockLegalCases.filter(c => c.status === "ativo").length,
      icon: Briefcase, 
      color: "text-blue-600", 
      bg: "bg-blue-100",
      trend: "+12% este mês"
    },
    { 
      title: "Próximas Audiências", 
      value: mockHearings.filter(h => !h.completed).length,
      icon: Calendar, 
      color: "text-purple-600", 
      bg: "bg-purple-100",
      trend: "3 esta semana"
    },
    { 
      title: "Clientes Ativos", 
      value: mockClients.length,
      icon: Users, 
      color: "text-green-600", 
      bg: "bg-green-100",
      trend: "+5 este mês"
    },
    { 
      title: "Total de Processos", 
      value: mockLegalCases.length,
      icon: FileText, 
      color: "text-orange-600", 
      bg: "bg-orange-100",
      trend: "6 ativos"
    }
  ];

  // Próximas audiências (não concluídas)
  const upcomingHearings = mockHearings
    .filter(h => !h.completed)
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 3);

  // Atividades recentes
  const recentActivities = mockActivities.slice(0, 5);

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif text-slate-800 mb-2">Olá, {userName}</h1>
          <p className="text-slate-600">
            Bem-vindo ao painel administrativo. Você está logado como <span className="font-semibold">{userRole}</span>.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="border-slate-200 shadow-sm hover:shadow-md transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-full ${stat.bg} ${stat.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-1">{stat.value}</h3>
                  <p className="text-sm font-medium text-slate-600 mb-1">{stat.title}</p>
                  <p className="text-xs text-slate-500">{stat.trend}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Atividades Recentes */}
          <div className="lg:col-span-2">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="font-serif text-xl text-slate-800">Atividades Recentes</CardTitle>
                <CardDescription>Últimas movimentações do sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-4 pb-4 border-b border-slate-200 last:border-0">
                      <div className="mt-1 bg-slate-100 p-2 rounded-full">
                        <Clock className="h-4 w-4 text-slate-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-800">{activity.title}</p>
                        <p className="text-xs text-slate-600 mt-1">{activity.description}</p>
                        <p className="text-xs text-slate-500 mt-1">
                          {activity.timestamp.toLocaleString("pt-BR")} • {activity.user}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4" asChild>
                  <Link href="/advogados/processos">
                    Ver Todos os Processos
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Próximas Audiências */}
          <div>
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="font-serif text-xl text-slate-800">Próximas Audiências</CardTitle>
                <CardDescription>{upcomingHearings.length} agendadas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingHearings.length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-sm text-slate-500">Nenhuma audiência agendada</p>
                    </div>
                  ) : (
                    upcomingHearings.map((hearing) => (
                      <div key={hearing.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="flex items-start gap-3">
                          <div className="text-center px-3 py-1 bg-white rounded border border-slate-200 min-w-[60px]">
                            <span className="block text-xs font-bold text-slate-500 uppercase">
                              {hearing.date.toLocaleDateString("pt-BR", { month: "short" })}
                            </span>
                            <span className="block text-xl font-bold text-slate-800">
                              {hearing.date.getDate()}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-sm text-slate-800 truncate">{hearing.caseTitle}</h4>
                            <p className="text-xs text-slate-600 mt-1">{hearing.location}</p>
                            <p className="text-xs text-slate-500 mt-1">
                              {hearing.date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <Button variant="outline" className="w-full mt-4" asChild>
                  <Link href="/advogados/audiencias">
                    Ver Todas as Audiências
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-slate-200 shadow-sm mt-6">
              <CardHeader>
                <CardTitle className="font-serif text-xl text-slate-800">Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/advogados/processos">
                    <FileText className="h-4 w-4 mr-2" />
                    Novo Processo
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/advogados/clientes">
                    <Users className="h-4 w-4 mr-2" />
                    Novo Cliente
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/advogados/audiencias">
                    <Calendar className="h-4 w-4 mr-2" />
                    Agendar Audiência
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Alert for Master/Moderador */}
        {(userRole === "Master" || userRole === "Moderador") && (
          <Card className="border-amber-200 bg-amber-50 mt-8">
            <CardContent className="p-4 flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-amber-900">Permissões Administrativas Ativas</p>
                <p className="text-xs text-amber-700">
                  Você possui permissões para criar, editar e excluir registros. Todas as ações são registradas em logs de auditoria.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
