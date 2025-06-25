import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function ADEInterface() {
  const [agents, setAgents] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState('Connecting...');

  useEffect(() => {
    fetchSystemStatus();
    
    // WebSocket connection for real-time updates
    const ws = new WebSocket(process.env.NODE_ENV === 'production' 
      ? 'wss://your-ade-deployment.vercel.app/api/ws' 
      : 'ws://localhost:3000/api/ws'
    );
    
    ws.onopen = () => setStatus('Connected');
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages(prev => [...prev, message]);
    };
    ws.onerror = () => setStatus('Connection Error');
    
    return () => ws.close();
  }, []);

  const fetchSystemStatus = async () => {
    try {
      const response = await fetch('/api/status');
      const data = await response.json();
      setAgents(data.registered_agents || []);
      setStatus('Operational');
    } catch (error) {
      setStatus('Error');
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    try {
      const response = await fetch('/api/coordinate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'human_input',
          content: input,
          timestamp: new Date().toISOString()
        })
      });
      
      if (response.ok) {
        setInput('');
      }
    } catch (error) {
      console.error('Send failed:', error);
    }
  };

  return (
    <>
      <Head>
        <title>APML Development Engine</title>
        <meta name="description" content="Revolutionary agent coordination system" />
      </Head>

      <div style={{
        fontFamily: 'SF Mono, Monaco, Consolas, monospace',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
        color: '#00ff88',
        minHeight: '100vh',
        padding: '20px'
      }}>
        <header style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ 
            color: '#00ff88', 
            textShadow: '0 0 10px #00ff88',
            fontSize: '3em',
            margin: '0'
          }}>
            🚀 APML Development Engine
          </h1>
          <p style={{ fontSize: '1.2em', margin: '10px 0' }}>
            Revolutionary Agent Coordination System
          </p>
          <div style={{
            background: 'rgba(0, 255, 136, 0.1)',
            border: '1px solid #00ff88',
            borderRadius: '5px',
            padding: '10px',
            display: 'inline-block'
          }}>
            Status: <strong>{status}</strong> | Agents: <strong>{agents.length}</strong>
          </div>
        </header>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
          marginBottom: '30px'
        }}>
          <div style={{
            background: 'rgba(0, 0, 0, 0.6)',
            border: '1px solid #00ff88',
            borderRadius: '10px',
            padding: '20px'
          }}>
            <h3>🤖 Active Agents</h3>
            {agents.map(agent => (
              <div key={agent.agent_id} style={{
                background: 'rgba(0, 255, 136, 0.05)',
                border: '1px solid #00ff88',
                borderRadius: '5px',
                padding: '10px',
                margin: '10px 0'
              }}>
                <strong>{agent.agent_id}</strong>
                <br />
                Layer: {agent.layer} | Role: {agent.role}
                <br />
                <small>Registered: {new Date(agent.registered_at).toLocaleString()}</small>
              </div>
            ))}
          </div>

          <div style={{
            background: 'rgba(0, 0, 0, 0.6)',
            border: '1px solid #00ff88',
            borderRadius: '10px',
            padding: '20px'
          }}>
            <h3>📬 APML Messages</h3>
            <div style={{
              height: '300px',
              overflowY: 'auto',
              background: 'rgba(0, 0, 0, 0.3)',
              padding: '10px',
              borderRadius: '5px'
            }}>
              {messages.map((msg, i) => (
                <div key={i} style={{
                  padding: '5px',
                  borderBottom: '1px solid #333',
                  fontSize: '0.9em'
                }}>
                  <strong>{msg.message_type}</strong>: {msg.sender?.role} → {msg.recipient?.role}
                  <br />
                  <small>{new Date(msg.timestamp).toLocaleTimeString()}</small>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{
          background: 'rgba(0, 0, 0, 0.6)',
          border: '1px solid #00ff88',
          borderRadius: '10px',
          padding: '20px'
        }}>
          <h3>🎤 Coordinate with L1_ORCH</h3>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Tell ADE what you want to coordinate..."
              style={{
                flex: 1,
                padding: '15px',
                background: 'rgba(0, 0, 0, 0.8)',
                border: '1px solid #00ff88',
                borderRadius: '5px',
                color: '#00ff88',
                fontSize: '16px'
              }}
            />
            <button
              onClick={sendMessage}
              style={{
                padding: '15px 30px',
                background: 'linear-gradient(45deg, #00ff88, #00cc70)',
                color: '#000',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '16px'
              }}
            >
              🚀 Coordinate
            </button>
          </div>
        </div>

        <footer style={{
          textAlign: 'center',
          marginTop: '30px',
          padding: '20px',
          borderTop: '1px solid #333'
        }}>
          <p>Built with the coordination revolution | APML Protocol v1.0</p>
        </footer>
      </div>
    </>
  );
}