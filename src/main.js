import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import '@mdi/font/css/materialdesignicons.css'

// 🧡 Importa vue3-toastify
import Vue3Toastify, { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

// 🔥 IMPORTAR PINIA
import { createPinia } from 'pinia'

loadFonts()

const app = createApp(App)
const pinia = createPinia() // Crear instancia de Pinia

// 🔥 USAR PINIA PRIMERO
app.use(pinia) // Pinia debe ir antes que los demás plugins
app.use(router)
app.use(vuetify)

// 🧡 Configura toastify (sin loading, simple y elegante)
app.use(Vue3Toastify, {
  autoClose: 3000, // Cierra automáticamente a los 3 segundos
  position: 'top-right', // Posición de las notificaciones
  hideProgressBar: true, // Muestra la barra de progreso
  pauseOnHover: true, // Pausa si pasas el mouse
  closeOnClick: true, // Cierra al hacer clic
  theme: 'colored', // Tema visual
  transition: 'slide', // Transición sin animación de carga
  draggable: true,
})

app.mount('#app')

// Exporta el toast para usarlo en otros archivos
export { toast }
