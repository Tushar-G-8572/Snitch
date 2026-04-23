import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useCart } from "../hooks/useCart";
import { useNavigate } from "react-router";

const formatPrice = (amount, currency = "INR") =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);

const shortId = (id) => (id ? id.slice(-6).toUpperCase() : null);

const productColors = ["#f3ede6", "#e6ede8", "#e8e6f3", "#f3e6ec", "#e6f0f3", "#f3f0e6"];

/* ── Skeleton ── */
const LoadingSkeleton = () => (
  <div className="min-h-screen bg-gray-50 font-sans pb-20">
    <div className="max-w-5xl mx-auto px-10 py-8">
      <div className="h-10 w-48 bg-gray-200 rounded animate-pulse mb-8" />
      <div className="grid grid-cols-[1fr_300px] gap-8">
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 flex gap-4">
              <div className="w-20 h-24 bg-gray-200 rounded-lg animate-pulse flex-shrink-0" />
              <div className="flex-1 flex flex-col gap-3 pt-1">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                <div className="h-3 bg-gray-200 rounded animate-pulse w-1/3" />
                <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 h-64 animate-pulse" />
      </div>
    </div>
  </div>
);

/* ── Empty State ── */
const EmptyCart = ({ onContinue }) => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      {/* Breadcrumb */}
      <nav className="w-full flex justify-between items-center ">
        <div className=' px-10 py-5 text-xs text-gray-600 flex items-center gap-1'>
          <span className="cursor-pointer hover:text-gray-900 transition" onClick={() => navigate('/')}>Home</span>
          <span className="text-gray-400 px-1"> / </span>
          <span className="text-gray-900 font-medium">Cart</span>
        </div>
        <div className="right flex text-sm text-gray-600 jusity-between items-center gap-5 mr-10 ">
          <div className="add-to-cart cursor-pointer hover:text-gray-900 transition ">
            <span className="text-xl">🛒</span>
          </div>
          <div className="profile cursor-pointer hover:text-gray-900 transition ">
            <span>profile</span>
          </div>
        </div>
      </nav>
      <div className="flex-1 flex items-center justify-center pb-20">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-xl font-medium text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-sm text-gray-500 mb-6">Looks like you haven't added anything yet.</p>
          <button
            onClick={onContinue}
            className="px-6 py-3 bg-gray-900 text-white text-sm font-semibold tracking-widest uppercase rounded transition hover:bg-gray-800"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Cart Item Card ── */
const CartItemCard = ({ item, index, onQuantityChange, onRemove }) => {

  const variantId = typeof item.varient === 'object'
    ? (item.varient?._id || item.varient?.$oid)
    : item.varient;

  const productId = typeof item.product === 'object'
    ? (item.product?._id || item.product?.$oid)
    : item.product;

  const lineTotal = item.price?.amount * item.quantity;
  const bgColor = productColors[index % productColors.length];

  const safeProductId = typeof productId === 'string' ? productId : String(productId || '');
  const safeVariantId = typeof variantId === 'string' ? variantId : String(variantId || '');

  const productTitle = item.product?.title || "Product";

  // ── Image resolution ──────────────────────────────────────
  // Case 1: variant is populated (object with images array)
  const variantImage = typeof item.varient === 'object' && item.varient !== null
    ? item.varient?.images?.[0]?.url
    : null;

  // Case 2: fall back to product image
  const productImage = item.product?.images?.[0]?.url || null;

  // If item has a variantId → prefer variantImage, else productImage
  const displayImage = safeVariantId ? (variantImage || productImage) : productImage;
  // ──────────────────────────────────────────────────────────

  const variantAttrs = item.attributes
    || (typeof item.varient === 'object' ? item.varient?.attributes : null)
    || null;

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 flex gap-4 items-start transition hover:border-gray-200">

      {/* Image */}
      <div
        className="w-20 h-24 rounded-lg flex-shrink-0 overflow-hidden border border-gray-100 flex items-center justify-center"
        style={{ background: bgColor }}
      >
        {displayImage ? (
          <img
            src={displayImage}
            alt={productTitle}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.style.display = "none"; }}
          />
        ) : (
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" style={{ opacity: 0.3 }}>
            <rect x="6" y="4" width="20" height="24" rx="3" stroke="#555" strokeWidth="1.5" />
            <path d="M11 4v2a5 5 0 0010 0V4" stroke="#555" strokeWidth="1.5" />
          </svg>
        )}
      </div>

      {/* rest of your JSX stays exactly the same... */}

      {/* Body */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 mb-1 truncate">{productTitle}</p>
        <p className="text-xs text-gray-400 font-mono mb-3">#{shortId(safeProductId)}</p>

        {/* Pills */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {safeVariantId ? (
            <span className="text-xs bg-blue-50 text-blue-800 border border-blue-100 px-2.5 py-1 rounded-md">
              Variant #{shortId(safeVariantId)}
            </span>
          ) : (
            <span className="text-xs bg-gray-100 text-gray-400 border border-gray-100 px-2.5 py-1 rounded-md italic">
              No variant
            </span>
          )}

          {/* Show variant attributes if populated */}
          {variantAttrs && Object.entries(variantAttrs).map(([key, val]) => (
            <span key={key} className="text-xs bg-gray-100 text-gray-600 border border-gray-100 px-2.5 py-1 rounded-md">
              {key}: {val}
            </span>
          ))}

          <span className="text-xs bg-gray-100 text-gray-500 border border-gray-100 px-2.5 py-1 rounded-md">
            {formatPrice(item.price.amount)} each
          </span>
        </div>

        {/* Footer: price + controls */}
        <div className="flex items-center justify-between">
          <span className="text-base font-semibold text-gray-900">
            {formatPrice(lineTotal)}
          </span>

          <div className="flex items-center gap-3">
            {/* Quantity Control */}
            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => onQuantityChange(item._id, item.quantity - 1)}
                disabled={item.quantity <= 1}
                className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition disabled:opacity-30 disabled:cursor-not-allowed text-base"
              >
                −
              </button>
              <span className="w-8 h-8 flex items-center justify-center text-sm font-semibold text-gray-900 border-x border-gray-200">
                {item.quantity}
              </span>
              <button
                onClick={() => onQuantityChange(item._id, item.quantity + 1)}
                className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition text-base"
              >
                +
              </button>
            </div>

            {/* Remove */}
            <button
              onClick={() => onRemove(item._id)}
              className="w-8 h-8 flex items-center justify-center text-gray-300 hover:text-red-500 transition rounded-lg hover:bg-red-50"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Order Summary ── */
const OrderSummary = ({ items, onCheckout, onContinue }) => {
  const subtotalMRP = items.reduce((sum, item) => sum + item.price.amount * 2 * item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price.amount * item.quantity, 0);
  const discount = subtotalMRP - subtotal;
  const delivery = subtotal >= 499 ? 0 : 49;
  const total = subtotal + delivery;

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 sticky top-6">
      <p className="text-base font-semibold text-gray-900 mb-4">Order summary</p>

      <div className="flex flex-col gap-3 text-sm">
        <div className="flex justify-between text-gray-500">
          <span>MRP total</span>
          <span className="line-through text-gray-400">{formatPrice(subtotalMRP)}</span>
        </div>
        <div className="flex justify-between text-gray-500">
          <span>Discount</span>
          <span className="text-green-600 font-medium">−{formatPrice(discount)}</span>
        </div>
        <div className="flex justify-between text-gray-500">
          <span>Delivery</span>
          <span className={delivery === 0 ? "text-green-600 font-medium" : "text-gray-900"}>
            {delivery === 0 ? "Free" : formatPrice(delivery)}
          </span>
        </div>

        <div className="border-t border-gray-100 pt-3 flex justify-between text-gray-900 font-semibold text-base">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>

      <p className="text-xs text-green-600 mt-2 mb-4">
        You save {formatPrice(discount)} on this order
      </p>

      <button
        onClick={onCheckout}
        className="w-full py-3.5 bg-gray-900 text-white text-xs font-bold tracking-widest uppercase rounded-lg transition hover:bg-gray-800"
      >
        Proceed to Checkout
      </button>
      <button
        onClick={onContinue}
        className="w-full mt-2.5 py-3 bg-transparent text-gray-600 border border-gray-200 text-xs font-semibold tracking-widest uppercase rounded-lg transition hover:bg-gray-50"
      >
        Continue Shopping
      </button>

      {/* Trust Badges */}
      <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col gap-2.5">
        {[
          { icon: "🔒", text: "Secure checkout" },
          { icon: "🚚", text: "Free delivery above ₹499" },
          { icon: "🔄", text: "7-day easy returns" },
        ].map(({ icon, text }) => (
          <div key={text} className="flex items-center gap-2 text-xs text-gray-400">
            <span style={{ fontSize: 14 }}>{icon}</span>
            {text}
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── Main Page ── */
const AddToCartPage = () => {
  const navigate = useNavigate();
  const cartProducts = useSelector((state) => state.cart.cartProducts);
  console.log(cartProducts);
  const loading = useSelector((state) => state.cart.loading);
  const { handleGetAddToCartProduct, handleUpdateQuantity, handleRemoveFromCart } = useCart();

  useEffect(() => {
    handleGetAddToCartProduct();
  }, []);
  
  // Local quantity state for optimistic UI updates
  const [localItems, setLocalItems] = useState([]);

  useEffect(() => {
    if (cartProducts && Array.isArray(cartProducts) && cartProducts.length > 0) {
      setLocalItems(cartProducts[0].items || []);
    } else if (cartProducts?.items) {
      setLocalItems(cartProducts.items);
    }
  }, [cartProducts]);

  const handleQuantityChange = async (itemId, newQty) => {
    if (newQty < 1) return;
    // Optimistic update
    setLocalItems((prev) =>
      prev.map((item) =>
        (item._id?.$oid || item._id) === (itemId?.$oid || itemId)
          ? { ...item, quantity: newQty }
          : item
      )
    );
    // TODO: call your update API
    // await handleUpdateQuantity(itemId, newQty);
  };

  const handleRemove = async (itemId) => {
    // Optimistic update
    setLocalItems((prev) =>
      prev.filter((item) =>
        (item._id?.$oid || item._id) !== (itemId?.$oid || itemId)
      )
    );
    // TODO: call your remove API
    // await handleRemoveFromCart(itemId);
  };

  if (loading) return <LoadingSkeleton />;
  if (!localItems.length) return <EmptyCart onContinue={() => navigate("/")} />;

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20 text-gray-700">

      {/* Breadcrumb */}
      <nav className="w-full flex justify-between items-center ">
        <div className=' px-10 py-5 text-xs text-gray-600 flex items-center gap-1'>
          <span className="cursor-pointer hover:text-gray-900 transition" onClick={() => navigate('/')}>Home</span>
          <span className="text-gray-400 px-1"> / </span>
          <span className="text-gray-900 font-medium">Cart</span>
        </div>
        <div className="right flex text-sm text-gray-600 jusity-between items-center gap-5 mr-10 ">
          <div className="add-to-cart cursor-pointer hover:text-gray-900 transition ">
            <span className="text-xl">🛒</span>
          </div>
          <div className="profile cursor-pointer hover:text-gray-900 transition ">
            <span>profile</span>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="max-w-5xl mx-auto px-10 pt-4 pb-2 flex items-baseline gap-3">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Your cart</h1>
        <span className="text-sm text-gray-400">{localItems.length} item{localItems.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Layout */}
      <div className="max-w-5xl mx-auto px-10 py-6 grid grid-cols-[1fr_300px] gap-8 items-start">

        {/* Cart Items */}
        <div className="flex flex-col gap-3">
          {localItems.map((item, index) => (
            <CartItemCard
              key={item._id?.$oid || item._id || index}
              item={item}
              index={index}
              onQuantityChange={handleQuantityChange}
              onRemove={handleRemove}
            />
          ))}
        </div>

        {/* Order Summary */}
        <OrderSummary
          items={localItems}
          onCheckout={() => navigate("/checkout")}
          onContinue={() => navigate("/")}
        />
      </div>
    </div>
  );
};

export default AddToCartPage;