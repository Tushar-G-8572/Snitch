import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useProducts } from '../hooks/useProducts';
import { useSelector } from 'react-redux';

const CURRENCIES = ['INR', 'USD', 'EUR', 'GBP', 'JPY'];
const MAX_IMAGES = 7;
const MAX_VARIANT_IMAGES = 4;

/* ─── helpers ─────────────────────────────────────────── */
const makeVariant = () => ({
    id: crypto.randomUUID(),
    stock: '',
    priceAmount: '',
    priceCurrency: 'INR',
    attributes: [{ key: '', value: '' }], // [{key,value}] so users can add multiple attrs
    existingImages: [],
    newImages: [],       // {file, preview}
    fileInputRef: React.createRef(),
    isDragging: false,
});

/* ─── sub-component: single variant card ──────────────── */
const VariantCard = ({ variant, index, onChange, onRemove, inputClass, inputStyle, handleFocus, handleBlur }) => {

    const totalVImages = variant.existingImages.length + variant.newImages.length;

    /* attribute handlers */
    const addAttr = () => onChange(index, {
        attributes: [...variant.attributes, { key: '', value: '' }]
    });
    const removeAttr = (ai) => onChange(index, {
        attributes: variant.attributes.filter((_, i) => i !== ai)
    });
    const updateAttr = (ai, field, val) => {
        const attrs = [...variant.attributes];
        attrs[ai] = { ...attrs[ai], [field]: val };
        onChange(index, { attributes: attrs });
    };

    /* image handlers */
    const addVFiles = (files) => {
        const remaining = MAX_VARIANT_IMAGES - totalVImages;
        if (remaining <= 0) return;
        const toAdd = Array.from(files).slice(0, remaining);
        const added = toAdd.map(file => ({ file, preview: URL.createObjectURL(file) }));
        onChange(index, { newImages: [...variant.newImages, ...added] });
    };

    const handleVDrop = (e) => {
        e.preventDefault();
        onChange(index, { isDragging: false });
        if (e.dataTransfer.files.length) addVFiles(e.dataTransfer.files);
    };

    return (
        <div
            style={{
                border: '1px solid #e0d9cf',
                backgroundColor: '#fdfcfa',
                borderRadius: '2px',
                padding: '28px 28px 24px',
                position: 'relative',
            }}
        >
            {/* header row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px' }}>
                <span
                    style={{
                        fontSize: '9px',
                        letterSpacing: '0.28em',
                        textTransform: 'uppercase',
                        color: '#C9A96E',
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 500,
                    }}
                >
                    Variant {index + 1}
                </span>
                <button
                    type="button"
                    onClick={() => onRemove(index)}
                    style={{
                        fontSize: '10px',
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        color: '#B5ADA3',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'color 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = '#c0392b'}
                    onMouseLeave={e => e.currentTarget.style.color = '#B5ADA3'}
                >
                    × Remove
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 32px' }}>

                {/* ── Left: Attributes + Price/Stock ── */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                    {/* Attributes */}
                    <div>
                        <span
                            style={{
                                display: 'block',
                                fontSize: '9px',
                                letterSpacing: '0.22em',
                                textTransform: 'uppercase',
                                color: '#7A6E63',
                                marginBottom: '14px',
                                fontFamily: "'Inter', sans-serif",
                                fontWeight: 500,
                            }}
                        >
                            Attributes
                        </span>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {variant.attributes.map((attr, ai) => (
                                <div key={ai} style={{ display: 'flex', alignItems: 'flex-end', gap: '10px' }}>
                                    <div style={{ flex: 1 }}>
                                        <span style={{ display: 'block', fontSize: '8px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#B5ADA3', marginBottom: '2px' }}>Key</span>
                                        <input
                                            type="text"
                                            placeholder="e.g. Size"
                                            value={attr.key}
                                            onChange={e => updateAttr(ai, 'key', e.target.value)}
                                            className={inputClass}
                                            style={{ ...inputStyle, fontSize: '12px' }}
                                            onFocus={handleFocus}
                                            onBlur={handleBlur}
                                        />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <span style={{ display: 'block', fontSize: '8px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#B5ADA3', marginBottom: '2px' }}>Value</span>
                                        <input
                                            type="text"
                                            placeholder="e.g. XL"
                                            value={attr.value}
                                            onChange={e => updateAttr(ai, 'value', e.target.value)}
                                            className={inputClass}
                                            style={{ ...inputStyle, fontSize: '12px' }}
                                            onFocus={handleFocus}
                                            onBlur={handleBlur}
                                        />
                                    </div>
                                    {variant.attributes.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeAttr(ai)}
                                            style={{ color: '#B5ADA3', background: 'none', border: 'none', cursor: 'pointer', paddingBottom: '14px', fontSize: '14px', lineHeight: 1, transition: 'color 0.2s' }}
                                            onMouseEnter={e => e.currentTarget.style.color = '#c0392b'}
                                            onMouseLeave={e => e.currentTarget.style.color = '#B5ADA3'}
                                            aria-label="Remove attribute"
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={addAttr}
                            style={{
                                marginTop: '10px',
                                fontSize: '9px',
                                letterSpacing: '0.2em',
                                textTransform: 'uppercase',
                                color: '#C9A96E',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '6px 0',
                                transition: 'opacity 0.2s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
                            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                        >
                            + Add Attribute
                        </button>
                    </div>

                    {/* Price row */}
                    <div>
                        <span
                            style={{
                                display: 'block',
                                fontSize: '9px',
                                letterSpacing: '0.22em',
                                textTransform: 'uppercase',
                                color: '#7A6E63',
                                marginBottom: '10px',
                                fontFamily: "'Inter', sans-serif",
                                fontWeight: 500,
                            }}
                        >
                            Price <span style={{ color: '#B5ADA3', fontWeight: 400 }}>(optional)</span>
                        </span>
                        <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-end' }}>
                            <div style={{ flex: 3 }}>
                                <span style={{ display: 'block', fontSize: '8px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#B5ADA3', marginBottom: '2px' }}>Amount</span>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={variant.priceAmount}
                                    onChange={e => onChange(index, { priceAmount: e.target.value })}
                                    className={inputClass}
                                    style={{ ...inputStyle, fontSize: '12px' }}
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                />
                            </div>
                            <div style={{ flex: 2 }}>
                                <span style={{ display: 'block', fontSize: '8px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#B5ADA3', marginBottom: '2px' }}>Currency</span>
                                <select
                                    value={variant.priceCurrency}
                                    onChange={e => onChange(index, { priceCurrency: e.target.value })}
                                    className="w-full bg-transparent outline-none py-4 text-sm cursor-pointer appearance-none transition-colors duration-300"
                                    style={{ ...inputStyle, fontSize: '12px' }}
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

                    {/* Stock */}
                    <div>
                        <span
                            style={{
                                display: 'block',
                                fontSize: '9px',
                                letterSpacing: '0.22em',
                                textTransform: 'uppercase',
                                color: '#7A6E63',
                                marginBottom: '10px',
                                fontFamily: "'Inter', sans-serif",
                                fontWeight: 500,
                            }}
                        >
                            Stock
                        </span>
                        <input
                            type="number"
                            min="0"
                            step="1"
                            placeholder="0"
                            value={variant.stock}
                            onChange={e => onChange(index, { stock: e.target.value })}
                            className={inputClass}
                            style={{ ...inputStyle, fontSize: '12px' }}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                        />
                    </div>
                </div>

                {/* ── Right: Variant Images ── */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#7A6E63', fontWeight: 500 }}>
                            Images
                        </span>
                        <span style={{ fontSize: '9px', color: '#B5ADA3' }}>
                            {totalVImages}/{MAX_VARIANT_IMAGES}
                        </span>
                    </div>

                    {/* Drop zone */}
                    {totalVImages < MAX_VARIANT_IMAGES && (
                        <div
                            onDrop={handleVDrop}
                            onDragOver={e => { e.preventDefault(); onChange(index, { isDragging: true }); }}
                            onDragLeave={() => onChange(index, { isDragging: false })}
                            onClick={() => variant.fileInputRef.current?.click()}
                            style={{
                                border: `1px dashed ${variant.isDragging ? '#C9A96E' : '#d0c5b5'}`,
                                backgroundColor: variant.isDragging ? 'rgba(201,169,110,0.04)' : 'transparent',
                                padding: '20px 12px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '8px',
                                cursor: 'pointer',
                                transition: 'all 0.3s',
                                borderRadius: '1px',
                            }}
                        >
                            <div
                                style={{
                                    width: '32px',
                                    height: '32px',
                                    border: `1px solid ${variant.isDragging ? '#C9A96E' : '#d0c5b5'}`,
                                    color: variant.isDragging ? '#C9A96E' : '#B5ADA3',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'color 0.3s, border-color 0.3s',
                                }}
                            >
                                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                </svg>
                            </div>
                            <p style={{ fontSize: '11px', color: '#7A6E63', textAlign: 'center' }}>
                                Drop or{' '}
                                <span style={{ color: '#C9A96E', textDecoration: 'underline', textUnderlineOffset: '2px' }}>upload</span>
                            </p>
                            <p style={{ fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#B5ADA3' }}>
                                {MAX_VARIANT_IMAGES - totalVImages} slots left
                            </p>
                            <input
                                ref={variant.fileInputRef}
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={e => { addVFiles(e.target.files); e.target.value = ''; }}
                                style={{ display: 'none' }}
                            />
                        </div>
                    )}

                    {/* Image grid */}
                    {totalVImages > 0 && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                            {variant.existingImages.map((url, ei) => (
                                <div
                                    key={`ev-${ei}`}
                                    style={{ position: 'relative', aspectRatio: '1', overflow: 'hidden', backgroundColor: '#eae8e5' }}
                                    className="group"
                                >
                                    <img src={url} alt={`Variant ${index + 1} Saved ${ei + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    <span style={{ position: 'absolute', top: '3px', left: '3px', fontSize: '7px', letterSpacing: '0.2em', textTransform: 'uppercase', padding: '2px 4px', backgroundColor: 'rgba(201,169,110,0.85)', color: '#1b1c1a' }}>
                                        Saved
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => onChange(index, { existingImages: variant.existingImages.filter((_, i) => i !== ei) })}
                                        className="opacity-0 group-hover:opacity-100"
                                        style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(27,24,20,0.55)', color: '#fbf9f6', border: 'none', cursor: 'pointer', fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', transition: 'opacity 0.2s' }}
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                            {variant.newImages.map((img, ni) => (
                                <div
                                    key={`nv-${ni}`}
                                    style={{ position: 'relative', aspectRatio: '1', overflow: 'hidden', backgroundColor: '#eae8e5' }}
                                    className="group"
                                >
                                    <img src={img.preview} alt={`Variant ${index + 1} New ${ni + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    <span style={{ position: 'absolute', top: '3px', left: '3px', fontSize: '7px', letterSpacing: '0.2em', textTransform: 'uppercase', padding: '2px 4px', backgroundColor: 'rgba(27,24,20,0.7)', color: '#fbf9f6' }}>
                                        New
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            URL.revokeObjectURL(img.preview);
                                            onChange(index, { newImages: variant.newImages.filter((_, i) => i !== ni) });
                                        }}
                                        className="opacity-0 group-hover:opacity-100"
                                        style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(27,24,20,0.55)', color: '#fbf9f6', border: 'none', cursor: 'pointer', fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', transition: 'opacity 0.2s' }}
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

/* ─── main component ──────────────────────────────────── */
const EditProduct = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const { handleGetProductFromProductId } = useProducts();

    /* ── base product form state ── */
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priceAmount: '',
        priceCurrency: 'INR',
    });
    const [existingImages, setExistingImages] = useState([]);
    const [newImages, setNewImages] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const fileInputRef = useRef(null);

    /* ── variants state ── */
    const [variants, setVariants] = useState([]);
    const [variantsOpen, setVariantsOpen] = useState(false);

    /* ── fetch product ── */
    useEffect(() => {
        handleGetProductFromProductId(productId);
    }, [productId]);

    const product = useSelector(state => state.product.products);
    console.log(product);

    /* pre-fill once product arrives */
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

        /* hydrate existing variants */
        if (p.varients && p.varients.length > 0) {
            const hydrated = p.varients.map(v => ({
                id: v._id || crypto.randomUUID(),
                stock: v.stock?.toString() || '0',
                priceAmount: v.price?.amount?.toString() || '',
                priceCurrency: v.price?.currency || 'INR',
                attributes: v.attributes
                    ? Object.entries(
                        v.attributes instanceof Map
                            ? Object.fromEntries(v.attributes)
                            : v.attributes
                    ).map(([key, value]) => ({ key, value }))
                    : [{ key: '', value: '' }],
                existingImages: (v.images || []).map(img => img.url || img).filter(Boolean),
                newImages: [],
                fileInputRef: React.createRef(),
                isDragging: false,
            }));
            setVariants(hydrated);
            setVariantsOpen(true);
        }

        setLoaded(true);
    }, [product]);

    /* ── base product handlers ── */
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

    /* ── variant handlers ── */
    const addVariant = () => setVariants(prev => [...prev, makeVariant()]);

    const removeVariant = (idx) => {
        setVariants(prev => {
            const updated = [...prev];
            // revoke any object URLs
            updated[idx].newImages.forEach(img => URL.revokeObjectURL(img.preview));
            updated.splice(idx, 1);
            return updated;
        });
    };

    const updateVariant = (idx, patch) => {
        setVariants(prev => {
            const updated = [...prev];
            updated[idx] = { ...updated[idx], ...patch };
            return updated;
        });
    };

    /* ── submit ── */
    const handleSubmit = async e => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('priceAmount', formData.priceAmount);
            data.append('priceCurrency', formData.priceCurrency);
            existingImages.forEach(url => data.append('existingImages', url));
            newImages.forEach(img => data.append('product', img.file));

            /* serialize variants */
            const serializedVariants = variants.map(v => ({
                stock: Number(v.stock) || 0,
                priceAmount: v.priceAmount ? Number(v.priceAmount) : undefined,
                priceCurrency: v.priceCurrency,
                attributes: Object.fromEntries(v.attributes.filter(a => a.key).map(a => [a.key, a.value])),
                existingImages: v.existingImages,
            }));
            data.append('variants', JSON.stringify(serializedVariants));
            variants.forEach((v, vi) => {
                v.newImages.forEach(img => data.append(`variantImages_${vi}`, img.file));
            });

            // TODO: call handleUpdateProduct(productId, data)
            console.log('EditProduct submit — base:', Object.fromEntries(data));
            console.log('EditProduct submit — variants:', serializedVariants);
            alert('Product updated! (wire API)');
            navigate('/seller/dashboard');
        } catch (err) {
            console.error('Failed to update product', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    /* ── style tokens ── */
    const inputClass = "w-full bg-transparent outline-none py-4 text-sm transition-colors duration-300 placeholder:text-[#d0c5b5]";
    const inputStyle = { color: '#1b1c1a', borderBottom: '1px solid #d0c5b5', fontFamily: "'Inter', sans-serif" };
    const handleFocus = e => { e.target.style.borderBottomColor = '#C9A96E'; };
    const handleBlur = e => { e.target.style.borderBottomColor = '#d0c5b5'; };
    const totalImages = existingImages.length + newImages.length;

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

    return (
        <>
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

                        {/* ── Section 1: Base product ── */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 lg:items-start">

                            {/* LEFT: Text Fields */}
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

                            {/* RIGHT: Images */}
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center justify-between">
                                    <label className="text-[10px] uppercase tracking-[0.2em] font-medium" style={{ color: '#7A6E63' }}>
                                        Images
                                    </label>
                                    <span className="text-[10px]" style={{ color: '#B5ADA3' }}>
                                        {totalImages}/{MAX_IMAGES}
                                    </span>
                                </div>

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

                                {totalImages > 0 && (
                                    <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-2 mt-1">
                                        {existingImages.map((url, i) => (
                                            <div
                                                key={`existing-${i}`}
                                                className="relative aspect-square overflow-hidden group"
                                                style={{ backgroundColor: '#eae8e5' }}
                                            >
                                                <img src={url} alt={`Existing ${i + 1}`} className="w-full h-full object-cover" />
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

                        {/* ════════════════════════════════════
                            ── Section 2: Variants ──
                        ════════════════════════════════════ */}
                        <div className="mt-20">

                            {/* Section header / accordion toggle */}
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    paddingBottom: '12px',
                                    borderBottom: '1px solid #e0d9cf',
                                    cursor: 'pointer',
                                    userSelect: 'none',
                                }}
                                onClick={() => setVariantsOpen(prev => !prev)}
                                role="button"
                                aria-expanded={variantsOpen}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <h2
                                        style={{
                                            fontFamily: "'Cormorant Garamond', serif",
                                            fontSize: '26px',
                                            fontWeight: 300,
                                            color: '#1b1c1a',
                                            margin: 0,
                                        }}
                                    >
                                        Variants
                                    </h2>
                                    {variants.length > 0 && (
                                        <span
                                            style={{
                                                fontSize: '9px',
                                                letterSpacing: '0.22em',
                                                textTransform: 'uppercase',
                                                color: '#C9A96E',
                                                backgroundColor: 'rgba(201,169,110,0.1)',
                                                padding: '3px 8px',
                                                borderRadius: '1px',
                                            }}
                                        >
                                            {variants.length} {variants.length === 1 ? 'variant' : 'variants'}
                                        </span>
                                    )}
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <span
                                        style={{
                                            fontSize: '9px',
                                            letterSpacing: '0.2em',
                                            textTransform: 'uppercase',
                                            color: '#B5ADA3',
                                        }}
                                    >
                                        {variantsOpen ? 'Collapse' : 'Expand'}
                                    </span>
                                    <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="#B5ADA3"
                                        strokeWidth="1.5"
                                        style={{
                                            transition: 'transform 0.3s ease',
                                            transform: variantsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                        }}
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>

                            {/* Animated container */}
                            <div
                                style={{
                                    overflow: 'hidden',
                                    maxHeight: variantsOpen ? '9999px' : '0px',
                                    transition: 'max-height 0.4s ease',
                                }}
                            >
                                <div style={{ paddingTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

                                    {variants.length === 0 && (
                                        <div
                                            style={{
                                                border: '1px dashed #d0c5b5',
                                                padding: '40px 24px',
                                                textAlign: 'center',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                gap: '12px',
                                            }}
                                        >
                                            <svg width="32" height="32" fill="none" stroke="#d0c5b5" strokeWidth="1" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h8m-8 4h4" />
                                            </svg>
                                            <p style={{ fontSize: '13px', color: '#B5ADA3', margin: 0 }}>
                                                No variants yet
                                            </p>
                                            <p style={{ fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#d0c5b5', margin: 0 }}>
                                                Add size, colour, material & more
                                            </p>
                                        </div>
                                    )}

                                    {variants.map((v, idx) => (
                                        <VariantCard
                                            key={v.id}
                                            variant={v}
                                            index={idx}
                                            onChange={updateVariant}
                                            onRemove={removeVariant}
                                            inputClass={inputClass}
                                            inputStyle={inputStyle}
                                            handleFocus={handleFocus}
                                            handleBlur={handleBlur}
                                        />
                                    ))}

                                    {/* Add variant button */}
                                    <button
                                        type="button"
                                        onClick={addVariant}
                                        style={{
                                            width: '100%',
                                            padding: '16px',
                                            border: '1px solid #d0c5b5',
                                            background: 'transparent',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '8px',
                                            fontSize: '10px',
                                            letterSpacing: '0.26em',
                                            textTransform: 'uppercase',
                                            color: '#7A6E63',
                                            transition: 'all 0.25s',
                                            fontFamily: "'Inter', sans-serif",
                                            fontWeight: 500,
                                        }}
                                        onMouseEnter={e => {
                                            e.currentTarget.style.borderColor = '#C9A96E';
                                            e.currentTarget.style.color = '#C9A96E';
                                        }}
                                        onMouseLeave={e => {
                                            e.currentTarget.style.borderColor = '#d0c5b5';
                                            e.currentTarget.style.color = '#7A6E63';
                                        }}
                                    >
                                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                        </svg>
                                        Add Variant
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* ── Submit ── */}
                        <div className="mt-16 lg:mt-20 flex flex-col sm:flex-row gap-4">
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
