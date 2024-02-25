import React from 'react';

const RoomItem = ({ room, onStartQuiz }) => {
  console.log(room);
  const handleStartQuiz = () => {
    onStartQuiz(room.id);
  };
  return (
    <div className="border rounded-md p-4 mb-4">
      <p>Password: {room.password || 'No password'}</p>
      <p>User Limit: {room.userLimit || 'No limit'}</p>
      <p>Started: {room.isStarted ? 'Yes' : 'No'}</p>
      <p>Ended: {room.isEnded ? 'Yes' : 'No'}</p>
      <p>Quiz: {room.quizz.title}</p>

      {!room.isStarted && !room.isEnded && (
        <button
          onClick={handleStartQuiz}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-2 focus:outline-none focus:shadow-outline"
        >
          Start Quiz
        </button>
      )}
      {room.scores && (
        <div>
          <h3 className="text-lg font-bold mb-4">Scores</h3>
          {room.scores.scores.map((score, index) => (
            <p key={index}>
              {score.student.student.name}: {score.score + '/' + room.scores.total}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default RoomItem;