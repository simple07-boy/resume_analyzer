import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import generatePDF from '../utils/generatePDF';
import ATSCard from '../components/ATSCard';
import QuestionCard from '../components/QuestionCard';

function Dashboard() {
  const [atsData, setAtsData] = useState(null);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const storedData = localStorage.getItem('atsData');

    if (storedData && storedData !== 'undefined') {
      try {
        setAtsData(JSON.parse(storedData));
      } catch (error) {
        console.log(error);
        localStorage.removeItem('atsData');
      }

      const storedQuestions = localStorage.getItem('questions');
      if (storedQuestions && storedQuestions !== 'undefined') {
        try {
          setQuestions(JSON.parse(storedQuestions));
        } catch (error) {
          console.log(error);
          localStorage.removeItem('questions');
        }
      }
    }
  }, []);

  if (!atsData) {
    return (
      <div className='min-h-screen bg-black text-white flex items-center justify-center text-3xl'>
        No ATS Data Found
      </div>
    );
  }

  const chartData = [
    {
      name: 'Matched',
      value: atsData.matched_skills.length,
    },
    {
      name: 'Missing',
      value: atsData.missing_skills.length,
    },
  ];

  return (
    <div className='min-h-screen bg-black text-white'>
      <h1 className='text-3xl md:text-5xl font-bold mb-8 md:mb-10'>
        Resume Dashboard
      </h1>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8'>
        <ATSCard title='ATS Score' value={`${atsData.ats_score}%`} />

        <div className='bg-gray-900 p-8 rounded-3xl'>
          <h2 className='text-2xl mb-6'>Skills Analysis</h2>

          <PieChart width={220} height={220}>
            <Pie data={chartData} dataKey='value' outerRadius={80}>
              <Cell fill='#22c55e' />
              <Cell fill='#ef4444' />
            </Pie>

            <Tooltip />
          </PieChart>
        </div>

        {atsData.suggestions.length > 0 && (
          <div className='bg-gray-900 p-8 rounded-3xl'>
            <h2 className='text-2xl mb-4'>Suggestions</h2>

            <ul className='space-y-4 text-gray-300'>
              {atsData.suggestions.map((suggestion, index) => (
                <li key={index}>✔ {suggestion}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div
        className={`grid gap-6 md:gap-8 mt-10 ${
          atsData.missing_skills.length > 0
            ? 'md:grid-cols-2'
            : 'md:grid-cols-1'
        }`}
      >
        <div className='bg-gray-900 p-8 rounded-3xl'>
          <h2 className='text-3xl font-bold mb-5 text-green-400'>
            Matched Skills
          </h2>

          <div className='flex flex-wrap gap-4'>
            {atsData.matched_skills.map((skill, index) => (
              <div key={index} className='bg-green-500 px-4 py-2 rounded-xl'>
                {skill}
              </div>
            ))}
          </div>
        </div>

        {atsData.missing_skills.length > 0 && (
          <div className='bg-gray-900 p-8 rounded-3xl'>
            <h2 className='text-3xl font-bold mb-5 text-red-400'>
              Missing Skills
            </h2>

            <div className='flex flex-wrap gap-4'>
              {atsData.missing_skills.map((skill, index) => (
                <div key={index} className='bg-red-500 px-4 py-2 rounded-xl'>
                  {skill}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className='bg-gray-900 p-8 rounded-3xl mt-10'>
        <h2 className='text-4xl font-bold mb-8'>AI Interview Questions</h2>

        <div className='space-y-5'>
          {questions.map((question, index) => (
            <QuestionCard key={index} question={question} index={index} />
          ))}
        </div>
        <button
          onClick={() =>
            generatePDF({
              ats_score: atsData.ats_score,
              matched_skills: atsData.matched_skills,
              missing_skills: atsData.missing_skills,
              suggestions: atsData.suggestions,
              interview_questions: questions,
            })
          }
          className='bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl mt-8'
        >
          Download Report
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
