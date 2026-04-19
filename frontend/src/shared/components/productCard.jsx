import React from 'react';

const ProductCard = ({ product }) => {
  const { title, description, price, images } = product;
  // Get the first image or fallback
  const imageUrl = images && images.length > 0 
    ? images[1].url 
    : 'https://via.placeholder.com/400x500?text=No+Image';

  // Currency formatter
  const formatPrice = (amount, currency) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency || 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="card-dark flex flex-col group overflow-hidden animate-fade-up cursor-pointer hover:border-[#e8c97e44] transition-colors duration-300">
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-[#181818]">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
        />
        {/* Subtle overlay gradient on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>
      </div>
      
      {/* Details Container */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-[#f0ede8] font-serif text-lg tracking-wide truncate">{title}</h3>
        <p className="text-[#888580] text-sm font-sans mt-1 line-clamp-2 min-h-[40px]">{description}</p>
        
        {/* Price & Action Row */}
        <div className="mt-4 pt-4 border-t border-[#1e1e1e] flex items-center justify-between mt-auto">
          <span className="text-[#e8c97e] font-medium font-sans">
             {price ? formatPrice(price.amount, price.currency) : '₹0'}
          </span>
          <button className="text-xs text-[#f0ede8] font-sans tracking-widest uppercase hover:text-[#e8c97e] transition-colors">
            View
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
