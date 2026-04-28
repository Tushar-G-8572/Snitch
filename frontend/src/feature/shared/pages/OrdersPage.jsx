import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router';
import Navbar from '../components/Navbar';

/* ── Replace this with your real Redux orders state / API hook ── */
const DUMMY_ORDERS = [
    {
        _id: 'ORD001',
        createdAt: '2026-04-25T10:30:00Z',
        status: 'Delivered',
        deliveryDate: '28 April 2026',
        items: [
            {
                title: 'T Shirt',
                price: 599,
                quantity: 1,
                image: 'https://ik.imagekit.io/tusharG/Snitch/haryo-setyadi-acn5ERAeSb4-unsplash_DuHOwDK8FO.jpg',
                variant: 'Oversized · M',
            },
        ],
        total: 599,
        address: '12 MG Road, Kanpur, UP 208001',
    },
    {
        _id: 'ORD002',
        createdAt: '2026-04-22T14:00:00Z',
        status: 'Shipped',
        deliveryDate: 'Expected 30 April 2026',
        items: [
            {
                title: 'Linen Pants',
                price: 1199,
                quantity: 1,
                image: 'https://ik.imagekit.io/tusharG/Snitch/Linen_pants_black-4_tQz9sGNB0.jpg',
                variant: 'Black · 32',
            },
            {
                title: 'Summer wear Sky Blue Shirt',
                price: 798.99,
                quantity: 2,
                image: null,
                variant: 'Sky Blue · L',
            },
        ],
        total: 2796.99,
        address: '12 MG Road, Kanpur, UP 208001',
    },
    {
        _id: 'ORD003',
        createdAt: '2026-04-18T09:15:00Z',
        status: 'Processing',
        deliveryDate: 'Being prepared',
        items: [
            {
                title: 'Summer Wear Short Pants',
                price: 899,
                quantity: 1,
                image: null,
                variant: 'Beige · 30',
            },
        ],
        total: 899,
        address: '12 MG Road, Kanpur, UP 208001',
    },
];

const STATUS_CONFIG = {
    Delivered:  { bg: '#f0faf4', color: '#2d7d52' },
    Shipped:    { bg: '#fffbf0', color: '#b07d1a' },
    Processing: { bg: '#f0f4ff', color: '#3b5bbf' },
    Cancelled:  { bg: '#fff5f5', color: '#c0392b' },
};

const OrdersPage = () => {
    const user = useSelector(state => state.auth.user);
    const navigate = useNavigate();

    /* 
     * Replace DUMMY_ORDERS with your actual API call, e.g.:
     * const orders = useSelector(state => state.orders.orders);
     * useEffect(() => { dispatch(fetchOrders()); }, []);
     */
    const orders = DUMMY_ORDERS;

    if (!user) {
        return (
            <div style={{ backgroundColor: '#fbf9f6', minHeight: '100vh' }}>
                <Navbar />
                <div className="flex flex-col items-center justify-center" style={{ minHeight: 'calc(100vh - 68px)' }}>
                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', color: '#1b1c1a' }}>
                        Please sign in to view your orders.
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

                <div className="max-w-4xl mx-auto px-6 lg:px-16 py-16">

                    {/* ── Header ── */}
                    <div className="flex items-end justify-between mb-10">
                        <div>
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
                                My Orders
                            </h1>
                        </div>

                        {/* Back to profile */}
                        <button
                            onClick={() => navigate('/profile')}
                            className="flex items-center gap-2 text-[10px] font-medium tracking-[0.15em] uppercase transition-colors hover:text-[#C9A96E]"
                            style={{ color: '#7A6E63', background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                <polyline points="15 18 9 12 15 6" />
                            </svg>
                            Back to Profile
                        </button>
                    </div>

                    {/* ── Order Count Badge ── */}
                    {orders.length > 0 && (
                        <p
                            className="mb-6 text-[11px] tracking-[0.1em]"
                            style={{ color: '#7A6E63' }}
                        >
                            {orders.length} order{orders.length !== 1 ? 's' : ''} placed
                        </p>
                    )}

                    {/* ── Orders List ── */}
                    {orders.length > 0 ? (
                        <div className="flex flex-col gap-6">
                            {orders.map(order => {
                                const statusCfg = STATUS_CONFIG[order.status] || STATUS_CONFIG['Processing'];
                                const orderDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                });

                                return (
                                    <div
                                        key={order._id}
                                        className="border overflow-hidden"
                                        style={{ borderColor: '#e4e2df', backgroundColor: '#fff' }}
                                    >
                                        {/* ── Order Header ── */}
                                        <div
                                            className="flex items-center justify-between flex-wrap gap-3 px-6 py-4 border-b"
                                            style={{ borderColor: '#f0ede9', backgroundColor: '#fbf9f6' }}
                                        >
                                            <div>
                                                <p
                                                    style={{
                                                        fontFamily: "'Cormorant Garamond', serif",
                                                        fontSize: '17px',
                                                        color: '#1b1c1a',
                                                    }}
                                                >
                                                    Order #{order._id}
                                                </p>
                                                <p style={{ fontSize: '10px', color: '#7A6E63', marginTop: '2px', letterSpacing: '0.06em' }}>
                                                    Placed on {orderDate}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span
                                                    className="text-[9px] tracking-[0.15em] uppercase px-3 py-1"
                                                    style={{
                                                        backgroundColor: statusCfg.bg,
                                                        color: statusCfg.color,
                                                    }}
                                                >
                                                    {order.status}
                                                </span>
                                                <span
                                                    style={{
                                                        fontFamily: "'Cormorant Garamond', serif",
                                                        fontSize: '17px',
                                                        color: '#1b1c1a',
                                                    }}
                                                >
                                                    INR {order.total.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                                                </span>
                                            </div>
                                        </div>

                                        {/* ── Order Items ── */}
                                        <div className="px-6 py-4 flex flex-col gap-4">
                                            {order.items.map((item, i) => (
                                                <div key={i} className="flex items-center gap-4">
                                                    {/* Thumbnail */}
                                                    {item.image ? (
                                                        <img
                                                            src={item.image}
                                                            alt={item.title}
                                                            className="object-cover flex-shrink-0"
                                                            style={{ width: '56px', height: '56px' }}
                                                        />
                                                    ) : (
                                                        <div
                                                            className="flex items-center justify-center flex-shrink-0"
                                                            style={{ width: '56px', height: '56px', backgroundColor: '#f5f3f0' }}
                                                        >
                                                            <svg
                                                                width="20"
                                                                height="20"
                                                                fill="none"
                                                                stroke="#C9A96E"
                                                                strokeWidth="1.5"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                                                                <line x1="3" y1="6" x2="21" y2="6" />
                                                                <path d="M16 10a4 4 0 01-8 0" />
                                                            </svg>
                                                        </div>
                                                    )}

                                                    {/* Info */}
                                                    <div className="flex-1 min-w-0">
                                                        <p
                                                            style={{
                                                                fontFamily: "'Cormorant Garamond', serif",
                                                                fontSize: '16px',
                                                                color: '#1b1c1a',
                                                            }}
                                                        >
                                                            {item.title}
                                                        </p>
                                                        {item.variant && (
                                                            <p style={{ fontSize: '10px', color: '#7A6E63', marginTop: '2px', letterSpacing: '0.06em' }}>
                                                                {item.variant}
                                                            </p>
                                                        )}
                                                        <p style={{ fontSize: '10px', color: '#7A6E63', marginTop: '1px', letterSpacing: '0.06em' }}>
                                                            Qty {item.quantity} · INR {item.price.toLocaleString('en-IN')}
                                                        </p>
                                                    </div>

                                                    {/* Item total */}
                                                    <p
                                                        style={{
                                                            fontFamily: "'Cormorant Garamond', serif",
                                                            fontSize: '15px',
                                                            color: '#1b1c1a',
                                                            flexShrink: 0,
                                                        }}
                                                    >
                                                        INR {(item.price * item.quantity).toLocaleString('en-IN')}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>

                                        {/* ── Order Footer ── */}
                                        <div
                                            className="flex items-center justify-between flex-wrap gap-3 px-6 py-3 border-t"
                                            style={{ borderColor: '#f0ede9', backgroundColor: '#f9f7f4' }}
                                        >
                                            <div className="flex items-center gap-1.5" style={{ color: '#7A6E63' }}>
                                                <svg
                                                    width="13"
                                                    height="13"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="1.5"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <circle cx="12" cy="12" r="10" />
                                                    <polyline points="12 6 12 12 16 14" />
                                                </svg>
                                                <span style={{ fontSize: '10px', letterSpacing: '0.06em' }}>
                                                    {order.deliveryDate}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <button
                                                    className="text-[10px] font-medium tracking-[0.15em] uppercase transition-colors hover:text-[#C9A96E]"
                                                    style={{ color: '#7A6E63', background: 'none', border: 'none', cursor: 'pointer' }}
                                                >
                                                    Track Order →
                                                </button>
                                                {order.status === 'Delivered' && (
                                                    <button
                                                        className="text-[10px] font-medium tracking-[0.15em] uppercase transition-colors hover:text-[#1b1c1a]"
                                                        style={{ color: '#7A6E63', background: 'none', border: 'none', cursor: 'pointer' }}
                                                    >
                                                        Buy Again
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        /* ── Empty State ── */
                        <div className="py-32 text-center flex flex-col items-center">
                            <div
                                className="w-16 h-16 flex items-center justify-center mb-6"
                                style={{ backgroundColor: '#f5f3f0' }}
                            >
                                <svg
                                    width="28"
                                    height="28"
                                    fill="none"
                                    stroke="#C9A96E"
                                    strokeWidth="1.2"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
                                    <rect x="9" y="3" width="6" height="4" rx="1" />
                                    <line x1="9" y1="12" x2="15" y2="12" />
                                    <line x1="9" y1="16" x2="13" y2="16" />
                                </svg>
                            </div>
                            <h2
                                className="text-2xl font-light mb-3"
                                style={{ fontFamily: "'Cormorant Garamond', serif", color: '#1b1c1a' }}
                            >
                                No orders yet
                            </h2>
                            <p
                                className="text-sm leading-relaxed mb-8 max-w-xs"
                                style={{ color: '#7A6E63' }}
                            >
                                Looks like you haven't placed any orders. Start exploring our collection.
                            </p>
                            <button
                                onClick={() => navigate('/')}
                                className="text-[10px] font-medium tracking-[0.2em] uppercase px-8 py-3 transition-opacity hover:opacity-80"
                                style={{ backgroundColor: '#1b1c1a', color: '#C9A96E', border: 'none', cursor: 'pointer' }}
                            >
                                Shop Now
                            </button>
                        </div>
                    )}
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

export default OrdersPage;