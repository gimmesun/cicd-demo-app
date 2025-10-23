import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [message, setMessage] = useState('Loading...');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Backend health check
    fetch('/api/health')
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(err => setMessage('Backend connection failed'));

    // Fetch users
    fetch('/api/users')
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>🚀 CI/CD Demo App</h1>
        <p>{message}</p>
        <p>Welcome to the CI/CD Demo Application!</p>
        <div className="users">
          <h2>Users:</h2>
          {users.map(user => (
            <div key={user.id} className="user-card">
              <p><strong>{user.name}</strong></p>
              <p>{user.email}</p>
            </div>
          ))}
        </div>
      </header>
    </div>
  );
}

export default App;
