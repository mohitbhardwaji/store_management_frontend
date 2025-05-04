import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { apiServerUrl } from "../constant/constants";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [person, setPerson] = useState(null);

  const fetchProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await axios.get(`${apiServerUrl}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPerson(res.data);
      localStorage.setItem('person', JSON.stringify(res.data)); 
    } catch (error) {
      setPerson(null);
      localStorage.removeItem('token');
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <AuthContext.Provider value={{ person, setPerson, fetchProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
