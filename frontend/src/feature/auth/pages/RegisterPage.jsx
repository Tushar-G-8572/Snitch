import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router';
import { FcGoogle } from 'react-icons/fc';
import { FaApple, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import Loader from '../../shared/components/Loader';

/* ── Brand tokens (mirrors Dashboard / EditProduct) ── */
const C = {
  bg: '#fbf9f6',
  text: '#1b1c1a',
  muted: '#7A6E63',
  faint: '#B5ADA3',
  border: '#d0c5b5',
  gold: '#C9A96E',
  serif: "'Cormorant Garamond', serif",
  sans: "'Inter', sans-serif",
};

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('Buyer');
  const [username, setName] = useState('');
  const [fullName, setfullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { handleRegister } = useAuth();
  const loading = useSelector(state => state.auth.loading);
  const error = useSelector(state => state.auth.error);
  const user = useSelector(state => state.auth.user);

  if(loading){
    return (
      <Loader />
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    if (password !== confirmPassword) {
      setLocalError("Passwords don't match.");
      return;
    }
    const flag = await handleRegister(fullName, username, email, password, role);
    if (flag) {
      navigate('/');
    }
  };

  /* ── Shared input helpers ── */
  const inputBase =
    'w-full bg-transparent outline-none py-3 text-sm transition-colors duration-300 placeholder:text-[#d0c5b5]';
  const inputStyle = { color: C.text, borderBottom: `1px solid ${C.border}`, fontFamily: C.sans };
  const onFocus = e => (e.target.style.borderBottomColor = C.gold);
  const onBlur  = e => (e.target.style.borderBottomColor = C.border);

  /* ── Password strength ── */
  const strengthLevel = !password
    ? 0
    : password.length < 6
    ? 1
    : password.length < 9
    ? 2
    : 4;
  const strengthColors = ['#d0c5b5', '#ef4444', '#f59e0b', '#C9A96E', '#C9A96E'];
  const strengthLabel  = ['', 'Weak', 'Fair', 'Strong', 'Strong'];

  return (
    <>
      {/* Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />

      <div
        className="min-h-screen flex flex-col items-center justify-center px-4 py-16 selection:bg-[#C9A96E]/20"
        style={{ backgroundColor: C.bg, fontFamily: C.sans }}
      >
        {/* ── Brand mark ── */}
        <Link
          to="/"
          className="text-lg font-medium tracking-[0.4em] uppercase mb-12 transition-colors duration-200"
          style={{ fontFamily: C.serif, color: C.gold }}
        >
          Snitch
        </Link>

        {/* ── Card ── */}
        <div
          className="w-full max-w-lg px-6 sm:px-10 py-10 sm:py-12"
          style={{ backgroundColor: '#fff', border: `1px solid ${C.border}` }}
        >

          {/* Header */}
          <div className="mb-8">
            <span
              className="text-[10px] uppercase tracking-[0.28em] font-medium"
              style={{ color: C.gold, fontFamily: C.sans }}
            >
              New Member
            </span>
            <h1
              className="text-4xl font-light leading-tight mt-2"
              style={{ fontFamily: C.serif, color: C.text }}
            >
              Create Account
            </h1>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: C.muted }}>
              Join Snitch for exclusive drops and early access.
            </p>
          </div>

          {/* ── Role Selector ── */}
          <div className="flex mb-8" style={{ borderBottom: `1px solid ${C.border}` }}>
            {['Buyer', 'Seller'].map(r => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className="flex-1 py-3 text-[11px] uppercase tracking-[0.22em] font-medium transition-all duration-300"
                style={{
                  color: role === r ? C.gold : C.faint,
                  borderBottom: role === r ? `1px solid ${C.gold}` : '1px solid transparent',
                  marginBottom: '-1px',
                  backgroundColor: role === r ? 'rgba(201,169,110,0.05)' : 'transparent',
                  fontFamily: C.sans,
                }}
              >
                {r}
              </button>
            ))}
          </div>

          {/* ── Social Buttons ── */}
          <div className="flex flex-col sm:flex-row gap-3 mb-7">
            <a
              href="/api/auth/google"
              id="reg-google"
              className="flex-1 flex items-center justify-center gap-2 py-3 text-[11px] uppercase tracking-[0.18em] font-medium transition-all duration-300"
              style={{ border: `1px solid ${C.border}`, color: C.muted, fontFamily: C.sans }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.gold; e.currentTarget.style.color = C.text; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted; }}
            >
              <FcGoogle size={16} />
              <span>Google</span>
            </a>
          </div>

          {/* ── Divider ── */}
          <div className="relative flex items-center mb-7">
            <div className="flex-1 h-px" style={{ backgroundColor: C.border }} />
            <span
              className="px-4 text-[10px] uppercase tracking-[0.2em]"
              style={{ color: C.faint, fontFamily: C.sans }}
            >
              Or register with email
            </span>
            <div className="flex-1 h-px" style={{ backgroundColor: C.border }} />
          </div>

          {/* ── Errors ── */}
          {(localError || error) && (
            <div
              className="mb-6 px-4 py-3 text-sm"
              style={{
                border: '1px solid #f3c0b8',
                backgroundColor: '#fdf4f3',
                color: '#a3493e',
                fontFamily: C.sans,
              }}
            >
              {localError || error}
            </div>
          )}

          {/* ── Form ── */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-7">

            {/* Full Name */}
            <div className="flex flex-col gap-2">
              <label
                className="text-[10px] uppercase tracking-[0.22em] font-medium"
                style={{ color: C.muted }}
              >
                Full Name
              </label>
              <input
                id="reg-fullname"
                type="text"
                required
                placeholder="John Doe"
                value={fullName}
                onChange={e => setfullName(e.target.value)}
                className={inputBase}
                style={inputStyle}
                onFocus={onFocus}
                onBlur={onBlur}
              />
            </div>

            {/* Username */}
            <div className="flex flex-col gap-2">
              <label
                className="text-[10px] uppercase tracking-[0.22em] font-medium"
                style={{ color: C.muted }}
              >
                Username
              </label>
              <input
                id="reg-username"
                type="text"
                required
                placeholder="john123"
                value={username}
                onChange={e => setName(e.target.value)}
                className={inputBase}
                style={inputStyle}
                onFocus={onFocus}
                onBlur={onBlur}
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label
                className="text-[10px] uppercase tracking-[0.22em] font-medium"
                style={{ color: C.muted }}
              >
                Email Address
              </label>
              <input
                id="reg-email"
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className={inputBase}
                style={inputStyle}
                onFocus={onFocus}
                onBlur={onBlur}
              />
            </div>

            {/* Password row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Password */}
              <div className="flex flex-col gap-2">
                <label
                  className="text-[10px] uppercase tracking-[0.22em] font-medium"
                  style={{ color: C.muted }}
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="reg-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Min. 8 characters"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className={`${inputBase} pr-8`}
                    style={inputStyle}
                    onFocus={onFocus}
                    onBlur={onBlur}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 transition-colors duration-200"
                    style={{ color: C.faint }}
                    tabIndex={-1}
                    onMouseEnter={e => (e.currentTarget.style.color = C.gold)}
                    onMouseLeave={e => (e.currentTarget.style.color = C.faint)}
                  >
                    {showPassword ? <FaEyeSlash size={13} /> : <FaEye size={13} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col gap-2">
                <label
                  className="text-[10px] uppercase tracking-[0.22em] font-medium"
                  style={{ color: C.muted }}
                >
                  Confirm
                </label>
                <div className="relative">
                  <input
                    id="reg-confirm"
                    type={showConfirm ? 'text' : 'password'}
                    required
                    placeholder="Repeat password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className={`${inputBase} pr-8`}
                    style={inputStyle}
                    onFocus={onFocus}
                    onBlur={onBlur}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(v => !v)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 transition-colors duration-200"
                    style={{ color: C.faint }}
                    tabIndex={-1}
                    onMouseEnter={e => (e.currentTarget.style.color = C.gold)}
                    onMouseLeave={e => (e.currentTarget.style.color = C.faint)}
                  >
                    {showConfirm ? <FaEyeSlash size={13} /> : <FaEye size={13} />}
                  </button>
                </div>
              </div>
            </div>

            {/* ── Password strength indicator ── */}
            {password && (
              <div className="flex items-center gap-1.5 -mt-4">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 h-px rounded-full transition-all duration-300"
                    style={{
                      backgroundColor: i < strengthLevel ? strengthColors[strengthLevel] : C.border,
                    }}
                  />
                ))}
                <span
                  className="text-[10px] uppercase tracking-[0.15em] ml-1 w-10 shrink-0"
                  style={{ color: strengthLevel > 0 ? strengthColors[strengthLevel] : C.faint, fontFamily: C.sans }}
                >
                  {strengthLabel[strengthLevel]}
                </span>
              </div>
            )}

            {/* Submit */}
            <button
              id="reg-submit"
              type="submit"
              disabled={loading}
              className="w-full py-4 text-[11px] uppercase tracking-[0.3em] font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-1"
              style={{ backgroundColor: C.text, color: C.bg, fontFamily: C.sans }}
              onMouseEnter={e => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = C.gold;
                  e.currentTarget.style.color = C.text;
                }
              }}
              onMouseLeave={e => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = C.text;
                  e.currentTarget.style.color = C.bg;
                }
              }}
            >
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-8 text-center text-sm" style={{ color: C.muted, fontFamily: C.sans }}>
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium transition-colors duration-200"
              style={{ color: C.gold }}
              onMouseEnter={e => (e.currentTarget.style.color = C.text)}
              onMouseLeave={e => (e.currentTarget.style.color = C.gold)}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};
