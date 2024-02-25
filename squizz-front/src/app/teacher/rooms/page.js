"use client";

import React, { useState, useEffect, useRef } from 'react';
import newSocket from '@/service/socket';
import RoomItem from '@/components/RoomItem';

const RoomsPage = () => {
  const currentSocket = useRef(null);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    currentSocket.current = newSocket('room');
    currentSocket.current.emit('getAllRooms');
    currentSocket.current.on('retieveAllRooms', (data) => {
      setRooms(data);
    });

    currentSocket.current.on('roomEnd', (data) => {
      console.log('ok');
      currentSocket.current.emit('getScores', { roomId: data.id });
    });
    currentSocket.current.on('scores', (data) => {
      console.log(data);
      setRooms((rooms) =>
        rooms.map((room) => {
          if (room.id === data.roomId) {
            return { ...room, scores: data };
          }
          return room;
        })
      );
    });
    return () => {
      currentSocket.current.disconnect();
    };
  }, []);

  const handleStartQuiz = (id) => {
    currentSocket.current.emit('start', { id });
  };
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Your Rooms</h2>
      {rooms.map((room, index) => (
        <RoomItem key={index} room={room} onStartQuiz={handleStartQuiz} />
      ))}
    </div>
  );
};

export default RoomsPage;