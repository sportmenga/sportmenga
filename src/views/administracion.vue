<!-- eslint-disable vue/valid-v-slot -->
<template>
  <v-app>
    <v-main>
      <div class="administracion">
        <!-- App Bar -->
        <v-app-bar color="primary" density="comfortable">
          <v-app-bar-title>
            <v-icon icon="mdi-soccer" class="mr-2"></v-icon>
            Administración - Club de Fútbol
          </v-app-bar-title>

          <v-spacer></v-spacer>

          <v-chip variant="outlined" color="white" class="mr-2">
            <v-icon icon="mdi-account" start></v-icon>
            Admin
          </v-chip>

          <v-chip variant="outlined" color="white">
            <v-icon icon="mdi-calendar" start></v-icon>
            {{ fechaActual }}
          </v-chip>
        </v-app-bar>

        <!-- Navegación -->
        <v-container fluid class="pa-0">
          <v-tabs v-model="seccionActiva" color="primary" grow class="elevation-1">
            <v-tab value="pagos" class="text-none">
              <v-icon icon="mdi-cash-multiple" start></v-icon>
              Pagos de Jugadores
            </v-tab>

            <v-tab value="gastos" class="text-none">
              <v-icon icon="mdi-currency-usd" start></v-icon>
              Gastos Diarios
            </v-tab>

            <!-- NUEVA PESTAÑA PARA PAGOS VENCIDOS -->
            <v-tab value="vencidos" class="text-none">
              <v-icon icon="mdi-alert-circle" start></v-icon>
              Pagos Vencidos
              <v-badge
                v-if="totalJugadoresVencidos > 0"
                :content="totalJugadoresVencidos"
                color="error"
                inline
                class="ml-2"
              ></v-badge>
            </v-tab>

            <v-tab value="reportes" class="text-none">
              <v-icon icon="mdi-chart-bar" start></v-icon>
              Reportes
            </v-tab>

            <!-- NUEVA PESTAÑA PARA MATERIALES DE PROFESORES -->
            <v-tab value="materiales-profesores" class="text-none">
              <v-icon icon="mdi-school" start></v-icon>
              Materiales Profesores
              <v-badge
                v-if="totalPendientesMateriales > 0"
                :content="totalPendientesMateriales"
                color="warning"
                inline
                class="ml-2"
              ></v-badge>
            </v-tab>
          </v-tabs>
        </v-container>

        <!-- Loading Overlay -->
        <v-overlay :model-value="loading" class="align-center justify-center" persistent>
          <v-card color="white" class="pa-4 rounded-lg" elevation="8">
            <div class="text-center">
              <v-progress-circular
                color="primary"
                indeterminate
                size="64"
                width="4"
              ></v-progress-circular>
              <div class="text-h6 mt-4 text-primary">Cargando datos...</div>
            </div>
          </v-card>
        </v-overlay>

        <!-- Alert de Error -->
        <v-alert
          v-if="error"
          type="error"
          variant="tonal"
          class="ma-4"
          closable
          @click:close="clearError"
        >
          <v-alert-title>Error</v-alert-title>
          {{ error }}
        </v-alert>

        <!-- Contenido Principal -->
        <v-container fluid class="mt-4">
          <v-window v-model="seccionActiva">
            <!-- SECCIÓN PAGOS -->
            <v-window-item value="pagos">
              <v-row>
                <v-col cols="12">
                  <v-card class="elevation-2">
                    <v-card-title class="d-flex justify-space-between align-center bg-primary">
                      <span class="text-h5 text-white">Gestión de Pagos de Jugadores</span>
                      <div>
                        <v-btn
                          color="white"
                          variant="outlined"
                          @click="cargarPagos"
                          class="mr-2"
                          :loading="loading"
                        >
                          <v-icon icon="mdi-refresh" start></v-icon>
                          Actualizar
                        </v-btn>
                        <v-btn
                          color="white"
                          @click="mostrarFormularioPago = true"
                          :disabled="loading"
                        >
                          <v-icon icon="mdi-plus" start></v-icon>
                          Nuevo Pago
                        </v-btn>
                      </div>
                    </v-card-title>

                    <!-- Filtros -->
                    <v-card-text class="pa-4">
                      <v-row>
                        <v-col cols="12" sm="4">
                          <v-select
                            v-model="filtroMes"
                            :items="meses"
                            label="Filtrar por mes"
                            clearable
                            variant="outlined"
                            @update:model-value="aplicarFiltrosPagos"
                          ></v-select>
                        </v-col>

                        <v-col cols="12" sm="4">
                          <v-select
                            v-model="filtroCategoria"
                            :items="categoriasOptions"
                            label="Filtrar por categoría"
                            clearable
                            variant="outlined"
                            @update:model-value="aplicarFiltrosPagos"
                          ></v-select>
                        </v-col>

                        <v-col cols="12" sm="4">
                          <v-text-field
                            v-model="filtroAnio"
                            label="Filtrar por año"
                            type="number"
                            variant="outlined"
                            @update:model-value="aplicarFiltrosPagos"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-card-text>

                    <!-- Formulario de Pago -->
                    <v-dialog v-model="mostrarFormularioPago" max-width="800px" persistent>
                      <v-card>
                        <v-card-title class="bg-primary text-white">
                          <span class="text-h6">
                            {{ pagoEditando ? 'Editar Pago' : 'Registrar Nuevo Pago' }}
                          </span>
                        </v-card-title>

                        <v-card-text class="pa-6">
                          <v-form @submit.prevent="guardarPago" ref="formPago">
                            <v-row>
                              <v-col cols="12">
                                <v-select
                                  v-model="nuevoPago.player_id"
                                  :items="jugadoresOptions"
                                  label="Jugador *"
                                  variant="outlined"
                                  required
                                  :disabled="!!pagoEditando"
                                  :rules="[(v) => !!v || 'El jugador es requerido']"
                                ></v-select>
                              </v-col>
                            </v-row>

                            <v-row>
                              <v-col cols="12" sm="6">
                                <v-select
                                  v-model="nuevoPago.month"
                                  :items="meses"
                                  label="Mes *"
                                  variant="outlined"
                                  required
                                  :rules="[(v) => !!v || 'El mes es requerido']"
                                ></v-select>
                              </v-col>

                              <v-col cols="12" sm="6">
                                <v-text-field
                                  v-model="nuevoPago.year"
                                  label="Año *"
                                  type="number"
                                  variant="outlined"
                                  required
                                  :rules="[(v) => !!v || 'El año es requerido']"
                                ></v-text-field>
                              </v-col>
                            </v-row>

                            <v-row>
                              <v-col cols="12" sm="6">
                                <v-text-field
                                  v-model="nuevoPago.amount"
                                  label="Monto *"
                                  type="number"
                                  step="0.01"
                                  prefix="$"
                                  variant="outlined"
                                  required
                                  :rules="[(v) => (!!v && v > 0) || 'El monto debe ser mayor a 0']"
                                ></v-text-field>
                              </v-col>

                              <v-col cols="12" sm="6">
                                <v-text-field
                                  v-model="nuevoPago.payment_date"
                                  label="Fecha de Pago *"
                                  type="date"
                                  variant="outlined"
                                  required
                                  :rules="[(v) => !!v || 'La fecha es requerida']"
                                ></v-text-field>
                              </v-col>
                            </v-row>

                            <v-row>
                              <v-col cols="12" sm="6">
                                <v-select
                                  v-model="nuevoPago.payment_method"
                                  :items="metodosPago"
                                  label="Método de Pago *"
                                  variant="outlined"
                                  required
                                  :rules="[(v) => !!v || 'El método de pago es requerido']"
                                ></v-select>
                              </v-col>

                              <v-col cols="12" sm="6">
                                <v-text-field
                                  v-model="nuevoPago.reference"
                                  label="Referencia"
                                  variant="outlined"
                                  placeholder="Número de referencia"
                                ></v-text-field>
                              </v-col>
                            </v-row>

                            <v-row>
                              <v-col cols="12">
                                <v-textarea
                                  v-model="nuevoPago.notes"
                                  label="Notas"
                                  variant="outlined"
                                  rows="3"
                                  placeholder="Notas adicionales..."
                                ></v-textarea>
                              </v-col>
                            </v-row>
                          </v-form>
                        </v-card-text>

                        <v-card-actions class="pa-4">
                          <v-spacer></v-spacer>
                          <v-btn
                            color="grey"
                            variant="text"
                            @click="cancelarPago"
                            :disabled="loading"
                          >
                            Cancelar
                          </v-btn>

                          <v-btn
                            color="primary"
                            @click="guardarPago"
                            :loading="loading"
                            variant="elevated"
                          >
                            <v-icon icon="mdi-content-save" start></v-icon>
                            {{ pagoEditando ? 'Actualizar' : 'Guardar' }} Pago
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-dialog>

                    <!-- Tabla de Pagos -->
                    <v-card-text>
                      <v-data-table
                        :headers="headersPagos"
                        :items="payments"
                        :loading="loading"
                        class="elevation-1"
                      >
                        <template #loading>
                          <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
                        </template>

                        <template #item.player_id="{ item }">
                          {{ obtenerNombreJugador(item.player_id) }}
                        </template>

                        <template #item.amount="{ item }">
                          <v-chip color="green" variant="tonal" size="small">
                            ${{ parseFloat(item.amount || 0).toFixed(2) }}
                          </v-chip>
                        </template>

                        <template #item.payment_date="{ item }">
                          <v-chip variant="outlined" size="small">
                            {{ formatFecha(item.payment_date) }}
                          </v-chip>
                        </template>

                        <template #item.payment_method="{ item }">
                          <v-chip
                            :color="getColorMetodoPago(item.payment_method)"
                            variant="flat"
                            size="small"
                          >
                            {{ obtenerNombreMetodoPago(item.payment_method) }}
                          </v-chip>
                        </template>

                        <template #item.actions="{ item }">
                          <v-btn
                            icon
                            size="small"
                            color="primary"
                            @click="editarPago(item)"
                            variant="text"
                          >
                            <v-icon>mdi-pencil</v-icon>
                          </v-btn>

                          <v-btn
                            icon
                            size="small"
                            color="error"
                            @click="eliminarPago(item.id)"
                            variant="text"
                          >
                            <v-icon>mdi-delete</v-icon>
                          </v-btn>
                        </template>

                        <template #no-data>
                          <v-alert type="info" variant="tonal" class="ma-4">
                            <div class="text-center">
                              <v-icon icon="mdi-information" size="large" class="mb-2"></v-icon>
                              <div>No hay pagos registrados</div>
                              <v-btn
                                color="primary"
                                variant="text"
                                @click="cargarPagos"
                                class="mt-2"
                              >
                                <v-icon icon="mdi-refresh" start></v-icon>
                                Recargar
                              </v-btn>
                            </div>
                          </v-alert>
                        </template>
                      </v-data-table>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-window-item>

            <!-- SECCIÓN GASTOS -->
            <v-window-item value="gastos">
              <v-row>
                <v-col cols="12">
                  <v-card class="elevation-2">
                    <v-card-title class="d-flex justify-space-between align-center bg-secondary">
                      <span class="text-h5 text-white">Gestión de Gastos Diarios</span>
                      <div>
                        <v-btn
                          color="white"
                          variant="outlined"
                          @click="cargarGastos"
                          class="mr-2"
                          :loading="loading"
                        >
                          <v-icon icon="mdi-refresh" start></v-icon>
                          Actualizar
                        </v-btn>
                        <v-btn
                          color="white"
                          @click="mostrarFormularioGasto = true"
                          :disabled="loading"
                        >
                          <v-icon icon="mdi-plus" start></v-icon>
                          Nuevo Gasto
                        </v-btn>
                      </div>
                    </v-card-title>

                    <!-- Filtros Gastos -->
                    <v-card-text class="pa-4">
                      <v-row>
                        <v-col cols="12" sm="4">
                          <v-select
                            v-model="filtroCategoriaGasto"
                            :items="categoriasGastos"
                            label="Filtrar por categoría"
                            clearable
                            variant="outlined"
                            @update:model-value="aplicarFiltrosGastos"
                          ></v-select>
                        </v-col>

                        <v-col cols="12" sm="4">
                          <v-text-field
                            v-model="filtroFechaInicio"
                            label="Fecha inicio"
                            type="date"
                            variant="outlined"
                            @update:model-value="aplicarFiltrosGastos"
                          ></v-text-field>
                        </v-col>

                        <v-col cols="12" sm="4">
                          <v-text-field
                            v-model="filtroFechaFin"
                            label="Fecha fin"
                            type="date"
                            variant="outlined"
                            @update:model-value="aplicarFiltrosGastos"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-card-text>

                    <!-- Formulario de Gasto -->
                    <v-dialog v-model="mostrarFormularioGasto" max-width="800px" persistent>
                      <v-card>
                        <v-card-title class="bg-secondary text-white">
                          <span class="text-h6">
                            {{ gastoEditando ? 'Editar Gasto' : 'Registrar Nuevo Gasto' }}
                          </span>
                        </v-card-title>

                        <v-card-text class="pa-6">
                          <v-form @submit.prevent="guardarGasto" ref="formGasto">
                            <v-row>
                              <v-col cols="12">
                                <v-text-field
                                  v-model="nuevoGasto.description"
                                  label="Descripción *"
                                  variant="outlined"
                                  required
                                  :rules="[(v) => !!v || 'La descripción es requerida']"
                                  placeholder="Descripción del gasto"
                                ></v-text-field>
                              </v-col>
                            </v-row>

                            <v-row>
                              <v-col cols="12" sm="6">
                                <v-select
                                  v-model="nuevoGasto.category"
                                  :items="categoriasGastos"
                                  label="Categoría *"
                                  variant="outlined"
                                  required
                                  :rules="[(v) => !!v || 'La categoría es requerida']"
                                ></v-select>
                              </v-col>

                              <v-col cols="12" sm="6">
                                <v-text-field
                                  v-model="nuevoGasto.amount"
                                  label="Monto *"
                                  type="number"
                                  step="0.01"
                                  prefix="$"
                                  variant="outlined"
                                  required
                                  :rules="[(v) => (!!v && v > 0) || 'El monto debe ser mayor a 0']"
                                ></v-text-field>
                              </v-col>
                            </v-row>

                            <v-row>
                              <v-col cols="12" sm="6">
                                <v-text-field
                                  v-model="nuevoGasto.expense_date"
                                  label="Fecha *"
                                  type="date"
                                  variant="outlined"
                                  required
                                  :rules="[(v) => !!v || 'La fecha es requerida']"
                                ></v-text-field>
                              </v-col>

                              <v-col cols="12" sm="6">
                                <v-select
                                  v-model="nuevoGasto.payment_method"
                                  :items="metodosPagoGasto"
                                  label="Método de Pago"
                                  variant="outlined"
                                ></v-select>
                              </v-col>
                            </v-row>

                            <v-row>
                              <v-col cols="12" sm="6">
                                <v-text-field
                                  v-model="nuevoGasto.receipt_number"
                                  label="Número de Comprobante"
                                  variant="outlined"
                                  placeholder="Número de factura o recibo"
                                ></v-text-field>
                              </v-col>

                              <v-col cols="12" sm="6">
                                <v-text-field
                                  v-model="nuevoGasto.provider"
                                  label="Proveedor"
                                  variant="outlined"
                                  placeholder="Nombre del proveedor"
                                ></v-text-field>
                              </v-col>
                            </v-row>

                            <v-row>
                              <v-col cols="12">
                                <v-textarea
                                  v-model="nuevoGasto.notes"
                                  label="Notas"
                                  variant="outlined"
                                  rows="3"
                                  placeholder="Notas adicionales..."
                                ></v-textarea>
                              </v-col>
                            </v-row>

                            <v-row>
                              <v-col cols="12">
                                <v-text-field
                                  v-model="nuevoGasto.approved_by"
                                  label="Aprobado por"
                                  variant="outlined"
                                  placeholder="Persona que aprueba el gasto"
                                ></v-text-field>
                              </v-col>
                            </v-row>
                          </v-form>
                        </v-card-text>

                        <v-card-actions class="pa-4">
                          <v-spacer></v-spacer>
                          <v-btn
                            color="grey"
                            variant="text"
                            @click="cancelarGasto"
                            :disabled="loading"
                          >
                            Cancelar
                          </v-btn>

                          <v-btn
                            color="secondary"
                            @click="guardarGasto"
                            :loading="loading"
                            variant="elevated"
                          >
                            <v-icon icon="mdi-content-save" start></v-icon>
                            {{ gastoEditando ? 'Actualizar' : 'Guardar' }} Gasto
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-dialog>

                    <!-- Tabla de Gastos -->
                    <v-card-text>
                      <v-data-table
                        :headers="headersGastos"
                        :items="expenses"
                        :loading="loading"
                        class="elevation-1"
                      >
                        <template #loading>
                          <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
                        </template>

                        <template #item.amount="{ item }">
                          <v-chip color="red" variant="tonal" size="small">
                            ${{ parseFloat(item.amount || 0).toFixed(2) }}
                          </v-chip>
                        </template>

                        <template #item.expense_date="{ item }">
                          <v-chip variant="outlined" size="small">
                            {{ formatFecha(item.expense_date) }}
                          </v-chip>
                        </template>

                        <template #item.category="{ item }">
                          <v-chip
                            :color="getColorCategoriaGasto(item.category)"
                            variant="flat"
                            size="small"
                          >
                            {{ obtenerNombreCategoria(item.category) }}
                          </v-chip>
                        </template>

                        <template #item.payment_method="{ item }">
                          <v-chip
                            v-if="item.payment_method"
                            :color="getColorMetodoPago(item.payment_method)"
                            variant="flat"
                            size="small"
                          >
                            {{ obtenerNombreMetodoPago(item.payment_method) }}
                          </v-chip>
                          <span v-else class="text-grey">N/A</span>
                        </template>

                        <template #item.actions="{ item }">
                          <v-btn
                            icon
                            size="small"
                            color="primary"
                            @click="editarGasto(item)"
                            variant="text"
                          >
                            <v-icon>mdi-pencil</v-icon>
                          </v-btn>

                          <v-btn
                            icon
                            size="small"
                            color="error"
                            @click="eliminarGasto(item.id)"
                            variant="text"
                          >
                            <v-icon>mdi-delete</v-icon>
                          </v-btn>
                        </template>

                        <template #no-data>
                          <v-alert type="info" variant="tonal" class="ma-4">
                            <div class="text-center">
                              <v-icon icon="mdi-information" size="large" class="mb-2"></v-icon>
                              <div>No hay gastos registrados</div>
                              <v-btn
                                color="secondary"
                                variant="text"
                                @click="cargarGastos"
                                class="mt-2"
                              >
                                <v-icon icon="mdi-refresh" start></v-icon>
                                Recargar
                              </v-btn>
                            </div>
                          </v-alert>
                        </template>
                      </v-data-table>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-window-item>

            <!-- SECCIÓN PAGOS VENCIDOS -->
            <v-window-item value="vencidos">
              <v-row>
                <v-col cols="12">
                  <v-card class="elevation-2">
                    <v-card-title class="d-flex justify-space-between align-center bg-warning">
                      <span class="text-h5 text-white">Gestión de Pagos Vencidos</span>
                      <div>
                        <v-btn
                          color="white"
                          variant="outlined"
                          @click="cargarPagosVencidos"
                          class="mr-2"
                          :loading="loadingPagosVencidos"
                        >
                          <v-icon icon="mdi-refresh" start></v-icon>
                          Actualizar
                        </v-btn>
                        <v-btn
                          color="white"
                          @click="enviarRecordatorios"
                          :disabled="loadingPagosVencidos || jugadoresVencidos.length === 0"
                          :loading="enviandoRecordatorios"
                        >
                          <v-icon icon="mdi-email-send" start></v-icon>
                          Enviar Recordatorios
                        </v-btn>
                      </div>
                    </v-card-title>

                    <!-- Filtros y Resumen -->
                    <v-card-text class="pa-4">
                      <v-row>
                        <v-col cols="12" sm="6" md="3">
                          <v-card color="red-lighten-5" class="pa-3 text-center">
                            <v-icon color="red" size="32" class="mb-2">mdi-alert</v-icon>
                            <div class="text-h6 text-red">Total Vencidos</div>
                            <div class="text-h4 font-weight-bold text-red">
                              {{ resumenVencidos.total_vencidos || 0 }}
                            </div>
                          </v-card>
                        </v-col>

                        <v-col cols="12" sm="6" md="3">
                          <v-card color="orange-lighten-5" class="pa-3 text-center">
                            <v-icon color="orange" size="32" class="mb-2">mdi-account-group</v-icon>
                            <div class="text-h6 text-orange">Activos</div>
                            <div class="text-h4 font-weight-bold text-orange">
                              {{ resumenVencidos.total_activos || 0 }}
                            </div>
                          </v-card>
                        </v-col>

                        <v-col cols="12" sm="6" md="3">
                          <v-card color="green-lighten-5" class="pa-3 text-center">
                            <v-icon color="green" size="32" class="mb-2">mdi-cash-check</v-icon>
                            <div class="text-h6 text-green">Pagados</div>
                            <div class="text-h4 font-weight-bold text-green">
                              {{ resumenVencidos.total_pagados || 0 }}
                            </div>
                          </v-card>
                        </v-col>

                        <v-col cols="12" sm="6" md="3">
                          <v-card color="blue-lighten-5" class="pa-3 text-center">
                            <v-icon color="blue" size="32" class="mb-2">mdi-percent</v-icon>
                            <div class="text-h6 text-blue">Tasa de Pago</div>
                            <div class="text-h4 font-weight-bold text-blue">
                              {{ (resumenVencidos.tasa_pago || 0).toFixed(1) }}%
                            </div>
                          </v-card>
                        </v-col>
                      </v-row>

                      <!-- Filtros -->
                      <v-row class="mt-4">
                        <v-col cols="12" sm="4">
                          <v-select
                            v-model="filtroCategoriaVencidos"
                            :items="categoriasOptions"
                            label="Filtrar por categoría"
                            clearable
                            variant="outlined"
                            @update:model-value="aplicarFiltrosVencidos"
                          ></v-select>
                        </v-col>

                        <v-col cols="12" sm="4">
                          <v-text-field
                            v-model="filtroNombreVencidos"
                            label="Buscar por nombre"
                            variant="outlined"
                            placeholder="Nombre del jugador..."
                            @input="aplicarFiltrosVencidos"
                          ></v-text-field>
                        </v-col>

                        <v-col cols="12" sm="4">
                          <v-select
                            v-model="filtroDiasVencidos"
                            :items="opcionesDiasVencidos"
                            label="Días de vencimiento"
                            clearable
                            variant="outlined"
                            @update:model-value="aplicarFiltrosVencidos"
                          ></v-select>
                        </v-col>
                      </v-row>
                    </v-card-text>

                    <!-- Tabla de Jugadores Vencidos -->
                    <v-card-text>
                      <v-data-table
                        :headers="headersVencidos"
                        :items="jugadoresVencidosFiltrados"
                        :loading="loadingPagosVencidos"
                        class="elevation-1"
                      >
                        <template #loading>
                          <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
                        </template>

                        <template #item.name="{ item }">
                          <div class="d-flex align-center">
                            <v-avatar size="32" color="grey-lighten-2" class="mr-3">
                              <v-icon icon="mdi-account"></v-icon>
                            </v-avatar>
                            <div>
                              <div class="font-weight-medium">{{ item.name }}</div>
                              <div class="text-caption text-grey">Cat. {{ item.category }}</div>
                            </div>
                          </div>
                        </template>

                        <template #item.guardianInfo="{ item }">
                          <div>
                            <div class="font-weight-medium">{{ item.guardianName }}</div>
                            <div class="text-caption text-grey">{{ item.guardianPhone }}</div>
                            <div class="text-caption text-blue">{{ item.guardianEmail }}</div>
                          </div>
                        </template>

                        <template #item.overduePeriod="{ item }">
                          <v-chip color="red" variant="tonal" size="small">
                            {{ item.overduePeriod }}
                          </v-chip>
                        </template>

                        <template #item.daysOverdue="{ item }">
                          <v-chip
                            :color="getColorDiasVencidos(item.daysOverdue)"
                            variant="flat"
                            size="small"
                          >
                            {{ item.daysOverdue }} días
                          </v-chip>
                        </template>

                        <template #item.actions="{ item }">
                          <div class="d-flex">
                            <v-btn
                              icon
                              size="small"
                              color="primary"
                              @click="registrarPagoRapido(item)"
                              variant="text"
                              title="Registrar pago"
                            >
                              <v-icon>mdi-cash-plus</v-icon>
                            </v-btn>

                            <v-btn
                              icon
                              size="small"
                              color="green"
                              @click="enviarRecordatorioIndividual(item)"
                              variant="text"
                              title="Enviar recordatorio"
                            >
                              <v-icon>mdi-email</v-icon>
                            </v-btn>

                            <v-btn
                              icon
                              size="small"
                              color="orange"
                              @click="verDetallesJugador(item)"
                              variant="text"
                              title="Ver detalles"
                            >
                              <v-icon>mdi-eye</v-icon>
                            </v-btn>
                          </div>
                        </template>

                        <template #no-data>
                          <v-alert type="success" variant="tonal" class="ma-4">
                            <div class="text-center">
                              <v-icon icon="mdi-check-circle" size="large" class="mb-2"></v-icon>
                              <div>¡Excelente! No hay pagos vencidos</div>
                              <div class="text-caption text-grey mt-2">
                                Todos los jugadores están al día con sus pagos
                              </div>
                            </div>
                          </v-alert>
                        </template>
                      </v-data-table>
                    </v-card-text>

                    <!-- Resumen por Categoría -->
                    <v-card-text v-if="resumenPorCategoria.length > 0">
                      <v-card class="mt-4">
                        <v-card-title class="bg-grey-lighten-3">
                          <v-icon icon="mdi-chart-pie" class="mr-2"></v-icon>
                          Resumen de Morosidad por Categoría
                        </v-card-title>
                        <v-card-text>
                          <v-row>
                            <v-col
                              v-for="categoria in resumenPorCategoria"
                              :key="categoria.category"
                              cols="12"
                              sm="6"
                              md="4"
                            >
                              <v-card variant="outlined" class="pa-3">
                                <div class="d-flex justify-space-between align-center mb-2">
                                  <span class="font-weight-bold text-h6">
                                    Cat. {{ categoria.category }}
                                  </span>
                                  <v-chip
                                    :color="getColorEstadoCategoria(categoria.payment_rate)"
                                    size="small"
                                  >
                                    {{ categoria.payment_rate.toFixed(1) }}%
                                  </v-chip>
                                </div>
                                <v-progress-linear
                                  :model-value="categoria.payment_rate"
                                  height="12"
                                  :color="getColorEstadoCategoria(categoria.payment_rate)"
                                  rounded
                                  class="mb-2"
                                ></v-progress-linear>
                                <div class="d-flex justify-space-between text-caption text-grey">
                                  <span
                                    >{{ categoria.paid_players }}/{{
                                      categoria.total_players
                                    }}
                                    pagados</span
                                  >
                                  <span>{{ categoria.overdue_players }} vencidos</span>
                                </div>
                              </v-card>
                            </v-col>
                          </v-row>
                        </v-card-text>
                      </v-card>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>

              <!-- Dialog para registro rápido de pago -->
              <v-dialog v-model="mostrarDialogPagoRapido" max-width="500px">
                <v-card>
                  <v-card-title class="bg-primary text-white">
                    <span class="text-h6">Registrar Pago Rápido</span>
                  </v-card-title>

                  <v-card-text class="pa-4">
                    <div v-if="jugadorSeleccionado" class="mb-4">
                      <v-alert type="info" variant="tonal">
                        <div class="font-weight-bold">{{ jugadorSeleccionado.name }}</div>
                        <div class="text-caption">
                          Categoría: {{ jugadorSeleccionado.category }}
                        </div>
                        <div class="text-caption">
                          Acudiente: {{ jugadorSeleccionado.guardianName }}
                        </div>
                      </v-alert>
                    </div>

                    <v-form @submit.prevent="confirmarPagoRapido" ref="formPagoRapido">
                      <v-row>
                        <v-col cols="12" sm="6">
                          <v-select
                            v-model="pagoRapido.month"
                            :items="meses"
                            label="Mes *"
                            variant="outlined"
                            required
                            :rules="[(v) => !!v || 'El mes es requerido']"
                          ></v-select>
                        </v-col>

                        <v-col cols="12" sm="6">
                          <v-text-field
                            v-model="pagoRapido.year"
                            label="Año *"
                            type="number"
                            variant="outlined"
                            required
                            :rules="[(v) => !!v || 'El año es requerido']"
                          ></v-text-field>
                        </v-col>
                      </v-row>

                      <v-row>
                        <v-col cols="12" sm="6">
                          <v-text-field
                            v-model="pagoRapido.amount"
                            label="Monto *"
                            type="number"
                            step="0.01"
                            prefix="$"
                            variant="outlined"
                            required
                            :rules="[(v) => (!!v && v > 0) || 'El monto debe ser mayor a 0']"
                          ></v-text-field>
                        </v-col>

                        <v-col cols="12" sm="6">
                          <v-text-field
                            v-model="pagoRapido.payment_date"
                            label="Fecha de Pago *"
                            type="date"
                            variant="outlined"
                            required
                            :rules="[(v) => !!v || 'La fecha es requerida']"
                          ></v-text-field>
                        </v-col>
                      </v-row>

                      <v-row>
                        <v-col cols="12">
                          <v-select
                            v-model="pagoRapido.payment_method"
                            :items="metodosPago"
                            label="Método de Pago *"
                            variant="outlined"
                            required
                            :rules="[(v) => !!v || 'El método de pago es requerido']"
                          ></v-select>
                        </v-col>
                      </v-row>
                    </v-form>
                  </v-card-text>

                  <v-card-actions class="pa-4">
                    <v-spacer></v-spacer>
                    <v-btn color="grey" variant="text" @click="mostrarDialogPagoRapido = false">
                      Cancelar
                    </v-btn>
                    <v-btn
                      color="primary"
                      @click="confirmarPagoRapido"
                      :loading="loading"
                      variant="elevated"
                    >
                      <v-icon icon="mdi-cash-check" start></v-icon>
                      Registrar Pago
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-window-item>

            <!-- SECCIÓN REPORTES -->
            <v-window-item value="reportes">
              <v-row>
                <v-col cols="12">
                  <v-card class="elevation-2">
                    <v-card-title class="d-flex justify-space-between align-center bg-success">
                      <span class="text-h5 text-white">Reportes Financieros</span>
                      <div class="d-flex align-center flex-wrap">
                        <!-- Selector de Tipo de Período -->
                        <v-select
                          v-model="reporteTipo"
                          :items="tiposReporte"
                          label="Tipo de Reporte"
                          variant="outlined"
                          style="max-width: 200px"
                          class="mr-2 mb-2"
                          density="compact"
                        ></v-select>

                        <!-- Selectores dinámicos según el tipo -->
                        <template v-if="reporteTipo === 'diario'">
                          <v-text-field
                            v-model="reporteFecha"
                            label="Fecha"
                            type="date"
                            variant="outlined"
                            style="max-width: 180px"
                            class="mr-2 mb-2"
                            density="compact"
                          ></v-text-field>
                        </template>

                        <template v-if="reporteTipo === 'mensual'">
                          <v-select
                            v-model="reporteMes"
                            :items="meses"
                            label="Mes"
                            variant="outlined"
                            style="max-width: 150px"
                            class="mr-2 mb-2"
                            density="compact"
                          ></v-select>
                          <v-text-field
                            v-model="reporteAnio"
                            label="Año"
                            type="number"
                            variant="outlined"
                            style="max-width: 120px"
                            class="mr-2 mb-2"
                            density="compact"
                          ></v-text-field>
                        </template>

                        <template v-if="reporteTipo === 'semestral'">
                          <v-select
                            v-model="reporteSemestre"
                            :items="semestres"
                            label="Semestre"
                            variant="outlined"
                            style="max-width: 150px"
                            class="mr-2 mb-2"
                            density="compact"
                          ></v-select>
                          <v-text-field
                            v-model="reporteAnio"
                            label="Año"
                            type="number"
                            variant="outlined"
                            style="max-width: 120px"
                            class="mr-2 mb-2"
                            density="compact"
                          ></v-text-field>
                        </template>

                        <template v-if="reporteTipo === 'anual'">
                          <v-text-field
                            v-model="reporteAnio"
                            label="Año"
                            type="number"
                            variant="outlined"
                            style="max-width: 120px"
                            class="mr-2 mb-2"
                            density="compact"
                          ></v-text-field>
                        </template>

                        <v-btn
                          color="white"
                          variant="outlined"
                          @click="cargarReportes"
                          :loading="loadingReportes"
                          class="mr-2 mb-2"
                        >
                          <v-icon icon="mdi-refresh" start></v-icon>
                          Actualizar
                        </v-btn>

                        <v-btn
                          color="white"
                          variant="outlined"
                          @click="cargarReporteComparativo"
                          :loading="loadingReportes"
                          class="mb-2"
                          v-if="reporteTipo !== 'diario'"
                        >
                          <v-icon icon="mdi-chart-line" start></v-icon>
                          Comparativo
                        </v-btn>
                      </div>
                    </v-card-title>

                    <v-card-text class="pa-4">
                      <!-- Información del Período -->
                      <v-alert v-if="reporteData.period" type="info" variant="tonal" class="mb-4">
                        <v-alert-title>Información del Período</v-alert-title>
                        <div><strong>Tipo:</strong> {{ reporteData.period.type }}</div>
                        <div>
                          <strong>Rango de fechas:</strong>
                          {{ formatFecha(reporteData.period.date_range.start_date) }} -
                          {{ formatFecha(reporteData.period.date_range.end_date) }}
                        </div>
                      </v-alert>

                      <!-- Resumen Financiero -->
                      <v-row class="mb-6">
                        <v-col cols="12" sm="4">
                          <v-card color="green-lighten-5" class="pa-4 text-center">
                            <v-icon color="green" size="48" class="mb-2">mdi-cash-plus</v-icon>
                            <div class="text-h6 text-green">Ingresos</div>
                            <div class="text-h4 font-weight-bold text-green">
                              ${{ (parseFloat(reporteData.income?.total_amount) || 0).toFixed(2) }}
                            </div>
                            <div class="text-caption text-grey">
                              {{ reporteData.period?.name || 'Período actual' }}
                            </div>
                          </v-card>
                        </v-col>

                        <v-col cols="12" sm="4">
                          <v-card color="red-lighten-5" class="pa-4 text-center">
                            <v-icon color="red" size="48" class="mb-2">mdi-cash-minus</v-icon>
                            <div class="text-h6 text-red">Gastos</div>
                            <div class="text-h4 font-weight-bold text-red">
                              ${{
                                (parseFloat(reporteData.expenses?.total_amount) || 0).toFixed(2)
                              }}
                            </div>
                            <div class="text-caption text-grey">
                              {{ reporteData.period?.name || 'Período actual' }}
                            </div>
                          </v-card>
                        </v-col>

                        <v-col cols="12" sm="4">
                          <v-card :color="balanceColor" class="pa-4 text-center">
                            <v-icon :color="balanceIconColor" size="48" class="mb-2">
                              {{ balanceIcon }}
                            </v-icon>
                            <div class="text-h6" :class="balanceTextColor">Balance</div>
                            <div class="text-h4 font-weight-bold" :class="balanceTextColor">
                              ${{ (parseFloat(reporteData.balance) || 0).toFixed(2) }}
                            </div>
                            <div class="text-caption text-grey">
                              {{ reporteData.period?.name || 'Período actual' }}
                            </div>
                          </v-card>
                        </v-col>
                      </v-row>

                      <!-- Estadísticas Rápidas -->
                      <v-row class="mb-4">
                        <v-col cols="12" sm="3">
                          <v-card class="pa-3 text-center" variant="outlined">
                            <div class="text-h6 text-blue">Pagos</div>
                            <div class="text-h5 font-weight-bold text-blue">
                              {{ reporteData.statistics?.payments_count || 0 }}
                            </div>
                            <div class="text-caption text-grey">Total registrados</div>
                          </v-card>
                        </v-col>
                        <v-col cols="12" sm="3">
                          <v-card class="pa-3 text-center" variant="outlined">
                            <div class="text-h6 text-orange">Gastos</div>
                            <div class="text-h5 font-weight-bold text-orange">
                              {{ reporteData.statistics?.expenses_count || 0 }}
                            </div>
                            <div class="text-caption text-grey">Total registrados</div>
                          </v-card>
                        </v-col>
                        <v-col cols="12" sm="3">
                          <v-card class="pa-3 text-center" variant="outlined">
                            <div class="text-h6 text-green">Prom. Pago</div>
                            <div class="text-h5 font-weight-bold text-green">
                              ${{
                                (parseFloat(reporteData.statistics?.average_payment) || 0).toFixed(
                                  2,
                                )
                              }}
                            </div>
                            <div class="text-caption text-grey">Por transacción</div>
                          </v-card>
                        </v-col>
                        <v-col cols="12" sm="3">
                          <v-card class="pa-3 text-center" variant="outlined">
                            <div class="text-h6 text-red">Prom. Gasto</div>
                            <div class="text-h5 font-weight-bold text-red">
                              ${{
                                (parseFloat(reporteData.statistics?.average_expense) || 0).toFixed(
                                  2,
                                )
                              }}
                            </div>
                            <div class="text-caption text-grey">Por transacción</div>
                          </v-card>
                        </v-col>
                      </v-row>

                      <!-- Gráficos -->
                      <v-row>
                        <v-col cols="12" md="6">
                          <v-card class="pa-4">
                            <v-card-title class="text-h6">
                              <v-icon icon="mdi-chart-pie" class="mr-2"></v-icon>
                              Distribución de Gastos
                            </v-card-title>
                            <v-card-text>
                              <div
                                v-if="categoriasGastosReporte.length > 0"
                                class="grafico-categorias"
                              >
                                <div
                                  v-for="categoria in categoriasGastosReporte"
                                  :key="categoria.category"
                                  class="categoria-item mb-3"
                                >
                                  <div class="d-flex justify-space-between align-center mb-1">
                                    <span class="font-weight-medium">
                                      {{ obtenerNombreCategoria(categoria.category) }}
                                    </span>
                                    <span class="text-caption text-grey">
                                      ${{ parseFloat(categoria.total || 0).toFixed(2) }}
                                    </span>
                                  </div>
                                  <v-progress-linear
                                    :model-value="
                                      calcularPorcentaje(parseFloat(categoria.total || 0))
                                    "
                                    height="8"
                                    :color="getColorCategoriaGasto(categoria.category)"
                                    rounded
                                  ></v-progress-linear>
                                  <div class="text-caption text-right text-grey mt-1">
                                    {{
                                      calcularPorcentaje(parseFloat(categoria.total || 0)).toFixed(
                                        1,
                                      )
                                    }}%
                                  </div>
                                </div>
                              </div>
                              <v-alert v-else type="info" variant="tonal">
                                No hay datos de gastos para mostrar
                              </v-alert>
                            </v-card-text>
                          </v-card>
                        </v-col>

                        <v-col cols="12" md="6">
                          <v-card class="pa-4">
                            <v-card-title class="text-h6">
                              <v-icon icon="mdi-chart-bar" class="mr-2"></v-icon>
                              Resumen por Categoría
                            </v-card-title>
                            <v-card-text>
                              <v-simple-table>
                                <thead>
                                  <tr>
                                    <th>Categoría</th>
                                    <th class="text-right">Monto</th>
                                    <th class="text-right">Porcentaje</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr
                                    v-for="categoria in categoriasGastosReporte"
                                    :key="categoria.category"
                                  >
                                    <td>
                                      <v-chip
                                        :color="getColorCategoriaGasto(categoria.category)"
                                        size="small"
                                      >
                                        {{ obtenerNombreCategoria(categoria.category) }}
                                      </v-chip>
                                    </td>
                                    <td class="text-right font-weight-bold">
                                      ${{ parseFloat(categoria.total || 0).toFixed(2) }}
                                    </td>
                                    <td class="text-right text-grey">
                                      {{
                                        calcularPorcentaje(
                                          parseFloat(categoria.total || 0),
                                        ).toFixed(1)
                                      }}%
                                    </td>
                                  </tr>
                                </tbody>
                              </v-simple-table>
                            </v-card-text>
                          </v-card>
                        </v-col>
                      </v-row>

                      <!-- Reporte Comparativo -->
                      <v-card v-if="reporteComparativo.length > 0" class="mt-6">
                        <v-card-title class="bg-blue-darken-2 text-white">
                          <v-icon icon="mdi-chart-line" class="mr-2"></v-icon>
                          Reporte Comparativo - {{ reporteComparativoTipo }}
                        </v-card-title>
                        <v-card-text class="pa-4">
                          <v-data-table
                            :headers="headersComparativo"
                            :items="reporteComparativo"
                            class="elevation-1"
                          >
                            <template #item.period="{ item }">
                              <strong>{{ item.period }}</strong>
                            </template>
                            <template #item.income="{ item }">
                              <v-chip color="green" variant="tonal">
                                ${{ parseFloat(item.income || 0).toFixed(2) }}
                              </v-chip>
                            </template>
                            <template #item.expenses="{ item }">
                              <v-chip color="red" variant="tonal">
                                ${{ parseFloat(item.expenses || 0).toFixed(2) }}
                              </v-chip>
                            </template>
                            <template #item.balance="{ item }">
                              <v-chip
                                :color="parseFloat(item.balance || 0) >= 0 ? 'green' : 'red'"
                                variant="flat"
                              >
                                ${{ parseFloat(item.balance || 0).toFixed(2) }}
                              </v-chip>
                            </template>
                          </v-data-table>
                        </v-card-text>
                      </v-card>

                      <!-- Información Adicional -->
                      <v-row class="mt-4">
                        <v-col cols="12">
                          <v-card class="pa-4" variant="outlined">
                            <v-card-title class="text-h6">
                              <v-icon icon="mdi-information" class="mr-2"></v-icon>
                              Resumen del Período
                            </v-card-title>
                            <v-card-text>
                              <v-row>
                                <v-col cols="12" sm="6" md="3">
                                  <div class="text-center pa-3">
                                    <v-icon color="blue" size="40" class="mb-2"
                                      >mdi-account-group</v-icon
                                    >
                                    <div class="text-h6">{{ payments.length }}</div>
                                    <div class="text-caption text-grey">Total Pagos</div>
                                  </div>
                                </v-col>
                                <v-col cols="12" sm="6" md="3">
                                  <div class="text-center pa-3">
                                    <v-icon color="orange" size="40" class="mb-2"
                                      >mdi-receipt</v-icon
                                    >
                                    <div class="text-h6">{{ expenses.length }}</div>
                                    <div class="text-caption text-grey">Total Gastos</div>
                                  </div>
                                </v-col>
                                <v-col cols="12" sm="6" md="3">
                                  <div class="text-center pa-3">
                                    <v-icon color="green" size="40" class="mb-2"
                                      >mdi-trending-up</v-icon
                                    >
                                    <div class="text-h6">{{ promedioPago.toFixed(2) }}</div>
                                    <div class="text-caption text-grey">Promedio por Pago</div>
                                  </div>
                                </v-col>
                                <v-col cols="12" sm="6" md="3">
                                  <div class="text-center pa-3">
                                    <v-icon color="red" size="40" class="mb-2"
                                      >mdi-trending-down</v-icon
                                    >
                                    <div class="text-h6">{{ promedioGasto.toFixed(2) }}</div>
                                    <div class="text-caption text-grey">Promedio por Gasto</div>
                                  </div>
                                </v-col>
                              </v-row>
                            </v-card-text>
                          </v-card>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-window-item>

            <!-- NUEVA SECCIÓN: MATERIALES PROFESORES -->
            <v-window-item value="materiales-profesores">
              <v-row>
                <v-col cols="12">
                  <v-card class="elevation-2">
                    <v-card-title class="d-flex justify-space-between align-center bg-indigo">
                      <span class="text-h5 text-white">Gestión de Materiales para Profesores</span>
                      <div>
                        <v-btn
                          color="white"
                          variant="outlined"
                          @click="cargarTeacherMaterials"
                          class="mr-2"
                          :loading="loadingMaterials"
                        >
                          <v-icon icon="mdi-refresh" start></v-icon>
                          Actualizar
                        </v-btn>
                        <v-btn
                          color="white"
                          @click="mostrarFormularioMaterial = true"
                          :disabled="loadingMaterials"
                        >
                          <v-icon icon="mdi-plus" start></v-icon>
                          Nuevo Material
                        </v-btn>
                      </div>
                    </v-card-title>

                    <!-- Filtros -->
                    <v-card-text class="pa-4">
                      <v-row>
                        <v-col cols="12" sm="4">
                          <v-text-field
                            v-model="filtroNombreProfesor"
                            label="Buscar por profesor"
                            variant="outlined"
                            placeholder="Nombre del profesor..."
                            @input="aplicarFiltrosMateriales"
                            clearable
                          >
                            <template #append-inner>
                              <v-icon icon="mdi-magnify"></v-icon>
                            </template>
                          </v-text-field>
                        </v-col>

                        <v-col cols="12" sm="3">
                          <v-select
                            v-model="filtroStatusMaterial"
                            :items="estadosMateriales"
                            label="Estado"
                            clearable
                            variant="outlined"
                            @update:model-value="aplicarFiltrosMateriales"
                          ></v-select>
                        </v-col>

                        <v-col cols="12" sm="5">
                          <v-row>
                            <v-col cols="6">
                              <v-text-field
                                v-model="filtroFechaInicioMaterial"
                                label="Desde"
                                type="date"
                                variant="outlined"
                                @update:model-value="aplicarFiltrosMateriales"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="6">
                              <v-text-field
                                v-model="filtroFechaFinMaterial"
                                label="Hasta"
                                type="date"
                                variant="outlined"
                                @update:model-value="aplicarFiltrosMateriales"
                              ></v-text-field>
                            </v-col>
                          </v-row>
                        </v-col>
                      </v-row>

                      <!-- Estadísticas rápidas -->
                      <v-row class="mt-2">
                        <v-col cols="12" sm="3">
                          <v-card
                            color="blue-lighten-5"
                            class="pa-3 text-center"
                            variant="outlined"
                          >
                            <div class="text-h6 text-blue">Total Registros</div>
                            <div class="text-h4 font-weight-bold text-blue">
                              {{ teacherMaterials.length }}
                            </div>
                          </v-card>
                        </v-col>
                        <v-col cols="12" sm="3">
                          <v-card
                            color="green-lighten-5"
                            class="pa-3 text-center"
                            variant="outlined"
                          >
                            <div class="text-h6 text-green">Entregados</div>
                            <div class="text-h4 font-weight-bold text-green">
                              {{ materialesEntregados }}
                            </div>
                          </v-card>
                        </v-col>
                        <v-col cols="12" sm="3">
                          <v-card
                            color="orange-lighten-5"
                            class="pa-3 text-center"
                            variant="outlined"
                          >
                            <div class="text-h6 text-orange">Devueltos</div>
                            <div class="text-h4 font-weight-bold text-orange">
                              {{ materialesDevueltos }}
                            </div>
                          </v-card>
                        </v-col>
                        <v-col cols="12" sm="3">
                          <v-card color="red-lighten-5" class="pa-3 text-center" variant="outlined">
                            <div class="text-h6 text-red">Perdidos</div>
                            <div class="text-h4 font-weight-bold text-red">
                              {{ materialesPerdidos }}
                            </div>
                          </v-card>
                        </v-col>
                      </v-row>
                    </v-card-text>

                    <!-- Formulario de Material -->
                    <v-dialog v-model="mostrarFormularioMaterial" max-width="800px" persistent>
                      <v-card>
                        <v-card-title class="bg-indigo text-white">
                          <span class="text-h6">
                            {{
                              materialEditando ? 'Editar Material' : 'Registrar Material Entregado'
                            }}
                          </span>
                        </v-card-title>

                        <v-card-text class="pa-6">
                          <v-form @submit.prevent="guardarMaterial" ref="formMaterial">
                            <v-row>
                              <v-col cols="12">
                                <v-text-field
                                  v-model="nuevoMaterial.teacherName"
                                  label="Nombre del Profesor *"
                                  variant="outlined"
                                  required
                                  :rules="[(v) => !!v || 'El nombre del profesor es requerido']"
                                  placeholder="Nombre completo del profesor"
                                ></v-text-field>
                              </v-col>
                            </v-row>

                            <v-row>
                              <v-col cols="12">
                                <v-textarea
                                  v-model="nuevoMaterial.materials"
                                  label="Materiales Entregados *"
                                  variant="outlined"
                                  required
                                  :rules="[(v) => !!v || 'Los materiales son requeridos']"
                                  rows="3"
                                  placeholder="Ej: 5 balones de fútbol, 10 conos, 2 silbatos, etc."
                                ></v-textarea>
                              </v-col>
                            </v-row>

                            <v-row>
                              <v-col cols="12" sm="6">
                                <v-text-field
                                  v-model="nuevoMaterial.deliveryDate"
                                  label="Fecha de Entrega *"
                                  type="date"
                                  variant="outlined"
                                  required
                                  :rules="[(v) => !!v || 'La fecha de entrega es requerida']"
                                ></v-text-field>
                              </v-col>

                              <v-col cols="12" sm="6">
                                <v-text-field
                                  v-model="nuevoMaterial.quantity"
                                  label="Cantidad Total"
                                  type="number"
                                  variant="outlined"
                                  hint="Número total de items entregados"
                                  persistent-hint
                                ></v-text-field>
                              </v-col>
                            </v-row>

                            <v-row>
                              <v-col cols="12" sm="6">
                                <v-select
                                  v-model="nuevoMaterial.status"
                                  :items="estadosMateriales"
                                  label="Estado *"
                                  variant="outlined"
                                  required
                                  :rules="[(v) => !!v || 'El estado es requerido']"
                                ></v-select>
                              </v-col>

                              <v-col cols="12" sm="6">
                                <v-text-field
                                  v-model="nuevoMaterial.deliveryPerson"
                                  label="Entregado por"
                                  variant="outlined"
                                  placeholder="Persona que realizó la entrega"
                                ></v-text-field>
                              </v-col>
                            </v-row>

                            <v-row v-if="nuevoMaterial.status === 'devuelto'">
                              <v-col cols="12" sm="6">
                                <v-text-field
                                  v-model="nuevoMaterial.returnDate"
                                  label="Fecha de Devolución"
                                  type="date"
                                  variant="outlined"
                                ></v-text-field>
                              </v-col>
                            </v-row>

                            <v-row>
                              <v-col cols="12">
                                <v-textarea
                                  v-model="nuevoMaterial.notes"
                                  label="Observaciones"
                                  variant="outlined"
                                  rows="2"
                                  placeholder="Notas adicionales sobre la entrega..."
                                ></v-textarea>
                              </v-col>
                            </v-row>
                          </v-form>
                        </v-card-text>

                        <v-card-actions class="pa-4">
                          <v-spacer></v-spacer>
                          <v-btn
                            color="grey"
                            variant="text"
                            @click="cancelarMaterial"
                            :disabled="loadingMaterials"
                          >
                            Cancelar
                          </v-btn>

                          <v-btn
                            color="indigo"
                            @click="guardarMaterial"
                            :loading="loadingMaterials"
                            variant="elevated"
                          >
                            <v-icon icon="mdi-content-save" start></v-icon>
                            {{ materialEditando ? 'Actualizar' : 'Guardar' }}
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-dialog>

                    <!-- Tabla de Materiales -->
                    <v-card-text>
                      <v-data-table
                        :headers="headersMateriales"
                        :items="teacherMaterialsFiltrados"
                        :loading="loadingMaterials"
                        :items-per-page="10"
                        class="elevation-1"
                      >
                        <template #loading>
                          <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
                        </template>

                        <template #item.teacherName="{ item }">
                          <div class="d-flex align-center">
                            <v-avatar size="32" color="indigo-lighten-5" class="mr-3">
                              <v-icon icon="mdi-account-tie" color="indigo"></v-icon>
                            </v-avatar>
                            <div>
                              <div class="font-weight-medium">{{ item.teacherName }}</div>
                              <div class="text-caption text-grey">
                                Entregado por: {{ item.deliveryPerson || 'N/A' }}
                              </div>
                            </div>
                          </div>
                        </template>

                        <template #item.materials="{ item }">
                          <div class="materiales-lista">
                            {{ item.materials }}
                            <div v-if="item.quantity" class="text-caption text-blue mt-1">
                              <v-icon icon="mdi-numeric" size="small"></v-icon>
                              {{ item.quantity }} unidades
                            </div>
                          </div>
                        </template>

                        <template #item.deliveryDate="{ item }">
                          <v-chip variant="outlined" size="small" color="blue">
                            {{ formatFecha(item.deliveryDate) }}
                          </v-chip>
                        </template>

                        <template #item.returnDate="{ item }">
                          <v-chip
                            v-if="item.returnDate"
                            variant="outlined"
                            size="small"
                            color="green"
                          >
                            {{ formatFecha(item.returnDate) }}
                          </v-chip>
                          <span v-else class="text-grey text-caption">No devuelto</span>
                        </template>

                        <template #item.status="{ item }">
                          <v-chip
                            :color="getColorEstadoMaterial(item.status)"
                            variant="flat"
                            size="small"
                            :prepend-icon="getIconEstadoMaterial(item.status)"
                          >
                            {{ obtenerNombreEstado(item.status) }}
                          </v-chip>
                        </template>

                        <template #item.actions="{ item }">
                          <div class="d-flex">
                            <v-btn
                              icon
                              size="small"
                              color="primary"
                              @click="editarMaterial(item)"
                              variant="text"
                              title="Editar"
                            >
                              <v-icon>mdi-pencil</v-icon>
                            </v-btn>

                            <v-btn
                              v-if="item.status !== 'devuelto'"
                              icon
                              size="small"
                              color="green"
                              @click="marcarComoDevuelto(item)"
                              variant="text"
                              title="Marcar como devuelto"
                            >
                              <v-icon>mdi-check-circle</v-icon>
                            </v-btn>

                            <v-btn
                              icon
                              size="small"
                              color="error"
                              @click="eliminarMaterial(item.id)"
                              variant="text"
                              title="Eliminar"
                            >
                              <v-icon>mdi-delete</v-icon>
                            </v-btn>
                          </div>
                        </template>

                        <template #no-data>
                          <v-alert type="info" variant="tonal" class="ma-4">
                            <div class="text-center">
                              <v-icon icon="mdi-school-outline" size="large" class="mb-2"></v-icon>
                              <div>No hay materiales registrados</div>
                              <v-btn
                                color="indigo"
                                variant="text"
                                @click="mostrarFormularioMaterial = true"
                                class="mt-2"
                              >
                                <v-icon icon="mdi-plus" start></v-icon>
                                Registrar primer material
                              </v-btn>
                            </div>
                          </v-alert>
                        </template>
                      </v-data-table>
                    </v-card-text>

                    <!-- Reporte por profesor -->
                    <v-card-text v-if="materialesAgrupados.length > 0">
                      <v-expansion-panels class="mt-4">
                        <v-expansion-panel>
                          <v-expansion-panel-title>
                            <v-icon icon="mdi-chart-bar" class="mr-2"></v-icon>
                            Resumen por Profesor
                          </v-expansion-panel-title>
                          <v-expansion-panel-text>
                            <v-row>
                              <v-col
                                v-for="profesor in materialesAgrupados"
                                :key="profesor.teacherName"
                                cols="12"
                                sm="6"
                                md="4"
                              >
                                <v-card variant="outlined" class="pa-3">
                                  <div class="d-flex align-center mb-2">
                                    <v-avatar size="40" color="indigo-lighten-5" class="mr-3">
                                      <v-icon icon="mdi-account-tie" color="indigo"></v-icon>
                                    </v-avatar>
                                    <div>
                                      <div class="font-weight-bold">{{ profesor.teacherName }}</div>
                                      <div class="text-caption text-grey">
                                        {{ profesor.count }} entregas
                                      </div>
                                    </div>
                                  </div>
                                  <div class="text-caption">
                                    <div class="d-flex justify-space-between mb-1">
                                      <span>Entregados:</span>
                                      <span class="font-weight-medium text-green">
                                        {{ profesor.entregados }}
                                      </span>
                                    </div>
                                    <div class="d-flex justify-space-between mb-1">
                                      <span>Devueltos:</span>
                                      <span class="font-weight-medium text-blue">
                                        {{ profesor.devueltos }}
                                      </span>
                                    </div>
                                    <div class="d-flex justify-space-between">
                                      <span>Pendientes:</span>
                                      <span class="font-weight-medium text-orange">
                                        {{ profesor.pendientes }}
                                      </span>
                                    </div>
                                  </div>
                                </v-card>
                              </v-col>
                            </v-row>
                          </v-expansion-panel-text>
                        </v-expansion-panel>
                      </v-expansion-panels>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-window-item>
          </v-window>
        </v-container>
      </div>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useAdminStore } from '../stores/adminStrore'

const adminStore = useAdminStore()

// Estados reactivos
const seccionActiva = ref('pagos')
const fechaActual = ref(new Date().toLocaleDateString('es-ES'))

// Estados para pagos
const mostrarFormularioPago = ref(false)
const pagoEditando = ref(null)
const filtroMes = ref('')
const filtroAnio = ref(new Date().getFullYear())
const filtroCategoria = ref('')
const formPago = ref(null)

// Estados para gastos
const mostrarFormularioGasto = ref(false)
const gastoEditando = ref(null)
const filtroCategoriaGasto = ref('')
const filtroFechaInicio = ref('')
const filtroFechaFin = ref('')
const formGasto = ref(null)

// Estados para reportes
const reporteTipo = ref('mensual')
const reporteFecha = ref(new Date().toISOString().split('T')[0])
const reporteMes = ref(new Date().toLocaleString('es-ES', { month: 'long' }))
const reporteAnio = ref(new Date().getFullYear())
const reporteSemestre = ref(new Date().getMonth() < 6 ? '1' : '2')
const reporteData = ref({})
const reporteComparativo = ref([])
const reporteComparativoTipo = ref('')
const loadingReportes = ref(false)

// Estados para pagos vencidos
const loadingPagosVencidos = ref(false)
const enviandoRecordatorios = ref(false)
const mostrarDialogPagoRapido = ref(false)
const jugadorSeleccionado = ref(null)
const formPagoRapido = ref(null)

// Filtros para pagos vencidos
const filtroCategoriaVencidos = ref('')
const filtroNombreVencidos = ref('')
const filtroDiasVencidos = ref('')

// Datos para pagos vencidos
const jugadoresVencidos = ref([])
const resumenVencidos = ref({})
const resumenPorCategoria = ref([])

// Pago rápido
const pagoRapido = ref({
  player_id: '',
  month: new Date().toLocaleString('es-ES', { month: 'long' }),
  year: new Date().getFullYear(),
  amount: 0,
  payment_date: new Date().toISOString().split('T')[0],
  payment_method: 'cash',
})

// Estados para materiales de profesores
const mostrarFormularioMaterial = ref(false)
const materialEditando = ref(null)
const loadingMaterials = ref(false)
const formMaterial = ref(null)

// Filtros para materiales
const filtroNombreProfesor = ref('')
const filtroStatusMaterial = ref('')
const filtroFechaInicioMaterial = ref('')
const filtroFechaFinMaterial = ref('')

// Datos para materiales
const teacherMaterials = ref([])
const materialsStats = ref({})

// Datos estáticos
const meses = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
]

const metodosPago = [
  { title: 'Efectivo', value: 'cash' },
  { title: 'Transferencia', value: 'transfer' },
  { title: 'Tarjeta', value: 'card' },
]

const metodosPagoGasto = [
  { title: 'Efectivo', value: 'cash' },
  { title: 'Transferencia', value: 'transfer' },
  { title: 'Tarjeta', value: 'card' },
  { title: 'Cheque', value: 'check' },
]

const categoriasGastos = [
  { title: 'Materiales Deportivos', value: 'materiales' },
  { title: 'Transporte', value: 'transporte' },
  { title: 'Alimentación', value: 'alimentacion' },
  { title: 'Mantenimiento', value: 'mantenimiento' },
  { title: 'Personal', value: 'personal' },
  { title: 'Servicios', value: 'servicios' },
  { title: 'Otros', value: 'otros' },
]

const tiposReporte = [
  { title: 'Reporte Diario', value: 'diario' },
  { title: 'Reporte Mensual', value: 'mensual' },
  { title: 'Reporte Semestral', value: 'semestral' },
  { title: 'Reporte Anual', value: 'anual' },
]

const semestres = [
  { title: 'Primer Semestre', value: '1' },
  { title: 'Segundo Semestre', value: '2' },
]

const opcionesDiasVencidos = [
  { title: '1-7 días', value: '1-7' },
  { title: '8-15 días', value: '8-15' },
  { title: '16-30 días', value: '16-30' },
  { title: 'Más de 30 días', value: '30+' },
]

// Headers de tablas
const headersPagos = [
  { title: 'Jugador', key: 'player_id', sortable: false },
  { title: 'Mes', key: 'month' },
  { title: 'Año', key: 'year' },
  { title: 'Monto', key: 'amount', align: 'end' },
  { title: 'Fecha Pago', key: 'payment_date' },
  { title: 'Método', key: 'payment_method' },
  { title: 'Acciones', key: 'actions', sortable: false, align: 'center' },
]

const headersGastos = [
  { title: 'Fecha', key: 'expense_date' },
  { title: 'Descripción', key: 'description' },
  { title: 'Categoría', key: 'category' },
  { title: 'Monto', key: 'amount', align: 'end' },
  { title: 'Comprobante', key: 'receipt_number' },
  { title: 'Método Pago', key: 'payment_method' },
  { title: 'Acciones', key: 'actions', sortable: false, align: 'center' },
]

const headersComparativo = [
  { title: 'Período', key: 'period' },
  { title: 'Ingresos', key: 'income', align: 'end' },
  { title: 'Gastos', key: 'expenses', align: 'end' },
  { title: 'Balance', key: 'balance', align: 'end' },
]

const headersVencidos = [
  { title: 'Jugador', key: 'name', sortable: true },
  { title: 'Acudiente', key: 'guardianInfo', sortable: false },
  { title: 'Período Vencido', key: 'overduePeriod', sortable: true },
  { title: 'Días de Mora', key: 'daysOverdue', sortable: true, align: 'center' },
  { title: 'Acciones', key: 'actions', sortable: false, align: 'center', width: '150px' },
]

// Headers para la tabla de materiales
const headersMateriales = [
  { title: 'Profesor', key: 'teacherName', sortable: true },
  { title: 'Materiales', key: 'materials', sortable: false },
  { title: 'Fecha Entrega', key: 'deliveryDate', sortable: true },
  { title: 'Fecha Devolución', key: 'returnDate', sortable: true },
  { title: 'Estado', key: 'status', sortable: true },
  { title: 'Acciones', key: 'actions', sortable: false, align: 'center', width: '150px' },
]

// Estados de materiales
const estadosMateriales = [
  { title: 'Entregado', value: 'entregado' },
  { title: 'Pendiente', value: 'pendiente' },
  { title: 'Devuelto', value: 'devuelto' },
  { title: 'Perdido', value: 'perdido' },
]

// Formularios
const nuevoPago = ref({
  player_id: '',
  month: '',
  year: new Date().getFullYear(),
  amount: 0,
  payment_date: new Date().toISOString().split('T')[0],
  payment_method: '',
  reference: '',
  notes: '',
})

const nuevoGasto = ref({
  description: '',
  category: '',
  amount: 0,
  expense_date: new Date().toISOString().split('T')[0],
  receipt_number: '',
  provider: '',
  payment_method: '',
  notes: '',
  approved_by: '',
})

// Formulario de material
const nuevoMaterial = ref({
  teacherName: '',
  materials: '',
  deliveryDate: new Date().toISOString().split('T')[0],
  quantity: 1,
  status: 'entregado',
  notes: '',
  deliveryPerson: '',
  returnDate: null,
})

// Computed properties
const loading = computed(() => adminStore.loading)
const error = computed(() => adminStore.error)
const players = computed(() => adminStore.players)
const payments = computed(() => adminStore.payments)
const expenses = computed(() => adminStore.expenses)
const categories = computed(() => adminStore.categories)

const jugadoresOptions = computed(() =>
  players.value.map((p) => ({
    title: `${p.name} ${p.lastName} - Cat. ${p.category}`,
    value: p.id,
  })),
)

const categoriasOptions = computed(() =>
  categories.value.map((c) => ({ title: `Categoría ${c}`, value: c })),
)

const categoriasGastosReporte = computed(() => {
  return reporteData.value.expenses?.by_category || []
})

const totalGastos = computed(() => {
  return categoriasGastosReporte.value.reduce((total, cat) => {
    const monto = parseFloat(cat.total || 0)
    return total + monto
  }, 0)
})

const promedioPago = computed(() => {
  if (payments.value.length === 0) return 0
  const total = payments.value.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0)
  return total / payments.value.length
})

const promedioGasto = computed(() => {
  if (expenses.value.length === 0) return 0
  const total = expenses.value.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0)
  return total / expenses.value.length
})

const balanceColor = computed(() => {
  return (parseFloat(reporteData.value.balance) || 0) >= 0 ? 'green-lighten-5' : 'red-lighten-5'
})

const balanceTextColor = computed(() => {
  return (parseFloat(reporteData.value.balance) || 0) >= 0 ? 'text-green' : 'text-red'
})

const balanceIconColor = computed(() => {
  return (parseFloat(reporteData.value.balance) || 0) >= 0 ? 'green' : 'red'
})

const balanceIcon = computed(() => {
  return (parseFloat(reporteData.value.balance) || 0) >= 0 ? 'mdi-arrow-up' : 'mdi-arrow-down'
})

// Computed para pagos vencidos
const totalJugadoresVencidos = computed(() => {
  return jugadoresVencidos.value.length
})

const jugadoresVencidosFiltrados = computed(() => {
  let filtered = [...jugadoresVencidos.value]

  // Filtrar por categoría
  if (filtroCategoriaVencidos.value) {
    filtered = filtered.filter((j) => j.category == filtroCategoriaVencidos.value)
  }

  // Filtrar por nombre
  if (filtroNombreVencidos.value) {
    const searchTerm = filtroNombreVencidos.value.toLowerCase()
    filtered = filtered.filter(
      (j) =>
        j.name.toLowerCase().includes(searchTerm) ||
        j.guardianName.toLowerCase().includes(searchTerm),
    )
  }

  // Filtrar por días de vencimiento
  if (filtroDiasVencidos.value) {
    filtered = filtered.filter((j) => {
      const dias = j.daysOverdue
      switch (filtroDiasVencidos.value) {
        case '1-7':
          return dias >= 1 && dias <= 7
        case '8-15':
          return dias >= 8 && dias <= 15
        case '16-30':
          return dias >= 16 && dias <= 30
        case '30+':
          return dias > 30
        default:
          return true
      }
    })
  }

  return filtered
})

// Computed para materiales
const teacherMaterialsFiltrados = computed(() => {
  let filtered = [...teacherMaterials.value]

  // Filtrar por nombre de profesor
  if (filtroNombreProfesor.value) {
    const searchTerm = filtroNombreProfesor.value.toLowerCase()
    filtered = filtered.filter((m) => m.teacherName.toLowerCase().includes(searchTerm))
  }

  // Filtrar por estado
  if (filtroStatusMaterial.value) {
    filtered = filtered.filter((m) => m.status === filtroStatusMaterial.value)
  }

  // Filtrar por rango de fechas
  if (filtroFechaInicioMaterial.value && filtroFechaFinMaterial.value) {
    filtered = filtered.filter((m) => {
      const fechaEntrega = new Date(m.deliveryDate)
      const inicio = new Date(filtroFechaInicioMaterial.value)
      const fin = new Date(filtroFechaFinMaterial.value)
      return fechaEntrega >= inicio && fechaEntrega <= fin
    })
  }

  return filtered
})

const totalPendientesMateriales = computed(() => {
  return teacherMaterials.value.filter((m) => m.status === 'pendiente').length
})

const materialesEntregados = computed(() => {
  return teacherMaterials.value.filter((m) => m.status === 'entregado').length
})

const materialesDevueltos = computed(() => {
  return teacherMaterials.value.filter((m) => m.status === 'devuelto').length
})

const materialesPerdidos = computed(() => {
  return teacherMaterials.value.filter((m) => m.status === 'perdido').length
})

const materialesAgrupados = computed(() => {
  const agrupados = {}

  teacherMaterials.value.forEach((material) => {
    if (!agrupados[material.teacherName]) {
      agrupados[material.teacherName] = {
        teacherName: material.teacherName,
        count: 0,
        entregados: 0,
        devueltos: 0,
        pendientes: 0,
        perdidos: 0,
      }
    }

    agrupados[material.teacherName].count++

    switch (material.status) {
      case 'entregado':
        agrupados[material.teacherName].entregados++
        break
      case 'devuelto':
        agrupados[material.teacherName].devueltos++
        break
      case 'pendiente':
        agrupados[material.teacherName].pendientes++
        break
      case 'perdido':
        agrupados[material.teacherName].perdidos++
        break
    }
  })

  return Object.values(agrupados)
})

// Métodos generales
const clearError = () => adminStore.clearError()

const obtenerNombreJugador = (playerId) => {
  const jugador = players.value.find((p) => p.id === playerId)
  return jugador ? `${jugador.name} ${jugador.lastName}` : 'N/A'
}

const obtenerNombreCategoria = (categoria) => {
  const cat = categoriasGastos.find((c) => c.value === categoria)
  return cat ? cat.title : categoria
}

const formatFecha = (fecha) => {
  if (!fecha) return 'N/A'
  return new Date(fecha).toLocaleDateString('es-ES')
}

const obtenerNombreMetodoPago = (metodo) => {
  const metodos = {
    cash: 'Efectivo',
    transfer: 'Transferencia',
    card: 'Tarjeta',
    check: 'Cheque',
  }
  return metodos[metodo] || metodo
}

const getColorMetodoPago = (metodo) => {
  const colores = {
    cash: 'green',
    transfer: 'blue',
    card: 'orange',
    check: 'purple',
  }
  return colores[metodo] || 'grey'
}

const getColorCategoriaGasto = (categoria) => {
  const colores = {
    materiales: 'blue',
    transporte: 'orange',
    alimentacion: 'green',
    mantenimiento: 'red',
    personal: 'purple',
    servicios: 'teal',
    otros: 'grey',
  }
  return colores[categoria] || 'grey'
}

const calcularPorcentaje = (monto) => {
  const montoNumerico = parseFloat(monto || 0)
  return totalGastos.value > 0 ? (montoNumerico / totalGastos.value) * 100 : 0
}

// Métodos para materiales
const obtenerNombreEstado = (estado) => {
  const estados = {
    entregado: 'Entregado',
    pendiente: 'Pendiente',
    devuelto: 'Devuelto',
    perdido: 'Perdido',
  }
  return estados[estado] || estado
}

const getColorEstadoMaterial = (estado) => {
  const colores = {
    entregado: 'blue',
    pendiente: 'orange',
    devuelto: 'green',
    perdido: 'red',
  }
  return colores[estado] || 'grey'
}

const getIconEstadoMaterial = (estado) => {
  const iconos = {
    entregado: 'mdi-check-circle',
    pendiente: 'mdi-clock-outline',
    devuelto: 'mdi-arrow-left-circle',
    perdido: 'mdi-alert-circle',
  }
  return iconos[estado] || 'mdi-help-circle'
}

// Métodos para pagos
const cargarPagos = async () => {
  await adminStore.fetchPayments()
}

const aplicarFiltrosPagos = async () => {
  const filtros = {}
  if (filtroMes.value) filtros.month = filtroMes.value
  if (filtroAnio.value) filtros.year = filtroAnio.value
  if (filtroCategoria.value) filtros.category = filtroCategoria.value

  await adminStore.fetchPayments(filtros)
}

const guardarPago = async () => {
  if (formPago.value) {
    const { valid } = await formPago.value.validate()

    if (!valid) {
      return
    }
  }

  try {
    if (pagoEditando.value) {
      await adminStore.updatePayment(pagoEditando.value.id, nuevoPago.value)
    } else {
      await adminStore.createPayment(nuevoPago.value)
    }
    cancelarPago()
  // eslint-disable-next-line no-unused-vars
  } catch (error) {
    // Error manejado por el store
  }
}

const editarPago = (pago) => {
  pagoEditando.value = pago
  nuevoPago.value = { ...pago }
  mostrarFormularioPago.value = true
}

const eliminarPago = async (id) => {
  if (confirm('¿Estás seguro de eliminar este pago?')) {
    await adminStore.deletePayment(id)
  }
}

const cancelarPago = () => {
  mostrarFormularioPago.value = false
  pagoEditando.value = null
  nuevoPago.value = {
    player_id: '',
    month: '',
    year: new Date().getFullYear(),
    amount: 0,
    payment_date: new Date().toISOString().split('T')[0],
    payment_method: '',
    reference: '',
    notes: '',
  }

  if (formPago.value) {
    formPago.value.reset()
  }
}

// Métodos para gastos
const cargarGastos = async () => {
  await adminStore.fetchExpenses()
}

const aplicarFiltrosGastos = async () => {
  const filtros = {}
  if (filtroCategoriaGasto.value) filtros.category = filtroCategoriaGasto.value
  if (filtroFechaInicio.value && filtroFechaFin.value) {
    filtros.start_date = filtroFechaInicio.value
    filtros.end_date = filtroFechaFin.value
  }

  await adminStore.fetchExpenses(filtros)
}

const guardarGasto = async () => {
  if (formGasto.value) {
    const { valid } = await formGasto.value.validate()

    if (!valid) {
      return
    }
  }

  try {
    if (gastoEditando.value) {
      await adminStore.updateExpense(gastoEditando.value.id, nuevoGasto.value)
    } else {
      await adminStore.createExpense(nuevoGasto.value)
    }
    cancelarGasto()
  // eslint-disable-next-line no-unused-vars
  } catch (error) {
    // Error manejado por el store
  }
}

const editarGasto = (gasto) => {
  gastoEditando.value = gasto
  nuevoGasto.value = { ...gasto }
  mostrarFormularioGasto.value = true
}

const eliminarGasto = async (id) => {
  if (confirm('¿Estás seguro de eliminar este gasto?')) {
    await adminStore.deleteExpense(id)
  }
}

const cancelarGasto = () => {
  mostrarFormularioGasto.value = false
  gastoEditando.value = null
  nuevoGasto.value = {
    description: '',
    category: '',
    amount: 0,
    expense_date: new Date().toISOString().split('T')[0],
    receipt_number: '',
    provider: '',
    payment_method: '',
    notes: '',
    approved_by: '',
  }

  if (formGasto.value) {
    formGasto.value.reset()
  }
}

// Métodos para reportes
const cargarReportes = async () => {
  try {
    loadingReportes.value = true
    const params = {
      periodType: reporteTipo.value,
    }

    // Agregar parámetros según el tipo de reporte
    if (reporteTipo.value === 'diario') {
      params.date = reporteFecha.value
    } else if (reporteTipo.value === 'mensual') {
      params.month = reporteMes.value
      params.year = reporteAnio.value
    } else if (reporteTipo.value === 'semestral') {
      params.month = reporteSemestre.value
      params.year = reporteAnio.value
    } else if (reporteTipo.value === 'anual') {
      params.year = reporteAnio.value
    }

    reporteData.value = await adminStore.fetchFinancialReport(params)
  } catch (error) {
    console.error('Error cargando reportes:', error)
  } finally {
    loadingReportes.value = false
  }
}

const cargarReporteComparativo = async () => {
  try {
    loadingReportes.value = true
    const params = {
      periodType: reporteTipo.value,
      year: reporteAnio.value,
    }

    const response = await adminStore.fetchComparativeReport(params)
    reporteComparativo.value = response.reports
    reporteComparativoTipo.value = response.period_type
  } catch (error) {
    console.error('Error cargando reporte comparativo:', error)
  } finally {
    loadingReportes.value = false
  }
}

// Métodos para pagos vencidos
const cargarPagosVencidos = async () => {
  try {
    loadingPagosVencidos.value = true
    // Cargar datos básicos de morosidad
    const response = await adminStore.fetchOverduePayments()
    jugadoresVencidos.value = response.overdue_players || []
    resumenVencidos.value = {
      total_vencidos: response.players_with_overdue,
      total_activos: response.total_active_players,
      total_pagados: response.players_with_payment,
      tasa_pago:
        response.total_active_players > 0
          ? (response.players_with_payment / response.total_active_players) * 100
          : 0,
    }

    // Cargar resumen por categoría
    const summaryResponse = await adminStore.fetchOverdueSummary()
    resumenPorCategoria.value = summaryResponse.by_category || []
  } catch (error) {
    console.error('Error cargando pagos vencidos:', error)
  } finally {
    loadingPagosVencidos.value = false
  }
}

const aplicarFiltrosVencidos = () => {
  // Los filtros se aplican automáticamente mediante computed properties
}

const getColorDiasVencidos = (dias) => {
  if (dias <= 7) return 'orange'
  if (dias <= 15) return 'deep-orange'
  return 'red'
}

const getColorEstadoCategoria = (tasa) => {
  if (tasa >= 80) return 'green'
  if (tasa >= 50) return 'orange'
  return 'red'
}

const registrarPagoRapido = (jugador) => {
  jugadorSeleccionado.value = jugador

  // Obtener el mes actual en formato correcto (con primera letra mayúscula)
  const mesActual = new Date().toLocaleString('es-ES', { month: 'long' })
  const mesNormalizado = mesActual.charAt(0).toUpperCase() + mesActual.slice(1)

  pagoRapido.value = {
    player_id: jugador.id,
    month: mesNormalizado, // Usar el mes normalizado
    year: new Date().getFullYear(),
    amount: 0, // Podrías poner un monto por defecto según la categoría
    payment_date: new Date().toISOString().split('T')[0],
    payment_method: 'cash',
  }
  mostrarDialogPagoRapido.value = true
}

const confirmarPagoRapido = async () => {
  if (formPagoRapido.value) {
    const { valid } = await formPagoRapido.value.validate()
    if (!valid) return
  }

  try {
    await adminStore.createPayment(pagoRapido.value)
    mostrarDialogPagoRapido.value = false
    await cargarPagosVencidos() // Recargar la lista
  } catch (error) {
    console.error('Error registrando pago rápido:', error)
  }
}

const enviarRecordatorioIndividual = async (jugador) => {
  // Confirmar antes de enviar
  const confirmar = confirm(
    `¿Enviar recordatorio de pago vencido a ${jugador.guardianName}?\n\n` +
    `Jugador: ${jugador.name}\n` +
    `Email: ${jugador.guardianEmail}\n\n` +
    `Se enviará un correo urgente sobre el pago vencido.`
  );

  if (!confirmar) return;

  try {
    const resultado = await adminStore.sendPaymentReminder(jugador.id);

    if (resultado.success) {
      // Mostrar notificación de éxito
      alert(`✅ Recordatorio enviado exitosamente\n\n` +
        `Se ha enviado un correo a:\n` +
        `• ${jugador.guardianName}\n` +
        `• ${jugador.guardianEmail}\n\n` +
        `Período: ${resultado.data.period}\n` +
        `Días de mora: ${resultado.data.daysOverdue}`);

      console.log('Resultado del envío:', resultado);
    } else {
      alert(`❌ Error: ${resultado.error || 'No se pudo enviar el recordatorio'}`);
    }

  } catch (error) {
    console.error('Error enviando recordatorio:', error);
    alert('❌ Error al enviar el recordatorio. Por favor, intente nuevamente.');
  }
};

const enviarRecordatorios = async () => {
  if (jugadoresVencidosFiltrados.value.length === 0) {
    alert('⚠️ No hay jugadores vencidos para enviar recordatorios.');
    return;
  }

  // Confirmar antes de enviar
  const confirmar = confirm(
    `¿Enviar recordatorios a ${jugadoresVencidosFiltrados.value.length} jugadores?\n\n` +
    `Se enviarán correos urgentes de pago vencido a todos los acudientes.\n\n` +
    `IMPORTANTE:\n` +
    `• Solo se enviará a jugadores con email válido\n` +
    `• Solo se enviará a jugadores que realmente tengan pago vencido\n` +
    `• Este proceso puede tomar unos minutos\n\n` +
    `¿Continuar?`
  );

  if (!confirmar) return;

  try {
    enviandoRecordatorios.value = true;

    // Obtener IDs de jugadores filtrados
    const playerIds = jugadoresVencidosFiltrados.value.map(j => j.id);

    console.log('Enviando recordatorios a IDs:', playerIds);

    const resultado = await adminStore.sendBulkPaymentReminders(playerIds);

    // Mostrar resultado detallado
    if (resultado.success) {
      let mensaje = `✅ Resultado del envío masivo:\n\n`;
      mensaje += `• Total procesados: ${resultado.summary.total_players}\n`;
      mensaje += `• Envíos exitosos: ${resultado.summary.successful}\n`;
      mensaje += `• Envíos fallidos: ${resultado.summary.failed}\n`;
      mensaje += `• Tasa de éxito: ${resultado.summary.success_rate}%\n\n`;

      if (resultado.summary.failed > 0) {
        mensaje += `🔍 Fallos (primeros 5):\n`;
        const fallos = resultado.details.filter(d => d.status === 'failed').slice(0, 5);
        fallos.forEach(f => {
          mensaje += `  • ${f.player_name}: ${f.message}\n`;
        });
      }

      alert(mensaje);

      // Mostrar detalles completos en consola
      console.log('Resultado completo:', resultado);

      // Recargar datos después de enviar
      await cargarPagosVencidos();

    } else {
      alert(`❌ Error: ${resultado.error || 'No se pudieron enviar los recordatorios'}`);
    }

  } catch (error) {
    console.error('Error enviando recordatorios masivos:', error);
    alert('❌ Error al enviar los recordatorios. Por favor, intente nuevamente.');
  } finally {
    enviandoRecordatorios.value = false;
  }
};

const verDetallesJugador = (jugador) => {
  // Navegar a la vista de detalles del jugador o mostrar un dialog
  console.log('Ver detalles de:', jugador)
}

// Métodos para materiales de profesores
const cargarTeacherMaterials = async () => {
  try {
    loadingMaterials.value = true
    const response = await adminStore.fetchTeacherMaterials()
    teacherMaterials.value = response.data || []

    // Cargar estadísticas
    const statsResponse = await adminStore.fetchMaterialStats()
    materialsStats.value = statsResponse.data || {}
  } catch (error) {
    console.error('Error cargando materiales:', error)
  } finally {
    loadingMaterials.value = false
  }
}

const aplicarFiltrosMateriales = () => {
  // Los filtros se aplican automáticamente mediante computed properties
}

const guardarMaterial = async () => {
  if (formMaterial.value) {
    const { valid } = await formMaterial.value.validate()

    if (!valid) {
      return
    }
  }

  try {
    loadingMaterials.value = true

    if (materialEditando.value) {
      await adminStore.updateTeacherMaterial(materialEditando.value.id, nuevoMaterial.value)
    } else {
      await adminStore.createTeacherMaterial(nuevoMaterial.value)
    }

    cancelarMaterial()
    await cargarTeacherMaterials()
  } catch (error) {
    console.error('Error guardando material:', error)
  } finally {
    loadingMaterials.value = false
  }
}

const editarMaterial = (material) => {
  materialEditando.value = material
  nuevoMaterial.value = { ...material }
  mostrarFormularioMaterial.value = true
}

const marcarComoDevuelto = async (material) => {
  if (confirm(`¿Marcar los materiales de ${material.teacherName} como devueltos?`)) {
    try {
      loadingMaterials.value = true
      await adminStore.updateTeacherMaterial(material.id, {
        ...material,
        status: 'devuelto',
        returnDate: new Date().toISOString().split('T')[0],
      })
      await cargarTeacherMaterials()
    } catch (error) {
      console.error('Error marcando como devuelto:', error)
    } finally {
      loadingMaterials.value = false
    }
  }
}

const eliminarMaterial = async (id) => {
  if (confirm('¿Estás seguro de eliminar este registro?')) {
    try {
      loadingMaterials.value = true
      await adminStore.deleteTeacherMaterial(id)
      await cargarTeacherMaterials()
    } catch (error) {
      console.error('Error eliminando material:', error)
    } finally {
      loadingMaterials.value = false
    }
  }
}

const cancelarMaterial = () => {
  mostrarFormularioMaterial.value = false
  materialEditando.value = null
  nuevoMaterial.value = {
    teacherName: '',
    materials: '',
    deliveryDate: new Date().toISOString().split('T')[0],
    quantity: 1,
    status: 'entregado',
    notes: '',
    deliveryPerson: '',
    returnDate: null,
  }

  if (formMaterial.value) {
    formMaterial.value.reset()
  }
}

// Inicializar
onMounted(async () => {
  await adminStore.initializeData()
  await cargarReportes()
})

// Watch para cargar datos al cambiar sección
watch(seccionActiva, async (newSection) => {
  if (newSection === 'vencidos') {
    await cargarPagosVencidos()
  } else if (newSection === 'materiales-profesores') {
    await cargarTeacherMaterials()
  }
})
</script>

<style scoped>
.administracion {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

:deep(.bg-primary) {
  background: linear-gradient(135deg, #1976d2 0%, #0d47a1 100%) !important;
}

:deep(.bg-secondary) {
  background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%) !important;
}

:deep(.bg-success) {
  background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%) !important;
}

:deep(.bg-warning) {
  background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%) !important;
}

:deep(.bg-indigo) {
  background: linear-gradient(135deg, #3949ab 0%, #283593 100%) !important;
}

.v-tab {
  font-weight: 600;
  letter-spacing: 0.5px;
}

.grafico-categorias {
  max-height: 400px;
  overflow-y: auto;
}

.categoria-item {
  padding: 8px 0;
}

.materiales-lista {
  max-width: 300px;
  word-wrap: break-word;
}
</style>
