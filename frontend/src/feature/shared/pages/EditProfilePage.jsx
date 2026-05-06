import React, { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { FiUser, FiMail, FiShield} from 'react-icons/fi';
import { useAuth } from '../../auth/hooks/useAuth';
import Navbar from '../components/Navbar';

const Field = ({ label, icon, children }) => (
    <div>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#888', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>
            {label}
        </label>
        <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', inset: '0 auto 0 0', width: 42, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', color: '#aaa' }}>
                {icon}
            </div>
            {children}
        </div>
    </div>
);

const inputStyle = (disabled = false) => ({
    width: '100%', boxSizing: 'border-box',
    padding: '10px 14px 10px 42px',
    fontSize: 14, color: disabled ? '#aaa' : '#111',
    background: disabled ? '#f8f8f8' : '#fafafa',
    border: '1.5px solid #ebebeb',
    borderRadius: 10, outline: 'none',
    transition: 'border 0.15s, background 0.15s',
    cursor: disabled ? 'not-allowed' : 'text',
});

const EditProfilePage = () => {
    const user = useSelector(state => state.auth.user);
    const { handleUpdateUser } = useAuth();
    const fileInputRef = useRef({});
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        const flag = await handleUpdateUser(fileInputRef);
        setSaving(false);
        if (flag) {
            fileInputRef.current = {};
            setSaved(true);
            setTimeout(() => setSaved(false), 2500);
        }
    };

    if (!user) {
        return (
            <>
                <Navbar  />
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 60px)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#f0f0f0', animation: 'pulse 1.5s infinite' }} />
                        <div style={{ width: 120, height: 12, borderRadius: 6, background: '#f0f0f0', animation: 'pulse 1.5s infinite' }} />
                    </div>
                    <style>{`@keyframes pulse { 0%,100%{opacity:1}50%{opacity:.5} }`}</style>
                </div>
            </>
        );
    }

    const initials = user.fullName
        ? user.fullName.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
        : 'U';

    return (
        <div style={{ minHeight: '100vh', background: '#f6f6f4', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
            <Navbar />

            <div style={{ maxWidth: 680, margin: '0 auto', padding: '2.5rem 1.25rem 4rem' }}>
                {/* Page header */}
                <div style={{ marginBottom: '1rem' }}>
                    <h1 style={{ fontSize: 20, fontWeight: 700, color: '#111', margin: 0, letterSpacing: '-0.4px' }}>Update Profile</h1>
                    <p style={{ fontSize: 13.5, color: '#888', margin: '4px 0 0' }}>Manage your personal information and account preferences.</p>
                </div>

                {/* Avatar section */}
                <div style={{
                    background: '#fff', borderRadius: 16, border: '1px solid #ebebeb',
                    padding: '1.5rem', marginBottom: '1rem',
                    display: 'flex', alignItems: 'center', gap: '1.25rem',
                }}>
                    <div style={{
                        width: 68, height: 68, borderRadius: '50%',
                        background: '#111', color: '#fff',
                        fontWeight: 700, fontSize: 24,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0, letterSpacing: '-1px',
                    }}>
                        {initials}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ margin: 0, fontWeight: 700, fontSize: 16, color: '#111', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.fullName}</p>
                        <p style={{ margin: '2px 0 0', fontSize: 13, color: '#999', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</p>
                        <span style={{
                            display: 'inline-block', marginTop: 8,
                            padding: '2px 10px', borderRadius: 999,
                            background: '#f0f0f0', color: '#555',
                            fontSize: 11, fontWeight: 600, letterSpacing: '0.04em',
                        }}>{user.role || 'Buyer'}</span>
                    </div>
                </div>

                {/* Form card */}
                <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #ebebeb', padding: '1.5rem', marginBottom: '1rem' }}>
                    <p style={{ margin: '0 0 1.25rem', fontSize: 12, fontWeight: 700, color: '#888', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Personal information</p>
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                            {/* Full Name */}
                            <Field label="Full Name" icon={<FiUser size={15} />}>
                                <input
                                    ref={e => fileInputRef.current.fullName = e}
                                    type="text"
                                    name="fullName"
                                    defaultValue={user.fullName}
                                    placeholder="Your full name"
                                    style={inputStyle()}
                                    onFocus={e => { e.target.style.borderColor = '#111'; e.target.style.background = '#fff'; }}
                                    onBlur={e => { e.target.style.borderColor = '#ebebeb'; e.target.style.background = '#fafafa'; }}
                                />
                            </Field>

                            {/* Username & Email side by side */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <Field label="Username" icon={<span style={{ fontSize: 14, fontWeight: 600, color: '#aaa' }}>@</span>}>
                                    <input
                                        ref={e => fileInputRef.current.username = e}
                                        type="text"
                                        name="username"
                                        defaultValue={user.username}
                                        placeholder="username"
                                        style={inputStyle()}
                                        onFocus={e => { e.target.style.borderColor = '#111'; e.target.style.background = '#fff'; }}
                                        onBlur={e => { e.target.style.borderColor = '#ebebeb'; e.target.style.background = '#fafafa'; }}
                                    />
                                </Field>

                                <Field label="Email Address" icon={<FiMail size={15} />}>
                                    <input
                                        disabled
                                        type="email"
                                        defaultValue={user.email}
                                        style={inputStyle(true)}
                                    />
                                </Field>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Account Settings card */}
                <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #ebebeb', padding: '1.5rem', marginBottom: '1.5rem' }}>
                    <p style={{ margin: '0 0 1.25rem', fontSize: 12, fontWeight: 700, color: '#888', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Account settings</p>
                    <div style={{ maxWidth: 280 }}>
                        <Field label="Account Role" icon={<FiShield size={15} />}>
                            <select
                                ref={e => fileInputRef.current.role = e}
                                name="role"
                                defaultValue={user.role}
                                style={{
                                    ...inputStyle(),
                                    appearance: 'none',
                                    paddingRight: 36,
                                    cursor: 'pointer',
                                }}
                                onFocus={e => { e.target.style.borderColor = '#111'; e.target.style.background = '#fff'; }}
                                onBlur={e => { e.target.style.borderColor = '#ebebeb'; e.target.style.background = '#fafafa'; }}
                            >
                                <option value="Buyer">Buyer</option>
                                <option value="Seller">Seller</option>
                            </select>
                            <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#aaa' }}>
                                <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                            </div>
                        </Field>
                    </div>
                </div>

                {/* Action row */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                    <button
                        type="reset"
                        onClick={() => { fileInputRef.current = {}; }}
                        style={{
                            padding: '10px 20px', borderRadius: 10,
                            border: '1.5px solid #ebebeb', background: '#fff',
                            color: '#555', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                            transition: 'all 0.15s',
                        }}
                    >
                        Discard
                    </button>
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={saving}
                        style={{
                            padding: '10px 24px', borderRadius: 10,
                            border: 'none', background: saved ? '#2a7a50' : '#111',
                            color: '#fff', fontSize: 13, fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s', opacity: saving ? 0.7 : 1,
                            display: 'flex', alignItems: 'center', gap: 7,
                            minWidth: 130, justifyContent: 'center',
                        }}
                    >
                        {saving ? (
                            <>
                                <svg style={{ animation: 'spin 0.8s linear infinite' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" /></svg>
                                Saving…
                            </>
                        ) : saved ? '✓ Saved!' : 'Save changes'}
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                @media (max-width: 520px) {
                    .username-email-grid { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </div>
    );
};

export default EditProfilePage;