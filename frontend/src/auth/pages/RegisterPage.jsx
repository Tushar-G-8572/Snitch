import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router';

export const RegisterPage = () => {
  const [role, setRole] = useState('Buyer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const { register, loading, error } = useAuth();

  const handleRegister = (e) => {
    e.preventDefault();
    setLocalError('');
    if (password !== confirmPassword) {
      setLocalError("Passwords don't match.");
      return;
    }
    register({ name, email, password, role });
  };

  return (
    <div className="dark-mesh min-h-screen flex flex-col justify-center items-center px-4 pt-16 pb-10">
      {/* Brand */}
      <Link to="/" className="font-serif text-3xl font-semibold tracking-[0.25em] text-on-surface mb-10 animate-fade-up">
        SNITCH
      </Link>

      <div className="card-dark w-full max-w-md p-8 md:p-10 animate-fade-up-delay">
        {/* Header */}
        <div className="mb-8">
          <p className="badge-gold mb-3">New Member</p>
          <h2 className="font-serif text-3xl text-on-surface mt-2">Create Account</h2>
          <p className="text-on-surface-variant font-sans text-sm mt-2 leading-relaxed">
            Join Snitch for exclusive drops and early access.
          </p>
        </div>

        {/* Role Selector */}
        <div className="flex border-b border-outline-variant mb-8">
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

        {/* Errors */}
        {(localError || error) && (
          <div className="mb-5 px-4 py-3 bg-red-900/20 border border-red-700/30 text-red-400 text-sm font-sans rounded-sm">
            {localError || error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-xs text-on-surface-variant font-sans tracking-widest uppercase mb-2">
              Full Name
            </label>
            <input
              id="reg-name"
              type="text"
              required
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-dark"
            />
          </div>

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

          <div>
            <label className="block text-xs text-on-surface-variant font-sans tracking-widest uppercase mb-2">
              Password
            </label>
            <input
              id="reg-password"
              type="password"
              required
              placeholder="Min. 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-dark"
            />
          </div>

          <div>
            <label className="block text-xs text-on-surface-variant font-sans tracking-widest uppercase mb-2">
              Confirm Password
            </label>
            <input
              id="reg-confirm"
              type="password"
              required
              placeholder="Repeat password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input-dark"
            />
          </div>

          <p className="text-xs text-on-surface-variant font-sans leading-relaxed">
            By creating an account you agree to our{' '}
            <a href="#" className="text-primary hover:underline">Terms of Service</a>{' '}
            and{' '}
            <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
          </p>

          <button
            id="reg-submit"
            type="submit"
            disabled={loading}
            className="btn-primary mt-2"
          >
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-8 text-center text-sm font-sans text-on-surface-variant">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:text-primary-dim transition-colors font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};
