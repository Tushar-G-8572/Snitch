import React, { useEffect, useState } from 'react';
import { useCart } from '../hooks/useCart';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

const fmt = (amount, currency = 'INR') =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);

/* ── helper: pick the best image for a cart item ── */
function getItemImage(item) {
  // Case 1: variant item — use varients.images[]
  if (item.varient && item.product?.varients?.images?.length > 0) {
    return item.product.varients.images[0].url;
  }
  // Case 2: non-variant item — product.images is a single object
  if (item.product?.images?.url) {
    return item.product.images.url;
  }
  // Case 3: images array fallback
  if (Array.isArray(item.product?.images) && item.product.images[0]?.url) {
    return item.product.images[0].url;
  }
  return 'https://placehold.co/160x200?text=No+Image';
}

/* ── AI Negotiate Modal ── */
function NegotiateModal({ total, onClose }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const negotiate = () => {
    setLoading(true);
    setTimeout(() => {
      const discount = total > 10000 ? '15%' : total > 7500 ? '10%' : '7%';
      setResult(
        `🎉 Great news! Based on your cart value of ${fmt(total)}, you qualify for a ${discount} discount. Use code SNITCH${discount.replace('%', '')} at checkout. Valid for the next 24 hours.`
      );
      setLoading(false);
    }, 1800);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
    }}>
      <div style={{
        background: '#fff', borderRadius: '1.25rem', maxWidth: '440px', width: '100%',
        padding: '2rem', boxShadow: '0 20px 60px rgba(0,0,0,0.2)', position: 'relative'
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: '1rem', right: '1rem',
          background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: '#9ca3af'
        }}>✕</button>

        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🤖</div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#111827', marginBottom: '0.25rem' }}>
            AI Price Negotiator
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>
            Our AI will analyze your cart and negotiate the best discount with the seller.
          </p>
        </div>

        <div style={{
          background: 'linear-gradient(135deg,#f0fdf4,#dcfce7)',
          border: '1px solid #bbf7d0', borderRadius: '0.75rem',
          padding: '0.75rem 1rem', marginBottom: '1.25rem', textAlign: 'center'
        }}>
          <span style={{ fontSize: '0.75rem', color: '#15803d', fontWeight: 600 }}>Cart Value</span>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#166534' }}>{fmt(total)}</div>
        </div>

        {result ? (
          <div style={{
            background: 'linear-gradient(135deg,#fffbeb,#fef3c7)',
            border: '1px solid #fde68a', borderRadius: '0.75rem',
            padding: '1rem', fontSize: '0.875rem', color: '#92400e', lineHeight: 1.6, marginBottom: '1rem'
          }}>
            {result}
          </div>
        ) : (
          <button
            onClick={negotiate}
            disabled={loading}
            style={{
              width: '100%', padding: '0.875rem',
              background: loading ? '#9ca3af' : 'linear-gradient(135deg,#7c3aed,#4f46e5)',
              color: '#fff', border: 'none', borderRadius: '0.75rem',
              fontSize: '0.9rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
              letterSpacing: '0.03em', transition: 'opacity 0.2s', marginBottom: '0.75rem'
            }}
          >
            {loading ? '🔄 Negotiating...' : '✨ Negotiate Now'}
          </button>
        )}

        <button onClick={onClose} style={{
          width: '100%', padding: '0.75rem',
          background: 'none', border: '1.5px solid #e5e7eb', borderRadius: '0.75rem',
          fontSize: '0.85rem', fontWeight: 600, color: '#374151', cursor: 'pointer'
        }}>
          Close
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════ */
const AddToCartPage = () => {
  const navigate = useNavigate();
  const { handleGetAddToCartProduct, handleUpdateQuantity, handleRemoveAddToCart } = useCart();
  const cartProducts = useSelector(state => state.cart.cartProducts);
  const loading = useSelector(state => state.cart.loading);
  const [showNegotiate, setShowNegotiate] = useState(false);
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => { handleGetAddToCartProduct(); }, []);
  console.log(cartProducts)

  const cart = Array.isArray(cartProducts) && cartProducts.length > 0 ? cartProducts[0] : cartProducts;
  const items = cart?.items || [];

  // Use trustedPrice * quantity for correct totals
  const total = items.reduce((acc, item) => acc + (item.trustedPrice || item.price?.amount || 0) * (item.quantity || 1), 0);

  const onDecrement = (item) => {
    if (item.quantity <= 1) return;
    console.log(item._id, item.quantity - 1)
    // handleUpdateQuantity(item._id, item.quantity - 1);
  };

  const onIncrement = (item) => {
    console.log(item._id, item.quantity + 1)
    // handleUpdateQuantity(item._id, item.quantity + 1);
  };

  const onRemove = async (itemId) => {
    // setRemovingId(itemId);
    console.log(itemId);
    await handleRemoveAddToCart(itemId);
    await handleGetAddToCartProduct()
    // setRemovingId(null);
  };

  /* ── Skeleton loader ── */
  if (loading && items.length === 0) {
    return (
      <div style={{ minHeight: '100vh', background: '#f9fafb', fontFamily: "'Inter','Segoe UI',sans-serif", padding: '2.5rem 1.25rem' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <div style={{ height: '2.5rem', width: '12rem', background: '#e5e7eb', borderRadius: '0.5rem', marginBottom: '2rem', animation: 'pulse 1.5s infinite' }} />
          {[1, 2, 3].map(i => (
            <div key={i} style={{ height: '9rem', background: '#e5e7eb', borderRadius: '1rem', marginBottom: '1rem', animation: 'pulse 1.5s infinite' }} />
          ))}
        </div>
      </div>
    );
  }

  /* ── Empty cart ── */
  if (!loading && items.length === 0) {
    return (
      <div style={{ minHeight: '100vh', background: '#f9fafb', fontFamily: "'Inter','Segoe UI',sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🛒</div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', marginBottom: '0.5rem' }}>Your cart is empty</h2>
          <p style={{ color: '#6b7280', marginBottom: '2rem', fontSize: '0.9rem' }}>Looks like you haven't added anything yet.</p>
          <button
            onClick={() => navigate('/')}
            style={{ padding: '0.875rem 2.5rem', background: '#111827', color: '#fff', border: 'none', borderRadius: '0.75rem', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', letterSpacing: '0.05em' }}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const isHighValue = total >= 5000;

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', fontFamily: "'Inter','Segoe UI',sans-serif", color: '#111827' }}>
      {showNegotiate && <NegotiateModal total={total} onClose={() => setShowNegotiate(false)} />}

      {/* ── Header ── */}
      <nav style={{ background: '#fff', borderBottom: '1px solid #f3f4f6', padding: '1rem 2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', color: '#6b7280' }}>
          <span style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>Home</span>
          <span>/</span>
          <span style={{ color: '#111827', fontWeight: 600 }}>Cart</span>
        </div>
        <span style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.02em', color: '#111827' }}>SNITCH</span>
      </nav>

      <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '2rem 1.25rem' }}>
        <h1 style={{ fontSize: '1.9rem', fontWeight: 800, marginBottom: '0.25rem', letterSpacing: '-0.03em' }}>
          Your Cart
        </h1>
        <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '2rem' }}>
          {items.length} item{items.length !== 1 ? 's' : ''} in your bag
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,2fr) 340px', gap: '2rem', alignItems: 'start' }}>

          {/* ── Left: Cart Items ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {items.map((item) => {
              const isPopulated = typeof item.product === 'object' && item.product !== null;
              const productId = isPopulated ? item.product._id : item.product;
              const title = isPopulated ? item.product.title : `Product #${productId}`;
              const imgUrl = getItemImage(item);
              const attrs = item.product?.varients?.attributes || null;
              const unitPrice = item.trustedPrice || item.price?.amount || 0;
              const lineTotal = unitPrice * (item.quantity || 1);
              const isRemoving = removingId === item._id;

              return (
                <div
                  key={item._id}
                  style={{
                    background: '#fff', borderRadius: '1rem',
                    border: '1px solid #f3f4f6',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                    overflow: 'hidden',
                    opacity: isRemoving ? 0.4 : 1,
                    transition: 'opacity 0.3s'
                  }}
                >
                  <div style={{ display: 'flex', gap: '1.25rem', padding: '1.25rem' }}>
                    {/* Image */}
                    <div
                      onClick={() => navigate(`/product/${productId}`)}
                      style={{ width: '110px', flexShrink: 0, cursor: 'pointer', borderRadius: '0.625rem', overflow: 'hidden', background: '#f3f4f6' }}
                    >
                      <img
                        src={imgUrl}
                        alt={title}
                        style={{ width: '100%', aspectRatio: '4/5', objectFit: 'cover', display: 'block' }}
                        onError={e => { e.target.src = 'https://placehold.co/160x200?text=No+Image'; }}
                      />
                    </div>

                    {/* Details */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <h3
                        onClick={() => navigate(`/product/${productId}`)}
                        style={{ fontSize: '1rem', fontWeight: 700, cursor: 'pointer', lineHeight: 1.3, margin: 0, color: '#111827' }}
                      >
                        {title}
                      </h3>

                      {/* Attributes badges */}
                      {attrs && Object.keys(attrs).length > 0 && (
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          {Object.entries(attrs).map(([k, v]) => (
                            <span key={k} style={{
                              fontSize: '0.72rem', padding: '0.2rem 0.6rem',
                              background: '#f9fafb', border: '1px solid #e5e7eb',
                              borderRadius: '999px', color: '#374151', fontWeight: 500
                            }}>
                              {k}: <b>{v}</b>
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Price per unit */}
                      <p style={{ fontSize: '0.78rem', color: '#9ca3af', margin: 0 }}>
                        {fmt(unitPrice)} per item
                      </p>

                      {/* Qty + Line Total row */}
                      <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                        {/* Qty controls */}
                        <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #e5e7eb', borderRadius: '0.625rem', overflow: 'hidden' }}>
                          <button
                            onClick={() => onDecrement(item)}
                            disabled={item.quantity <= 1}
                            style={{
                              width: '2.25rem', height: '2.25rem', border: 'none',
                              background: item.quantity <= 1 ? '#f9fafb' : '#fff',
                              color: item.quantity <= 1 ? '#d1d5db' : '#111827',
                              fontSize: '1.1rem', fontWeight: 700, cursor: item.quantity <= 1 ? 'not-allowed' : 'pointer',
                              transition: 'background 0.15s'
                            }}
                          >−</button>
                          <span style={{
                            width: '2.5rem', textAlign: 'center', fontWeight: 700,
                            fontSize: '0.9rem', borderLeft: '1.5px solid #e5e7eb', borderRight: '1.5px solid #e5e7eb',
                            lineHeight: '2.25rem', color: '#111827'
                          }}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onIncrement(item)}
                            style={{
                              width: '2.25rem', height: '2.25rem', border: 'none', background: '#fff',
                              color: '#111827', fontSize: '1.1rem', fontWeight: 700, cursor: 'pointer', transition: 'background 0.15s'
                            }}
                          >+</button>
                        </div>

                        {/* Line total */}
                        <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#111827' }}>
                          {fmt(lineTotal)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Remove button — below the card content */}
                  <div style={{ borderTop: '1px solid #f3f4f6', padding: '0.625rem 1.25rem', display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => onRemove(item._id)}
                      disabled={isRemoving}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '0.35rem',
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: '#ef4444', fontSize: '0.8rem', fontWeight: 600,
                        padding: '0.3rem 0.6rem', borderRadius: '0.4rem',
                        transition: 'background 0.15s'
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
                      onMouseLeave={e => e.currentTarget.style.background = 'none'}
                    >
                      🗑️ Remove item
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Right: Order Summary ── */}
          <div style={{ position: 'sticky', top: '1.5rem' }}>
            <div style={{
              background: '#fff', borderRadius: '1rem',
              border: '1px solid #f3f4f6',
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              padding: '1.5rem'
            }}>
              <h2 style={{ fontSize: '0.85rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6b7280', marginBottom: '1.25rem' }}>
                Order Summary
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingBottom: '1.25rem', borderBottom: '1px solid #f3f4f6', marginBottom: '1.25rem' }}>
                {items.map(item => {
                  const isPopulated = typeof item.product === 'object' && item.product !== null;
                  const title = isPopulated ? item.product.title : 'Product';
                  const lineTotal = (item.trustedPrice || item.price?.amount || 0) * (item.quantity || 1);
                  return (
                    <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#374151' }}>
                      <span style={{ maxWidth: '65%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {title} <span style={{ color: '#9ca3af' }}>×{item.quantity}</span>
                      </span>
                      <span style={{ fontWeight: 600 }}>{fmt(lineTotal)}</span>
                    </div>
                  );
                })}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#6b7280' }}>
                  <span>Shipping</span>
                  <span style={{ color: '#16a34a', fontWeight: 600 }}>FREE</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#6b7280' }}>
                  <span>Tax</span>
                  <span style={{ fontWeight: 600 }}>₹0</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '2px solid #111827', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total</span>
                <span style={{ fontSize: '1.6rem', fontWeight: 900, letterSpacing: '-0.03em' }}>{fmt(total)}</span>
              </div>

              {/* ── AI / CTA section ── */}
              {isHighValue ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {/* AI Negotiate banner */}
                  <div style={{
                    background: 'linear-gradient(135deg,#ede9fe,#ddd6fe)',
                    border: '1px solid #c4b5fd', borderRadius: '0.875rem',
                    padding: '0.875rem 1rem', textAlign: 'center', marginBottom: '0.25rem'
                  }}>
                    <div style={{ fontSize: '1.3rem', marginBottom: '0.25rem' }}>🤖✨</div>
                    <p style={{ fontSize: '0.78rem', color: '#5b21b6', fontWeight: 600, margin: 0, lineHeight: 1.4 }}>
                      Your cart is above ₹5,000! Let our AI negotiate a special discount for you.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowNegotiate(true)}
                    style={{
                      width: '100%', padding: '0.875rem',
                      background: 'linear-gradient(135deg,#7c3aed,#4f46e5)',
                      color: '#fff', border: 'none', borderRadius: '0.75rem',
                      fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer',
                      letterSpacing: '0.02em', boxShadow: '0 4px 14px rgba(109,40,217,0.35)'
                    }}
                  >
                    🤖 Negotiate with Seller
                  </button>
                  <button
                    style={{
                      width: '100%', padding: '0.875rem',
                      background: '#111827', color: '#fff',
                      border: 'none', borderRadius: '0.75rem',
                      fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer', letterSpacing: '0.05em'
                    }}
                  >
                    Buy Now
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{
                    background: 'linear-gradient(135deg,#fff7ed,#ffedd5)',
                    border: '1px solid #fed7aa', borderRadius: '0.875rem',
                    padding: '0.875rem 1rem', textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '1.2rem', marginBottom: '0.3rem' }}>🎯</div>
                    <p style={{ fontSize: '0.78rem', color: '#9a3412', fontWeight: 600, margin: 0, lineHeight: 1.5 }}>
                      Add {fmt(5000 - total)} more to unlock AI price negotiation &amp; exclusive seller discounts!
                    </p>
                  </div>
                  <button
                    onClick={() => navigate('/')}
                    style={{
                      width: '100%', padding: '0.875rem',
                      background: 'none', border: '1.5px solid #d1d5db', borderRadius: '0.75rem',
                      fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', color: '#374151'
                    }}
                  >
                    + Add More Items
                  </button>
                  <button
                    style={{
                      width: '100%', padding: '0.875rem',
                      background: '#111827', color: '#fff',
                      border: 'none', borderRadius: '0.75rem',
                      fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer', letterSpacing: '0.05em'
                    }}
                  >
                    Buy Now
                  </button>
                </div>
              )}

              {/* Trust badges */}
              <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {['✅ 100% Secure Checkout', '🔄 7-Day Return Policy', '🚚 Free Shipping on All Orders'].map(badge => (
                  <div key={badge} style={{ fontSize: '0.75rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    {badge}
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AddToCartPage;