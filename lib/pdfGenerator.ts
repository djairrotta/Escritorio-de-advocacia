import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import type { LegalCase, Hearing, Client } from "@/types";

// Configuração de cores do escritório
const COLORS = {
  primary: "#1e293b", // slate-800
  secondary: "#64748b", // slate-500
  accent: "#3b82f6", // blue-600
  text: "#334155", // slate-700
  lightGray: "#f1f5f9", // slate-100
};

// Adiciona cabeçalho padrão
function addHeader(doc: jsPDF, title: string) {
  // Logo (se disponível)
  doc.setFontSize(20);
  doc.setTextColor(COLORS.primary);
  doc.setFont("helvetica", "bold");
  doc.text("Djair Rota Advogados", 20, 20);
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(COLORS.secondary);
  doc.text("Rua Exemplo, 123 - Mococa/SP", 20, 27);
  doc.text("Tel: (19) 3656-0000 | contato@djairrotta.com.br", 20, 32);
  
  // Linha separadora
  doc.setDrawColor(COLORS.accent);
  doc.setLineWidth(0.5);
  doc.line(20, 38, 190, 38);
  
  // Título do relatório
  doc.setFontSize(16);
  doc.setTextColor(COLORS.primary);
  doc.setFont("helvetica", "bold");
  doc.text(title, 20, 48);
  
  // Data de geração
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(COLORS.secondary);
  doc.text(`Gerado em: ${new Date().toLocaleString("pt-BR")}`, 20, 54);
}

// Adiciona rodapé padrão
function addFooter(doc: jsPDF, pageNumber: number) {
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(8);
  doc.setTextColor(COLORS.secondary);
  doc.text(
    `Página ${pageNumber} | Documento confidencial - Djair Rota Advogados`,
    105,
    pageHeight - 10,
    { align: "center" }
  );
}

// Relatório de Processo
export function generateProcessReport(legalCase: LegalCase, client?: Client) {
  const doc = new jsPDF();
  
  addHeader(doc, "Relatório de Processo");
  
  let yPos = 65;
  
  // Informações do Processo
  doc.setFontSize(12);
  doc.setTextColor(COLORS.primary);
  doc.setFont("helvetica", "bold");
  doc.text("Dados do Processo", 20, yPos);
  yPos += 8;
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(COLORS.text);
  
  const processInfo = [
    [`Número do Processo:`, legalCase.caseNumber],
    [`Título:`, legalCase.title],
    [`Área:`, legalCase.area],
    [`Status:`, legalCase.status],
    [`Data de Abertura:`, new Date(legalCase.createdAt).toLocaleDateString("pt-BR")],
    [`Advogado Responsável:`, legalCase.assignedTo?.name || "Não atribuído"],
  ];
  
  processInfo.forEach(([label, value]) => {
    doc.setFont("helvetica", "bold");
    doc.text(label, 20, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(value, 80, yPos);
    yPos += 6;
  });
  
  // Informações do Cliente (se disponível)
  if (client) {
    yPos += 5;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(COLORS.primary);
    doc.text("Dados do Cliente", 20, yPos);
    yPos += 8;
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(COLORS.text);
    
    const clientInfo = [
      [`Nome:`, client.name],
      [`CPF:`, client.cpf || "N/A"],
      [`E-mail:`, client.email || "N/A"],
      [`Telefone:`, client.phone || "N/A"],
    ];
    
    clientInfo.forEach(([label, value]) => {
      doc.setFont("helvetica", "bold");
      doc.text(label, 20, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(value, 60, yPos);
      yPos += 6;
    });
  }
  
  // Descrição
  if (legalCase.description) {
    yPos += 5;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(COLORS.primary);
    doc.text("Descrição", 20, yPos);
    yPos += 8;
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(COLORS.text);
    const splitDescription = doc.splitTextToSize(legalCase.description, 170);
    doc.text(splitDescription, 20, yPos);
  }
  
  addFooter(doc, 1);
  
  // Salva o PDF
  doc.save(`Processo_${legalCase.caseNumber.replace(/\//g, "-")}.pdf`);
}

// Relatório de Audiências
export function generateHearingsReport(hearings: Hearing[]) {
  const doc = new jsPDF();
  
  addHeader(doc, "Relatório de Audiências");
  
  // Tabela de audiências
  const tableData = hearings.map(h => [
    h.caseNumber,
    h.caseTitle,
    new Date(h.date).toLocaleDateString("pt-BR"),
    new Date(h.date).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    h.location,
    h.completed ? "Concluída" : "Pendente",
  ]);
  
  autoTable(doc, {
    startY: 65,
    head: [["Processo", "Título", "Data", "Horário", "Local", "Status"]],
    body: tableData,
    theme: "grid",
    headStyles: {
      fillColor: COLORS.primary,
      textColor: "#ffffff",
      fontSize: 10,
      fontStyle: "bold",
    },
    bodyStyles: {
      fontSize: 9,
      textColor: COLORS.text,
    },
    alternateRowStyles: {
      fillColor: COLORS.lightGray,
    },
    margin: { left: 20, right: 20 },
  });
  
  addFooter(doc, 1);
  
  doc.save(`Audiencias_${new Date().toISOString().split("T")[0]}.pdf`);
}

// Relatório de Atividades de Advogado
export function generateLawyerActivityReport(
  lawyerName: string,
  cases: LegalCase[],
  hearings: Hearing[]
) {
  const doc = new jsPDF();
  
  addHeader(doc, `Relatório de Atividades - ${lawyerName}`);
  
  let yPos = 65;
  
  // Resumo
  doc.setFontSize(12);
  doc.setTextColor(COLORS.primary);
  doc.setFont("helvetica", "bold");
  doc.text("Resumo de Atividades", 20, yPos);
  yPos += 10;
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(COLORS.text);
  
  const summary = [
    [`Total de Processos:`, cases.length.toString()],
    [`Processos Ativos:`, cases.filter(c => c.status === "ativo").length.toString()],
    [`Processos Concluídos:`, cases.filter(c => c.status === "concluído").length.toString()],
    [`Audiências Agendadas:`, hearings.filter(h => !h.completed).length.toString()],
    [`Audiências Realizadas:`, hearings.filter(h => h.completed).length.toString()],
  ];
  
  summary.forEach(([label, value]) => {
    doc.setFont("helvetica", "bold");
    doc.text(label, 20, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(value, 100, yPos);
    yPos += 6;
  });
  
  // Processos por Área
  yPos += 10;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(COLORS.primary);
  doc.text("Distribuição por Área", 20, yPos);
  yPos += 10;
  
  const areaCount: Record<string, number> = {};
  cases.forEach(c => {
    areaCount[c.area] = (areaCount[c.area] || 0) + 1;
  });
  
  Object.entries(areaCount).forEach(([area, count]) => {
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(COLORS.text);
    doc.text(`${area}: ${count} processo(s)`, 20, yPos);
    yPos += 6;
  });
  
  // Lista de Processos
  yPos += 10;
  if (yPos > 250) {
    doc.addPage();
    yPos = 20;
  }
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(COLORS.primary);
  doc.text("Processos Atribuídos", 20, yPos);
  yPos += 5;
  
  const casesTableData = cases.map(c => [
    c.caseNumber,
    c.title,
    c.area,
    c.status,
    new Date(c.createdAt).toLocaleDateString("pt-BR"),
  ]);
  
  autoTable(doc, {
    startY: yPos,
    head: [["Número", "Título", "Área", "Status", "Data"]],
    body: casesTableData,
    theme: "grid",
    headStyles: {
      fillColor: COLORS.primary,
      textColor: "#ffffff",
      fontSize: 9,
      fontStyle: "bold",
    },
    bodyStyles: {
      fontSize: 8,
      textColor: COLORS.text,
    },
    alternateRowStyles: {
      fillColor: COLORS.lightGray,
    },
    margin: { left: 20, right: 20 },
  });
  
  addFooter(doc, 1);
  
  doc.save(`Atividades_${lawyerName.replace(/\s/g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`);
}

// Relatório Geral do Escritório
export function generateOfficeReport(
  totalCases: number,
  totalClients: number,
  totalHearings: number,
  casesByArea: Record<string, number>
) {
  const doc = new jsPDF();
  
  addHeader(doc, "Relatório Geral do Escritório");
  
  let yPos = 65;
  
  // Estatísticas Gerais
  doc.setFontSize(12);
  doc.setTextColor(COLORS.primary);
  doc.setFont("helvetica", "bold");
  doc.text("Estatísticas Gerais", 20, yPos);
  yPos += 10;
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(COLORS.text);
  
  const stats = [
    [`Total de Processos:`, totalCases.toString()],
    [`Total de Clientes:`, totalClients.toString()],
    [`Total de Audiências:`, totalHearings.toString()],
  ];
  
  stats.forEach(([label, value]) => {
    doc.setFont("helvetica", "bold");
    doc.text(label, 20, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(value, 100, yPos);
    yPos += 6;
  });
  
  // Processos por Área
  yPos += 10;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(COLORS.primary);
  doc.text("Processos por Área de Atuação", 20, yPos);
  yPos += 5;
  
  const areaTableData = Object.entries(casesByArea).map(([area, count]) => [
    area,
    count.toString(),
    `${((count / totalCases) * 100).toFixed(1)}%`,
  ]);
  
  autoTable(doc, {
    startY: yPos,
    head: [["Área", "Quantidade", "Percentual"]],
    body: areaTableData,
    theme: "grid",
    headStyles: {
      fillColor: COLORS.primary,
      textColor: "#ffffff",
      fontSize: 10,
      fontStyle: "bold",
    },
    bodyStyles: {
      fontSize: 9,
      textColor: COLORS.text,
    },
    alternateRowStyles: {
      fillColor: COLORS.lightGray,
    },
    margin: { left: 20, right: 20 },
  });
  
  addFooter(doc, 1);
  
  doc.save(`Relatorio_Geral_${new Date().toISOString().split("T")[0]}.pdf`);
}
