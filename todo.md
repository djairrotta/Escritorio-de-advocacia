# TODO - Portal do Advogado - Notificações, Relatórios e Calendário

## Fase 1: Sistema de Notificações
- [x] Criar serviço de notificações por E-mail
- [x] Criar serviço de notificações por WhatsApp
- [x] Implementar templates de notificação (audiências, prazos, atualizações)
- [x] Criar página de configuração de notificações
- [x] Adicionar preferências de notificação por usuário
- [x] Integrar notificações automáticas em eventos críticos

## Fase 2: Geração de Relatórios PDF
- [x] Instalar biblioteca de geração de PDF
- [x] Criar template de relatório de Processo
- [x] Criar template de relatório de Audiências
- [x] Criar template de relatório de Atividades de Advogado
- [x] Implementar botões de exportação nas páginas
- [x] Adicionar logo e identidade visual nos PDFs

### Fase 3: Calendário Interativo
- [x] Instalar biblioteca de calendário (FullCalendar ou similar)
- [x] Criar página de Calendário
- [x] Integrar audiências, tarefas, atendimentos e prazos
- [x] Implementar visualizações (mês, semana, dia, lista)
- [x] Adicionar funcionalidade de exportação .ics
- [x] Implementar sincronização com Google Calendar (via .ics)
- [ ] Adicionar visualizações (mês, semana, dia)
- [ ] Implementar filtros por tipo de evento

## Status Atual
- Portal do Advogado completo com CRUD, Upload, Configurações e Logs
- Aguardando implementação de notificações, relatórios e calendário

## Correções Urgentes
- [x] Corrigir erro de <a> aninhado no Dashboard

## Melhorias do Calendário
- [x] Criar modal de criação de evento com campos completos
- [x] Adicionar campo de nome do evento
- [x] Adicionar campo de horário
- [x] Adicionar campo de telefone
- [x] Implementar upload de documentos anexos

## Melhorias Avançadas do Calendário
- [x] Implementar edição de eventos existentes
- [x] Implementar exclusão de eventos com confirmação
- [x] Criar sistema de lembretes automáticos (24h antes)
- [x] Criar modal de visualização de detalhes do evento
- [x] Permitir download de anexos do evento

## Integração Calendário + Processos
- [x] Adicionar campo de processo vinculado no EventForm
- [ ] Exibir eventos vinculados na página de detalhes do processo
- [ ] Criar timeline de movimentações do processo
- [ ] Permitir criar evento diretamente da página do processo

## Portal do Cliente
- [ ] Criar página de login do cliente
- [ ] Criar dashboard do cliente
- [ ] Implementar visualização de processos do cliente
- [ ] Implementar visualização de documentos do cliente
- [ ] Criar funcionalidade de agendamento de consultas
- [ ] Adicionar sistema de mensagens cliente-advogado

## Banco de Dados Real (MySQL/TiDB)
- [ ] Criar schema completo no Drizzle (users, clients, legal_cases, hearings, documents, calendar_events, audit_logs, notifications, whatsapp_config)
- [ ] Executar db:push para criar tabelas no MySQL/TiDB
- [ ] Criar seed script para migrar dados mockados

## tRPC Procedures
- [ ] Implementar autenticação JWT para advogados e clientes
- [ ] Criar procedures CRUD para clientes
- [ ] Criar procedures CRUD para processos
- [ ] Criar procedures CRUD para audiências
- [ ] Criar procedures CRUD para eventos do calendário
- [ ] Criar procedures para documentos
- [ ] Criar procedures para logs de auditoria

## Sistema de Notificações Avançado
- [ ] Configurar serviço de e-mail (usando Manus built-in API)
- [ ] Criar procedure para enviar notificações por e-mail
- [ ] Implementar painel de configuração WhatsApp (Link ID, Token, Número) - apenas Master
- [ ] Criar procedure para enviar notificações por WhatsApp via API
- [ ] Implementar notificações automáticas para clientes sobre atualizações de processos

## Frontend com tRPC
- [ ] Atualizar login de advogados para usar tRPC auth
- [ ] Atualizar login de clientes para usar tRPC auth
- [ ] Substituir mockData por queries tRPC em todas as páginas do portal do advogado
- [ ] Substituir mockData por queries tRPC em todas as páginas do portal do cliente
- [ ] Adicionar página de configuração WhatsApp no portal do advogado (apenas Master)
- [ ] Testar fluxo completo de notificações (e-mail + WhatsApp)

## Testes Unitários
- [ ] Escrever testes para procedures de autenticação
- [ ] Escrever testes para procedures CRUD
- [ ] Testar envio de notificações
- [ ] Testar permissões (Master/Moderador/Advogado/Cliente)

## Abordagem Pragmática - Notificações (sem migração completa DB)
- [x] Criar página de Configuração WhatsApp no portal do advogado (apenas Master)
- [x] Implementar localStorage para salvar configurações WhatsApp
- [x] Criar serviço de notificações por e-mail usando Manus API
- [x] Criar serviço de notificações por WhatsApp usando API configurada
- [x] Adicionar botão de teste de notificação na página de configuração
- [x] Implementar notificações automáticas ao criar/atualizar processos
- [x] Testar fluxo completo de notificações

## Migração para Banco de Dados Real
- [x] Recriar server/db.ts com helpers do banco
- [x] Recriar server/seed.ts com dados iniciais
- [x] Executar seed para popular banco
- [ ] Criar tRPC procedures completos (auth, clients, cases, events)
- [ ] Conectar frontend ao tRPC (substituir mockData)
- [ ] Testar autenticação real

## Sistema de Agendamento de Notificações
- [x] Criar serviço de agendamento (cron-like)
- [x] Implementar verificação diária de audiências/prazos
- [x] Enviar lembretes automáticos 24h antes
- [x] Adicionar configuração de horário de envio
- [x] Testar agendamento

## Dashboard de Notificações
- [x] Criar página /advogados/notificacoes-dashboard
- [x] Implementar tabela de histórico de notificações
- [x] Adicionar estatísticas (enviadas, falhas, taxa de sucesso)
- [x] Implementar filtros (data, tipo, status)
- [x] Adicionar gráficos de visualização

## Conexão Frontend ao Banco via tRPC
- [ ] Criar tRPC router completo com procedures de autenticação
- [ ] Criar procedures CRUD para clientes, processos, eventos
- [ ] Configurar tRPC client no frontend
- [ ] Substituir mockData por queries tRPC em todas as páginas
- [ ] Testar autenticação real com JWT
- [ ] Atualizar formulários para usar mutations tRPC

## Sistema de Mensagens Cliente-Advogado
- [x] Criar tabela messages no schema do banco
- [x] Criar procedures tRPC para mensagens (enviar, listar, marcar como lida)
- [x] Implementar página de chat no Portal do Cliente
- [x] Implementar página de chat no Portal do Advogado
- [x] Adicionar notificações em tempo real para novas mensagens
- [x] Implementar indicador de mensagens não lidas
- [x] Testar fluxo completo de comunicação

## WebSocket para Mensagens em Tempo Real
- [x] Instalar Socket.io (server e client)
- [x] Configurar servidor WebSocket no server/index.ts
- [x] Criar eventos de conexão, envio e recebimento de mensagens
- [x] Implementar Socket.io client no frontend
- [x] Atualizar componentes de chat para usar WebSocket
- [x] Testar mensagens em tempo real

## Upload de Arquivos no Chat
- [x] Criar endpoint de upload usando S3
- [x] Adicionar campo de anexos na tabela messages
- [x] Implementar componente de upload no chat do cliente
- [ ] Implementar componente de upload no chat do advogado
- [x] Adicionar preview de imagens e documentos
- [x] Implementar download de arquivos anexados
- [x] Testar upload e visualização de diferentes tipos de arquivo

## Correção de Bugs
- [x] Corrigir nested anchor tags (<a> dentro de <a>) no dashboard
- [x] Corrigir Select.Item com valor vazio no calendário
- [x] Testar páginas após correções

## Sistema de Permissões por Nível
- [x] Criar helper de permissões (checkPermission, canViewAll, canAssign)
- [x] Atualizar schema do banco com campo assignedTo em tarefas/eventos
- [x] Implementar filtros por advogado em calendário/tarefas/atendimento
- [x] Adicionar seleção de advogado no formulário de eventos (Master/Moderador)
- [x] Restringir visualização de advogados apenas ao que lhes foi atribuído

## Módulo de E-mail
- [x] Criar página de E-mail (/advogados/email)
- [x] Implementar interface de lista de e-mails
- [x] Criar modal de composição de e-mail
- [x] Adicionar configuração de contas de e-mail (Master)
- [x] Integrar com API de e-mail (IMAP/SMTP)

## Relatórios Semanais (Master)
- [x] Criar página de Relatórios (/advogados/relatorios)
- [x] Implementar dashboard com métricas por advogado
- [x] Adicionar gráficos de atividades semanais
- [x] Criar filtros por período e advogado
- [x] Implementar exportação de relatórios em PDF

## Atualização do Menu
- [x] Adicionar item "E-mail" para todos os usuários
- [x] Adicionar item "Relatórios" apenas para Master
- [x] Atualizar Sidebar com controle de permissões
- [x] Testar visibilidade de itens por nível de usuário

## Integração IMAP/SMTP Real
- [x] Instalar bibliotecas nodemailer e imap
- [x] Criar serviço de e-mail no servidor (server/email.ts)
- [x] Implementar configuração de contas IMAP/SMTP
- [x] Criar endpoints para enviar e receber e-mails
- [x] Atualizar frontend para usar API real de e-mail
- [x] Testar integração com Gmail e Outlook

## Gráficos Interativos nos Relatórios
- [x] Instalar Chart.js e react-chartjs-2
- [x] Criar componente de gráfico de linha (evolução temporal)
- [x] Criar componente de gráfico de barras (comparação)
- [x] Adicionar gráficos na página de relatórios
- [x] Implementar dados históricos mockados
- [x] Testar responsividade dos gráficos

## Sistema de Backup Automático
- [x] Criar script de backup do banco de dados (server/backup.ts)
- [x] Implementar upload para S3 usando storagePut
- [x] Criar rotina de agendamento diário (cron)
- [x] Implementar notificação por e-mail após backup
- [x] Adicionar página de gerenciamento de backups (Master)
- [x] Testar backup e restauração

## Configuração de E-mails na Dashboard Master
- [x] Adicionar seção "Contas de E-mail" na página de Configurações
- [x] Criar formulário para adicionar nova conta (provider, e-mail, senha, SMTP/IMAP)
- [x] Implementar listagem de contas cadastradas
- [x] Adicionar botão de teste de conexão SMTP
- [x] Implementar edição e exclusão de contas
- [x] Salvar configurações no localStorage
- [x] Testar fluxo completo de configuração

## Remoção de Elementos das Páginas de Login
- [x] Remover cabeçalho da página de login de clientes
- [x] Remover rodapé da página de login de clientes
- [x] Remover botão WhatsApp da página de login de clientes
- [x] Remover cabeçalho da página de login de advogados
- [x] Remover rodapé da página de login de advogados
- [x] Remover botão WhatsApp da página de login de advogados

## Sistema de Agendamento Compartilhado
- [x] Criar página /advogados/agendamentos-disponiveis (Master/Moderador)
- [x] Implementar calendário mensal com seleção de datas
- [x] Criar formulário para adicionar horários disponíveis
- [x] Implementar listagem de horários cadastrados
- [x] Adicionar exclusão de horários
- [x] Salvar disponibilidade no banco/localStorage
- [x] Criar visualização no Portal do Cliente
- [x] Implementar solicitação de agendamento pelo cliente
- [x] Adicionar notificações de novas solicitações

## Simplificação das Páginas de Login
- [x] Remover logo da página de login de clientes
- [x] Remover card de credenciais de teste da página de login de clientes
- [x] Remover botão "Voltar ao Site" da página de login de clientes
- [x] Remover links extras da página de login de clientes
- [x] Simplificar página de login de advogados (apenas quadro)
- [x] Remover credenciais de teste do rodapé da página de advogados

## Sistema de Lembretes Automáticos
- [x] Criar serviço de lembretes (server/reminders.ts)
- [x] Implementar verificação diária de agendamentos
- [x] Criar template de e-mail para lembrete
- [x] Criar template de mensagem WhatsApp para lembrete
- [x] Adicionar link de confirmação nos lembretes
- [x] Implementar envio 24h antes da consulta
- [x] Testar fluxo completo de lembretes

## Ajuste Página Login Advogados
- [x] Remover cabeçalho da página /advogados
- [x] Remover rodapé da página /advogados
- [x] Adicionar botão "Sair" no canto superior direito

## Edição de Horários Disponíveis
- [x] Adicionar botão "Editar" nos cards de horários disponíveis
- [x] Criar modal de edição com campos preenchidos
- [x] Implementar função handleEditSlot
- [x] Atualizar localStorage após edição
- [x] Testar fluxo completo de edição

## Reorganização de Documentos por Cliente
- [x] Criar estrutura de dados organizada por cliente
- [x] Implementar visualização em accordion/tree por cliente
- [x] Adicionar modal de upload com seleção de cliente
- [x] Implementar upload para S3 com path organizado por cliente
- [x] Adicionar ações de download e exclusão de documentos
- [x] Testar fluxo completo de upload e gerenciamento

## Atualizar Usuário Admin para Master
- [ ] Localizar arquivo de dados mockados de usuários
- [ ] Atualizar role de admin@djairrotta.com.br para "master"
- [ ] Testar login e permissões

## Corrigir Edição de Eventos no Calendário
- [x] Analisar página CalendarioPage.tsx
- [x] Adicionar botão de edição nos eventos
- [x] Implementar função handleEdit para eventos
- [x] Testar edição de eventos

## Corrigir Liberação de Agendamentos
- [x] Analisar página AgendamentosDisponiveis.tsx
- [x] Verificar função de adicionar horários disponíveis
- [x] Corrigir problema de salvamento
- [x] Testar fluxo completo de liberação

## Investigar Problema Persistente de Agendamentos
- [x] Verificar se modal está abrindo
- [x] Verificar se formulário está sendo preenchido
- [x] Verificar se handleSubmit está sendo chamado
- [x] Verificar se há erros no console
- [x] Testar fluxo completo com usuário Master
- [x] Adicionar fallback por e-mail para garantir acesso do Master

## Remover Hero e Rodapé do Dashboard de Advogados
- [x] Verificar DashboardLayout.tsx
- [x] Identificar problema: Layout global no App.tsx
- [x] Remover Layout das rotas de advogados e clientes
- [x] Aplicar Layout apenas nas rotas públicas
- [x] Testar dashboard sem rodapé

## Adicionar Botão Sair no Dashboard
- [x] Adicionar botão "Sair" azul no canto superior direito
- [x] Implementar função de logout
- [x] Redirecionar para página inicial após logout

## Ocultar Botão WhatsApp no Dashboard
- [x] Adicionar verificação de rota no componente WhatsAppButton
- [x] Ocultar botão nas rotas /advogados/* e /cliente/*
- [x] Manter botão apenas nas páginas públicas

## Corrigir Sobreposição do Botão Sair
- [ ] Ajustar posicionamento do botão Sair no DashboardLayout
- [ ] Garantir que não sobreponha botões de ação das páginas
- [ ] Testar em diferentes páginas do dashboard

## Adicionar Badge de Notificações
- [ ] Adicionar contador de notificações não lidas
- [ ] Implementar badge visual no ícone de sino do Sidebar
- [ ] Atualizar contador dinamicamente

## Correção de Layout - Botão Sair
- [x] Corrigir sobreposição do botão Sair com botão "Novo Cliente" na página /advogados/clientes
- [x] Ajustar padding ou posicionamento do header da página de clientes

## Melhorias no Cadastro de Clientes
- [x] Adicionar campo RG ao schema do banco de dados (tabela clients)
- [x] Adicionar campo RG no formulário ClientForm.tsx
- [x] Implementar sistema de upload de documentos no cadastro de cliente
- [x] Criar estrutura de pastas no S3: /clients/{clienteId}/documents/
- [x] Vincular documentos automaticamente ao cliente
- [x] Atualizar endpoint de upload para usar estrutura organizada
- [ ] Testar upload e visualização de documentos

## Melhorias no Sistema de Documentos
- [x] Criar página de visualização de documentos por cliente
- [x] Adicionar filtros por tipo de arquivo e data
- [x] Implementar botões de download e exclusão
- [x] Estender upload para processos jurídicos
- [x] Criar estrutura /clients/{clienteId}/cases/{caseId}/documents/
- [x] Adicionar upload de documentos no formulário de processos
- [x] Criar componente de galeria com preview inline
- [x] Implementar visualizador de PDFs
- [x] Implementar visualizador de imagens com zoom
- [x] Adicionar navegação entre documentos

## Sistema de OCR para Documentos
- [x] Adicionar campo extractedText ao schema de documents
- [x] Aplicar migração do banco de dados
- [x] Instalar biblioteca Tesseract.js para OCR
- [x] Criar serviço de processamento OCR no servidor
- [x] Integrar OCR no endpoint de upload
- [x] Processar PDFs e imagens automaticamente
- [x] Armazenar texto extraído no localStorage
- [x] Adicionar busca por conteúdo na página de documentos
- [x] Implementar toggle de busca por conteúdo (OCR)
- [x] Normalizar texto para busca sem acentos

## Ajustes de UI e Highlight de Busca
- [x] Reduzir tamanho da fonte do menu lateral (Sidebar)
- [x] Ajustar espaçamento dos itens do menu
- [x] Implementar função de highlight de texto
- [x] Exibir trechos do conteúdo extraído nos resultados
- [x] Destacar palavras-chave em amarelo
- [x] Adicionar contexto (texto antes e depois da palavra)
- [x] Contador de ocorrências por documento

## Filtros Avançados e Sistema de Tags
- [x] Instalar biblioteca react-day-picker para date range picker
- [x] Adicionar campo tags (VARCHAR) no schema de documents
- [x] Aplicar migração do banco de dados
- [x] Implementar filtro por intervalo de datas
- [x] Criar componente DateRangePicker com 2 meses
- [x] Criar sistema de tags predefinidas com cores (10 tags)
- [x] Permitir adicionar tags customizadas
- [x] Adicionar seletor de tags no formulário de upload
- [x] Implementar filtro por tags na página de documentos
- [x] Exibir tags coloridas nos cards de documentos
- [x] Salvar tags junto com documentos no localStorage

## Painel de Estatísticas de Documentos
- [x] Instalar biblioteca Chart.js e react-chartjs-2
- [x] Criar página EstatisticasPage.tsx
- [x] Implementar gráfico de pizza - Distribuição por tags
- [x] Implementar gráfico de rosca - Tipos de arquivo
- [x] Implementar gráfico de linha - Uploads por mês (6 meses)
- [x] Implementar gráfico de barras - Top 5 clientes (horizontal)
- [x] Criar cards de estatísticas gerais (total, clientes, média, mês)
- [x] Integrar página no menu lateral
- [x] Adicionar rota no App.tsx
- [x] Registrar componentes do Chart.js

## Ajuste de Espaçamento do Menu Lateral
- [x] Reduzir ainda mais o tamanho da fonte do menu (de 12px para 11px)
- [x] Reduzir espaçamento vertical entre itens (de py-2 para py-1.5)
- [x] Reduzir padding horizontal (de px-3 para px-2)
- [x] Reduzir tamanho dos ícones (de 16px para 14px)

## Indicadores Visuais de Atividade no Menu
- [x] Implementar cálculo de novos clientes cadastrados hoje
- [x] Implementar cálculo de processos com prazos próximos (7 dias)
- [x] Implementar cálculo de tarefas atrasadas
- [x] Adicionar dots coloridos no Sidebar (8px, animate-pulse)
- [x] Dot verde para "Clientes" (novos cadastros)
- [x] Dot amarelo para "Processos" (prazos próximos)
- [x] Dot vermelho para "Tarefas" (atrasadas)
- [x] Adicionar tooltip explicativo ao hover nos dots
- [x] Tratamento de erros com try-catch

## Menu Lateral Rolável
- [x] Remover posicionamento fixo (fixed) do Sidebar
- [x] Ajustar DashboardLayout para layout flex sem margin-left
- [x] Mudar botão Sair de fixed para sticky
- [x] Remover padding-top do conteúdo principal

## Correção de Erro de Deployment
- [x] Instalar dependência @aws-sdk/client-s3 (v3.943.0)
- [x] Verificar se pdf-parse está instalado
- [x] Corrigir erros de TypeScript em ProcessosPage.tsx
- [x] Reduzir erros de TS de 45 para 41

## Melhorias no Cadastro de Clientes - Aniversário e Mídia
- [x] Adicionar campo birthDate (data de aniversário) no schema de clients
- [x] Aplicar migração do banco de dados
- [x] Adicionar campo de data de aniversário no ClientForm (type="date")
- [x] Adicionar suporte a vídeos (mp4, avi, mov, mkv, webm) no upload
- [x] Adicionar suporte a áudios (mp3, wav, m4a, ogg, webm) no upload
- [x] Remover limite de tamanho de 10MB (sem limite agora)
- [x] Atualizar validações de tipo de arquivo em ClientForm
- [x] Atualizar validações de tipo de arquivo em ProcessForm
- [x] Adicionar birthDate na interface Client (types.ts)

## Adicionar Direito Eleitoral nas Áreas de Atuação
- [x] Localizar seção de áreas de atuação na página inicial
- [x] Adicionar card de Direito Eleitoral com ícone Vote (lucide-react)
- [x] Adicionar ao array de áreas em Home.tsx
