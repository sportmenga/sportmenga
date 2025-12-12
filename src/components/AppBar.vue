<template>
  <v-app-bar id="home-app-bar" color="#FFFFFF" height="60" elevation="2" scroll-behavior="elevate">
    <template #prepend>
      <v-img :src="LogoImg" class="mx-3 hidden-xs" width="60" height="60" contain />
      <span class="text-h5 font-weight-bold gradient-text"> Club Menga Sport </span>
    </template>

    <v-spacer />

    <div>
      <v-tabs bg-color="transparent" class="hidden-sm-and-down" align-tabs="center">
        <v-tab
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          :ripple="false"
          class="text-h7 font-weight-bold gradient-text"
        >
          {{ item.title }}
        </v-tab>
      </v-tabs>
    </div>

    <v-app-bar-nav-icon class="hidden-md-and-up text-yellow-darken-1" @click="drawer = !drawer" />
  </v-app-bar>

  <v-navigation-drawer v-model="drawer" temporary color="primary">
    <v-list>
      <v-list-item v-for="(item, i) in items" :key="i" :to="item.to" class="text-yellow-darken-1">
        {{ item.title }}
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { ref } from 'vue'
import LogoImg from '@/assets/logo.svg'

const drawer = ref(false)
const items = [
  { title: 'Inicio', to: { name: 'home' } },
  { title: 'Tienda', to: { name: 'tienda' } },
  { title: 'Inscripción', to: { name: 'inscripcion' } },
  { title: 'Ingreso', to: { name: 'ingreso' } },
  { title: 'Contacto', to: { name: 'prueba' } },
  { title: 'Administracion ', to: { name: 'administracion' } },
]
</script>

<style lang="scss" scoped>
#home-app-bar {
  .v-tabs-slider {
    max-width: 30px;
    margin: 0 auto;
    background-color: #ffd600; /* amarillo del logo */
  }

  .v-tab {
    &::before {
      display: none;
    }

    &:hover {
      color: #fff !important;
    }
  }
}

.glowing-text {
  color: #512da8;
  text-shadow:
    0 0 8px rgba(81, 45, 168, 0.8),
    0 0 16px rgba(81, 45, 168, 0.6);
  transition: text-shadow 0.3s ease;
}

.glowing-text:hover {
  text-shadow:
    0 0 12px rgba(155, 89, 182, 1),
    0 0 24px rgba(155, 89, 182, 0.8);
}

.gradient-text {
  background: linear-gradient(#512da8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: bold;
}
</style>
