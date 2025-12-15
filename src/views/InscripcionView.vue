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
          <v-text-field label="Apellido menor" v-model="form.apellidoMenor" />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field label="Nombre menor" v-model="form.nombreMenor" />
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
          <v-text-field label="Número de documento" v-model="form.numeroDocumento" />
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
          <v-text-field label="Teléfono" v-model="form.telefono" />
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
          <v-text-field label="Categoría" v-model="form.categoria" />
        </v-col>

        <v-col cols="12">
          <v-textarea label="Alergias o enfermedades base" v-model="form.alergias" rows="2" />
        </v-col>
      </v-row>

      <v-divider class="my-6"></v-divider>

      <v-card-subtitle class="text-h6 font-weight-bold">👨‍👩‍👧 Datos del tutor legal</v-card-subtitle>

      <v-row dense>
        <v-col cols="12" md="6">
          <v-text-field label="Apellido" v-model="form.tutorApellido" />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field label="Nombre" v-model="form.tutorNombre" />
        </v-col>

        <v-col cols="12" md="6">
          <v-select
            label="Tipo de documento"
            :items="['Cédula de ciudadanía', 'Cédula extranjera', 'Pasaporte']"
            v-model="form.tutorTipoDocumento"
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field label="Número de documento" v-model="form.tutorNumeroDocumento" />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field label="Parentesco" v-model="form.parentesco" />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field label="Teléfono o celular" v-model="form.tutorTelefono" />
        </v-col>

        <v-col cols="12" md="12">
          <v-text-field label="Correo" type="email" v-model="form.tutorCorreo" />
        </v-col>
      </v-row>

      <v-divider class="my-6"></v-divider>

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
import axios from 'axios'
import { toast } from '@/main'

const loading = ref(false)

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

const enviarFormulario = async () => {
  if (!form.value.nombreMenor || !form.value.apellidoMenor) {
    toast.warning('Por favor completa los campos obligatorios (Nombre y Apellido del menor).')
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
      dominantfoot: form.value.pieDominante?.toLowerCase(),
      size: form.value.talla,
      weight: form.value.peso,
      diseases: form.value.alergias,
      relationship: form.value.parentesco,
      tel: form.value.telefono,
      guardiaNumber: form.value.tutorNumeroDocumento,
    }

    console.log('📤 Enviando datos al backend:', payload)

    // Hacer la petición POST al backend
    const response = await axios.post(
      'https://futboleveback-production.up.railway.app/api/players',
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      },
    )

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
  } catch (error) {
    console.error('❌ Error al enviar formulario:', error)

    if (error.response) {
      // El servidor respondió con un error
      toast.error(`Error del servidor: ${error.response.data?.error || error.response.status}`)
      console.error('Detalles del error:', error.response.data)
    } else if (error.request) {
      // No se recibió respuesta del servidor
      toast.error(
        'No se pudo conectar con el servidor. Verifica que esté corriendo en http://localhost:3000',
      )
    } else {
      // Error en la configuración de la petición
      toast.error('Error al enviar el formulario: ' + error.message)
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
