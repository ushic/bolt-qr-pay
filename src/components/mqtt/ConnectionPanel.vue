<template>
  <form @submit.prevent="handleConnect" class="space-y-4">
    <div>
      <label class="block text-white/80 text-sm mb-2">Broker Host</label>
      <input 
        v-model="form.host"
        type="text"
        class="w-full bg-white/10 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20"
        placeholder="broker.example.com"
        required
      />
    </div>

    <div>
      <label class="block text-white/80 text-sm mb-2">Port</label>
      <input 
        v-model="form.port"
        type="number"
        class="w-full bg-white/10 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20"
        :placeholder="MQTT_CONFIG.defaultPort"
        required
      />
    </div>

    <div>
      <label class="block text-white/80 text-sm mb-2">Client ID (Optional)</label>
      <input 
        v-model="form.clientId"
        type="text"
        class="w-full bg-white/10 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20"
        :placeholder="defaultClientId"
      />
    </div>

    <div>
      <label class="block text-white/80 text-sm mb-2">Username</label>
      <input 
        v-model="form.username"
        type="text"
        class="w-full bg-white/10 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20"
        placeholder="username"
      />
    </div>

    <div>
      <label class="block text-white/80 text-sm mb-2">Password</label>
      <input 
        v-model="form.password"
        type="password"
        class="w-full bg-white/10 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20"
        placeholder="••••••••"
      />
    </div>

    <ConnectionStatus />
    
    <div class="flex justify-between">
      <div class="relative">
        <button 
          type="button"
          @click="handleSave"
          class="bg-white/10 text-white py-3 px-8 rounded-lg font-medium hover:bg-white/20 transition-colors"
        >
          Save
        </button>
        <div 
          v-if="showSaveMessage"
          class="save-message absolute left-0 -top-10 bg-green-500/90 text-white px-4 py-2 rounded-lg text-sm whitespace-nowrap"
        >
          Settings saved successfully!
        </div>
      </div>
      <button 
        type="submit"
        class="bg-white text-[#1a2847] py-3 px-8 rounded-lg font-medium hover:bg-white/90 transition-colors disabled:opacity-50"
        :disabled="isConnecting"
      >
        {{ isConnected ? 'Disconnect' : 'Connect' }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, computed } from 'vue'
import { MQTT_CONFIG } from '@/config/mqtt'
import { useMqttStore } from '@/stores/mqttStore'
import { useConnectionStore } from '@/stores/connectionStore'
import ConnectionStatus from './ConnectionStatus.vue'
import { ref as vueRef } from 'vue'

const mqtt = useMqttStore()
const connectionStore = useConnectionStore()
const defaultClientId = `mqtt_${Math.random().toString(16).slice(3)}`
const showSaveMessage = vueRef(false)

// Initialize form with saved connection if available
const form = ref({
  host: '',
  port: MQTT_CONFIG.defaultPort,
  clientId: '',
  username: '',
  password: ''
})

// Load saved connection on component mount
const savedConnection = connectionStore.getConnection()
if (savedConnection) {
  form.value = { ...savedConnection }
}

const isConnecting = computed(() => mqtt.connectionStatus === 'connecting')
const isConnected = computed(() => mqtt.connectionStatus === 'connected')

const handleConnect = async () => {
  if (isConnected.value) {
    await mqtt.disconnect()
  } else {
    await mqtt.connect({
      ...form.value,
      port: parseInt(form.value.port),
      clientId: form.value.clientId || defaultClientId
    })
  }
}

const handleSave = () => {
  connectionStore.saveConnection({
    host: form.value.host,
    port: form.value.port,
    clientId: form.value.clientId,
    username: form.value.username,
    password: form.value.password
  })
  showSaveMessage.value = true
  setTimeout(() => {
    showSaveMessage.value = false
  }, 3000)
}
</script>

<style scoped>
.save-message {
  animation: fadeOut 3s forwards;
}

@keyframes fadeOut {
  0% { opacity: 1; }
  70% { opacity: 1; }
  100% { opacity: 0; }
}
</style>
