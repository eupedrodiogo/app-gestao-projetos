# Backend - App de Gestão de Projetos

API REST em Node.js para o sistema de gestão de projetos.

## 🚀 Tecnologias

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **SQLite** - Banco de dados
- **CORS** - Cross-Origin Resource Sharing
- **JSON** - Formato de dados

## 📁 Estrutura

```
├── routes/              # Rotas da API
│   ├── projects.js     # CRUD de projetos
│   ├── tasks.js        # CRUD de tarefas
│   └── mindmaps.js     # CRUD de mapas mentais
├── database/           # Configuração do banco
│   └── init.js         # Inicialização SQLite
├── server.js           # Servidor principal
├── server.mjs          # Servidor ES modules
└── api-config.js       # Configurações da API
```

## 🛠️ Desenvolvimento

### Instalação
```bash
npm install
```

### Executar em desenvolvimento
```bash
npm run dev
```

### Executar em produção
```bash
npm start
```

## 🗄️ Banco de Dados

O sistema utiliza SQLite com as seguintes tabelas:
- **projects** - Projetos com título, descrição e status
- **tasks** - Tarefas vinculadas a projetos
- **mindmaps** - Mapas mentais com estrutura JSON

## 🔌 Endpoints da API

### Projetos
- `GET /api/projects` - Listar todos os projetos
- `POST /api/projects` - Criar novo projeto
- `PUT /api/projects/:id` - Atualizar projeto
- `DELETE /api/projects/:id` - Deletar projeto

### Tarefas
- `GET /api/tasks` - Listar todas as tarefas
- `POST /api/tasks` - Criar nova tarefa
- `PUT /api/tasks/:id` - Atualizar tarefa
- `DELETE /api/tasks/:id` - Deletar tarefa

### Mapas Mentais
- `GET /api/mindmaps` - Listar mapas mentais
- `POST /api/mindmaps` - Criar mapa mental
- `PUT /api/mindmaps/:id` - Atualizar mapa mental
- `DELETE /api/mindmaps/:id` - Deletar mapa mental

## ⚙️ Configuração

O servidor roda por padrão na porta 3001 e aceita conexões do frontend na porta 3000.