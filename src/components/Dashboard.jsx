import React from 'react'
import { 
  FolderOpen, 
  CheckSquare, 
  Brain, 
  TrendingUp,
  Clock,
  AlertCircle,
  CheckCircle
} from 'lucide-react'

function Dashboard({ projects, tasks, mindMaps }) {
  // Calculate statistics
  const totalProjects = projects.length
  const activeProjects = projects.filter(p => p.status !== 'concluido').length
  const totalTasks = tasks.length
  const completedTasks = tasks.filter(t => t.status === 'concluido').length
  const pendingTasks = tasks.filter(t => t.status !== 'concluido').length
  const totalMindMaps = mindMaps.length

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  // Get recent activities
  const recentProjects = projects.slice(-3).reverse()
  const recentTasks = tasks.slice(-5).reverse()

  const stats = [
    {
      title: 'Projetos Ativos',
      value: activeProjects,
      total: totalProjects,
      icon: FolderOpen,
      color: '#667eea'
    },
    {
      title: 'Tarefas Pendentes',
      value: pendingTasks,
      total: totalTasks,
      icon: Clock,
      color: '#ffc107'
    },
    {
      title: 'Tarefas Concluídas',
      value: completedTasks,
      total: totalTasks,
      icon: CheckCircle,
      color: '#28a745'
    },
    {
      title: 'Mapas Mentais',
      value: totalMindMaps,
      total: totalMindMaps,
      icon: Brain,
      color: '#764ba2'
    }
  ]

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-xl mb-4">Dashboard - Visão Geral</h1>
        
        {/* Statistics Cards */}
        <div className="grid grid-3 mb-4">
          {stats.map((stat, index) => (
            <div key={index} className="card">
              <div className="flex-between mb-4">
                <div>
                  <h3 className="text-sm text-muted">{stat.title}</h3>
                  <div className="flex" style={{ alignItems: 'baseline', gap: '8px' }}>
                    <span className="text-xl" style={{ fontWeight: 'bold', color: stat.color }}>
                      {stat.value}
                    </span>
                    {stat.total !== stat.value && (
                      <span className="text-sm text-muted">/ {stat.total}</span>
                    )}
                  </div>
                </div>
                <div style={{
                  padding: '12px',
                  borderRadius: '12px',
                  background: `${stat.color}20`
                }}>
                  <stat.icon size={24} color={stat.color} />
                </div>
              </div>
              
              {stat.total > 0 && stat.total !== stat.value && (
                <div style={{
                  width: '100%',
                  height: '6px',
                  background: '#e9ecef',
                  borderRadius: '3px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${(stat.value / stat.total) * 100}%`,
                    height: '100%',
                    background: stat.color,
                    transition: 'width 0.3s ease'
                  }} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Progress Overview */}
        <div className="card mb-4">
          <h3 className="mb-4 flex">
            <TrendingUp size={20} style={{ marginRight: '8px' }} />
            Progresso Geral
          </h3>
          <div className="grid grid-2">
            <div>
              <div className="flex-between mb-2">
                <span>Taxa de Conclusão</span>
                <span style={{ fontWeight: 'bold' }}>{completionRate}%</span>
              </div>
              <div style={{
                width: '100%',
                height: '12px',
                background: '#e9ecef',
                borderRadius: '6px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${completionRate}%`,
                  height: '100%',
                  background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                  transition: 'width 0.3s ease'
                }} />
              </div>
            </div>
            <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="text-center">
                <div className="text-lg" style={{ fontWeight: 'bold', color: '#28a745' }}>
                  {completedTasks}
                </div>
                <div className="text-sm text-muted">Concluídas</div>
              </div>
              <div className="text-center">
                <div className="text-lg" style={{ fontWeight: 'bold', color: '#ffc107' }}>
                  {pendingTasks}
                </div>
                <div className="text-sm text-muted">Pendentes</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-2">
          {/* Recent Projects */}
          <div className="card">
            <h3 className="mb-4 flex">
              <FolderOpen size={20} style={{ marginRight: '8px' }} />
              Projetos Recentes
            </h3>
            {recentProjects.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {recentProjects.map((project) => (
                  <div key={project.id} className="flex-between" style={{
                    padding: '12px',
                    background: '#f8f9fa',
                    borderRadius: '8px',
                    borderLeft: '4px solid #667eea'
                  }}>
                    <div>
                      <div style={{ fontWeight: '600' }}>{project.name}</div>
                      <div className="text-sm text-muted">{project.description}</div>
                    </div>
                    <span className={`status-badge status-${project.status}`}>
                      {project.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted p-4">
                <FolderOpen size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
                <p>Nenhum projeto criado ainda</p>
              </div>
            )}
          </div>

          {/* Recent Tasks */}
          <div className="card">
            <h3 className="mb-4 flex">
              <CheckSquare size={20} style={{ marginRight: '8px' }} />
              Tarefas Recentes
            </h3>
            {recentTasks.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {recentTasks.map((task) => (
                  <div key={task.id} className="flex-between" style={{
                    padding: '8px 12px',
                    background: '#f8f9fa',
                    borderRadius: '6px'
                  }}>
                    <div className="flex">
                      {task.status === 'concluido' ? (
                        <CheckCircle size={16} color="#28a745" style={{ marginRight: '8px', marginTop: '2px' }} />
                      ) : (
                        <Clock size={16} color="#ffc107" style={{ marginRight: '8px', marginTop: '2px' }} />
                      )}
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: '500' }}>{task.title}</div>
                        <div className="text-sm text-muted">
                          Prioridade: {task.priority}
                        </div>
                      </div>
                    </div>
                    <span className={`status-badge status-${task.status}`}>
                      {task.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted p-4">
                <CheckSquare size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
                <p>Nenhuma tarefa criada ainda</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard