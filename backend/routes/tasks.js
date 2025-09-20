const express = require('express');

module.exports = (db) => {
  const router = express.Router();

  // GET - Listar todas as tarefas
  router.get('/', (req, res) => {
    const { project_id } = req.query;
    let sql = `SELECT t.*, p.name as project_name FROM tasks t 
               LEFT JOIN projects p ON t.project_id = p.id`;
    let params = [];
    
    if (project_id) {
      sql += ` WHERE t.project_id = ?`;
      params.push(project_id);
    }
    
    sql += ` ORDER BY t.created_at DESC`;
    
    db.all(sql, params, (err, rows) => {
      if (err) {
        console.error('Erro ao buscar tarefas:', err.message);
        res.status(500).json({ error: 'Erro interno do servidor' });
        return;
      }
      res.json(rows);
    });
  });

  // GET - Buscar tarefa por ID
  router.get('/:id', (req, res) => {
    const { id } = req.params;
    const sql = `SELECT t.*, p.name as project_name FROM tasks t 
                 LEFT JOIN projects p ON t.project_id = p.id 
                 WHERE t.id = ?`;
    
    db.get(sql, [id], (err, row) => {
      if (err) {
        console.error('Erro ao buscar tarefa:', err.message);
        res.status(500).json({ error: 'Erro interno do servidor' });
        return;
      }
      
      if (!row) {
        res.status(404).json({ error: 'Tarefa não encontrada' });
        return;
      }
      
      res.json(row);
    });
  });

  // POST - Criar nova tarefa
  router.post('/', (req, res) => {
    const { 
      project_id, 
      title, 
      description, 
      status, 
      priority, 
      assigned_to, 
      due_date, 
      completed 
    } = req.body;
    
    if (!title) {
      res.status(400).json({ error: 'Título da tarefa é obrigatório' });
      return;
    }

    if (!project_id) {
      res.status(400).json({ error: 'ID do projeto é obrigatório' });
      return;
    }

    // Verificar se o projeto existe
    db.get('SELECT id FROM projects WHERE id = ?', [project_id], (err, project) => {
      if (err) {
        console.error('Erro ao verificar projeto:', err.message);
        res.status(500).json({ error: 'Erro interno do servidor' });
        return;
      }
      
      if (!project) {
        res.status(400).json({ error: 'Projeto não encontrado' });
        return;
      }

      const sql = `INSERT INTO tasks (project_id, title, description, status, priority, assigned_to, due_date, completed)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
      
      const params = [
        project_id,
        title,
        description || '',
        status || 'Pendente',
        priority || 'Média',
        assigned_to || '',
        due_date || null,
        completed || 0
      ];

      db.run(sql, params, function(err) {
        if (err) {
          console.error('Erro ao criar tarefa:', err.message);
          res.status(500).json({ error: 'Erro interno do servidor' });
          return;
        }
        
        // Buscar a tarefa criada com informações do projeto
        const selectSql = `SELECT t.*, p.name as project_name FROM tasks t 
                          LEFT JOIN projects p ON t.project_id = p.id 
                          WHERE t.id = ?`;
        
        db.get(selectSql, [this.lastID], (err, row) => {
          if (err) {
            console.error('Erro ao buscar tarefa criada:', err.message);
            res.status(500).json({ error: 'Erro interno do servidor' });
            return;
          }
          
          res.status(201).json(row);
        });
      });
    });
  });

  // PUT - Atualizar tarefa
  router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { 
      project_id, 
      title, 
      description, 
      status, 
      priority, 
      assigned_to, 
      due_date, 
      completed 
    } = req.body;
    
    if (!title) {
      res.status(400).json({ error: 'Título da tarefa é obrigatório' });
      return;
    }

    // Se project_id foi fornecido, verificar se o projeto existe
    if (project_id) {
      db.get('SELECT id FROM projects WHERE id = ?', [project_id], (err, project) => {
        if (err) {
          console.error('Erro ao verificar projeto:', err.message);
          res.status(500).json({ error: 'Erro interno do servidor' });
          return;
        }
        
        if (!project) {
          res.status(400).json({ error: 'Projeto não encontrado' });
          return;
        }
        
        updateTask();
      });
    } else {
      updateTask();
    }

    function updateTask() {
      const sql = `UPDATE tasks 
                   SET title = ?, description = ?, status = ?, priority = ?, 
                       assigned_to = ?, due_date = ?, completed = ?, updated_at = CURRENT_TIMESTAMP
                   ${project_id ? ', project_id = ?' : ''}
                   WHERE id = ?`;
      
      const params = [
        title,
        description || '',
        status || 'Pendente',
        priority || 'Média',
        assigned_to || '',
        due_date || null,
        completed || 0
      ];
      
      if (project_id) {
        params.push(project_id);
      }
      params.push(id);

      db.run(sql, params, function(err) {
        if (err) {
          console.error('Erro ao atualizar tarefa:', err.message);
          res.status(500).json({ error: 'Erro interno do servidor' });
          return;
        }
        
        if (this.changes === 0) {
          res.status(404).json({ error: 'Tarefa não encontrada' });
          return;
        }
        
        // Buscar a tarefa atualizada com informações do projeto
        const selectSql = `SELECT t.*, p.name as project_name FROM tasks t 
                          LEFT JOIN projects p ON t.project_id = p.id 
                          WHERE t.id = ?`;
        
        db.get(selectSql, [id], (err, row) => {
          if (err) {
            console.error('Erro ao buscar tarefa atualizada:', err.message);
            res.status(500).json({ error: 'Erro interno do servidor' });
            return;
          }
          
          res.json(row);
        });
      });
    }
  });

  // DELETE - Excluir tarefa
  router.delete('/:id', (req, res) => {
    const { id } = req.params;
    
    // Primeiro, verificar se a tarefa existe
    db.get('SELECT * FROM tasks WHERE id = ?', [id], (err, row) => {
      if (err) {
        console.error('Erro ao buscar tarefa:', err.message);
        res.status(500).json({ error: 'Erro interno do servidor' });
        return;
      }
      
      if (!row) {
        res.status(404).json({ error: 'Tarefa não encontrada' });
        return;
      }
      
      // Excluir a tarefa
      const sql = `DELETE FROM tasks WHERE id = ?`;
      
      db.run(sql, [id], function(err) {
        if (err) {
          console.error('Erro ao excluir tarefa:', err.message);
          res.status(500).json({ error: 'Erro interno do servidor' });
          return;
        }
        
        res.json({ 
          message: 'Tarefa excluída com sucesso',
          deletedTask: row
        });
      });
    });
  });

  // PATCH - Marcar tarefa como concluída/pendente
  router.patch('/:id/toggle', (req, res) => {
    const { id } = req.params;
    
    // Buscar status atual da tarefa
    db.get('SELECT completed FROM tasks WHERE id = ?', [id], (err, row) => {
      if (err) {
        console.error('Erro ao buscar tarefa:', err.message);
        res.status(500).json({ error: 'Erro interno do servidor' });
        return;
      }
      
      if (!row) {
        res.status(404).json({ error: 'Tarefa não encontrada' });
        return;
      }
      
      const newCompleted = row.completed ? 0 : 1;
      const newStatus = newCompleted ? 'Concluída' : 'Pendente';
      
      const sql = `UPDATE tasks 
                   SET completed = ?, status = ?, updated_at = CURRENT_TIMESTAMP
                   WHERE id = ?`;
      
      db.run(sql, [newCompleted, newStatus, id], function(err) {
        if (err) {
          console.error('Erro ao atualizar status da tarefa:', err.message);
          res.status(500).json({ error: 'Erro interno do servidor' });
          return;
        }
        
        // Buscar a tarefa atualizada
        const selectSql = `SELECT t.*, p.name as project_name FROM tasks t 
                          LEFT JOIN projects p ON t.project_id = p.id 
                          WHERE t.id = ?`;
        
        db.get(selectSql, [id], (err, updatedRow) => {
          if (err) {
            console.error('Erro ao buscar tarefa atualizada:', err.message);
            res.status(500).json({ error: 'Erro interno do servidor' });
            return;
          }
          
          res.json(updatedRow);
        });
      });
    });
  });

  return router;
};