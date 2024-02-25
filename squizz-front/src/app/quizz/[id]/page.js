'use client';
import { useEffect, useRef, useState } from 'react';
import newSocket from '@/service/socket';
import Link from 'next/link';
import QuestionList from '@/components/quizzQuestions';

export default function Quizz() {
  const url = window.location.href;
  const segments = url.split('/');
  const lastSegment = segments[segments.length - 1];
  const currentSocket = useRef(null);

  const [quizz, setQuizz] = useState(null);
  useEffect(() => {
    currentSocket.current = newSocket('quizz');

    currentSocket.current.emit('getQuizzById', { id: lastSegment });

    currentSocket.current.on('quizzById', (data) => {
      if (data.status === 'error') {
        return alert(data.message);
      }
      console.log(data);
      setQuizz(data);
    });
  }, []);

  const handleDelete = () => {
    currentSocket.current.emit('deleteQuizz', { id: lastSegment });
    currentSocket.current.on('quizzDeleted', (data) => {
      if (data.status === 'error') {
        return alert(data.message);
      }
      console.log(data);
      setQuizz(data);
    });
  }
  return <>
    {quizz &&
      <div>
        <h1>Titre: {quizz.title}</h1>
        <p>Description: {quizz.description}</p>
        <p>Randomized questions : {quizz.randomizeQuestions ? 'Yes' : 'No'}</p>
      </div>
    }
    {!quizz && <p>Loading...</p>}
    {quizz && <button>Start quizz</button>}
    {quizz && (
        <Link href={`/quizz/${quizz.id}/questions`}>Questions</Link>
      )
    }
    {quizz && (
        <Link href={`/quizz/${quizz.id}/results`}>Results</Link>
      )
    }
    {quizz && (
        <button onClick={handleDelete}>Delete</button>
      )
    }
    {quizz?.questions &&
      <QuestionList questions={quizz.questions} quizzId={quizz.id} />
    }
  </>;
}