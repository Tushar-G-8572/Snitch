import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router';
import Navbar from '../../shared/components/Navbar';
import { useCart } from '../hooks/useCart';

const STATUS_CONFIG = {
    paid: { bg: '#f0faf4', color: '#2d7d52', label: 'Paid' },
    delivered: { bg: '#f0faf4', color: '#2d7d52', label: 'Delivered' },
    shipped: { bg: '#fffbf0', color: '#b07d1a', label: 'Shipped' },
    processing: { bg: '#f0f4ff', color: '#3b5bbf', label: 'Processing' },
    cancelled: { bg: '#fff5f5', color: '#c0392b', label: 'Cancelled' },
};

const OrdersPage = () => {
    const user = useSelector(state => state.auth.user);
    const orders = useSelector(state => state.cart.cartProducts) || [];
    const navigate = useNavigate();
    const { handleGetOrders } = useCart();

    useEffect(() => {
        handleGetOrders();
    }, []);


    console.log(orders);

    if (!user) {
        return (
            <div style={{ backgroundColor: '#fbf9f6', minHeight: '100vh' }}>
                <Navbar />
                <div className="flex flex-col items-center justify-center"
                    style={{ minHeight: 'calc(100vh - 68px)' }}>
                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', color: '#1b1c1a' }}>
                        Please sign in to view your orders.
                    </p>
                    <Link to="/login"
                        className="mt-6 text-[10px] font-medium tracking-[0.2em] uppercase px-8 py-3 transition-opacity hover:opacity-80"
                        style={{ backgroundColor: '#1b1c1a', color: '#C9A96E' }}>
                        Sign In
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <>
            <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />
            <div style={{ backgroundColor: '#fbf9f6', minHeight: '100vh', fontFamily: "'DM Sans', sans-serif" }}>
                <Navbar />

                <div className="max-w-4xl mx-auto px-6 lg:px-16 py-16">

                    {/* ── Header ── */}
                    <div className="flex items-end justify-between mb-10">
                        <div>
                            <span className="block text-[10px] uppercase tracking-[0.28em] font-medium mb-2"
                                style={{ color: '#C9A96E' }}>
                                Account
                            </span>
                            <h1 className="text-4xl font-light"
                                style={{ fontFamily: "'Cormorant Garamond', serif", color: '#1b1c1a' }}>
                                My Orders
                            </h1>
                        </div>
                        <button onClick={() => navigate('/profile')}
                            className="flex items-center gap-2 text-[10px] font-medium tracking-[0.15em] uppercase transition-colors hover:text-[#C9A96E]"
                            style={{ color: '#7A6E63', background: 'none', border: 'none', cursor: 'pointer' }}>
                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                <polyline points="15 18 9 12 15 6" />
                            </svg>
                            Back to Profile
                        </button>
                    </div>

                    {orders.length > 0 && (
                        <p className="mb-6 text-[11px] tracking-[0.1em]" style={{ color: '#7A6E63' }}>
                            {orders.length} order{orders.length !== 1 ? 's' : ''} placed
                        </p>
                    )}

                    {/* ── Orders List ── */}
                    {/* ── Orders List ── */}
                    {orders.length > 0 ? (
                        <div className="flex flex-col gap-6">
                            {orders.map(item => {
                                const img = item.images?.[0]?.url ?? null;

                                return (
                                    <div key={item._id} className="border overflow-hidden"
                                        style={{ borderColor: '#e4e2df', backgroundColor: '#fff' }}>

                                        {/* ── Item Header ── */}
                                        <div className="flex items-center justify-between flex-wrap gap-3 px-6 py-4 border-b"
                                            style={{ borderColor: '#f0ede9', backgroundColor: '#fbf9f6' }}>
                                            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '17px', color: '#1b1c1a' }}>
                                                Order #{item._id}
                                            </p>
                                            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '17px', color: '#1b1c1a' }}>
                                                {item.price?.currency} {(item.price?.amount * item.quantity).toLocaleString('en-IN')}
                                            </p>
                                        </div>

                                        {/* ── Item Row ── */}
                                        <div className="px-6 py-4 flex items-center gap-4">
                                            {img ? (
                                                <img src={img} alt={item.title}
                                                    className="object-cover flex-shrink-0"
                                                    style={{ width: '56px', height: '56px' }} />
                                            ) : (
                                                <div className="flex items-center justify-center flex-shrink-0"
                                                    style={{ width: '56px', height: '56px', backgroundColor: '#f5f3f0' }}>
                                                    <svg width="20" height="20" fill="none" stroke="#C9A96E" strokeWidth="1.5" viewBox="0 0 24 24">
                                                        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                                                        <line x1="3" y1="6" x2="21" y2="6" />
                                                        <path d="M16 10a4 4 0 01-8 0" />
                                                    </svg>
                                                </div>
                                            )}

                                            <div className="flex-1 min-w-0">
                                                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '16px', color: '#1b1c1a' }}>
                                                    {item.title}
                                                </p>
                                                <p style={{ fontSize: '10px', color: '#7A6E63', marginTop: '1px', letterSpacing: '0.06em' }}>
                                                    Qty {item.quantity} · {item.price?.currency} {item.price?.amount?.toLocaleString('en-IN')}
                                                </p>
                                            </div>

                                            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '15px', color: '#1b1c1a', flexShrink: 0 }}>
                                                {item.price?.currency} {(item.price?.amount * item.quantity).toLocaleString('en-IN')}
                                            </p>
                                        </div>

                                    </div>
                                );
                            })}
                        </div>
                    )  : (
                    /* ── Empty State ── */
                    <div className="py-32 text-center flex flex-col items-center">
                        <div className="w-16 h-16 flex items-center justify-center mb-6"
                            style={{ backgroundColor: '#f5f3f0' }}>
                            <svg width="28" height="28" fill="none" stroke="#C9A96E" strokeWidth="1.2" viewBox="0 0 24 24">
                                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
                                <rect x="9" y="3" width="6" height="4" rx="1" />
                                <line x1="9" y1="12" x2="15" y2="12" />
                                <line x1="9" y1="16" x2="13" y2="16" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-light mb-3"
                            style={{ fontFamily: "'Cormorant Garamond', serif", color: '#1b1c1a' }}>
                            No orders yet
                        </h2>
                        <p className="text-sm leading-relaxed mb-8 max-w-xs" style={{ color: '#7A6E63' }}>
                            Looks like you haven't placed any orders. Start exploring our collection.
                        </p>
                        <button onClick={() => navigate('/')}
                            className="text-[10px] font-medium tracking-[0.2em] uppercase px-8 py-3 transition-opacity hover:opacity-80"
                            style={{ backgroundColor: '#1b1c1a', color: '#C9A96E', border: 'none', cursor: 'pointer' }}>
                            Shop Now
                        </button>
                    </div>
                    )}
                </div>

                <footer className="border-t py-12 text-center mt-16" style={{ borderColor: '#e4e2df' }}>
                    <span className="text-[10px] uppercase tracking-[0.35em]"
                        style={{ fontFamily: "'Cormorant Garamond', serif", color: '#C9A96E' }}>
                        Snitch. © {new Date().getFullYear()}
                    </span>
                </footer>
            </div>
        </>
    );
};

export default OrdersPage;