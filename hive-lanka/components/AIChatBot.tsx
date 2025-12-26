'use client';
import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';

export default function AIChatBot() {
  console.log("AI ChatBot Mounted!");
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([
    { role: 'bot', text: 'Hello! I am HiveBot. Ask me about our handmade products! 🍯' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: userMessage }]);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: 'bot', text: data.reply }]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { role: 'bot', text: "Sorry, I can't think right now." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle AI Chatbot"
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          backgroundColor: '#682626',
          color: '#ffffff',
          padding: '15px',
          borderRadius: '50%',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
          border: '2px solid #ffffff',
          zIndex: 9999,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '80px',
            right: '20px',
            width: '400px',
            maxWidth: '90%',
            height: '500px',
            backgroundColor: '#ffffff',
            borderRadius: '15px',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
            overflow: 'hidden',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Header */}
          <div
            style={{
              backgroundColor: '#682626',
              color: '#ffffff',
              padding: '10px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Bot size={24} style={{ marginRight: '10px' }} />
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>HiveBot AI</h3>
              <p style={{ fontSize: '12px', margin: '5px 0 0' }}>Virtual Assistant</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                marginLeft: 'auto',
                background: 'none',
                border: 'none',
                color: '#ffffff',
                cursor: 'pointer',
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Message Area */}
          <div
            style={{
              flex: 1,
              padding: '10px',
              backgroundColor: '#f9fafb',
              overflowY: 'auto',
            }}
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  marginBottom: '10px',
                }}
              >
                <div
                  style={{
                    maxWidth: '70%',
                    padding: '10px',
                    borderRadius: '10px',
                    backgroundColor: msg.role === 'user' ? '#682626' : '#ffffff',
                    color: msg.role === 'user' ? '#ffffff' : '#333333',
                    textAlign: 'left',
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <p style={{ fontSize: '14px', fontStyle: 'italic' }}>HiveBot is thinking...</p>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div
            style={{
              padding: '10px',
              borderTop: '1px solid #e5e7eb',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask me something..."
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '5px',
                border: '1px solid #d1d5db',
                marginRight: '10px',
              }}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              style={{
                backgroundColor: '#682626',
                color: '#ffffff',
                padding: '8px 12px',
                borderRadius: '5px',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}