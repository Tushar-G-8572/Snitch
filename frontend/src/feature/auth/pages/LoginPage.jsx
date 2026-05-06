import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';
import { useSelector } from 'react-redux';

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

export const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { handleLogin } = useAuth();
  const user = useSelector(state => state.auth.user);
  const loading = useSelector(state => state.auth.loading);
  const error = useSelector(state => state.auth.error);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const flag = await handleLogin(email, password);
    if (flag) {
      navigate('/');
    }
  };

  /* ── Shared input helpers ── */
  const inputBase =
    'w-full bg-transparent outline-none py-3 text-sm transition-colors duration-300 placeholder:text-[#d0c5b5]';
  const inputStyle = {
    color: C.text,
    borderBottom: `1px solid ${C.border}`,
    fontFamily: C.sans,
  };
  const onFocus = e => (e.target.style.borderBottomColor = C.gold);
  const onBlur  = e => (e.target.style.borderBottomColor = C.border);

  if (loading) {
    return (
      <>
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: C.bg }}>
          <span className="text-xs uppercase tracking-[0.3em]" style={{ color: C.faint, fontFamily: C.sans }}>
            Signing in…
          </span>
        </div>
      </>
    );
  }

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
          className="text-xs font-medium tracking-[0.4em] uppercase mb-12 transition-colors duration-200"
          style={{ fontFamily: C.serif, color: C.gold, letterSpacing: '0.4em' }}
        >
          Snitch.
        </Link>

        {/* ── Card ── */}
        <div
          className="w-full max-w-md px-6 sm:px-10 py-10 sm:py-12"
          style={{ backgroundColor: '#fff', border: `1px solid ${C.border}` }}
        >
          {/* Gold top rule */}
          <div className="w-10 h-px mb-8" style={{ backgroundColor: C.gold }} />

          {/* Header */}
          <div className="mb-10">
            <span
              className="text-[10px] uppercase tracking-[0.28em] font-medium"
              style={{ color: C.gold, fontFamily: C.sans }}
            >
              Member Access
            </span>
            <h1
              className="text-4xl font-light leading-tight mt-2"
              style={{ fontFamily: C.serif, color: C.text }}
            >
              Welcome Back
            </h1>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: C.muted }}>
              Sign in to access your account and orders.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div
              className="mb-6 px-4 py-3 text-sm"
              style={{
                border: `1px solid #f3c0b8`,
                backgroundColor: '#fdf4f3',
                color: '#a3493e',
                fontFamily: C.sans,
              }}
            >
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            {/* Email */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="login-email"
                className="text-[10px] uppercase tracking-[0.22em] font-medium"
                style={{ color: C.muted }}
              >
                Email Address
              </label>
              <input
                id="login-email"
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

            {/* Password */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label
                  htmlFor="login-password"
                  className="text-[10px] uppercase tracking-[0.22em] font-medium"
                  style={{ color: C.muted }}
                >
                  Password
                </label>
                <a
                  href="#"
                  className="text-[10px] uppercase tracking-[0.15em] transition-colors duration-200"
                  style={{ color: C.faint }}
                  onMouseEnter={e => (e.currentTarget.style.color = C.gold)}
                  onMouseLeave={e => (e.currentTarget.style.color = C.faint)}
                >
                  Forgot?
                </a>
              </div>
              <input
                id="login-password"
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className={inputBase}
                style={inputStyle}
                onFocus={onFocus}
                onBlur={onBlur}
              />
            </div>

            {/* Submit */}
            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="w-full py-4 text-[11px] uppercase tracking-[0.3em] font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
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
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center my-8">
            <div className="flex-1 h-px" style={{ backgroundColor: C.border }} />
            <span
              className="px-4 text-[10px] uppercase tracking-[0.2em]"
              style={{ color: C.faint, fontFamily: C.sans }}
            >
              Or continue with
            </span>
            <div className="flex-1 h-px" style={{ backgroundColor: C.border }} />
          </div>

          {/* Social buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Google */}
            <a
              href="/api/auth/google"
              id="login-google"
              className="flex-1 flex items-center justify-center gap-2 py-3 text-[11px] uppercase tracking-[0.18em] font-medium transition-all duration-300"
              style={{ border: `1px solid ${C.border}`, color: C.muted, fontFamily: C.sans }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = C.gold;
                e.currentTarget.style.color = C.text;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = C.border;
                e.currentTarget.style.color = C.muted;
              }}
            >
              <FcGoogle size={16} />
              <span>Google</span>
            </a>
            {/* Apple */}
            <a
              id="login-apple"
              className="flex-1 flex items-center justify-center gap-2 py-3 text-[11px] uppercase tracking-[0.18em] font-medium transition-all duration-300 cursor-pointer"
              style={{ border: `1px solid ${C.border}`, color: C.muted, fontFamily: C.sans }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = C.gold;
                e.currentTarget.style.color = C.text;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = C.border;
                e.currentTarget.style.color = C.muted;
              }}
            >
              <FaApple size={16} style={{ color: C.text }} />
              <span>Apple</span>
            </a>
          </div>

          {/* Footer */}
          <p className="mt-8 text-center text-sm" style={{ color: C.muted, fontFamily: C.sans }}>
            New to Snitch?{' '}
            <Link
              to="/register"
              className="font-medium transition-colors duration-200"
              style={{ color: C.gold }}
              onMouseEnter={e => (e.currentTarget.style.color = C.text)}
              onMouseLeave={e => (e.currentTarget.style.color = C.gold)}
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};
