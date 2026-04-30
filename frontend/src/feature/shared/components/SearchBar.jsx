import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

const SearchBar = () => {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const inputRef = useRef(null);
    const wrapRef = useRef(null);
    const navigate = useNavigate();

    const products = useSelector(state => state.product.products || []);

    // Dummy/fallback data in case store is empty
    const dummyProducts = [
        { _id: '1', title: 'T Shirt', description: 'Over Sized', price: { amount: 599, currency: 'INR' }, images: [{ url: 'https://ik.imagekit.io/tusharG/Snitch/haryo-setyadi-acn5ERAeSb4-unsplash_DuHOwDK8FO.jpg' }] },
        { _id: '2', title: 'Summer wear Sky Blue Shirt', description: '100% Cotton Shirt', price: { amount: 798.99, currency: 'INR' }, images: [] },
        { _id: '3', title: 'Linen Pants', description: 'Office & Daily Wear', price: { amount: 1199, currency: 'INR' }, images: [{ url: 'https://ik.imagekit.io/tusharG/Snitch/Linen_pants_black-4_tQz9sGNB0.jpg' }] },
        { _id: '4', title: 'Summer Wear T-Shirt', description: 'Relaxed fit cotton', price: { amount: 649, currency: 'INR' }, images: [] },
        { _id: '5', title: 'Summer Wear Short Pants', description: 'Breathable summer shorts', price: { amount: 899, currency: 'INR' }, images: [] },
    ];

    const allProducts = products.length > 0 ? products : dummyProducts;

    // Filter products based on query
    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }
        const q = query.toLowerCase();
        const filtered = allProducts.filter(
            p => p.title?.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q)
        ).slice(0, 5);
        setResults(filtered);
    }, [query, products]);

    // Open search input
    const handleToggle = () => {
        setOpen(prev => {
            if (!prev) setTimeout(() => inputRef.current?.focus(), 50);
            return !prev;
        });
        if (open) setQuery('');
    };

    // Close on outside click
    useEffect(() => {
        const handleClick = (e) => {
            if (wrapRef.current && !wrapRef.current.contains(e.target)) {
                setOpen(false);
                setQuery('');
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const handleSelect = (id) => {
        navigate(`/product/${id}`);
        setOpen(false);
        setQuery('');
    };

    // Suggestions when no query
    const suggestions = allProducts.slice(0, 3);
    const showDropdown = open && (results.length > 0 || query.length === 0);
    const displayItems = query.trim() ? results : suggestions;

    return (
        <div className="relative flex items-center" ref={wrapRef}>
            {/* Expandable Input */}
            <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => {
                    if (e.key === 'Escape') { setOpen(false); setQuery(''); }
                    if (e.key === 'Enter' && results.length > 0) handleSelect(results[0]._id);
                }}
                placeholder="Search pieces..."
                className="text-[11px] tracking-[0.1em] outline-none border-b bg-transparent transition-all duration-300 ease-in-out"
                style={{
                    width: open ? '180px' : '0px',
                    opacity: open ? 1 : 0,
                    borderColor: open ? '#C9A96E' : 'transparent',
                    color: '#1b1c1a',
                    padding: open ? '4px 8px 4px 0' : '0',
                    fontFamily: "'DM Sans', sans-serif",
                    pointerEvents: open ? 'all' : 'none',
                }}
            />

            {/* Search Icon Button */}
            <button
                onClick={handleToggle}
                className="p-2 transition-colors duration-200"
                style={{ color: open ? '#C9A96E' : '#7A6E63', background: 'none', border: 'none', cursor: 'pointer' }}
                title="Search"
            >
                {open ? (
                    /* X icon */
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                ) : (
                    /* Search icon */
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <circle cx="11" cy="11" r="7" />
                        <line x1="16.5" y1="16.5" x2="22" y2="22" />
                    </svg>
                )}
            </button>

            {/* Dropdown */}
            {showDropdown && (
                <div
                    className="absolute right-0 top-[calc(100%+12px)] flex flex-col border"
                    style={{
                        width: '260px',
                        backgroundColor: '#fff',
                        borderColor: '#e4e2df',
                        boxShadow: '0 8px 32px rgba(27,28,26,0.1)',
                        zIndex: 200,
                    }}
                >
                    <span
                        className="px-4 py-2 text-[9px] tracking-[0.2em] uppercase"
                        style={{ color: '#b0a99f' }}
                    >
                        {query.trim() ? `${displayItems.length} result${displayItems.length !== 1 ? 's' : ''}` : 'Suggested'}
                    </span>

                    {displayItems.length > 0 ? displayItems.map(product => {
                        const img = product.images?.[0]?.url;
                        return (
                            <button
                                key={product._id}
                                onClick={() => handleSelect(product._id)}
                                className="flex items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-[#fbf9f6] w-full"
                                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                            >
                                {img ? (
                                    <img
                                        src={img} alt={product.title}
                                        className="object-cover flex-shrink-0"
                                        style={{ width: '36px', height: '36px' }}
                                    />
                                ) : (
                                    <div
                                        className="flex items-center justify-center flex-shrink-0"
                                        style={{ width: '36px', height: '36px', backgroundColor: '#f5f3f0' }}
                                    >
                                        <svg width="14" height="14" fill="none" stroke="#C9A96E" strokeWidth="1.5" viewBox="0 0 24 24">
                                            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                                            <line x1="3" y1="6" x2="21" y2="6" />
                                            <path d="M16 10a4 4 0 01-8 0" />
                                        </svg>
                                    </div>
                                )}
                                <div className="flex flex-col gap-0.5">
                                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '13px', color: '#1b1c1a' }}>
                                        {product.title}
                                    </span>
                                    <span style={{ fontSize: '10px', color: '#7A6E63', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                                        {product.price?.currency} {product.price?.amount?.toLocaleString()}
                                    </span>
                                </div>
                            </button>
                        );
                    }) : (
                        <div className="px-4 py-6 text-center">
                            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '14px', color: '#1b1c1a' }}>
                                No results found
                            </p>
                            <p style={{ fontSize: '10px', color: '#b0a99f', marginTop: '4px' }}>
                                Try a different search term
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchBar;