import React, { useEffect, useState, memo, useCallback } from 'react';
import { useCart } from '../hooks/useCart';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import Navbar from '../../shared/components/Navbar';
import { useRazorpay, RazorpayOrderOptions } from "react-razorpay";



const fmt = (amount, currency = 'INR') =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);

function getItemImage(item) {
  if (item.varient && item.product?.varients?.images?.length > 0)
    return item.product.varients.images[0].url;
  if (item.product?.images?.url)
    return item.product.images.url;
  if (Array.isArray(item.product?.images) && item.product.images[0]?.url)
    return item.product.images[0].url;
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl bg-none border-none cursor-pointer transition-colors"
        >✕</button>

        <div className="text-center mb-6">
          <div className="text-5xl mb-2">🤖</div>
          <h2 className="text-lg font-bold text-gray-900 mb-1">AI Price Negotiator</h2>
          <p className="text-sm text-gray-500">
            Our AI will analyze your cart and negotiate the best discount with the seller.
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl px-4 py-3 mb-5 text-center">
          <span className="text-xs text-green-700 font-semibold block">Cart Value</span>
          <div className="text-2xl font-black text-green-800">{fmt(total)}</div>
        </div>

        {result ? (
          <div className="bg-gradient-to-br from-amber-50 to-yellow-100 border border-yellow-200 rounded-xl p-4 text-sm text-amber-800 leading-relaxed mb-4">
            {result}
          </div>
        ) : (
          <button
            onClick={negotiate}
            disabled={loading}
            className={`w-full py-3.5 rounded-xl text-white font-bold text-sm tracking-wide mb-3 transition-opacity
              ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-br from-violet-600 to-indigo-600 hover:opacity-90 cursor-pointer'}`}
          >
            {loading ? '🔄 Negotiating...' : '✨ Negotiate Now'}
          </button>
        )}

        <button
          onClick={onClose}
          className="w-full py-3 border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}

/* ── Skeleton ── */
function CartSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans p-10">
      <div className="max-w-5xl mx-auto">
        <div className="h-9 w-48 bg-gray-200 rounded-lg mb-8 animate-pulse" />
        {[1, 2, 3].map(i => (
          <div key={i} className="h-36 bg-gray-200 rounded-2xl mb-4 animate-pulse" />
        ))}
      </div>
    </div>
  );
}

/* ── Empty Cart ── */
function EmptyCart({ onNavigate }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-8xl mb-4">🛒</div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 text-sm">Looks like you haven't added anything yet.</p>
        <button
          onClick={onNavigate}
          className="px-10 py-3.5 bg-gray-900 text-white rounded-xl font-bold text-sm tracking-widest hover:bg-gray-700 transition-colors cursor-pointer"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}

/* ── Cart Item — memoized so only THIS item re-renders on quantity change ── */
const CartItem = memo(({ item, onIncrement, onDecrement, onRemove, navigate }) => {
  const isPopulated = typeof item.product === 'object' && item.product !== null;
  const productId = isPopulated ? item.product._id : item.product;
  const title = isPopulated ? item.product.title : `Product #${productId}`;
  const imgUrl = getItemImage(item);
  const attrs = item.product?.varients?.attributes || null;
  const unitPrice = item.trustedPrice || item.price?.amount || 0;
  const lineTotal = unitPrice * (item.quantity || 1);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-opacity duration-300">
      <div className="flex gap-5 p-5">

        {/* Image */}
        <div
          onClick={() => navigate(`/product/${productId}`)}
          className="w-28 shrink-0 rounded-xl overflow-hidden bg-gray-100 cursor-pointer"
        >
          <img
            src={imgUrl}
            alt={title}
            className="w-full object-cover"
            style={{ aspectRatio: '4/5' }}
            onError={e => { e.target.src = 'https://placehold.co/160x200?text=No+Image'; }}
          />
        </div>

        {/* Details */}
        <div className="flex-1 flex flex-col gap-2 min-w-0">
          <h3
            onClick={() => navigate(`/product/${productId}`)}
            className="text-base font-bold text-gray-900 cursor-pointer leading-snug hover:text-indigo-600 transition-colors line-clamp-2"
          >
            {title}
          </h3>

          {/* Attribute badges */}
          {attrs && Object.keys(attrs).length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {Object.entries(attrs).map(([k, v]) => (
                <span
                  key={k}
                  className="text-xs px-2.5 py-0.5 bg-gray-50 border border-gray-200 rounded-full text-gray-600 font-medium"
                >
                  {k}: <b className="text-gray-800">{v}</b>
                </span>
              ))}
            </div>
          )}

          <p className="text-xs text-gray-400">{fmt(unitPrice)} per item</p>

          {/* Qty + Line total */}
          <div className="mt-auto flex items-center justify-between flex-wrap gap-3">
            {/* Qty stepper */}
            <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() => onDecrement(item)}
                disabled={item.quantity <= 1}
                className={`w-9 h-9 flex items-center justify-center text-lg font-bold border-none transition-colors
                  ${item.quantity <= 1
                    ? 'bg-gray-50 text-gray-300 cursor-not-allowed'
                    : 'bg-white text-gray-900 hover:bg-gray-100 cursor-pointer'
                  }`}
              >−</button>
              <span className="w-10 text-center font-bold text-sm text-gray-900 border-x-2 border-gray-200 h-9 flex items-center justify-center">
                {item.quantity}
              </span>
              <button
                onClick={() => onIncrement(item)}
                className="w-9 h-9 flex items-center justify-center text-lg font-bold bg-white text-gray-900 hover:bg-gray-100 border-none cursor-pointer transition-colors"
              >+</button>
            </div>

            {/* Line total */}
            <span className="text-lg font-black text-gray-900">{fmt(lineTotal)}</span>
          </div>
        </div>
      </div>

      {/* Remove */}
      <div className="border-t border-gray-100 px-5 py-2.5 flex justify-end">
        <button
          onClick={() => onRemove(item._id)}
          className="flex items-center gap-1.5 text-red-500 hover:text-red-600 text-xs font-semibold px-2.5 py-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer border-none bg-transparent"
        >
           Remove item
        </button>
      </div>
    </div>
  );
});

/* ── Order Summary ── */
function OrderSummary({ items, total, onNavigate,handleCheckout }) {
  const navigate = useNavigate();
  const isHighValue = total >= 5000;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h2 className="text-xs font-black tracking-widest uppercase text-gray-400 mb-5">Order Summary</h2>

      {/* Per-item breakdown */}
      <div className="flex flex-col gap-3 pb-5 border-b border-gray-100 mb-5">
        {items.map(item => {
          const isPopulated = typeof item.product === 'object' && item.product !== null;
          const title = isPopulated ? item.product.title : 'Product';
          const lineTotal = (item.trustedPrice || item.price?.amount || 0) * (item.quantity || 1);
          return (
            <div key={item._id} className="flex justify-between text-sm text-gray-600">
              <span className="max-w-[65%] truncate">
                {title} <span className="text-gray-400">×{item.quantity}</span>
              </span>
              <span className="font-semibold">{fmt(lineTotal)}</span>
            </div>
          );
        })}
      </div>

      {/* Shipping / Tax */}
      <div className="flex flex-col gap-2 mb-5">
        <div className="flex justify-between text-sm text-gray-500">
          <span>Shipping</span>
          <span className="text-green-600 font-semibold">FREE</span>
        </div>
        <div className="flex justify-between text-sm text-gray-500">
          <span>Tax</span>
          <span className="font-semibold">₹0</span>
        </div>
      </div>

      {/* Grand total */}
      <div className="flex justify-between items-center pt-4 border-t-2 border-gray-900 mb-6">
        <span className="text-xs font-black uppercase tracking-widest">Total</span>
        <span className="text-3xl font-black tracking-tight">{fmt(total)}</span>
      </div>

      {/* CTA section */}
      {isHighValue ? (
        <div className="flex flex-col gap-3">
          <div className="bg-gradient-to-br from-violet-100 to-purple-100 border border-purple-200 rounded-2xl px-4 py-3 text-center">
            <p className="text-xs text-purple-800 font-semibold leading-snug">
              Your cart is above ₹5,000! Let our AI negotiate a special discount for you.
            </p>
          </div>
          <button
            onClick={()=>{navigate('/negotiate')}}
            className="w-full py-3.5 bg-gradient-to-br from-violet-600 active:scale-95 to-indigo-600 text-white rounded-xl text-sm font-bold tracking-wide shadow-lg shadow-violet-200 hover:opacity-90 transition-opacity cursor-pointer border-none"
          >
             Negotiate with Seller
          </button>
          <button onClick={handleCheckout} className="w-full py-3.5 bg-gray-900 text-white rounded-xl text-sm font-bold tracking-widest hover:bg-gray-700 transition-colors cursor-pointer border-none">
            Buy Now
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-2xl px-4 py-3 text-center">
            <p className="text-xs text-orange-800 font-semibold leading-snug">
              Add {fmt(5000 - total)} more to unlock AI price negotiation &amp; exclusive seller discounts!
            </p>
          </div>
          <button
            onClick={onNavigate}
            className="w-full py-3.5 border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer bg-white"
          >
            + Add More Items
          </button>
          <button onClick={handleCheckout} className="w-full py-3.5 bg-gray-900 text-white rounded-xl text-sm font-bold tracking-widest hover:bg-gray-700 transition-colors cursor-pointer border-none">
            Buy Now
          </button>
        </div>
      )}

      {/* Trust badges */}
      <div className="mt-5 flex flex-col gap-2">
        {['✅ 100% Secure Checkout', '🔄 7-Day Return Policy', '🚚 Free Shipping on All Orders'].map(badge => (
          <div key={badge} className="text-xs text-gray-400 flex items-center gap-1.5">{badge}</div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════ */
const AddToCartPage = () => {
  const { error, isLoading, Razorpay } = useRazorpay();
  const navigate = useNavigate();
  const { handleGetAddToCartProduct, handleUpdateQuantity, handleRemoveAddToCart,handleVerifyPayment,handleCreateOrder } = useCart();
  const cartProducts = useSelector(state => state.cart.cartProducts);
  const loading = useSelector(state => state.cart.loading);
  const user = useSelector(state => state.auth.user)
  
  const [showNegotiate, setShowNegotiate] = useState(false);

  useEffect(() => { handleGetAddToCartProduct(); }, []);

  const cart = Array.isArray(cartProducts) && cartProducts.length > 0 ? cartProducts[0] : cartProducts;
  const items = cart?.items || [];
  const total = items.reduce((acc, item) => acc + (item.trustedPrice || item.price?.amount || 0) * (item.quantity || 1), 0);

  // useCallback prevents CartItem memo from being bypassed on every parent render
  const onDecrement = useCallback((item) => {
    if (item.quantity <= 1) return;
    handleUpdateQuantity(item._id, item.quantity - 1);
  }, [handleUpdateQuantity]);

  const onIncrement = useCallback((item) => {
    handleUpdateQuantity(item._id, item.quantity + 1);
  }, [handleUpdateQuantity]);

  const onRemove = useCallback(async (itemId) => {
    await handleRemoveAddToCart(itemId);
    await handleGetAddToCartProduct();
  }, [handleRemoveAddToCart, handleGetAddToCartProduct]);

  async function handleCheckout() {
    const {order} = await handleCreateOrder();
    // console.log(order)
       const options = {
      key: "rzp_test_SjCBx5D5qOsvTH",
      amount: order.amount, 
      currency: order.currency,
      name: "Snitch",
      description: "Test Transaction",
      order_id: order.id, // Generate order_id on server
      handler:async (response) => {
        console.log(response);
       const flag = await handleVerifyPayment(response)
       if(flag){
        navigate('/orders')
       }
        // alert("Payment UnSuccessful!");
      },
      prefill: {
        name: user.fullName,
        email: user.email,
        contact: "9999999999",
      },
      theme: {
        color: "#1A1A1A",
      },
    };

    const razorpayInstance = new Razorpay(options);
    razorpayInstance.open();
  }

  if (loading && items.length === 0) return <CartSkeleton />;
  if (!loading && items.length === 0) return <EmptyCart onNavigate={() => navigate('/')} />;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Navbar />
      {showNegotiate && <NegotiateModal total={total} onClose={() => setShowNegotiate(false)} />}

      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 px-10 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span className="cursor-pointer hover:text-gray-700 transition-colors" onClick={() => navigate('/')}>Home</span>
          <span>/</span>
          <span className="text-gray-900 font-semibold">Cart</span>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-5 py-8">
        <h1 className="text-3xl font-black tracking-tight mb-1">Your Cart</h1>
        <p className="text-gray-400 text-sm mb-8">
          {items.length} item{items.length !== 1 ? 's' : ''} in your bag
        </p>

        <div className="grid gap-8" style={{ gridTemplateColumns: 'minmax(0,2fr) 340px' }}>

          {/* Left: Items */}
          <div className="flex flex-col gap-4">
            {items.map(item => (
              <CartItem
                key={item._id}
                item={item}
                onIncrement={onIncrement}
                onDecrement={onDecrement}
                onRemove={onRemove}
                navigate={navigate}
              />
            ))}
          </div>

          {/* Right: Summary — sticky */}
          <div className="sticky top-6 self-start">
            <OrderSummary
              items={items}
              total={total}
              handleCheckout={handleCheckout}
              // onNegotiate={() => setShowNegotiate(true)}
              onNavigate={() => navigate('/')}
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default AddToCartPage;