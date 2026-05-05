import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { useAuth } from '../../auth/hooks/useAuth';
import SearchBar from './SearchBar';

const Navbar = () => {
    const user = useSelector(state => state.auth.user);
    const cartItems = useSelector(state => state.cart?.cartProducts || []);
    const navigate = useNavigate();
    const [profileOpen, setProfileOpen] = useState(false);
    const profileRef = useRef(null);
    const {handleLogout} = useAuth()
    // Close profile dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogoutSubmit =  async() => {
        await handleLogout();
        setProfileOpen(false);
        navigate('/login');
    };

    const cartCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

    return (
        <>
            {/* Google Fonts */}
            <link
                href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:wght@300;400;500;600&display=swap"
                rel="stylesheet"
            />

            <nav
                className="sticky top-0 z-50 border-b"
                style={{
                    backgroundColor: 'rgba(251,249,246,0.92)',
                    backdropFilter: 'blur(12px)',
                    borderColor: '#e4e2df',
                    fontFamily: "'DM Sans', sans-serif",
                }}
            >
                <div className="max-w-7xl mx-auto px-6 lg:px-16 xl:px-24 h-16 flex items-center justify-between">

                    {/* ── Logo ── */}
                    <Link
                        to="/"
                        className="text-lg font-medium tracking-[0.3em] uppercase transition-opacity hover:opacity-75"
                        style={{ fontFamily: "'Cormorant Garamond', serif", color: '#C9A96E' }}
                    >
                        Snitch.
                    </Link>

                    {/* ── Center Nav Links ── */}
                    <div className="hidden md:flex items-center gap-8">
                        {[
                            { label: 'Collection', to: '/' },
                            { label: 'Men', to: '/' },
                            { label: 'Women', to: '/' },
                            { label: 'New Arrivals', to: '/' },
                        ].map(({ label, to }) => (
                            <Link
                                key={label}
                                to={to}
                                className="relative text-[10px] font-medium tracking-[0.2em] uppercase transition-colors duration-200 group"
                                style={{ color: '#7A6E63' }}
                            >
                                <span className="group-hover:text-[#C9A96E] transition-colors">{label}</span>
                                <span
                                    className="absolute -bottom-px left-0 h-px w-0 group-hover:w-full transition-all duration-300"
                                    style={{ backgroundColor: '#C9A96E' }}
                                />
                            </Link>
                        ))}

                        {/* Orders — only for logged-in users */}
                        {user && (
                            <Link
                                to="/orders"
                                className="relative text-[10px] font-medium tracking-[0.2em] uppercase transition-colors duration-200 group"
                                style={{ color: '#7A6E63' }}
                            >
                                <span className="group-hover:text-[#C9A96E] transition-colors">Orders</span>
                                <span
                                    className="absolute -bottom-px left-0 h-px w-0 group-hover:w-full transition-all duration-300"
                                    style={{ backgroundColor: '#C9A96E' }}
                                />
                            </Link>
                        )}
                    </div>

                    {/* ── Right Actions ── */}
                    <div className="flex items-center gap-1">

                        {/* Search */}
                        <SearchBar />

                        {/* Cart */}
                        <button
                            onClick={() => navigate('/cart-items')}
                            className="relative p-2 transition-colors duration-200"
                            style={{ color: '#7A6E63' }}
                            title="Cart"
                        >
                            <svg
                                className="hover:text-[#C9A96E] transition-colors"
                                width="18" height="18" fill="none"
                                stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"
                            >
                                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <path d="M16 10a4 4 0 01-8 0" />
                            </svg>
                            {cartCount > 0 && (
                                <span
                                    className="absolute top-0.5 right-0.5 flex items-center justify-center rounded-full text-white"
                                    style={{
                                        width: '16px', height: '16px',
                                        fontSize: '8px', fontWeight: 600,
                                        backgroundColor: '#C9A96E',
                                    }}
                                >
                                    {cartCount}
                                </span>
                            )}
                        </button>

                        {/* Profile / Auth */}
                        {user ? (
                            <div className="relative ml-1" ref={profileRef}>
                                {/* Avatar Button */}
                                <button
                                    onClick={() => setProfileOpen(prev => !prev)}
                                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 hover:scale-105"
                                    style={{
                                        fontFamily: "'Cormorant Garamond', serif",
                                        fontSize: '15px',
                                        backgroundColor: profileOpen ? '#C9A96E' : '#1b1c1a',
                                        color: profileOpen ? '#fff' : '#C9A96E',
                                    }}
                                    title="Profile"
                                >
                                    {user.fullName?.charAt(0).toUpperCase()}
                                </button>

                                {/* Dropdown */}
                                {profileOpen && (
                                    <div
                                        className="absolute right-0 top-[calc(100%+12px)] w-52 border shadow-xl flex flex-col"
                                        style={{
                                            backgroundColor: '#fff',
                                            borderColor: '#e4e2df',
                                            boxShadow: '0 8px 32px rgba(27,28,26,0.1)',
                                        }}
                                    >
                                        {/* User Info */}
                                        <div
                                            className="flex items-center gap-3 p-4 border-b"
                                            style={{ borderColor: '#f0ede9' }}
                                        >
                                            <div
                                                className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                                                style={{
                                                    backgroundColor: '#1b1c1a', color: '#C9A96E',
                                                    fontFamily: "'Cormorant Garamond', serif", fontSize: '16px',
                                                }}
                                            >
                                                {user.fullName?.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '15px', color: '#1b1c1a' }}>
                                                    {user.fullName}
                                                </p>
                                                <p style={{ fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#C9A96E' }}>
                                                    {user.role === 'Seller' ? 'Seller' : 'Member'}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Menu Items */}
                                        <Link
                                            to="/profile"
                                            onClick={() => setProfileOpen(false)}
                                            className="flex items-center gap-3 px-4 py-3 text-[10px] font-medium tracking-[0.15em] uppercase transition-colors hover:bg-[#fbf9f6]"
                                            style={{ color: '#7A6E63' }}
                                        >
                                            <UserIcon /> My Profile
                                        </Link>
                                        <Link
                                            to="/orders"
                                            onClick={() => setProfileOpen(false)}
                                            className="flex items-center gap-3 px-4 py-3 text-[10px] font-medium tracking-[0.15em] uppercase transition-colors hover:bg-[#fbf9f6]"
                                            style={{ color: '#7A6E63' }}
                                        >
                                            <OrderIcon /> My Orders
                                        </Link>
                                        {user.role === 'Seller' && (
                                            <Link
                                                to="/seller/dashboard"
                                                onClick={() => setProfileOpen(false)}
                                                className="flex items-center gap-3 px-4 py-3 text-[10px] font-medium tracking-[0.15em] uppercase transition-colors hover:bg-[#fbf9f6]"
                                                style={{ color: '#7A6E63' }}
                                            >
                                                <DashboardIcon /> Dashboard
                                            </Link>
                                        )}
                                        <div style={{ height: '1px', backgroundColor: '#f0ede9', margin: '4px 0' }} />
                                        <button
                                            onClick={handleLogoutSubmit}
                                            className="flex items-center gap-3 px-4 py-3 text-[10px] font-medium tracking-[0.15em] uppercase transition-colors hover:bg-red-50 hover:text-red-500 w-full text-left"
                                            style={{ color: '#7A6E63', background: 'none', border: 'none', cursor: 'pointer' }}
                                        >
                                            <LogoutIcon /> Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-4 ml-5">
                                <Link
                                    to="/login"
                                    className="text-[10px] font-medium tracking-[0.2em] uppercase transition-colors hover:text-[#C9A96E]"
                                    style={{  color: '#1b1c1a' }}
                                >
                                    Sign In
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
        </>
    );
};

/* ── Inline SVG Icons ── */
const UserIcon = () => (
    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);
const OrderIcon = () => (
    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
        <circle cx="12" cy="10" r="3" />
    </svg>
);
const DashboardIcon = () => (
    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
    </svg>
);
const LogoutIcon = () => (
    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
);

export default Navbar;