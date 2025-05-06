import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../redux/userSlice';
import { loginUser } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';
import loginPage from '../assets/loginPage.svg';
import { toast } from 'react-toastify';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { fetchProfile } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const role = ['owner', 'accounts', 'admin'];

  const handleLogin = async () => {
    setError('');
    try {
      const data = await loginUser({ email, password });
      localStorage.setItem('token', data.access_token);
      dispatch(login({ user: { email }, token: data.access_token }));
      await fetchProfile();
      toast.success('Login successful!');

      const user_data = localStorage.getItem('person');
      if (user_data) {
        const dt = JSON.parse(user_data);
        if (role.includes(dt.role)) {
          navigate('/dashboard');
        } else {
          navigate('/cart');
        }
      }
    } catch (err) {
      toast.error('Invalid email or password');
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Left Side (Illustration) */}
      <div className="md:w-1/2 w-full bg-[#4393fa] text-white flex flex-col justify-center items-center p-6 md:p-10">
        <h1 className="text-3xl md:text-5xl font-bold mb-2 text-center">Welcome to Our Store</h1>
        <p className="text-lg md:text-2xl mb-1">Organise your daily task</p>
        <p className="text-base md:text-xl italic mb-4">In a “simple way”</p>
        <img
          src={loginPage}
          alt="Illustration"
          className="w-3/4 md:w-2/3 max-w-xs md:max-w-md"
        />
      </div>

      {/* Right Side (Login Form) */}
      <div className="md:w-1/2 w-full flex justify-center items-center bg-white py-10 px-4 md:px-0">
        <div className="w-full max-w-md bg-white p-6 md:p-8 rounded-xl shadow-lg">
          <h2 className="text-xl md:text-2xl font-semibold mb-6 text-center md:text-left">Sign-in to your account</h2>

          {error && (
            <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-1">E-Mail *</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Enter Password *</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span
                  className="absolute right-3 top-2.5 cursor-pointer text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </span>
              </div>
            </div>

            <div className="text-sm text-[#2a84f7] hover:underline text-right">
              <a href="#">Forgot Password?</a>
            </div>

            <button
              onClick={handleLogin}
              className="w-full bg-[#2a84f7] hover:bg-[#4393fa] text-white py-2 rounded-md font-medium transition"
            >
              Login
            </button>

            <p className="text-xs text-gray-500 mt-2 text-center">
              By Continuing, You Agree With Our{' '}
              <span className="text-[#2a84f7] underline cursor-pointer">
                Terms & Conditions
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
