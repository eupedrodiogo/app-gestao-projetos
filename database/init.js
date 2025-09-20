const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Caminho para o arquivo do banco de dados
const dbPath = path.join(__dirname, 'gestao_projetos.db');

// Criar conexão com o banco de dados
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erro ao conectar com o banco de dados:', err.message);
  } else {
    console.log('Conectado ao banco de dados SQLite.');
  }
});

// Criar tabelas
function initializeDatabase() {
  // Tabela de Projetos
  db.run(`CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'Em Andamento',
    priority TEXT DEFAULT 'Média',
    start_date TEXT,
    end_date TEXT,
    progress INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`, (err) => {
    if (err) {
      console.error('Erro ao criar tabela projects:', err.message);
    } else {
      console.log('Tabela projects criada com sucesso.');
    }
  });

  // Tabela de Tarefas
  db.run(`CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'Pendente',
    priority TEXT DEFAULT 'Média',
    assigned_to TEXT,
    due_date TEXT,
    completed BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE
  )`, (err) => {
    if (err) {
      console.error('Erro ao criar tabela tasks:', err.message);
    } else {
      console.log('Tabela tasks criada com sucesso.');
    }
  });

  // Tabela de Mapas Mentais
  db.run(`CREATE TABLE IF NOT EXISTS mindmaps (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER,
    title TEXT NOT NULL,
    content TEXT,
    nodes TEXT, -- JSON string com os nós do mapa mental
    connections TEXT, -- JSON string com as conexões
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE
  )`, (err) => {
    if (err) {
      console.error('Erro ao criar tabela mindmaps:', err.message);
    } else {
      console.log('Tabela mindmaps criada com sucesso.');
    }
  });

  // Inserir dados de exemplo
  insertSampleData();
}

function insertSampleData() {
  // Verificar se já existem dados
  db.get("SELECT COUNT(*) as count FROM projects", (err, row) => {
    if (err) {
      console.error('Erro ao verificar dados:', err.message);
      return;
    }

    if (row.count === 0) {
      // Inserir projetos de exemplo
      const sampleProjects = [
        {
          name: 'Sistema de Vendas Online',
          description: 'Desenvolvimento de plataforma e-commerce completa',
          status: 'Em Andamento',
          priority: 'Alta',
          start_date: '2024-01-15',
          end_date: '2024-06-30',
          progress: 45
        },
        {
          name: 'App Mobile de Delivery',
          description: 'Aplicativo para delivery de comida',
          status: 'Planejamento',
          priority: 'Média',
          start_date: '2024-02-01',
          end_date: '2024-08-15',
          progress: 15
        }
      ];

      sampleProjects.forEach(project => {
        db.run(`INSERT INTO projects (name, description, status, priority, start_date, end_date, progress)
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [project.name, project.description, project.status, project.priority, 
           project.start_date, project.end_date, project.progress],
          function(err) {
            if (err) {
              console.error('Erro ao inserir projeto:', err.message);
            } else {
              console.log(`Projeto inserido com ID: ${this.lastID}`);
              
              // Inserir tarefas de exemplo para este projeto
              const sampleTasks = [
                {
                  project_id: this.lastID,
                  title: 'Análise de Requisitos',
                  description: 'Levantar todos os requisitos funcionais e não funcionais',
                  status: 'Concluída',
                  priority: 'Alta',
                  assigned_to: 'Analista',
                  due_date: '2024-02-15',
                  completed: 1
                },
                {
                  project_id: this.lastID,
                  title: 'Design da Interface',
                  description: 'Criar mockups e protótipos da interface',
                  status: 'Em Andamento',
                  priority: 'Média',
                  assigned_to: 'Designer',
                  due_date: '2024-03-30',
                  completed: 0
                }
              ];

              sampleTasks.forEach(task => {
                db.run(`INSERT INTO tasks (project_id, title, description, status, priority, assigned_to, due_date, completed)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                  [task.project_id, task.title, task.description, task.status, 
                   task.priority, task.assigned_to, task.due_date, task.completed],
                  (err) => {
                    if (err) {
                      console.error('Erro ao inserir tarefa:', err.message);
                    } else {
                      console.log('Tarefa inserida com sucesso.');
                    }
                  });
              });
            }
          });
      });

      console.log('Dados de exemplo inseridos com sucesso.');
    } else {
      console.log('Banco de dados já contém dados.');
    }
  });
}

// Inicializar o banco de dados
initializeDatabase();

// Fechar conexão quando o processo terminar
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Erro ao fechar banco de dados:', err.message);
    } else {
      console.log('Conexão com banco de dados fechada.');
    }
    process.exit(0);
  });
});

module.exports = db;