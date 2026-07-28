import numpy as np
import random
from datetime import datetime

class DigitalTwin:
    def __init__(self):
        self.state = {
            'status': 'operational',
            'network_health': 0.95,
            'threat_level': 'LOW',
            'active_connections': 120,
            'cpu_usage': 35.0,
            'memory_usage': 45.0,
            'disk_io': 25.0,
            'network_latency': 10.0
        }
        self.history = []
    
    def simulate(self, scenario='normal'):
        """Simulate digital twin state based on scenario"""
        
        # Base state with random variations
        state = {
            'status': 'operational',
            'timestamp': datetime.now().isoformat(),
            'network_health': round(random.uniform(0.8, 1.0), 3),
            'threat_level': random.choice(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
            'active_connections': random.randint(50, 200),
            'cpu_usage': round(random.uniform(10, 80), 1),
            'memory_usage': round(random.uniform(20, 70), 1),
            'disk_io': round(random.uniform(10, 50), 1),
            'network_latency': round(random.uniform(1, 20), 1)
        }
        
        # Modify based on scenario
        if scenario == 'attack':
            state['threat_level'] = 'CRITICAL'
            state['network_health'] = round(random.uniform(0.3, 0.6), 3)
            state['cpu_usage'] = round(random.uniform(70, 95), 1)
            state['network_latency'] = round(random.uniform(50, 200), 1)
            state['active_connections'] = random.randint(200, 500)
            state['status'] = 'compromised'
        
        elif scenario == 'recovery':
            state['threat_level'] = 'LOW'
            state['network_health'] = round(random.uniform(0.9, 1.0), 3)
            state['cpu_usage'] = round(random.uniform(10, 30), 1)
            state['active_connections'] = random.randint(30, 80)
            state['status'] = 'recovering'
        
        elif scenario == 'maintenance':
            state['cpu_usage'] = round(random.uniform(10, 25), 1)
            state['active_connections'] = random.randint(10, 40)
            state['threat_level'] = 'LOW'
            state['status'] = 'maintenance'
        
        self.state = state
        self.history.append(state)
        print(f"✅ Digital Twin simulated scenario: {scenario}")
        return state
    
    def get_state(self):
        """Get current twin state"""
        return self.state
    
    def update_state(self, updates):
        """Update twin state"""
        self.state.update(updates)
        self.state['last_update'] = datetime.now().isoformat()
        return self.state
    
    def get_history(self, limit=10):
        """Get history of states"""
        return self.history[-limit:]