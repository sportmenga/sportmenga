<template>
  <v-container fluid>
    <h1 class="text-center font-weight-bold mb-8" style="color: #512DA8;">
      Tienda Oficial Club Menga Sport 2025
    </h1>


    <div class="text-end mb-4 btn-flotante">
      <v-btn color="#512DA8" variant="elevated" @click="carritoAbierto = true">
        🛒 Ver carrito ({{ carrito.length }})
      </v-btn>
    </div>


    <v-row>
      <v-col
        v-for="(producto, index) in productos"
        :key="index"
        cols="12"
        sm="6"
        md="4"
      >
        <v-card
          class="mx-auto rounded-xl hover:scale-105 transition-transform duration-300 cursor-pointer"
          max-width="350"
          elevation="4"
          @click="abrirDialogo(producto)"
        >
          <v-img :src="producto.image" height="250px" cover />
          <v-card-title class="font-weight-bold text-center">
            {{ producto.name }}
          </v-card-title>
          <v-card-subtitle class="text-grey-darken-1 text-center">
            {{ formatoMoneda(producto.price) }}
          </v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>

  
    <v-dialog v-model="dialogo" max-width="500">
      <v-card v-if="productoSeleccionado">
        <v-img :src="productoSeleccionado.image" height="250" cover />

        <v-card-title class="text-h6 font-weight-bold" style="color: #512DA8;">
          {{ productoSeleccionado.name }}
        </v-card-title>

        <v-card-text>
          <p><strong>Precio:</strong> {{ formatoMoneda(productoSeleccionado.price) }}</p>

          <p>
            <strong>Descripción:</strong>
            {{ productoSeleccionado.descripcion ||
              'Producto deportivo de alta calidad, diseñado para ofrecer comodidad y rendimiento durante la actividad física.' }}
          </p>

    
          <v-select
            v-model="tallaSeleccionada"
            :items="tallas"
            label="Selecciona una talla"
            variant="outlined"
            density="compact"
            class="mt-3"
            required
          />

        
          <v-text-field
            v-model="cantidadSeleccionada"
            label="Cantidad"
            type="number"
            min="1"
            variant="outlined"
            density="compact"
            class="mt-3"
          />
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn color="#512DA8" variant="elevated" @click="agregarAlCarrito">
            Agregar al carrito
          </v-btn>
          <v-btn color="grey-darken-1" variant="text" @click="dialogo = false">
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>


    <v-dialog v-model="carritoAbierto" max-width="700px">
      <v-card>
        <v-card-title class="font-weight-bold text-center" style="color: #512DA8;">
          🛒 Carrito de Compras
        </v-card-title>
        <v-divider />

        <v-card-text>
          <div v-if="carrito.length === 0" class="text-center py-5">
            Tu carrito está vacío.
          </div>

          <v-list v-else>
            <v-list-item
              v-for="(item, index) in carrito"
              :key="index"
              class="border-b"
            >
              <v-list-item-avatar>
                <v-img :src="item.image"></v-img>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title>{{ item.nombre }}</v-list-item-title>
                <v-list-item-subtitle>
                  Talla: {{ item.talla }} | Cantidad: {{ item.cantidad }}
                </v-list-item-subtitle>
                <v-list-item-subtitle>
                  Precio: {{ item.precio }}
                </v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-action>
                <v-btn color="red" icon @click="eliminarDelCarrito(index)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-card-text>

        <v-divider class="my-2" />

        <v-card-text v-if="carrito.length > 0" class="text-end">
          <strong>Total:</strong> {{ calcularTotal }}
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn color="green" variant="elevated" @click="enviarCarritoWhatsApp()" :disabled="carrito.length === 0">
            Proceder al pago
          </v-btn>
          <v-btn color="grey-darken-1" variant="text" @click="carritoAbierto = false">
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
     <Informacion />
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import Informacion from '@/components/Informacion.vue'
import { useRoute } from 'vue-router'
import { toast } from '@/main'

const route = useRoute()
const dialogo = ref(false)
const carritoAbierto = ref(false)
const productoSeleccionado = ref(null)
const cantidadSeleccionada = ref(1)
const tallaSeleccionada = ref(null)
const carrito = ref([])

const tallas = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

const productos = [
  { id: '01', name: 'Camisa de padres opción 1', price: 60000, image: '/src/assets/01.jpeg', descripcion: 'Camisa ligera con diseño moderno y cómodo.' },
  { id: '02', name: 'Uniformes Año 2025', price: 420000, image: '/src/assets/02.jpeg', descripcion: 'Uniforme oficial temporada 2025 con materiales premium.' },
  { id: '03', name: 'Kit Arqueros', price: 305000, image: '/src/assets/03.jpeg', descripcion: 'Conjunto profesional para porteros.' },
  { id: '04', name: 'Uniforme de portero', price: 160000, image: '/src/assets/04.jpeg', descripcion: 'Diseñado para soportar la intensidad del juego.' },
  { id: '05', name: 'Uniformes de entreno', price: 110000, image: '/src/assets/05.jpeg', descripcion: 'Ideal para sesiones diarias de práctica.' },
  { id: '06', name: 'Camisa de padres opción 2', price: 60000, image: '/src/assets/06.jpeg', descripcion: 'Camisa alternativa elegante para los padres.' },
  { id: '07', name: 'Uniforme alterno', price: 140000, image: '/src/assets/07.jpeg', descripcion: 'Uniforme alterno moderno y cómodo.' },
]

//Cargar carrito desde localStorage al iniciar
onMounted(() => {
  const guardado = localStorage.getItem('carrito')
  if (guardado) carrito.value = JSON.parse(guardado)

  // Si llega un ID desde el catálogo
  const idProducto = route.query.id
  if (idProducto) {
    const producto = productos.find((p) => p.id === idProducto)
    if (producto) {
      productoSeleccionado.value = producto
      dialogo.value = true
    }
  }
})

// Guardar carrito automáticamente en localStorage
watch(carrito, (nuevoValor) => {
  localStorage.setItem('carrito', JSON.stringify(nuevoValor))
}, { deep: true })

// Abrir diálogo de producto
function abrirDialogo(producto) {
  productoSeleccionado.value = producto
  cantidadSeleccionada.value = 1
  tallaSeleccionada.value = null
  dialogo.value = true
}

// Agregar producto al carrito
function agregarAlCarrito() {
  if (!tallaSeleccionada.value) {
    toast.info('Por favor selecciona una talla antes de agregar al carrito.')
    return
  }

  const nuevoItem = {
    id: productoSeleccionado.value.id,
    nombre: productoSeleccionado.value.name,
    talla: tallaSeleccionada.value,
    cantidad: cantidadSeleccionada.value,
    precio: productoSeleccionado.value.price,
    image: productoSeleccionado.value.image,
  }

  carrito.value.push(nuevoItem)
  toast.success(`✅ Se agregó "${nuevoItem.nombre}" al carrito 🛒`)
  dialogo.value = false
}

// Eliminar producto del carrito
function eliminarDelCarrito(index) {
  carrito.value.splice(index, 1)
  toast.info('Producto eliminado del carrito 🗑️')
}

// Calcular total
const calcularTotal = computed(() => {
  const total = carrito.value.reduce((sum, item) => sum + item.precio * item.cantidad, 0)
  return formatoMoneda(total)
})

// Formato moneda
function formatoMoneda(valor) {
  return valor.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })
}

// Enviar carrito a WhatsApp
function enviarCarritoWhatsApp() {
  if (carrito.value.length === 0) {
    toast.info("Tu carrito está vacío.")
    return
  }

  toast.info('Redirigiendo a WhatsApp')

  let mensaje = "🛒 *Pedido desde la Tienda Oficial Club Menga Sport 2025*%0A%0A"
  carrito.value.forEach((item, index) => {
    mensaje += `*${index + 1}. ${item.nombre}*%0A`
    mensaje += `Talla: ${item.talla}%0A`
    mensaje += `Cantidad: ${item.cantidad}%0A`
    mensaje += `Precio: ${formatoMoneda(item.precio)}%0A%0A`
  })

  const total = carrito.value.reduce((sum, item) => sum + item.precio * item.cantidad, 0)
  mensaje += `💰 *Total:* ${formatoMoneda(total)}%0A%0A`
  mensaje += "Por favor confirme disponibilidad y medios de pago."

  const numeroWhatsApp = "573172112739"
  const url = `https://wa.me/${numeroWhatsApp}?text=${mensaje}`
  window.open(url, "_blank")
}
</script>

<style scoped>
.v-card {
  background-color: #fff;
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}
.v-card:hover {
  box-shadow: 0 6px 18px rgba(81, 45, 168, 0.4);
}
.border-b {
  border-bottom: 1px solid #ddd;
}
.btn-flotante {
  position: fixed;
  bottom: 24px;
  right: 24px;
  font-size: 20px;
  padding: 20px;
  z-index: 999;
}
</style>
