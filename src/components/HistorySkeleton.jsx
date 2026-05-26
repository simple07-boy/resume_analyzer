function HistorySkeleton() {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8'>
      {[1, 2, 3, 4].map((item) => (
        <div key={item} className='bg-gray-900 p-8 rounded-3xl animate-pulse'>
          <div className='h-8 bg-gray-700 rounded w-2/3 mb-6'></div>

          <div className='h-12 bg-gray-700 rounded w-1/3 mb-8'></div>

          <div className='space-y-3 mb-8'>
            <div className='h-4 bg-gray-700 rounded'></div>
            <div className='h-4 bg-gray-700 rounded w-5/6'></div>
            <div className='h-4 bg-gray-700 rounded w-4/6'></div>
          </div>

          <div className='flex gap-4 mt-8'>
            <div className='h-10 w-24 bg-gray-700 rounded-xl'></div>

            <div className='h-10 w-32 bg-gray-700 rounded-xl'></div>

            <div className='h-10 w-32 bg-gray-700 rounded-xl'></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default HistorySkeleton;
