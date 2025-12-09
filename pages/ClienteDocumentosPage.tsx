import { useState, useMemo } from "react";
import { useRoute } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { 
  Search, 
  Download, 
  Trash2, 
  FileText, 
  Image as ImageIcon, 
  File,
  Eye,
  Filter,
  Calendar,
  FileSearch
} from "lucide-react";
import { toast } from "sonner";
import { canPerformCriticalOperation, logAuditAction } from "@/lib/permissions";
import { mockClients } from "@/data/mockData";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DocumentViewer from "@/components/DocumentViewer";
import DateRangePicker from "@/components/DateRangePicker";
import TagSelector from "@/components/TagSelector";
import { extractTextSnippets, highlightKeyword, countOccurrences } from "@/lib/textHighlight";
import { getTagConfig } from "@/lib/documentTags";
import { DateRange } from "react-day-picker";
import { isWithinInterval, parseISO } from "date-fns";

interface DocumentItem {
  id: number;
  clientId: number;
  clientName: string;
  fileName: string;
  fileUrl: string;
  fileSize: string;
  fileType: string;
  uploadDate: string;
  uploadedBy: string;
  extractedText?: string | null;
  tags?: string[];
}

export default function ClienteDocumentosPage() {
  const [, params] = useRoute("/advogados/clientes/:id/documentos");
  const clientId = params?.id ? parseInt(params.id) : null;
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [searchInContent, setSearchInContent] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [previewDoc, setPreviewDoc] = useState<DocumentItem | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  // Buscar cliente
  const client = mockClients.find(c => c.id === clientId);

  // Buscar documentos do localStorage (simulação)
  const allDocuments: DocumentItem[] = useMemo(() => {
    const stored = localStorage.getItem('documents');
    if (!stored) return [];
    
    const docs = JSON.parse(stored);
    return docs
      .filter((doc: any) => doc.clientId === clientId)
      .map((doc: any) => ({
        ...doc,
        fileType: getFileType(doc.fileName),
      }));
  }, [clientId]);

  const filteredDocuments = useMemo(() => {
    return allDocuments.filter((doc) => {
      // Busca por nome de arquivo
      let matchesSearch = doc.fileName.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Se busca por conteúdo estiver ativada e houver texto extraído
      if (searchInContent && searchTerm && doc.extractedText) {
        const normalizedSearch = searchTerm.toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '');
        const normalizedContent = doc.extractedText.toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '');
        matchesSearch = matchesSearch || normalizedContent.includes(normalizedSearch);
      }
      
      const matchesType = filterType === "all" || doc.fileType === filterType;
      
      // Filtro por intervalo de datas
      let matchesDate = true;
      if (dateRange?.from) {
        const docDate = parseISO(doc.uploadDate);
        if (dateRange.to) {
          matchesDate = isWithinInterval(docDate, { start: dateRange.from, end: dateRange.to });
        } else {
          matchesDate = docDate >= dateRange.from;
        }
      }
      
      // Filtro por tags
      let matchesTags = true;
      if (selectedTags.length > 0 && doc.tags) {
        matchesTags = selectedTags.some(tag => doc.tags?.includes(tag));
      }
      
      return matchesSearch && matchesType && matchesDate && matchesTags;
    });
  }, [allDocuments, searchTerm, filterType, searchInContent, dateRange, selectedTags]);

  function getFileType(fileName: string): string {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (['pdf'].includes(ext || '')) return 'pdf';
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) return 'image';
    if (['doc', 'docx'].includes(ext || '')) return 'document';
    return 'other';
  }

  function getFileIcon(fileType: string) {
    switch (fileType) {
      case 'pdf':
        return <FileText className="h-8 w-8 text-red-500" />;
      case 'image':
        return <ImageIcon className="h-8 w-8 text-blue-500" />;
      case 'document':
        return <FileText className="h-8 w-8 text-blue-600" />;
      default:
        return <File className="h-8 w-8 text-gray-500" />;
    }
  }

  const handleDownload = (doc: DocumentItem) => {
    window.open(doc.fileUrl, '_blank');
    toast.success(`Download iniciado: ${doc.fileName}`);
    
    logAuditAction(
      "download",
      "documento",
      doc.id,
      `${doc.fileName} do cliente ${client?.name}`
    );
  };

  const handleDelete = (doc: DocumentItem) => {
    if (!canPerformCriticalOperation()) {
      toast.error("Você não tem permissão para excluir documentos");
      return;
    }

    if (!confirm(`Deseja realmente excluir o documento "${doc.fileName}"?`)) {
      return;
    }

    // Remover do localStorage
    const stored = localStorage.getItem('documents');
    if (stored) {
      const docs = JSON.parse(stored);
      const updated = docs.filter((d: any) => d.id !== doc.id);
      localStorage.setItem('documents', JSON.stringify(updated));
    }

    toast.success(`Documento "${doc.fileName}" excluído com sucesso`);
    
    logAuditAction(
      "excluir",
      "documento",
      doc.id,
      `${doc.fileName} do cliente ${client?.name}`
    );

    // Recarregar página
    window.location.reload();
  };

  const handlePreview = (doc: DocumentItem, index: number) => {
    setViewerIndex(index);
    setViewerOpen(true);
  };

  if (!client) {
    return (
      <DashboardLayout>
        <div className="p-8">
          <Card className="p-8 text-center">
            <p className="text-slate-600">Cliente não encontrado</p>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8 mt-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-serif text-slate-800 mb-2">
                Documentos de {client.name}
              </h1>
              <p className="text-slate-600">
                {filteredDocuments.length} documento(s) encontrado(s)
              </p>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <Card className="p-4 mb-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={searchInContent ? "Buscar no conteúdo dos documentos..." : "Buscar por nome do arquivo..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filtrar por tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os tipos</SelectItem>
                    <SelectItem value="pdf">PDFs</SelectItem>
                    <SelectItem value="image">Imagens</SelectItem>
                    <SelectItem value="document">Documentos</SelectItem>
                    <SelectItem value="other">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <DateRangePicker 
                dateRange={dateRange} 
                onDateRangeChange={setDateRange}
              />
            </div>
            
            {/* Filtro por Tags */}
            <div className="border-t border-slate-200 pt-3">
              <p className="text-sm font-medium text-slate-700 mb-2">Filtrar por Tags</p>
              <TagSelector 
                selectedTags={selectedTags}
                onTagsChange={setSelectedTags}
                placeholder="Selecione tags para filtrar documentos"
              />
            </div>
            
            {/* Toggle de Busca por Conteúdo */}
            <div className="flex items-center gap-3 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setSearchInContent(!searchInContent)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg transition-all
                  ${searchInContent 
                    ? 'bg-blue-100 text-blue-700 border-2 border-blue-300' 
                    : 'bg-slate-100 text-slate-600 border-2 border-slate-200 hover:bg-slate-200'
                  }
                `}
              >
                <FileSearch className="h-4 w-4" />
                <span className="text-sm font-medium">
                  Buscar no conteúdo (OCR)
                </span>
              </button>
              
              {searchInContent && (
                <p className="text-xs text-slate-500">
                  Buscando palavras-chave dentro de PDFs e imagens processadas
                </p>
              )}
            </div>
          </div>
        </Card>

        {/* Lista de Documentos */}
        {filteredDocuments.length === 0 ? (
          <Card className="p-12 text-center">
            <FileText className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600 text-lg mb-2">Nenhum documento encontrado</p>
            <p className="text-slate-500 text-sm">
              {searchTerm || filterType !== "all" 
                ? "Tente ajustar os filtros de busca" 
                : "Adicione documentos ao cadastrar ou editar o cliente"}
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocuments.map((doc) => (
              <Card key={doc.id} className="p-4 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {getFileIcon(doc.fileType)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-800 truncate mb-1">
                      {doc.fileName}
                    </h3>
                    <p className="text-sm text-slate-600 mb-2">{doc.fileSize}</p>
                    
                    {/* Trechos destacados quando busca por conteúdo está ativa */}
                    {searchInContent && searchTerm && doc.extractedText && (
                      <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded-md">
                        <div className="flex items-center gap-1 mb-1">
                          <FileSearch className="h-3 w-3 text-blue-600" />
                          <span className="text-xs font-medium text-blue-700">
                            {countOccurrences(doc.extractedText, searchTerm)} ocorrência(s) encontrada(s)
                          </span>
                        </div>
                        {extractTextSnippets(doc.extractedText, searchTerm, 2, 50).map((snippet, idx) => (
                          <p 
                            key={idx} 
                            className="text-xs text-slate-700 leading-relaxed mt-1"
                            dangerouslySetInnerHTML={{ __html: highlightKeyword(snippet, searchTerm) }}
                          />
                        ))}
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {new Date(doc.uploadDate).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    
                    {/* Tags do documento */}
                    {doc.tags && doc.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {doc.tags.map((tag, idx) => {
                          const config = getTagConfig(tag);
                          return (
                            <span
                              key={idx}
                              className={`
                                inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border
                                ${config.color} ${config.bgColor} ${config.borderColor}
                              `}
                            >
                              {tag}
                            </span>
                          );
                        })}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePreview(doc, filteredDocuments.indexOf(doc))}
                        className="flex-1"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Ver
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(doc)}
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(doc)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Galeria de Documentos com Preview */}
        {viewerOpen && (
          <DocumentViewer
            documents={filteredDocuments.map(doc => ({
              id: doc.id,
              fileName: doc.fileName,
              fileUrl: doc.fileUrl,
              fileType: doc.fileType,
            }))}
            initialIndex={viewerIndex}
            onClose={() => setViewerOpen(false)}
            onDownload={handleDownload}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
