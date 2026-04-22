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
  const [activeImg, setActiveImg] = useState(0);
  const [imgLoaded, setImgLoaded] = useState(false);

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
  const baseImgs = (p?.images || []).map((img) => img.url || img);
  const variantImgs = selectedVariant?.imgs?.length ? selectedVariant.imgs : [];
  const imgs = variantImgs.length ? variantImgs : baseImgs;

  const displayedPrice = selectedVariant?.price?.amount
    ? selectedVariant.price
    : p?.price;

  const stock = selectedVariant != null ? (selectedVariant.stock ?? 0) : null;
  const outOfStock = stock === 0;

  /* reset image index when image set changes */
  useEffect(() => {
    setActiveImg(0);
    setImgLoaded(false);
  }, [imgs.join(',')]); // eslint-disable-line

  const displayImg = imgs[activeImg] || 'https://placehold.co/600x700?text=No+Image';

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
          {/* Variant image badge */}
          {variantImgs.length > 0 && (
            <div className="flex items-center gap-2">
              <span
                className="text-[10px] font-medium tracking-widest uppercase px-2.5 py-1 rounded-full"
                style={{ backgroundColor: 'rgba(201,169,110,0.15)', color: '#9c7a3a' }}
              >
                Variant Images
              </span>
            </div>
          )}

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
          {imgs.length > 1 && (
            <div className="flex gap-2.5 flex-wrap">
              {imgs.map((url, i) => (
                <button
                  key={i}
                  onClick={() => { setImgLoaded(false); setActiveImg(i); }}
                  className={`w-20 h-24 rounded overflow-hidden bg-white cursor-pointer transition border-2 ${
                    i === activeImg ? 'border-gray-900' : 'border-transparent'
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

          {/* Divider */}
          <div className="h-px bg-gray-200 my-1 mb-5" />

          {/* Description */}
          <p className="text-sm text-gray-600 leading-relaxed mb-7">{description}</p>

          {/* ════════════════════════════════════════
              ── Variant Attribute Selectors ──
          ════════════════════════════════════════ */}
          {attrKeys.length > 0 && (
            <div className="mb-7 flex flex-col gap-6">
              {attrKeys.map((key) => (
                <div key={key}>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-bold text-gray-400 tracking-wider uppercase">
                      {key}
                    </p>
                    <span className="text-xs text-gray-500 font-medium">
                      Selected: <span className="text-gray-900">{selectedAttrs[key]}</span>
                    </span>
                  </div>

                  <div className="flex gap-2.5 flex-wrap">
                    {attrValues[key].map((val) => {
                      /* check if this option is currently available with the rest of selected attrs */
                      const testAttrs = { ...selectedAttrs, [key]: val };
                      const isAvailable = variants.some((v) =>
                        Object.entries(testAttrs).every(([k, value]) => v.attrs[k] === value)
                      );
                      const isSelected = selectedAttrs[key] === val;

                      return (
                        <button
                          key={val}
                          onClick={() => isAvailable && handleAttrSelect(key, val)}
                          disabled={!isAvailable}
                          className="transition-all relative"
                          style={{
                            padding: '8px 18px',
                            border: isSelected
                              ? '2px solid #1b1c1a'
                              : '1.5px solid #d1d5db',
                            backgroundColor: isSelected ? '#1b1c1a' : '#ffffff',
                            color: isSelected ? '#ffffff' : isAvailable ? '#374151' : '#9ca3af',
                            fontSize: '13px',
                            fontWeight: isSelected ? 600 : 400,
                            cursor: isAvailable ? 'pointer' : 'not-allowed',
                            borderRadius: '3px',
                            opacity: isAvailable ? 1 : 0.45,
                          }}
                          onMouseEnter={(e) => {
                            if (!isSelected && isAvailable) {
                              e.currentTarget.style.borderColor = '#6b7280';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isSelected && isAvailable) {
                              e.currentTarget.style.borderColor = '#d1d5db';
                            }
                          }}
                        >
                          {val}
                          {/* Unavailable strike-through */}
                          {!isAvailable && (
                            <span
                              style={{
                                position: 'absolute',
                                top: '50%',
                                left: 0,
                                right: 0,
                                height: '1px',
                                backgroundColor: '#d1d5db',
                                transform: 'rotate(-15deg)',
                              }}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Stock info */}
              <div className="flex items-center gap-2">
                {outOfStock ? (
                  <span className="text-xs font-semibold text-red-600 tracking-wide">✗ Out of stock</span>
                ) : stock !== null ? (
                  <span
                    className="text-xs font-semibold tracking-wide"
                    style={{ color: stock <= 5 ? '#b45309' : '#15803d' }}
                  >
                    {stock <= 5 ? `⚡ Only ${stock} left!` : `✔ In stock (${stock} units)`}
                  </span>
                ) : null}
              </div>
            </div>
          )}

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
            <div
              className="mb-7 rounded overflow-hidden"
              style={{ border: '1px solid #e5e7eb' }}
            >
              <div
                className="px-4 py-2.5 text-[10px] font-semibold tracking-widest uppercase"
                style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb', color: '#6b7280' }}
              >
                {variants.length} variant{variants.length !== 1 ? 's' : ''} available
              </div>
              <div className="divide-y divide-gray-100">
                {variants.map((v, i) => {
                  const attrStr = Object.entries(v.attrs)
                    .map(([k, val]) => `${k}: ${val}`)
                    .join(' · ');
                  const isActive = selectedVariant?._id === v._id || (!selectedVariant && i === 0);
                  return (
                    <div
                      key={v._id || i}
                      className="flex items-center justify-between px-4 py-2.5 transition"
                      style={{
                        backgroundColor: isActive ? 'rgba(201,169,110,0.06)' : 'transparent',
                        cursor: 'default',
                      }}
                    >
                      <span className="text-xs text-gray-700">{attrStr || `Variant ${i + 1}`}</span>
                      <div className="flex items-center gap-3">
                        {v.price?.amount && (
                          <span className="text-xs font-semibold text-gray-900">
                            {formatPrice(v.price.amount, v.price.currency)}
                          </span>
                        )}
                        <span
                          className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: v.stock > 0 ? '#dcfce7' : '#fee2e2',
                            color: v.stock > 0 ? '#15803d' : '#dc2626',
                          }}
                        >
                          {v.stock > 0 ? `${v.stock} in stock` : 'Sold out'}
                        </span>
                      </div>
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