import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useProducts } from '../hooks/useProducts';
import { useSelector } from 'react-redux';

const CURRENCIES = ['INR', 'USD', 'EUR', 'GBP'];
const MAX_IMAGES = 7;

const EditProduct = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const { handleGetProductFromProductId } = useProducts();

    /* ── form state ── */
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priceAmount: '',
        priceCurrency: 'INR',
    });
    const [existingImages, setExistingImages] = useState([]); // already uploaded URLs
    const [newImages, setNewImages] = useState([]);            // new File objects + previews
    const [isDragging, setIsDragging] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const fileInputRef = useRef(null);

    /* ── fetch product once ── */
    useEffect(() => {
        handleGetProductFromProductId(productId);
    }, [productId]);

    const product = useSelector(state => state.product.products);

    /* pre-fill form once product arrives */
    useEffect(() => {
        const p = Array.isArray(product) ? product[0] : product;
        if (!p || loaded) return;
        setFormData({
            title: p.title || '',
            description: p.description || '',
            priceAmount: p.price?.amount?.toString() || '',
            priceCurrency: p.price?.currency || 'INR',
        });
        setExistingImages((p.images || []).map(img => img.url || img));
        setLoaded(true);
    }, [product]);

    /* ── handlers ── */
    const handleChange = e => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const addFiles = files => {
        const remaining = MAX_IMAGES - existingImages.length - newImages.length;
        if (remaining <= 0) return;
        const toAdd = Array.from(files).slice(0, remaining);
        const added = toAdd.map(file => ({ file, preview: URL.createObjectURL(file) }));
        setNewImages(prev => [...prev, ...added]);
    };

    const handleFileChange = e => { addFiles(e.target.files); e.target.value = ''; };
    const handleDrop = useCallback(e => {
        e.preventDefault(); setIsDragging(false);
        if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
    }, [existingImages, newImages]);
    const handleDragOver = e => { e.preventDefault(); setIsDragging(true); };
    const handleDragLeave = () => setIsDragging(false);

    const removeExisting = idx => setExistingImages(prev => prev.filter((_, i) => i !== idx));
    const removeNew = idx => {
        setNewImages(prev => {
            const updated = [...prev];
            URL.revokeObjectURL(updated[idx].preview);
            updated.splice(idx, 1);
            return updated;
        });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('priceAmount', formData.priceAmount);
            data.append('priceCurrency', formData.priceCurrency);
            // kept existing image URLs
            existingImages.forEach(url => data.append('existingImages', url));
            // new files
            newImages.forEach(img => data.append('product', img.file));

            // TODO: call handleUpdateProduct(productId, data) when API is ready
            console.log('EditProduct submit:', Object.fromEntries(data));
            alert('Product updated! (wire API)');
            navigate('/seller/dashboard');
        } catch (err) {
            console.error('Failed to update product', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    /* ── loading skeleton ── */
    if (!loaded) {
        return (
            <>
                <link
                    href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap"
                    rel="stylesheet"
                />
                <div className="min-h-screen" style={{ backgroundColor: '#fbf9f6' }}>
                    <div className="max-w-6xl mx-auto px-8 lg:px-16 xl:px-24 pt-16">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">
                            <div className="flex flex-col gap-10">
                                {[60, 90, 40].map((w, i) => (
                                    <div key={i} className="h-5 rounded animate-pulse bg-gray-200" style={{ width: `${w}%` }} />
                                ))}
                            </div>
                            <div className="aspect-[4/3] rounded animate-pulse bg-gray-200 w-full" />
                        </div>
                    </div>
                </div>
            </>
        );
    }

    /* ── style helpers (same as CreateProduct) ── */
    const inputClass = "w-full bg-transparent outline-none py-4 text-sm transition-colors duration-300 placeholder:text-[#d0c5b5]";
    const inputStyle = { color: '#1b1c1a', borderBottom: '1px solid #d0c5b5', fontFamily: "'Inter', sans-serif" };
    const handleFocus = e => { e.target.style.borderBottomColor = '#C9A96E'; };
    const handleBlur  = e => { e.target.style.borderBottomColor = '#d0c5b5'; };

    const totalImages = existingImages.length + newImages.length;

    return (
        <>
            {/* Google Fonts */}
            <link
                href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap"
                rel="stylesheet"
            />

            <div
                className="min-h-screen selection:bg-[#C9A96E]/30"
                style={{ backgroundColor: '#fbf9f6', fontFamily: "'Inter', sans-serif" }}
            >
                <div className="max-w-6xl mx-auto px-8 lg:px-16 xl:px-24">

                    {/* ── Top Bar ── */}
                    <div className="pt-10 pb-0 flex items-center gap-5">
                        <button
                            onClick={() => navigate(-1)}
                            className="text-lg transition-colors duration-200 leading-none"
                            style={{ color: '#B5ADA3' }}
                            aria-label="Go back"
                            onMouseEnter={e => e.currentTarget.style.color = '#C9A96E'}
                            onMouseLeave={e => e.currentTarget.style.color = '#B5ADA3'}
                        >
                            ←
                        </button>
                        <span
                            className="text-xs font-medium tracking-[0.32em] uppercase"
                            style={{ fontFamily: "'Cormorant Garamond', serif", color: '#C9A96E' }}
                        >
                            Snitch.
                        </span>
                    </div>

                    {/* ── Page Header ── */}
                    <div className="pt-10 pb-0">
                        <h1
                            className="text-4xl lg:text-5xl font-light leading-tight"
                            style={{ fontFamily: "'Cormorant Garamond', serif", color: '#1b1c1a' }}
                        >
                            Edit Listing
                        </h1>
                        <div className="mt-4 w-14 h-px" style={{ backgroundColor: '#C9A96E' }} />
                        <p className="mt-3 text-xs tracking-[0.15em] uppercase" style={{ color: '#B5ADA3' }}>
                            {formData.title}
                        </p>
                    </div>

                    {/* ── Form ── */}
                    <form onSubmit={handleSubmit} className="pt-14 pb-24">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 lg:items-start">

                            {/* ── LEFT: Text Fields ── */}
                            <div className="flex flex-col gap-12">

                                {/* Title */}
                                <div className="flex flex-col gap-2">
                                    <label
                                        htmlFor="ep-title"
                                        className="text-[10px] uppercase tracking-[0.2em] font-medium"
                                        style={{ color: '#7A6E63' }}
                                    >
                                        Product Title
                                    </label>
                                    <input
                                        id="ep-title"
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        required
                                        placeholder="e.g. Oversized Linen Shirt"
                                        className={inputClass}
                                        style={inputStyle}
                                        onFocus={handleFocus}
                                        onBlur={handleBlur}
                                    />
                                </div>

                                {/* Description */}
                                <div className="flex flex-col gap-2">
                                    <label
                                        htmlFor="ep-description"
                                        className="text-[10px] uppercase tracking-[0.2em] font-medium"
                                        style={{ color: '#7A6E63' }}
                                    >
                                        Description
                                    </label>
                                    <textarea
                                        id="ep-description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows={5}
                                        placeholder="Describe the product — material, fit, details..."
                                        className="w-full bg-transparent outline-none py-4 text-sm transition-colors duration-300 resize-none leading-relaxed placeholder:text-[#d0c5b5]"
                                        style={inputStyle}
                                        onFocus={handleFocus}
                                        onBlur={handleBlur}
                                    />
                                </div>

                                {/* Price */}
                                <div className="flex flex-col gap-3">
                                    <label className="text-[10px] uppercase tracking-[0.2em] font-medium" style={{ color: '#7A6E63' }}>
                                        Price
                                    </label>
                                    <div className="flex gap-5 items-end">
                                        {/* Amount */}
                                        <div className="flex flex-col gap-1 flex-[3]">
                                            <span className="text-[9px] uppercase tracking-[0.18em]" style={{ color: '#B5ADA3' }}>Amount</span>
                                            <input
                                                id="ep-priceAmount"
                                                type="number"
                                                name="priceAmount"
                                                value={formData.priceAmount}
                                                onChange={handleChange}
                                                required
                                                min="0"
                                                step="0.01"
                                                placeholder="0.00"
                                                className={inputClass}
                                                style={inputStyle}
                                                onFocus={handleFocus}
                                                onBlur={handleBlur}
                                            />
                                        </div>
                                        {/* Currency */}
                                        <div className="flex flex-col gap-1 flex-[1]">
                                            <span className="text-[9px] uppercase tracking-[0.18em]" style={{ color: '#B5ADA3' }}>Currency</span>
                                            <select
                                                id="ep-priceCurrency"
                                                name="priceCurrency"
                                                value={formData.priceCurrency}
                                                onChange={handleChange}
                                                className="w-full bg-transparent outline-none py-4 text-sm cursor-pointer appearance-none transition-colors duration-300"
                                                style={inputStyle}
                                                onFocus={handleFocus}
                                                onBlur={handleBlur}
                                            >
                                                {CURRENCIES.map(c => (
                                                    <option key={c} value={c} style={{ backgroundColor: '#fbf9f6', color: '#1b1c1a' }}>{c}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ── RIGHT: Images ── */}
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center justify-between">
                                    <label className="text-[10px] uppercase tracking-[0.2em] font-medium" style={{ color: '#7A6E63' }}>
                                        Images
                                    </label>
                                    <span className="text-[10px]" style={{ color: '#B5ADA3' }}>
                                        {totalImages}/{MAX_IMAGES}
                                    </span>
                                </div>

                                {/* Drop Zone */}
                                {totalImages < MAX_IMAGES && (
                                    <div
                                        onDrop={handleDrop}
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onClick={() => fileInputRef.current?.click()}
                                        className="border border-dashed px-8 py-12 flex flex-col items-center gap-4 cursor-pointer transition-all duration-300"
                                        style={{
                                            borderColor: isDragging ? '#C9A96E' : '#d0c5b5',
                                            backgroundColor: isDragging ? 'rgba(201,169,110,0.04)' : 'transparent'
                                        }}
                                    >
                                        <div
                                            className="w-10 h-10 flex items-center justify-center border transition-colors duration-300"
                                            style={{ borderColor: isDragging ? '#C9A96E' : '#d0c5b5', color: isDragging ? '#C9A96E' : '#B5ADA3' }}
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                            </svg>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm leading-relaxed" style={{ color: '#7A6E63' }}>
                                                Drop images here or{' '}
                                                <span style={{ color: '#C9A96E', textDecoration: 'underline', textUnderlineOffset: '2px' }}>
                                                    tap to upload
                                                </span>
                                            </p>
                                            <p className="text-[10px] uppercase tracking-[0.15em] mt-2" style={{ color: '#B5ADA3' }}>
                                                {MAX_IMAGES - totalImages} slots remaining
                                            </p>
                                        </div>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                    </div>
                                )}

                                {/* Image Grid */}
                                {totalImages > 0 && (
                                    <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-2 mt-1">

                                        {/* Existing images from backend */}
                                        {existingImages.map((url, i) => (
                                            <div
                                                key={`existing-${i}`}
                                                className="relative aspect-square overflow-hidden group"
                                                style={{ backgroundColor: '#eae8e5' }}
                                            >
                                                <img src={url} alt={`Existing ${i + 1}`} className="w-full h-full object-cover" />
                                                {/* Saved badge */}
                                                <span
                                                    className="absolute top-1 left-1 text-[8px] uppercase tracking-widest px-1.5 py-0.5"
                                                    style={{ backgroundColor: 'rgba(201,169,110,0.85)', color: '#1b1c1a' }}
                                                >
                                                    Saved
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeExisting(i)}
                                                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs font-medium tracking-widest uppercase"
                                                    style={{ backgroundColor: 'rgba(27,24,20,0.55)', color: '#fbf9f6' }}
                                                    aria-label={`Remove saved image ${i + 1}`}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        ))}

                                        {/* New images (local previews) */}
                                        {newImages.map((img, i) => (
                                            <div
                                                key={`new-${i}`}
                                                className="relative aspect-square overflow-hidden group"
                                                style={{ backgroundColor: '#eae8e5' }}
                                            >
                                                <img src={img.preview} alt={`New ${i + 1}`} className="w-full h-full object-cover" />
                                                <span
                                                    className="absolute top-1 left-1 text-[8px] uppercase tracking-widest px-1.5 py-0.5"
                                                    style={{ backgroundColor: 'rgba(27,24,20,0.7)', color: '#fbf9f6' }}
                                                >
                                                    New
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeNew(i)}
                                                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs font-medium tracking-widest uppercase"
                                                    style={{ backgroundColor: 'rgba(27,24,20,0.55)', color: '#fbf9f6' }}
                                                    aria-label={`Remove new image ${i + 1}`}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ── Submit ── */}
                        <div className="mt-16 lg:mt-20 flex flex-col sm:flex-row gap-4">
                            {/* Save */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 py-5 text-[11px] uppercase tracking-[0.3em] font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{ backgroundColor: isSubmitting ? '#7A6E63' : '#1b1c1a', color: '#fbf9f6', fontFamily: "'Inter', sans-serif" }}
                                onMouseEnter={e => { if (!isSubmitting) { e.currentTarget.style.backgroundColor = '#C9A96E'; e.currentTarget.style.color = '#1b1c1a'; } }}
                                onMouseLeave={e => { if (!isSubmitting) { e.currentTarget.style.backgroundColor = '#1b1c1a'; e.currentTarget.style.color = '#fbf9f6'; } }}
                            >
                                {isSubmitting ? 'Saving...' : 'Save Changes'}
                            </button>

                            {/* Discard */}
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="sm:w-auto px-10 py-5 text-[11px] uppercase tracking-[0.3em] font-medium transition-all duration-300"
                                style={{ border: '1px solid #d0c5b5', backgroundColor: 'transparent', color: '#7A6E63', fontFamily: "'Inter', sans-serif" }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = '#C9A96E'; e.currentTarget.style.color = '#C9A96E'; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = '#d0c5b5'; e.currentTarget.style.color = '#7A6E63'; }}
                            >
                                Discard
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default EditProduct;
