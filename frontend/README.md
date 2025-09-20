# Frontend - App de Gestão de Projetos

Interface React para o sistema de gestão de projetos.

## 🚀 Tecnologias

- **React 18** - Biblioteca para interfaces de usuário
- **Vite** - Build tool e dev server
- **CSS3** - Estilização moderna
- **JavaScript ES6+** - Linguagem principal

## 📁 Estrutura

```
src/
├── components/          # Componentes React
│   ├── Dashboard.jsx   # Painel principal
│   ├── Projects.jsx    # Gestão de projetos
│   ├── Tasks.jsx       # Gestão de tarefas
│   └── MindMaps.jsx    # Mapas mentais
├── App.jsx             # Componente principal
├── main.jsx            # Ponto de entrada
└── index.css           # Estilos globais
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

### Build para produção
```bash
npm run build
```

### Preview da build
```bash
npm run preview
```

## 🔗 Integração com Backend

O frontend se comunica com o backend através de APIs REST nas seguintes rotas:
- `/api/projects` - Gestão de projetos
- `/api/tasks` - Gestão de tarefas
- `/api/mindmaps` - Mapas mentais

## 📱 Funcionalidades

- ✅ Dashboard com visão geral
- ✅ Gestão completa de projetos
- ✅ Sistema de tarefas com status
- ✅ Mapas mentais interativos
- ✅ Interface responsiva
- ✅ Navegação intuitiva