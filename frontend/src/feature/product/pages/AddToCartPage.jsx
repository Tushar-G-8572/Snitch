import React, { useEffect } from 'react';
import { useCart } from '../hooks/useCart';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

const formatPrice = (amount, currency = 'INR') =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);

const AddToCartPage = () => {
  const navigate = useNavigate();
  const { handleGetAddToCartProduct } = useCart();
  const cartProducts = useSelector(state => state.cart.cartProducts);
  const loading = useSelector(state => state.cart.loading);

  useEffect(() => {
    handleGetAddToCartProduct();
  }, []);

  const cart = Array.isArray(cartProducts) && cartProducts.length > 0 ? cartProducts[0] : cartProducts;
  const items = cart?.items || [];

  const subtotal = items.reduce((acc, item) => acc + (item.price?.amount || 0), 0);

  if (loading && !cart) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans pb-20 text-gray-700">
         <div className="max-w-5xl mx-auto px-10 py-6">
            <div className="h-10 w-48 bg-gray-200 rounded animate-pulse mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
               <div className="lg:col-span-2 space-y-6">
                 {[1, 2].map(i => <div key={i} className="h-40 bg-gray-200 rounded animate-pulse"></div>)}
               </div>
               <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
            </div>
         </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20 text-gray-700">
      {/* Breadcrumb */}
      <nav className="w-full flex justify-between items-center">
        <div className='px-10 py-5 text-xs text-gray-600 flex items-center gap-1'>
          <span className="cursor-pointer hover:text-gray-900 transition" onClick={() => navigate('/')}>Home</span>
          <span className="text-gray-400 px-1"> / </span>
          <span className="text-gray-900 font-medium">Cart Items</span>
        </div>
        <div className="flex text-sm text-gray-600 justify-between items-center gap-5 mr-10">
          <div className="cursor-pointer hover:text-gray-900 transition">
            <span>profile</span>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-10 py-6">
        <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-8 tracking-tight">
          Your Cart {items.length > 0 && <span className="text-gray-400 text-xl font-normal">({items.length} items)</span>}
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-24 bg-white rounded overflow-hidden shadow-sm border border-gray-100 flex flex-col items-center justify-center">
             <div className="text-7xl mb-6 opacity-30">🛒</div>
             <h2 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">Your cart is empty</h2>
             <p className="text-sm text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
             <button 
               onClick={() => navigate('/')} 
               className="px-8 py-4 border-2 border-gray-900 bg-gray-900 text-white text-sm font-bold tracking-widest uppercase rounded transition hover:bg-gray-800"
             >
               Continue Shopping
             </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
            {/* Left: Cart Items */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {items.map((item, index) => {
                // Handle unpopulated product ID gracefully
                const isPopulated = typeof item.product === 'object' && item.product !== null;
                const productId = isPopulated ? item.product._id : item.product;
                const title = isPopulated ? item.product.title : `Product ID: ${productId}`;
                
                let displayImg = 'https://placehold.co/150x200?text=No+Image';
                if (item.imageUrl) {
                    displayImg = item.imageUrl;
                } else if (isPopulated && item.product.images?.length > 0) {
                    displayImg = item.product.images[0].url || item.product.images[0];
                }

                return (
                  <div key={item._id || index} className="flex gap-6 p-5 bg-white rounded shadow-sm border border-gray-100 transition hover:shadow-md">
                    {/* Item Image */}
                    <div className="w-32 shrink-0 cursor-pointer" onClick={() => navigate(`/product/${productId}`)}>
                      <img 
                        src={displayImg} 
                        alt="Product" 
                        className="w-full aspect-[4/5] object-cover rounded bg-gray-100 border border-gray-50"
                        onError={(e) => { e.target.src = 'https://placehold.co/150x200?text=No+Image'; }}
                      />
                    </div>
                    
                    {/* Item Details */}
                    <div className="flex flex-col flex-grow py-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 
                          className="text-lg font-bold text-gray-900 hover:text-gray-600 transition cursor-pointer leading-tight max-w-[80%]" 
                          onClick={() => navigate(`/product/${productId}`)}
                        >
                          {title}
                        </h3>
                        <button className="text-gray-400 hover:text-red-500 transition px-2 py-1 text-sm font-bold">
                           ✕
                        </button>
                      </div>

                      {/* Attributes (e.g. Size, Color) */}
                      {item.attributes && Object.keys(item.attributes).length > 0 && (
                        <div className="text-sm text-gray-500 mb-4 flex gap-3 flex-wrap">
                          {Object.entries(item.attributes).map(([k, v]) => (
                            <span key={k} className="bg-gray-50 px-2.5 py-1 rounded border border-gray-100">
                              {k}: <span className="font-semibold text-gray-700">{v}</span>
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="mt-auto flex justify-between items-end">
                        {/* Quantity Controls */}
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 mb-1.5 tracking-wider uppercase">Qty</p>
                          <div className="flex items-center gap-0">
                            <button className="w-8 h-8 border-1.5 border-gray-200 bg-white text-gray-700 flex items-center justify-center hover:bg-gray-50 transition">
                              −
                            </button>
                            <span className="w-10 h-8 border-y-1.5 border-gray-200 flex items-center justify-center text-sm font-bold text-gray-900">
                              {item.quantity}
                            </span>
                            <button className="w-8 h-8 border-1.5 border-gray-200 bg-white text-gray-700 flex items-center justify-center hover:bg-gray-50 transition">
                              +
                            </button>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          {item.quantity > 1 && (
                            <div className="text-xs text-gray-400 mb-1">
                              {formatPrice((item.price?.amount || 0) / item.quantity, item.price?.currency)} each
                            </div>
                          )}
                          <span className="text-xl font-bold text-gray-900 block tracking-tight">
                            {formatPrice(item.price?.amount || 0, item.price?.currency)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right: Order Summary */}
            <div className="bg-white p-7 rounded shadow-sm border border-gray-100 sticky top-6">
              <h2 className="text-base font-bold text-gray-900 mb-6 uppercase tracking-wider">Order Summary</h2>
              
              <div className="flex flex-col gap-4 mb-6 border-b border-gray-100 pb-6">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Estimated Shipping</span>
                  <span className="text-green-600 font-semibold tracking-wide">FREE</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Tax</span>
                  <span className="font-semibold text-gray-900">{formatPrice(0)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-8">
                <span className="text-sm font-bold text-gray-900 uppercase tracking-wider">Total</span>
                <span className="text-3xl font-bold text-gray-900 tracking-tight">{formatPrice(subtotal)}</span>
              </div>

              <button className="w-full py-4 border-2 border-gray-900 bg-gray-900 text-white text-sm font-bold tracking-widest uppercase rounded transition hover:bg-gray-800 shadow-sm">
                 Checkout
              </button>

              <div className="mt-6 flex flex-col gap-3 bg-gray-50 p-4 rounded border border-gray-100">
                 <div className="flex items-center gap-3 text-xs text-gray-600 font-medium">
                    <span className="text-base">✅</span> 100% Secure Checkout
                 </div>
                 <div className="flex items-center gap-3 text-xs text-gray-600 font-medium">
                    <span className="text-base">🔄</span> 7 Days Return Policy
                 </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddToCartPage;