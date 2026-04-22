import React, { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useProducts } from '../hooks/useProducts';
import { useParams, useNavigate } from 'react-router';

/* ─── helpers ──────────────────────────────────────────── */
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

/**
 * Normalise a variant's `attributes` field.
 * The backend stores it as a Mongoose Map which serialises to a plain object
 * (not a JS Map) when JSON-encoded, so we handle both shapes.
 */
const getAttrs = (variant) => {
  if (!variant?.attributes) return {};
  if (variant.attributes instanceof Map) return Object.fromEntries(variant.attributes);
  return variant.attributes; // already a plain object from JSON
};

/* ─── component ─────────────────────────────────────────── */
const ProductDetailPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { handleGetProductFromProductId } = useProducts();

  /* gallery state */
  const [activeImgUrl, setActiveImgUrl] = useState('');
  const [imgLoaded, setImgLoaded] = useState(false);
  const [price,setPrice] = useState(0);

  /* quantity */
  const [quantity, setQuantity] = useState(1);

  /**
   * selectedAttrs — tracks one chosen value per attribute key.
   * e.g. { Size: 'XL', Color: 'Black' }
   */
  const [selectedAttrs, setSelectedAttrs] = useState({});

  const user = useSelector((state) => state.auth.user);
  const product = useSelector((state) => state.product.products);
  const loading = useSelector((state) => state.product.loading);

  useEffect(() => {
    handleGetProductFromProductId(productId);
  }, [productId]);

  /* ── derive the flat product object ── */
  const p = Array.isArray(product) ? product[0] : product;

  /* ── variants: normalise images + attributes ── */
  const variants = useMemo(() => {
    if (!p?.varients?.length) return [];
    return p.varients.map((v) => ({
      ...v,
      attrs: getAttrs(v),
      imgs: (v.images || []).map((img) => img.url || img).filter(Boolean),
    }));
  }, [p]);

  /* ── unique attribute keys across all variants ── */
  const attrKeys = useMemo(() => {
    const keys = new Set();
    variants.forEach((v) => Object.keys(v.attrs).forEach((k) => keys.add(k)));
    return [...keys];
  }, [variants]);

  /* ── unique values per key ── */
  const attrValues = useMemo(() => {
    const map = {};
    attrKeys.forEach((key) => {
      map[key] = [...new Set(variants.map((v) => v.attrs[key]).filter(Boolean))];
    });
    return map;
  }, [attrKeys, variants]);

  /* ── seed selectedAttrs once attrKeys are known ── */
  useEffect(() => {
    if (attrKeys.length > 0) {
      const initial = {};
      attrKeys.forEach((k) => {
        initial[k] = attrValues[k]?.[0] ?? '';
      });
      setSelectedAttrs(initial);
    }
  }, [attrKeys.join(',')]); // eslint-disable-line

  /* ── match selected attrs to a specific variant ── */
  const selectedVariant = useMemo(() => {
    if (!variants.length || !Object.keys(selectedAttrs).length) return null;
    return variants.find((v) =>
      attrKeys.every((k) => v.attrs[k] === selectedAttrs[k])
    ) ?? null;
  }, [variants, selectedAttrs, attrKeys]);

  /* ── resolve what to display ── */
  const baseImgs = useMemo(() => (p?.images || []).map((img) => img.url || img), [p]);

  const displayedPrice = selectedVariant?.price?.amount
    ? selectedVariant.price
    : p?.price;

  const stock = selectedVariant != null ? (selectedVariant.stock ?? 0) : null;
  const outOfStock = stock === 0;

  /* reset image when base images change */
  useEffect(() => {
    if (baseImgs.length > 0) {
      setActiveImgUrl(baseImgs[0]);
    } else {
      setActiveImgUrl('https://placehold.co/600x700?text=No+Image');
    }
    setImgLoaded(false);
  }, [baseImgs.join(',')]); // eslint-disable-line

  const displayImg = activeImgUrl || 'https://placehold.co/600x700?text=No+Image';

  /* ── handlers ── */
  const handleAttrSelect = (key, value) => {
    setSelectedAttrs((prev) => ({ ...prev, [key]: value }));
    setQuantity(1);
  };

  const handleBuyNow = async () => {
    if (!user) navigate('/login');
    else alert('Done');
  };

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
  if (!p) {
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

  const { title, description } = p;

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20 text-gray-700">

      {/* Breadcrumb */}
      <nav className="max-w-5xl mx-auto px-10 py-5 text-xs text-gray-600 flex items-center gap-1">
        <span className="cursor-pointer hover:text-gray-900 transition" onClick={() => navigate('/')}>Home</span>
        <span className="text-gray-400 px-1"> / </span>
        <span className="cursor-pointer hover:text-gray-900 transition" onClick={() => navigate(-1)}>Products</span>
        <span className="text-gray-400 px-1"> / </span>
        <span className="text-gray-900 font-medium">{title || 'Product'}</span>
      </nav>

      {/* Main Grid */}
      <div className="max-w-5xl mx-auto px-10 py-6 grid grid-cols-2 gap-16 items-start">

        {/* ── LEFT: Gallery ── */}
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
              onError={(e) => { e.target.src = 'https://placehold.co/600x700?text=No+Image'; setImgLoaded(true); }}
            />
            {!imgLoaded && <div className="absolute inset-0 bg-gray-300 animate-pulse" />}

            {/* Out of stock overlay */}
            {outOfStock && (
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{ backgroundColor: 'rgba(255,255,255,0.7)' }}
              >
                <span
                  className="text-xs font-bold tracking-[0.25em] uppercase px-5 py-2 rounded"
                  style={{ backgroundColor: '#1b1c1a', color: '#fbf9f6' }}
                >
                  Out of Stock
                </span>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {baseImgs.length > 1 && (
            <div className="flex gap-2.5 flex-wrap">
              {baseImgs.map((url, i) => (
                <button
                  key={i}
                  onClick={() => { setImgLoaded(false); setActiveImgUrl(url); setSelectedAttrs(product) }}
                  className={`w-20 h-24 rounded overflow-hidden bg-white cursor-pointer transition border-2 ${
                    url === activeImgUrl ? 'border-gray-900' : 'border-transparent'
                  }`}
                >
                  <img
                    src={url}
                    alt={`view-${i + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = 'https://placehold.co/80x96?text=img'; }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── RIGHT: Product Info ── */}
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
              {displayedPrice ? formatPrice(displayedPrice.amount, displayedPrice.currency) : '₹0'}
            </span>
            <span className="text-xl text-gray-400 line-through font-normal">
              {displayedPrice ? formatPrice(displayedPrice.amount * 2, displayedPrice.currency) : ''}
            </span>
            <span className="text-xs font-bold text-green-700 bg-green-100 px-2.5 py-0.5 rounded-full tracking-wide">
              50% OFF
            </span>
          </div>
          <p className="text-xs text-gray-400 mb-5 tracking-wide">Inclusive of all taxes</p>

          {/* Selected Variant Attributes */}
          {selectedVariant && Object.keys(selectedVariant.attrs).length > 0 && (
            <div className="mb-5 flex gap-2 flex-wrap">
              {Object.entries(selectedVariant.attrs).map(([k, val]) => (
                <span key={k} className="text-sm font-medium bg-gray-100 text-gray-800 px-3 py-1 rounded border border-gray-200">
                  <span className="text-gray-500 mr-1">{k}:</span> {val}
                </span>
              ))}
            </div>
          )}

          {/* Divider */}
          <div className="h-px bg-gray-200 my-1 mb-5" />

          {/* Description */}
          <p className="text-sm text-gray-600 leading-relaxed mb-7">{description}</p>

          {/* Quantity */}
          <div className="mb-7">
            <p className="text-xs font-bold text-gray-400 mb-3 tracking-wider uppercase">Quantity</p>
            <div className="flex items-center gap-0">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-11 h-11 border-1.5 border-gray-200 bg-white text-gray-700 flex items-center justify-center hover:bg-gray-50 transition"
                disabled={outOfStock}
              >
                −
              </button>
              <span className="w-14 h-11 border-y-1.5 border-gray-200 flex items-center justify-center text-base font-bold text-gray-900">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => stock !== null ? Math.min(stock, q + 1) : q + 1)}
                className="w-11 h-11 border-1.5 border-gray-200 bg-white text-gray-700 flex items-center justify-center hover:bg-gray-50 transition"
                disabled={outOfStock}
              >
                +
              </button>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-3 mb-7">
            <button
              className="w-full py-4 border-2 border-gray-900 bg-transparent text-gray-900 text-sm font-bold tracking-widest uppercase rounded transition hover:bg-gray-900 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
              disabled={outOfStock}
            >
              <span className="mr-2">🛒</span>
              ADD TO CART
            </button>
            <button
              onClick={handleBuyNow}
              disabled={outOfStock}
              className="w-full py-4 border-2 border-gray-900 bg-gray-900 text-white text-sm font-bold tracking-widest uppercase rounded transition hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              BUY NOW
            </button>
          </div>

          {/* ── Variants summary strip (shown when variants exist) ── */}
          {variants.length > 0 && (
            <div className="mb-7">
              <p className="text-xs font-bold text-gray-400 mb-3 tracking-wider uppercase">
                {variants.length} Variant{variants.length !== 1 ? 's' : ''} Available
              </p>
              <div className="flex flex-col gap-3">
                {variants.map((v, i) => {
                  const attrStr = Object.entries(v.attrs)
                    .map(([k, val]) => `${k}: ${val}`)
                    .join(' · ');
                  const isActive = selectedVariant?._id === v._id;

                  return (
                    <div 
                      key={v._id || i}
                      onClick={() => {
                        setSelectedAttrs(v.attrs);
                        if (v.imgs?.length > 0 && !v.imgs.includes(activeImgUrl)) {
                          setImgLoaded(false);
                          setActiveImgUrl(v.imgs[0]);
                        }
                      }}
                      className="flex flex-col p-4 rounded border transition cursor-pointer"
                      style={{
                        borderColor: isActive ? '#1b1c1a' : '#e5e7eb',
                        backgroundColor: isActive ? 'rgba(201,169,110,0.03)' : '#ffffff',
                      }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-semibold text-gray-900">{attrStr || `Variant ${i + 1}`}</span>
                        <div className="flex items-center gap-3">
                          {v.price?.amount && (
                            <span className="text-sm font-bold text-gray-900">
                              {formatPrice(v.price.amount, v.price.currency)}
                            </span>
                          )}
                          <span
                            className="text-[10px] font-medium px-2.5 py-1 rounded-full"
                            style={{
                              backgroundColor: v.stock > 0 ? '#dcfce7' : '#fee2e2',
                              color: v.stock > 0 ? '#15803d' : '#dc2626',
                            }}
                          >
                            {v.stock > 0 ? `${v.stock} in stock` : 'Sold out'}
                          </span>
                        </div>
                      </div>
                      
                      {/* Variant Images */}
                      {v.imgs?.length > 0 && (
                        <div className="flex gap-2 flex-wrap">
                          {v.imgs.map((img, imgIdx) => (
                            <button
                              key={imgIdx}
                              onClick={(e) => { 
                                e.stopPropagation(); 
                                setImgLoaded(false); 
                                setActiveImgUrl(img); 
                                setSelectedAttrs(v.attrs); 
                              }}
                              className={`w-14 h-16 rounded overflow-hidden border-2 transition ${
                                activeImgUrl === img ? 'border-gray-900' : 'border-transparent hover:border-gray-300'
                              }`}
                            >
                              <img src={img} alt={`variant-${imgIdx}`} className="w-full h-full object-cover" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

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