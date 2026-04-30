import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import Navbar from '../../shared/components/Navbar';
import { useRazorpay } from 'react-razorpay';
import { useCart } from '../hooks/useCart';
import socket from '../utils/socket.service';

const fmt = (amount, currency = 'INR') =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency', currency, maximumFractionDigits: 0,
  }).format(amount);

const Negotiation = () => {
  const navigate = useNavigate();
  const { handleGetAddToCartProduct, handleVerifyPayment, handleCreateOrder } = useCart();
  const user = useSelector((state) => state.auth.user);
  const { Razorpay } = useRazorpay();

  useEffect(()=>{
    handleGetAddToCartProduct()
  },[])

  const cartProducts = useSelector(state=> state.cart.cartProducts);

  // console.log(cartProducts)

  const cart = Array.isArray(cartProducts) && cartProducts.length > 0 ? cartProducts[0] : cartProducts;
  const items = cart?.items || [];
  const initialTotal = items.reduce(
    (acc, item) => acc + (item.trustedPrice || item.price?.amount || 0) * (item.quantity || 1), 0
  );
  const initialTotalRef = useRef(0);

  const [messages, setMessages] = useState([]);
  const [streamingToken, setStreamingToken] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  // const [inputText, setInputText] = useState('');
  const [currentOffer, setCurrentOffer] = useState(initialTotal);
  const [roundsLeft, setRoundsLeft] = useState(3);
  const [negotiationEnded, setNegotiationEnded] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const inputRef = useRef({});
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (initialTotal > 0) {
      initialTotalRef.current = initialTotal;
      setCurrentOffer(initialTotal);
      socket.emit('negotiation_start', { initialTotal });
    }
  }, [initialTotal]);

  useEffect(() => {
    // Negotiation.jsx ke useEffect mein
    socket.on('negotiation_ready', () => {
      // console.log('ready! total from ref:', initialTotalRef.current);
      setIsReady(true);
      setMessages([{
        role: 'ai',
        text: `Namaste! I'm Arjuna. Your cart total is ${fmt(initialTotalRef.current)}. Tell me your best offer!`,
      }]);
    });

    socket.on('token', (token) => {
      setStreamingToken((prev) => prev + token);
    });

    socket.on('stream_end', ({ fullText, currentOffer: newOffer, roundsLeft: rl, negotiationEnded: ended }) => {
      const cleanText = fullText.replace(/\[OFFER:\d+\]/g, '').trim();
      setMessages((prev) => [...prev, { role: 'ai', text: cleanText }]);
      setStreamingToken('');
      setIsStreaming(false);
      if (newOffer) setCurrentOffer(newOffer);
      if (rl !== undefined) setRoundsLeft(rl);
      if (ended) setNegotiationEnded(true);
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
    // console.log(inputRef.current.name.value.trim());
    // const text = inputText.trim();
    const text = inputRef.current.name.value.trim()
    if (!text || isStreaming || negotiationEnded || !isReady) return;

    setMessages((prev) => [...prev, { role: 'user', text }]);
   inputRef.current.name.value = ''
    setIsStreaming(true);
    socket.emit('chat_message', { inputText: text });
  }, [inputRef, isStreaming, negotiationEnded, isReady]);

  const handleCheckout = async (priceToPay) => {
    const { order } = await handleCreateOrder();
    // console.log(priceToPay);
    // console.log("order",order)
    const options = {
      key: 'rzp_test_SjCBx5D5qOsvTH',
      amount: priceToPay * 100,
      currency: order.currency || 'INR',
      name: 'Snitch Atelier',
      description: 'Exclusive Negotiated Order',
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

  const canSend = inputRef && !isStreaming  && isReady;

  return (
    <div className="min-h-screen bg-[#f9f9f9] text-[#2d3435] font-['Manrope'] flex flex-col">
      <Navbar />
      <div className="max-w-3xl mx-auto w-full flex-1 flex flex-col p-6 pt-10 h-[calc(100vh-80px)]">

        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-4xl font-['Noto_Serif'] tracking-tight mb-2 text-[#1a1a1a]">
            Negotiate Your Selection
          </h1>
          <p className="text-[#5a6061] text-sm tracking-wide">
            {items.length} items • Original: <span className="font-bold">{fmt(initialTotal)}</span>
            {' '}• <span className="font-semibold">{roundsLeft} rounds left</span>
          </p>
        </div>

        {/* Offer Banner */}
        {currentOffer !== initialTotal && (
          <div className="bg-[#ebeeef] border-l-4 border-[#5f5e5e] p-4 mb-5 rounded-r-lg flex justify-between items-center">
            <div>
              <span className="block text-xs uppercase tracking-widest text-[#5a6061] font-bold mb-1">
                Current Offer
              </span>
              <span className="text-2xl font-black text-[#1a1a1a]">{fmt(currentOffer)}</span>
              <span className="text-xs text-[#5a6061] ml-2">
                (saved {fmt(initialTotal - currentOffer)})
              </span>
            </div>
            {negotiationEnded && (
              <span className="text-xs bg-[#1a1a1a] text-white px-3 py-1 rounded-full">Final Offer</span>
            )}
          </div>
        )}

        {/* Chat */}
        <div className="flex-1 bg-white rounded-2xl border border-[#e4e9ea] shadow-sm flex flex-col overflow-hidden mb-5">
          <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-[#f9f9f9]">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                    ? 'bg-[#1a1a1a] text-[#f9f9f9] rounded-br-sm'
                    : 'bg-white text-[#2d3435] border border-[#e4e9ea] shadow-sm rounded-bl-sm'
                  }`}>
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Streaming bubble — shows token accumulation live */}
            {isStreaming && streamingToken && (
              <div className="flex justify-start">
                <div className="max-w-[80%] p-4 rounded-2xl bg-white border border-[#e4e9ea] shadow-sm rounded-bl-sm text-sm leading-relaxed text-[#2d3435]">
                  {streamingToken.replace(/\[OFFER:\d+\]/g, '').trim()}
                  <span className="inline-block w-1.5 h-4 bg-[#adb3b4] ml-1 animate-pulse rounded-sm" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-[#e4e9ea]">
            <div className="flex items-center gap-3">
              <input
                type="text"
                ref={(e)=>inputRef.current.name = e}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                // disabled={!canSend}
                placeholder={
                  !isReady ? 'Connecting...' :
                    negotiationEnded ? 'Negotiation concluded.' :
                      'Propose a price or ask for a discount...'
                }
                className="flex-1 bg-[#f9f9f9] border-none px-5 py-3.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#e4e9ea] disabled:opacity-50"
              />
              <button
                onClick={handleSend}
                disabled={!canSend}
                className="bg-[#1a1a1a] text-white px-6 py-3.5 rounded-xl text-sm font-bold tracking-wide hover:bg-[#2d3435] disabled:bg-[#adb3b4] disabled:cursor-not-allowed transition-colors"
              >
                {isStreaming ? '...' : 'Send'}
              </button>
            </div>
          </div>
        </div>

        {/* Checkout Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => handleCheckout(currentOffer)}
            className="w-full py-4 bg-[#1a1a1a] text-white rounded-xl text-sm font-bold tracking-widest hover:bg-[#2d3435] transition-colors shadow-md"
          >
            {currentOffer !== initialTotal
              ? `ACCEPT & PAY ${fmt(currentOffer)}`
              : `CHECKOUT AT ${fmt(initialTotal)}`}
          </button>
          {currentOffer !== initialTotal && (
            <button
              onClick={() => handleCheckout(initialTotal)}
              className="w-full py-4 bg-transparent border-2 border-[#e4e9ea] text-[#5a6061] rounded-xl text-sm font-bold tracking-widest hover:bg-[#f2f4f4] transition-colors"
            >
              CHECKOUT AT FULL PRICE {fmt(initialTotal)}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Negotiation;