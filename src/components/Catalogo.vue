<template>
  <v-container fluid>
    <h1 class="text-center font-weight-bold mt-5" style="color: #512DA8;">
      Catálogo Oficial Club Menga Sport
    </h1>

    <v-slide-group show-arrows class="py-6">
      <v-slide-item v-for="product in products" :key="product.id">
        <v-card
          class="mx-3 product-card"
          elevation="6"
          @click="goToTienda(product.id)"
        >
          <v-img
            :src="product.image"
            height="400px"
            width="400px"
            cover
          ></v-img>
          <v-card-text class="text-center">
            <div class="font-weight-bold">{{ product.name }}</div>
            <div>{{ product.price }}</div>
          </v-card-text>
        </v-card>
      </v-slide-item>
    </v-slide-group>
  </v-container>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const products = [
  { id: '01', name: 'Camisa de padres opción 1', price: '$60.000', image: '/src/assets/01.jpeg' },
  { id: '02', name: 'Uniformes Año 2025', price: '420.000,00 COP', image: '/src/assets/02.jpeg' },
  { id: '03', name: 'Kit Arqueros', price: '305.000,00 COP', image: '/src/assets/03.jpeg' },
  { id: '04', name: 'Uniforme de portero', price: '160.000', image: '/src/assets/04.jpeg' },
  { id: '05', name: 'Uniformes de entreno', price: '110.000', image: '/src/assets/05.jpeg' },
  { id: '06', name: 'Camisa de padres opción 2', price: '60.000', image: '/src/assets/06.jpeg' },
  { id: '07', name: 'Uniforme alterno', price: '140.000', image: '/src/assets/07.jpeg' }
]

function goToTienda(id) {
  router.push({ name: 'tienda', query: { id } })
}
</script>

<style scoped>
.v-slide-group {
  overflow-y: hidden;
}

/* Tarjeta cuadrada con hover */
.product-card {
  width: 400px;
  height: 400px; /* hace la card cuadrada */
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.product-card:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 20px rgba(81, 45, 168, 0.4);
}

/* Responsive: tablets 2 por pantalla, móviles 1 */
@media (max-width: 1024px) {
  .product-card {
    width: 45vw;
    height: 45vw;
  }
}

@media (max-width: 600px) {
  .product-card {
    width: 80vw;
    height: 80vw;
  }
}
</style>
