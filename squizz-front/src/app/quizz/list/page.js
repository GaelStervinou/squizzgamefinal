"use client";

import { useEffect, useRef, useState } from 'react';
import newSocket from '@/service/socket';
import QuizList from '@/components/QuizList';
import Link from 'next/link';

export default function QuizPage() {
  const currentSocket = useRef(null);
  const [quizzList, setQuizzList] = useState([]);
  useEffect(() => {
    currentSocket.current = newSocket('quizz');
    currentSocket.current.emit('getQuizzList');
    currentSocket.current.on('retrieveQuizzList', (data) => {
      setQuizzList(data);
    });
    return () => {
      currentSocket.current.disconnect();
    };
  }, []);
  return (
    <div>
      <Link href={'/quizz/create'} className="text-blue-600 hover:underline inline-block border-b-2 border-transparent hover:border-blue-600 transition-colors">Create Quizz</Link>
      <Link href={'/teacher/rooms'} className="text-blue-600 hover:underline inline-block border-b-2 border-transparent hover:border-blue-600 transition-colors">See all rooms</Link>
      <QuizList quizzes={quizzList} />
    </div>
  );
}