import React, { useEffect } from 'react';
import { useProducts } from '../hooks/useProducts';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import Navbar from '../../shared/components/Navbar';

const Dashboard = () => {
    const { handleGetSellerProducts , handleDeleteProduct } = useProducts();
    const navigate = useNavigate();

    useEffect(() => {
        handleGetSellerProducts();
    }, []);

    const sellerProducts = useSelector(state => state.product.sellerProducts);

    const handleDelete = async (productId) => {
         await handleDeleteProduct(productId);
         await handleGetSellerProducts();
    }

    return (
        <>
        <Navbar />
            <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />

            <div className="min-h-screen selection:bg-[#C9A96E]/30"
                style={{ backgroundColor: '#fbf9f6', fontFamily: "'DM Sans', sans-serif" }}>

                <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 xl:px-24">

                    {/* ── Page Header ── */}
                    <div className="pt-7 sm:pt-10 pb-7 sm:pb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6">
                        <div>
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light leading-tight"
                                style={{ fontFamily: "'Cormorant Garamond', serif", color: '#1b1c1a' }}>
                                Your Vault
                            </h1>
                            <div className="mt-3 sm:mt-4 w-10 sm:w-14 h-px" style={{ backgroundColor: '#C9A96E' }} />
                        </div>

                        <button
                            onClick={() => navigate('/seller/create-product')}
                            className="py-3 sm:py-4 px-6 sm:px-8 text-[10px] sm:text-[11px] uppercase tracking-[0.25em] sm:tracking-[0.3em] font-medium transition-all duration-300 w-full sm:w-auto text-center"
                            style={{ backgroundColor: '#1b1c1a', color: '#fbf9f6', border: 'none', cursor: 'pointer' }}
                            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#C9A96E'; e.currentTarget.style.color = '#1b1c1a'; }}
                            onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#1b1c1a'; e.currentTarget.style.color = '#fbf9f6'; }}>
                            + New Listing
                        </button>
                    </div>

                    {/* ── Product Count ── */}
                    {sellerProducts?.length > 0 && (
                        <p className="mb-4 sm:mb-6 text-[10px] tracking-[0.12em] uppercase" style={{ color: '#7A6E63' }}>
                            {sellerProducts.length} piece{sellerProducts.length !== 1 ? 's' : ''} listed
                        </p>
                    )}

                    {/* ── Product Grid ── */}
                    {sellerProducts && sellerProducts.length > 0 ? (
                        // 👇 2 cols on mobile, 3 on tablet, 4 on desktop — same as HomePage
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-3 gap-y-8 sm:gap-x-6 sm:gap-y-12 lg:gap-x-8 lg:gap-y-16 pb-20 sm:pb-28">
                            {sellerProducts.map(product => {
                                const imageUrl = product.images?.[0]?.url || null;

                                return (
                                    <div key={product._id} className="group flex flex-col">

                                        {/* ── Image ── */}
                                        <div className="relative aspect-[3/4] sm:aspect-[4/5] overflow-hidden mb-2.5 sm:mb-4 cursor-pointer"
                                            style={{ backgroundColor: '#f5f3f0' }}
                                            onClick={() => navigate(`/product/${product._id}`)}>

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

                                            {/* Stock badge */}
                                            {product.stock <= 3 && product.stock > 0 && (
                                                <span className="absolute top-2 left-2 text-[8px] sm:text-[9px] tracking-[0.12em] uppercase px-1.5 py-0.5"
                                                    style={{ backgroundColor: '#fff', color: '#1b1c1a' }}>
                                                    Only {product.stock} left
                                                </span>
                                            )}
                                        </div>

                                        {/* ── Details ── */}
                                        <div className="flex flex-col gap-1 sm:gap-1.5">
                                            <h3 className="text-sm sm:text-lg leading-snug transition-colors duration-300 group-hover:text-[#C9A96E] cursor-pointer"
                                                style={{ fontFamily: "'Cormorant Garamond', serif", color: '#1b1c1a' }}
                                                onClick={() => navigate(`/product/${product._id}`)}>
                                                {product.title}
                                            </h3>

                                            {/* Description hidden on mobile */}
                                            <p className="hidden sm:block text-[11px] line-clamp-2 leading-relaxed" style={{ color: '#7A6E63' }}>
                                                {product.description}
                                            </p>

                                            <span className="text-[10px] uppercase tracking-[0.15em] sm:tracking-[0.2em] font-medium mt-0.5 sm:mt-1"
                                                style={{ color: '#1b1c1a' }}>
                                                {product.price?.currency} {product.price?.amount?.toLocaleString()}
                                            </span>

                                            {/* ── Action Buttons ── */}
                                            <div className="flex gap-1.5 sm:gap-2 mt-1.5 sm:mt-2">
                                                <button
                                                    onClick={() => navigate(`/seller/edit-product/${product._id}`)}
                                                    className="flex-1 py-1.5 sm:py-2 text-[9px] sm:text-[10px] uppercase tracking-[0.15em] sm:tracking-[0.2em] font-medium transition-all duration-300"
                                                    style={{ border: '1px solid #1b1c1a', backgroundColor: 'transparent', color: '#1b1c1a', cursor: 'pointer' }}
                                                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#1b1c1a'; e.currentTarget.style.color = '#fbf9f6'; }}
                                                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#1b1c1a'; }}>
                                                    Edit
                                                </button>

                                                <button
                                                    onClick={()=>{handleDelete(product._id)}}
                                                    className="flex-1 py-1.5 sm:py-2 text-[9px] sm:text-[10px] uppercase tracking-[0.15em] sm:tracking-[0.2em] font-medium transition-all duration-300"
                                                    style={{ border: '1px solid #C9A96E', backgroundColor: 'transparent', color: '#C9A96E', cursor: 'pointer' }}
                                                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#C9A96E'; e.currentTarget.style.color = '#1b1c1a'; }}
                                                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#C9A96E'; }}>
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        /* ── Empty State ── */
                        <div className="py-20 sm:py-28 text-center flex flex-col items-center">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mb-5 sm:mb-6"
                                style={{ backgroundColor: '#f5f3f0' }}>
                                <svg width="22" height="22" fill="none" stroke="#C9A96E" strokeWidth="1.2" viewBox="0 0 24 24">
                                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                                    <line x1="3" y1="6" x2="21" y2="6" />
                                    <path d="M16 10a4 4 0 01-8 0" />
                                </svg>
                            </div>
                            <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-medium mb-3 sm:mb-4"
                                style={{ color: '#C9A96E' }}>
                                Empty Vault
                            </span>
                            <p className="max-w-xs sm:max-w-md mx-auto text-base sm:text-lg leading-relaxed mb-7 sm:mb-8"
                                style={{ fontFamily: "'Cormorant Garamond', serif", color: '#7A6E63' }}>
                                You haven't added any curated pieces yet. Begin by creating your first listing.
                            </p>
                            <button
                                onClick={() => navigate('/seller/create-product')}
                                className="text-[9px] sm:text-[10px] font-medium tracking-[0.2em] uppercase px-7 sm:px-9 py-2.5 sm:py-3 transition-opacity hover:opacity-80"
                                style={{ backgroundColor: '#1b1c1a', color: '#C9A96E', border: 'none', cursor: 'pointer' }}>
                                Create Listing
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Dashboard;