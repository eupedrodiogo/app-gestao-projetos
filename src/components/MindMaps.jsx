import React, { useState, useRef, useEffect } from 'react'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Brain,
  Download,
  Upload,
  X,
  Circle,
  Square,
  Triangle,
  Minus
} from 'lucide-react'

function MindMaps({ mindMaps, setMindMaps, projects }) {
  const [showModal, setShowModal] = useState(false)
  const [editingMindMap, setEditingMindMap] = useState(null)
  const [selectedMindMap, setSelectedMindMap] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    projectId: '',
    nodes: [],
    connections: []
  })

  // Mind Map Editor State
  const [nodes, setNodes] = useState([])
  const [connections, setConnections] = useState([])
  const [selectedNode, setSelectedNode] = useState(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [drawingFrom, setDrawingFrom] = useState(null)
  const [nodeText, setNodeText] = useState('')
  const [nodeColor, setNodeColor] = useState('#667eea')
  const [nodeShape, setNodeShape] = useState('circle')
  const canvasRef = useRef(null)

  const colors = [
    '#667eea', '#764ba2', '#f093fb', '#f5576c',
    '#4facfe', '#00f2fe', '#43e97b', '#38f9d7',
    '#ffecd2', '#fcb69f', '#a8edea', '#fed6e3'
  ]

  const shapes = [
    { value: 'circle', icon: Circle, label: 'Círculo' },
    { value: 'square', icon: Square, label: 'Quadrado' },
    { value: 'triangle', icon: Triangle, label: 'Triângulo' }
  ]

  useEffect(() => {
    if (selectedMindMap) {
      setNodes(selectedMindMap.nodes || [])
      setConnections(selectedMindMap.connections || [])
    }
  }, [selectedMindMap])

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const mindMapData = {
      ...formData,
      nodes,
      connections
    }
    
    if (editingMindMap) {
      setMindMaps(mindMaps.map(m => 
        m.id === editingMindMap.id 
          ? { ...mindMapData, id: editingMindMap.id, createdAt: editingMindMap.createdAt, updatedAt: new Date().toISOString() }
          : m
      ))
    } else {
      const newMindMap = {
        ...mindMapData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      setMindMaps([...mindMaps, newMindMap])
    }
    
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      projectId: '',
      nodes: [],
      connections: []
    })
    setNodes([])
    setConnections([])
    setEditingMindMap(null)
    setShowModal(false)
    setSelectedMindMap(null)
  }

  const handleEdit = (mindMap) => {
    setFormData(mindMap)
    setEditingMindMap(mindMap)
    setSelectedMindMap(mindMap)
    setShowModal(true)
  }

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este mapa mental?')) {
      setMindMaps(mindMaps.filter(m => m.id !== id))
    }
  }

  const handleCanvasClick = (e) => {
    if (!canvasRef.current) return
    
    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    // Check if clicking on existing node
    const clickedNode = nodes.find(node => {
      const distance = Math.sqrt(Math.pow(x - node.x, 2) + Math.pow(y - node.y, 2))
      return distance <= 30
    })
    
    if (clickedNode) {
      if (isDrawing && drawingFrom && drawingFrom.id !== clickedNode.id) {
        // Create connection
        const newConnection = {
          id: Date.now().toString(),
          from: drawingFrom.id,
          to: clickedNode.id
        }
        setConnections([...connections, newConnection])
        setIsDrawing(false)
        setDrawingFrom(null)
      } else {
        setSelectedNode(clickedNode)
        setNodeText(clickedNode.text)
        setNodeColor(clickedNode.color)
        setNodeShape(clickedNode.shape)
      }
    } else if (!isDrawing) {
      // Create new node
      if (nodeText.trim()) {
        const newNode = {
          id: Date.now().toString(),
          x,
          y,
          text: nodeText,
          color: nodeColor,
          shape: nodeShape
        }
        setNodes([...nodes, newNode])
        setNodeText('')
      }
    }
  }

  const startDrawing = (node) => {
    setIsDrawing(true)
    setDrawingFrom(node)
  }

  const updateSelectedNode = () => {
    if (selectedNode) {
      setNodes(nodes.map(node => 
        node.id === selectedNode.id 
          ? { ...node, text: nodeText, color: nodeColor, shape: nodeShape }
          : node
      ))
      setSelectedNode(null)
    }
  }

  const deleteSelectedNode = () => {
    if (selectedNode) {
      setNodes(nodes.filter(node => node.id !== selectedNode.id))
      setConnections(connections.filter(conn => 
        conn.from !== selectedNode.id && conn.to !== selectedNode.id
      ))
      setSelectedNode(null)
    }
  }

  const exportMindMap = () => {
    const dataStr = JSON.stringify({ nodes, connections }, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `mapa-mental-${Date.now()}.json`
    link.click()
  }

  const importMindMap = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result)
          if (data.nodes && data.connections) {
            setNodes(data.nodes)
            setConnections(data.connections)
          }
        } catch (error) {
          alert('Erro ao importar arquivo. Verifique se é um arquivo JSON válido.')
        }
      }
      reader.readAsText(file)
    }
  }

  const getProjectName = (projectId) => {
    const project = projects.find(p => p.id === projectId)
    return project ? project.name : 'Projeto não encontrado'
  }

  const renderNode = (node) => {
    const { x, y, text, color, shape } = node
    const isSelected = selectedNode && selectedNode.id === node.id
    
    return (
      <g key={node.id}>
        {shape === 'circle' && (
          <circle
            cx={x}
            cy={y}
            r="30"
            fill={color}
            stroke={isSelected ? '#000' : 'none'}
            strokeWidth={isSelected ? 2 : 0}
            style={{ cursor: 'pointer' }}
          />
        )}
        {shape === 'square' && (
          <rect
            x={x - 30}
            y={y - 30}
            width="60"
            height="60"
            fill={color}
            stroke={isSelected ? '#000' : 'none'}
            strokeWidth={isSelected ? 2 : 0}
            style={{ cursor: 'pointer' }}
          />
        )}
        {shape === 'triangle' && (
          <polygon
            points={`${x},${y-30} ${x-26},${y+20} ${x+26},${y+20}`}
            fill={color}
            stroke={isSelected ? '#000' : 'none'}
            strokeWidth={isSelected ? 2 : 0}
            style={{ cursor: 'pointer' }}
          />
        )}
        <text
          x={x}
          y={y + 5}
          textAnchor="middle"
          fill="white"
          fontSize="12"
          fontWeight="bold"
          style={{ pointerEvents: 'none', userSelect: 'none' }}
        >
          {text.length > 8 ? text.substring(0, 8) + '...' : text}
        </text>
      </g>
    )
  }

  const renderConnection = (connection) => {
    const fromNode = nodes.find(n => n.id === connection.from)
    const toNode = nodes.find(n => n.id === connection.to)
    
    if (!fromNode || !toNode) return null
    
    return (
      <line
        key={connection.id}
        x1={fromNode.x}
        y1={fromNode.y}
        x2={toNode.x}
        y2={toNode.y}
        stroke="#666"
        strokeWidth="2"
        markerEnd="url(#arrowhead)"
      />
    )
  }

  return (
    <div>
      <div className="flex-between mb-4">
        <h1 className="text-xl">Mapas Mentais</h1>
        <button className="btn" onClick={() => setShowModal(true)}>
          <Plus size={18} />
          Novo Mapa Mental
        </button>
      </div>

      {/* Mind Maps Grid */}
      <div className="grid grid-2">
        {mindMaps.map((mindMap) => (
          <div key={mindMap.id} className="card">
            <div className="flex-between mb-3">
              <h3 style={{ fontSize: '18px', fontWeight: '600' }}>{mindMap.title}</h3>
              <div className="flex">
                <button 
                  className="btn-secondary" 
                  onClick={() => handleEdit(mindMap)}
                  style={{ padding: '6px', marginRight: '8px' }}
                >
                  <Edit size={16} />
                </button>
                <button 
                  className="btn-danger" 
                  onClick={() => handleDelete(mindMap.id)}
                  style={{ padding: '6px' }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <p className="text-muted mb-3" style={{ fontSize: '14px' }}>
              {mindMap.description}
            </p>

            {mindMap.projectId && (
              <div className="flex text-sm mb-3">
                <strong style={{ marginRight: '8px' }}>Projeto:</strong>
                <span>{getProjectName(mindMap.projectId)}</span>
              </div>
            )}

            {/* Mini preview */}
            <div style={{
              height: '150px',
              background: '#f8f9fa',
              borderRadius: '8px',
              border: '1px solid #e9ecef',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <svg width="100%" height="100%" style={{ position: 'absolute' }}>
                {mindMap.connections && mindMap.connections.map(connection => {
                  const fromNode = mindMap.nodes?.find(n => n.id === connection.from)
                  const toNode = mindMap.nodes?.find(n => n.id === connection.to)
                  
                  if (!fromNode || !toNode) return null
                  
                  return (
                    <line
                      key={connection.id}
                      x1={fromNode.x * 0.3}
                      y1={fromNode.y * 0.3}
                      x2={toNode.x * 0.3}
                      y2={toNode.y * 0.3}
                      stroke="#666"
                      strokeWidth="1"
                    />
                  )
                })}
                {mindMap.nodes && mindMap.nodes.map(node => (
                  <circle
                    key={node.id}
                    cx={node.x * 0.3}
                    cy={node.y * 0.3}
                    r="8"
                    fill={node.color}
                  />
                ))}
              </svg>
            </div>

            <div className="flex-between mt-3 text-sm text-muted">
              <span>{mindMap.nodes?.length || 0} nó(s)</span>
              <span>Criado em {new Date(mindMap.createdAt).toLocaleDateString('pt-BR')}</span>
            </div>
          </div>
        ))}
      </div>

      {mindMaps.length === 0 && (
        <div className="card text-center">
          <Brain size={64} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
          <h3 style={{ marginBottom: '8px' }}>Nenhum mapa mental encontrado</h3>
          <p className="text-muted mb-4">Comece criando seu primeiro mapa mental para organizar ideias</p>
          <button className="btn" onClick={() => setShowModal(true)}>
            <Plus size={18} />
            Criar Primeiro Mapa Mental
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && resetForm()}>
          <div className="modal" style={{ maxWidth: '90vw', maxHeight: '90vh' }}>
            <div className="flex-between mb-4">
              <h2>{editingMindMap ? 'Editar Mapa Mental' : 'Novo Mapa Mental'}</h2>
              <button className="btn-secondary" onClick={resetForm} style={{ padding: '6px' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-2 mb-4">
                <div className="form-group">
                  <label>Título *</label>
                  <input
                    type="text"
                    className="input"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Projeto</label>
                  <select
                    className="select"
                    value={formData.projectId}
                    onChange={(e) => setFormData({...formData, projectId: e.target.value})}
                  >
                    <option value="">Selecione um projeto</option>
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group mb-4">
                <label>Descrição</label>
                <textarea
                  className="textarea"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows="2"
                />
              </div>

              {/* Mind Map Editor */}
              <div className="mb-4">
                <h3 className="mb-3">Editor de Mapa Mental</h3>
                
                {/* Tools */}
                <div className="card mb-3" style={{ padding: '16px' }}>
                  <div className="grid grid-3 mb-3">
                    <div className="form-group">
                      <label>Texto do Nó</label>
                      <input
                        type="text"
                        className="input"
                        value={nodeText}
                        onChange={(e) => setNodeText(e.target.value)}
                        placeholder="Digite o texto..."
                      />
                    </div>

                    <div className="form-group">
                      <label>Forma</label>
                      <select
                        className="select"
                        value={nodeShape}
                        onChange={(e) => setNodeShape(e.target.value)}
                      >
                        {shapes.map(shape => (
                          <option key={shape.value} value={shape.value}>
                            {shape.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Cor</label>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        {colors.map(color => (
                          <button
                            key={color}
                            type="button"
                            onClick={() => setNodeColor(color)}
                            style={{
                              width: '24px',
                              height: '24px',
                              background: color,
                              border: nodeColor === color ? '2px solid #000' : '1px solid #ccc',
                              borderRadius: '4px',
                              cursor: 'pointer'
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex" style={{ gap: '8px', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => {
                        setIsDrawing(!isDrawing)
                        setDrawingFrom(null)
                      }}
                      style={{ background: isDrawing ? '#667eea' : undefined, color: isDrawing ? 'white' : undefined }}
                    >
                      <Minus size={16} />
                      {isDrawing ? 'Cancelar Conexão' : 'Conectar Nós'}
                    </button>

                    {selectedNode && (
                      <>
                        <button
                          type="button"
                          className="btn"
                          onClick={updateSelectedNode}
                        >
                          Atualizar Nó
                        </button>
                        <button
                          type="button"
                          className="btn-danger"
                          onClick={deleteSelectedNode}
                        >
                          Excluir Nó
                        </button>
                      </>
                    )}

                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={exportMindMap}
                    >
                      <Download size={16} />
                      Exportar
                    </button>

                    <label className="btn-secondary" style={{ cursor: 'pointer' }}>
                      <Upload size={16} />
                      Importar
                      <input
                        type="file"
                        accept=".json"
                        onChange={importMindMap}
                        style={{ display: 'none' }}
                      />
                    </label>
                  </div>
                </div>

                {/* Canvas */}
                <div style={{
                  border: '2px solid #e9ecef',
                  borderRadius: '8px',
                  background: '#fff',
                  height: '400px',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <svg
                    ref={canvasRef}
                    width="100%"
                    height="100%"
                    onClick={handleCanvasClick}
                    style={{ cursor: isDrawing ? 'crosshair' : 'pointer' }}
                  >
                    <defs>
                      <marker
                        id="arrowhead"
                        markerWidth="10"
                        markerHeight="7"
                        refX="9"
                        refY="3.5"
                        orient="auto"
                      >
                        <polygon points="0 0, 10 3.5, 0 7" fill="#666" />
                      </marker>
                    </defs>
                    
                    {connections.map(renderConnection)}
                    {nodes.map(renderNode)}
                  </svg>
                  
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    background: 'rgba(255, 255, 255, 0.9)',
                    padding: '8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    color: '#666'
                  }}>
                    {isDrawing 
                      ? 'Clique em um nó para conectar' 
                      : 'Clique para adicionar nó ou selecionar existente'
                    }
                  </div>
                </div>
              </div>

              <div className="flex" style={{ justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" className="btn-secondary" onClick={resetForm}>
                  Cancelar
                </button>
                <button type="submit" className="btn">
                  {editingMindMap ? 'Atualizar' : 'Criar'} Mapa Mental
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default MindMaps