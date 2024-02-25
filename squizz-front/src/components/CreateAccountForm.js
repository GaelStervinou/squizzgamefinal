import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateAccountForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('student');
  const navigate = useRouter();

  const handleCreateAccount = () => {
    fetch('http://localhost:4001/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password, name, role })
    })
      .then((res) => res.json())
      .then((data) => {
        localStorage.setItem('token', data.access_token);
        navigate.push('/');
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <select
        onChange={(e) => setRole(e.target.value)}
      >
        <option value="student">Student</option>
        <option value="teacher">Teacher</option>
      </select>
      <button onClick={handleCreateAccount}>Créer un compte</button>
    </div>
  );
};
