import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import authService from './api/auth.service';
import { login, logout } from './store/authSlice';
import SignUp from './components/SignUp';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    // Attempt to get the current user to see if they are already logged in
    // authService.getCurrentUser()
      // .then((userData) => {
      //   if (userData) {
      //     // Accessing userData.data based on your ApiResponse structure
      //     dispatch(login(userData));
      //   } else {
      //     dispatch(logout());
      //   }
      // })
      // .catch((err) => {
      //   console.log("App :: useEffect :: error", err);
      // })
      // .finally(() => setLoading(false)); // This line is required to show your UI
  }, [dispatch]);

  return !false ? (
    <>
      {/* <SignUpPage/> */}
      {/* <SignUp/> */}
      <LoginPage/>
    </>
  ) : (
    <h1>Loading...</h1>
  );
}
export default App
