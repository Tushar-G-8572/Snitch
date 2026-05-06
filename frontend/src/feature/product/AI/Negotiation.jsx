import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import Navbar from '../../shared/components/Navbar';
import { useRazorpay } from 'react-razorpay';
import { useCart } from '../hooks/useCart';
import socket from '../utils/socket.service';
import { setDiscountCoupon } from '../state/cart.slice';

const fmt = (amount, currency = 'INR') =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency', currency, maximumFractionDigits: 0,
  }).format(amount);

const Negotiation = () => {
  const navigate = useNavigate();
  const { handleGetAddToCartProduct, handleVerifyPayment, handleCreateOrder } = useCart();
  const user = useSelector((state) => state.auth.user);
  const { Razorpay } = useRazorpay();

  useEffect(() => {
    handleGetAddToCartProduct();
  }, []);

  const cartProducts = useSelector(state => state.cart.cartProducts);
  const cart = Array.isArray(cartProducts) && cartProducts.length > 0 ? cartProducts[0] : cartProducts;
  const items = cart?.items || [];
  const initialTotal = items.reduce(
    (acc, item) => acc + (item.trustedPrice || item.price?.amount || 0) * (item.quantity || 1), 0
  );
  const initialTotalRef = useRef(0);

  const [messages, setMessages] = useState([]);
  const [streamingToken, setStreamingToken] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentOffer, setCurrentOffer] = useState(initialTotal);
  const [roundsLeft, setRoundsLeft] = useState(3);
  const [negotiationEnded, setNegotiationEnded] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [couponCode, setCouponCode] = useState(null);       // e.g. "SNITCH15"
  const [couponUnlocked, setCouponUnlocked] = useState(false);
  const [couponCopied, setCouponCopied] = useState(false);
  const inputRef = useRef({});
  const messagesEndRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (initialTotal > 0) {
      initialTotalRef.current = initialTotal;
      setCurrentOffer(initialTotal);
      socket.emit('negotiation_start', { initialTotal });
    }
  }, [initialTotal]);

  useEffect(() => {
    socket.on('negotiation_ready', () => {
      setIsReady(true);
      setMessages([{
        role: 'ai',
        text: `Namaste! I'm Arjuna. Your cart total is ${fmt(initialTotalRef.current)}. Tell me your best offer!`,
      }]);
    });

    socket.on('token', (token) => {
      setStreamingToken((prev) => prev + token);
    });

    socket.on('stream_end', ({
      fullText,
      currentOffer: newOffer,
      roundsLeft: rl,
      negotiationEnded: ended,
      couponCode: code,
      couponUnlocked: unlocked,
    }) => {
      const cleanText = fullText
        .replace(/\[OFFER:\d+\]/g, '')
        .replace(/\[COUPON:[A-Z0-9]+\]/g, '')
        .trim();

      setMessages((prev) => [...prev, { role: 'ai', text: cleanText }]);
      setStreamingToken('');
      setIsStreaming(false);
      if (newOffer) setCurrentOffer(newOffer);
      if (rl !== undefined) setRoundsLeft(rl);
      if (ended) setNegotiationEnded(true);

      // Coupon unlock
      if (unlocked && code) {
        dispatch(setDiscountCoupon(code));
        setCouponCode(code);
        setCouponUnlocked(true);
      }
    });

    socket.on('stream_error', (msg) => {
      setMessages((prev) => [...prev, { role: 'ai', text: `Error: ${msg}` }]);
      setIsStreaming(false);
      setStreamingToken('');
    });

    return () => {
      socket.off('negotiation_ready');
      socket.off('token');
      socket.off('stream_end');
      socket.off('stream_error');
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingToken]);

  const handleSend = useCallback(() => {
    const text = inputRef.current.name.value.trim();
    if (!text || isStreaming || negotiationEnded || !isReady) return;

    setMessages((prev) => [...prev, { role: 'user', text }]);
    inputRef.current.name.value = '';
    setIsStreaming(true);
    socket.emit('chat_message', { inputText: text });
  }, [inputRef, isStreaming, negotiationEnded, isReady]);

  const handleCopyCoupon = () => {
    if (!couponCode) return;
    navigator.clipboard.writeText(couponCode).then(() => {
      setCouponCopied(true);
      setTimeout(() => navigate('/cart-items'), 2000);
    });
  };

  const handleCheckout = async () => {
    const { order } = await handleCreateOrder();
    const options = {
      key: 'rzp_test_SjCBx5D5qOsvTH',
      amount: initialTotal * 100,       // always full price at checkout
      currency: order.currency || 'INR',
      name: 'Snitch Atelier',
      description: couponCode
        ? `Use coupon ${couponCode} at checkout`
        : 'Exclusive Order',
      order_id: order.id,
      handler: async (response) => {
        const flag = await handleVerifyPayment(response);
        if (flag) navigate('/orders');
      },
      prefill: {
        name: user?.fullName || 'Guest',
        email: user?.email || '',
        contact: '9999999999',
      },
      theme: { color: '#1A1A1A' },
    };
    new Razorpay(options).open();
  };

  const canSend = inputRef && !isStreaming && isReady;

  return (
    <div className="min-h-screen bg-[#f9f9f9] text-[#2d3435] font-['Manrope'] flex flex-col">
      <Navbar />
      <div className="max-w-3xl mx-auto w-full flex-1 flex flex-col px-4 sm:px-6 pt-6 sm:pt-10 pb-4 sm:pb-6 h-[calc(100vh-56px)] sm:h-[calc(100vh-64px)]">

        {/* Header */}
        <div className="mb-4 sm:mb-6 text-center">
          <h1 className="text-2xl sm:text-4xl font-['Noto_Serif'] tracking-tight mb-2 text-[#1a1a1a]">
            Negotiate Your Selection
          </h1>
          <p className="text-[#5a6061] text-xs sm:text-sm tracking-wide">
            {items.length} items • Original: <span className="font-bold">{fmt(initialTotal)}</span>
            {' '}• <span className="font-semibold">{roundsLeft} rounds left</span>
          </p>
        </div>

        {/* Offer Banner */}
        {currentOffer !== initialTotal && (
          <div className="bg-[#ebeeef] border-l-4 border-[#5f5e5e] p-3 sm:p-4 mb-4 sm:mb-5 rounded-r-lg flex justify-between items-center">
            <div>
              <span className="block text-xs uppercase tracking-widest font-bold mb-1">Current Price</span>
              <span className="text-xl sm:text-2xl font-black text-[#1a1a1a]">{fmt(currentOffer)}</span>
              {negotiationEnded && (
                <span className="block text-xs text-red-500 uppercase tracking-widest font-bold mt-1">
                  Valid for 15 mins only — hurry!
                </span>
              )}
            </div>
          </div>
        )}

        {/* Coupon Banner */}
        {couponUnlocked && couponCode && (
          <div className="bg-[#1a1a1a] text-white p-3 sm:p-4 mb-4 sm:mb-5 rounded-xl flex justify-between items-center gap-3">
            <div className="min-w-0">
              <span className="block text-xs uppercase tracking-widest text-[#adb3b4] font-bold mb-1">Your Exclusive Coupon</span>
              <span className="text-lg sm:text-xl font-black tracking-widest break-all">{couponCode}</span>
              <span className="block text-xs text-[#adb3b4] mt-1">Apply at checkout for your discount</span>
            </div>
            <button
              onClick={handleCopyCoupon}
              className="text-xs border border-[#adb3b4] text-[#adb3b4] px-3 sm:px-4 py-2 rounded-lg hover:bg-[#2d3435] hover:text-white transition-colors font-bold tracking-wide shrink-0"
            >
              {couponCopied ? 'COPIED!' : 'COPY'}
            </button>
          </div>
        )}

        {/* Chat */}
        <div className="flex-1 bg-white rounded-2xl border border-[#e4e9ea] shadow-sm flex flex-col overflow-hidden mb-3 sm:mb-5">
          <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-3 sm:space-y-5 bg-[#f9f9f9]">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] sm:max-w-[80%] p-3 sm:p-4 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                  ? 'bg-[#1a1a1a] text-[#f9f9f9] rounded-br-sm'
                  : 'bg-white text-[#2d3435] border border-[#e4e9ea] shadow-sm rounded-bl-sm'
                  }`}>
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Streaming bubble */}
            {isStreaming && streamingToken && (
              <div className="flex justify-start">
                <div className="max-w-[85%] sm:max-w-[80%] p-3 sm:p-4 rounded-2xl bg-white border border-[#e4e9ea] shadow-sm rounded-bl-sm text-sm leading-relaxed text-[#2d3435]">
                  {streamingToken
                    .replace(/\[OFFER:\d+\]/g, '')
                    .replace(/\[COUPON:[A-Z0-9]+\]/g, '')
                    .trim()}
                  <span className="inline-block w-1.5 h-4 bg-[#adb3b4] ml-1 animate-pulse rounded-sm" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 sm:p-4 bg-white border-t border-[#e4e9ea]">
            <div className="flex items-center gap-2 sm:gap-3">
              <input
                type="text"
                ref={(e) => inputRef.current.name = e}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={
                  !isReady ? 'Connecting...' :
                    negotiationEnded ? 'Negotiation concluded.' :
                      'Propose a price or ask for a discount...'
                }
                className="flex-1 bg-[#f9f9f9] border-none px-3 sm:px-5 py-3 sm:py-3.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#e4e9ea] disabled:opacity-50"
              />
              <button
                onClick={handleSend}
                disabled={!canSend}
                className="bg-[#1a1a1a] text-white px-4 sm:px-6 py-3 sm:py-3.5 rounded-xl text-sm font-bold tracking-wide hover:bg-[#2d3435] disabled:bg-[#adb3b4] disabled:cursor-not-allowed transition-colors"
              >
                {isStreaming ? '...' : 'Send'}
              </button>
            </div>
          </div>
        </div>

        {/* Single Checkout Button */}
        <button
          onClick={handleCheckout}
          className="w-full py-3 sm:py-4 bg-[#1a1a1a] text-white rounded-xl text-sm font-bold tracking-widest hover:bg-[#2d3435] transition-colors shadow-md"
        >
          CHECKOUT AT {fmt(initialTotal)}
        </button>

      </div>
    </div>
  );
};

export default Negotiation;