import { useState, useMemo } from "react";
import { Link } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import { mockClients } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Search, Plus, User, Mail, Phone, MapPin, Edit, Trash2, FileText } from "lucide-react";
import FormModal from "@/components/FormModal";
import ClientForm from "@/components/ClientForm";
import { canPerformCriticalOperation, logAuditAction } from "@/lib/permissions";
import { toast } from "sonner";

export default function ClientesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);

  const filteredClients = useMemo(() => {
    return mockClients.filter((client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone?.includes(searchTerm)
    );
  }, [searchTerm]);

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header com margem superior para evitar sobreposição com botão Sair */}
        <div className="mb-8 mt-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-serif text-slate-800 mb-2">Clientes</h1>
              <p className="text-slate-600">{filteredClients.length} clientes cadastrados</p>
            </div>
            <Button 
              className="bg-slate-800 hover:bg-slate-900"
              onClick={() => {
                setSelectedClient(null);
                setModalOpen(true);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Cliente
            </Button>
          </div>
        </div>

        {/* Search */}
        <Card className="p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por nome, e-mail ou telefone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </Card>

        {/* Clients Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client) => (
            <Card key={client.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                  <User className="h-6 w-6 text-slate-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-slate-800 truncate">{client.name}</h3>
                  <p className="text-sm text-slate-600 mb-3">{client.cpf}</p>
                  
                  <div className="space-y-2 text-sm text-slate-600">
                    {client.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{client.email}</span>
                      </div>
                    )}
                    {client.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 flex-shrink-0" />
                        <span>{client.phone}</span>
                      </div>
                    )}
                    {client.address && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{client.address}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-200 space-y-2">
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => {
                          setSelectedClient(client);
                          setModalOpen(true);
                        }}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Editar
                      </Button>
                      {canPerformCriticalOperation() && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => {
                            if (confirm(`Deseja excluir ${client.name}?`)) {
                              logAuditAction("excluir", "cliente", client.id, client.name);
                              toast.success("Cliente excluído com sucesso");
                            }
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                    <Link href={`/advogados/clientes/${client.id}/documentos`}>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                      >
                        <FileText className="h-3 w-3 mr-1" />
                        Ver Documentos
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <FormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title={selectedClient ? "Editar Cliente" : "Novo Cliente"}
        description={selectedClient ? "Atualize os dados do cliente" : "Preencha os dados do novo cliente"}
      >
        <ClientForm
          client={selectedClient}
          onSuccess={() => {
            setModalOpen(false);
            setSelectedClient(null);
          }}
          onCancel={() => {
            setModalOpen(false);
            setSelectedClient(null);
          }}
        />
      </FormModal>
    </DashboardLayout>
  );
}
