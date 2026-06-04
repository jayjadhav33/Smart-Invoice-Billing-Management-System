import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const OAuth2Success = () => {
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token    = searchParams.get('token');
    const username = searchParams.get('username');
    const role     = searchParams.get('role');
    const name     = searchParams.get('name');

    if (token && username) {
      // Store in auth context exactly like normal login
      login({ token, username, role });
      toast.success(`Welcome, ${name || username}! 👋`);
      navigate('/dashboard', { replace: true });
    } else {
      toast.error('Google login failed. Please try again.');
      navigate('/login', { replace: true });
    }
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0d9488, #065f46)',
      flexDirection: 'column',
      gap: '16px'
    }}>
      <div style={{
        width: '48px', height: '48px',
        border: '4px solid rgba(255,255,255,0.3)',
        borderTopColor: 'white',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />
      <p style={{ color: 'white', fontSize: '16px', fontWeight: '500' }}>
        Signing you in with Google...
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default OAuth2Success;