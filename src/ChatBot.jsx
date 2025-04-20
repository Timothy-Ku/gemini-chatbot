import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMsg = { sender: 'user', text: input };
    setMessages((prev) => [...prev, newMsg]);
    setInput('');

    try {
      const res = await axios.post('https://gemini-chatbot-server-production.up.railway.app/chat', { message: input });
      const botReply = { sender: 'bot', text: res.data.reply };
      setMessages((prev) => [...prev, botReply]);
    } catch {
      setMessages((prev) => [...prev, { sender: 'bot', text: 'Error getting response.' }]);
    }
  };

  // Auto-scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>💬 Gemini ChatBot</h2>

      <div style={styles.chatBox}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              ...styles.messageRow,
              justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            {msg.sender === 'bot' && <div style={styles.avatar}>🤖</div>}
            <div
              style={{
                ...styles.bubble,
                backgroundColor: msg.sender === 'user' ? '#d1e7ff' : '#f1f0f0',
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              }}
            >
              {msg.text}
            </div>
            {msg.sender === 'user' && <div style={styles.avatar}>👤</div>}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div style={styles.inputRow}>
        <input
          style={styles.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type your message..."
        />
        <button style={styles.button} onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: 600,
    margin: '0 auto',
    padding: 20,
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    textAlign: 'center',
  },
  chatBox: {
    height: 400,
    overflowY: 'auto',
    border: '1px solid #ccc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    background: '#fafafa',
  },
  messageRow: {
    display: 'flex',
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  bubble: {
    padding: '10px 15px',
    borderRadius: 20,
    maxWidth: '70%',
    lineHeight: 1.4,
  },
  avatar: {
    fontSize: 20,
    margin: '0 8px',
  },
  inputRow: {
    display: 'flex',
    gap: 10,
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 16,
    borderRadius: 5,
    border: '1px solid #ccc',
  },
  button: {
    padding: '10px 20px',
    fontSize: 16,
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: 5,
    cursor: 'pointer',
  },
};

export default ChatBot;
