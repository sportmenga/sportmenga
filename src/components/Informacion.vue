<template>
  <v-container fluid class="py-12" style="background-color: #f9f9fb">
    <v-row justify="center" class="mb-8">
      <v-col cols="12" class="text-center">
        <v-img
          src="/src/assets/logo.svg"
          max-width="120"
          class="mx-auto mb-4 rounded-circle"
          contain
        />
        <h1 class="text-h4 font-weight-bold" style="color: #512da8">Club Menga Sport</h1>
        <p class="text-subtitle-1 mt-2" style="color: #666">Fútbol, disciplina y pasión</p>
      </v-col>
    </v-row>

    <!-- Sección: Sobre Nosotros -->
    <v-row justify="center" class="mb-12">
      <v-col cols="12" md="10" lg="8">
        <v-card class="rounded-xl pa-6" elevation="6">
          <v-card-title class="font-weight-bold text-h5 mb-4" style="color: #512da8">
            Sobre Nosotros
          </v-card-title>

          <v-card-text>
            <p class="text-body-1 mb-4">
              En <strong>Menga Sports</strong> vivimos el fútbol como una experiencia educativa y
              divertida. Somos un club deportivo sin ánimo de lucro, registrado ante la Secretaría
              del Deporte y la Recreación, que busca acompañar el crecimiento de niños y jóvenes a
              través de una formación integral.
            </p>

            <p class="text-body-1 mb-4">
              Aquí, todos son bienvenidos sin importar su raza, creencias, género o condición
              social. Nuestro enfoque es que cada entrenamiento se convierta en una oportunidad para
              fortalecer cuerpo, mente y emociones, mientras se desarrollan habilidades físicas,
              motrices, cognitivas y sociales.
            </p>

            <p class="text-body-1 mb-6">
              Paso a paso, los guiamos para que se enamoren del deporte y lo integren a su vida de
              manera natural y progresiva. En Menga Sports el fútbol se vive a lo grande:
              aprendemos, nos divertimos y crecemos juntos.
            </p>

            <!-- Misión y Visión en cards -->
            <v-row class="mt-6">
              <v-col cols="12" md="6">
                <v-card
                  class="rounded-lg pa-4 h-100"
                  elevation="4"
                  style="background-color: #f0edf7"
                >
                  <div class="d-flex align-center mb-3">
                    <v-icon color="#512DA8" class="mr-2">mdi-bullseye-arrow</v-icon>
                    <h3 class="font-weight-bold" style="color: #512da8">MISIÓN</h3>
                  </div>
                  <p class="text-body-2">
                    Nuestro club de fútbol promueve el desarrollo integral de niños y jóvenes
                    (físico, motriz, cognitivo, afectivo y social) mediante programas estructurados
                    que fomentan el aprendizaje deportivo, la adquisición de hábitos saludables y
                    una mejor calidad de vida.
                  </p>
                </v-card>
              </v-col>

              <v-col cols="12" md="6">
                <v-card
                  class="rounded-lg pa-4 h-100"
                  elevation="4"
                  style="background-color: #f0edf7"
                >
                  <div class="d-flex align-center mb-3">
                    <v-icon color="#512DA8" class="mr-2">mdi-eye-outline</v-icon>
                    <h3 class="font-weight-bold" style="color: #512da8">VISIÓN</h3>
                  </div>
                  <p class="text-body-2">
                    Menga Sport se proyecta como una institución líder en la promoción de estilos de
                    vida saludables y en el desarrollo integral de niños y jóvenes de la comuna.
                    Nuestra visión se fundamenta en la prevención de conductas de riesgo, la
                    excelencia en la formación deportiva y la detección de talentos con proyección
                    hacia escenarios competitivos.
                  </p>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Información de contacto (manteniendo tu código original) -->
    <v-row justify="center" class="mb-12">
      <v-col cols="12" md="8">
        <v-card class="rounded-xl pa-6" elevation="6">
          <v-row justify="space-around" align="center">
            <v-col cols="12" md="4" class="text-center">
              <v-icon size="36" color="#512DA8">mdi-cellphone</v-icon>
              <h3 class="font-weight-bold mt-2" style="color: #512da8">Teléfono</h3>
              <p class="text-body-1">317 211 2739</p>
            </v-col>

            <v-col cols="12" md="4" class="text-center">
              <v-icon size="36" color="#512DA8">mdi-instagram</v-icon>
              <h3 class="font-weight-bold mt-2" style="color: #512da8">Instagram</h3>
              <a
                href="https://instagram.com/fcmagasport"
                target="_blank"
                class="text-decoration-none"
                style="color: #512da8; font-weight: 600"
              >
                @fcmagasport
              </a>
            </v-col>

            <v-col cols="12" md="4" class="text-center">
              <v-icon size="36" color="#512DA8">mdi-map-marker</v-icon>
              <h3 class="font-weight-bold mt-2" style="color: #512da8">Ubicaciones</h3>
              <a
                href="#mapas"
                class="text-decoration-none"
                style="color: #512da8; font-weight: 600"
              >
                Ver en el mapa
              </a>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <!-- Mapas (manteniendo tu código original) -->
    <v-row id="mapas" justify="center" align="center" class="mb-6">
      <v-col cols="12" md="5">
        <v-card class="rounded-xl" elevation="5">
          <v-card-title class="font-weight-bold" style="color: #512da8">
            🏟️ Sede Principal Club Menga Sport
          </v-card-title>
          <v-card-text>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3969.4252102767117!2d-76.52843062504334!3d3.6120977963777257!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e30a9b7c63a173b%3A0x89cf29753ccde048!2shttps%3A%2F%2Fmaps.app.goo.gl%2F6ouTh5rTFtP9efow6!5e0!3m2!1ses!2sco!4v1731271300000!5m2!1ses!2sco"
              width="100%"
              height="300"
              style="border: 0; border-radius: 12px"
              allowfullscreen=""
              loading="lazy"
            ></iframe>
            <div class="mt-3 text-center">
              <a
                href="https://maps.app.goo.gl/6ouTh5rTFtP9efow6?g_st=iw"
                target="_blank"
                class="text-decoration-none"
                style="color: #512da8; font-weight: 600"
              >
                👉 Ver en Google Maps
              </a>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="5">
        <v-card class="rounded-xl" elevation="5">
          <v-card-title class="font-weight-bold" style="color: #512da8">
            ⚽ Campo de Entrenamiento
          </v-card-title>
          <v-card-text>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.170240145595!2d-76.49314042504526!3d3.463382296488728!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e30a70a0a2c8f0f%3A0xdcc5f53cf45b5ee8!2shttps%3A%2F%2Fmaps.app.goo.gl%2F91cDWeXcj1po1WCS6!5e0!3m2!1ses!2sco!4v1731271400000!5m2!1ses!2sco"
              width="100%"
              height="300"
              style="border: 0; border-radius: 12px"
              allowfullscreen=""
              loading="lazy"
            ></iframe>
            <div class="mt-3 text-center">
              <a
                href="https://maps.app.goo.gl/91cDWeXcj1po1WCS6?g_st=iw"
                target="_blank"
                class="text-decoration-none"
                style="color: #512da8; font-weight: 600"
              >
                👉 Ver en Google Maps
              </a>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup></script>

<style scoped>
.v-card {
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}
.v-card:hover {
  transform: scale(1.02);
  box-shadow: 0 8px 18px rgba(81, 45, 168, 0.3);
}
.h-100 {
  height: 100%;
}
</style>
