'use client';
import React, { useRef, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const JoinRoomPage = () => {
  const roomIdRef = useRef(null);
  const passwordRef = useRef(null);
  const [roomId, setRoomId] = useState(null);
  const currentSocket = useRef(null);
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState(null);
  const [quizz, setQuizz] = useState(null);
  const [timer, setTimer] = useState(null);
  const [lastResponse, setLastResponse] = useState({
    isGood: null,
    correctAnswer: null,
  });
  const [score, setScore] = useState(null);


  useEffect(() => {
    currentSocket.current = io('http://localhost:4001/room', {
      extraHeaders: {
        Authorization: localStorage.getItem('token'),
      },
    });

    currentSocket.current.on('joinedRoom', (data) => {
      if (data?.error) {
        return alert(data.error);
      }
      setQuizz(data.data);
    });

    // Listen for "roomStart" event to launch the room
    currentSocket.current.on('roomStart', () => {
      // Add logic to navigate to the room or handle the room start event
    });

    // Listen for "nextQuestion" event to receive a question
    currentSocket.current.on('nextQuestion', (data) => {
      setQuestion(data.question);
      setRoomId(data.roomId);
      // Add logic to display the question to the user
    });

    currentSocket.current.on('timer', (data) => {
      setTimer(data);
    });

    currentSocket.current.on('answerResponse', (data) => {
      if (data?.error) {
        return alert(data.error);
      }
      setLastResponse(data);
    });

    currentSocket.current.on('roomEnd', () => {
      setQuestion(null);
      setLastResponse({isGood: null, correctAnswer: null});
      setAnswer(null);
      setTimer(null);
      setScore('Calculating score...');
      currentSocket.current.emit('getScore', { roomId });
    });

    currentSocket.current.on('score', (data) => {
      console.log(data);
      setScore(data);
    });

    return () => {
      // Disconnect from the websocket when the component unmounts
      if (currentSocket.current) {
        currentSocket.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (timer === 0) {
      currentSocket.current.emit('answer', { answerId: answer.id, roomId: roomId, questionId: question.id });
      setQuestion(null);
    }
  }, [timer]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const roomId = roomIdRef.current.value;
    const password = passwordRef.current.value;
    const payload = {
      roomId,
      password: password || null,
    };
    // Emit "joinRoom" event with roomId and password
    currentSocket.current.emit('joinRoom', payload);
  };

  return <>
    {!quizz &&
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">Join Room</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="roomId" className="block text-gray-700 font-bold mb-2">
              Room ID
            </label>
            <input
              type="text"
              id="roomId"
              ref={roomIdRef}
              className="border rounded-md px-4 py-2 w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              ref={passwordRef}
              className="border rounded-md px-4 py-2 w-full"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Join
          </button>
        </form>
      </div>
    }
    {quizz &&
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">Quizz</h2>
        <h3 className="text-lg font-bold mb-4">{quizz.title}</h3>
        <p>{quizz.description}</p>
      </div>
    }
    {question && (
      <div className="mt-8">
        <h3 className="text-lg font-bold mb-4">Question</h3>
        <p>{question.question}</p>
        {question.answers.map((answer, index) => (
          <label key={index} className="block">
            {answer.answer}
          <input type="radio"
                 key={index}
                 name="answer"
                 value={answer.answer}
                 className="mr-2"
                 onChange={() => setAnswer(answer)}
          />
          </label>
        ))}
      </div>
    )}
    {null !== lastResponse.isGood && (
      <div className="mt-8">
        <h3 className="text-lg font-bold mb-4">Last Response</h3>
        <p>{lastResponse.isGood ? 'Bien joué!': 'Dommage :('}</p>
        <p>{lastResponse.correctAnswer.answer}</p>
      </div>
    )}
    {timer && (
      <div className="mt-8">
        <h3 className="text-lg font-bold mb-4">Timer</h3>
        <p>{timer}</p>
      </div>
    )}
    {score && (
      <div className="mt-8">
        <h3 className="text-lg font-bold mb-4">Score</h3>
        <p>{score}</p>
      </div>
    )}

  </>;
};

export default JoinRoomPage;