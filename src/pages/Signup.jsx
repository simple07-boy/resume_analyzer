import { useState } from 'react';

import { useNavigate, Link } from 'react-router-dom';

import API from '../services/api';

import { FaEye, FaEyeSlash } from 'react-icons/fa';

import { toast } from 'react-toastify';

function Signup() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    return regex.test(password);
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!formData.email.endsWith('@gmail.com')) {
      toast.warning('Please enter valid Gmail address.');

      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.warning('Passwords do not match.');

      return;
    }

    if (!validatePassword(formData.password)) {
      toast.warning(`Password must contain:
- 8 characters
- 1 uppercase
- 1 lowercase
- 1 digit
- 1 special character`);

      return;
    }

    try {
      const response = await API.post('/signup', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      console.log(response.data);

      if (response.data.message === 'User already exists') {
        toast.info('Account already exists. Redirecting to login...');

        setTimeout(() => {
          navigate('/login');
        }, 2000);

        return;
      }

      toast.success('Signup successful');

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.log(error);

      toast.error('Signup failed');
    }
  };

  return (
    <div className='min-h-screen bg-black flex items-center justify-center p-4'>
      <form
        onSubmit={handleSignup}
        className='bg-gray-900 p-6 md:p-10 rounded-3xl w-full max-w-[400px]'
      >
        <h1 className='text-white text-4xl font-bold mb-8 text-center'>
          Signup
        </h1>

        <input
          type='text'
          name='name'
          placeholder='Enter Name'
          onChange={handleChange}
          required
          className='w-full p-4 rounded-xl mb-5 bg-black text-white border border-gray-700'
        />

        <input
          type='email'
          name='email'
          placeholder='Enter Gmail'
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

        <div className='relative'>
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            name='confirmPassword'
            placeholder='Confirm Password'
            onChange={handleChange}
            required
            className='w-full p-4 rounded-xl mb-5 bg-black text-white border border-gray-700'
          />

          <button
            type='button'
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className='absolute right-4 top-5 text-white'
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <button className='w-full bg-green-500 p-4 rounded-xl font-bold'>
          Signup
        </button>

        <p className='text-gray-400 mt-5 text-center'>
          Already have account?
          <Link to='/login' className='text-green-400 ml-2'>
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;
