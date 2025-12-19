<template>
  <v-container fluid class="login-container">
    <v-row justify="center" align="center" style="height: 100vh">
      <v-col cols="12" sm="8" md="4">
        <v-card class="pa-6 elevation-12" rounded="xl">
          <v-row justify="center" class="mb-4">
            <v-img :src="LogoImg" width="100" contain></v-img>
          </v-row>

          <h2 class="text-center font-weight-bold gradient-text mb-6">
            Bienvenido a Club Menga Sport
          </h2>

          <v-form ref="loginForm" @submit.prevent="login">
            <v-text-field
              v-model="email"
              label="Correo electrónico"
              type="email"
              prepend-inner-icon="mdi-email"
              outlined
              dense
              class="mb-4"
              required
              :disabled="loading"
            />
            <v-text-field
              v-model="password"
              label="Contraseña"
              type="password"
              prepend-inner-icon="mdi-lock"
              outlined
              dense
              class="mb-4"
              required
              :disabled="loading"
            />

            <v-btn
              type="submit"
              color="#512DA8"
              class="mb-4"
              block
              large
              elevation="6"
              :loading="loading"
              :disabled="loading"
            >
              <template v-slot:loader>
                <v-progress-circular indeterminate size="24" color="white"></v-progress-circular>
              </template>
              Iniciar sesión
            </v-btn>
          </v-form>

          <v-row class="mt-2" justify="space-between">
            <v-col cols="12" class="d-flex justify-center">
              <v-btn text small @click="recuperarPassword" :disabled="loading">
                ¿Olvidaste tu contraseña?
              </v-btn>
            </v-col>
            <v-col cols="12" class="d-flex justify-center">
              <v-btn text small @click="registrarse" :disabled="loading"> Registrarse </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import LogoImg from '@/assets/logo.svg'
import { toast } from '@/main'
import { userService } from '@/services/api'

const email = ref('')
const password = ref('')
const loginForm = ref(null)
const loading = ref(false)
const router = useRouter()

async function login() {
  if (!email.value || !password.value) {
    toast.info('Por favor completa todos los campos')
    return
  }

  loading.value = true

  try {
    // Usar el servicio centralizado en lugar de fetch directo
    const response = await userService.loginUser({
      email: email.value,
      password: password.value,
    })

    const data = response.data

    // Guardar el token en localStorage
    if (data.token) {
      localStorage.setItem('authToken', data.token)
    }
    if (data.user) {
      localStorage.setItem('userData', JSON.stringify(data.user))
    }

    toast.success(`¡Bienvenido ${data.user?.username || data.user?.email || email.value}!`)

    // Redirigir al dashboard o página principal
    router.push('/administracion')
  } catch (error) {
    console.error('Error en login:', error)

    // Manejar errores del servidor
    if (error.response) {
      const status = error.response.status
      const data = error.response.data
      const mensajeError = data?.message || data?.error || `Error ${status}: No se pudo iniciar sesión`
      toast.error(mensajeError)
    } else if (error.request) {
      toast.error('No se pudo conectar con el servidor. Verifica tu conexión a internet')
    } else {
      toast.error(error.message || 'Error al iniciar sesión')
    }
  } finally {
    loading.value = false
  }
}

function recuperarPassword() {
  toast.info('Redirigiendo a recuperación de contraseña...')
}

function registrarse() {
  router.push('/register')
}
</script>

<style scoped>
.login-container {
  background: linear-gradient(135deg, #512da8, #7e57c2, #b39ddb);
}

.gradient-text {
  background: linear-gradient(190deg, #512da8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: bold;
}

.v-card {
  background-color: #fff;
  transition:
    box-shadow 0.3s ease,
    transform 0.3s ease;
}
.v-card:hover {
  box-shadow: 0 8px 20px rgba(81, 45, 168, 0.4);
}
</style>
