import { useState } from 'react';

function CreateQuestionForm({quizzId}) {
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [incorrectAnswers, setIncorrectAnswers] = useState([]);

  const handleAddIncorrectAnswer = () => {
    setIncorrectAnswers([...incorrectAnswers, '']);
  };

  const handleRemoveIncorrectAnswer = (index) => {
    const newIncorrectAnswers = [...incorrectAnswers];
    newIncorrectAnswers.splice(index, 1);
    setIncorrectAnswers(newIncorrectAnswers);
  };

  const handleIncorrectAnswerChange = (index, value) => {
    const newIncorrectAnswers = [...incorrectAnswers];
    newIncorrectAnswers[index] = value;
    setIncorrectAnswers(newIncorrectAnswers);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const textAnswers = [correctAnswer, ...incorrectAnswers];

    const answers = textAnswers.map((answer, index) => {
      return {
        answer,
        isCorrect: index === 0
      };
    });

    const payload = {
      question: title,
      duration,
      answers,
      quizzId
    };
fetch(`http://localhost:4001/quizz/${quizzId}/question`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      },
      body: JSON.stringify(payload)
    })
      .then((res) => res)
      .then((data) => {
        if (data.error) {
          alert(data.error);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-gray-100 shadow-md rounded-md">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
          <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 p-2 block w-full border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" required />
        </div>
        <div className="mb-4">
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700">Duration in seconds</label>
          <input type="number" id="duration" value={duration} onChange={(e) => setDuration(e.target.value)} className="mt-1 p-2 block w-full border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" required />
        </div>
        <div className="mb-4">
          <label htmlFor="correctAnswer" className="block text-sm font-medium text-gray-700">Correct Answer</label>
          <input type="text" id="correctAnswer" value={correctAnswer} onChange={(e) => setCorrectAnswer(e.target.value)} className="mt-1 p-2 block w-full border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" required />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Incorrect Answers</label>
          {incorrectAnswers.map((answer, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <input type="text" value={answer} onChange={(e) => handleIncorrectAnswerChange(index, e.target.value)} className="p-2 block w-full border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" required />
              <button type="button" onClick={() => handleRemoveIncorrectAnswer(index)} className="p-2 bg-red-500 text-white rounded-md">Remove</button>
            </div>
          ))}
          <button type="button" onClick={handleAddIncorrectAnswer} className="p-2 bg-green-500 text-white rounded-md">Add Incorrect Answer</button>
        </div>
        <div>
          <button type="submit" className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Submit</button>
        </div>
      </form>
    </div>
  );
}

export default CreateQuestionForm;