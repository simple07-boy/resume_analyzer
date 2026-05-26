import { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('name');

    if (token && name) {
      setUser({
        token,
        name,
      });
    }
  }, []);

  const login = (token, name) => {
    localStorage.setItem('token', token);
    localStorage.setItem('name', name);

    setUser({
      token,
      name,
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('name');

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
