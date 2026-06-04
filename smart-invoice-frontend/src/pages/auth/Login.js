import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../../api/authApi';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const Login = () => {
  const [form, setForm]     = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handle = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginUser(form);
      login(res.data);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(
        err.response?.data?.message || 'Invalid credentials');
    } finally { setLoading(false); }
  };

  const handleGoogleLogin = () => {
    // Redirect to Spring Boot's Google OAuth2 endpoint
    window.location.href =
      'http://localhost:8080/oauth2/authorization/google';
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        {/* Logo */}
        <div className="auth-logo">
          <div className="auth-logo-icon">
            <svg viewBox="0 0 24 24"
                 xmlns="http://www.w3.org/2000/svg">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"
                    fill="white"/>
              <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"
                    stroke="#0d9488" strokeWidth="1.5"
                    fill="none" strokeLinecap="round"/>
            </svg>
          </div>
          <span>SmartInvoice</span>
        </div>

        <h2>Welcome back</h2>
        <p className="subtitle">
          Sign in to your account to continue
        </p>

        {/* Google Login Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            padding: '11px 16px',
            border: '1.5px solid #e5e7eb',
            borderRadius: '10px',
            background: 'white',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            color: '#374151',
            marginBottom: '20px',
            transition: 'all 0.15s',
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = '#f9fafb';
            e.currentTarget.style.borderColor = '#d1d5db';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'white';
            e.currentTarget.style.borderColor = '#e5e7eb';
          }}>
          {/* Google SVG Icon */}
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4"
              d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 002.38-5.88c0-.57-.05-.66-.15-1.18z"/>
            <path fill="#34A853"
              d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 01-7.18-2.54H1.83v2.07A8 8 0 008.98 17z"/>
            <path fill="#FBBC05"
              d="M4.5 10.52a4.8 4.8 0 010-3.04V5.41H1.83a8 8 0 000 7.18l2.67-2.07z"/>
            <path fill="#EA4335"
              d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 001.83 5.4L4.5 7.49a4.77 4.77 0 014.48-3.3z"/>
          </svg>
          Continue with Google
        </button>

        {/* Divider */}
        <div style={{
          display: 'flex', alignItems: 'center',
          gap: '12px', marginBottom: '20px'
        }}>
          <div style={{ flex: 1, height: '1px',
                        background: '#e5e7eb' }} />
          <span style={{ fontSize: '12px',
                         color: '#9ca3af',
                         fontWeight: '500' }}>
            or sign in with username
          </span>
          <div style={{ flex: 1, height: '1px',
                        background: '#e5e7eb' }} />
        </div>

        {/* Normal Login Form */}
        <form onSubmit={submit}>
          <div className="form-group">
            <label>Username</label>
            <input
              className="form-control"
              name="username"
              value={form.username}
              onChange={handle}
              placeholder="Enter your username"
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              className="form-control"
              type="password"
              name="password"
              value={form.password}
              onChange={handle}
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            className="btn btn-primary"
            disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-link">
          No account?{' '}
          <Link to="/register">Create one free</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;