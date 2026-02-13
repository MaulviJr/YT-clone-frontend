import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import authService from './api/auth.service';
import { login, logout } from './store/authSlice';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './components/Header'; // Ensure path is correct
import Sidebar from './components/Sidebar';

function App() {
  const [loading, setLoading] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation();

  // Determine if we should show the sidebar (e.g., hide on login/signup)
  const showNav = !['/login', '/signup'].includes(location.pathname);

  useEffect(() => {
    authService.getCurrentUser()
      .then((userData) => {
        if (userData) {
          console.log(userData);
          dispatch(login({
        user: userData,
        accessToken: null,
        refreshToken: null
      }));
        } else {
          dispatch(logout());
        }
      })
      .catch((err) => console.log("App :: useEffect :: error", err))
      .finally(() => setLoading(false));
  }, [dispatch]);

 const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  if (loading) return <h1 className="p-4">Loading...</h1>;

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      {/* Persistent Header */}
      <Header onMenuClick={toggleSidebar} />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - only shown on non-auth pages */}
        {showNav && <Sidebar isCollapsed={isSidebarCollapsed} />}

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default App;