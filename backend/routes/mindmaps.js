const express = require('express');

module.exports = (db) => {
  const router = express.Router();

  // GET - Listar todos os mapas mentais
  router.get('/', (req, res) => {
    const { project_id } = req.query;
    let sql = `SELECT m.*, p.name as project_name FROM mindmaps m 
               LEFT JOIN projects p ON m.project_id = p.id`;
    let params = [];
    
    if (project_id) {
      sql += ` WHERE m.project_id = ?`;
      params.push(project_id);
    }
    
    sql += ` ORDER BY m.created_at DESC`;
    
    db.all(sql, params, (err, rows) => {
      if (err) {
        console.error('Erro ao buscar mapas mentais:', err.message);
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

  // GET - Buscar mapa mental por ID
  router.get('/:id', (req, res) => {
    const { id } = req.params;
    const sql = `SELECT m.*, p.name as project_name FROM mindmaps m 
                 LEFT JOIN projects p ON m.project_id = p.id 
                 WHERE m.id = ?`;
    
    db.get(sql, [id], (err, row) => {
      if (err) {
        console.error('Erro ao buscar mapa mental:', err.message);
        res.status(500).json({ error: 'Erro interno do servidor' });
        return;
      }
      
      if (!row) {
        res.status(404).json({ error: 'Mapa mental não encontrado' });
        return;
      }
      
      // Parse JSON fields
      const mindmap = {
        ...row,
        nodes: row.nodes ? JSON.parse(row.nodes) : [],
        connections: row.connections ? JSON.parse(row.connections) : []
      };
      
      res.json(mindmap);
    });
  });

  // POST - Criar novo mapa mental
  router.post('/', (req, res) => {
    const { 
      project_id, 
      title, 
      content, 
      nodes, 
      connections 
    } = req.body;
    
    if (!title) {
      res.status(400).json({ error: 'Título do mapa mental é obrigatório' });
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

      const sql = `INSERT INTO mindmaps (project_id, title, content, nodes, connections)
                   VALUES (?, ?, ?, ?, ?)`;
      
      const params = [
        project_id,
        title,
        content || '',
        JSON.stringify(nodes || []),
        JSON.stringify(connections || [])
      ];

      db.run(sql, params, function(err) {
        if (err) {
          console.error('Erro ao criar mapa mental:', err.message);
          res.status(500).json({ error: 'Erro interno do servidor' });
          return;
        }
        
        // Buscar o mapa mental criado com informações do projeto
        const selectSql = `SELECT m.*, p.name as project_name FROM mindmaps m 
                          LEFT JOIN projects p ON m.project_id = p.id 
                          WHERE m.id = ?`;
        
        db.get(selectSql, [this.lastID], (err, row) => {
          if (err) {
            console.error('Erro ao buscar mapa mental criado:', err.message);
            res.status(500).json({ error: 'Erro interno do servidor' });
            return;
          }
          
          // Parse JSON fields
          const mindmap = {
            ...row,
            nodes: row.nodes ? JSON.parse(row.nodes) : [],
            connections: row.connections ? JSON.parse(row.connections) : []
          };
          
          res.status(201).json(mindmap);
        });
      });
    });
  });

  // PUT - Atualizar mapa mental
  router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { 
      project_id, 
      title, 
      content, 
      nodes, 
      connections 
    } = req.body;
    
    if (!title) {
      res.status(400).json({ error: 'Título do mapa mental é obrigatório' });
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
        
        updateMindmap();
      });
    } else {
      updateMindmap();
    }

    function updateMindmap() {
      const sql = `UPDATE mindmaps 
                   SET title = ?, content = ?, nodes = ?, connections = ?, updated_at = CURRENT_TIMESTAMP
                   ${project_id ? ', project_id = ?' : ''}
                   WHERE id = ?`;
      
      const params = [
        title,
        content || '',
        JSON.stringify(nodes || []),
        JSON.stringify(connections || [])
      ];
      
      if (project_id) {
        params.push(project_id);
      }
      params.push(id);

      db.run(sql, params, function(err) {
        if (err) {
          console.error('Erro ao atualizar mapa mental:', err.message);
          res.status(500).json({ error: 'Erro interno do servidor' });
          return;
        }
        
        if (this.changes === 0) {
          res.status(404).json({ error: 'Mapa mental não encontrado' });
          return;
        }
        
        // Buscar o mapa mental atualizado com informações do projeto
        const selectSql = `SELECT m.*, p.name as project_name FROM mindmaps m 
                          LEFT JOIN projects p ON m.project_id = p.id 
                          WHERE m.id = ?`;
        
        db.get(selectSql, [id], (err, row) => {
          if (err) {
            console.error('Erro ao buscar mapa mental atualizado:', err.message);
            res.status(500).json({ error: 'Erro interno do servidor' });
            return;
          }
          
          // Parse JSON fields
          const mindmap = {
            ...row,
            nodes: row.nodes ? JSON.parse(row.nodes) : [],
            connections: row.connections ? JSON.parse(row.connections) : []
          };
          
          res.json(mindmap);
        });
      });
    }
  });

  // DELETE - Excluir mapa mental
  router.delete('/:id', (req, res) => {
    const { id } = req.params;
    
    // Primeiro, verificar se o mapa mental existe
    db.get('SELECT * FROM mindmaps WHERE id = ?', [id], (err, row) => {
      if (err) {
        console.error('Erro ao buscar mapa mental:', err.message);
        res.status(500).json({ error: 'Erro interno do servidor' });
        return;
      }
      
      if (!row) {
        res.status(404).json({ error: 'Mapa mental não encontrado' });
        return;
      }
      
      // Excluir o mapa mental
      const sql = `DELETE FROM mindmaps WHERE id = ?`;
      
      db.run(sql, [id], function(err) {
        if (err) {
          console.error('Erro ao excluir mapa mental:', err.message);
          res.status(500).json({ error: 'Erro interno do servidor' });
          return;
        }
        
        res.json({ 
          message: 'Mapa mental excluído com sucesso',
          deletedMindmap: {
            ...row,
            nodes: row.nodes ? JSON.parse(row.nodes) : [],
            connections: row.connections ? JSON.parse(row.connections) : []
          }
        });
      });
    });
  });

  // POST - Adicionar nó ao mapa mental
  router.post('/:id/nodes', (req, res) => {
    const { id } = req.params;
    const { node } = req.body;
    
    if (!node || !node.id || !node.text) {
      res.status(400).json({ error: 'Dados do nó são obrigatórios (id, text)' });
      return;
    }

    // Buscar mapa mental atual
    db.get('SELECT nodes FROM mindmaps WHERE id = ?', [id], (err, row) => {
      if (err) {
        console.error('Erro ao buscar mapa mental:', err.message);
        res.status(500).json({ error: 'Erro interno do servidor' });
        return;
      }
      
      if (!row) {
        res.status(404).json({ error: 'Mapa mental não encontrado' });
        return;
      }
      
      const currentNodes = row.nodes ? JSON.parse(row.nodes) : [];
      
      // Verificar se o nó já existe
      if (currentNodes.find(n => n.id === node.id)) {
        res.status(400).json({ error: 'Nó com este ID já existe' });
        return;
      }
      
      // Adicionar novo nó
      currentNodes.push(node);
      
      // Atualizar no banco
      const sql = `UPDATE mindmaps SET nodes = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
      
      db.run(sql, [JSON.stringify(currentNodes), id], function(err) {
        if (err) {
          console.error('Erro ao adicionar nó:', err.message);
          res.status(500).json({ error: 'Erro interno do servidor' });
          return;
        }
        
        res.json({ 
          message: 'Nó adicionado com sucesso',
          node: node,
          totalNodes: currentNodes.length
        });
      });
    });
  });

  // DELETE - Remover nó do mapa mental
  router.delete('/:id/nodes/:nodeId', (req, res) => {
    const { id, nodeId } = req.params;
    
    // Buscar mapa mental atual
    db.get('SELECT nodes, connections FROM mindmaps WHERE id = ?', [id], (err, row) => {
      if (err) {
        console.error('Erro ao buscar mapa mental:', err.message);
        res.status(500).json({ error: 'Erro interno do servidor' });
        return;
      }
      
      if (!row) {
        res.status(404).json({ error: 'Mapa mental não encontrado' });
        return;
      }
      
      const currentNodes = row.nodes ? JSON.parse(row.nodes) : [];
      const currentConnections = row.connections ? JSON.parse(row.connections) : [];
      
      // Remover nó
      const updatedNodes = currentNodes.filter(n => n.id !== nodeId);
      
      if (updatedNodes.length === currentNodes.length) {
        res.status(404).json({ error: 'Nó não encontrado' });
        return;
      }
      
      // Remover conexões relacionadas ao nó
      const updatedConnections = currentConnections.filter(
        c => c.from !== nodeId && c.to !== nodeId
      );
      
      // Atualizar no banco
      const sql = `UPDATE mindmaps SET nodes = ?, connections = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
      
      db.run(sql, [JSON.stringify(updatedNodes), JSON.stringify(updatedConnections), id], function(err) {
        if (err) {
          console.error('Erro ao remover nó:', err.message);
          res.status(500).json({ error: 'Erro interno do servidor' });
          return;
        }
        
        res.json({ 
          message: 'Nó removido com sucesso',
          removedNodeId: nodeId,
          totalNodes: updatedNodes.length,
          totalConnections: updatedConnections.length
        });
      });
    });
  });

  return router;
};