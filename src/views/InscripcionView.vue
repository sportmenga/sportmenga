<template>
  <v-container fluid class="py-8 form-container">
    <v-card class="mx-auto pa-6" max-width="900">
      <v-card-title class="text-h5 font-weight-bold text-center">
        📝 Ficha de inscripción jugador
      </v-card-title>

      <v-divider class="my-4"></v-divider>

      <v-row dense>
        <v-col cols="12" md="6">
          <v-text-field label="Fecha de inscripción" type="date" v-model="form.fechaInscripcion" />
        </v-col>

        <v-col cols="12" md="6">
          <v-file-input
            label="Foto del jugador"
            prepend-icon="mdi-camera"
            accept="image/*"
            v-model="form.foto"
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            label="Apellido menor"
            v-model="form.apellidoMenor"
            :error-messages="errores.apellidoMenor"
            @blur="validarApellido('apellidoMenor', form.apellidoMenor)"
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            label="Nombre menor"
            v-model="form.nombreMenor"
            :error-messages="errores.nombreMenor"
            @blur="validarNombre('nombreMenor', form.nombreMenor)"
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-select
            label="Género"
            :items="['Masculino', 'Femenino', 'Otro']"
            v-model="form.genero"
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-select
            label="Tipo de documento"
            :items="['CC', 'TI', 'Other']"
            v-model="form.tipoDocumento"
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            label="Número de documento"
            v-model="form.numeroDocumento"
            :error-messages="errores.numeroDocumento"
            @input="soloNumeros('numeroDocumento', form.numeroDocumento)"
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field label="Fecha de nacimiento" type="date" v-model="form.fechaNacimiento" />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field label="Lugar de nacimiento" v-model="form.lugarNacimiento" />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field label="Dirección" v-model="form.direccion" />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            label="Teléfono"
            v-model="form.telefono"
            :error-messages="errores.telefono"
            @input="soloNumeros('telefono', form.telefono)"
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field label="EPS" v-model="form.eps" />
        </v-col>

        <v-col cols="12" md="6">
          <v-select
            label="Pie dominante"
            :items="['Derecho', 'Izquierdo', 'ambos']"
            v-model="form.pieDominante"
          />
        </v-col>

        <v-col cols="12" md="3">
          <v-text-field
            label="Talla (m)"
            type="number"
            v-model.number="form.talla"
            step="0.01"
            min="0.5"
            max="2.5"
            hint="Ej: 1.65"
            persistent-hint
          />
        </v-col>

        <v-col cols="12" md="3">
          <v-text-field
            label="Peso (kg)"
            type="number"
            v-model.number="form.peso"
            step="0.1"
            min="10"
            max="150"
            hint="Ej: 55.5"
            persistent-hint
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-select
            label="Categoría (Año de nacimiento)"
            :items="listaAnios"
            v-model="form.categoria"
          />
        </v-col>

        <v-col cols="12">
          <v-textarea label="Alergias o enfermedades base" v-model="form.alergias" rows="2" />
        </v-col>
      </v-row>

      <v-divider class="my-6"></v-divider>

      <v-card-subtitle class="text-h6 font-weight-bold">👨‍👩‍👧 Datos del tutor legal</v-card-subtitle>

      <v-row dense>
        <v-col cols="12" md="6">
          <v-text-field
            label="Apellido"
            v-model="form.tutorApellido"
            :error-messages="errores.tutorApellido"
            @blur="validarApellido('tutorApellido', form.tutorApellido)"
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            label="Nombre"
            v-model="form.tutorNombre"
            :error-messages="errores.tutorNombre"
            @blur="validarNombre('tutorNombre', form.tutorNombre)"
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-select
            label="Tipo de documento"
            :items="['Cédula de ciudadanía', 'Cédula extranjera', 'Pasaporte']"
            v-model="form.tutorTipoDocumento"
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            label="Número de documento"
            v-model="form.tutorNumeroDocumento"
            :error-messages="errores.tutorNumeroDocumento"
            @input="soloNumeros('tutorNumeroDocumento', form.tutorNumeroDocumento)"
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field label="Parentesco" v-model="form.parentesco" />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            label="Teléfono o celular"
            v-model="form.tutorTelefono"
            :error-messages="errores.tutorTelefono"
            @input="soloNumeros('tutorTelefono', form.tutorTelefono)"
          />
        </v-col>

        <v-col cols="12" md="12">
          <v-text-field
            label="Correo"
            type="email"
            v-model="form.tutorCorreo"
            :error-messages="errores.tutorCorreo"
            @blur="validarCorreo('tutorCorreo', form.tutorCorreo)"
          />
        </v-col>
      </v-row>

      <v-divider class="my-6"></v-divider>

      <!-- Campos de documentos comentados por ahora -->
      <!--
      <v-card-subtitle class="text-h6 font-weight-bold">📎 Anexar documentos (PDF)</v-card-subtitle>

      <v-row dense>
        <v-col cols="12" md="6">
          <v-file-input
            label="Registro civil o tarjeta de identidad"
            accept=".pdf"
            v-model="form.docRegistro"
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-file-input label="EPS" accept=".pdf" v-model="form.docEps" />
        </v-col>

        <v-col cols="12" md="6">
          <v-file-input label="Acta de compromiso" accept=".pdf" v-model="form.docActaCompromiso" />
        </v-col>

        <v-col cols="12" md="6">
          <v-file-input label="Cédula tutor legal" accept=".pdf" v-model="form.docCedulaTutor" />
        </v-col>

        <v-col cols="12" md="6">
          <v-file-input label="Permiso padres Liga" accept=".pdf" v-model="form.docPermisoLiga" />
        </v-col>

        <v-col cols="12" md="6">
          <v-file-input
            label="Permiso padres Federación"
            accept=".pdf"
            v-model="form.docPermisoFederacion"
          />
        </v-col>
      </v-row>

      <v-divider class="my-6"></v-divider>
      -->

      <v-divider class="my-6"></v-divider>

      <v-btn
        color="deep-purple-accent-4"
        class="text-white"
        block
        @click="enviarFormulario"
        :loading="loading"
      >
        {{ loading ? 'Enviando...' : 'Enviar formulario' }}
      </v-btn>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { toast } from '@/main'
import { playerService } from '@/services/api'

const loading = ref(false)

// Objeto para almacenar errores de validación
const errores = ref({})

// Generar lista de años para la categoría (año de nacimiento)
const anioActual = new Date().getFullYear()
const listaAnios = ref([])
for (let anio = 2000; anio <= anioActual + 1; anio++) {
  listaAnios.value.push(anio.toString())
}
listaAnios.value.reverse() // Mostrar años más recientes primero

const form = ref({
  fechaInscripcion: '',
  foto: null,
  apellidoMenor: '',
  nombreMenor: '',
  genero: '',
  tipoDocumento: '',
  numeroDocumento: '',
  fechaNacimiento: '',
  lugarNacimiento: '',
  direccion: '',
  telefono: '',
  eps: '',
  pieDominante: '',
  talla: '',
  peso: '',
  categoria: '',
  alergias: '',

  tutorApellido: '',
  tutorNombre: '',
  tutorTipoDocumento: '',
  tutorNumeroDocumento: '',
  parentesco: '',
  tutorTelefono: '',
  tutorCorreo: '',

  docRegistro: null,
  docEps: null,
  docActaCompromiso: null,
  docCedulaTutor: null,
  docPermisoLiga: null,
  docPermisoFederacion: null,
})

// Función para calcular edad desde fecha de nacimiento
const calcularEdad = (fechaNacimiento) => {
  if (!fechaNacimiento) return 0
  const hoy = new Date()
  const nacimiento = new Date(fechaNacimiento)
  let edad = hoy.getFullYear() - nacimiento.getFullYear()
  const mes = hoy.getMonth() - nacimiento.getMonth()
  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--
  }
  return edad
}

// Función para mapear géneros al formato del backend
const mapearGenero = (genero) => {
  const mapa = {
    Masculino: 'male',
    Femenino: 'female',
    Otro: 'other',
  }
  return mapa[genero] || genero
}

// Función para mapear tipo de documento al formato del backend
const mapearTipoDocumento = (tipoDoc) => {
  const mapa = {
    'Registro civil': 'RC',
    'Tarjeta de identidad': 'TI',
    Cédula: 'CC',
  }
  return mapa[tipoDoc] || tipoDoc
}

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

  // Validar que tenga al menos 2 caracteres y no sean solo números
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

  // Validar que tenga al menos 2 caracteres y no sean solo números
  if (valorLimpio.length < 2 || /^\d+$/.test(valorLimpio)) {
    errores.value[campo] = 'Por favor ingresa un apellido válido'
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

  // Remover caracteres especiales y dejar solo números
  const soloNumeros = valor.replace(/[^0-9]/g, '')
  form.value[campo] = soloNumeros

  if (valor !== soloNumeros) {
    errores.value[campo] = 'Solo se permiten números'
  } else {
    errores.value[campo] = ''
  }
}

// Función para validar correo electrónico
const validarCorreo = (campo, valor) => {
  if (!valor || valor.trim() === '') {
    errores.value[campo] = ''
    return true
  }

  // Expresión regular para validar formato de correo
  const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!regexCorreo.test(valor.trim())) {
    errores.value[campo] = 'Por favor ingresa un correo electrónico válido'
    return false
  }

  errores.value[campo] = ''
  return true
}

// Función para validar que todos los campos requeridos estén completos
const validarCamposRequeridos = () => {
  const camposRequeridos = [
    { campo: 'fechaInscripcion', nombre: 'Fecha de inscripción' },
    { campo: 'apellidoMenor', nombre: 'Apellido menor' },
    { campo: 'nombreMenor', nombre: 'Nombre menor' },
    { campo: 'genero', nombre: 'Género' },
    { campo: 'tipoDocumento', nombre: 'Tipo de documento' },
    { campo: 'numeroDocumento', nombre: 'Número de documento' },
    { campo: 'fechaNacimiento', nombre: 'Fecha de nacimiento' },
    { campo: 'lugarNacimiento', nombre: 'Lugar de nacimiento' },
    { campo: 'direccion', nombre: 'Dirección' },
    { campo: 'telefono', nombre: 'Teléfono' },
    { campo: 'eps', nombre: 'EPS' },
    { campo: 'pieDominante', nombre: 'Pie dominante' },
    { campo: 'categoria', nombre: 'Categoría' },
    { campo: 'tutorApellido', nombre: 'Apellido del tutor' },
    { campo: 'tutorNombre', nombre: 'Nombre del tutor' },
    { campo: 'tutorTipoDocumento', nombre: 'Tipo de documento del tutor' },
    { campo: 'tutorNumeroDocumento', nombre: 'Número de documento del tutor' },
    { campo: 'parentesco', nombre: 'Parentesco' },
    { campo: 'tutorTelefono', nombre: 'Teléfono del tutor' },
    { campo: 'tutorCorreo', nombre: 'Correo del tutor' },
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
  if (!validarNombre('nombreMenor', form.value.nombreMenor)) {
    return false
  }
  if (!validarApellido('apellidoMenor', form.value.apellidoMenor)) {
    return false
  }
  if (!validarNombre('tutorNombre', form.value.tutorNombre)) {
    return false
  }
  if (!validarApellido('tutorApellido', form.value.tutorApellido)) {
    return false
  }

  // Validar correo electrónico
  if (!validarCorreo('tutorCorreo', form.value.tutorCorreo)) {
    return false
  }

  return true
}

const enviarFormulario = async () => {
  // Validar todos los campos requeridos
  if (!validarCamposRequeridos()) {
    return
  }

  loading.value = true

  try {
    // Preparar el payload según la estructura que necesita el backend
    const payload = {
      name: form.value.nombreMenor,
      lastName: form.value.apellidoMenor,
      age: calcularEdad(form.value.fechaNacimiento),
      birthDate: form.value.fechaNacimiento,
      guardianName: `${form.value.tutorNombre} ${form.value.tutorApellido}`,
      guardianPhone: form.value.tutorTelefono,
      guardianEmail: form.value.tutorCorreo,
      category: form.value.categoria,
      photo: null, // Por ahora sin foto, puedes implementar subida después
      gender: mapearGenero(form.value.genero),
      documenttype: mapearTipoDocumento(form.value.tipoDocumento),
      documentnumber: form.value.numeroDocumento,
      dress: '', // Este campo no está en el formulario
      eps: form.value.eps,
      dominantfoot: form.value.pieDominante ? form.value.pieDominante.toLowerCase() : '',
      size: form.value.talla || null,
      weight: form.value.peso || null,
      diseases: form.value.alergias || null,
      relationship: form.value.parentesco,
      tel: form.value.telefono,
      guardiaNumber: form.value.tutorNumeroDocumento,
    }

    console.log('📤 Enviando datos al backend:', payload)

    // Hacer la petición POST al backend usando el servicio centralizado
    const response = await playerService.createPlayer(payload)

    // Verificar si la respuesta es exitosa (status 200-299)
    // Axios solo lanza error para status >= 400, así que si llegamos aquí es éxito
    toast.success('✅ Formulario enviado correctamente al servidor')
    console.log('📩 Respuesta del servidor:', response.data)

    // Limpiar formulario después del éxito
    Object.keys(form.value).forEach((key) => {
      if (form.value[key] && typeof form.value[key] === 'object') {
        form.value[key] = null // Para los file inputs
      } else {
        form.value[key] = '' // Para los text inputs
      }
    })
    // Limpiar errores
    errores.value = {}
  } catch (error) {
    console.error('❌ Error al enviar formulario:', error)
    console.error('❌ Error completo:', {
      message: error.message,
      response: error.response,
      request: error.request,
      config: error.config,
    })

    // Verificar si el error es porque el jugador ya existe o es un error de validación del backend
    if (error.response) {
      const status = error.response.status
      const data = error.response.data

      console.log('📋 Respuesta del servidor recibida:', { status, data })

      // Si el status es 201 (Created) o 200 (OK), considerar como éxito
      // También verificar si la respuesta contiene datos que indiquen éxito
      const esExitoso = status === 201 || status === 200 || (status >= 200 && status < 300)
      const tieneDatosExitosos = data && (data.id || data.player || data.message?.toLowerCase().includes('creado') || data.message?.toLowerCase().includes('created'))

      if (esExitoso || tieneDatosExitosos) {
        toast.success('✅ Formulario enviado correctamente al servidor')
        console.log('📩 Respuesta del servidor:', data)

        // Limpiar formulario después del éxito
        Object.keys(form.value).forEach((key) => {
          if (form.value[key] && typeof form.value[key] === 'object') {
            form.value[key] = null
          } else {
            form.value[key] = ''
          }
        })
        // Limpiar errores
        errores.value = {}
        return
      }

      // Extraer mensaje de error del backend
      let mensajeError = ''

      // Intentar obtener el mensaje de error de diferentes formatos posibles
      if (data?.error) {
        mensajeError = typeof data.error === 'string' ? data.error : JSON.stringify(data.error)
      } else if (data?.message) {
        mensajeError = typeof data.message === 'string' ? data.message : JSON.stringify(data.message)
      } else if (data?.errors && Array.isArray(data.errors)) {
        // Si hay un array de errores, unirlos
        mensajeError = data.errors.map((err) => (typeof err === 'string' ? err : err.message || JSON.stringify(err))).join(', ')
      } else if (typeof data === 'string') {
        mensajeError = data
      } else if (data && typeof data === 'object') {
        // Si es un objeto, intentar extraer mensajes de sus propiedades
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
        mensajeError = mensajes.length > 0 ? mensajes.join(' | ') : 'Error al crear el jugador'
      } else {
        mensajeError = `Error ${status}: No se pudo crear el jugador`
      }

      // Si es un error 400 o 409, puede ser que el jugador ya existe
      if (status === 400 || status === 409) {
        const mensajeLower = mensajeError.toLowerCase()
        if (mensajeLower.includes('ya existe') || mensajeLower.includes('already exists') || mensajeLower.includes('duplicate')) {
          toast.warning(`⚠️ El jugador ya está registrado: ${mensajeError}`)
        } else {
          toast.error(`❌ Error al crear el jugador: ${mensajeError}`)
        }
      } else if (status === 422) {
        // Error de validación
        toast.error(`❌ Error de validación: ${mensajeError}`)
      } else if (status === 500) {
        toast.error(`❌ Error del servidor (500): ${mensajeError || 'Error interno del servidor. Revisa la consola para más detalles.'}`)
      } else {
        toast.error(`❌ Error al crear el jugador (${status}): ${mensajeError}`)
      }

      console.error('Detalles del error:', {
        status,
        data,
        mensajeError,
      })
    } else if (error.request) {
      // No se recibió respuesta del servidor, pero puede que el registro se haya creado
      console.error('❌ No se recibió respuesta del servidor:', error.request)
      console.warn('⚠️ El registro puede haberse creado aunque no se recibió respuesta. Verifica en el sistema.')
      
      // Mostrar mensaje informativo en lugar de error definitivo
      toast.warning('⚠️ No se recibió confirmación del servidor, pero el registro puede haberse creado. Verifica en el sistema.')
    } else {
      // Error en la configuración de la petición
      console.error('❌ Error en la configuración:', error.message)
      toast.error(`❌ Error al enviar el formulario: ${error.message}`)
    }
  } finally {
    loading.value = false
  }
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
