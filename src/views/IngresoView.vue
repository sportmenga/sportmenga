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
    const response = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Error en el login')
    }

    // Guardar el token en localStorage
    localStorage.setItem('authToken', data.token)
    localStorage.setItem('userData', JSON.stringify(data.user))

    toast.success(`¡Bienvenido ${data.user.username || data.user.email}!`)

    // Redirigir al dashboard o página principal
    router.push('/dashboard')
  } catch (error) {
    console.error('Error en login:', error)
    toast.error(error.message || 'Error al iniciar sesión')
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
