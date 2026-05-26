import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import API from '../services/api';

import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await API.post('/login', formData);

      console.log(response.data);

      if (response.data.message === 'Incorrect password') {
        toast.warning('Wrong password. Please enter correct password.');

        return;
      }

      if (response.data.message === 'User not found') {
        toast.warning('No account found with this email.');

        return;
      }

      login(response.data.token, response.data.name, response.data.email);

      toast.success('Login successful');

      navigate('/');
    } catch (error) {
      console.log(error);

      toast.error('Login failed');
    }
  };

  return (
    <div className='min-h-screen bg-black flex items-center justify-center p-4'>
      <form
        onSubmit={handleLogin}
        className='bg-gray-900 p-6 md:p-10 rounded-3xl w-full max-w-[400px]'
      >
        <h1 className='text-white text-4xl font-bold mb-8 text-center'>
          Login
        </h1>

        <input
          type='email'
          name='email'
          placeholder='Enter Email'
          onChange={handleChange}
          required
          className='w-full p-4 rounded-xl mb-5 bg-black text-white border border-gray-700'
        />

        <div className='relative'>
          <input
            type={showPassword ? 'text' : 'password'}
            name='password'
            placeholder='Enter Password'
            onChange={handleChange}
            required
            className='w-full p-4 rounded-xl mb-5 bg-black text-white border border-gray-700'
          />

          <button
            type='button'
            onClick={() => setShowPassword(!showPassword)}
            className='absolute right-4 top-5 text-white'
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <button className='w-full bg-green-500 p-4 rounded-xl font-bold'>
          Login
        </button>

        <p className='text-gray-400 mt-5 text-center'>
          Don't have account?
          <Link to='/signup' className='text-green-400 ml-2'>
            Signup
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
