"use client";

import React, { useState } from 'react';
import Link from 'next/link';

const QuizList = ({ quizzes }) => {
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [roomInfo, setRoomInfo] = useState({
    password: '',
    userLimit: 0,
    quizId: null,
  });
  const handleCreateRoom = (quizId) => {
    setShowCreateRoom(true);
    setRoomInfo({ ...roomInfo, quizId });
  };

  const handleSubmit = () => {
    // Perform validation and submit the room information
    fetch('http://localhost:4001/room', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
      },
      body: JSON.stringify({
        password: roomInfo.password || null,
        userLimit: roomInfo.userLimit !== 0 ? roomInfo.userLimit : null,
        quizzId: roomInfo.quizId,
      }),
    })
      .then((response) => {
        if (response.ok) {
          // Room created successfully, handle accordingly
          alert('Room created successfully');
        } else {
          alert(response.message);
        }
      })
      .catch((error) => {
        // Handle fetch error
        console.error('Error creating room:', error);
      });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Quiz List</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {quizzes.map((quiz, index) => (
          <div key={index} className="border rounded-md p-4">
            <h3 className="text-lg font-bold mb-2">{quiz.title}</h3>
            <p className="text-gray-600 mb-2">{quiz.description}</p>
            <p className="text-gray-600 mb-2">Randomize Questions: {quiz.randomizeQuestion ? 'Yes' : 'No'}</p>
            <Link href={`/quizz/${quiz.id}`}>Details</Link>
            <button
              onClick={() => handleCreateRoom(quiz.id)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Create Room
            </button>
          </div>
        ))}
      </div>
      {showCreateRoom && (
        <div className="mt-4">
          <h3 className="text-lg font-bold mb-2">Create Room</h3>
          <input
            type="text"
            placeholder="Password"
            value={roomInfo.password}
            onChange={(e) => setRoomInfo({ ...roomInfo, password: e.target.value })}
            className="border rounded-md px-2 py-1 mr-2 mb-2"
          />
          <input
            type="number"
            placeholder="User Limit"
            value={roomInfo.userLimit}
            onChange={(e) => setRoomInfo({ ...roomInfo, userLimit: parseInt(e.target.value) })}
            className="border rounded-md px-2 py-1 mr-2 mb-2"
          />
          <button
            onClick={handleSubmit}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Create
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizList;