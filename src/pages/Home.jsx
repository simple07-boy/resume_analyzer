import Navbar from '../components/Navbar';
import UploadBox from '../components/UploadBox';

function Home() {
  const token = localStorage.getItem('token');

  return (
    <div className='min-h-screen bg-black text-white'>
      <Navbar />

      <div className='flex flex-col items-center justify-center py-20 px-5'>
        <h1 className='text-4xl md:text-6xl font-bold text-center mb-8'>
          AI Resume Analyzer
        </h1>

        <p className='text-gray-400 text-center max-w-2xl mb-10 text-base md:text-xl px-2'>
          Upload your resume and get: ATS Score, skill analysis, interview
          questions, and improvement suggestions instantly.
        </p>

        {!token && (
          <div className='bg-red-500/20 border border-red-500 text-red-400 px-6 py-4 rounded-2xl mb-8'>
            Login first to upload resume.
          </div>
        )}

        <UploadBox />
      </div>
    </div>
  );
}

export default Home;
