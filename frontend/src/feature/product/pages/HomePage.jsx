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
            <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />

            <div className="min-h-screen selection:bg-[#C9A96E]/30"
                style={{ backgroundColor: '#fbf9f6', fontFamily: "'DM Sans', sans-serif" }}>
                <Navbar />

                {/* ── Announcement Bar ── */}
                <div className="py-2 text-center" style={{ backgroundColor: '#1b1c1a' }}>
                    <p className="text-[9px] sm:text-[10px] tracking-[0.2em] sm:tracking-[0.25em] uppercase font-medium" style={{ color: '#C9A96E' }}>
                        Free shipping on orders above ₹499 · New collection just dropped
                    </p>
                </div>

                {/* ── Hero Banner ── */}
                <div className="relative overflow-hidden" style={{ backgroundColor: '#f5f3f0', minHeight: '240px' }}>
                    <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-16 xl:px-24 py-10 sm:py-16 lg:py-24 flex flex-col items-start justify-center" style={{ minHeight: '240px' }}>
                        <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.28em] font-medium mb-3" style={{ color: '#C9A96E' }}>
                            Spring — Summer 2026
                        </span>
                        <h1 className="text-3xl sm:text-5xl lg:text-7xl font-light leading-none mb-3 sm:mb-5"
                            style={{ fontFamily: "'Cormorant Garamond', serif", color: '#1b1c1a' }}>
                            The Curated<br />
                            <span className="italic" style={{ color: '#C9A96E' }}>Archive</span>
                        </h1>
                        <p className="max-w-xs sm:max-w-md text-xs sm:text-sm leading-relaxed mb-6 sm:mb-8" style={{ color: '#7A6E63' }}>
                            Meticulously designed for effortless elegance. Premium minimalist pieces crafted for those who appreciate enduring quality.
                        </p>
                        <button
                            onClick={() => document.getElementById('collection').scrollIntoView({ behavior: 'smooth' })}
                            className="text-[9px] sm:text-[10px] font-medium tracking-[0.22em] uppercase px-6 sm:px-10 py-2.5 sm:py-3.5 transition-opacity hover:opacity-80"
                            style={{ backgroundColor: '#1b1c1a', color: '#C9A96E', border: 'none', cursor: 'pointer' }}>
                            Shop Now
                        </button>
                    </div>
                    {/* Decorative grid lines */}
                    <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.04 }}>
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="absolute top-0 bottom-0"
                                style={{ left: `${(i + 1) * 16.66}%`, width: '1px', backgroundColor: '#1b1c1a' }} />
                        ))}
                    </div>
                </div>

                {/* ── Category Pills ── */}
                <div className="border-b" style={{ borderColor: '#e4e2df' }}>
                    <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-16 xl:px-24 py-3.5 sm:py-5 flex items-center gap-4 sm:gap-6 overflow-x-auto scrollbar-hide">
                        {['All', 'T-Shirts', 'Shirts', 'Pants', 'Shorts', 'New Arrivals'].map((cat, i) => (
                            <button key={cat}
                                className="flex-shrink-0 text-[9px] sm:text-[10px] font-medium tracking-[0.18em] sm:tracking-[0.2em] uppercase transition-colors"
                                style={{
                                    color: i === 0 ? '#1b1c1a' : '#7A6E63',
                                    background: 'none', border: 'none', cursor: 'pointer',
                                    borderBottom: i === 0 ? '1px solid #C9A96E' : '1px solid transparent',
                                    paddingBottom: '4px',
                                }}>
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── Product Grid ── */}
                <div id="collection" className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 xl:px-24">

                    {/* Section Header */}
                    <div className="pt-8 sm:pt-14 pb-4 sm:pb-6 flex items-end justify-between">
                        <div>
                            <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.22em] font-medium" style={{ color: '#C9A96E' }}>
                                The Collection
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-light mt-1 sm:mt-2"
                                style={{ fontFamily: "'Cormorant Garamond', serif", color: '#1b1c1a' }}>
                                {products?.length > 0 ? `${products.length} Pieces` : 'All Pieces'}
                            </h2>
                        </div>
                        <button className="text-[9px] sm:text-[10px] font-medium tracking-[0.15em] uppercase flex items-center gap-1.5 sm:gap-2"
                            style={{ color: '#7A6E63', background: 'none', border: 'none', cursor: 'pointer' }}>
                            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <line x1="7" y1="12" x2="17" y2="12" />
                                <line x1="11" y1="18" x2="13" y2="18" />
                            </svg>
                            Filter
                        </button>
                    </div>

                    {products && products.length > 0 ? (
                        // 👇 KEY CHANGE: 2 cols on mobile, 3 on tablet, 4 on desktop
                        // Tighter gaps on mobile, normal on desktop
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-3 gap-y-8 sm:gap-x-6 sm:gap-y-12 lg:gap-x-8 lg:gap-y-16 pb-20 sm:pb-32">
                            {products.map(product => {
                                const imageUrl = product.images?.[0]?.url || null;
                                const isHovered = hoveredId === product._id;

                                return (
                                    <div key={product._id}
                                        className="group cursor-pointer flex flex-col"
                                        onMouseEnter={() => setHoveredId(product._id)}
                                        onMouseLeave={() => setHoveredId(null)}
                                        onClick={() => navigate(`/product/${product._id}`)}>

                                        {/* ── Image ── */}
                                        {/* 👇 aspect-[3/4] is more compact than [4/5] on small screens */}
                                        <div className="relative aspect-[3/4] sm:aspect-[4/5] overflow-hidden mb-2.5 sm:mb-4"
                                            style={{ backgroundColor: '#f5f3f0' }}>
                                            {imageUrl ? (
                                                <img src={imageUrl} alt={product.title}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <svg width="28" height="28" fill="none" stroke="#C9A96E" strokeWidth="1" viewBox="0 0 24 24" style={{ opacity: 0.4 }}>
                                                        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                                                        <line x1="3" y1="6" x2="21" y2="6" />
                                                        <path d="M16 10a4 4 0 01-8 0" />
                                                    </svg>
                                                </div>
                                            )}

                                            {/* Stock badge — smaller on mobile */}
                                            {product.stock <= 3 && product.stock > 0 && (
                                                <span className="absolute top-2 left-2 text-[8px] sm:text-[9px] tracking-[0.12em] uppercase px-1.5 py-0.5"
                                                    style={{ backgroundColor: '#fff', color: '#1b1c1a' }}>
                                                    Only {product.stock} left
                                                </span>
                                            )}

                                            {/* Quick Add — hidden on mobile (tap goes to PDP), shown on hover on desktop */}
                                            <button
                                                className="hidden sm:block absolute bottom-0 left-0 right-0 py-2.5 text-[9px] tracking-[0.18em] uppercase font-medium transition-all duration-300"
                                                style={{
                                                    backgroundColor: '#1b1c1a', color: '#C9A96E',
                                                    border: 'none', cursor: 'pointer',
                                                    transform: isHovered ? 'translateY(0)' : 'translateY(100%)',
                                                    opacity: isHovered ? 1 : 0,
                                                }}
                                                onClick={(e) => { e.stopPropagation(); navigate(`/product/${product._id}`); }}>
                                                Quick Add
                                            </button>
                                        </div>

                                        {/* ── Details ── */}
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-start justify-between gap-1">
                                                {/* 👇 Smaller title on mobile */}
                                                <h3 className="text-sm sm:text-base lg:text-lg leading-snug transition-colors duration-300 group-hover:text-[#C9A96E] flex-1"
                                                    style={{ fontFamily: "'Cormorant Garamond', serif", color: '#1b1c1a' }}>
                                                    {product.title}
                                                </h3>
                                                {/* Wishlist hidden on mobile to save space */}
                                                <button onClick={(e) => e.stopPropagation()}
                                                    className="hidden sm:flex p-1 flex-shrink-0 transition-colors"
                                                    style={{ color: '#b0a99f', background: 'none', border: 'none', cursor: 'pointer' }}>
                                                    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                                        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                                                    </svg>
                                                </button>
                                            </div>

                                            {/* Description hidden on mobile — too cluttered */}
                                            <p className="hidden sm:block text-[11px] line-clamp-1 leading-relaxed" style={{ color: '#7A6E63' }}>
                                                {product.description}
                                            </p>

                                            <div className="flex items-center justify-between mt-0.5">
                                                <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.15em] font-medium" style={{ color: '#1b1c1a' }}>
                                                    {product.price?.currency} {product.price?.amount?.toLocaleString()}
                                                </span>
                                                {product.varients?.length > 0 && (
                                                    <span className="hidden sm:inline" style={{ fontSize: '9px', color: '#b0a99f', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
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
                        <div className="py-24 sm:py-32 text-center flex flex-col items-center">
                            <h2 className="text-xl sm:text-2xl mb-3 sm:mb-4"
                                style={{ fontFamily: "'Cormorant Garamond', serif", color: '#1b1c1a' }}>
                                No pieces available.
                            </h2>
                            <p className="max-w-xs sm:max-w-md mx-auto text-xs sm:text-sm leading-relaxed" style={{ color: '#7A6E63' }}>
                                We are currently preparing our next collection. Please check back later.
                            </p>
                        </div>
                    )}
                </div>

                {/* ── Footer ── */}
                <footer className="border-t py-8 sm:py-14" style={{ borderColor: '#e4e2df', backgroundColor: '#1b1c1a' }}>
                    <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-16 xl:px-24 flex flex-col items-center md:flex-row md:justify-between gap-4 sm:gap-5 text-center md:text-left">
                        <span className="text-base sm:text-lg tracking-[0.35em] uppercase"
                            style={{ fontFamily: "'Cormorant Garamond', serif", color: '#C9A96E' }}>
                            Snitch.
                        </span>
                        <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
                            {['About', 'Contact', 'Returns', 'Privacy'].map(link => (
                                <a key={link} href="#"
                                    className="text-[9px] sm:text-[10px] tracking-[0.18em] uppercase transition-colors hover:text-[#C9A96E]"
                                    style={{ color: '#7A6E63', textDecoration: 'none' }}>
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