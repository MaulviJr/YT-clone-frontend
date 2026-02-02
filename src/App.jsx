import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import authService from './api/auth.service';
import { login, logout } from './store/authSlice';

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    authService.getCurrentUser()
      .then((userData) => {
        if (userData) {
          dispatch(login(userData.data));
        } else {
          dispatch(logout());
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return !loading ? (
    <div>
      <h1>Hello</h1>
    </div>
  ) : <h1>Loading...</h1>;
}

export default App
