import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import { 
  Home, 
  FolderOpen, 
  CheckSquare, 
  Brain, 
  Plus,
  Menu,
  X
} from 'lucide-react'
import Dashboard from './components/Dashboard'
import Projects from './components/Projects'
import Tasks from './components/Tasks'
import MindMaps from './components/MindMaps'

function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()

  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/projects', icon: FolderOpen, label: 'Projetos' },
    { path: '/tasks', icon: CheckSquare, label: 'Etapas' },
    { path: '/mindmaps', icon: Brain, label: 'Mapas Mentais' }
  ]

  return (
    <nav style={{
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      padding: '1rem 2rem',
      boxShadow: '0 2px 20px rgba(0, 0, 0, 0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div className="flex-between">
        <div className="flex">
          <h1 style={{ 
            fontSize: '1.5rem', 
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Gestão de Projetos
          </h1>
        </div>

        {/* Desktop Navigation */}
        <div className="flex" style={{ display: window.innerWidth > 768 ? 'flex' : 'none' }}>
          {navItems.map(({ path, icon: Icon, label }) => (
            <Link
              key={path}
              to={path}
              className="flex"
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                textDecoration: 'none',
                color: location.pathname === path ? '#667eea' : '#6c757d',
                background: location.pathname === path ? 'rgba(102, 126, 234, 0.1)' : 'transparent',
                transition: 'all 0.2s ease'
              }}
            >
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="btn-secondary"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          style={{ display: window.innerWidth <= 768 ? 'flex' : 'none' }}
        >
          {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: 'white',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          padding: '1rem',
          display: window.innerWidth <= 768 ? 'block' : 'none'
        }}>
          {navItems.map(({ path, icon: Icon, label }) => (
            <Link
              key={path}
              to={path}
              className="flex"
              onClick={() => setIsMenuOpen(false)}
              style={{
                padding: '0.75rem',
                borderRadius: '8px',
                textDecoration: 'none',
                color: location.pathname === path ? '#667eea' : '#6c757d',
                background: location.pathname === path ? 'rgba(102, 126, 234, 0.1)' : 'transparent',
                marginBottom: '0.5rem',
                display: 'flex'
              }}
            >
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}

function App() {
  const [projects, setProjects] = useState([])
  const [tasks, setTasks] = useState([])
  const [mindMaps, setMindMaps] = useState([])

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedProjects = localStorage.getItem('projects')
    const savedTasks = localStorage.getItem('tasks')
    const savedMindMaps = localStorage.getItem('mindMaps')

    if (savedProjects) setProjects(JSON.parse(savedProjects))
    if (savedTasks) setTasks(JSON.parse(savedTasks))
    if (savedMindMaps) setMindMaps(JSON.parse(savedMindMaps))
  }, [])

  // Save data to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects))
  }, [projects])

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  useEffect(() => {
    localStorage.setItem('mindMaps', JSON.stringify(mindMaps))
  }, [mindMaps])

  return (
    <Router>
      <div style={{ minHeight: '100vh' }}>
        <Navigation />
        <main className="container">
          <Routes>
            <Route 
              path="/" 
              element={
                <Dashboard 
                  projects={projects} 
                  tasks={tasks} 
                  mindMaps={mindMaps} 
                />
              } 
            />
            <Route 
              path="/projects" 
              element={
                <Projects 
                  projects={projects} 
                  setProjects={setProjects}
                  tasks={tasks}
                />
              } 
            />
            <Route 
              path="/tasks" 
              element={
                <Tasks 
                  tasks={tasks} 
                  setTasks={setTasks}
                  projects={projects}
                />
              } 
            />
            <Route 
              path="/mindmaps" 
              element={
                <MindMaps 
                  mindMaps={mindMaps} 
                  setMindMaps={setMindMaps}
                  projects={projects}
                />
              } 
            />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App