import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  playerService,
  paymentService,
  expenseService,
  teacherMaterialService,
} from '../services/api'

export const useAdminStore = defineStore('admin', () => {
  // State EXISTENTE
  const players = ref([])
  const payments = ref([])
  const expenses = ref([])
  const categories = ref([])
  const loading = ref(false)
  const error = ref(null)

  // State para pagos vencidos EXISTENTE
  const overduePlayers = ref([])
  const overdueSummary = ref({})
  const loadingOverdue = ref(false)

  // State para teacher materials EXISTENTE
  const teacherMaterials = ref([])
  const materialsStats = ref({})
  const loadingMaterials = ref(false)

  // Getters EXISTENTES
  const totalPagosMes = computed(() => {
    return payments.value.reduce((total, payment) => total + parseFloat(payment.amount || 0), 0)
  })

  const totalGastosMes = computed(() => {
    return expenses.value.reduce((total, expense) => total + parseFloat(expense.amount || 0), 0)
  })

  const balanceMensual = computed(() => {
    return totalPagosMes.value - totalGastosMes.value
  })

  const totalJugadoresVencidos = computed(() => {
    return overduePlayers.value.length
  })

  const tasaMorosidad = computed(() => {
    const totalActivos = players.value.filter((p) => p.status === 'active').length
    return totalActivos > 0 ? (overduePlayers.value.length / totalActivos) * 100 : 0
  })

  const totalPendientesMateriales = computed(() => {
    return teacherMaterials.value.filter((m) => m.status === 'pendiente').length
  })

  const materialesEntregados = computed(() => {
    return teacherMaterials.value.filter((m) => m.status === 'entregado').length
  })

  const materialesDevueltos = computed(() => {
    return teacherMaterials.value.filter((m) => m.status === 'devuelto').length
  })

  const materialesPerdidos = computed(() => {
    return teacherMaterials.value.filter((m) => m.status === 'perdido').length
  })

  const materialesAgrupados = computed(() => {
    const agrupados = {}
    teacherMaterials.value.forEach((material) => {
      if (!agrupados[material.teacherName]) {
        agrupados[material.teacherName] = {
          teacherName: material.teacherName,
          count: 0,
          entregados: 0,
          devueltos: 0,
          pendientes: 0,
          perdidos: 0,
        }
      }
      agrupados[material.teacherName].count++
      switch (material.status) {
        case 'entregado':
          agrupados[material.teacherName].entregados++
          break
        case 'devuelto':
          agrupados[material.teacherName].devueltos++
          break
        case 'pendiente':
          agrupados[material.teacherName].pendientes++
          break
        case 'perdido':
          agrupados[material.teacherName].perdidos++
          break
      }
    })
    return Object.values(agrupados)
  })

  // Actions - Jugadores
  const fetchPlayers = async () => {
    try {
      loading.value = true
      const response = await playerService.getAllPlayers()
      players.value = response.data
      error.value = null
    } catch (err) {
      error.value = err.response?.data?.error || 'Error al cargar jugadores'
      console.error('Error fetching players:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await playerService.getCategories()
      categories.value = response.data
    } catch (err) {
      console.error('Error fetching categories:', err)
      const uniqueCategories = [...new Set(players.value.map((player) => player.category))]
      categories.value = uniqueCategories.sort((a, b) => a - b)
    }
  }

  // Actions - Pagos
  const fetchPayments = async (filters = {}) => {
    try {
      loading.value = true
      const response = await paymentService.getAllPayments(filters)
      payments.value = response.data
      error.value = null
    } catch (err) {
      error.value = err.response?.data?.error || 'Error al cargar pagos'
      console.error('Error fetching payments:', err)
    } finally {
      loading.value = false
    }
  }

  const createPayment = async (paymentData) => {
    try {
      loading.value = true
      const response = await paymentService.createPayment(paymentData)
      await fetchPayments()
      error.value = null
      return response.data
    } catch (err) {
      error.value = err.response?.data?.error || 'Error al crear pago'
      console.error('Error creating payment:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updatePayment = async (id, paymentData) => {
    try {
      loading.value = true
      const response = await paymentService.updatePayment(id, paymentData)
      await fetchPayments()
      error.value = null
      return response.data
    } catch (err) {
      error.value = err.response?.data?.error || 'Error al actualizar pago'
      console.error('Error updating payment:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deletePayment = async (id) => {
    try {
      loading.value = true
      await paymentService.deletePayment(id)
      await fetchPayments()
      error.value = null
    } catch (err) {
      error.value = err.response?.data?.error || 'Error al eliminar pago'
      console.error('Error deleting payment:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Actions - Gastos
  const fetchExpenses = async (filters = {}) => {
    try {
      loading.value = true
      const response = await expenseService.getAllExpenses(filters)
      expenses.value = response.data
      error.value = null
    } catch (err) {
      error.value = err.response?.data?.error || 'Error al cargar gastos'
      console.error('Error fetching expenses:', err)
    } finally {
      loading.value = false
    }
  }

  const createExpense = async (expenseData) => {
    try {
      loading.value = true
      const response = await expenseService.createExpense(expenseData)
      await fetchExpenses()
      error.value = null
      return response.data
    } catch (err) {
      error.value = err.response?.data?.error || 'Error al crear gasto'
      console.error('Error creating expense:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateExpense = async (id, expenseData) => {
    try {
      loading.value = true
      const response = await expenseService.updateExpense(id, expenseData)
      await fetchExpenses()
      error.value = null
      return response.data
    } catch (err) {
      error.value = err.response?.data?.error || 'Error al actualizar gasto'
      console.error('Error updating expense:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteExpense = async (id) => {
    try {
      loading.value = true
      await expenseService.deleteExpense(id)
      await fetchExpenses()
      error.value = null
    } catch (err) {
      error.value = err.response?.data?.error || 'Error al eliminar gasto'
      console.error('Error deleting expense:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Actions - Reportes
  const fetchPaymentSummary = async (filters = {}) => {
    try {
      const response = await paymentService.getPaymentSummary(filters)
      return response.data
    } catch (err) {
      console.error('Error fetching payment summary:', err)
      throw err
    }
  }

  const fetchExpenseSummary = async (filters = {}) => {
    try {
      const response = await expenseService.getExpenseSummary(filters)
      return response.data
    } catch (err) {
      console.error('Error fetching expense summary:', err)
      throw err
    }
  }

  const fetchFinancialReport = async (filters = {}) => {
    try {
      const response = await expenseService.getFinancialReport(filters)
      return response.data
    } catch (err) {
      console.error('Error fetching financial report:', err)
      throw err
    }
  }

  const fetchComparativeReport = async (filters = {}) => {
    try {
      const response = await expenseService.getComparativeReport(filters)
      return response.data
    } catch (err) {
      console.error('Error fetching comparative report:', err)
      throw err
    }
  }

  // Actions - Pagos Vencidos
  const fetchOverduePayments = async (filters = {}) => {
    try {
      loadingOverdue.value = true
      const response = await paymentService.getOverduePlayers(filters)
      overduePlayers.value = response.data.overdue_players || []
      overdueSummary.value = response.data.summary || {}
      error.value = null
      return response.data
    } catch (err) {
      error.value = err.response?.data?.error || 'Error al cargar pagos vencidos'
      console.error('Error fetching overdue payments:', err)
      throw err
    } finally {
      loadingOverdue.value = false
    }
  }

  const fetchOverdueSummary = async () => {
    try {
      loadingOverdue.value = true
      const response = await paymentService.getOverdueSummary()
      overdueSummary.value = response.data
      error.value = null
      return response.data
    } catch (err) {
      error.value = err.response?.data?.error || 'Error al cargar resumen de morosidad'
      console.error('Error fetching overdue summary:', err)
      throw err
    } finally {
      loadingOverdue.value = false
    }
  }

  // ENVÍO DE RECORDATORIOS - FUNCIONES ACTUALIZADAS
  const sendPaymentReminder = async (playerId) => {
    try {
      loading.value = true
      error.value = null

      console.log(`📧 Enviando recordatorio a jugador ID: ${playerId}`)
      const response = await paymentService.sendReminder(playerId)

      console.log('✅ Recordatorio enviado:', response.data)
      return response.data
    } catch (err) {
      // Manejo mejorado de errores
      const errorMessage =
        err.response?.data?.error || err.response?.data?.message || 'Error al enviar recordatorio'
      error.value = errorMessage
      console.error('❌ Error enviando recordatorio:', err.response?.data || err.message)
      throw new Error(errorMessage)
    } finally {
      loading.value = false
    }
  }

  const sendBulkPaymentReminders = async (playerIds) => {
    try {
      loading.value = true
      error.value = null

      console.log(`📧 Enviando recordatorios masivos a ${playerIds.length} jugadores:`, playerIds)
      const response = await paymentService.sendBulkReminders(playerIds)

      console.log('✅ Recordatorios masivos enviados:', response.data)
      return response.data
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Error al enviar recordatorios masivos'
      error.value = errorMessage
      console.error('❌ Error enviando recordatorios masivos:', err.response?.data || err.message)
      throw new Error(errorMessage)
    } finally {
      loading.value = false
    }
  }

  // Historial de recordatorios (opcional)
  const fetchReminderHistory = async (params = {}) => {
    try {
      loading.value = true
      const response = await paymentService.getReminderHistory(params)
      error.value = null
      return response.data
    } catch (err) {
      error.value = err.response?.data?.error || 'Error al cargar historial de recordatorios'
      console.error('Error fetching reminder history:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Actions - Teacher Materials
  const fetchTeacherMaterials = async (filters = {}) => {
    try {
      loadingMaterials.value = true
      const response = await teacherMaterialService.getAllTeacherMaterials(filters)
      teacherMaterials.value = response.data
      error.value = null
      return response.data
    } catch (err) {
      error.value = err.response?.data?.error || 'Error al cargar materiales'
      console.error('Error fetching teacher materials:', err)
      throw err
    } finally {
      loadingMaterials.value = false
    }
  }

  const fetchMaterialStats = async () => {
    try {
      loadingMaterials.value = true
      const response = await teacherMaterialService.getMaterialStats()
      materialsStats.value = response.data
      error.value = null
      return response.data
    } catch (err) {
      error.value = err.response?.data?.error || 'Error al cargar estadísticas de materiales'
      console.error('Error fetching material stats:', err)
      throw err
    } finally {
      loadingMaterials.value = false
    }
  }

  const searchTeacherMaterials = async (name) => {
    try {
      loadingMaterials.value = true
      const response = await teacherMaterialService.searchTeacherMaterials(name)
      error.value = null
      return response.data
    } catch (err) {
      error.value = err.response?.data?.error || 'Error al buscar materiales'
      console.error('Error searching teacher materials:', err)
      throw err
    } finally {
      loadingMaterials.value = false
    }
  }

  const getMaterialsByDateRange = async (startDate, endDate, teacherName = '') => {
    try {
      loadingMaterials.value = true
      const response = await teacherMaterialService.getMaterialsByDateRange(
        startDate,
        endDate,
        teacherName,
      )
      error.value = null
      return response.data
    } catch (err) {
      error.value = err.response?.data?.error || 'Error al obtener materiales por fecha'
      console.error('Error getting materials by date range:', err)
      throw err
    } finally {
      loadingMaterials.value = false
    }
  }

  const getTeacherMaterialById = async (id) => {
    try {
      loadingMaterials.value = true
      const response = await teacherMaterialService.getTeacherMaterialById(id)
      error.value = null
      return response.data
    } catch (err) {
      error.value = err.response?.data?.error || 'Error al obtener material'
      console.error('Error getting teacher material by id:', err)
      throw err
    } finally {
      loadingMaterials.value = false
    }
  }

  const createTeacherMaterial = async (materialData) => {
    try {
      loadingMaterials.value = true
      const response = await teacherMaterialService.createTeacherMaterial(materialData)
      await fetchTeacherMaterials()
      error.value = null
      return response.data
    } catch (err) {
      error.value = err.response?.data?.error || 'Error al crear material'
      console.error('Error creating teacher material:', err)
      throw err
    } finally {
      loadingMaterials.value = false
    }
  }

  const updateTeacherMaterial = async (id, materialData) => {
    try {
      loadingMaterials.value = true
      const response = await teacherMaterialService.updateTeacherMaterial(id, materialData)
      await fetchTeacherMaterials()
      error.value = null
      return response.data
    } catch (err) {
      error.value = err.response?.data?.error || 'Error al actualizar material'
      console.error('Error updating teacher material:', err)
      throw err
    } finally {
      loadingMaterials.value = false
    }
  }

  const deleteTeacherMaterial = async (id) => {
    try {
      loadingMaterials.value = true
      await teacherMaterialService.deleteTeacherMaterial(id)
      await fetchTeacherMaterials()
      error.value = null
    } catch (err) {
      error.value = err.response?.data?.error || 'Error al eliminar material'
      console.error('Error deleting teacher material:', err)
      throw err
    } finally {
      loadingMaterials.value = false
    }
  }

  // Inicializar datos
  const initializeData = async () => {
    try {
      loading.value = true
      await Promise.all([fetchPlayers(), fetchCategories(), fetchPayments(), fetchExpenses()])
    } catch (err) {
      error.value = err.response?.data?.error || 'Error al inicializar datos'
      console.error('Error initializing data:', err)
    } finally {
      loading.value = false
    }
  }

  const clearError = () => {
    error.value = null
  }

  return {
    // State
    players,
    payments,
    expenses,
    categories,
    loading,
    error,
    overduePlayers,
    overdueSummary,
    loadingOverdue,
    teacherMaterials,
    materialsStats,
    loadingMaterials,

    // Getters
    totalPagosMes,
    totalGastosMes,
    balanceMensual,
    totalJugadoresVencidos,
    tasaMorosidad,
    totalPendientesMateriales,
    materialesEntregados,
    materialesDevueltos,
    materialesPerdidos,
    materialesAgrupados,

    // Actions - Jugadores
    fetchPlayers,
    fetchCategories,

    // Actions - Pagos
    fetchPayments,
    createPayment,
    updatePayment,
    deletePayment,

    // Actions - Gastos
    fetchExpenses,
    createExpense,
    updateExpense,
    deleteExpense,

    // Actions - Reportes
    fetchPaymentSummary,
    fetchExpenseSummary,
    fetchFinancialReport,
    fetchComparativeReport,

    // Actions - Pagos Vencidos
    fetchOverduePayments,
    fetchOverdueSummary,
    sendPaymentReminder,
    sendBulkPaymentReminders,
    fetchReminderHistory, // Nueva función opcional

    // Actions - Teacher Materials
    fetchTeacherMaterials,
    fetchMaterialStats,
    searchTeacherMaterials,
    getMaterialsByDateRange,
    getTeacherMaterialById,
    createTeacherMaterial,
    updateTeacherMaterial,
    deleteTeacherMaterial,

    // Utilidades
    initializeData,
    clearError,
  }
})
