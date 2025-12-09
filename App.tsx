import { Toaster } from "@/components/ui/sonner";
import { HelmetProvider } from "react-helmet-async";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "@/components/Layout";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import { useEffect } from "react";
import { startReminderChecker } from "@/lib/reminders";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import About from "./pages/About";
import PracticeAreas from "./pages/PracticeAreas";
import Team from "./pages/Team";
import Contact from "./pages/Contact";
import LawyerProfile from "./pages/LawyerProfile";
import LegalPage from "./pages/LegalPage";
import { privacyPolicy, termsOfUse, lgpdContent } from "./pages/LegalContent";
import CookieBanner from "./components/CookieBanner";
import GoogleAnalytics from "./components/GoogleAnalytics";
import WhatsAppButton from "./components/WhatsAppButton";
import AdvogadosLogin from "./pages/AdvogadosLogin";
import AdvogadosDashboard from "./pages/AdvogadosDashboard";
import ProcessosPage from "./pages/ProcessosPage";
import ClientesPage from "./pages/ClientesPage";
import DocumentosPage from "./pages/DocumentosPage";
import TarefasPage from "./pages/TarefasPage";
import AtendimentoPage from "./pages/AtendimentoPage";
import AudienciasPage from "./pages/AudienciasPage";
import AuditLogsPage from "./pages/AuditLogsPage";
import ConfiguracoesPage from "./pages/ConfiguracoesPage";
import NotificacoesPage from "./pages/NotificacoesPage";
import CalendarioPage from "./pages/CalendarioPage";
import ProcessDetailPage from "./pages/ProcessDetailPage";
import ClienteLogin from "./pages/cliente/ClienteLogin";
import ClienteDashboard from "./pages/cliente/ClienteDashboard";
import ClienteAgendamentos from "./pages/cliente/ClienteAgendamentos";
import WhatsAppConfigPage from "./pages/advogados/WhatsAppConfig";
import NotificationsDashboard from "./pages/advogados/NotificationsDashboard";
import MensagensPage from "./pages/advogados/MensagensPage";
import ClienteMensagens from "./pages/cliente/ClienteMensagens";
import EmailPage from "./pages/advogados/EmailPage";
import RelatoriosPage from "./pages/advogados/RelatoriosPage";
import BackupsPage from "./pages/advogados/BackupsPage";
import AgendamentosDisponiveis from "./pages/advogados/AgendamentosDisponiveis";
import LembretesPage from "./pages/advogados/LembretesPage";
import ClienteDocumentosPage from "./pages/ClienteDocumentosPage";
import EstatisticasPage from "./pages/EstatisticasPage";

function Router() {
  return (
    <Switch>
      {/* Cliente Routes - No Layout */}
      <Route path="/cliente" component={ClienteLogin} />
      <Route path="/cliente/dashboard" component={ClienteDashboard} />
      <Route path="/cliente/agendamentos" component={ClienteAgendamentos} />
      <Route path="/cliente/mensagens" component={ClienteMensagens} />

      {/* Admin Routes - No Layout */}
      <Route path="/advogados" component={AdvogadosLogin} />
      <Route path="/advogados/dashboard" component={AdvogadosDashboard} />
      <Route path="/advogados/processos" component={ProcessosPage} />
      <Route path="/advogados/processos/:id" component={ProcessDetailPage} />
      <Route path="/advogados/clientes" component={ClientesPage} />
      <Route path="/advogados/clientes/:id/documentos" component={ClienteDocumentosPage} />
      <Route path="/advogados/documentos" component={DocumentosPage} />
      <Route path="/advogados/estatisticas" component={EstatisticasPage} />
      <Route path="/advogados/tarefas" component={TarefasPage} />
      <Route path="/advogados/atendimento" component={AtendimentoPage} />
      <Route path="/advogados/audiencias" component={AudienciasPage} />
      <Route path="/advogados/logs" component={AuditLogsPage} />
      <Route path="/advogados/configuracoes" component={ConfiguracoesPage} />
      <Route path="/advogados/whatsapp-config" component={WhatsAppConfigPage} />
      <Route path="/advogados/notificacoes-dashboard" component={NotificationsDashboard} />
      <Route path="/advogados/mensagens" component={MensagensPage} />
      <Route path="/advogados/email" component={EmailPage} />
      <Route path="/advogados/relatorios" component={RelatoriosPage} />
      <Route path="/advogados/backups" component={BackupsPage} />
      <Route path="/advogados/agendamentos-disponiveis" component={AgendamentosDisponiveis} />
      <Route path="/advogados/lembretes" component={LembretesPage} />
      <Route path="/advogados/notificacoes" component={NotificacoesPage} />
      <Route path="/advogados/calendario" component={CalendarioPage} />
      
      {/* Public Routes - With Layout */}
      <Route path="/">
        <Layout><Home /></Layout>
      </Route>
      <Route path="/sobre">
        <Layout><About /></Layout>
      </Route>
      <Route path="/atuacao">
        <Layout><PracticeAreas /></Layout>
      </Route>
      <Route path="/equipe">
        <Layout><Team /></Layout>
      </Route>
      <Route path="/equipe/:id">
        <Layout><LawyerProfile /></Layout>
      </Route>
      <Route path="/contato">
        <Layout><Contact /></Layout>
      </Route>
      <Route path="/politica-privacidade">
        <Layout><LegalPage content={privacyPolicy} /></Layout>
      </Route>
      <Route path="/termos-uso">
        <Layout><LegalPage content={termsOfUse} /></Layout>
      </Route>
      <Route path="/lgpd">
        <Layout><LegalPage content={lgpdContent} /></Layout>
      </Route>
      <Route path="/404">
        <Layout><NotFound /></Layout>
      </Route>
      <Route>
        <Layout><NotFound /></Layout>
      </Route>
    </Switch>
  );
}

function App() {
  // Iniciar verificador de lembretes ao carregar o app
  useEffect(() => {
    startReminderChecker();
  }, []);

  return (
    <ErrorBoundary>
      <HelmetProvider>
        <ThemeProvider defaultTheme="light">
          <TooltipProvider>
            <Toaster />
            <GoogleAnalytics />
            <CookieBanner />
            <WhatsAppButton />
            <Router />
          </TooltipProvider>
        </ThemeProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;
