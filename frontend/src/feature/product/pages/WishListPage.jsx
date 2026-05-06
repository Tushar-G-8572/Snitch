import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../hooks/useCart';
import Navbar from '../../shared/components/Navbar';

/* ── helpers ── */
const fmt = (amount, currency = 'INR') =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);

function getProductImage(product) {
    return product.images[0]?.url || 'https://placehold.co/400x500?text=No+Image' ;
}

/* ── Skeleton ── */
function WishlistSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      <div className="max-w-6xl mx-auto px-5 py-10">
        <div className="h-9 w-52 bg-gray-200 rounded-lg mb-8 animate-pulse" />
        <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-gray-200 rounded-2xl h-80 animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Empty State ── */
function EmptyWishlist({ onNavigate }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
      <div style={{ fontSize: '5rem', lineHeight: 1 }}>🤍</div>
      <h2 className="text-2xl font-black text-gray-900">Your wishlist is empty</h2>
      <p className="text-gray-400 text-sm">Save items you love and come back to them later.</p>
      <button
        onClick={onNavigate}
        className="mt-4 px-10 py-3.5 bg-gray-900 text-white rounded-xl font-bold text-sm tracking-widest hover:bg-gray-700 transition-colors cursor-pointer border-none"
      >
        Explore Products
      </button>
    </div>
  );
}

/* ── Single Wishlist Card ── */
function WishlistCard({ item, onAddToCart }) {
  const navigate = useNavigate();
  const { product } = item;
  if (!product) return null;

  const imgUrl = getProductImage(product);
  const price = product.price?.amount ?? 0;
  const currency = product.price?.currency ?? 'INR';
  const inStock = product.stock > 0;

  return (
    <div
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-shadow duration-300"
      style={{ cursor: 'default' }}
    >
      {/* Image */}
      <div
        className="relative overflow-hidden bg-gray-100"
        style={{ aspectRatio: '4/5', cursor: 'pointer' }}
        onClick={() => navigate(`/product/${product._id}`)}
      >
        <img
          src={imgUrl}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={e => { e.target.src = 'https://placehold.co/400x500?text=No+Image'; }}
        />
        {/* Stock badge */}
        <span
          className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full ${
            inStock
              ? 'bg-green-100 text-green-700 border border-green-200'
              : 'bg-red-100 text-red-600 border border-red-200'
          }`}
        >
          {inStock ? `${product.stock} in stock` : 'Out of stock'}
        </span>
      </div>

      {/* Details */}
      <div className="flex flex-col gap-2 p-4 flex-1">
        <h3
          onClick={() => navigate(`/product/${product._id}`)}
          className="text-sm font-bold text-gray-900 leading-snug line-clamp-2 cursor-pointer hover:text-indigo-600 transition-colors"
        >
          {product.title}
        </h3>

        {product.description && (
          <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}

        {/* Variants summary */}
        {Array.isArray(product.varients) && product.varients.length > 0 && (
          <div className="flex gap-1.5 flex-wrap">
            {product.varients.slice(0, 3).map((v, idx) => (
              <span
                key={idx}
                className="text-xs px-2 py-0.5 bg-gray-50 border border-gray-200 rounded-full text-gray-500 font-medium"
              >
                {v.attributes
                  ? Object.values(v.attributes).join(' / ')
                  : `Option ${idx + 1}`}
              </span>
            ))}
            {product.varients.length > 3 && (
              <span className="text-xs px-2 py-0.5 bg-gray-50 border border-gray-200 rounded-full text-gray-400">
                +{product.varients.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Price + CTA */}
        <div className="mt-auto pt-3 flex items-center justify-between gap-3 border-t border-gray-100">
          <span className="text-lg font-black text-gray-900 tracking-tight">
            {fmt(price, currency)}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════ */
const WishListPage = () => {
  const navigate = useNavigate();
  const wishlist = useSelector(state => state.product.products) || [];
  const loading = useSelector(state => state.product.loading);

  const { handleGetWishlistProduct } = useProducts();
  const { handleAddToCart } = useCart();

  useEffect(() => {
    handleGetWishlistProduct();
  }, []);

  async function onAddToCart(productId) {
    await handleAddToCart({ productId, quantity: 1 });
    navigate('/cart-items');
  }

  if (loading && wishlist.length === 0) return <WishlistSkeleton />;
  if (!loading && wishlist.length === 0) return <EmptyWishlist onNavigate={() => navigate('/')} />;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-5 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-1">My Wishlist</h1>
          <p className="text-gray-400 text-sm">
            {wishlist.length} saved item{wishlist.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Grid */}
        <div
          className="grid gap-4 sm:gap-6"
          style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}
        >
          {wishlist.map(item => (
            <WishlistCard
              key={item._id}
              item={item}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default WishListPage;