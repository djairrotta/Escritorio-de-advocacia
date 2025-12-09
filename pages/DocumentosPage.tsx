import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Upload, 
  FileText, 
  Download, 
  Trash2, 
  FolderOpen, 
  ChevronDown, 
  ChevronRight,
  Search
} from "lucide-react";
import { toast } from "sonner";
import FormModal from "@/components/FormModal";
import { mockClients } from "@/data/mockData";

interface Document {
  id: string;
  clienteId: string;
  clienteName: string;
  fileName: string;
  fileUrl: string;
  fileSize: string;
  uploadDate: string;
  uploadedBy: string;
}

export default function DocumentosPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [expandedClients, setExpandedClients] = useState<Set<string>>(new Set());
  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    clienteId: "",
    file: null as File | null,
  });

  // Carregar documentos do localStorage
  useEffect(() => {
    const saved = localStorage.getItem("client_documents");
    if (saved) {
      setDocuments(JSON.parse(saved));
    } else {
      // Dados mockados iniciais
      const mockDocs: Document[] = [
        {
          id: "1",
          clienteId: "1",
          clienteName: "Maria Silva",
          fileName: "Contrato_Prestacao_Servicos.pdf",
          fileUrl: "/documents/contrato1.pdf",
          fileSize: "245 KB",
          uploadDate: "2024-12-01",
          uploadedBy: "Dr. Djair Rota",
        },
        {
          id: "2",
          clienteId: "1",
          clienteName: "Maria Silva",
          fileName: "RG_Frente_Verso.pdf",
          fileUrl: "/documents/rg1.pdf",
          fileSize: "1.2 MB",
          uploadDate: "2024-12-02",
          uploadedBy: "Dr. Djair Rota",
        },
        {
          id: "3",
          clienteId: "2",
          clienteName: "João Santos",
          fileName: "Peticao_Inicial.pdf",
          fileUrl: "/documents/peticao1.pdf",
          fileSize: "580 KB",
          uploadDate: "2024-12-03",
          uploadedBy: "Dra. Ana Costa",
        },
      ];
      setDocuments(mockDocs);
      localStorage.setItem("client_documents", JSON.stringify(mockDocs));
    }
  }, []);

  // Salvar no localStorage
  const saveDocuments = (docs: Document[]) => {
    setDocuments(docs);
    localStorage.setItem("client_documents", JSON.stringify(docs));
  };

  // Agrupar documentos por cliente
  const documentsByClient = documents.reduce((acc, doc) => {
    if (!acc[doc.clienteId]) {
      acc[doc.clienteId] = [];
    }
    acc[doc.clienteId].push(doc);
    return acc;
  }, {} as Record<string, Document[]>);

  // Filtrar clientes com documentos
  const clientsWithDocs = mockClients.filter(
    (client) =>
      documentsByClient[client.id.toString()] &&
      (searchTerm === "" ||
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        documentsByClient[client.id.toString()].some((doc) =>
          doc.fileName.toLowerCase().includes(searchTerm.toLowerCase())
        ))
  );

  const toggleClient = (clientId: string) => {
    const newExpanded = new Set(expandedClients);
    if (newExpanded.has(clientId)) {
      newExpanded.delete(clientId);
    } else {
      newExpanded.add(clientId);
    }
    setExpandedClients(newExpanded);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, file: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.clienteId || !formData.file) {
      toast.error("Selecione um cliente e um arquivo");
      return;
    }

    setUploading(true);

    // Simular upload (em produção, fazer upload real para S3)
    setTimeout(() => {
      const cliente = mockClients.find((c) => c.id.toString() === formData.clienteId);
      if (!cliente) {
        toast.error("Cliente não encontrado");
        setUploading(false);
        return;
      }

      const newDoc: Document = {
        id: Date.now().toString(),
        clienteId: formData.clienteId,
        clienteName: cliente.name,
        fileName: formData.file!.name,
        fileUrl: `/documents/${formData.clienteId}/${formData.file!.name}`,
        fileSize: `${(formData.file!.size / 1024).toFixed(0)} KB`,
        uploadDate: new Date().toISOString().split("T")[0],
        uploadedBy: localStorage.getItem("advogado_name") || "Advogado",
      };

      const updated = [...documents, newDoc];
      saveDocuments(updated);

      toast.success("Documento enviado com sucesso!");
      setModalOpen(false);
      setFormData({ clienteId: "", file: null });
      setUploading(false);

      // Expandir automaticamente a pasta do cliente
      setExpandedClients(new Set(expandedClients).add(formData.clienteId));
    }, 1500);
  };

  const handleDelete = (docId: string) => {
    if (confirm("Tem certeza que deseja excluir este documento?")) {
      const updated = documents.filter((doc) => doc.id !== docId);
      saveDocuments(updated);
      toast.success("Documento excluído");
    }
  };

  const handleDownload = (doc: Document) => {
    // Em produção, fazer download real do S3
    toast.info(`Download iniciado: ${doc.fileName}`);
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-serif text-slate-800 mb-2">Documentos</h1>
            <p className="text-slate-600">Gerenciamento de documentos por cliente</p>
          </div>
          <Button onClick={() => setModalOpen(true)} className="bg-blue-600 hover:bg-blue-700">
            <Upload className="h-4 w-4 mr-2" />
            Enviar Documento
          </Button>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Total de Documentos</p>
                  <p className="text-3xl font-bold text-slate-800">{documents.length}</p>
                </div>
                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                  <FileText className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Clientes com Documentos</p>
                  <p className="text-3xl font-bold text-slate-800">
                    {Object.keys(documentsByClient).length}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-green-100 text-green-600">
                  <FolderOpen className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Enviados Hoje</p>
                  <p className="text-3xl font-bold text-slate-800">
                    {
                      documents.filter(
                        (doc) => doc.uploadDate === new Date().toISOString().split("T")[0]
                      ).length
                    }
                  </p>
                </div>
                <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                  <Upload className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Busca */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Buscar por cliente ou nome do arquivo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Lista de Documentos por Cliente */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-serif">Documentos por Cliente</CardTitle>
            <CardDescription>Clique no cliente para expandir e ver os documentos</CardDescription>
          </CardHeader>
          <CardContent>
            {clientsWithDocs.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <FolderOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum documento encontrado</p>
              </div>
            ) : (
              <div className="space-y-2">
                {clientsWithDocs.map((client) => {
                  const clientDocs = documentsByClient[client.id.toString()] || [];
                  const isExpanded = expandedClients.has(client.id.toString());

                  return (
                    <div key={client.id} className="border border-slate-200 rounded-lg overflow-hidden">
                      {/* Cliente Header */}
                      <button
                        onClick={() => toggleClient(client.id.toString())}
                        className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          {isExpanded ? (
                            <ChevronDown className="h-5 w-5 text-slate-600" />
                          ) : (
                            <ChevronRight className="h-5 w-5 text-slate-600" />
                          )}
                          <FolderOpen className="h-5 w-5 text-blue-600" />
                          <div className="text-left">
                            <p className="font-semibold text-slate-800">{client.name}</p>
                            <p className="text-sm text-slate-600">{client.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                            {clientDocs.length} {clientDocs.length === 1 ? "documento" : "documentos"}
                          </span>
                        </div>
                      </button>

                      {/* Documentos do Cliente */}
                      {isExpanded && (
                        <div className="p-4 bg-white space-y-3">
                          {clientDocs.map((doc) => (
                            <div
                              key={doc.id}
                              className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50"
                            >
                              <div className="flex items-center gap-4">
                                <div className="p-3 rounded-full bg-slate-100 text-slate-600">
                                  <FileText className="h-5 w-5" />
                                </div>
                                <div>
                                  <p className="font-semibold text-slate-800">{doc.fileName}</p>
                                  <div className="flex items-center gap-3 text-sm text-slate-600 mt-1">
                                    <span>{doc.fileSize}</span>
                                    <span>•</span>
                                    <span>{new Date(doc.uploadDate).toLocaleDateString("pt-BR")}</span>
                                    <span>•</span>
                                    <span>Por {doc.uploadedBy}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDownload(doc)}
                                  className="text-blue-600 hover:text-blue-700"
                                  title="Baixar documento"
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDelete(doc.id)}
                                  className="text-red-600 hover:text-red-700"
                                  title="Excluir documento"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modal de Upload */}
      <FormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title="Enviar Documento"
        description="Selecione o cliente e o arquivo para upload"
      >
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Label htmlFor="clienteId">Cliente *</Label>
            <Select
              value={formData.clienteId}
              onValueChange={(value) => setFormData({ ...formData, clienteId: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o cliente" />
              </SelectTrigger>
              <SelectContent>
                {mockClients.map((client) => (
                  <SelectItem key={client.id} value={client.id.toString()}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-slate-500 mt-1">
              O documento será salvo na pasta deste cliente
            </p>
          </div>

          <div>
            <Label htmlFor="file">Arquivo *</Label>
            <Input
              id="file"
              type="file"
              onChange={handleFileChange}
              required
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              className="cursor-pointer"
            />
            <p className="text-sm text-slate-500 mt-1">
              Formatos aceitos: PDF, DOC, DOCX, JPG, PNG (máx. 10MB)
            </p>
          </div>

          {formData.file && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-900">{formData.file.name}</p>
                  <p className="text-xs text-blue-600">
                    {(formData.file.size / 1024).toFixed(0)} KB
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setModalOpen(false)}
              className="flex-1"
              disabled={uploading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              disabled={uploading}
            >
              {uploading ? "Enviando..." : "Enviar"}
            </Button>
          </div>
        </form>
      </FormModal>
    </DashboardLayout>
  );
}
