import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useProducts } from '../hooks/useProducts';
import { useParams, useNavigate } from 'react-router';

/* ─── helpers ─────────────────────────────────────── */
const formatPrice = (amount, currency = 'INR') =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);

const StarRating = ({ rating = 4.5 }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    const fill = i <= Math.floor(rating) ? 1 : i - rating < 1 ? i - rating : 0;
    stars.push(
      <span key={i} className="relative inline-block text-gray-400 text-lg">
        ★
        <span
          className="absolute left-0 top-0 overflow-hidden text-amber-400"
          style={{ width: `${fill * 100}%` }}
        >
          ★
        </span>
      </span>
    );
  }
  return <>{stars}</>;
};

/* ─── component ───────────────────────────────────── */
const ProductDetailPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { handleGetProductFromProductId } = useProducts();

  /* local UI state */
  const [activeImg, setActiveImg] = useState(0);
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [imgLoaded, setImgLoaded]  = useState(false);

  const user = useSelector(state => state.auth.user);

  const handleBuyNow =  async()=>{
    if(!user){
      navigate('/login');
    }
    else {
      alert("Done");
    }
  }

  useEffect(() => {
    handleGetProductFromProductId(productId);
  }, [productId]);

  const product  = useSelector((state) => state.product.products);
  const loading  = useSelector((state) => state.product.loading);

  /* ── loading skeleton ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans pb-20">
        <div className="max-w-5xl mx-auto px-10 py-6 grid grid-cols-2 gap-16">
          <div className="w-full aspect-[4/5] bg-gray-300 rounded animate-pulse" />
          <div className="flex flex-col gap-4 pt-5">
            {[80, 50, 30, 60, 40].map((w, i) => (
              <div key={i} className="h-4 bg-gray-300 rounded animate-pulse" style={{ width: `${w}%` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ── no product guard ── */
  if (!product || (Array.isArray(product) && product.length === 0)) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans pb-20">
        <div className="max-w-sm mx-auto text-center pt-32">
          <p className="text-gray-600 font-sans mb-4">Product not found.</p>
          <button 
            onClick={() => navigate(-1)}
            className="mt-4 border border-gray-300 px-5 py-2.5 rounded text-sm text-gray-600 hover:bg-gray-50 transition"
          >
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  /* The API dispatches setProducts(result.products) — which may be an array or a direct doc.
     Handle both shapes gracefully. */
  const p = Array.isArray(product) ? product[0] : product;
  const { title, description, price, images = [] } = p || {};

  const imgs = images.map((img) => img.url || img);
  const displayImg = imgs[activeImg] || 'https://placehold.co/600x700?text=No+Image';

  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20 text-gray-700">
      {/* Breadcrumb */}
      <nav className="max-w-5xl mx-auto px-10 py-5 text-xs text-gray-600 flex items-center gap-1">
        <span className="cursor-pointer hover:text-gray-900 transition" onClick={() => navigate('/')}>Home</span>
        <span className="text-gray-400 px-1"> / </span>
        <span className="cursor-pointer hover:text-gray-900 transition" onClick={() => navigate(-1)}>Men</span>
        <span className="text-gray-400 px-1"> / </span>
        <span className="text-gray-900 font-medium">{title || 'Product'}</span>
      </nav>

      {/* Main Grid */}
      <div className="max-w-5xl mx-auto px-10 py-6 grid grid-cols-2 gap-16 items-start">

        {/* LEFT: Gallery */}
        <div className="flex flex-col gap-4 sticky top-6">
          {/* Main Image */}
          <div className="w-full aspect-[4/5] bg-white rounded overflow-hidden relative shadow-sm">
            <img
              key={displayImg}
              src={displayImg}
              alt={title}
              className="w-full h-full object-cover transition-opacity duration-300"
              style={{ opacity: imgLoaded ? 1 : 0 }}
              onLoad={() => setImgLoaded(true)}
              onError={(e) => { 
                e.target.src = 'https://placehold.co/600x700?text=No+Image'; 
                setImgLoaded(true); 
              }}
            />
            {!imgLoaded && <div className="absolute inset-0 bg-gray-300 animate-pulse" />}
          </div>

          {/* Thumbnails */}
          {imgs.length > 1 && (
            <div className="flex gap-2.5">
              {imgs.map((url, i) => (
                <button
                  key={i}
                  onClick={() => { 
                    setImgLoaded(false); 
                    setActiveImg(i); 
                  }}
                  className={`w-20 h-24 rounded overflow-hidden bg-white cursor-pointer transition border-2 ${
                    i === activeImg ? 'border-gray-900' : 'border-transparent'
                  }`}
                >
                  <img 
                    src={url} 
                    alt={`view-${i + 1}`} 
                    className="w-full h-full object-cover"
                    onError={(e) => { 
                      e.target.src = 'https://placehold.co/80x96?text=img'; 
                    }} 
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: Product Info */}
        <div className="flex flex-col gap-0">

          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-900 leading-tight mb-3 tracking-tight">
            {title}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <StarRating rating={4.5} />
            <span className="text-sm text-gray-600">4.5 &nbsp;·&nbsp; 128 reviews</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3 mb-1 flex-wrap">
            <span className="text-4xl font-bold text-gray-900 tracking-tight">
              {price ? formatPrice(price.amount, price.currency) : '₹0'}
            </span>
            <span className="text-xl text-gray-400 line-through font-normal">
              {price ? formatPrice(price.amount * 2, price.currency) : ''}
            </span>
            <span className="text-xs font-bold text-green-700 bg-green-100 px-2.5 py-0.5 rounded-full tracking-wide">
              50% OFF
            </span>
          </div>

          <p className="text-xs text-gray-400 mb-5 tracking-wide">Inclusive of all taxes</p>

          {/* Divider */}
          <div className="h-px bg-gray-200 my-1 mb-5" />

          {/* Description */}
          <p className="text-sm text-gray-600 leading-relaxed mb-7">
            {description}
          </p>

          {/* Size Selector */}
          <div className="mb-7">
            <p className="text-xs font-bold text-gray-400 mb-3 tracking-wider uppercase">SELECT SIZE</p>
            <div className="flex gap-2.5 flex-wrap">
              {sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`w-13 h-13 border-1.5 rounded text-sm font-medium transition-all ${
                    s === selectedSize
                      ? 'bg-gray-900 text-white border-gray-900'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="mb-7">
            <p className="text-xs font-bold text-gray-400 mb-3 tracking-wider uppercase">QUANTITY</p>
            <div className="flex items-center gap-0">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-11 h-11 border-1.5 border-gray-200 bg-white text-gray-700 flex items-center justify-center hover:bg-gray-50 transition"
              >
                −
              </button>
              <span className="w-14 h-11 border-y-1.5 border-gray-200 flex items-center justify-center text-base font-bold text-gray-900">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-11 h-11 border-1.5 border-gray-200 bg-white text-gray-700 flex items-center justify-center hover:bg-gray-50 transition"
              >
                +
              </button>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-3 mb-7">
            <button className="w-full py-4 border-2 border-gray-900 bg-transparent text-gray-900 text-sm font-bold tracking-widest uppercase rounded transition hover:bg-gray-900 hover:text-white">
              <span className="mr-2">🛒</span>
              ADD TO CART
            </button>
            <button onClick={handleBuyNow} className="w-full py-4 border-2 border-gray-900 bg-gray-900 text-white text-sm font-bold tracking-widest uppercase rounded transition hover:bg-gray-800">
              BUY NOW
            </button>
          </div>

          {/* Trust Badges */}
          <div className="bg-gray-100 rounded p-5 flex flex-col gap-3.5">
            <div className="flex items-center gap-3">
              <span className="text-lg">🚚</span>
              <span className="text-sm text-gray-600">Free delivery on orders above ₹499</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-lg">🔄</span>
              <span className="text-sm text-gray-600">7-day easy returns &amp; exchanges</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-lg">✅</span>
              <span className="text-sm text-gray-600">100% authentic products</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;