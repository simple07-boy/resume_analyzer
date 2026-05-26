function ATSCard({ title, value }) {
  const score = parseInt(value);

  const scoreColor =
    score >= 80
      ? 'text-green-400'
      : score >= 50
        ? 'text-yellow-400'
        : 'text-red-400';

  return (
    <div className='bg-gray-900 p-5 md:p-8 rounded-3xl'>
      <h2 className='text-2xl mb-4'>{title}</h2>

      <p className={`text-5xl md:text-7xl font-bold break-words ${scoreColor}`}>
        {value}
      </p>
    </div>
  );
}

export default ATSCard;
