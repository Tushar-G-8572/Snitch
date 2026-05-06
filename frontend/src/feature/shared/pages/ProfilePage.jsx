import React, { useState } from 'react';
import { useSelector} from 'react-redux';
import { useNavigate, Link } from 'react-router';
import Navbar from '../components/Navbar';
import { useAuth } from '../../auth/hooks/useAuth';

const ProfilePage = () => {
    const user = useSelector(state => state.auth.user);
    const {handleLogout} = useAuth()
    const navigate = useNavigate();

    const handleLogoutSubmit = async() => {
        await handleLogout()
        navigate('/login');
    };

    if (!user) {
        return (
            <div style={{ backgroundColor: '#fbf9f6', minHeight: '100vh' }}>
                <Navbar />
                <div className="flex flex-col items-center justify-center" style={{ minHeight: 'calc(100vh - 68px)' }}>
                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', color: '#1b1c1a' }}>
                        Please sign in to view your profile.
                    </p>
                    <Link
                        to="/login"
                        className="mt-6 text-[10px] font-medium tracking-[0.2em] uppercase px-8 py-3 transition-opacity hover:opacity-80"
                        style={{ backgroundColor: '#1b1c1a', color: '#C9A96E' }}
                    >
                        Sign In
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <>
            <link
                href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:wght@300;400;500;600&display=swap"
                rel="stylesheet"
            />
            <div style={{ backgroundColor: '#fbf9f6', minHeight: '100vh', fontFamily: "'DM Sans', sans-serif" }}>
                <Navbar />

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-16 py-10 sm:py-16">

                    {/* ── Page Label ── */}
                    <div className="mb-8 sm:mb-10">
                        <span
                            className="block text-[10px] uppercase tracking-[0.28em] font-medium mb-2"
                            style={{ color: '#C9A96E' }}
                        >
                            Account
                        </span>
                        <h1
                            className="text-4xl font-light"
                            style={{ fontFamily: "'Cormorant Garamond', serif", color: '#1b1c1a' }}
                        >
                            My Profile
                        </h1>
                    </div>

                    {/* ── User Banner ── */}
                    <div
                        className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 mb-8 sm:mb-10 pb-6 sm:pb-8 border-b"
                        style={{ borderColor: '#e4e2df' }}
                    >
                        {/* Avatar */}
                        <div
                            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{
                                backgroundColor: '#1b1c1a',
                                color: '#C9A96E',
                                fontFamily: "'Cormorant Garamond', serif",
                                fontSize: '26px',
                            }}
                        >
                            {user.fullName?.charAt(0).toUpperCase()}
                        </div>

                        <div>
                            <p
                                style={{
                                    fontFamily: "'Cormorant Garamond', serif",
                                    fontSize: '26px',
                                    color: '#1b1c1a',
                                    lineHeight: 1,
                                }}
                            >
                                {user.fullName}
                            </p>
                            <p style={{ fontSize: '11px', color: '#7A6E63', marginTop: '5px', letterSpacing: '0.06em' }}>
                                {user.email}
                            </p>
                            <span
                                className="inline-block mt-2 text-[9px] tracking-[0.18em] uppercase px-2 py-0.5"
                                style={{ backgroundColor: '#f5f3f0', color: '#C9A96E' }}
                            >
                                {user.role === 'Seller' ? 'Seller' : 'Member'}
                            </span>
                        </div>
                    </div>

                    {/* ── Info Cards Grid ── */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                        <InfoCard label="Full Name" value={user.fullName} />
                        <InfoCard label="Email Address" value={user.email} small />
                        <InfoCard
                            label="Account Type"
                            value={user.role === 'Seller' ? 'Seller Account' : 'Member Account'}
                        />
                        <InfoCard
                            label="Member Since"
                            value={
                                user.createdAt
                                    ? new Date(user.createdAt).toLocaleDateString('en-IN', {
                                          year: 'numeric',
                                          month: 'long',
                                      })
                                    : 'April 2026'
                            }
                        />
                    </div>

                    {/* ── Divider ── */}
                    <div style={{ height: '1px', backgroundColor: '#e4e2df', marginBottom: '28px' }} />

                    {/* ── Quick Links ── */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                        <QuickLink
                            label="My Orders"
                            description="View and track all your orders"
                            icon={<OrderIcon />}
                            onClick={() => navigate('/orders')}
                        />
                        {user.role === 'Seller' && (
                            <QuickLink
                                label="Seller Dashboard"
                                description="Manage your products and sales"
                                icon={<DashboardIcon />}
                                onClick={() => navigate('/seller/dashboard')}
                            />
                        )}
                        <QuickLink
                            label="Edit Profile"
                            description="Update your name and details"
                            icon={<EditIcon />}
                            onClick={() => navigate('/update/profile')}
                        />
                    </div>

                    {/* ── Sign Out ── */}
                    <div className="pt-2">
                        <button
                            onClick={handleLogoutSubmit}
                            className="flex items-center gap-3 text-[10px] font-medium tracking-[0.2em] uppercase border px-8 py-3 transition-all group"
                            style={{
                                borderColor: '#e4e2df',
                                color: '#7A6E63',
                                background: 'none',
                                cursor: 'pointer',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.color = '#c0392b';
                                e.currentTarget.style.borderColor = '#f5c6c6';
                                e.currentTarget.style.background = '#fff5f5';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.color = '#7A6E63';
                                e.currentTarget.style.borderColor = '#e4e2df';
                                e.currentTarget.style.background = 'none';
                            }}
                        >
                            <LogoutIcon />
                            Sign Out
                        </button>
                    </div>
                </div>

                {/* ── Footer ── */}
                <footer className="border-t py-12 text-center mt-16" style={{ borderColor: '#e4e2df' }}>
                    <span
                        className="text-[10px] uppercase tracking-[0.35em]"
                        style={{ fontFamily: "'Cormorant Garamond', serif", color: '#C9A96E' }}
                    >
                        Snitch. © {new Date().getFullYear()}
                    </span>
                </footer>
            </div>
        </>
    );
};

/* ── Info Card ── */
const InfoCard = ({ label, value, small }) => (
    <div className="border p-5" style={{ borderColor: '#e4e2df', backgroundColor: '#fff' }}>
        <p
            style={{
                fontSize: '9px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: '#C9A96E',
                marginBottom: '8px',
            }}
        >
            {label}
        </p>
        <p
            style={{
                fontFamily: small ? "'DM Sans', sans-serif" : "'Cormorant Garamond', serif",
                fontSize: small ? '13px' : '18px',
                color: '#1b1c1a',
            }}
        >
            {value || '—'}
        </p>
    </div>
);

/* ── Quick Link Card ── */
const QuickLink = ({ label, description, icon, onClick }) => (
    <button
        onClick={onClick}
        className="text-left border p-5 flex items-center gap-4 w-full transition-all group"
        style={{
            borderColor: '#e4e2df',
            backgroundColor: '#fff',
            cursor: 'pointer',
            border: '1px solid #e4e2df',
        }}
        onMouseEnter={e => {
            e.currentTarget.style.borderColor = '#C9A96E';
            e.currentTarget.style.backgroundColor = '#fbf9f6';
        }}
        onMouseLeave={e => {
            e.currentTarget.style.borderColor = '#e4e2df';
            e.currentTarget.style.backgroundColor = '#fff';
        }}
    >
        <div
            className="w-10 h-10 flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: '#f5f3f0', color: '#C9A96E' }}
        >
            {icon}
        </div>
        <div>
            <p
                style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: '16px',
                    color: '#1b1c1a',
                }}
            >
                {label}
            </p>
            <p style={{ fontSize: '10px', color: '#7A6E63', marginTop: '2px', letterSpacing: '0.04em' }}>
                {description}
            </p>
        </div>
        <svg
            className="ml-auto flex-shrink-0"
            width="14"
            height="14"
            fill="none"
            stroke="#b0a99f"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
        >
            <polyline points="9 18 15 12 9 6" />
        </svg>
    </button>
);

/* ── Icons ── */
const OrderIcon = () => (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
        <rect x="9" y="3" width="6" height="4" rx="1" />
        <line x1="9" y1="12" x2="15" y2="12" />
        <line x1="9" y1="16" x2="13" y2="16" />
    </svg>
);
const DashboardIcon = () => (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
    </svg>
);
const EditIcon = () => (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
);
const LogoutIcon = () => (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
);

export default ProfilePage;