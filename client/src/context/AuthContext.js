import { createContext } from 'react';

export default createContext({
  token: null,
  userId: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false
});
