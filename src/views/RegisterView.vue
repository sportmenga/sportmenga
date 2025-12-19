<template>
  <v-container fluid class="py-8 form-container">
    <v-card class="mx-auto pa-6" max-width="700">
      <v-card-title class="text-h5 font-weight-bold text-center">
        👤 Registro de Usuario
      </v-card-title>

      <v-divider class="my-4"></v-divider>

      <v-row dense>
        <v-col cols="12" md="6">
          <v-text-field
            label="Nombre"
            v-model="form.nombre"
            :error-messages="errores.nombre"
            @blur="validarNombre('nombre', form.nombre)"
            required
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            label="Apellido"
            v-model="form.apellido"
            :error-messages="errores.apellido"
            @blur="validarApellido('apellido', form.apellido)"
            required
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            label="Nombre de usuario"
            v-model="form.username"
            :error-messages="errores.username"
            hint="Este será tu nombre de usuario para iniciar sesión"
            persistent-hint
            required
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            label="Correo electrónico"
            type="email"
            v-model="form.email"
            :error-messages="errores.email"
            @blur="validarCorreo('email', form.email)"
            required
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            label="Contraseña"
            type="password"
            v-model="form.password"
            :error-messages="errores.password"
            :append-inner-icon="mostrarPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append-inner="mostrarPassword = !mostrarPassword"
            hint="Mínimo 6 caracteres"
            persistent-hint
            required
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            label="Confirmar contraseña"
            type="password"
            v-model="form.confirmPassword"
            :error-messages="errores.confirmPassword"
            :append-inner-icon="mostrarConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append-inner="mostrarConfirmPassword = !mostrarConfirmPassword"
            required
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            label="Teléfono"
            v-model="form.telefono"
            :error-messages="errores.telefono"
            @input="soloNumeros('telefono', form.telefono)"
            hint="Solo números"
            persistent-hint
          />
        </v-col>
      </v-row>

      <v-divider class="my-6"></v-divider>

      <v-btn
        color="deep-purple-accent-4"
        class="text-white"
        block
        @click="registrarUsuario"
        :loading="loading"
      >
        {{ loading ? 'Registrando...' : 'Registrarse' }}
      </v-btn>

      <v-row class="mt-4" justify="center">
        <v-col cols="12" class="text-center">
          <v-btn text small @click="irALogin" :disabled="loading">
            ¿Ya tienes cuenta? Inicia sesión
          </v-btn>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from '@/main'
import { userService } from '@/services/api'

const router = useRouter()
const loading = ref(false)
const mostrarPassword = ref(false)
const mostrarConfirmPassword = ref(false)

// Objeto para almacenar errores de validación
const errores = ref({})

const form = ref({
  nombre: '',
  apellido: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  telefono: '',
})

// Función para validar nombres (evitar valores inválidos como "no x", "nn", etc.)
const validarNombre = (campo, valor) => {
  if (!valor || valor.trim() === '') {
    errores.value[campo] = ''
    return true
  }

  const valorLimpio = valor.trim().toLowerCase()
  const nombresInvalidos = ['no x', 'nn', 'n', 'no', 'x', 'xx', 'xxx', 'na', 'n/a', 'ninguno']

  if (nombresInvalidos.includes(valorLimpio) || valorLimpio.length < 2) {
    errores.value[campo] = 'Por favor ingresa un nombre válido'
    return false
  }

  if (valorLimpio.length < 2 || /^\d+$/.test(valorLimpio)) {
    errores.value[campo] = 'Por favor ingresa un nombre válido'
    return false
  }

  errores.value[campo] = ''
  return true
}

// Función para validar apellidos (evitar valores inválidos como "no x", "nn", etc.)
const validarApellido = (campo, valor) => {
  if (!valor || valor.trim() === '') {
    errores.value[campo] = ''
    return true
  }

  const valorLimpio = valor.trim().toLowerCase()
  const apellidosInvalidos = ['no x', 'nn', 'n', 'no', 'x', 'xx', 'xxx', 'na', 'n/a', 'ninguno']

  if (apellidosInvalidos.includes(valorLimpio) || valorLimpio.length < 2) {
    errores.value[campo] = 'Por favor ingresa un apellido válido'
    return false
  }

  if (valorLimpio.length < 2 || /^\d+$/.test(valorLimpio)) {
    errores.value[campo] = 'Por favor ingresa un apellido válido'
    return false
  }

  errores.value[campo] = ''
  return true
}

// Función para validar correo electrónico
const validarCorreo = (campo, valor) => {
  if (!valor || valor.trim() === '') {
    errores.value[campo] = ''
    return true
  }

  const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!regexCorreo.test(valor.trim())) {
    errores.value[campo] = 'Por favor ingresa un correo electrónico válido'
    return false
  }

  errores.value[campo] = ''
  return true
}

// Función para permitir solo números en campos numéricos
const soloNumeros = (campo, valor) => {
  if (!valor) {
    errores.value[campo] = ''
    return
  }

  const soloNumeros = valor.replace(/[^0-9]/g, '')
  form.value[campo] = soloNumeros

  if (valor !== soloNumeros) {
    errores.value[campo] = 'Solo se permiten números'
  } else {
    errores.value[campo] = ''
  }
}

// Función para validar que todos los campos requeridos estén completos
const validarCamposRequeridos = () => {
  const camposRequeridos = [
    { campo: 'nombre', nombre: 'Nombre' },
    { campo: 'apellido', nombre: 'Apellido' },
    { campo: 'username', nombre: 'Nombre de usuario' },
    { campo: 'email', nombre: 'Correo electrónico' },
    { campo: 'password', nombre: 'Contraseña' },
    { campo: 'confirmPassword', nombre: 'Confirmar contraseña' },
  ]

  const camposFaltantes = []

  for (const { campo, nombre } of camposRequeridos) {
    if (!form.value[campo] || form.value[campo].toString().trim() === '') {
      camposFaltantes.push(nombre)
    }
  }

  if (camposFaltantes.length > 0) {
    toast.warning(`Por favor completa los siguientes campos: ${camposFaltantes.join(', ')}`)
    return false
  }

  // Validar nombres y apellidos
  if (!validarNombre('nombre', form.value.nombre)) {
    return false
  }
  if (!validarApellido('apellido', form.value.apellido)) {
    return false
  }

  // Validar correo electrónico
  if (!validarCorreo('email', form.value.email)) {
    return false
  }

  // Validar contraseña
  if (form.value.password.length < 6) {
    errores.value.password = 'La contraseña debe tener al menos 6 caracteres'
    toast.warning('La contraseña debe tener al menos 6 caracteres')
    return false
  }

  // Validar que las contraseñas coincidan
  if (form.value.password !== form.value.confirmPassword) {
    errores.value.confirmPassword = 'Las contraseñas no coinciden'
    toast.warning('Las contraseñas no coinciden')
    return false
  }

  return true
}

const registrarUsuario = async () => {
  // Validar todos los campos requeridos
  if (!validarCamposRequeridos()) {
    return
  }

  loading.value = true

  try {
    // Preparar el payload según la estructura que necesita el backend
    // El rol siempre se guarda como 'user', la asignación de roles se hace después
    const payload = {
      username: form.value.username,
      email: form.value.email,
      password: form.value.password,
      name: form.value.nombre,
      lastName: form.value.apellido,
      phone: form.value.telefono || null,
      role: 'user', // Siempre se guarda como 'user'
    }

    console.log('📤 Enviando datos de registro al backend:', payload)

    // Hacer la petición POST al backend usando el servicio centralizado
    const response = await userService.registerUser(payload)

    // Verificar si la respuesta es exitosa (status 200-299)
    toast.success('✅ Usuario registrado correctamente')
    console.log('📩 Respuesta del servidor:', response.data)

    // Limpiar formulario después del éxito
    Object.keys(form.value).forEach((key) => {
      form.value[key] = ''
    })
    // Limpiar errores
    errores.value = {}

    // Redirigir al login después de 2 segundos
    setTimeout(() => {
      router.push('/ingreso')
    }, 2000)
  } catch (error) {
    console.error('❌ Error al registrar usuario:', error)
    console.error('❌ Error completo:', {
      message: error.message,
      response: error.response,
      request: error.request,
    })

    if (error.response) {
      const status = error.response.status
      const data = error.response.data

      console.log('📋 Respuesta del servidor recibida:', { status, data })

      // Extraer mensaje de error del backend
      let mensajeError = ''

      if (data?.error) {
        mensajeError = typeof data.error === 'string' ? data.error : JSON.stringify(data.error)
      } else if (data?.message) {
        mensajeError = typeof data.message === 'string' ? data.message : JSON.stringify(data.message)
      } else if (data?.errors && Array.isArray(data.errors)) {
        mensajeError = data.errors.map((err) => (typeof err === 'string' ? err : err.message || JSON.stringify(err))).join(', ')
      } else if (typeof data === 'string') {
        mensajeError = data
      } else if (data && typeof data === 'object') {
        const mensajes = []
        for (const key in data) {
          if (data[key]) {
            if (typeof data[key] === 'string') {
              mensajes.push(`${key}: ${data[key]}`)
            } else if (Array.isArray(data[key])) {
              mensajes.push(`${key}: ${data[key].join(', ')}`)
            }
          }
        }
        mensajeError = mensajes.length > 0 ? mensajes.join(' | ') : 'Error al registrar el usuario'
      } else {
        mensajeError = `Error ${status}: No se pudo registrar el usuario`
      }

      if (status === 400 || status === 409) {
        const mensajeLower = mensajeError.toLowerCase()
        if (mensajeLower.includes('ya existe') || mensajeLower.includes('already exists') || mensajeLower.includes('duplicate')) {
          toast.warning(`⚠️ El usuario ya está registrado: ${mensajeError}`)
        } else {
          toast.error(`❌ Error al registrar usuario: ${mensajeError}`)
        }
      } else if (status === 422) {
        toast.error(`❌ Error de validación: ${mensajeError}`)
      } else if (status === 500) {
        toast.error(`❌ Error del servidor (500): ${mensajeError || 'Error interno del servidor. Revisa la consola para más detalles.'}`)
      } else {
        toast.error(`❌ Error al registrar usuario (${status}): ${mensajeError}`)
      }

      console.error('Detalles del error:', {
        status,
        data,
        mensajeError,
      })
    } else if (error.request) {
      console.error('❌ No se recibió respuesta del servidor:', error.request)
      toast.error('❌ No se pudo conectar con el servidor. Verifica tu conexión a internet o que el servidor esté disponible')
    } else {
      console.error('❌ Error en la configuración:', error.message)
      toast.error(`❌ Error al enviar el formulario: ${error.message}`)
    }
  } finally {
    loading.value = false
  }
}

const irALogin = () => {
  router.push('/ingreso')
}
</script>

<style scoped>
.form-container {
  background: linear-gradient(135deg, #512da8, #7e57c2, #b39ddb);
  min-height: 100vh;
  padding-top: 40px;
  padding-bottom: 40px;
}
.v-card {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>

