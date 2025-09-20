import React, { useState } from 'react'
import { 
  Plus, 
  Edit, 
  Trash2, 
  FolderOpen,
  Calendar,
  User,
  Target,
  X
} from 'lucide-react'

function Projects({ projects, setProjects, tasks }) {
  const [showModal, setShowModal] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'planejamento',
    priority: 'media',
    startDate: '',
    endDate: '',
    manager: '',
    budget: '',
    objectives: ''
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

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (editingProject) {
      setProjects(projects.map(p => 
        p.id === editingProject.id 
          ? { ...formData, id: editingProject.id, createdAt: editingProject.createdAt, updatedAt: new Date().toISOString() }
          : p
      ))
    } else {
      const newProject = {
        ...formData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      setProjects([...projects, newProject])
    }
    
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      status: 'planejamento',
      priority: 'media',
      startDate: '',
      endDate: '',
      manager: '',
      budget: '',
      objectives: ''
    })
    setEditingProject(null)
    setShowModal(false)
  }

  const handleEdit = (project) => {
    setFormData(project)
    setEditingProject(project)
    setShowModal(true)
  }

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este projeto?')) {
      setProjects(projects.filter(p => p.id !== id))
    }
  }

  const getProjectTasks = (projectId) => {
    return tasks.filter(task => task.projectId === projectId)
  }

  const getProjectProgress = (projectId) => {
    const projectTasks = getProjectTasks(projectId)
    if (projectTasks.length === 0) return 0
    const completedTasks = projectTasks.filter(task => task.status === 'concluido').length
    return Math.round((completedTasks / projectTasks.length) * 100)
  }

  return (
    <div>
      <div className="flex-between mb-4">
        <h1 className="text-xl">Gerenciamento de Projetos</h1>
        <button className="btn" onClick={() => setShowModal(true)}>
          <Plus size={18} />
          Novo Projeto
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-2">
        {projects.map((project) => {
          const projectTasks = getProjectTasks(project.id)
          const progress = getProjectProgress(project.id)
          
          return (
            <div key={project.id} className={`card priority-${project.priority}`}>
              <div className="flex-between mb-3">
                <h3 style={{ fontSize: '18px', fontWeight: '600' }}>{project.name}</h3>
                <div className="flex">
                  <button 
                    className="btn-secondary" 
                    onClick={() => handleEdit(project)}
                    style={{ padding: '6px', marginRight: '8px' }}
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    className="btn-danger" 
                    onClick={() => handleDelete(project.id)}
                    style={{ padding: '6px' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <p className="text-muted mb-3" style={{ fontSize: '14px' }}>
                {project.description}
              </p>

              <div className="mb-3">
                <span className={`status-badge status-${project.status}`}>
                  {statusOptions.find(s => s.value === project.status)?.label}
                </span>
              </div>

              {/* Project Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                {project.manager && (
                  <div className="flex text-sm">
                    <User size={14} style={{ marginRight: '6px', color: '#6c757d' }} />
                    <span className="text-muted">Gerente: {project.manager}</span>
                  </div>
                )}
                
                {project.startDate && (
                  <div className="flex text-sm">
                    <Calendar size={14} style={{ marginRight: '6px', color: '#6c757d' }} />
                    <span className="text-muted">
                      Início: {new Date(project.startDate).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                )}
                
                {project.endDate && (
                  <div className="flex text-sm">
                    <Calendar size={14} style={{ marginRight: '6px', color: '#6c757d' }} />
                    <span className="text-muted">
                      Fim: {new Date(project.endDate).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                )}

                {project.budget && (
                  <div className="flex text-sm">
                    <Target size={14} style={{ marginRight: '6px', color: '#6c757d' }} />
                    <span className="text-muted">Orçamento: R$ {project.budget}</span>
                  </div>
                )}
              </div>

              {/* Progress */}
              <div className="mb-3">
                <div className="flex-between mb-2">
                  <span className="text-sm">Progresso das Tarefas</span>
                  <span className="text-sm" style={{ fontWeight: '600' }}>{progress}%</span>
                </div>
                <div style={{
                  width: '100%',
                  height: '8px',
                  background: '#e9ecef',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${progress}%`,
                    height: '100%',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    transition: 'width 0.3s ease'
                  }} />
                </div>
              </div>

              <div className="flex-between text-sm text-muted">
                <span>{projectTasks.length} tarefa(s)</span>
                <span>Prioridade: {project.priority}</span>
              </div>
            </div>
          )
        })}
      </div>

      {projects.length === 0 && (
        <div className="card text-center">
          <FolderOpen size={64} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
          <h3 style={{ marginBottom: '8px' }}>Nenhum projeto encontrado</h3>
          <p className="text-muted mb-4">Comece criando seu primeiro projeto de TI</p>
          <button className="btn" onClick={() => setShowModal(true)}>
            <Plus size={18} />
            Criar Primeiro Projeto
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && resetForm()}>
          <div className="modal">
            <div className="flex-between mb-4">
              <h2>{editingProject ? 'Editar Projeto' : 'Novo Projeto'}</h2>
              <button className="btn-secondary" onClick={resetForm} style={{ padding: '6px' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-2">
                <div className="form-group">
                  <label>Nome do Projeto *</label>
                  <input
                    type="text"
                    className="input"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Gerente do Projeto</label>
                  <input
                    type="text"
                    className="input"
                    value={formData.manager}
                    onChange={(e) => setFormData({...formData, manager: e.target.value})}
                  />
                </div>
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

              <div className="form-group">
                <label>Objetivos</label>
                <textarea
                  className="textarea"
                  value={formData.objectives}
                  onChange={(e) => setFormData({...formData, objectives: e.target.value})}
                  rows="3"
                  placeholder="Descreva os objetivos e metas do projeto..."
                />
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
                  <label>Orçamento (R$)</label>
                  <input
                    type="number"
                    className="input"
                    value={formData.budget}
                    onChange={(e) => setFormData({...formData, budget: e.target.value})}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="grid grid-2">
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
              </div>

              <div className="flex" style={{ justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" className="btn-secondary" onClick={resetForm}>
                  Cancelar
                </button>
                <button type="submit" className="btn">
                  {editingProject ? 'Atualizar' : 'Criar'} Projeto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Projects