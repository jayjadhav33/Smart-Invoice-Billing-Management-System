import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../../api/authApi';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

// ── Validation Rules ─────────────────────────
const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/;
const PASSWORD_REGEX =
  /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

const validateForm = (form) => {
  // Username checks
  if (!form.username.trim())
    return 'Username is required';
  if (form.username.trim().length < 3)
    return 'Username must be at least 3 characters';
  if (form.username.trim().length > 20)
    return 'Username must be at most 20 characters';
  if (!USERNAME_REGEX.test(form.username.trim()))
    return 'Username can only contain letters, numbers and underscore (_)';

  // Password checks
  if (!form.password)
    return 'Password is required';
  if (form.password.length < 8)
    return 'Password must be at least 8 characters';
  if (!/[A-Z]/.test(form.password))
    return 'Password must contain at least 1 uppercase letter';
  if (!/\d/.test(form.password))
    return 'Password must contain at least 1 number';
  if (!/[!@#$%^&*._-]/.test(form.password))
    return 'Password must contain at least 1 special character (!@#$%^&*@._-)';

  return null; // no error
};

// ── Password Strength Checker ────────────────
const getPasswordStrength = (password) => {
  if (!password) return null;
  let score = 0;
  if (password.length >= 8)          score++;
  if (/[A-Z]/.test(password))        score++;
  if (/\d/.test(password))           score++;
  if (/[!@#$%^&*]/.test(password))   score++;

  if (score <= 1) return { label: 'Weak',   color: '#ef4444', width: '25%'  };
  if (score === 2) return { label: 'Fair',   color: '#f59e0b', width: '50%'  };
  if (score === 3) return { label: 'Good',   color: '#3b82f6', width: '75%'  };
  return           { label: 'Strong', color: '#22c55e', width: '100%' };
};

const Register = () => {
  const [form, setForm] = useState({
    username: '', password: '', role: 'STAFF'
  });
  const [loading, setLoading]   = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { login }  = useAuth();
  const navigate   = useNavigate();

  const handle = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault();

    // ── Frontend validation first ────────────
    const error = validateForm(form);
    if (error) {
      toast.error(error);
      return;
    }

    setLoading(true);
    try {
      const res = await registerUser(form);
      login(res.data);
      toast.success('Account created!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(
        err.response?.data?.messages?.username ||
        err.response?.data?.messages?.password ||
        err.response?.data?.message ||
        'Registration failed');
    } finally { setLoading(false); }
  };

  const handleGoogleLogin = () => {
    window.location.href =
      'http://localhost:8080/oauth2/authorization/google';
  };

  const strength = getPasswordStrength(form.password);

  // ── Password rule checklist ──────────────
  const rules = [
    { label: 'At least 8 characters',         pass: form.password.length >= 8 },
    { label: '1 uppercase letter (A-Z)',       pass: /[A-Z]/.test(form.password) },
    { label: '1 number (0-9)',                 pass: /\d/.test(form.password) },
    { label: '1 special character (!@#$%^&*@._-)', pass: /[!@#$%^&*@._-]/.test(form.password) },
  ];

  return (
    <div className="auth-page">
      <div className="auth-card">

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

        <h2>Create account</h2>
        <p className="subtitle">
          Start managing your invoices for free
        </p>

        {/* Google Button */}
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
            or register with username
          </span>
          <div style={{ flex: 1, height: '1px',
                        background: '#e5e7eb' }} />
        </div>

        {/* Normal Register Form */}
        <form onSubmit={submit}>

          {/* Username */}
          <div className="form-group">
            <label>Username</label>
            <input
              className="form-control"
              name="username"
              value={form.username}
              onChange={handle}
              placeholder="3-20 chars, letters/numbers/_"
              maxLength={20}
              required
            />
            {/* Live username hint */}
            {form.username.length > 0 && (
              <small style={{
                display: 'block',
                marginTop: '4px',
                fontSize: '11px',
                color: form.username.length >= 3
                  && form.username.length <= 20
                  && USERNAME_REGEX.test(form.username)
                  ? '#16a34a' : '#dc2626'
              }}>
                {form.username.length}/20
                {form.username.length >= 3
                  && USERNAME_REGEX.test(form.username)
                  ? ' ✓ Valid username'
                  : form.username.length < 3
                  ? ' — min 3 characters'
                  : ' — only letters, numbers, _'}
              </small>
            )}
          </div>

          {/* Password */}
          <div className="form-group">
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                className="form-control"
                type={showPass ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handle}
                placeholder="Min 8 chars"
                style={{ paddingRight: '40px' }}
                required
              />
              {/* Show/Hide toggle */}
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{
                  position: 'absolute',
                  right: '10px', top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none', border: 'none',
                  cursor: 'pointer', color: '#9ca3af',
                  fontSize: '12px', fontWeight: '500'
                }}>
                {showPass ? 'Hide' : 'Show'}
              </button>
            </div>

            {/* Password strength bar */}
            {form.password.length > 0 && strength && (
              <div style={{ marginTop: '8px' }}>
                <div style={{
                  height: '4px',
                  background: '#f3f4f6',
                  borderRadius: '2px',
                  overflow: 'hidden',
                  marginBottom: '5px'
                }}>
                  <div style={{
                    height: '100%',
                    width: strength.width,
                    background: strength.color,
                    borderRadius: '2px',
                    transition: 'width 0.3s ease'
                  }} />
                </div>
                <small style={{
                  fontSize: '11px',
                  fontWeight: '600',
                  color: strength.color
                }}>
                  Password strength: {strength.label}
                </small>
              </div>
            )}

            {/* Password rules checklist */}
            {form.password.length > 0 && (
              <div style={{
                marginTop: '8px',
                padding: '10px 12px',
                background: '#f9fafb',
                borderRadius: '8px',
                border: '1px solid #f3f4f6'
              }}>
                {rules.map((rule, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '11px',
                    color: rule.pass ? '#16a34a' : '#6b7280',
                    marginBottom: i < rules.length - 1
                      ? '4px' : '0'
                  }}>
                    <span style={{
                      fontSize: '13px',
                      lineHeight: 1
                    }}>
                      {rule.pass ? '✅' : '○'}
                    </span>
                    {rule.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Role */}
          <div className="form-group">
            <label>Role</label>
            <select
              className="form-control"
              name="role"
              value={form.role}
              onChange={handle}>
              <option value="STAFF">Staff</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <button
            className="btn btn-primary"
            disabled={loading}>
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-link">
          Already have an account?{' '}
          <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;