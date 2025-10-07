import mqtt from 'mqtt'
import { ref } from 'vue'

const isConnected = ref(false)
const subscriptions = new Map()
let mqttClient = null

// Add a simple message queue for batching updates
const messageQueue = new Map()
let processingInterval = null
const PROCESS_INTERVAL = 16 // ~60fps

export function useMqttService() {
  const connect = () => {
    if (mqttClient) return mqttClient

    const clientId = `${import.meta.env.VITE_MQTT_CLIENTID}-${Math.random().toString(36).substr(2, 9)}`

    mqttClient = mqtt.connect(import.meta.env.VITE_MQTT_URI, {
      clientId,
      username: import.meta.env.VITE_MQTT_USERNAME,
      password: import.meta.env.VITE_MQTT_PASSWORD,
      clean: true,
      reconnectPeriod: 1000
    })

    mqttClient.on('connect', () => {
      console.log('🔵 MQTT Connected')
      isConnected.value = true

      // Resubscribe to existing topics
      subscriptions.forEach((_, topic) => {
        mqttClient.subscribe(topic)
      })

      // Start processing interval if not already running
      if (!processingInterval) {
        processingInterval = setInterval(processMessageQueue, PROCESS_INTERVAL)
      }
    })

    mqttClient.on('message', (topic, message) => {
      try {
        const data = JSON.parse(message.toString())

        // Queue the message instead of processing immediately
        if (!messageQueue.has(topic)) {
          messageQueue.set(topic, [])
        }
        messageQueue.get(topic).push(data)
      } catch (error) {
        console.error(`Error processing message for ${topic}:`, error)
      }
    })

    mqttClient.on('error', (error) => {
      console.error('🔴 MQTT Error:', error)
    })

    mqttClient.on('close', () => {
      console.log('🟡 MQTT Disconnected')
      isConnected.value = false
      if (processingInterval) {
        clearInterval(processingInterval)
        processingInterval = null
      }
    })

    return mqttClient
  }

  // Process queued messages at a fixed interval
  function processMessageQueue() {
    messageQueue.forEach((messages, topic) => {
      if (messages.length === 0) return

      const callbacks = subscriptions.get(topic) || []

      // Get the latest message for each topic
      const latestMessage = messages[messages.length - 1]

      // Execute callbacks with the latest message
      callbacks.forEach((callback) => {
        try {
          callback(latestMessage)
        } catch (error) {
          console.error(`Error in callback for ${topic}:`, error)
        }
      })

      // Clear the queue for this topic
      messageQueue.set(topic, [])
    })
  }

  const subscribe = (topic, callback) => {
    connect()

    if (!subscriptions.has(topic)) {
      subscriptions.set(topic, [])
      mqttClient.subscribe(topic)
    }

    const callbacks = subscriptions.get(topic)
    callbacks.push(callback)

    // Return unsubscribe function
    return () => {
      const callbacks = subscriptions.get(topic) || []
      const index = callbacks.indexOf(callback)

      if (index !== -1) {
        callbacks.splice(index, 1)

        if (callbacks.length === 0) {
          mqttClient.unsubscribe(topic)
          subscriptions.delete(topic)
        }
      }
    }
  }

  return {
    isConnected,
    subscribe
  }
}
