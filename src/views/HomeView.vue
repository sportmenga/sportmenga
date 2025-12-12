<template>
  <v-carousel height="500" cycle hide-delimiter-background show-arrows="hover" interval="5000">
    <v-carousel-item v-for="(foto, index) in fotos" :key="index" :src="foto" cover></v-carousel-item>
  </v-carousel>
  <Catalogo />
  <Informacion />
</template>

<script setup>
import Catalogo from '@/components/Catalogo.vue'
import Informacion from '@/components/Informacion.vue'
import foto1 from '@/assets/foto-341.JPG'
import foto2 from '@/assets/foto-532.JPG'
import foto3 from '@/assets/foto-570.JPG'

const fotos = [foto1, foto2, foto3]
</script>
