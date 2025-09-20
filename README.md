# App de Gestão de Projetos

Uma aplicação completa para gestão de projetos desenvolvida com React no frontend e Node.js no backend, organizada em uma arquitetura modular.

## 🚀 Tecnologias Utilizadas

### Frontend
- React 18
- Vite
- CSS3
- JavaScript ES6+

### Backend
- Node.js
- Express.js
- SQLite
- CORS

## 📋 Funcionalidades

- ✅ **Dashboard**: Visão geral dos projetos e tarefas
- ✅ **Gestão de Projetos**: Criar, editar e excluir projetos
- ✅ **Gestão de Tarefas**: Sistema completo de tarefas com status
- ✅ **Mapas Mentais**: Criação e edição de mapas mentais interativos
- ✅ **Interface Responsiva**: Funciona em desktop e mobile
- ✅ **API REST**: Backend robusto com endpoints organizados

## 🛠️ Como Executar

### Pré-requisitos
- Node.js (versão 16 ou superior)
- npm ou yarn

### Instalação Rápida

```bash
# Clone o repositório
git clone <url-do-repositorio>
cd app-gestao-projetos

# Instale todas as dependências (frontend + backend)
npm run install:all

# Execute frontend e backend simultaneamente
npm run dev
```

### Instalação Manual

1. **Instalar dependências do projeto principal**
```bash
npm install
```

2. **Instalar dependências do frontend**
```bash
npm run install:frontend
```

3. **Instalar dependências do backend**
```bash
npm run install:backend
```

4. **Executar em desenvolvimento**
```bash
# Executar ambos simultaneamente
npm run dev

# Ou executar separadamente:
npm run dev:frontend  # Frontend em http://localhost:5173
npm run dev:backend   # Backend em http://localhost:3001
```

## 🗄️ Estrutura do Banco de Dados

### Tabela: projects
- `id` - Identificador único
- `name` - Nome do projeto
- `description` - Descrição
- `status` - Status (planejamento, em-andamento, concluido)
- `priority` - Prioridade (baixa, media, alta)
- `start_date` - Data de início
- `end_date` - Data de término
- `created_at` - Data de criação

### Tabela: tasks
- `id` - Identificador único
- `project_id` - ID do projeto relacionado
- `title` - Título da tarefa
- `description` - Descrição
- `status` - Status (pending, completed)
- `priority` - Prioridade (baixa, media, alta)
- `due_date` - Data de vencimento
- `created_at` - Data de criação

### Tabela: mindmaps
- `id` - Identificador único
- `project_id` - ID do projeto relacionado
- `title` - Título do mapa mental
- `description` - Descrição
- `content` - Conteúdo do mapa
- `created_at` - Data de criação

## 🔌 API Endpoints

### Projetos
- `GET /api/projects` - Listar todos os projetos
- `GET /api/projects/:id` - Obter projeto específico
- `POST /api/projects` - Criar novo projeto
- `PUT /api/projects/:id` - Atualizar projeto
- `DELETE /api/projects/:id` - Excluir projeto
- `GET /api/projects/:id/tasks` - Obter tarefas do projeto
- `GET /api/projects/:id/mindmaps` - Obter mapas mentais do projeto

### Tarefas
- `GET /api/tasks` - Listar todas as tarefas
- `GET /api/tasks/:id` - Obter tarefa específica
- `POST /api/tasks` - Criar nova tarefa
- `PUT /api/tasks/:id` - Atualizar tarefa
- `DELETE /api/tasks/:id` - Excluir tarefa
- `PATCH /api/tasks/:id/toggle` - Alternar status da tarefa

### Mapas Mentais
- `GET /api/mindmaps` - Listar todos os mapas mentais
- `GET /api/mindmaps/:id` - Obter mapa mental específico
- `POST /api/mindmaps` - Criar novo mapa mental
- `PUT /api/mindmaps/:id` - Atualizar mapa mental
- `DELETE /api/mindmaps/:id` - Excluir mapa mental
- `POST /api/mindmaps/:id/nodes` - Adicionar nó ao mapa
- `DELETE /api/mindmaps/:id/nodes/:nodeId` - Remover nó do mapa

## 🔧 Configuração

### Configurar Porta do Servidor
Edite o arquivo `server.js` e altere a linha:
```javascript
const PORT = process.env.PORT || 3001;
```

### Configurar URL da API
Edite o arquivo `api-config.js` e altere:
```javascript
const API_CONFIG = {
  BASE_URL: 'http://localhost:3001/api',
  // ...
};
```

## 📱 Funcionalidades

### Dashboard
- Estatísticas gerais dos projetos
- Projetos recentes
- Tarefas pendentes
- Progresso visual

### Gestão de Projetos
- Criar, editar e excluir projetos
- Definir status e prioridades
- Acompanhar progresso
- Datas de início e término

### Gestão de Tarefas
- Organizar tarefas por projeto
- Marcar como concluídas
- Definir prioridades e prazos
- Filtrar por status

### Mapas Mentais
- Criar mapas para brainstorming
- Associar a projetos específicos
- Conteúdo em texto livre
- Organização visual de ideias

## 🔄 Modo Offline

O sistema funciona em dois modos:

1. **Modo Online** (com backend):
   - Dados salvos no banco SQLite
   - Sincronização automática
   - Indicador verde de conectividade

2. **Modo Offline** (sem backend):
   - Dados salvos no localStorage do navegador
   - Funcionalidade completa mantida
   - Indicador amarelo de modo offline

## 🐛 Solução de Problemas

### Backend não inicia
1. Verifique se Node.js está instalado: `node --version`
2. Execute novamente: `install-backend.bat`
3. Verifique se a porta 3001 está livre

### Frontend não conecta à API
1. Verifique se o backend está rodando
2. Confirme a URL da API em `api-config.js`
3. Verifique o console do navegador para erros

### Dados não são salvos
1. Em modo online: verifique a conexão com o backend
2. Em modo offline: verifique se o localStorage está habilitado
3. Verifique permissões de escrita no diretório

## 📄 Licença

Este projeto é de código aberto e está disponível sob a licença MIT.

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para:
- Reportar bugs
- Sugerir melhorias
- Enviar pull requests
- Melhorar a documentação

## 📞 Suporte

Para suporte e dúvidas:
- Verifique a documentação
- Consulte os logs do servidor
- Verifique o console do navegador