import { useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { 
  Chart as ChartJS, 
  ArcElement, 
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip, 
  Legend 
} from 'chart.js';
import { Pie, Doughnut, Line, Bar } from 'react-chartjs-2';
import { FileText, Users, TrendingUp, Calendar } from "lucide-react";
import { format, parseISO, startOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";

// Registrar componentes do Chart.js
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface DocumentItem {
  id: number;
  clientId: number;
  clientName: string;
  fileName: string;
  uploadDate: string;
  tags?: string[];
}

export default function EstatisticasPage() {
  // Carregar documentos do localStorage
  const allDocuments: DocumentItem[] = useMemo(() => {
    const docs = JSON.parse(localStorage.getItem('documents') || '[]');
    return docs;
  }, []);

  // Estatísticas gerais
  const stats = useMemo(() => {
    const totalDocs = allDocuments.length;
    const uniqueClients = new Set(allDocuments.map(d => d.clientId)).size;
    
    // Calcular média de documentos por cliente
    const avgDocsPerClient = uniqueClients > 0 ? (totalDocs / uniqueClients).toFixed(1) : '0';
    
    // Documentos do mês atual
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const docsThisMonth = allDocuments.filter(doc => {
      const docDate = parseISO(doc.uploadDate);
      return docDate.getMonth() === currentMonth && docDate.getFullYear() === currentYear;
    }).length;

    return {
      total: totalDocs,
      clients: uniqueClients,
      avgPerClient: avgDocsPerClient,
      thisMonth: docsThisMonth
    };
  }, [allDocuments]);

  // Dados para gráfico de pizza - Distribuição por tags
  const tagDistribution = useMemo(() => {
    const tagCounts: Record<string, number> = {};
    
    allDocuments.forEach(doc => {
      if (doc.tags && doc.tags.length > 0) {
        doc.tags.forEach(tag => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      } else {
        tagCounts['Sem Tag'] = (tagCounts['Sem Tag'] || 0) + 1;
      }
    });

    const labels = Object.keys(tagCounts);
    const data = Object.values(tagCounts);
    
    return {
      labels,
      datasets: [{
        label: 'Documentos',
        data,
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',   // red
          'rgba(59, 130, 246, 0.8)',  // blue
          'rgba(168, 85, 247, 0.8)',  // purple
          'rgba(34, 197, 94, 0.8)',   // green
          'rgba(251, 191, 36, 0.8)',  // amber
          'rgba(6, 182, 212, 0.8)',   // cyan
          'rgba(99, 102, 241, 0.8)',  // indigo
          'rgba(236, 72, 153, 0.8)',  // pink
          'rgba(249, 115, 22, 0.8)',  // orange
          'rgba(20, 184, 166, 0.8)',  // teal
          'rgba(148, 163, 184, 0.8)', // slate
        ],
        borderColor: [
          'rgba(239, 68, 68, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(168, 85, 247, 1)',
          'rgba(34, 197, 94, 1)',
          'rgba(251, 191, 36, 1)',
          'rgba(6, 182, 212, 1)',
          'rgba(99, 102, 241, 1)',
          'rgba(236, 72, 153, 1)',
          'rgba(249, 115, 22, 1)',
          'rgba(20, 184, 166, 1)',
          'rgba(148, 163, 184, 1)',
        ],
        borderWidth: 2,
      }]
    };
  }, [allDocuments]);

  // Dados para gráfico de rosca - Tipos de arquivo
  const fileTypeDistribution = useMemo(() => {
    const typeCounts: Record<string, number> = {
      'PDF': 0,
      'Imagens': 0,
      'Documentos': 0,
      'Outros': 0
    };

    allDocuments.forEach(doc => {
      const ext = doc.fileName.split('.').pop()?.toLowerCase();
      if (ext === 'pdf') {
        typeCounts['PDF']++;
      } else if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) {
        typeCounts['Imagens']++;
      } else if (['doc', 'docx', 'txt', 'odt'].includes(ext || '')) {
        typeCounts['Documentos']++;
      } else {
        typeCounts['Outros']++;
      }
    });

    return {
      labels: Object.keys(typeCounts),
      datasets: [{
        label: 'Arquivos',
        data: Object.values(typeCounts),
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(148, 163, 184, 0.8)',
        ],
        borderColor: [
          'rgba(239, 68, 68, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(34, 197, 94, 1)',
          'rgba(148, 163, 184, 1)',
        ],
        borderWidth: 2,
      }]
    };
  }, [allDocuments]);

  // Dados para gráfico de linha - Uploads por mês (últimos 6 meses)
  const monthlyUploads = useMemo(() => {
    const monthCounts: Record<string, number> = {};
    const now = new Date();
    
    // Inicializar últimos 6 meses
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = format(date, 'MMM/yyyy', { locale: ptBR });
      monthCounts[key] = 0;
    }

    // Contar documentos por mês
    allDocuments.forEach(doc => {
      const docDate = parseISO(doc.uploadDate);
      const monthStart = startOfMonth(docDate);
      const key = format(monthStart, 'MMM/yyyy', { locale: ptBR });
      
      if (key in monthCounts) {
        monthCounts[key]++;
      }
    });

    return {
      labels: Object.keys(monthCounts),
      datasets: [{
        label: 'Uploads',
        data: Object.values(monthCounts),
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 5,
        pointHoverRadius: 7,
      }]
    };
  }, [allDocuments]);

  // Dados para gráfico de barras - Top 5 clientes
  const topClients = useMemo(() => {
    const clientCounts: Record<string, { name: string; count: number }> = {};

    allDocuments.forEach(doc => {
      const key = doc.clientId.toString();
      if (!clientCounts[key]) {
        clientCounts[key] = {
          name: doc.clientName || `Cliente ${doc.clientId}`,
          count: 0
        };
      }
      clientCounts[key].count++;
    });

    // Ordenar e pegar top 5
    const sorted = Object.values(clientCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      labels: sorted.map(c => c.name),
      datasets: [{
        label: 'Documentos',
        data: sorted.map(c => c.count),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 2,
      }]
    };
  }, [allDocuments]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Estatísticas de Documentos</h1>
          <p className="text-slate-600">Análise completa do uso e distribuição dos documentos</p>
        </div>

        {/* Cards de Estatísticas Gerais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total de Documentos</p>
                <p className="text-3xl font-bold text-slate-800 mt-2">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Clientes Ativos</p>
                <p className="text-3xl font-bold text-slate-800 mt-2">{stats.clients}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Média por Cliente</p>
                <p className="text-3xl font-bold text-slate-800 mt-2">{stats.avgPerClient}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Este Mês</p>
                <p className="text-3xl font-bold text-slate-800 mt-2">{stats.thisMonth}</p>
              </div>
              <div className="p-3 bg-amber-100 rounded-lg">
                <Calendar className="h-8 w-8 text-amber-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Gráficos - Linha 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico de Pizza - Tags */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Distribuição por Tags</h2>
            <div className="h-[300px]">
              <Pie data={tagDistribution} options={chartOptions} />
            </div>
          </Card>

          {/* Gráfico de Rosca - Tipos de Arquivo */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Tipos de Arquivo</h2>
            <div className="h-[300px]">
              <Doughnut data={fileTypeDistribution} options={chartOptions} />
            </div>
          </Card>
        </div>

        {/* Gráficos - Linha 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico de Linha - Uploads Mensais */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Uploads por Mês</h2>
            <div className="h-[300px]">
              <Line data={monthlyUploads} options={chartOptions} />
            </div>
          </Card>

          {/* Gráfico de Barras - Top Clientes */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Top 5 Clientes</h2>
            <div className="h-[300px]">
              <Bar 
                data={topClients} 
                options={{
                  ...chartOptions,
                  indexAxis: 'y' as const,
                }} 
              />
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
