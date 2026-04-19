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
      <span key={i} style={{ position: 'relative', display: 'inline-block', color: '#e5e5e5', fontSize: '1.1rem' }}>
        ★
        <span
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            overflow: 'hidden',
            width: `${fill * 100}%`,
            color: '#f59e0b',
          }}
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

  useEffect(() => {
    handleGetProductFromProductId(productId);
  }, [productId]);

  const product  = useSelector((state) => state.product.products);
  const loading  = useSelector((state) => state.product.loading);

  /* ── loading skeleton ── */
  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.skeleton.wrapper}>
          <div style={styles.skeleton.imgBlock} />
          <div style={styles.skeleton.infoBlock}>
            {[80, 50, 30, 60, 40].map((w, i) => (
              <div key={i} style={{ ...styles.skeleton.line, width: `${w}%` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ── no product guard ── */
  if (!product || (Array.isArray(product) && product.length === 0)) {
    return (
      <div style={styles.page}>
        <div style={styles.empty}>
          <p style={{ color: '#596061', fontFamily: 'Inter, sans-serif' }}>Product not found.</p>
          <button style={styles.backBtn} onClick={() => navigate(-1)}>← Go Back</button>
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
    <div style={styles.page}>
      {/* Back breadcrumb */}
      <nav style={styles.breadcrumb}>
        <span style={styles.breadLink} onClick={() => navigate('/')}>Home</span>
        <span style={styles.breadSep}> / </span>
        <span style={styles.breadLink} onClick={() => navigate(-1)}>Men</span>
        <span style={styles.breadSep}> / </span>
        <span style={styles.breadCurrent}>{title || 'Product'}</span>
      </nav>

      {/* ── main panel ─────────────────────────── */}
      <div style={styles.grid}>

        {/* ── LEFT: image gallery ── */}
        <div style={styles.gallery}>
          {/* Main image */}
          <div style={styles.mainImgWrap}>
            <img
              key={displayImg}
              src={displayImg}
              alt={title}
              style={{ ...styles.mainImg, opacity: imgLoaded ? 1 : 0 }}
              onLoad={() => setImgLoaded(true)}
              onError={(e) => { e.target.src = 'https://placehold.co/600x700?text=No+Image'; setImgLoaded(true); }}
            />
            {!imgLoaded && <div style={styles.skeleton.imgBlock} />}
          </div>

          {/* Thumbnails */}
          {imgs.length > 1 && (
            <div style={styles.thumbRow}>
              {imgs.map((url, i) => (
                <button
                  key={i}
                  onClick={() => { setImgLoaded(false); setActiveImg(i); }}
                  style={{
                    ...styles.thumbBtn,
                    ...(i === activeImg ? styles.thumbBtnActive : {}),
                  }}
                >
                  <img src={url} alt={`view-${i + 1}`} style={styles.thumbImg}
                    onError={(e) => { e.target.src = 'https://placehold.co/80x96?text=img'; }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── RIGHT: product info ── */}
        <div style={styles.info}>

          {/* Title */}
          <h1 style={styles.title}>{title}</h1>

          {/* Rating */}
          <div style={styles.ratingRow}>
            <StarRating rating={4.5} />
            <span style={styles.ratingText}>4.5 &nbsp;·&nbsp; 128 reviews</span>
          </div>

          {/* Price */}
          <div style={styles.priceRow}>
            <span style={styles.price}>
              {price ? formatPrice(price.amount, price.currency) : '₹0'}
            </span>
            <span style={styles.mrp}>
              {price ? formatPrice(price.amount * 2, price.currency) : ''}
            </span>
            <span style={styles.discBadge}>50% OFF</span>
          </div>

          <p style={styles.taxNote}>Inclusive of all taxes</p>

          {/* Divider */}
          <div style={styles.divider} />

          {/* Description */}
          <p style={styles.description}>{description}</p>

          {/* Size selector */}
          <div style={styles.section}>
            <p style={styles.sectionLabel}>SELECT SIZE</p>
            <div style={styles.sizeRow}>
              {sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  style={{
                    ...styles.sizeBtn,
                    ...(s === selectedSize ? styles.sizeBtnActive : {}),
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div style={styles.section}>
            <p style={styles.sectionLabel}>QUANTITY</p>
            <div style={styles.qtyRow}>
              <button
                style={styles.qtyBtn}
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                −
              </button>
              <span style={styles.qtyNum}>{quantity}</span>
              <button
                style={styles.qtyBtn}
                onClick={() => setQuantity((q) => q + 1)}
              >
                +
              </button>
            </div>
          </div>

          {/* CTA buttons */}
          <div style={styles.ctaRow}>
            <button style={styles.cartBtn}>
              <span style={{ marginRight: '8px' }}>🛒</span>
              ADD TO CART
            </button>
            <button style={styles.buyBtn}>
              BUY NOW
            </button>
          </div>

          {/* Trust badges */}
          <div style={styles.trustSection}>
            <div style={styles.trustItem}>
              <span style={styles.trustIcon}>🚚</span>
              <span style={styles.trustText}>Free delivery on orders above ₹499</span>
            </div>
            <div style={styles.trustItem}>
              <span style={styles.trustIcon}>🔄</span>
              <span style={styles.trustText}>7-day easy returns &amp; exchanges</span>
            </div>
            <div style={styles.trustItem}>
              <span style={styles.trustIcon}>✅</span>
              <span style={styles.trustText}>100% authentic products</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

/* ─── styles ──────────────────────────────────────── */
const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#f9f9f9',
    fontFamily: "'Inter', sans-serif",
    padding: '0 0 80px',
    color: '#2d3435',
  },

  /* Breadcrumb */
  breadcrumb: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '20px 40px 8px',
    fontSize: '0.8rem',
    color: '#596061',
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
  },
  breadLink: {
    cursor: 'pointer',
    color: '#596061',
    textDecoration: 'none',
    transition: 'color 0.2s',
  },
  breadSep: { color: '#acb3b4', padding: '0 4px' },
  breadCurrent: { color: '#2d3435', fontWeight: 500 },

  /* Grid */
  grid: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '24px 40px',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '64px',
    alignItems: 'start',
  },

  /* Gallery */
  gallery: { display: 'flex', flexDirection: 'column', gap: '16px', position: 'sticky', top: '24px' },
  mainImgWrap: {
    width: '100%',
    aspectRatio: '4/5',
    backgroundColor: '#ffffff',
    borderRadius: '4px',
    overflow: 'hidden',
    position: 'relative',
    boxShadow: '0 2px 24px rgba(45,52,53,0.06)',
  },
  mainImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
    transition: 'opacity 0.3s ease',
  },
  thumbRow: {
    display: 'flex',
    gap: '10px',
  },
  thumbBtn: {
    width: '80px',
    height: '96px',
    border: '2px solid transparent',
    borderRadius: '4px',
    overflow: 'hidden',
    cursor: 'pointer',
    background: '#fff',
    padding: 0,
    transition: 'border-color 0.2s',
  },
  thumbBtnActive: { borderColor: '#1a1a1a' },
  thumbImg: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },

  /* Info panel */
  info: { display: 'flex', flexDirection: 'column', gap: '0' },

  title: {
    fontSize: '2rem',
    fontWeight: 700,
    color: '#1a1a1a',
    lineHeight: 1.2,
    letterSpacing: '-0.02em',
    margin: '0 0 12px',
  },
  ratingRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '16px',
  },
  ratingText: { fontSize: '0.85rem', color: '#596061' },

  priceRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '4px',
    flexWrap: 'wrap',
  },
  price: { fontSize: '2rem', fontWeight: 700, color: '#1a1a1a', letterSpacing: '-0.02em' },
  mrp: {
    fontSize: '1.1rem',
    color: '#acb3b4',
    textDecoration: 'line-through',
    fontWeight: 400,
  },
  discBadge: {
    fontSize: '0.75rem',
    fontWeight: 700,
    color: '#15803d',
    backgroundColor: '#dcfce7',
    padding: '3px 10px',
    borderRadius: '99px',
    letterSpacing: '0.03em',
  },
  taxNote: { fontSize: '0.75rem', color: '#acb3b4', margin: '0 0 20px', letterSpacing: '0.02em' },

  divider: { height: '1px', backgroundColor: '#e4e9ea', margin: '4px 0 20px' },

  description: {
    fontSize: '0.95rem',
    color: '#596061',
    lineHeight: 1.7,
    margin: '0 0 28px',
  },

  section: { marginBottom: '28px' },
  sectionLabel: {
    fontSize: '0.7rem',
    fontWeight: 700,
    letterSpacing: '0.1em',
    color: '#acb3b4',
    marginBottom: '12px',
  },

  sizeRow: { display: 'flex', gap: '10px', flexWrap: 'wrap' },
  sizeBtn: {
    width: '52px',
    height: '52px',
    border: '1.5px solid #e4e9ea',
    borderRadius: '4px',
    background: '#fff',
    color: '#2d3435',
    fontSize: '0.85rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontFamily: 'Inter, sans-serif',
  },
  sizeBtnActive: {
    border: '2px solid #1a1a1a',
    backgroundColor: '#1a1a1a',
    color: '#fff',
  },

  qtyRow: { display: 'flex', alignItems: 'center', gap: '0' },
  qtyBtn: {
    width: '44px',
    height: '44px',
    border: '1.5px solid #e4e9ea',
    background: '#fff',
    fontSize: '1.2rem',
    color: '#2d3435',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.2s',
    fontFamily: 'Inter, sans-serif',
  },
  qtyNum: {
    width: '56px',
    height: '44px',
    border: '1.5px solid #e4e9ea',
    borderLeft: 'none',
    borderRight: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1rem',
    fontWeight: 600,
    color: '#1a1a1a',
    userSelect: 'none',
  },

  ctaRow: { display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' },
  cartBtn: {
    width: '100%',
    padding: '16px',
    border: '2px solid #1a1a1a',
    backgroundColor: 'transparent',
    color: '#1a1a1a',
    fontSize: '0.85rem',
    fontWeight: 700,
    letterSpacing: '0.1em',
    cursor: 'pointer',
    borderRadius: '4px',
    fontFamily: 'Inter, sans-serif',
    transition: 'all 0.25s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyBtn: {
    width: '100%',
    padding: '16px',
    border: '2px solid #1a1a1a',
    backgroundColor: '#1a1a1a',
    color: '#fff',
    fontSize: '0.85rem',
    fontWeight: 700,
    letterSpacing: '0.1em',
    cursor: 'pointer',
    borderRadius: '4px',
    fontFamily: 'Inter, sans-serif',
    transition: 'all 0.25s',
  },

  trustSection: {
    backgroundColor: '#f2f4f4',
    borderRadius: '4px',
    padding: '20px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  trustItem: { display: 'flex', alignItems: 'center', gap: '12px' },
  trustIcon: { fontSize: '1.1rem' },
  trustText: { fontSize: '0.85rem', color: '#596061' },

  /* Back button */
  backBtn: {
    marginTop: '16px',
    background: 'none',
    border: '1px solid #e4e9ea',
    padding: '10px 20px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.85rem',
    color: '#596061',
  },

  /* Empty / loading */
  empty: {
    maxWidth: '400px',
    margin: '120px auto',
    textAlign: 'center',
  },

  skeleton: {
    wrapper: {
      maxWidth: '1280px',
      margin: '40px auto',
      padding: '24px 40px',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '64px',
    },
    imgBlock: {
      width: '100%',
      aspectRatio: '4/5',
      backgroundColor: '#e4e9ea',
      borderRadius: '4px',
      animation: 'pulse 1.5s ease-in-out infinite',
    },
    infoBlock: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      paddingTop: '20px',
    },
    line: {
      height: '18px',
      backgroundColor: '#e4e9ea',
      borderRadius: '4px',
      animation: 'pulse 1.5s ease-in-out infinite',
    },
  },
};

export default ProductDetailPage;