import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link, Navigate, useNavigate } from 'react-router';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';
import { useSelector } from 'react-redux';

export const LoginPage = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { handleLogin } = useAuth();
  const user = useSelector(state => state.auth.user);

  const loading = useSelector(state => state.auth.loading)
  const error = useSelector(state => state.auth.error)

  const handleSubmit = async (e) => {
    e.preventDefault();
    const flag = await handleLogin(email, password)
    if (flag) {
      navigate('/')
    }
  };

  if (loading) {
    return (
      <h1>Loading...</h1>
    )
  }

  return (
    <div className="dark-mesh min-h-screen flex flex-col justify-center items-center px-4 pt-16 pb-10">
      {/* Brand */}
      <Link to="/" className="font-serif text-3xl font-semibold tracking-[0.25em] text-on-surface mb-10 animate-fade-up">
        SNITCH
      </Link>

      <div className="card-dark w-full max-w-md p-8 md:p-10 animate-fade-up-delay">
        {/* Header */}
        <div className="mb-8">
          <p className="badge-gold mb-3">Member Access</p>
          <h2 className="font-serif text-3xl text-on-surface mt-2">Welcome Back</h2>
          <p className="text-on-surface-variant font-sans text-sm mt-2 leading-relaxed">
            Sign in to access your account and orders.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 px-4 py-3 bg-red-900/20 border border-red-700/30 text-red-400 text-sm font-sans rounded-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs text-on-surface-variant font-sans tracking-widest uppercase mb-2">
              Email Address
            </label>
            <input
              id="login-email"
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-dark"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs text-on-surface-variant font-sans tracking-widest uppercase">
                Password
              </label>
              <a href="#" className="text-xs text-on-surface-variant hover:text-primary transition-colors font-sans">
                Forgot?
              </a>
            </div>
            <input
              id="login-password"
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-dark"
            />
          </div>

          <button
            id="login-submit"
            type="submit"
            disabled={loading}
            className="btn-primary mt-2"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        {/* Divider */}
        <div className="divider-text">
          <span>Or continue with</span>
        </div>

        {/* Social buttons */}
        <div className="flex gap-4">
          <a href="/api/auth/google" id="login-google" className="btn-outline" >
            <FcGoogle size={18} />
            <span>Google</span>
          </a>
          <a id="login-apple" className="btn-outline">
            <FaApple size={18} className="text-on-surface" />
            <span>Apple</span>
          </a>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-sm font-sans text-on-surface-variant">
          New to Snitch?{' '}
          <Link to="/register" className="text-primary hover:text-primary-dim transition-colors font-medium">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};
