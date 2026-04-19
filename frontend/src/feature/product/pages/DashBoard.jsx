import React, { useEffect } from 'react';
import { useProducts } from '../hooks/useProducts';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

const Dashboard = () => {
    const { handleGetSellerProducts } = useProducts();
    const navigate = useNavigate();

    useEffect(() => {
        handleGetSellerProducts();
    }, []);
    const sellerProducts = useSelector(state => state.product.sellerProducts);

    return (
        <>
            {/* Google Fonts */}
            <link
                href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap"
                rel="stylesheet"
            />

            <div
                className="min-h-screen selection:bg-[#C9A96E]/30"
                style={{ backgroundColor: '#fbf9f6', fontFamily: "'Inter', sans-serif" }}
            >
                <div className="max-w-7xl mx-auto px-8 lg:px-16 xl:px-24">

                    {/* ── Top Bar ── */}
                    <div className="pt-10 pb-0 flex items-center gap-5">
                        <button
                            onClick={() => navigate(-1)}
                            className="text-lg transition-colors duration-200 leading-none"
                            style={{ color: '#B5ADA3' }}
                            aria-label="Go back"
                            onMouseEnter={e => e.currentTarget.style.color = '#C9A96E'}
                            onMouseLeave={e => e.currentTarget.style.color = '#B5ADA3'}
                        >
                            ←
                        </button>
                        <span
                            className="text-xs font-medium tracking-[0.32em] uppercase"
                            style={{ fontFamily: "'Cormorant Garamond', serif", color: '#C9A96E' }}
                        >
                            Snitch.
                        </span>
                    </div>

                    {/* ── Page Header ── */}
                    <div className="pt-10 pb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 overflow-hidden">
                        <div>
                            <h1
                                className="text-4xl lg:text-5xl font-light leading-tight"
                                style={{ fontFamily: "'Cormorant Garamond', serif", color: '#1b1c1a' }}
                            >
                                Your Vault
                            </h1>
                            {/* Gold rule separator */}
                            <div className="mt-4 w-14 h-px" style={{ backgroundColor: '#C9A96E' }} />
                        </div>

                        <button
                            onClick={() => navigate('/seller/create-product')}
                            className="py-4 px-8 text-[11px] uppercase tracking-[0.3em] font-medium transition-all duration-300 w-full md:w-auto text-center"
                            style={{
                                backgroundColor: '#1b1c1a',
                                color: '#fbf9f6',
                                fontFamily: "'Inter', sans-serif"
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.backgroundColor = '#C9A96E';
                                e.currentTarget.style.color = '#1b1c1a';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.backgroundColor = '#1b1c1a';
                                e.currentTarget.style.color = '#fbf9f6';
                            }}
                        >
                            New Listing
                        </button>
                    </div>

                    {/* ── Product Grid ── */}
                    {sellerProducts && sellerProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16 pb-24">
                            {sellerProducts.map(product => {
                                const imageUrl = product.images && product.images.length > 0
                                    ? product.images[0].url
                                    : '/snitch_editorial_warm.png'; // Fallback to our warm editorial

                                return (
                                    <div key={product._id} className="group flex flex-col">
                                        {/* Image */}
                                        <div
                                            className="aspect-[4/5] overflow-hidden mb-5 cursor-pointer"
                                            style={{ backgroundColor: '#f5f3f0' }}
                                            onClick={() => navigate(`/product/${product._id}`)}
                                        >
                                            <img
                                                src={imageUrl}
                                                alt={product.title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                        </div>

                                        {/* Details */}
                                        <div className="flex flex-col gap-1.5">
                                            <h3
                                                className="text-xl leading-snug transition-colors duration-300 group-hover:text-[#C9A96E] cursor-pointer"
                                                style={{ fontFamily: "'Cormorant Garamond', serif", color: '#1b1c1a' }}
                                                onClick={() => navigate(`/product/${product._id}`)}
                                            >
                                                {product.title}
                                            </h3>

                                            <p className="text-[12px] line-clamp-2 leading-relaxed" style={{ color: '#7A6E63' }}>
                                                {product.description}
                                            </p>

                                            <span className="text-[10px] uppercase tracking-[0.2em] font-medium mt-1" style={{ color: '#1b1c1a' }}>
                                                {product.price?.currency} {product.price?.amount?.toLocaleString()}
                                            </span>

                                            {/* ── Action Buttons ── */}
                                            <div className="flex gap-2 mt-2">
                                                {/* Edit */}
                                                <button
                                                    onClick={() => navigate(`/seller/edit-product/${product._id}`)}
                                                    className="flex-1 py-2 text-[10px] uppercase tracking-[0.2em] font-medium transition-all duration-300"
                                                    style={{ border: '1px solid #1b1c1a', backgroundColor: 'transparent', color: '#1b1c1a' }}
                                                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#1b1c1a'; e.currentTarget.style.color = '#fbf9f6'; }}
                                                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#1b1c1a'; }}
                                                >
                                                    Edit
                                                </button>

                                                {/* Delete */}
                                                <button
                                                    onClick={() => {
                                                        if (window.confirm(`Delete "${product.title}"? This cannot be undone.`)) {
                                                            console.log('delete', product._id);
                                                        }
                                                    }}
                                                    className="flex-1 py-2 text-[10px] uppercase tracking-[0.2em] font-medium transition-all duration-300"
                                                    style={{ border: '1px solid #C9A96E', backgroundColor: 'transparent', color: '#C9A96E' }}
                                                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#C9A96E'; e.currentTarget.style.color = '#1b1c1a'; }}
                                                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#C9A96E'; }}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="py-24 text-center flex flex-col items-center">
                            <span className="text-[10px] uppercase tracking-[0.2em] font-medium mb-4" style={{ color: '#C9A96E' }}>Empty Vault</span>
                            <p className="max-w-md mx-auto text-lg leading-relaxed" style={{ fontFamily: "'Cormorant Garamond', serif", color: '#7A6E63' }}>
                                You haven't added any curated pieces to your archive yet. Begin by creating a new listing.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Dashboard;