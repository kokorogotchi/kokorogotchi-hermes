import React, { useRef, useEffect } from 'react'

/**
 * Scrollable chat thread showing user/kokoro message bubbles.
 * Auto-scrolls to bottom on new messages.
 */
export default function ChatThread({ messages, isLoading, petName = 'Kokoro' }) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length, isLoading])

  if (messages.length === 0 && !isLoading) {
    return null
  }

  return (
    <div className="chat-thread">
      {messages.map(msg => (
        <div
          key={msg.id}
          className={`chat-bubble chat-bubble--${msg.role}`}
        >
          <span className="chat-bubble__text">{msg.text}</span>
        </div>
      ))}
      {isLoading && (
        <div className="chat-bubble chat-bubble--kokoro chat-bubble--typing">
          <span className="chat-bubble__text">...</span>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  )
}
