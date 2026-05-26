import { useEffect, useState } from 'react';
import API from '../services/api';
import Navbar from '../components/Navbar';
import generatePDF from '../utils/generatePDF';
import { toast } from 'react-toastify';
import HistorySkeleton from '../components/HistorySkeleton';

function History() {
  const [resumes, setResumes] = useState([]);
  const [filteredResumes, setFilteredResumes] = useState([]);
  const [search, setSearch] = useState('');
  const [sortType, setSortType] = useState('latest');
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [newFilename, setNewFilename] = useState('');

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    let updatedResumes = [...resumes].reverse();

    updatedResumes.sort((a, b) => {
      return (b.is_favorite === true) - (a.is_favorite === true);
    });

    if (search.trim() !== '') {
      updatedResumes = updatedResumes.filter((resume) =>
        resume.filename.toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (sortType === 'highest') {
      updatedResumes.sort((a, b) => b.ats_score - a.ats_score);
    }

    setFilteredResumes(updatedResumes);
  }, [search, sortType, resumes]);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        setLoading(false);
        return;
      }

      const response = await API.get('/my-resumes', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response.data);

      const fetchedResumes = response.data.resumes || [];

      setResumes(fetchedResumes);
      setFilteredResumes(fetchedResumes);
    } catch (error) {
      console.log(error);
      setResumes([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteResume = async (id) => {
    try {
      const token = localStorage.getItem('token');

      await API.delete(`/delete-resume/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success('Resume deleted');

      setResumes((prev) => prev.filter((resume) => resume._id !== id));
    } catch (error) {
      console.log(error);

      toast.error('Delete failed');
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-black text-white'>
        <Navbar />

        <div className='p-10'>
          <h1 className='text-5xl font-bold mb-10'>Resume History</h1>

          <HistorySkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-black text-white'>
      <Navbar />

      <div className='p-4 md:p-10'>
        <h1 className='text-3xl md:text-5xl font-bold mb-8 md:mb-10'>
          Resume History
        </h1>
        <div className='flex flex-col md:flex-row gap-5 mb-10'>
          <input
            type='text'
            placeholder='Search resume...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='bg-gray-900 border border-gray-700 p-4 rounded-xl flex-1 text-white'
          />

          <select
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
            className='bg-gray-900 border border-gray-700 p-4 rounded-xl text-white'
          >
            <option value='latest'>Latest Upload</option>
            <option value='highest'>Highest ATS Score</option>
          </select>
        </div>

        {filteredResumes.length === 0 ? (
          <div className='bg-gray-900 p-10 rounded-3xl text-center'>
            <p className='text-2xl text-gray-400'>No resume history found</p>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8'>
            {filteredResumes.map((resume, index) => (
              <div
                key={index}
                className='bg-gray-900 p-5 md:p-8 rounded-3xl hover:border hover:border-green-500 transition overflow-hidden'
              >
                {editingId === resume._id ? (
                  <div className='flex gap-3 mb-4'>
                    <input
                      type='text'
                      value={newFilename}
                      onChange={(e) => setNewFilename(e.target.value)}
                      className='bg-black border border-gray-700 px-4 py-2 rounded-xl text-white w-full'
                    />

                    <button
                      onClick={async () => {
                        try {
                          const token = localStorage.getItem('token');

                          await API.put(
                            `/rename-resume/${resume._id}`,
                            {
                              new_name: newFilename,
                            },
                            {
                              headers: {
                                Authorization: `Bearer ${token}`,
                              },
                            },
                          );

                          toast.success('Resume renamed');

                          setEditingId(null);

                          fetchHistory();
                        } catch (error) {
                          console.log(error);

                          toast.error('Rename failed');
                        }
                      }}
                      className='bg-green-500 hover:bg-green-600 px-4 rounded-xl'
                    >
                      Save
                    </button>

                    <button
                      onClick={() => {
                        setEditingId(null);
                        setNewFilename('');
                      }}
                      className='bg-red-500 hover:bg-red-600 px-4 rounded-xl'
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <h2 className='text-2xl font-bold mb-4'>{resume.filename}</h2>
                )}

                <p
                  className={`text-4xl font-bold mb-5 ${
                    resume.ats_score >= 80
                      ? 'text-green-400'
                      : resume.ats_score >= 50
                        ? 'text-yellow-400'
                        : 'text-red-400'
                  }`}
                >
                  {resume.ats_score}%
                </p>

                {resume.matched_skills?.length > 0 && (
                  <div className='mb-5'>
                    <h3 className='text-xl mb-3'>Matched Skills</h3>

                    <div className='flex flex-wrap gap-3'>
                      {resume.matched_skills.map((skill, i) => (
                        <span
                          key={i}
                          className='bg-green-500 px-3 py-1 rounded-lg'
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {(resume.created_at || resume.createdAt) && (
                  <p className='text-gray-400 mt-5 mb-5'>
                    Uploaded:{' '}
                    {new Date(
                      resume.created_at || resume.createdAt,
                    ).toLocaleString()}
                  </p>
                )}

                <div className='flex flex-wrap gap-3 mt-6'>
                  <button
                    onClick={async () => {
                      try {
                        const token = localStorage.getItem('token');

                        await API.put(
                          `/favorite-resume/${resume._id}`,
                          {},
                          {
                            headers: {
                              Authorization: `Bearer ${token}`,
                            },
                          },
                        );

                        fetchHistory();
                      } catch (error) {
                        console.log(error);

                        toast.error('Failed to update favorite');
                      }
                    }}
                    className={`px-5 py-2 rounded-xl font-semibold ${
                      resume.is_favorite
                        ? 'bg-purple-500 hover:bg-purple-600'
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    {resume.is_favorite ? '⭐ Starred' : '☆ Star'}
                  </button>
                  <button
                    onClick={() => {
                      setEditingId(resume._id);

                      setNewFilename(resume.filename.replace('.pdf', ''));
                    }}
                    className='bg-purple-500 hover:bg-purple-600 px-5 py-2 rounded-xl font-semibold'
                  >
                    Rename
                  </button>
                  <button
                    onClick={() => deleteResume(resume._id)}
                    className='bg-red-500 hover:bg-red-600 px-5 py-2 rounded-xl font-semibold'
                  >
                    Delete
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        const token = localStorage.getItem('token');

                        const response = await API.get(
                          `/resume-link/${resume._id}`,
                          {
                            headers: {
                              Authorization: `Bearer ${token}`,
                            },
                          },
                        );

                        window.open(response.data.file_url, '_blank');
                      } catch (error) {
                        console.log(error);

                        toast.error('Failed to open resume');
                      }
                    }}
                    className='bg-yellow-500 hover:bg-yellow-600 px-5 py-2 rounded-xl font-semibold'
                  >
                    View Resume
                  </button>
                  <button
                    onClick={() => {
                      localStorage.setItem(
                        'atsData',
                        JSON.stringify({
                          ats_score: resume.ats_score,
                          matched_skills: resume.matched_skills,
                          missing_skills: resume.missing_skills,
                          suggestions: resume.suggestions,
                        }),
                      );

                      localStorage.setItem(
                        'questions',
                        JSON.stringify(resume.interview_questions || []),
                      );

                      window.location.href = '/dashboard';
                    }}
                    className='bg-green-500 hover:bg-green-600 px-5 py-2 rounded-xl font-semibold'
                  >
                    Open Report
                  </button>

                  <button
                    onClick={() =>
                      generatePDF({
                        ats_score: resume.ats_score,
                        matched_skills: resume.matched_skills,
                        missing_skills: resume.missing_skills,
                        suggestions: resume.suggestions,
                        interview_questions: resume.interview_questions || [],
                      })
                    }
                    className='bg-blue-500 hover:bg-blue-600 px-5 py-2 rounded-xl font-semibold'
                  >
                    Download PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default History;
