function QuestionCard({ question, index }) {
  return (
    <div className='bg-black p-4 md:p-5 rounded-2xl border border-gray-800'>
      <p className='text-base md:text-lg break-words'>
        {index + 1}. {question}
      </p>
    </div>
  );
}

export default QuestionCard;
