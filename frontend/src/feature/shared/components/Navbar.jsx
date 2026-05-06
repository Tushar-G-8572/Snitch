import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { useAuth } from '../../auth/hooks/useAuth';
import SearchBar from './SearchBar';

const Navbar = () => {
    const user = useSelector(state => state.auth.user);
    const cartItems = useSelector(state => state.cart.cartProducts || []);
    const navigate = useNavigate();
    const [profileOpen, setProfileOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const profileRef = useRef(null);
    const { handleLogout } = useAuth();

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

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [mobileMenuOpen]);

    const handleLogoutSubmit = async () => {
        await handleLogout();
        setProfileOpen(false);
        setMobileMenuOpen(false);
        navigate('/login');
    };

    const cartCount = cartItems.items?.reduce((sum, item) => sum + (item.quantity || 1), 0);

    const navLinks = [
        { label: 'Collection', to: '/' },
        { label: 'Men', to: '/' },
        { label: 'Women', to: '/' },
        { label: 'New Arrivals', to: '/' },
    ];

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
                    backgroundColor: 'rgba(251,249,246,0.95)',
                    backdropFilter: 'blur(12px)',
                    borderColor: '#e4e2df',
                    fontFamily: "'DM Sans', sans-serif",
                }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 xl:px-24 h-14 sm:h-16 flex items-center justify-between">

                    {/* ── Hamburger (Mobile only) ── */}
                    <button
                        className="md:hidden p-2 -ml-1 flex flex-col gap-1.5 transition-opacity hover:opacity-70"
                        onClick={() => setMobileMenuOpen(prev => !prev)}
                        aria-label="Toggle menu"
                        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                        <span
                            className="block h-px w-5 transition-all duration-300 origin-center"
                            style={{
                                backgroundColor: '#1b1c1a',
                                transform: mobileMenuOpen ? 'rotate(45deg) translate(3.5px, 3.5px)' : 'none',
                            }}
                        />
                        <span
                            className="block h-px w-5 transition-all duration-300"
                            style={{
                                backgroundColor: '#1b1c1a',
                                opacity: mobileMenuOpen ? 0 : 1,
                            }}
                        />
                        <span
                            className="block h-px w-5 transition-all duration-300 origin-center"
                            style={{
                                backgroundColor: '#1b1c1a',
                                transform: mobileMenuOpen ? 'rotate(-45deg) translate(3.5px, -3.5px)' : 'none',
                            }}
                        />
                    </button>

                    {/* ── Logo ── */}
                    <Link
                        to="/"
                        className="text-base sm:text-lg font-medium tracking-[0.3em] uppercase transition-opacity hover:opacity-75"
                        style={{ fontFamily: "'Cormorant Garamond', serif", color: '#C9A96E' }}
                    >
                        Snitch.
                    </Link>

                    {/* ── Center Nav Links (Desktop) ── */}
                    <div className="hidden md:flex items-center gap-6 lg:gap-8">
                        {navLinks.map(({ label, to }) => (
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
                        <Link
                            to="/wishlist"
                            className="relative text-[10px] font-medium tracking-[0.2em] uppercase transition-colors duration-200 group"
                            style={{ color: '#7A6E63' }}
                        >
                            <span className="group-hover:text-[#C9A96E] transition-colors">Wishlist</span>
                            <span
                                className="absolute -bottom-px left-0 h-px w-0 group-hover:w-full transition-all duration-300"
                                style={{ backgroundColor: '#C9A96E' }}
                            />
                        </Link>
                    </div>

                    {/* ── Right Actions ── */}
                    <div className="flex items-center gap-0.5 sm:gap-1">

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
                                            <div className="min-w-0">
                                                <p className="truncate" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '15px', color: '#1b1c1a' }}>
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
                            <div className="flex items-center gap-3 ml-2 sm:ml-5">
                                <Link
                                    to="/login"
                                    className="text-[10px] font-medium tracking-[0.2em] uppercase transition-colors hover:text-[#C9A96E]"
                                    style={{ color: '#1b1c1a' }}
                                >
                                    Sign In
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* ── Mobile Menu Overlay ── */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 z-40 md:hidden"
                    style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* ── Mobile Drawer ── */}
            <div
                className="fixed top-0 left-0 h-full z-50 md:hidden flex flex-col overflow-y-auto transition-transform duration-300 ease-in-out"
                style={{
                    width: '280px',
                    backgroundColor: '#fbf9f6',
                    borderRight: '1px solid #e4e2df',
                    transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(-100%)',
                    fontFamily: "'DM Sans', sans-serif",
                }}
            >
                {/* Drawer Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: '#e4e2df' }}>
                    <Link
                        to="/"
                        onClick={() => setMobileMenuOpen(false)}
                        style={{ fontFamily: "'Cormorant Garamond', serif", color: '#C9A96E', fontSize: '18px', letterSpacing: '0.3em', textTransform: 'uppercase' }}
                    >
                        Snitch.
                    </Link>
                    <button
                        onClick={() => setMobileMenuOpen(false)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7A6E63' }}
                        aria-label="Close menu"
                    >
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* Drawer Nav Links */}
                <div className="flex flex-col py-4">
                    {navLinks.map(({ label, to }) => (
                        <Link
                            key={label}
                            to={to}
                            onClick={() => setMobileMenuOpen(false)}
                            className="px-6 py-3.5 text-[11px] font-medium tracking-[0.22em] uppercase transition-colors hover:text-[#C9A96E] hover:bg-[#f5f3f0]"
                            style={{ color: '#7A6E63' }}
                        >
                            {label}
                        </Link>
                    ))}
                    {user && (
                        <Link
                            to="/orders"
                            onClick={() => setMobileMenuOpen(false)}
                            className="px-6 py-3.5 text-[11px] font-medium tracking-[0.22em] uppercase transition-colors hover:text-[#C9A96E] hover:bg-[#f5f3f0]"
                            style={{ color: '#7A6E63' }}
                        >
                            Orders
                        </Link>
                    )}
                    <Link
                        to="/wishlist"
                        onClick={() => setMobileMenuOpen(false)}
                        className="px-6 py-3.5 text-[11px] font-medium tracking-[0.22em] uppercase transition-colors hover:text-[#C9A96E] hover:bg-[#f5f3f0]"
                        style={{ color: '#7A6E63' }}
                    >
                        Wishlist
                    </Link>
                    <Link
                        to="/cart-items"
                        onClick={() => setMobileMenuOpen(false)}
                        className="px-6 py-3.5 text-[11px] font-medium tracking-[0.22em] uppercase transition-colors hover:text-[#C9A96E] hover:bg-[#f5f3f0] flex items-center gap-2"
                        style={{ color: '#7A6E63' }}
                    >
                        Cart
                        {cartCount > 0 && (
                            <span className="flex items-center justify-center rounded-full text-white" style={{ width: '18px', height: '18px', fontSize: '9px', fontWeight: 700, backgroundColor: '#C9A96E' }}>
                                {cartCount}
                            </span>
                        )}
                    </Link>
                </div>

                {/* Drawer User Section */}
                {user ? (
                    <div className="mt-auto border-t px-6 py-5 flex flex-col gap-3" style={{ borderColor: '#e4e2df' }}>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#1b1c1a', color: '#C9A96E', fontFamily: "'Cormorant Garamond', serif", fontSize: '18px' }}>
                                {user.fullName?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '15px', color: '#1b1c1a' }}>{user.fullName}</p>
                                <p style={{ fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#C9A96E' }}>{user.role === 'Seller' ? 'Seller' : 'Member'}</p>
                            </div>
                        </div>
                        <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="text-[10px] tracking-[0.15em] uppercase font-medium" style={{ color: '#7A6E63' }}>My Profile</Link>
                        {user.role === 'Seller' && (
                            <Link to="/seller/dashboard" onClick={() => setMobileMenuOpen(false)} className="text-[10px] tracking-[0.15em] uppercase font-medium" style={{ color: '#7A6E63' }}>Dashboard</Link>
                        )}
                        <button
                            onClick={handleLogoutSubmit}
                            className="text-left text-[10px] tracking-[0.15em] uppercase font-medium transition-colors"
                            style={{ color: '#c0392b', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                        >
                            Sign Out
                        </button>
                    </div>
                ) : (
                    <div className="mt-auto border-t px-6 py-5 flex flex-col gap-3" style={{ borderColor: '#e4e2df' }}>
                        <Link
                            to="/login"
                            onClick={() => setMobileMenuOpen(false)}
                            className="w-full py-3 text-center text-[11px] font-medium tracking-[0.25em] uppercase transition-opacity hover:opacity-80"
                            style={{ backgroundColor: '#1b1c1a', color: '#C9A96E' }}
                        >
                            Sign In
                        </Link>
                        <Link
                            to="/register"
                            onClick={() => setMobileMenuOpen(false)}
                            className="w-full py-3 text-center text-[11px] font-medium tracking-[0.25em] uppercase border transition-colors"
                            style={{ borderColor: '#d0c5b5', color: '#7A6E63' }}
                        >
                            Create Account
                        </Link>
                    </div>
                )}
            </div>
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