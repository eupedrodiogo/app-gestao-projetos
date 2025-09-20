const express = require('express');

module.exports = (db) => {
  const router = express.Router();

  // GET - Listar todos os projetos
  router.get('/', (req, res) => {
    const sql = `SELECT * FROM projects ORDER BY created_at DESC`;
    
    db.all(sql, [], (err, rows) => {
      if (err) {
        console.error('Erro ao buscar projetos:', err.message);
        res.status(500).json({ error: 'Erro interno do servidor' });
        return;
      }
      res.json(rows);
    });
  });

  // GET - Buscar projeto por ID
  router.get('/:id', (req, res) => {
    const { id } = req.params;
    const sql = `SELECT * FROM projects WHERE id = ?`;
    
    db.get(sql, [id], (err, row) => {
      if (err) {
        console.error('Erro ao buscar projeto:', err.message);
        res.status(500).json({ error: 'Erro interno do servidor' });
        return;
      }
      
      if (!row) {
        res.status(404).json({ error: 'Projeto não encontrado' });
        return;
      }
      
      res.json(row);
    });
  });

  // POST - Criar novo projeto
  router.post('/', (req, res) => {
    const { name, description, status, priority, start_date, end_date, progress } = req.body;
    
    if (!name) {
      res.status(400).json({ error: 'Nome do projeto é obrigatório' });
      return;
    }

    const sql = `INSERT INTO projects (name, description, status, priority, start_date, end_date, progress)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;
    
    const params = [
      name,
      description || '',
      status || 'Em Andamento',
      priority || 'Média',
      start_date || null,
      end_date || null,
      progress || 0
    ];

    db.run(sql, params, function(err) {
      if (err) {
        console.error('Erro ao criar projeto:', err.message);
        res.status(500).json({ error: 'Erro interno do servidor' });
        return;
      }
      
      // Buscar o projeto criado
      db.get('SELECT * FROM projects WHERE id = ?', [this.lastID], (err, row) => {
        if (err) {
          console.error('Erro ao buscar projeto criado:', err.message);
          res.status(500).json({ error: 'Erro interno do servidor' });
          return;
        }
        
        res.status(201).json(row);
      });
    });
  });

  // PUT - Atualizar projeto
  router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { name, description, status, priority, start_date, end_date, progress } = req.body;
    
    if (!name) {
      res.status(400).json({ error: 'Nome do projeto é obrigatório' });
      return;
    }

    const sql = `UPDATE projects 
                 SET name = ?, description = ?, status = ?, priority = ?, 
                     start_date = ?, end_date = ?, progress = ?, updated_at = CURRENT_TIMESTAMP
                 WHERE id = ?`;
    
    const params = [
      name,
      description || '',
      status || 'Em Andamento',
      priority || 'Média',
      start_date || null,
      end_date || null,
      progress || 0,
      id
    ];

    db.run(sql, params, function(err) {
      if (err) {
        console.error('Erro ao atualizar projeto:', err.message);
        res.status(500).json({ error: 'Erro interno do servidor' });
        return;
      }
      
      if (this.changes === 0) {
        res.status(404).json({ error: 'Projeto não encontrado' });
        return;
      }
      
      // Buscar o projeto atualizado
      db.get('SELECT * FROM projects WHERE id = ?', [id], (err, row) => {
        if (err) {
          console.error('Erro ao buscar projeto atualizado:', err.message);
          res.status(500).json({ error: 'Erro interno do servidor' });
          return;
        }
        
        res.json(row);
      });
    });
  });

  // DELETE - Excluir projeto
  router.delete('/:id', (req, res) => {
    const { id } = req.params;
    
    // Primeiro, verificar se o projeto existe
    db.get('SELECT * FROM projects WHERE id = ?', [id], (err, row) => {
      if (err) {
        console.error('Erro ao buscar projeto:', err.message);
        res.status(500).json({ error: 'Erro interno do servidor' });
        return;
      }
      
      if (!row) {
        res.status(404).json({ error: 'Projeto não encontrado' });
        return;
      }
      
      // Excluir o projeto (as tarefas e mapas mentais serão excluídos automaticamente devido ao CASCADE)
      const sql = `DELETE FROM projects WHERE id = ?`;
      
      db.run(sql, [id], function(err) {
        if (err) {
          console.error('Erro ao excluir projeto:', err.message);
          res.status(500).json({ error: 'Erro interno do servidor' });
          return;
        }
        
        res.json({ 
          message: 'Projeto excluído com sucesso',
          deletedProject: row
        });
      });
    });
  });

  // GET - Buscar tarefas de um projeto
  router.get('/:id/tasks', (req, res) => {
    const { id } = req.params;
    const sql = `SELECT * FROM tasks WHERE project_id = ? ORDER BY created_at DESC`;
    
    db.all(sql, [id], (err, rows) => {
      if (err) {
        console.error('Erro ao buscar tarefas do projeto:', err.message);
        res.status(500).json({ error: 'Erro interno do servidor' });
        return;
      }
      res.json(rows);
    });
  });

  // GET - Buscar mapas mentais de um projeto
  router.get('/:id/mindmaps', (req, res) => {
    const { id } = req.params;
    const sql = `SELECT * FROM mindmaps WHERE project_id = ? ORDER BY created_at DESC`;
    
    db.all(sql, [id], (err, rows) => {
      if (err) {
        console.error('Erro ao buscar mapas mentais do projeto:', err.message);
        res.status(500).json({ error: 'Erro interno do servidor' });
        return;
      }
      
      // Parse JSON fields
      const mindmaps = rows.map(row => ({
        ...row,
        nodes: row.nodes ? JSON.parse(row.nodes) : [],
        connections: row.connections ? JSON.parse(row.connections) : []
      }));
      
      res.json(mindmaps);
    });
  });

  return router;
};