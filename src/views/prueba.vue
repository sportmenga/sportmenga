<template>
  <v-container fluid class="py-8 gestion-container">
    <v-card class="mx-auto pa-6" max-width="1400">
      <v-card-title class="text-h4 font-weight-bold text-center mb-6">
        🏆 Gestión de Jugadores por Categoría
      </v-card-title>

      <!-- Selector de Categoría -->
      <v-row class="mb-6">
        <v-col cols="12" md="6">
          <v-select
            label="Seleccionar Categoría"
            :items="categorias"
            v-model="categoriaSeleccionada"
            @update:model-value="cargarJugadoresPorCategoria"
            clearable
            prepend-icon="mdi-filter"
          >
            <template v-slot:item="{ props, item }">
              <v-list-item
                v-bind="props"
                :title="`${item.value} (${item.raw.count} jugadores)`"
              ></v-list-item>
            </template>
          </v-select>
        </v-col>

        <v-col cols="12" md="6" class="d-flex align-center">
          <v-btn color="primary" @click="cargarTodasCategorias" prepend-icon="mdi-refresh">
            Actualizar
          </v-btn>

          <v-chip class="ml-4" color="info"> Total: {{ jugadores.length }} jugadores </v-chip>
        </v-col>
      </v-row>

      <!-- Estadísticas Rápidas -->
      <v-alert v-if="categoriaSeleccionada" type="info" class="mb-4">
        <template v-slot:title> 📊 Categoría: {{ categoriaSeleccionada }} </template>
        Mostrando {{ jugadores.length }} jugadores en esta categoría
      </v-alert>

      <!-- Grid de Cartas de Jugadores -->
      <div v-if="jugadores.length > 0" class="jugadores-grid">
        <v-card
          v-for="jugador in jugadores"
          :key="jugador.id"
          class="jugador-card"
          elevation="4"
          @click="verDetalles(jugador)"
        >
          <v-card-text class="pa-4">
            <!-- Header de la carta -->
            <div class="d-flex align-center mb-3">
              <v-avatar size="60" color="grey-lighten-2" class="mr-3">
                <v-img v-if="jugador.photo" :src="jugador.photo"></v-img>
                <v-icon v-else size="30">mdi-account</v-icon>
              </v-avatar>
              <div>
                <h3 class="text-h6 font-weight-bold">{{ jugador.name }} {{ jugador.lastName }}</h3>
                <v-chip :color="getColorGenero(jugador.gender)" size="small" class="mt-1">
                  {{ formatGenero(jugador.gender) }}
                </v-chip>
              </div>
            </div>

            <!-- Información del jugador -->
            <v-divider class="my-3"></v-divider>

            <div class="info-grid">
              <div class="info-item">
                <v-icon small color="primary" class="mr-1">mdi-identifier</v-icon>
                <span class="text-caption">Documento:</span>
                <strong class="text-body-2">{{ jugador.documentnumber }}</strong>
              </div>

              <div class="info-item">
                <v-icon small color="primary" class="mr-1">mdi-cake</v-icon>
                <span class="text-caption">Edad:</span>
                <strong class="text-body-2">{{ jugador.age }} años</strong>
              </div>

              <div class="info-item">
                <v-icon small color="primary" class="mr-1">mdi-account-group</v-icon>
                <span class="text-caption">Categoría:</span>
                <strong class="text-body-2">{{ jugador.category }}</strong>
              </div>

              <div class="info-item">
                <v-icon small color="primary" class="mr-1">mdi-heart</v-icon>
                <span class="text-caption">EPS:</span>
                <strong class="text-body-2">{{ jugador.eps || 'No especificada' }}</strong>
              </div>
            </div>

            <!-- Información del tutor -->
            <v-divider class="my-3"></v-divider>

            <div class="tutor-info">
              <div class="d-flex align-center mb-2">
                <v-icon small color="secondary" class="mr-2">mdi-account-tie</v-icon>
                <span class="text-caption font-weight-bold">Tutor:</span>
              </div>
              <div class="text-body-2">{{ jugador.guardianName }}</div>
              <div class="text-caption text-medium-emphasis">
                <v-icon x-small class="mr-1">mdi-phone</v-icon>
                {{ jugador.guardianPhone }}
              </div>
              <div v-if="jugador.guardianEmail" class="text-caption text-medium-emphasis">
                <v-icon x-small class="mr-1">mdi-email</v-icon>
                {{ jugador.guardianEmail }}
              </div>
            </div>
          </v-card-text>

          <!-- Acciones -->
          <v-card-actions class="pa-4 pt-0">
            <v-spacer></v-spacer>
            <v-btn
              icon
              size="small"
              color="primary"
              @click.stop="verDetalles(jugador)"
              variant="text"
            >
              <v-icon>mdi-eye</v-icon>
              <v-tooltip activator="parent" location="top">Ver detalles</v-tooltip>
            </v-btn>
            <v-btn
              icon
              size="small"
              color="warning"
              @click.stop="editarJugador(jugador)"
              variant="text"
            >
              <v-icon>mdi-pencil</v-icon>
              <v-tooltip activator="parent" location="top">Editar</v-tooltip>
            </v-btn>
          </v-card-actions>
        </v-card>
      </div>

      <!-- Estado vacío -->
      <v-card v-else-if="!cargando" class="text-center pa-8">
        <v-icon size="64" color="grey">mdi-account-group</v-icon>
        <v-card-title class="text-h6">No hay jugadores para mostrar</v-card-title>
        <v-card-text>
          {{
            categoriaSeleccionada
              ? `No se encontraron jugadores en la categoría ${categoriaSeleccionada}`
              : 'Selecciona una categoría para ver los jugadores'
          }}
        </v-card-text>
      </v-card>

      <!-- Loading -->
      <v-card v-else class="text-center pa-8">
        <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
        <v-card-title class="text-h6">Cargando jugadores...</v-card-title>
      </v-card>

      <!-- Dialog de Detalles -->
      <v-dialog v-model="dialogDetalles" max-width="600">
        <v-card v-if="jugadorSeleccionado">
          <v-card-title class="text-h5"> 👤 Detalles del Jugador </v-card-title>

          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field label="Nombre" :model-value="jugadorSeleccionado.name" readonly />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  label="Apellido"
                  :model-value="jugadorSeleccionado.lastName"
                  readonly
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field label="Edad" :model-value="jugadorSeleccionado.age" readonly />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  label="Categoría"
                  :model-value="jugadorSeleccionado.category"
                  readonly
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  label="Documento"
                  :model-value="jugadorSeleccionado.documentnumber"
                  readonly
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field label="EPS" :model-value="jugadorSeleccionado.eps" readonly />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="Tutor"
                  :model-value="jugadorSeleccionado.guardianName"
                  readonly
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  label="Teléfono Tutor"
                  :model-value="jugadorSeleccionado.guardianPhone"
                  readonly
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  label="Email Tutor"
                  :model-value="jugadorSeleccionado.guardianEmail"
                  readonly
                />
              </v-col>
            </v-row>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="dialogDetalles = false">Cerrar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { toast } from '@/main'

const categorias = ref([])
const categoriaSeleccionada = ref('')
const jugadores = ref([])
const cargando = ref(false)
const dialogDetalles = ref(false)
const jugadorSeleccionado = ref(null)

// Cargar categorías al iniciar
onMounted(() => {
  cargarTodasCategorias()
})

const cargarTodasCategorias = async () => {
  try {
    cargando.value = true
    const response = await axios.get('http://localhost:3000/api/categories')
    categorias.value = response.data.map((cat) => ({
      title: cat,
      value: cat,
    }))
    console.log('Categorías cargadas:', categorias.value)
  } catch (error) {
    console.error('Error al cargar categorías:', error)
    toast.error('Error al cargar las categorías')
  } finally {
    cargando.value = false
  }
}

const cargarJugadoresPorCategoria = async (categoria) => {
  if (!categoria) {
    jugadores.value = []
    return
  }

  try {
    cargando.value = true
    const response = await axios.get(
      `http://localhost:3000/api/players/category/${encodeURIComponent(categoria)}`,
    )
    jugadores.value = response.data
    console.log(`Jugadores de ${categoria}:`, jugadores.value)
  } catch (error) {
    console.error('Error al cargar jugadores:', error)
    toast.error('Error al cargar los jugadores')
    jugadores.value = []
  } finally {
    cargando.value = false
  }
}

const verDetalles = (jugador) => {
  jugadorSeleccionado.value = jugador
  dialogDetalles.value = true
}

const editarJugador = (jugador) => {
  // Aquí puedes implementar la edición
  toast.info(`Editar jugador: ${jugador.name} ${jugador.lastName}`)
  console.log('Editar jugador:', jugador)
}

const getColorGenero = (genero) => {
  const colores = {
    male: 'blue',
    female: 'pink',
    Masculino: 'blue',
    Femenino: 'pink',
  }
  return colores[genero] || 'grey'
}

const formatGenero = (genero) => {
  const formatos = {
    male: 'Masculino',
    female: 'Femenino',
    Masculino: 'Masculino',
    Femenino: 'Femenino',
  }
  return formatos[genero] || genero
}
</script>

<style scoped>
.gestion-container {
  background: linear-gradient(135deg, #1e3c72, #2a5298, #7e57c2);
  min-height: 100vh;
}

.jugadores-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.jugador-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 12px;
}

.jugador-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 12px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.tutor-info {
  background-color: #f8f9fa;
  padding: 12px;
  border-radius: 8px;
  border-left: 4px solid #1976d2;
}

/* Responsive */
@media (max-width: 768px) {
  .jugadores-grid {
    grid-template-columns: 1fr;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>
