import { FaCheck, FaTimes } from 'react-icons/fa';
import CreateQuestionForm from '@/components/CreateQuestionForm'; // Import icons from react-icons
const QuestionList = ({ questions, quizzId }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h2>Questions du quizz </h2>
      {questions.map((question, index) => (
        <div key={index} className="mb-8">
          <h2 className="text-xl font-bold mb-4">{question.question}</h2>
          <p className="text-gray-600 mb-2">Duration: {question.duration} seconds</p>
          <ul>
            {question.answers.map((answer, answerIndex) => (
              <li key={answerIndex} className="flex items-center mb-2">
                answer: {answer.answer} -
                {answer.isCorrect ? <FaCheck style={{ color: 'green' }} /> : <FaTimes style={{ color: 'red' }} />}
              </li>
            ))}
          </ul>
        </div>
      ))}
      <CreateQuestionForm quizzId={quizzId}/>
    </div>
  );
};

export default QuestionList;