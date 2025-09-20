// Configuração da API
const API_CONFIG = {
  BASE_URL: 'http://localhost:3001/api',
  ENDPOINTS: {
    PROJECTS: '/projects',
    TASKS: '/tasks',
    MINDMAPS: '/mindmaps'
  }
};

// Classe para gerenciar chamadas da API
class ApiService {
  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
  }

  // Método genérico para fazer requisições
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Métodos para Projetos
  async getProjects() {
    return this.request(API_CONFIG.ENDPOINTS.PROJECTS);
  }

  async getProject(id) {
    return this.request(`${API_CONFIG.ENDPOINTS.PROJECTS}/${id}`);
  }

  async createProject(projectData) {
    return this.request(API_CONFIG.ENDPOINTS.PROJECTS, {
      method: 'POST',
      body: JSON.stringify(projectData)
    });
  }

  async updateProject(id, projectData) {
    return this.request(`${API_CONFIG.ENDPOINTS.PROJECTS}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(projectData)
    });
  }

  async deleteProject(id) {
    return this.request(`${API_CONFIG.ENDPOINTS.PROJECTS}/${id}`, {
      method: 'DELETE'
    });
  }

  async getProjectTasks(projectId) {
    return this.request(`${API_CONFIG.ENDPOINTS.PROJECTS}/${projectId}/tasks`);
  }

  async getProjectMindmaps(projectId) {
    return this.request(`${API_CONFIG.ENDPOINTS.PROJECTS}/${projectId}/mindmaps`);
  }

  // Métodos para Tarefas
  async getTasks(projectId = null) {
    const query = projectId ? `?project_id=${projectId}` : '';
    return this.request(`${API_CONFIG.ENDPOINTS.TASKS}${query}`);
  }

  async getTask(id) {
    return this.request(`${API_CONFIG.ENDPOINTS.TASKS}/${id}`);
  }

  async createTask(taskData) {
    return this.request(API_CONFIG.ENDPOINTS.TASKS, {
      method: 'POST',
      body: JSON.stringify(taskData)
    });
  }

  async updateTask(id, taskData) {
    return this.request(`${API_CONFIG.ENDPOINTS.TASKS}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(taskData)
    });
  }

  async deleteTask(id) {
    return this.request(`${API_CONFIG.ENDPOINTS.TASKS}/${id}`, {
      method: 'DELETE'
    });
  }

  async toggleTask(id) {
    return this.request(`${API_CONFIG.ENDPOINTS.TASKS}/${id}/toggle`, {
      method: 'PATCH'
    });
  }

  // Métodos para Mapas Mentais
  async getMindmaps(projectId = null) {
    const query = projectId ? `?project_id=${projectId}` : '';
    return this.request(`${API_CONFIG.ENDPOINTS.MINDMAPS}${query}`);
  }

  async getMindmap(id) {
    return this.request(`${API_CONFIG.ENDPOINTS.MINDMAPS}/${id}`);
  }

  async createMindmap(mindmapData) {
    return this.request(API_CONFIG.ENDPOINTS.MINDMAPS, {
      method: 'POST',
      body: JSON.stringify(mindmapData)
    });
  }

  async updateMindmap(id, mindmapData) {
    return this.request(`${API_CONFIG.ENDPOINTS.MINDMAPS}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(mindmapData)
    });
  }

  async deleteMindmap(id) {
    return this.request(`${API_CONFIG.ENDPOINTS.MINDMAPS}/${id}`, {
      method: 'DELETE'
    });
  }

  async addMindmapNode(id, node) {
    return this.request(`${API_CONFIG.ENDPOINTS.MINDMAPS}/${id}/nodes`, {
      method: 'POST',
      body: JSON.stringify({ node })
    });
  }

  async removeMindmapNode(id, nodeId) {
    return this.request(`${API_CONFIG.ENDPOINTS.MINDMAPS}/${id}/nodes/${nodeId}`, {
      method: 'DELETE'
    });
  }

  // Método para testar conectividade da API
  async testConnection() {
    try {
      const response = await this.request('/test');
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

// Instância global da API
const apiService = new ApiService();

// Função para verificar se a API está disponível
async function checkApiAvailability() {
  const result = await apiService.testConnection();
  if (result.success) {
    console.log('✅ API conectada com sucesso!', result.data);
    return true;
  } else {
    console.warn('⚠️ API não disponível:', result.error);
    console.warn('Usando localStorage como fallback...');
    return false;
  }
}

// Exportar para uso global
window.apiService = apiService;
window.checkApiAvailability = checkApiAvailability;