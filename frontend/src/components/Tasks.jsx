import React, { useState } from 'react'
import { 
  Plus, 
  Edit, 
  Trash2, 
  CheckSquare,
  Clock,
  User,
  Calendar,
  AlertCircle,
  CheckCircle,
  X,
  Filter
} from 'lucide-react'

function Tasks({ tasks, setTasks, projects }) {
  const [showModal, setShowModal] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [filterProject, setFilterProject] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterPriority, setFilterPriority] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    projectId: '',
    status: 'planejamento',
    priority: 'media',
    assignee: '',
    startDate: '',
    endDate: '',
    estimatedHours: '',
    category: 'desenvolvimento',
    dependencies: ''
  })

  const statusOptions = [
    { value: 'planejamento', label: 'Planejamento' },
    { value: 'desenvolvimento', label: 'Desenvolvimento' },
    { value: 'teste', label: 'Teste' },
    { value: 'concluido', label: 'Concluído' }
  ]

  const priorityOptions = [
    { value: 'alta', label: 'Alta' },
    { value: 'media', label: 'Média' },
    { value: 'baixa', label: 'Baixa' }
  ]

  const categoryOptions = [
    { value: 'analise', label: 'Análise de Requisitos' },
    { value: 'design', label: 'Design/UX' },
    { value: 'desenvolvimento', label: 'Desenvolvimento' },
    { value: 'frontend', label: 'Frontend' },
    { value: 'backend', label: 'Backend' },
    { value: 'database', label: 'Banco de Dados' },
    { value: 'teste', label: 'Testes' },
    { value: 'deploy', label: 'Deploy/DevOps' },
    { value: 'documentacao', label: 'Documentação' },
    { value: 'manutencao', label: 'Manutenção' }
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (editingTask) {
      setTasks(tasks.map(t => 
        t.id === editingTask.id 
          ? { ...formData, id: editingTask.id, createdAt: editingTask.createdAt, updatedAt: new Date().toISOString() }
          : t
      ))
    } else {
      const newTask = {
        ...formData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      setTasks([...tasks, newTask])
    }
    
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      projectId: '',
      status: 'planejamento',
      priority: 'media',
      assignee: '',
      startDate: '',
      endDate: '',
      estimatedHours: '',
      category: 'desenvolvimento',
      dependencies: ''
    })
    setEditingTask(null)
    setShowModal(false)
  }

  const handleEdit = (task) => {
    setFormData(task)
    setEditingTask(task)
    setShowModal(true)
  }

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta tarefa?')) {
      setTasks(tasks.filter(t => t.id !== id))
    }
  }

  const toggleTaskStatus = (taskId) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const newStatus = task.status === 'concluido' ? 'desenvolvimento' : 'concluido'
        return { ...task, status: newStatus, updatedAt: new Date().toISOString() }
      }
      return task
    }))
  }

  const getProjectName = (projectId) => {
    const project = projects.find(p => p.id === projectId)
    return project ? project.name : 'Projeto não encontrado'
  }

  const filteredTasks = tasks.filter(task => {
    return (
      (!filterProject || task.projectId === filterProject) &&
      (!filterStatus || task.status === filterStatus) &&
      (!filterPriority || task.priority === filterPriority)
    )
  })

  const getStatusIcon = (status) => {
    switch (status) {
      case 'concluido':
        return <CheckCircle size={16} color="#28a745" />
      case 'desenvolvimento':
        return <Clock size={16} color="#007bff" />
      case 'teste':
        return <AlertCircle size={16} color="#ffc107" />
      default:
        return <Clock size={16} color="#6c757d" />
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'alta': return '#dc3545'
      case 'media': return '#ffc107'
      case 'baixa': return '#28a745'
      default: return '#6c757d'
    }
  }

  return (
    <div>
      <div className="flex-between mb-4">
        <h1 className="text-xl">Gerenciamento de Etapas</h1>
        <button className="btn" onClick={() => setShowModal(true)}>
          <Plus size={18} />
          Nova Tarefa
        </button>
      </div>

      {/* Filters */}
      <div className="card mb-4">
        <h3 className="mb-3 flex">
          <Filter size={18} style={{ marginRight: '8px' }} />
          Filtros
        </h3>
        <div className="grid grid-3">
          <div className="form-group">
            <label>Projeto</label>
            <select
              className="select"
              value={filterProject}
              onChange={(e) => setFilterProject(e.target.value)}
            >
              <option value="">Todos os projetos</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Status</label>
            <select
              className="select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">Todos os status</option>
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Prioridade</label>
            <select
              className="select"
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
            >
              <option value="">Todas as prioridades</option>
              {priorityOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredTasks.map((task) => (
          <div key={task.id} className={`card priority-${task.priority}`}>
            <div className="flex-between mb-3">
              <div className="flex" style={{ alignItems: 'flex-start', gap: '12px' }}>
                <button
                  onClick={() => toggleTaskStatus(task.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {getStatusIcon(task.status)}
                </button>
                <div style={{ flex: 1 }}>
                  <h3 style={{ 
                    fontSize: '18px', 
                    fontWeight: '600',
                    textDecoration: task.status === 'concluido' ? 'line-through' : 'none',
                    opacity: task.status === 'concluido' ? 0.7 : 1
                  }}>
                    {task.title}
                  </h3>
                  <p className="text-muted" style={{ fontSize: '14px', marginTop: '4px' }}>
                    {task.description}
                  </p>
                </div>
              </div>
              <div className="flex">
                <button 
                  className="btn-secondary" 
                  onClick={() => handleEdit(task)}
                  style={{ padding: '6px', marginRight: '8px' }}
                >
                  <Edit size={16} />
                </button>
                <button 
                  className="btn-danger" 
                  onClick={() => handleDelete(task.id)}
                  style={{ padding: '6px' }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="grid grid-2 mb-3">
              <div>
                <div className="flex text-sm mb-2">
                  <strong style={{ marginRight: '8px' }}>Projeto:</strong>
                  <span>{getProjectName(task.projectId)}</span>
                </div>
                <div className="flex text-sm mb-2">
                  <strong style={{ marginRight: '8px' }}>Categoria:</strong>
                  <span>{categoryOptions.find(c => c.value === task.category)?.label}</span>
                </div>
                {task.assignee && (
                  <div className="flex text-sm">
                    <User size={14} style={{ marginRight: '6px', color: '#6c757d' }} />
                    <span className="text-muted">Responsável: {task.assignee}</span>
                  </div>
                )}
              </div>
              <div>
                {task.startDate && (
                  <div className="flex text-sm mb-2">
                    <Calendar size={14} style={{ marginRight: '6px', color: '#6c757d' }} />
                    <span className="text-muted">
                      Início: {new Date(task.startDate).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                )}
                {task.endDate && (
                  <div className="flex text-sm mb-2">
                    <Calendar size={14} style={{ marginRight: '6px', color: '#6c757d' }} />
                    <span className="text-muted">
                      Fim: {new Date(task.endDate).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                )}
                {task.estimatedHours && (
                  <div className="flex text-sm">
                    <Clock size={14} style={{ marginRight: '6px', color: '#6c757d' }} />
                    <span className="text-muted">Estimativa: {task.estimatedHours}h</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex-between">
              <div className="flex" style={{ gap: '8px' }}>
                <span className={`status-badge status-${task.status}`}>
                  {statusOptions.find(s => s.value === task.status)?.label}
                </span>
                <span 
                  className="status-badge"
                  style={{ 
                    background: `${getPriorityColor(task.priority)}20`,
                    color: getPriorityColor(task.priority)
                  }}
                >
                  {task.priority}
                </span>
              </div>
              <span className="text-sm text-muted">
                Criada em {new Date(task.createdAt).toLocaleDateString('pt-BR')}
              </span>
            </div>

            {task.dependencies && (
              <div className="mt-3 p-3" style={{ background: '#f8f9fa', borderRadius: '6px' }}>
                <strong className="text-sm">Dependências:</strong>
                <p className="text-sm text-muted" style={{ marginTop: '4px' }}>
                  {task.dependencies}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <div className="card text-center">
          <CheckSquare size={64} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
          <h3 style={{ marginBottom: '8px' }}>
            {tasks.length === 0 ? 'Nenhuma tarefa encontrada' : 'Nenhuma tarefa corresponde aos filtros'}
          </h3>
          <p className="text-muted mb-4">
            {tasks.length === 0 
              ? 'Comece criando sua primeira tarefa de projeto' 
              : 'Tente ajustar os filtros ou limpar a seleção'
            }
          </p>
          <button className="btn" onClick={() => setShowModal(true)}>
            <Plus size={18} />
            {tasks.length === 0 ? 'Criar Primeira Tarefa' : 'Nova Tarefa'}
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && resetForm()}>
          <div className="modal">
            <div className="flex-between mb-4">
              <h2>{editingTask ? 'Editar Tarefa' : 'Nova Tarefa'}</h2>
              <button className="btn-secondary" onClick={resetForm} style={{ padding: '6px' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Título da Tarefa *</label>
                <input
                  type="text"
                  className="input"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Descrição</label>
                <textarea
                  className="textarea"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows="3"
                />
              </div>

              <div className="grid grid-2">
                <div className="form-group">
                  <label>Projeto *</label>
                  <select
                    className="select"
                    value={formData.projectId}
                    onChange={(e) => setFormData({...formData, projectId: e.target.value})}
                    required
                  >
                    <option value="">Selecione um projeto</option>
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Categoria</label>
                  <select
                    className="select"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    {categoryOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-3">
                <div className="form-group">
                  <label>Status</label>
                  <select
                    className="select"
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Prioridade</label>
                  <select
                    className="select"
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                  >
                    {priorityOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Responsável</label>
                  <input
                    type="text"
                    className="input"
                    value={formData.assignee}
                    onChange={(e) => setFormData({...formData, assignee: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-3">
                <div className="form-group">
                  <label>Data de Início</label>
                  <input
                    type="date"
                    className="input"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label>Data de Fim</label>
                  <input
                    type="date"
                    className="input"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label>Estimativa (horas)</label>
                  <input
                    type="number"
                    className="input"
                    value={formData.estimatedHours}
                    onChange={(e) => setFormData({...formData, estimatedHours: e.target.value})}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Dependências</label>
                <textarea
                  className="textarea"
                  value={formData.dependencies}
                  onChange={(e) => setFormData({...formData, dependencies: e.target.value})}
                  rows="2"
                  placeholder="Descreva as dependências desta tarefa..."
                />
              </div>

              <div className="flex" style={{ justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" className="btn-secondary" onClick={resetForm}>
                  Cancelar
                </button>
                <button type="submit" className="btn">
                  {editingTask ? 'Atualizar' : 'Criar'} Tarefa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Tasks