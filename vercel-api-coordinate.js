// ADE Coordination API
// Handles human input and coordinates agent responses

import { v4 as uuidv4 } from 'uuid';

let coordinationLog = [];

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    const { type, content, timestamp } = req.body;
    
    // Create APML message from human input
    const humanMessage = {
      message_id: `msg-${Date.now()}-${uuidv4().slice(0, 8)}`,
      timestamp: timestamp || new Date().toISOString(),
      sender: {
        layer: "HUMAN",
        role: "USER", 
        instance_id: "web-interface"
      },
      recipient: {
        layer: "L1",
        role: "ORCH",
        instance_id: "l1-orch-002"
      },
      message_type: "brief",
      payload: {
        type: type,
        content: content,
        priority: "human_directive"
      }
    };
    
    // Log the coordination
    coordinationLog.push(humanMessage);
    
    // Simulate L1_ORCH response
    const orchResponse = await processCoordination(content);
    coordinationLog.push(orchResponse);
    
    res.status(200).json({
      success: true,
      message_id: humanMessage.message_id,
      response: orchResponse,
      coordination_log: coordinationLog.slice(-10) // Last 10 messages
    });
    
  } else if (req.method === 'GET') {
    res.status(200).json({
      coordination_log: coordinationLog.slice(-20) // Last 20 messages
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

async function processCoordination(humanInput) {
  // Simulate L1_ORCH processing human input
  const response = {
    message_id: `msg-${Date.now()}-${uuidv4().slice(0, 8)}`,
    timestamp: new Date().toISOString(),
    sender: {
      layer: "L1",
      role: "ORCH",
      instance_id: "l1-orch-002"
    },
    recipient: {
      layer: "HUMAN", 
      role: "USER",
      instance_id: "web-interface"
    },
    message_type: "result",
    payload: {
      coordination_action: analyzeInput(humanInput),
      agents_coordinated: ["L2_ADE_ARCHITECT", "L3_system_architect"],
      status: "processing",
      response: generateResponse(humanInput)
    }
  };
  
  return response;
}

function analyzeInput(input) {
  const lower = input.toLowerCase();
  
  if (lower.includes('create') || lower.includes('build')) {
    return 'creation_coordination';
  } else if (lower.includes('deploy') || lower.includes('publish')) {
    return 'deployment_coordination'; 
  } else if (lower.includes('fix') || lower.includes('bug')) {
    return 'maintenance_coordination';
  } else if (lower.includes('agent') || lower.includes('coordinate')) {
    return 'agent_coordination';
  } else {
    return 'general_coordination';
  }
}

function generateResponse(input) {
  const templates = [
    `L1_ORCH coordinating: "${input}" - Delegating to L2/L3 agents for execution`,
    `APML coordination initiated for: "${input}" - Agent ecosystem processing`,
    `Revolutionary coordination activated: "${input}" - Multi-layer agent response incoming`,
    `Strategic coordination: "${input}" - L2_ADE_ARCHITECT and L3 specialists engaged`
  ];
  
  return templates[Math.floor(Math.random() * templates.length)];
}