import React, { useRef, useState } from 'react';
import newSocket from '@/service/socket';
import { useRouter } from 'next/navigation';

export default function CreateQuizzForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [randomizeQuestions, setRandomizeQuestions] = useState(false);
  const currentSocket = useRef(null);
  const navigate = useRouter();

  const handleCreateQuizz = () => {
    currentSocket.current = newSocket('quizz');

    currentSocket.current.emit('create', {
      title,
      description,
      randomizeQuestions
    });

    currentSocket.current.on('createdQuizz', (data) => {
      if (data.status === 'error') {
        return alert(data.message);
      }
      navigate.push(`/quizz/${data.id}`);
    });
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Descrpition"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <label>Randomize questions</label>
      <input
        type="radio"
        name="randomizeQuestions"
        value="true"
        onChange={(e) => setRandomizeQuestions(e.target.value)}
      />
      <button onClick={handleCreateQuizz}>Login</button>
    </div>
  );
};
