import { useEffect, useRef, useCallback } from 'react'
import { Client } from '@stomp/stompjs'

const useWebSocket = (topic, onMessage) => {
  const clientRef = useRef(null)

  const connect = useCallback(() => {
    const client = new Client({
      brokerURL: 'ws://localhost:8080/ws/websocket',
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe(topic, (msg) => {
          try {
            onMessage(JSON.parse(msg.body))
          } catch {
            onMessage(msg.body)
          }
        })
      },
      onStompError: (frame) => {
        console.warn('STOMP error:', frame)
      },
    })
    client.activate()
    clientRef.current = client
  }, [topic, onMessage])

  useEffect(() => {
    connect()
    return () => {
      clientRef.current?.deactivate()
    }
  }, [connect])
}

export default useWebSocket