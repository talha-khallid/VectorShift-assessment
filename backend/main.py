from fastapi import FastAPI, Form, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from openai import AsyncOpenAI
from dotenv import load_dotenv
import sqlite3
import json
import os
from datetime import datetime

# Load .env from the main dir
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize SQLite Database
def init_db():
    conn = sqlite3.connect('workflow.db')
    c = conn.cursor()
    
    # Create workflows table
    c.execute('''CREATE TABLE IF NOT EXISTS workflows 
                 (id INTEGER PRIMARY KEY AUTOINCREMENT, 
                  name TEXT,
                  nodes_data TEXT, 
                  edges_data TEXT, 
                  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP)''')
                  
    # Create executions table
    c.execute('''CREATE TABLE IF NOT EXISTS executions 
                 (id INTEGER PRIMARY KEY AUTOINCREMENT, 
                  workflow_id INTEGER,
                  nodes_data TEXT, 
                  edges_data TEXT, 
                  result TEXT,
                  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)''')
                  
    # Attempt to add workflow_id to existing executions table if it doesn't exist
    try:
        c.execute("ALTER TABLE executions ADD COLUMN workflow_id INTEGER")
    except sqlite3.OperationalError:
        pass # Column likely already exists
        
    conn.commit()
    conn.close()

init_db()

class WorkflowPayload(BaseModel):
    workflow_id: Optional[int] = None
    nodes: List[Dict[str, Any]]
    edges: List[Dict[str, Any]]

class WorkflowCreatePayload(BaseModel):
    name: str

@app.get('/workflows')
async def get_workflows():
    conn = sqlite3.connect('workflow.db')
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    c.execute("SELECT id, name, created_at, updated_at FROM workflows ORDER BY updated_at DESC")
    rows = c.fetchall()
    conn.close()
    return [{"id": r["id"], "name": r["name"], "created_at": r["created_at"], "updated_at": r["updated_at"]} for r in rows]

@app.post('/workflows')
async def create_workflow(payload: WorkflowCreatePayload):
    conn = sqlite3.connect('workflow.db')
    c = conn.cursor()
    c.execute("INSERT INTO workflows (name, nodes_data, edges_data) VALUES (?, ?, ?)",
              (payload.name, "[]", "[]"))
    workflow_id = c.lastrowid
    conn.commit()
    conn.close()
    return {"id": workflow_id, "name": payload.name}

@app.get('/workflows/{workflow_id}')
async def get_workflow(workflow_id: int):
    conn = sqlite3.connect('workflow.db')
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    c.execute("SELECT * FROM workflows WHERE id = ?", (workflow_id,))
    row = c.fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="Workflow not found")
    return {
        "id": row["id"],
        "name": row["name"],
        "nodes": json.loads(row["nodes_data"] if row["nodes_data"] else "[]"),
        "edges": json.loads(row["edges_data"] if row["edges_data"] else "[]")
    }

@app.put('/workflows/{workflow_id}')
async def save_workflow(workflow_id: int, payload: WorkflowPayload):
    conn = sqlite3.connect('workflow.db')
    c = conn.cursor()
    c.execute("UPDATE workflows SET nodes_data = ?, edges_data = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
              (json.dumps(payload.nodes), json.dumps(payload.edges), workflow_id))
    conn.commit()
    conn.close()
    return {"status": "saved"}

@app.delete('/workflows/{workflow_id}')
async def delete_workflow(workflow_id: int):
    conn = sqlite3.connect('workflow.db')
    c = conn.cursor()
    c.execute("DELETE FROM workflows WHERE id = ?", (workflow_id,))
    c.execute("DELETE FROM executions WHERE workflow_id = ?", (workflow_id,))
    conn.commit()
    conn.close()
    return {"status": "deleted"}

@app.get('/workflows/{workflow_id}/executions')
async def get_executions(workflow_id: int):
    conn = sqlite3.connect('workflow.db')
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    c.execute("SELECT id, result, timestamp FROM executions WHERE workflow_id = ? ORDER BY timestamp DESC", (workflow_id,))
    rows = c.fetchall()
    conn.close()
    return [{"id": r["id"], "result": r["result"], "timestamp": r["timestamp"]} for r in rows]

@app.post('/pipelines/execute')
async def execute_pipeline(payload: WorkflowPayload):
    workflow_id = payload.workflow_id
    nodes = payload.nodes
    edges = payload.edges
    
    # 1. Find the Output Node
    output_nodes = [n for n in nodes if n['type'] == 'customOutput']
    if not output_nodes:
        return {"result": "Error: No output node found in the workflow."}
    
    output_node = output_nodes[0]
    
    # 2. Find incoming edge to Output Node to find Final Node (LLM)
    incoming_to_output = [e for e in edges if e['target'] == output_node['id']]
    if not incoming_to_output:
        return {"result": "Error: Output node is not connected to anything."}
        
    final_node_id = incoming_to_output[0]['source']
    llm_node = next((n for n in nodes if n['id'] == final_node_id), None)
    
    if not llm_node or llm_node['type'] != 'llm':
        return {"result": f"Error: Output must be connected to an LLM node. Found {llm_node['type'] if llm_node else 'None'}"}
        
    # 3. Find incoming edges to LLM Node in chronological order
    incoming_to_llm = [e for e in edges if e['target'] == llm_node['id']]
    
    # 4. Extract texts from source nodes
    texts = []
    for edge in incoming_to_llm:
        source_id = edge['source']
        source_node = next((n for n in nodes if n['id'] == source_id), None)
        if source_node and source_node['type'] == 'text':
            node_data = source_node.get('data', {})
            text_val = node_data.get('text', '')
            if text_val:
                texts.append(text_val)
                
    # 5. Get LLM configs
    llm_data = llm_node.get('data', {})
    prompt = llm_data.get('prompt', '')
    model = llm_data.get('model', 'deepseek-v4')
    
    # 6. Build the LLM Messages
    combined_texts = "\n\n---\n\n".join([f"Text {i+1}:\n{text}" for i, text in enumerate(texts)])
    system_content = f"{prompt}\n\nHere are the inputs:\n\n{combined_texts}"
    
    api_key = os.getenv("DEEPSEEK_API_KEY")
    if not api_key:
        result = f"[SIMULATION MODE - No DEEPSEEK_API_KEY found]\n\nModel: {model}\n\nProcessed System Prompt:\n{system_content}"
    else:
        try:
            client = AsyncOpenAI(api_key=api_key, base_url="https://api.deepseek.com")
            actual_model = "deepseek-chat"
            if model == 'deepseek-v4':
                actual_model = "deepseek-chat"
            elif model == 'deepseek-flash':
                actual_model = "deepseek-coder"
                
            response = await client.chat.completions.create(
                model=actual_model,
                messages=[{"role": "user", "content": system_content}],
            )
            result = response.choices[0].message.content
        except Exception as e:
            result = f"Error calling DeepSeek API: {str(e)}"
            
    # 7. Save to SQLite
    conn = sqlite3.connect('workflow.db')
    c = conn.cursor()
    c.execute("INSERT INTO executions (workflow_id, nodes_data, edges_data, result) VALUES (?, ?, ?, ?)",
              (workflow_id, json.dumps(nodes), json.dumps(edges), result))
    conn.commit()
    conn.close()
    
    return {"result": result}
