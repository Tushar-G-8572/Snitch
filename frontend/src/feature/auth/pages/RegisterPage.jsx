import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router';
import { FcGoogle } from 'react-icons/fc';
import { FaApple, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useSelector } from 'react-redux';

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

  const { handleRegister} = useAuth();
  const loading = useSelector(state=> state.auth.loading);
  const error = useSelector(state=> state.auth.error);
  const user = useSelector(state => state.auth.user);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    if (password !== confirmPassword) {
      setLocalError("Passwords don't match.");
      return;
    }
    // console.log(fullName,username,email,password,role)
  const flag = await handleRegister(fullName,username,email,password,role);
  if(flag){
      navigate('/');
  }
  };


  return (
    <div className="dark-mesh min-h-screen flex flex-col justify-center items-center px-4 py-10">
      {/* Brand */}
      <Link
        to="/"
        className="font-serif text-3xl font-semibold tracking-[0.25em] text-on-surface mb-8 animate-fade-up"
      >
        SNITCH
      </Link>

      <div className="card-dark w-full max-w-lg animate-fade-up-delay" style={{ borderRadius: 0 }}>
        {/* Top accent bar */}
        <div style={{ height: 2, background: 'linear-gradient(90deg, #e8c97e 0%, transparent 100%)' }} />

        <div className="p-8 md:p-10">
          {/* Header */}
          <div className="mb-7">
            <p className="badge-gold mb-3">New Member</p>
            <h2 className="font-serif text-3xl text-on-surface">Create Account</h2>
            <p className="text-on-surface-variant font-sans text-sm mt-2 leading-relaxed">
              Join Snitch for exclusive drops and early access.
            </p>
          </div>

          {/* Role Selector */}
          <div className="flex border-b border-outline-variant mb-7">
            {['Buyer', 'Seller'].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`role-tab ${role === r ? 'active' : ''}`}
              >
                {r}
              </button>
            ))}
          </div>

          {/* Social Buttons */}
          <div className="flex gap-3 mb-6">
            <a href="/api/auth/google" id="reg-google" className="btn-outline">
              <FcGoogle size={17} />
              <span>Google</span>
            </a>
            <a id="reg-apple" className="btn-outline">
              <FaApple size={17} className="text-on-surface" />
              <span>Apple</span>
            </a>
          </div>

          {/* Divider */}
          <div className="divider-text mb-6">
            <span>Or register with email</span>
          </div>

          {/* Errors */}
          {(localError || error) && (
            <div className="mb-5 px-4 py-3 bg-red-900/20 border border-red-700/30 text-red-400 text-sm font-sans rounded-sm">
              {localError || error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-xs text-on-surface-variant font-sans tracking-widest uppercase mb-2">
                Full Name
              </label>
              <input
                id="reg-name"
                type="text"
                required
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setfullName(e.target.value)}
                className="input-dark"
              />
            </div>

            <div>
              <label className="block text-xs text-on-surface-variant font-sans tracking-widest uppercase mb-2">
                User Name
              </label>
              <input
                id="reg-name"
                type="text"
                required
                placeholder="John123"
                value={username}
                onChange={(e) => setName(e.target.value)}
                className="input-dark"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs text-on-surface-variant font-sans tracking-widest uppercase mb-2">
                Email Address
              </label>
              <input
                id="reg-email"
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-dark"
              />
            </div>

            {/* Password row (side-by-side on md+) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-on-surface-variant font-sans tracking-widest uppercase mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="reg-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Min. 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-dark pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs text-on-surface-variant font-sans tracking-widest uppercase mb-2">
                  Confirm
                </label>
                <div className="relative">
                  <input
                    id="reg-confirm"
                    type={showConfirm ? 'text' : 'password'}
                    required
                    placeholder="Repeat password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="input-dark pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors"
                    tabIndex={-1}
                  >
                    {showConfirm ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Password strength indicator */}
            {password && (
              <div className="flex gap-1.5 mt-1">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    style={{
                      height: 2,
                      flex: 1,
                      borderRadius: 999,
                      background: i < Math.min(Math.floor(password.length / 3), 4)
                        ? password.length < 6
                          ? '#ef4444'
                          : password.length < 9
                          ? '#f59e0b'
                          : '#e8c97e'
                        : '#2e2e2e',
                      transition: 'background 0.3s',
                    }}
                  />
                ))}
                <span className="text-xs text-on-surface-variant font-sans ml-1">
                  {password.length < 6 ? 'Weak' : password.length < 9 ? 'Fair' : 'Strong'}
                </span>
              </div>
            )}

   

            <button
              id="reg-submit"
              type="submit"
              disabled={loading}
              className="btn-primary mt-1"
            >
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-7 text-center text-sm font-sans text-on-surface-variant">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:text-primary-dim transition-colors font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
