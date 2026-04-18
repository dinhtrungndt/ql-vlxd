import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './routers';
import { getMeAction } from './stores/redux/actions/authActions';
import { loadSession } from './utils/storage';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const session = loadSession();
    if (session && session.token) {
      dispatch(getMeAction());
    }
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1e293b',
            color: '#fff',
            border: '1px solid #334155',
          },
          success: {
            iconTheme: { primary: '#10b981', secondary: '#fff' }
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#fff' }
          }
        }}
      />
      <AppRouter />
    </BrowserRouter>
  );
};

export default App;
