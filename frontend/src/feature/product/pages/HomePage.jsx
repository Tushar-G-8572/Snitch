import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useProducts } from '../hooks/useProducts';
import { useNavigate } from 'react-router';
import Navbar from '../../shared/components/Navbar';

const HomePage = () => {
    const products = useSelector(state => state.product.products);
    const { handleGetAllProducts } = useProducts();
    const navigate = useNavigate();
    const [hoveredId, setHoveredId] = useState(null);

    useEffect(() => {
        handleGetAllProducts();
    }, []);

    return (
        <>
            <link
                href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:wght@300;400;500;600&display=swap"
                rel="stylesheet"
            />

            <div
                className="min-h-screen selection:bg-[#C9A96E]/30"
                style={{ backgroundColor: '#fbf9f6', fontFamily: "'DM Sans', sans-serif" }}
            >
                <Navbar />

                <div
                    className="text-center py-2"
                    style={{ backgroundColor: '#1b1c1a', color: '#C9A96E' }}
                >
                    <p className="text-[10px] tracking-[0.25em] uppercase font-medium">
                        Free shipping on orders above ₹499 · New collection just dropped
                    </p>
                </div>

                {/* ── Hero Banner ── */}
                <div
                    className="relative overflow-hidden"
                    style={{ backgroundColor: '#f5f3f0', minHeight: '420px' }}
                >
                    <div className="max-w-7xl mx-auto px-6 lg:px-16 xl:px-24 py-24 flex flex-col items-start justify-center" style={{ minHeight: '420px' }}>
                        <span className="text-[10px] uppercase tracking-[0.3em] font-medium mb-4" style={{ color: '#C9A96E' }}>
                            Spring — Summer 2026
                        </span>
                        <h1
                            className="text-6xl lg:text-8xl font-light leading-none mb-6"
                            style={{ fontFamily: "'Cormorant Garamond', serif", color: '#1b1c1a' }}
                        >
                            The Curated
                            <br />
                            <span className="italic" style={{ color: '#C9A96E' }}>Archive</span>
                        </h1>
                        <p className="max-w-md text-sm leading-relaxed mb-10" style={{ color: '#7A6E63' }}>
                            Meticulously designed for effortless elegance. Premium minimalist pieces crafted for those who appreciate enduring quality.
                        </p>
                        <button
                            onClick={() => document.getElementById('collection').scrollIntoView({ behavior: 'smooth' })}
                            className="text-[10px] font-medium tracking-[0.25em] uppercase px-10 py-4 transition-opacity hover:opacity-80"
                            style={{ backgroundColor: '#1b1c1a', color: '#C9A96E', border: 'none', cursor: 'pointer' }}
                        >
                            Shop Now
                        </button>
                    </div>

                    {/* Decorative grid lines */}
                    <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.04 }}>
                        {[...Array(6)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute top-0 bottom-0"
                                style={{ left: `${(i + 1) * 16.66}%`, width: '1px', backgroundColor: '#1b1c1a' }}
                            />
                        ))}
                    </div>
                </div>

                {/* ── Category Pills ── */}
                <div className="border-b" style={{ borderColor: '#e4e2df' }}>
                    <div className="max-w-7xl mx-auto px-6 lg:px-16 xl:px-24 py-5 flex items-center gap-6 overflow-x-auto">
                        {['All', 'T-Shirts', 'Shirts', 'Pants', 'Shorts', 'New Arrivals'].map((cat, i) => (
                            <button
                                key={cat}
                                className="flex-shrink-0 text-[10px] font-medium tracking-[0.2em] uppercase pb-1 transition-colors border-b"
                                style={{
                                    color: i === 0 ? '#1b1c1a' : '#7A6E63',
                                    borderColor: i === 0 ? '#C9A96E' : 'transparent',
                                    background: 'none', border: 'none', cursor: 'pointer',
                                    borderBottom: i === 0 ? '1px solid #C9A96E' : '1px solid transparent',
                                    paddingBottom: '4px',
                                }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── Product Grid ── */}
                <div id="collection" className="max-w-7xl mx-auto px-6 lg:px-16 xl:px-24">
                    <div className="pt-16 pb-6 flex items-end justify-between">
                        <div>
                            <span className="text-[10px] uppercase tracking-[0.24em] font-medium" style={{ color: '#C9A96E' }}>
                                The Collection
                            </span>
                            <h2
                                className="text-3xl font-light mt-2"
                                style={{ fontFamily: "'Cormorant Garamond', serif", color: '#1b1c1a' }}
                            >
                                {products?.length > 0 ? `${products.length} Pieces` : 'All Pieces'}
                            </h2>
                        </div>
                        <button
                            className="text-[10px] font-medium tracking-[0.15em] uppercase flex items-center gap-2"
                            style={{ color: '#7A6E63', background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <line x1="7" y1="12" x2="17" y2="12" />
                                <line x1="11" y1="18" x2="13" y2="18" />
                            </svg>
                            Filter &amp; Sort
                        </button>
                    </div>

                    {products && products.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16 pb-32">
                            {products.map(product => {
                                const imageUrl = product.images?.[0]?.url || null;
                                const isHovered = hoveredId === product._id;

                                return (
                                    <div
                                        key={product._id}
                                        className="group cursor-pointer flex flex-col"
                                        onMouseEnter={() => setHoveredId(product._id)}
                                        onMouseLeave={() => setHoveredId(null)}
                                        onClick={() => navigate(`/product/${product._id}`)}
                                    >
                                        {/* Image */}
                                        <div
                                            className="relative aspect-[4/5] overflow-hidden mb-5"
                                            style={{ backgroundColor: '#f5f3f0' }}
                                        >
                                            {imageUrl ? (
                                                <img
                                                    src={imageUrl}
                                                    alt={product.title}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <svg width="40" height="40" fill="none" stroke="#C9A96E" strokeWidth="1" viewBox="0 0 24 24" style={{ opacity: 0.4 }}>
                                                        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                                                        <line x1="3" y1="6" x2="21" y2="6" />
                                                        <path d="M16 10a4 4 0 01-8 0" />
                                                    </svg>
                                                </div>
                                            )}

                                            {/* Stock badge */}
                                            {product.stock <= 3 && product.stock > 0 && (
                                                <span
                                                    className="absolute top-3 left-3 text-[9px] tracking-[0.15em] uppercase px-2 py-0.5"
                                                    style={{ backgroundColor: '#fff', color: '#1b1c1a' }}
                                                >
                                                    Only {product.stock} left
                                                </span>
                                            )}

                                            {/* Quick Add Button */}
                                            <button
                                                className="absolute bottom-0 left-0 right-0 py-3 text-[10px] tracking-[0.2em] uppercase font-medium transition-all duration-300"
                                                style={{
                                                    backgroundColor: '#1b1c1a',
                                                    color: '#C9A96E',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    transform: isHovered ? 'translateY(0)' : 'translateY(100%)',
                                                    opacity: isHovered ? 1 : 0,
                                                }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/product/${product._id}`);
                                                }}
                                            >
                                                Quick Add
                                            </button>
                                        </div>

                                        {/* Details */}
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex items-start justify-between gap-2">
                                                <h3
                                                    className="text-lg leading-snug transition-colors duration-300 group-hover:text-[#C9A96E] flex-1"
                                                    style={{ fontFamily: "'Cormorant Garamond', serif", color: '#1b1c1a' }}
                                                >
                                                    {product.title}
                                                </h3>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); }}
                                                    className="p-1 flex-shrink-0 transition-colors"
                                                    style={{ color: '#b0a99f', background: 'none', border: 'none', cursor: 'pointer' }}
                                                    title="Wishlist"
                                                >
                                                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                                        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                                                    </svg>
                                                </button>
                                            </div>

                                            <p
                                                className="text-[11px] line-clamp-1 leading-relaxed"
                                                style={{ color: '#7A6E63' }}
                                            >
                                                {product.description}
                                            </p>

                                            <div className="flex items-center justify-between mt-1">
                                                <span
                                                    className="text-[11px] uppercase tracking-[0.18em] font-medium"
                                                    style={{ color: '#1b1c1a' }}
                                                >
                                                    {product.price?.currency} {product.price?.amount?.toLocaleString()}
                                                </span>
                                                {product.varients && product.varients.length > 0 && (
                                                    <span style={{ fontSize: '9px', color: '#b0a99f', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                                                        {product.varients.length} variant{product.varients.length > 1 ? 's' : ''}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="py-32 text-center flex flex-col items-center">
                            <h2 className="text-2xl mb-4" style={{ fontFamily: "'Cormorant Garamond', serif", color: '#1b1c1a' }}>
                                No pieces available.
                            </h2>
                            <p className="max-w-md mx-auto text-sm leading-relaxed" style={{ color: '#7A6E63' }}>
                                We are currently preparing our next collection. Please check back later.
                            </p>
                        </div>
                    )}
                </div>

                {/* ── Footer ── */}
                <footer className="border-t py-16" style={{ borderColor: '#e4e2df', backgroundColor: '#1b1c1a' }}>
                    <div className="max-w-7xl mx-auto px-6 lg:px-16 xl:px-24 flex flex-col md:flex-row items-center justify-between gap-6">
                        <span
                            className="text-lg tracking-[0.35em] uppercase"
                            style={{ fontFamily: "'Cormorant Garamond', serif", color: '#C9A96E' }}
                        >
                            Snitch.
                        </span>
                        <div className="flex gap-8">
                            {['About', 'Contact', 'Returns', 'Privacy'].map(link => (
                                <a
                                    key={link}
                                    href="#"
                                    className="text-[10px] tracking-[0.2em] uppercase transition-colors hover:text-[#C9A96E]"
                                    style={{ color: '#7A6E63', textDecoration: 'none' }}
                                >
                                    {link}
                                </a>
                            ))}
                        </div>
                        <span style={{ fontSize: '10px', color: '#5a5550', letterSpacing: '0.1em' }}>
                            © {new Date().getFullYear()} Snitch. All rights reserved.
                        </span>
                    </div>
                </footer>
            </div>
        </>
    );
};

export default HomePage;