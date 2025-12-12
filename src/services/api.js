import axios from 'axios'

const API_BASE_URL = 'http://localhost:3000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para manejar errores globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error)
    return Promise.reject(error)
  },
)

// Interceptor para debug (opcional, quitar en producción)
api.interceptors.request.use(
  (config) => {
    console.log(`📤 ${config.method.toUpperCase()} ${config.baseURL}${config.url}`)
    if (config.data) {
      console.log('📦 Body:', config.data)
    }
    if (config.params) {
      console.log('🔍 Params:', config.params)
    }
    return config
  },
  (error) => {
    console.error('❌ Request error:', error)
    return Promise.reject(error)
  },
)

export const playerService = {
  // Jugadores
  getAllPlayers: () => api.get('/players'),
  getPlayer: (id) => api.get(`/players/${id}`),
  createPlayer: (data) => api.post('/players', data),
  updatePlayer: (id, data) => api.put(`/players/${id}`, data),
  deletePlayer: (id) => api.delete(`/players/${id}`),

  // Categorías
  getCategories: () => api.get('/categories'),

  // Jugadores por categoría
  getPlayersByCategory: (category) => api.get(`/players/category/${category}`),

  // Todos los jugadores filtrados
  getAllPlayersFiltered: () => api.get('/players-filtered/all'),
}

export const paymentService = {
  // Pagos básicos
  getAllPayments: (filters = {}) => api.get('/payments', { params: filters }),
  getPayment: (id) => api.get(`/payments/${id}`),
  createPayment: (data) => api.post('/payments', data),
  updatePayment: (id, data) => api.put(`/payments/${id}`, data),
  deletePayment: (id) => api.delete(`/payments/${id}`),
  getPaymentSummary: (filters = {}) => api.get('/payments/summary', { params: filters }),

  // Pagos vencidos (consultas)
  getOverduePlayers: (filters = {}) => api.get('/overdue-players', { params: filters }),
  getOverduePlayersAdvanced: (filters = {}) =>
    api.get('/overdue-players-advanced', { params: filters }),
  getOverdueSummary: () => api.get('/overdue-summary'),
  getOverdueHistory: (filters = {}) => api.get('/overdue-history', { params: filters }),

  // ✅ CORREGIDO: Recordatorios
  sendReminder: (playerId) => api.post('/send-reminder', { player_id: playerId }),
  sendBulkReminders: (playerIds) => api.post('/send-bulk-reminders', { player_ids: playerIds }),
}

export const expenseService = {
  // Gastos básicos
  getAllExpenses: (filters = {}) => api.get('/expenses', { params: filters }),
  getExpense: (id) => api.get(`/expenses/${id}`),
  createExpense: (data) => api.post('/expenses', data),
  updateExpense: (id, data) => api.put(`/expenses/${id}`, data),
  deleteExpense: (id) => api.delete(`/expenses/${id}`),
  getExpenseSummary: (filters = {}) => api.get('/expenses/summary', { params: filters }),

  // Reportes financieros
  getFinancialReport: (filters = {}) => api.get('/expenses/report', { params: filters }),
  getComparativeReport: (filters = {}) => api.get('/expenses/comparative', { params: filters }),
}

// Service para Teacher Materials
export const teacherMaterialService = {
  // Obtener todos los materiales con filtros
  getAllTeacherMaterials: (filters = {}) => {
    return api.get('/teacher-materials', { params: filters })
  },

  // Obtener estadísticas de materiales
  getMaterialStats: () => {
    return api.get('/teacher-materials/stats')
  },

  // Buscar materiales por nombre de profesor
  searchTeacherMaterials: (name) => {
    return api.get('/teacher-materials/search', { params: { name } })
  },

  // Obtener un material por ID
  getTeacherMaterialById: (id) => {
    return api.get(`/teacher-materials/${id}`)
  },

  // Crear un nuevo material
  createTeacherMaterial: (materialData) => {
    return api.post('/teacher-materials', materialData)
  },

  // Actualizar un material
  updateTeacherMaterial: (id, materialData) => {
    return api.put(`/teacher-materials/${id}`, materialData)
  },

  // Eliminar un material
  deleteTeacherMaterial: (id) => {
    return api.delete(`/teacher-materials/${id}`)
  },
}

// Servicio para usuarios (autenticación)
export const userService = {
  registerUser: (data) => api.post('/register', data),
  loginUser: (data) => api.post('/login', data),
}

export default api
