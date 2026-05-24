import React, { useState } from 'react'

const MAX_LENGTH = 200

/**
 * Bottom-fixed chat input with send button.
 * Disabled when cooldown active, cap reached, offline, or loading.
 */
export default function ChatInput({ onSend, canTalk, isLoading, isOffline, cooldown, petName = 'Kokoro' }) {
  const [text, setText] = useState('')

  const disabled = !canTalk || isLoading || isOffline
  const remaining = MAX_LENGTH - text.length

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setText('')
  }

  const getPlaceholder = () => {
    if (isOffline) return `${petName} is sleeping...`
    if (isLoading) return `${petName} is thinking...`
    if (cooldown > 0) return `Wait ${cooldown}s...`
    if (!canTalk) return 'Daily limit reached'
    return `Say something to ${petName}...`
  }

  return (
    <form className="chat-input" onSubmit={handleSubmit}>
      <div className="chat-input__row">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, MAX_LENGTH))}
          placeholder={getPlaceholder()}
          disabled={disabled}
          maxLength={MAX_LENGTH}
          className="chat-input__field"
          autoComplete="off"
        />
        <button
          type="submit"
          disabled={disabled || !text.trim()}
          className="chat-input__send"
          aria-label="Send"
        >
          ↑
        </button>
      </div>
      {text.length > 0 && (
        <div className={`chat-input__counter ${remaining <= 20 ? 'chat-input__counter--warn' : ''}`}>
          {remaining}
        </div>
      )}
    </form>
  )
}
